/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var settingsState = {create: createSettings};
/* Initialise the final screen */
function createSettings() {
    game.stage.backgroundColor = "#FF830F";
    titleText = game.add.text(0, 100,
    "Settings",
    {fontSize: '40px', fill: '#000', boundsAlignH: "center"});
    titleText.inputEnabled = false;
    titleText.setTextBounds(0, 5, 800, 100);
    
    difficultyText = game.add.text(0, 200,
    "Difficulty",
    {fontSize: '32px', fill: '#000', boundsAlignH: "center"});
    difficultyText.inputEnabled = false;
    difficultyText.setTextBounds(0, 10, 800, 100);
    
    volumeText = game.add.text(0, 300,
    "Volume",
    {fontSize: '32px', fill: '#000', boundsAlignH: "center"});
    volumeText.inputEnabled = false;
    volumeText.setTextBounds(0, 20, 800, 100);
    
    audioText = game.add.text(0, 400,
    "Audio",
    {fontSize: '32px', fill: '#000', boundsAlignH: "center"});
    audioText.inputEnabled = false;
    audioText.setTextBounds(0, 30, 800, 100);
    
    backToMenuText = game.add.text(0, 500,
    "<- Back to Menu ->",
    {fontSize: '32px', fill: '#000', boundsAlignH: "center"});
    backToMenuText.inputEnabled = true;
    backToMenuText.setTextBounds(0, 40, 800, 100);
    backToMenuText.events.onInputDown.add(goToMenu);
}

function goToMenu(){
    game.state.start('start');
}