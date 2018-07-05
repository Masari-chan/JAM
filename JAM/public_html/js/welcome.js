/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var DEFAULT_DAMAGE = 10;
var DEFAULT_HEALTH = 10;
var DEFAULT_TIME = 480;
var DEFAULT_JUMPS_TO_KILL = 2;
var BULLET_SPEED_FACTOR = 1;
var DEFAULT_PLAYER_DEATH_TIME_PENALTY = 15;
var DEFAULT_NUM_BRANCHES=3;
var DEFAULT_CONTROLS='k';
var damage = DEFAULT_DAMAGE;
var healthAid = DEFAULT_HEALTH;
var secondsToGo = DEFAULT_TIME;
var jumpsToKill = DEFAULT_JUMPS_TO_KILL;
var playerDeathTimePenalty = DEFAULT_PLAYER_DEATH_TIME_PENALTY;
var branchesTotal=DEFAULT_NUM_BRANCHES;
var controls=DEFAULT_CONTROLS;
var bulletSpeed=BULLET_SPEED_FACTOR;
var score=0;
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

    var textTitle = '';
    var styleTitle = {font: 'Rammetto One', fontSize: '22pt', fontWeight: 'bold', fill: '#b60404'};
    game.add.text(50, game.world.height / 6, textTitle, styleTitle);
    settingsText = game.add.button(10, 200,'settings', onConfigButtonPressed);
    startText = game.add.button(500, 200,'start',onPlayButtonPressed);
    aboutText = game.add.button(253, 200,'start',onAboutButtonPressed);

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
    game.state.start('chooselevel');
}
