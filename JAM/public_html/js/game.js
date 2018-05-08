/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
var numStars = 12;
var score = 0;
var mainState = {preload: loadAssets,
create: initialiseGame,
update: gameUpdate};
var platforms;

game.state.add('main', mainState);
game.state.add('final', finalState);
game.state.add('start', startState);
game.state.add('settings', settingsState);
game.state.start('start');

//font
WebFontConfig = {
google: { families: ["Nosifer"] }
};
(function() {
var wf = document.createElement('script');
wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
wf.type = 'text/javascript';
wf.async = 'true';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wf, s);
})();

function loadAssets() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function initialiseGame() {

    game.add.sprite(0, 0, 'sky');
    platforms = game.add.group();
    
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, 'ground');
    
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2); 

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    
    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    stars = game.add.group();
    
    stars.enableBody = true;

    for (var i = 0; i < numStars; i++) {
        var star = stars.create(i * 70, 0, 'star');
        //  Let gravity do its thing
        star.body.gravity.y = 300;
        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;

    }
    scoreText = game.add.text(16, 16, 'Score: ' + score,{fontSize: '32px', fill: '#000'});
    cursors = game.input.keyboard.createCursorKeys();


}
function gameUpdate() {
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    // Checks to see if the player overlaps with any of the stars, if she
    // does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        // Move to the left
        
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        // Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        // Stand still
        player.animations.stop();
        player.frame = 4;
    }
    
    // Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -350;
    }

    endGame();
}
function collectStar(player, star) {
    // Removes the star from the screen
    star.kill(); // star.destroy() instead frees memory also!
    numStars--;
    // Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
}
function endGame() {
    if (numStars == 0)
    game.state.start('final');
}

