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
var score = 0;

var levelsData = ['assets/levels/level01.json', 'assets/levels/level02.json'];

var playState = {
    preload: loadPlayAssets,
    create: createLevel,
    update: updateLevel
};

//-----------------------------------

var hudGroup, healthBar, healthValue, healthTween, hudTime;
var remainingTime;
var levelConfig;
var platforms, ground;
var enemies = [];
var player, cursors;
var toRight = false;
var firstAids, stars;
var totalNumOfStars;
var soundDamaged, soundCollectStar, soundGetAid, soundHitEnemy, soundOutOfTime, soundLevelPassed;
var playerPlatform;
var exit;
var timerClock;
var exitingLevel;

function Enemy(spritesheet, tween, plat, right, limit) {
    this.sprite = spritesheet;
    this.flash = tween;
    this.platform = plat;
    this.faceright = right;
    this.stepLimit = limit;
    this.origX = spritesheet.x;
    this.hitsToBeKilled = jumpsToKill;
    this.isPatrolling = true;
}

function loadPlayAssets() {
    loadSprites();
    loadImages();
    loadSounds();
    loadLevel(levelToPlay);
}

function loadSprites() {
    game.load.spritesheet('collector', 'assets/imgs/dude.png', 32, 48);
    game.load.spritesheet('enemy', 'assets/imgs/enemySprite.png', 55, 53, 15);
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
}

function loadSounds() {
    game.load.audio('damaged', 'assets/snds/hurt1.wav');
    game.load.audio('collectstar', 'assets/snds/cling.wav');
    game.load.audio('getaid', 'assets/snds/wooo.wav');
    game.load.audio('hitenemy', 'assets/snds/snare.wav');
    game.load.audio('outoftime', 'assets/snds/klaxon4-dry.wav');
    game.load.audio('levelpassed', 'assets/snds/success.wav');
}

function loadLevel(level) {
    game.load.text('level', levelsData[level - 1], true);
}

function createLevel() {
    
  
    exitingLevel = false;
    // Set World bounds (same size as the image background in this case)
    game.world.setBounds(0, 0, 1100, 825);

    // Background
    var bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bgGame');
    // Smooth scrolling of the background in both X and Y axis
    bg.scrollFactorX = 0.7;
    bg.scrollFactorY = 0.7;

    // Collide with this image to exit level
    exit = game.add.sprite(game.world.width - 100, game.world.height - 64, 'exit');
    game.physics.arcade.enable(exit);
    exit.anchor.setTo(0, 1);
    exit.body.setSize(88, 58, 20, 33);

    // Create sounds
    createSounds();

    // Create groups with a pool of objects
    createAids();
    createStars();
    totalNumOfStars = 0;

    // Get level data from JSON
    levelConfig = JSON.parse(game.cache.getText('level'));

    platforms = game.add.group();

    platforms.enableBody = true;

    // Create ground and platforms (with enemies, stars and aids) according to JSON data
    // Be aware that enemies ara not in a group. Each enemy is an instance and is stored in the array enemies
    createGround();

    createPlatforms();

    // Now, set time and create the HUD
    remainingTime = secondsToGo;
    createHUD();

    // Create player. Initial position according to JSON data
    player = game.add.sprite(levelConfig.collectorStart.x, game.world.height - levelConfig.collectorStart.y,
            'collector');
    player.anchor.setTo(0.5, 0.5);
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

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    // Update elapsed time each second
    timerClock = game.time.events.loop(Phaser.Timer.SECOND, updateTime, this);
}

function createSounds() {
    soundDamaged = game.add.audio('damaged');
    soundCollectStar = game.add.audio('collectstar');
    soundGetAid = game.add.audio('getaid');
    soundHitEnemy = game.add.audio('hitenemy');
    soundOutOfTime = game.add.audio('outoftime');
    soundLevelPassed = game.add.audio('levelpassed');
}

function createAids() {
    firstAids = game.add.group();
    firstAids.enableBody = true;
    firstAids.createMultiple(MAX_AIDS, 'aid');
    firstAids.forEach(setupItem, this);
}

function createStars() {
    stars = game.add.group();
    stars.enableBody = true;
    stars.createMultiple(MAX_STARS, 'star');
    stars.forEach(setupItem, this);
}

function setupItem(item) {
    item.anchor.setTo(0.5, 0.5);
    item.body.gravity.y = BODY_GRAVITY;
}

