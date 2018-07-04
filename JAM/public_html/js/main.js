/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var game;

var wfConfig = {
    active: function () {
        startGame();
    },

    google: {
        families: ['Rammetto One', 'Sniglet']
    },
    
    custom: {
        families: ['FerrumExtracondensed'],
        urls: ["https://fontlibrary.org/face/ferrum"]
    }
};

WebFont.load(wfConfig);

function startGame() {
    game = new Phaser.Game(800, 600, Phaser.CANVAS, 'platformGameStage');

    // Welcome Screen
    game.state.add('welcome', initialState);
    // About Screen
    game.state.add('about', aboutState);
    // Config Screen
    game.state.add('config', configState);
    // Play Screen
    
    game.state.add('A', playStateA);
    game.state.add('B', playStateB);
    game.state.add('difficulty', difState);

    game.state.start('welcome');
}
