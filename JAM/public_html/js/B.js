/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var MAX_HEALTH = 100;
var MAX_STARS = 40;
var MAX_AIDS = 30;
var BODY_GRAVITY = 250;
var PLAYER_VELOCITY = 150;
var ENEMY_VELOCITY = 75;
var ENEMY_STEP_LIMIT = 300;
var ENEMY_DISTANCE_ATTACK = 150;
var ENEMY_Y_OFFSET = 27;
var ENEMY_X_OFFSET = 28;
var AID_STAR_Y_OFFSET = 30;
var PLAYER_COLLIDE_OFFSET_X = 35;
var PLAYER_COLLIDE_OFFSET_Y = 10;
var shots;
var keySpace;
var levelsData = ['assets/levels/level01.json', 'assets/levels/level02.json'];

var playStateB = {
    preload: loadPlayAssets,
    create: createLevel,
    update: updateLevel
};

//-----------------------------------
var NUM_ENEMIES = 8;                    // Numero de enemigos que varia con la dificutal
var NODES_PER_BRANCH = 5;               // Nodos en los que se puede diverger hacia otra rama.
var BRANCH_CHANCE = 0.3;             // Probabilidad de que un nodo sea una rama divergente. Esto debe variar con la dificultad. PARTE B
var NUM_ENEMIES_POOL = 16;              // Enemies in the pool
var NUM_SHOTS_POOL = 20;                // Bullets in the pool
var NUM_LIFEITEM_POOL = 16;             // Life items in the pool
var CHANCE_TO_CREATE_ENEMY = 0.4;       // Probabilidad para crear un enemigo  
var CHANCE_TO_CREATE_LIFE_ITEM = 0.6;   // Probabilidad para crear un objeto de vida.
var TIME_CREATE_ENEMIES = 1500;         // Cada cuánto se van a crear los enemigos (ms) 
var TIME_MOVE_ENEMIES = 1500;           // Cada cuánto tiempo se van a mover los enemigos.
var SECTION_WIDTH;                      // El desplazamiento que hace el jugador cuando se mueve
var POINTS_PER_KILL = 10;               // Cuántos puntos da matar a un enemigo
var branches = [];                      // Ramas por las que nos vamos a desplazar
var BRANCH_COLOR = 0xa3682d;            // Color de la rama
var BRANCH_LINE_WIDTH = 5;              // Grosor de la línea de la rama
var LIFE_CHANCE = 0.7;                  // Probabilidad de que un enemigo suelte vida al matarlo.
var TIME_TO_DESTROY = 1000;             // Tiempo que pasará para que se destruya un item.
var BRANCH_MARGIN_TOP = 64;             // Margen desde el que se van a dibujar las líneas
var SCORE_TO_NEXT_LEVEL = 40;
var XOFFSET = 15;
var PLAYER_HALF_WIDTH = 40;
var nodes = [];
var lives_on_stage = [];
var enemyPool;
var lifeItemPool;
var hudGroup, healthBar, healthValue, healthTween, hudTime;
var remainingTime;
var levelConfig;
var platforms, ground;
var enemies = [];
var enemies_on_stage = [];
var player, cursors;
var toRight = false;
var firstAids, stars;
var totalNumOfStars;
var soundDamaged, soundCollectStar, soundGetAid, soundHitEnemy, soundOutOfTime, soundLevelPassed;
var playerPlatform;
var exit;
var timerClock;
var exitingLevel;

// Mapa de nodos conectados
// Para que funcione los nodos deben estar ordenados por nodo de inicio.
var linkedNodes = {
    3: [[1, 7], [12, 8]],
    4: [[1, 7], [11, 17], [12, 8]],
    5: [[1, 7], [11, 17], [12, 8], [17, 13], [23, 19]],
    6: [[1, 7], [11, 17], [12, 8], [17, 13], [21, 27], [23, 19]],
    7: [[1, 7], [11, 17], [12, 8], [17, 13], [21, 27], [23, 19], [32, 28]],
    8: [[1, 7], [11, 17], [12, 8], [17, 13], [21, 27], [23, 19], [32, 28], [36, 32]]
};