function createGround() {
    ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2.75, 2); // 400x32 ---> 1100x64
    ground.body.immovable = true;

    for (var i = 0, max = levelConfig.ground.enemies.length; i < max; i++)
        setupEnemy(levelConfig.ground.enemies[i], ground);

    for (var i = 0, max = levelConfig.ground.aids.length; i < max; i++)
        setupAid(levelConfig.ground.aids[i], ground.y);

    for (var i = 0, max = levelConfig.ground.stars.length; i < max; i++)
        setupStar(levelConfig.ground.stars[i], ground.y);
}

function createPlatforms() {
    levelConfig.platformData.forEach(createPlatform, this);
}

function createPlatform(element) {
    var ledge = platforms.create(element.x, game.world.height - element.y, 'ground');
    ledge.body.immovable = true;

    for (var i = 0, max = element.enemies.length; i < max; i++)
        setupEnemy(element.enemies[i], ledge);

    for (var i = 0, max = element.aids.length; i < max; i++)
        setupAid(element.aids[i], ledge.y);

    for (var i = 0, max = element.stars.length; i < max; i++)
        setupStar(element.stars[i], ledge.y);
}

function setupEnemy(enemy, plat) {
    var isRight;
    var limit;

    var theEnemy = game.add.sprite(enemy.x,  ENEMY_Y_OFFSET , 'enemy');
    theEnemy.anchor.setTo(0.5, 0.5);
    if (enemy.right === 0) {
        theEnemy.scale.x = -1;
        isRight = false;
        limit = Math.max(Math.max(0, plat.x) + ENEMY_X_OFFSET, enemy.x - ENEMY_STEP_LIMIT);
    } else {
        isRight = true;
        limit = Math.min(Math.min(plat.x + plat.width, game.world.width) - ENEMY_X_OFFSET,
                enemy.x + ENEMY_STEP_LIMIT);
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

function setupStar(star, floorY) {
    var item = stars.getFirstExists(false);
    if (item) {
        item.reset(star.x, floorY - AID_STAR_Y_OFFSET);
        totalNumOfStars += 1;
    }
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
    var dist;
    //  Collide the player with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms, playerInPlatform, null, this);

    // Collide stars and first-aid with platforms
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(firstAids, platforms);

    // Check if player overlaps with any of the stars or first aids
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, firstAids, getFirstAid, null, this);

    // Test collisions with enemies
    for (var i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].platform === playerPlatform) {
            dist = Phaser.Math.distance(enemies[i].sprite.body.x, enemies[i].sprite.body.y,
                    player.body.x, player.body.y);
            if (Math.round(dist) <= ENEMY_DISTANCE_ATTACK)
                enemies[i].isPatrolling = false;
            else
                enemies[i].isPatrolling = true;
        } else
            enemies[i].isPatrolling = true;

        if (enemies[i].isPatrolling)
            patrol(enemies[i]);
        else
            attack(enemies[i], player);

        if (game.physics.arcade.collide(player, enemies[i].sprite))
            playerVsEnemy(player, enemies[i].sprite, enemies[i], i);
    }

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -PLAYER_VELOCITY;
        player.animations.play('left');
        toRight = false;
    } else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = PLAYER_VELOCITY;
        player.animations.play('right');
        toRight = true;
    } else {
        //  Stand still
        stopPlayer();
    }

    // Allow the player to jump if touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -PLAYER_VELOCITY * 2;
        playerPlatform = undefined;
    }

    // Check if player exits level and the game is over
    if (!exitingLevel)
        game.physics.arcade.overlap(player, exit, endLevel, null, this);
}

function playerInPlatform(player, platform) {
    if (player.body.touching.down)
        playerPlatform = platform;
}

function collectStar(player, star) {
    soundCollectStar.play();
    star.kill();
    score=score+10;
    scoreText.setText("Score: "+score);
    totalNumOfStars -= 1;
}

function getFirstAid(player, aid) {
    soundGetAid.play();
    aid.kill();
    healthValue = Math.min(MAX_HEALTH, healthValue + healthAid);
    updateHealthBar();
}

