/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var startState = {preload: preload, create: createStart};

function preload() {

    game.load.image('start', 'assets/start.png', 30, 30);
    game.load.image('settings', 'assets/settings.png', 30, 30);

}


/* Initialise the final screen */
function createStart() {
    game.stage.backgroundColor = "#823f09";
    titleText = game.add.text(0, 100,
    "Honey Collector",
    {fontSize: '40px', fill: '#FA9503', boundsAlignH: "center", font: "Nosifer"});
    titleText.inputEnabled = false;
    titleText.setTextBounds(0, 5, 800, 100);
    
    names = game.add.text(40, 550,
    "Juárez Lifante, Aitana      Moreno Córcoles, Jesús      Saborit Ribelles, María",
    {fontSize: '20px', fill: '#FA9503', boundsAlignH: "left", boundsAlignV:"bottom"});
    names.inputEnabled = false;
    
    groupName = game.add.text(400, 520,
    "JAM",
    {fontSize: '25px', fill: '#FA9503', boundsAlignH: "center", boundsAlignV:"bottom", font:"Nosifer"});
    groupName.inputEnabled = false;
    
    settingsText = game.add.button(10, 200,
    'settings');
    settingsText.inputEnabled = true;
    settingsText.events.onInputDown.add(goToSettings);
    //settingsText.setTextBounds(0, 25, 800, 100);
    
    startText = game.add.button(500, 200,
    'start');
    startText.inputEnabled = true;
    startText.events.onInputDown.add(startGame);
    //startText.setTextBounds(0, 35, 800, 100);
}

/* Restart game */
function startGame() {
    game.state.start('main');
}

function goToSettings(){
    game.state.start('settings')
}