/*
 * Función que nos permite generar el nodo de una rama.
 * @param {Number} id id del nodo de la rama
 * @param {Number} posx posición x donde va a estar el nodo
 * @param {Number} posy posición y donde va a estar el nodo
 * @param {null | Number} idNextNode id del siguiente nodo. Puede ser null
 * @param {BranchNode} siguiente nodo; 
 * @param {Boolean} indica si está en uso por un enemigo o no.
 * @param {Boolean} isBranch dice si diverge hacia otra rama o no
 */

function BranchNode(id, posx, posy, idNextNode,idNodeBranch, isBranch, isUsed){
    this.id = id;
    this.posx = posx;
    this.posy = posy;
    this.idNextNode = idNextNode;
    this.idNodeBranch = idNodeBranch;
    this.isBranch = isBranch;
    
    this.isUsed = isUsed;
}

function Enemy(spritesheet, tween, plat, right, limit, nHits, idNode) {
    this.sprite = spritesheet;
    this.flash = tween;
    this.platform = plat;
    this.faceright = right;
    this.stepLimit = limit;
    this.origX = spritesheet.x;
    this.hitsToBeKilled = nHits;
    this.isPatrolling = true;
    this.idNode = idNode;
}

function LifeItem(sprite, idNode, isColliding = false){
    this.sprite = sprite;
    this.idNode = idNode;
    this.isColliding = isColliding;
}

// Esta función crea los nodos por los que se van a mover los enemigos. 
function createNodes(){
    nodes = [];
    // Altura desde arriba del todo hasta el suelo.
    var heightToBottom = game.world.height - 64;
    // Ancho de cada sección que ocupa una rama.
    var sectionWidth = ( game.world.width - PLAYER_COLLIDE_OFFSET_X ) / branchesTotal;
    var id, posx, posy, isBranch, idNextNode, idNodeBranch, isUsed;
    // Con este índice vamos a comprobar en qué posición del array de linkedNodes nos encontramos.
    // De esa forma nos ahorramos el tener que recorrer todo el array para cada nodo.
    var index_check_if_branch = 0;
    // Si dividimos la altura del nivel en tantas partes como nodos por
    // rama hay, tenemos las posiciones en el eje Y de cada nodo.
    for (var i = 0; i < branchesTotal; i++){
        for(var j = 0; j < NODES_PER_BRANCH; j++){
            
            id = i * NODES_PER_BRANCH + j;
            // Dividimos el ancho entre tantas partes como ramas tengamos.
            // Cada parte la dividimos, a su vez, en tantas partes
            // como nodos haya en cada rama. De esa forma obtenemos las
            // posiciones en X.
            posx = i * sectionWidth + j * sectionWidth / NODES_PER_BRANCH;
            posy = heightToBottom * j / NODES_PER_BRANCH;
            if( nivel === 'B'){
                if( id === linkedNodes[branchesTotal][index_check_if_branch][0]){
                    isBranch = true;
                    idNodeBranch = linkedNodes[branchesTotal][index_check_if_branch][1];
                    if( index_check_if_branch < linkedNodes[branchesTotal].length - 1){
                        index_check_if_branch += 1;
                    }

                }else{
                    idNodeBranch = null;
                    isBranch = false;
                }
            }else{
                isBranch = false;
            }

            idNextNode = j < NODES_PER_BRANCH ? id + 1 : null;
            isUsed = false;
            var myNode = new BranchNode(id, posx, posy, idNextNode, idNodeBranch, isBranch, isUsed);
            //var myNode = new BranchNode(id, posx, posy, idNextNode, isBranch, isUsed);
            nodes.push(myNode);
        }
    }
    console.log("nodes", nodes);
}

/**
 * Esta función mueve al enemigo
 * 
 */


function moveEnemies(){
    if(enemies_on_stage.length >= 1){
        for(var i = 0; i < enemies_on_stage.length; i++){
            moveToNode(enemies_on_stage[i], enemies_on_stage[i].idNode + 1);
        }
            enemies_on_stage.forEach(function(enemy){
            var enemyNode = nodes[enemy.idNode];
            if( enemyNode.isBranch ){
                var nextNode = enemyNode.idNodeBranch;
                // Comprobamos si el siguiente nodo está en uso y, si no lo está,
                // nos desplazamos a él.
                if(!nextNode.isUsed){
                    var nextNode = nodes[enemy.idNode].idNodeBranch;
                    moveToNode(enemy, nextNode);
                }
                else{ // El nodo está ocupado.
                    // Nos movemos al siguiente nodo en la rama
                    var next = enemy.idNode + 1;
                    moveToNode(enemy, next);
                }
            }
        });
        
    }
}