function patrol(enemyObject) {
    enemyObject.sprite.body.velocity.x = ENEMY_VELOCITY * enemyObject.sprite.scale.x;
    enemyObject.sprite.animations.play('run');

    if (enemyObject.faceright) {
        if (enemyObject.sprite.body.x >= enemyObject.stepLimit) {
            enemyObject.sprite.body.x = enemyObject.stepLimit - ENEMY_X_OFFSET;
            enemyObject.sprite.scale.x *= -1;
        } else if (enemyObject.sprite.body.x <= enemyObject.origX) {
            enemyObject.sprite.body.x = enemyObject.origX + ENEMY_X_OFFSET;
            enemyObject.sprite.scale.x *= -1;
        }
    } else {
        if (enemyObject.sprite.body.x <= enemyObject.stepLimit) {
            enemyObject.sprite.body.x = enemyObject.stepLimit + ENEMY_X_OFFSET;
            enemyObject.sprite.scale.x *= -1;
        } else if (enemyObject.sprite.body.x >= enemyObject.origX) {
            enemyObject.sprite.body.x = enemyObject.origX - ENEMY_X_OFFSET;
            enemyObject.sprite.scale.x *= -1;
        }
    }
}

function attack(enemyObject, thePlayer) {
    var endOfPlatform;
    var playerAtRight;

    // Enemy must face the player to attack
    if (enemyObject.sprite.body.x < thePlayer.body.x) {
        enemyObject.sprite.scale.x = 1;
        playerAtRight = true;
    } else {
        enemyObject.sprite.scale.x = -1;
        playerAtRight = false;
    }

    // Play attack animation and change velocity
    enemyObject.sprite.body.velocity.x = Math.trunc(ENEMY_VELOCITY * 1.4) * enemyObject.sprite.scale.x;
    enemyObject.sprite.animations.play('swing');

    // Set the right limits for the enemy's movement (attack and patrolling)
    if (enemyObject.faceright) {
        if (playerAtRight && thePlayer.body.x > enemyObject.stepLimit) {
            endOfPlatform = enemyObject.platform.x + enemyObject.platform.width;
            enemyObject.stepLimit = Math.min(Math.min(endOfPlatform, game.world.width), thePlayer.body.x)
                    - ENEMY_X_OFFSET;
        }
        if (!playerAtRight && thePlayer.body.x < enemyObject.origX) {
            enemyObject.origX = Math.max(Math.max(0, enemyObject.platform.x), thePlayer.body.x)
                    + ENEMY_X_OFFSET;
        }
    } else {
        if (playerAtRight && thePlayer.body.x > enemyObject.origX) {
            endOfPlatform = enemyObject.platform.x + enemyObject.platform.width;
            enemyObject.origX = Math.min(Math.min(endOfPlatform, game.world.width), thePlayer.body.x)
                    - ENEMY_X_OFFSET;
        }
        if (!playerAtRight && thePlayer.body.x < enemyObject.stepLimit) {
            enemyObject.stepLimit = Math.max(Math.max(0, enemyObject.platform.x), thePlayer.body.x)
                    + ENEMY_X_OFFSET;
        }
    }

    // Check that the enemy is not out of bounds. If out of bounds set velocity to 0
    if (enemyObject.faceright && (enemyObject.sprite.body.x >= enemyObject.stepLimit ||
            enemyObject.sprite.body.x <= enemyObject.origX))
        enemyObject.sprite.body.velocity.x = 0;
    if (!enemyObject.faceright && (enemyObject.sprite.body.x >= enemyObject.origX ||
            enemyObject.sprite.body.x <= enemyObject.stepLimit))
        enemyObject.sprite.body.velocity.x = 0;
}

function playerVsEnemy(player, enemySprite, enemyObject, position) {
    if (enemySprite.body.touching.up) {
        soundHitEnemy.play();
        if (!enemyObject.flash.isRunning)
            enemyObject.flash.start();
        if (toRight)
            player.body.x += PLAYER_COLLIDE_OFFSET_X;
        else
            player.body.x -= PLAYER_COLLIDE_OFFSET_X;
        enemyObject.hitsToBeKilled -= 1;
        if (enemyObject.hitsToBeKilled <= 0) {
            enemySprite.destroy();
            enemies.splice(position, 1);
        }
    } else {
        soundDamaged.play();
        healthValue = Math.max(0, healthValue - damage);
        updateHealthBar();
        if (toRight)
            player.body.x -= PLAYER_COLLIDE_OFFSET_X;
        else
            player.body.x += PLAYER_COLLIDE_OFFSET_X;
        if (healthValue === 0)
            resetPlayer();
    }
    player.body.y -= PLAYER_COLLIDE_OFFSET_Y;
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

function endLevel() {
    if (totalNumOfStars === 0) {
        exitingLevel = true;
        resetInput();
        soundLevelPassed.play();
        stopPlayer();
        game.time.events.remove(timerClock);
        game.time.events.add(4000, nextLevel, this);
    }
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
    stars.removeAll(true);
}

function goToWelcome() {
    game.world.setBounds(0, 0, game.width, game.height);
    game.state.start('welcome');
}
