/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var startState = {create: createStart};
/* Initialise the final screen */
function createStart() {
    game.stage.backgroundColor = "#FF830F";
    titleText = game.add.text(0, 100,
    "Honey Collector",
    {fontSize: '40px', fill: '#000', boundsAlignH: "center"});
    titleText.inputEnabled = false;
    titleText.setTextBounds(0, 5, 800, 100);
    
    settingsText = game.add.text(0, 350,
    "Settings",
    {fontSize: '32px', fill: '#000', boundsAlignH: "center"});
    settingsText.inputEnabled = true;
    settingsText.events.onInputDown.add(goToSettings);
    settingsText.setTextBounds(0, 25, 800, 100);
    
    startText = game.add.text(0, 400,
    "Start Game",
    {fontSize: '32px', fill: '#000', boundsAlignH: "center"});
    startText.inputEnabled = true;
    startText.events.onInputDown.add(startGame);
    startText.setTextBounds(0, 35, 800, 100);
}

/* Restart game */
function startGame() {
    game.state.start('main');
}

function goToSettings(){
    game.state.start('settings')
}