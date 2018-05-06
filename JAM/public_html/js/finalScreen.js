/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var finalState = {create: createFinal};
/* Initialise the final screen */
function createFinal() {
    game.stage.backgroundColor = "#fa0";
    scoreText = game.add.text(130, 200,
    "CONGRATS!\n\nYou have successfully completed\n\nTHIS SILLY GAME!",
    {fontSize: '32px', fill: '#0bf'});
    scoreText.inputEnabled = true;
    scoreText.events.onInputDown.add(restartGame);
}
/* Restart game */
function restartGame() {
    game.state.start('main');
}