function moveLife(){
    if(lives_on_stage.length >= 1){
        for(var i = 0; i < lives_on_stage.length; i++){
            moveLifeToNode(lives_on_stage[i], lives_on_stage[i].idNode + 1, i);
        }
    }
}

// Esta función mueve los sprites al siguiente nodo y actualizan los valores de los nodos
function moveToNode(enemy, node){
    if(node % NODES_PER_BRANCH !== 0){
        enemy.position.x = nodes[node].posx;
        enemy.position.y = nodes[node].posy;
        // El nodo deja de estar en uso puesto que nos hemos movido a otro
        nodes[enemy.idNode].isUsed = false;
        // Cambiamos la idNodo ya que nos estamos moviendo al siguiente
        enemy.idNode = node;
        // Activamos el nodo siguiente, ya que nos hemos movido a él.
        nodes[node].isUsed = true;
    }else{
        nodes[enemy.idNode].isUsed = false;
        healthValue-=20;
        if(healthValue <= 0){
            endGame();
        }
        updateHealthBar();
        resetMember(enemy);
        var enemyIndex = enemies_on_stage.findIndex(function(e){
            return e.alive === false;
        });
        enemies_on_stage.splice(enemyIndex, 1);
        
    }
}

function moveLifeToNode(lifeItem, node, lifeIndex){
    if(node % NODES_PER_BRANCH !== 0){
        lifeItem.position.x = nodes[node].posx;
        lifeItem.position.y = nodes[node].posy;
        // El nodo deja de estar en uso puesto que nos hemos movido a otro
        nodes[lifeItem.idNode].isUsed = false;
        // Cambiamos la idNodo ya que nos estamos moviendo al siguiente
        lifeItem.idNode = node;
        // Activamos el nodo siguiente, ya que nos hemos movido a él.
        nodes[node].isUsed = true;
    }else{
        nodes[lifeItem.idNode].isUsed = false;
        lifeItem.position.y = game.world.height - 30;
        lifeItem.position.x += PLAYER_HALF_WIDTH;
        game.time.events.add(TIME_TO_DESTROY, function (item){
           item.kill();
           lives_on_stage.splice(lifeIndex, 1);
        }, this, lifeItem);
        
    }
}

/**
 * Esta función coloca enemigos al inicio de la rama 
 * @param {Object} item objeto que colocar
 */
function placeItemAtBranch(item){
    // Buscamos un número aleatorio que corresponderá con la rama en la que queramos meter al enemigo.
    var branch = Math.floor(Math.random() * branchesTotal);
    // Necesitamos saber la id del nodo en el que vamos a meter al personaje.
    var idNodo = branch * NODES_PER_BRANCH;
    // Metemos en caché el array de nodos para no tener que llamarlo en cada asignación
    var myNode = nodes[idNodo];
    item.reset(myNode.posx, myNode.posy);
    // Si el nodo no está en uso, colocamos al enemigo ahí.
    if( !myNode.isUsed ){
        /*
        enemy.sprite = game.add.sprite(myNode.posx, myNode.posy, 'enemy');
        enemy.body.sprite.body.x = myNode.posx + ENEMY_X_OFFSET;
        enemy.body.sprite.body.y = myNode.posy + ENEMY_Y_OFFSET;
        */
        item.idNode = idNodo;
        myNode.isUsed = true;
    }
}

/**
 * Esta función va a dibujar las líneas de las ramas por las que van a bajar las abejas.
 * Definimos los graphics, que nos van a permitir dibujar lo que queramos.
 * Definimos el ancho de línea y el color de la misma.
 * MoveTo y LineTo es un sistema que mueve el punto desde el que se va a empezar
 * a dibujar y hasta dónde se va a dibujar.
 * endFill sirve para que no se dibuje una línea al pasar de abajo del todo arriba.
 */
function drawBranches(){
    var graphics = game.add.graphics(0,0);
    graphics.lineStyle(BRANCH_LINE_WIDTH, BRANCH_COLOR, 1);
    XOFFSET = getXOffset();
    for(var i = 0; i < branchesTotal; i++){
        graphics.moveTo(i * SECTION_WIDTH + XOFFSET, BRANCH_MARGIN_TOP);//moving position of graphic if you draw mulitple lines
        graphics.lineTo((i+1)*SECTION_WIDTH - 1, game.world.height - 64);
        graphics.endFill();
    }
    //Dibujamos las ramas que se cruzan
    if(nivel === 'B'){
        drawIntermediateBranches();
    }   
}

