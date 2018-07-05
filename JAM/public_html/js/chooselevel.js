/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var chooseState = {
    preload: loadConfigAssetsC,
    create: doConfigC
};

var btnA, btnB, nivel;

function loadConfigAssetsC() {
    game.load.image('easyButton', 'assets/imgs/A.png');
    game.load.image('avgButton', 'assets/imgs/B.png');
}

function doConfigC() {
    //game.add.image(0, 0, 'bg');
    nivel='';
    var textTitle = 'Choose a level:';
    var styleTitle = {font: 'Rammetto One', fontSize: '20pt', fontWeight: 'bold', fill: '#b60404'};
    game.add.text(270, 80, textTitle, styleTitle);

    var vSpace = (game.world.height - 80) / 3;

    btnA = game.add.button(game.world.width / 2, vSpace+50, 'easyButton', onButtonPressed);
    btnA.anchor.setTo(0.5, 0.5);
    btnB = game.add.button(game.world.width / 2, vSpace * 2+100, 'avgButton', onButtonPressed);
    btnB.anchor.setTo(0.5, 0.5);

}

function onButtonPressed(button) {
    console.log(button);
    if (button.key === 'easyButton') {
        nivel='A';
    } else if (button.key === 'avgButton') {
        nivel='B';
    }
    game.state.start('B');
}
