/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var DEFAULT_DAMAGE = 10;
var DEFAULT_HEALTH = 10;
var DEFAULT_TIME = 480;
var DEFAULT_JUMPS_TO_KILL = 2;
var DEFAULT_PLAYER_DEATH_TIME_PENALTY = 15;

var damage = DEFAULT_DAMAGE;
var healthAid = DEFAULT_HEALTH;
var secondsToGo = DEFAULT_TIME;
var jumpsToKill = DEFAULT_JUMPS_TO_KILL;
var playerDeathTimePenalty = DEFAULT_PLAYER_DEATH_TIME_PENALTY;

var initialState = {
    preload: loadAssets,
    create: displayScreen
};

var mainTween, downTween1, downTween2;
var btnAbout, btnConfig, btnPlay;
var levelToPlay;

function loadAssets() {
    //game.load.image('bg', 'assets/imgs/bgLayer.jpg');
    game.load.image('aboutButton', 'assets/imgs/aboutButton.png');
    game.load.image('configButton', 'assets/imgs/configButton.png');
    game.load.image('playButton', 'assets/imgs/playButton.png');
    game.load.spritesheet('hero', 'assets/imgs/dude.png', 32, 48);
    
    game.load.image('start', 'assets/start.png', 30, 30);
    game.load.image('settings', 'assets/settings.png', 30, 30);
    

}

function displayScreen() {
    levelToPlay = 1;
    game.input.enabled = true;
    game.stage.backgroundColor = "#823f09";
    titleText = game.add.text(0, 100,
    "Honey Collector",
    {fontSize: '40px', fill: '#FA9503', boundsAlignH: "center", font: "Nosifer"});
    titleText.inputEnabled = false;
    titleText.setTextBounds(0, 5, 800, 100);
    
    /*names = game.add.text(40, 550,
    "Juárez Lifante, Aitana      Moreno Córcoles, Jesús      Saborit Ribelles, María",
    {fontSize: '20px', fill: '#FA9503', boundsAlignH: "left", boundsAlignV:"bottom"});
    names.inputEnabled = false;
    
    groupName = game.add.text(400, 520,
    "JAM",
    {fontSize: '25px', fill: '#FA9503', boundsAlignH: "center", boundsAlignV:"bottom", font:"Nosifer"});
    groupName.inputEnabled = false;*/
    /*
    hero1 = game.add.sprite(game.world.width / 4, game.world.height - 200, 'hero', 4);
    hero1.anchor.setTo(0.5, 0.5);
    hero2 = game.add.sprite(game.world.width / 2.5, game.world.height - 200, 'hero', 4);
    hero2.anchor.setTo(0.5, 0.5);
    hero3 = game.add.sprite(25, game.world.height / 2 - 32, 'hero', 4);
    hero3.anchor.setTo(0.5, 0.5);

    mainTween = game.add.tween(hero3).to({y: 32}, 2000, Phaser.Easing.Linear.None)
            .to({angle: -90}, 500, Phaser.Easing.Linear.None)
            .to({x: game.world.width - (32 * 2)}, 4000, Phaser.Easing.Linear.None);
    mainTween.delay(3000);
    mainTween.loop(true);
    mainTween.start();

    downTween1 = game.add.tween(hero1.scale).to({x: 5, y: 5}, 1500, Phaser.Easing.Cubic.Out)
            .to({x: 1, y: 1}, 1500, Phaser.Easing.Cubic.Out);
    downTween1.onComplete.add(onDownTweenCompleted, this);
    downTween2 = game.add.tween(hero2).to({alpha: 0.05}, 2500, Phaser.Easing.Linear.None)
            .to({alpha: 1.0}, 2500, Phaser.Easing.Linear.None);
    downTween2.onComplete.add(onDownTweenCompleted, this)
    downTween1.start();*/

    var textTitle = '';
    var styleTitle = {font: 'Rammetto One', fontSize: '22pt', fontWeight: 'bold', fill: '#b60404'};
    game.add.text(50, game.world.height / 6, textTitle, styleTitle);
    
    settingsText = game.add.button(10, 200,'settings', onConfigButtonPressed);
    //settingsText.inputEnabled = true;
 
        //settingsText.setTextBounds(0, 25, 800, 100);

    startText = game.add.button(500, 200,'start',onPlayButtonPressed);
    //startText.inputEnabled = true;
    //startText.events.onInputDown.add();
        //startText.setTextBounds(0, 35, 800, 100);
    aboutText = game.add.button(253, 200,'start',onAboutButtonPressed);
    //aboutText.inputEnabled = true;
  
/*
    btnAbout = game.add.button(game.world.width / 1.75, game.world.height / 3,
            'aboutButton', onAboutButtonPressed);
    btnConfig = game.add.button(game.world.width / 1.75, game.world.height / 3 + 120,
            'configButton', onConfigButtonPressed);
    btnPlay = game.add.button(game.world.width / 1.75, game.world.height / 3 + 240,
            'playButton', onPlayButtonPressed);*/
}

function onDownTweenCompleted(object, tween) {
    if (tween === downTween1)
        downTween2.start();
    else
        downTween1.start();
}

function onAboutButtonPressed() {
    game.state.start('about');
}

function onConfigButtonPressed() {
    game.state.start('config');
}

function onPlayButtonPressed() {
    game.state.start('play');
}