function getXOffset(){

    // Obtenemos el ángulo formado entre el primer nodo y el punto del suelo donde va a llegar
    var angle = Math.atan(SECTION_WIDTH / (game.world.height - 64) )
    return Math.tan(angle) * BRANCH_MARGIN_TOP; 
    
}

function drawIntermediateBranches(){
    var graphics = game.add.graphics(0,0);
    graphics.lineStyle(BRANCH_LINE_WIDTH, BRANCH_COLOR, 1);
    for( var j = 0; j < linkedNodes[branchesTotal].length; j++){
        graphics.moveTo(nodes[linkedNodes[branchesTotal][j][0]].posx, nodes[linkedNodes[branchesTotal][j][0]].posy);
        graphics.lineTo(nodes[linkedNodes[branchesTotal][j][1]].posx, nodes[linkedNodes[branchesTotal][j][1]].posy);
        graphics.endFill();
    }
}

function loadPlayAssets() {
    loadSprites();
    loadImages();
    loadSounds();
    loadLevel(levelToPlay);
}

function loadSprites() {
    game.load.spritesheet('collector', 'assets/imgs/female.png', 80, 110, 24);
    game.load.spritesheet('enemy', 'assets/imgs/abeja.png', 100, 98, 2);
}

function loadImages() {
    game.load.image('bgGame', 'assets/imgs/bgPlay.jpg');
    game.load.image('exit', 'assets/imgs/exit.png');
    game.load.image('ground', 'assets/imgs/platform.png');
    game.load.image('star', 'assets/imgs/star.png');
    game.load.image('aid', 'assets/imgs/firstaid.png');
    game.load.image('healthHolder', 'assets/imgs/health_holder.png');
    game.load.image('healthBar', 'assets/imgs/health_bar.png');
    game.load.image('heart', 'assets/imgs/heart.png');
    game.load.image('shots', 'assets/imgs/shot.png');
    game.load.image('mielgrande', 'assets/imgs/miel_grande.png');

}

function loadSounds() {
    game.load.audio('damaged', 'assets/snds/hurt1.wav');
    game.load.audio('collectstar', 'assets/snds/cling.wav');
    game.load.audio('getaid', 'assets/snds/wooo.wav');
    game.load.audio('hitenemy', 'assets/snds/snare.wav');
    game.load.audio('outoftime', 'assets/snds/klaxon4-dry.wav');
    game.load.audio('levelpassed', 'assets/snds/success.wav');
    game.load.audio('shooting', 'assets/snds/shots.wav')
}

function loadLevel(level) {
    game.load.text('level', levelsData[level - 1], true);
}

function createLevel() {

    SECTION_WIDTH = (game.world.width - PLAYER_HALF_WIDTH) / branchesTotal;
    exitingLevel = false;
    // Set World bounds (same size as the image background in this case)
    game.world.setBounds(0, 0, 800, 600);

    // Background
    var bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bgGame');
    
    // Smooth scrolling of the background in both X and Y axis
    bg.scrollFactorX = 0.7;
    bg.scrollFactorY = 0.7;
    
    

    // Collide with this image to exit level
    /*
    exit = game.add.sprite(game.world.width - 100, game.world.height - 64, 'exit');
    game.physics.arcade.enable(exit);
    exit.anchor.setTo(0, 1);
    exit.body.setSize(88, 58, 20, 33);
    */

    // Create sounds
    createSounds();
    // Create nodes

    createNodes();
    // Create groups with a pool of objects
    
    createAids();
    createShots();


    // Get level data from JSON
    levelConfig = JSON.parse(game.cache.getText('level'));

    platforms = game.add.group();

    platforms.enableBody = true;

    // Create ground and platforms (with enemies, stars and aids) according to JSON data
    // Be aware that enemies ara not in a group. Each enemy is an instance and is stored in the array enemies
    createGround();

   // createPlatforms();
    

    // Now, set time and create the HUD
    remainingTime = secondsToGo;
    createHUD();
    
    // Create player. Initial position according to JSON data
    // El jugador se va a pover del final de una rama al final de la siguiente.
    
    // Ramas por donde van a bajar los enemigos.
    drawBranches();
    createPlayer();



    //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
        keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // Update elapsed time each second
    createLifeItemPool(NUM_LIFEITEM_POOL);
    createEnemyPool(NUM_ENEMIES_POOL);
    createBulletPool(NUM_SHOTS_POOL);
    
    
    //game.time.events.loop(TIME_MOVE_ENEMIES, moveEnemies(), this);
    timerClock = game.time.events.loop(Phaser.Timer.SECOND, updateTime, this);
}

