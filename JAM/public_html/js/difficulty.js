/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var difState = {
    preload: loadConfigAssetsD,
    create: doConfigD
};


var btnPlus, btnLess;
var branchesTotal=3;

function loadConfigAssetsD() {
    game.load.image('plusButton', 'assets/imgs/easyButton.png');
    game.load.image('lessButton', 'assets/imgs/averageButton.png');
    game.load.image('backButtonDif', 'assets/imgs/backButton.png');
}

function doConfigD() {
    //game.add.image(0, 0, 'bg');

    var textTitle = 'Choose how many threads:';
    var styleTitle = {font: 'Rammetto One', fontSize: '20pt', fontWeight: 'bold', fill: '#b60404'};
    game.add.text(200, 40, textTitle, styleTitle);

    var vSpace = (game.world.height - 80) / 4;

    btnPlus = game.add.button(game.world.width / 2, vSpace, 'plusButton', onButtonPressedDif);
    btnPlus.anchor.setTo(0.5, 0.5);
    difText = game.add.text(650, 5, 'Threads: ' + branchesTotal,{fontSize: '25px', fill: '#000'});

    btnLess = game.add.button(game.world.width / 2, vSpace * 2, 'lessButton', onButtonPressedDif);
    btnLess.anchor.setTo(0.5, 0.5);
    /*btnNgtm = game.add.button(game.world.width / 2, vSpace * 3, 'ngtmButton', onButtonPressed);
    btnNgtm.anchor.setTo(0.5, 0.5);
    */
    btnBackDif = game.add.button(game.world.width / 2, game.world.height - 60, 'backButtonDif', onButtonPressedDif);
    btnBackDif.anchor.setTo(0.5, 0.5);
}

function onButtonPressedDif(button) {
    if (button === btnPlus && branchesTotal+1<=8) {
        branchesTotal = branchesTotal + 1;
        difText.setText('Threads: ' + branchesTotal);
    } else if (button === btnLess && branchesTotal-1>=3) {
        branchesTotal = branchesTotal - 1;
        difText.setText('Threads: ' + branchesTotal);
    }
    if(button === btnBackDif){
        game.state.start('welcome');
    }
}