function createPlayer(){
    player = game.add.sprite(SECTION_WIDTH, game.world.height - levelConfig.collectorStart.y,
            'collector');
    player.anchor.setTo(0.5, 0.5);
    player.key = "Player";
    game.physics.arcade.enable(player);
    
     

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = BODY_GRAVITY;
    player.body.collideWorldBounds = true;
    

    // Camera follows the player inside the world
    game.camera.follow(player);
    
    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
}

function createSounds() {
    soundDamaged = game.add.audio('damaged');
    soundCollectStar = game.add.audio('collectstar');
    soundGetAid = game.add.audio('getaid');
    soundHitEnemy = game.add.audio('hitenemy');
    soundOutOfTime = game.add.audio('outoftime');
    soundLevelPassed = game.add.audio('levelpassed');
}

function createShots(){
    shots = game.add.group();
    shots.enableBody = true;
    shots.createMultiple(20, 'shots');
    shots.callAll('events.onOutOfBounds.add','events.onOutOfBounds', shotKill);
    shots.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    shots.setAll('checkWorldBounds', true);
};

function shotKill(item){
    item.kill();
}

function createBulletPool(number_of_bullets) {
    bulletPool = game.add.group();
    bulletPool.enableBody = true;
    bulletPool.createMultiple(number_of_bullets, 'shot');
    bulletPool.callAll('events.onOutOfBounds.add','events.onOutOfBounds', resetMember);
    bulletPool.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    bulletPool.setAll('checkWorldBounds', true);
};

function  createEnemyPool(number_of_enemies) {
    enemyPool = game.add.group();
    enemyPool.enableBody = true;
    enemyPool.createMultiple(number_of_enemies, 'enemy');
    enemyPool.forEach(setupPool, this);
    enemyPool.setAll('checkWorldBounds', true);
    game.time.events.loop(TIME_CREATE_ENEMIES, createEnemy, this);
    game.time.events.loop(TIME_MOVE_ENEMIES, moveEnemies, this);
};

function createLifeItemPool(number_of_lives){
    lifeItemPool = game.add.group();
    lifeItemPool.enableBody = true;
    lifeItemPool.createMultiple(number_of_lives, 'mielgrande');
    lifeItemPool.forEach(setupPool, this);
    //game.time.events.loop(TIME_CREATE_ENEMIES, createLifeItem, this);
    game.time.events.loop(TIME_MOVE_ENEMIES, moveLife, this);
}

function setupPool(enemy){
    enemy.anchor.x = 0.5;
    enemy.anchor.y = 0.5;
}

function resetMember(item){
    item.kill();
}

function createLifeItem(){
    if(Math.random() > CHANCE_TO_CREATE_ENEMY){
        var item = lifeItemPool.getFirstExists(false);
        if(item){
            game.physics.arcade.enable(item);
            placeItemAtBranch(item);
            lives_on_stage.push(item);
        }
    }
}

function createEnemy(){
    if(Math.random() > CHANCE_TO_CREATE_ENEMY){
        var enemy = enemyPool.getFirstExists(false);
         if(enemy){
            game.physics.arcade.enable(enemy);
            placeItemAtBranch(enemy);
            enemies_on_stage.push(enemy);
        }
    }
    
}

function createAids() {
    firstAids = game.add.group();
    firstAids.enableBody = true;
    firstAids.createMultiple(MAX_AIDS, 'aid');
    firstAids.forEach(setupItem, this);
}


function setupItem(item) {
    item.anchor.setTo(0.5, 0.5);
    item.body.gravity.y = BODY_GRAVITY;
}

function createGround() {
    ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2.75, 2); // 400x32 ---> 1100x64
    ground.body.immovable = true;
    /*
    for (var i = 0, max = NUM_ENEMIES; i < max; i++)
        setupEnemy(levelConfig.ground.enemies[0], ground,(i*(game.world.width-100))/NUM_ENEMIES);

    for (var i = 0, max = levelConfig.ground.aids.length; i < max; i++)
        setupAid(levelConfig.ground.aids[i], ground.y);

    for (var i = 0, max = levelConfig.ground.stars.length; i < max; i++)
        setupStar(levelConfig.ground.stars[i], ground.y);
    */
}
/*
function createPlatforms() {
    levelConfig.platformData.forEach(createPlatform, this);
}

function createPlatform(element) {
    var ledge = platforms.create(element.x, game.world.height - element.y, 'ground');
    ledge.body.immovable = true;
}
*/
function setupEnemy(enemy, plat, posx) {
    var isRight;
    var limit;
    
    var theEnemy = game.add.sprite(posx,  ENEMY_Y_OFFSET , 'enemy');
    theEnemy.anchor.setTo(0.5, 0.5);
    if (enemy.right === 0) {
        theEnemy.scale.x = -1;
        isRight = false;
        limit = Math.max(Math.max(0, plat.x) + ENEMY_X_OFFSET, posx - ENEMY_STEP_LIMIT);
    } else {
        isRight = true;
        limit = Math.min(Math.min(plat.x + plat.width, game.world.width) - ENEMY_X_OFFSET,
                posx + ENEMY_STEP_LIMIT);
    }

    var flash = game.add.tween(theEnemy).to({alpha: 0.0}, 50, Phaser.Easing.Bounce.Out)
            .to({alpha: 0.8}, 50, Phaser.Easing.Bounce.Out)
            .to({alpha: 1.0}, 50, Phaser.Easing.Circular.Out);

    game.physics.arcade.enable(theEnemy);
    theEnemy.body.immovable = true;
    theEnemy.body.collideWorldBounds = true;
    theEnemy.body.setSize(41, 43, 3, 10);

    theEnemy.animations.add('swing', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    theEnemy.animations.add('run', [8, 9, 10, 11, 12, 13, 14], 10, true);

    var newEnemy = new Enemy(theEnemy, flash, plat, isRight, limit);
    enemies.push(newEnemy);
}

function setupAid(aid, floorY) {
    var item = firstAids.getFirstExists(false);
    if (item)
        item.reset(aid.x, floorY - AID_STAR_Y_OFFSET);
}



function createHUD() {
    //puntuacion--score--no funciona-----------------------------------------------------------------------------------------------
    
    scoreText = game.add.text(650, 5, 'Score: ' + score,{fontSize: '25px', fill: '#000'});
    hudGroup = game.add.group();
    hudGroup.create(5, 5, 'heart');
    hudGroup.create(50, 5, 'healthHolder');
    healthBar = hudGroup.create(50, 5, 'healthBar');
    hudTime = game.add.text(295, 5, setRemainingTime(remainingTime), {font: 'bold 14pt Sniglet', fill: '#b60404'});
    hudGroup.add(hudTime);
    hudGroup.add(scoreText);
    hudGroup.fixedToCamera = true;
    healthValue = MAX_HEALTH;
}

function updateLevel() {
    //  Collide the player with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms, playerInPlatform, null, this);

    game.physics.arcade.overlap(shots, enemies_on_stage, destroyEnemy, null, this);
    game.physics.arcade.overlap(lives_on_stage, player, getLife, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left._justUp) {
        //  Move to the left
        // player.body.x = player.body.x - ((game.world.width)/NUM_ENEMIES);
        player.body.x = player.body.x > SECTION_WIDTH
                ? player.body.x - SECTION_WIDTH
                : player.body.x;
        //player.body.velocity.x = -PLAYER_VELOCITY;
        player.animations.play('left');
        toRight = false;
        cursors.left._justUp=false;
    } else if (cursors.right._justUp) {
        //  Move to the right
        //player.body.x = player.body.x + ((game.world.width)/NUM_ENEMIES);
        player.body.x = player.body.x < game.world.width
                ? player.body.x + SECTION_WIDTH
                : player.body.x;
        //player.body.velocity.x = PLAYER_VELOCITY;
        player.animations.play('right');
        toRight = true;
        cursors.right._justUp=false;
    } else {
        //  Stand still
        stopPlayer();
    }
    manageShots();
}

function getLife(lifeItem, playerItem){
    if(lifeItem.key === "mielgrande"){
        lifeItem.kill();
    }
    healthValue = Math.min(healthValue + healthAid, MAX_HEALTH);
    updateHealthBar();
}

function destroyEnemy(shot, enemy){
    shot.kill();
    enemy.kill();
    var enemyIndex = enemies_on_stage.findIndex(function(e){
        return e.alive === false;
    });
    nodes[enemies_on_stage[enemyIndex].idNode].isUsed = false;
    enemies_on_stage.splice(enemyIndex, 1);
    if( Math.random() < CHANCE_TO_CREATE_LIFE_ITEM ){
        createLifeItem();
    }
    /*
     * Aquí hay que meter el blast al destruir al enemigo y el sonido.
     */
    score=score + POINTS_PER_KILL;
    scoreText.setText("Score: "+score);
    if(score >= SCORE_TO_NEXT_LEVEL && nivel !== 'B'){
        getToLevelB();
    }
    
}

function getToLevelB(){
    nivel = 'B';
    createNodes();
    drawIntermediateBranches();
}

function manageShots(){
    if (keySpace.justDown)fireShot(); 
}

function fireShot(){
    var x = player.x;
    var y = player.y - 10;
    // El ángulo de disparo debe variar en funcion del número de ramas de que disponemos
    // Ya que a mayor número de ramas, mayor ángulo de disparo.
    var vy = - player.y / bulletSpeed;
    var vx = - SECTION_WIDTH / bulletSpeed;
    // var vy = -300;
    // var vx = -100;
    shoot(x,y,vy,vx);
}

function shoot(x,y,vy,vx) {
    var shot = shots.getFirstExists(false);
    if (shot) {
        shot.reset(x, y);
        shot.body.velocity.x = vx;
        shot.body.velocity.y = vy;
    }
    return shot;
};

function playerInPlatform(player, platform) {
    if (player.body.touching.down)
        playerPlatform = platform;
}


function getFirstAid(player, aid) {
    soundGetAid.play();
    aid.kill();
    healthValue = Math.min(MAX_HEALTH, healthValue + healthAid);
    updateHealthBar();
}

function updateHealthBar() {
    if (healthTween)
        healthTween.stop();
    healthTween = game.add.tween(healthBar.scale);
    healthTween.to({x: healthValue / MAX_HEALTH}, 300);
    healthTween.start();
}

function resetPlayer() {
    stopPlayer();
    player.x = levelConfig.collectorStart.x;
    player.y = game.world.height - levelConfig.collectorStart.y;
    remainingTime = Math.max(0, remainingTime - playerDeathTimePenalty);
    healthValue = MAX_HEALTH;
    updateHealthBar();
}

function setRemainingTime(seconds) {
    return pad(Math.trunc(seconds / 60), 2) + ":" + pad(seconds % 60, 2);
}

function pad(n, width, z) {
    z = z || "0";
    var s = n.toString();
    return s.length >= width ? s : new Array(width - s.length + 1).join(z) + s;
}

function updateTime() {
    remainingTime = Math.max(0, remainingTime - 1);
    hudTime.setText(setRemainingTime(remainingTime));
    if (remainingTime === 0) {
        resetInput();
        soundOutOfTime.play();
        stopPlayer();
        game.time.events.remove(timerClock);
        game.time.events.add(2500, endGame, this);
    }
}

function stopPlayer() {
    player.animations.stop();
    player.frame = 4;
}

function resetInput() {
    game.input.enabled = false;
    cursors.left.reset(true);
    cursors.right.reset(true);
    cursors.up.reset(true);
    cursors.down.reset(true);
}



function endGame() {
    clearLevel();
    goToWelcome();
}

function nextLevel() {
    clearLevel();
    levelToPlay += 1;
    if (levelToPlay > levelsData.length)
        goToWelcome();
    else {
        game.input.enabled = true;
        game.state.start('play');
    }
}

function clearLevel() {
    for (var i = 0, max = enemies.length; i < max; i++) {
        enemies[i].sprite.destroy();
    }
    enemies = [];
    hudGroup.removeAll(true);
    platforms.removeAll(true);
    player.destroy();
    firstAids.removeAll(true);
}


function goToWelcome() {
    game.world.setBounds(0, 0, game.width, game.height);
    game.state.start('welcome');
 }
