/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var configState = {
    preload: loadConfigAssets,
    create: doConfig
};


var btnPlus, btnLess, btnBack, btnMouse, btnKeyboard;


function loadConfigAssets() {
    game.load.image('plusButton', 'assets/imgs/easyButton.png');
    game.load.image('lessButton', 'assets/imgs/averageButton.png');
    game.load.image('backButton', 'assets/imgs/backButton.png');
    game.load.image('mouseButton', 'assets/imgs/mouse.png');
    game.load.image('keyboardButton', 'assets/imgs/keyboard.png');
}

function doConfig() {
    //game.add.image(0, 0, 'bg');

    var textTitle = 'Choose how many threads:';
    var styleTitle = {font: 'Rammetto One', fontSize: '20pt', fontWeight: 'bold', fill: '#b60404'};
    game.add.text(180, 80, textTitle, styleTitle);

    var vSpace = (game.world.height - 80) / 5;
    btnPlus = game.add.button(game.world.width / 2 - 145, vSpace+90, 'plusButton', onButtonPressedDif);
    btnPlus.anchor.setTo(0.5, 0.5);
    
    difText = game.add.text(game.world.width / 2-7, vSpace+80, branchesTotal,{fontSize: '40px', fill: '#000'});
    
    ctrlText= game.add.text(game.world.width / 2-80, vSpace*4-40, 'Keyboard',{fontSize: '40px', fill: '#000'});
    
    btnLess = game.add.button(game.world.width / 2 + 145, vSpace+90, 'lessButton', onButtonPressedDif);
    btnLess.anchor.setTo(0.5, 0.5);
    
    var textTitle = 'Choose the controls:';
    var styleTitle = {font: 'Rammetto One', fontSize: '20pt', fontWeight: 'bold', fill: '#b60404'};
    
    game.add.text(232, vSpace*3-30, textTitle, styleTitle);
    
    btnMouse = game.add.button(game.world.width / 2 - 200, vSpace*4, 'mouseButton', onButtonPressedDif);
    btnMouse.anchor.setTo(0.5, 0.5);
    btnMouse.scale.setTo(0.5,0.5);
    
    btnKeyboard = game.add.button(game.world.width / 2 + 200, vSpace*4, 'keyboardButton', onButtonPressedDif);
    btnKeyboard.anchor.setTo(0.5, 0.5);
    btnKeyboard.scale.setTo(0.5,0.5);
    btnBack = game.add.button(game.world.width / 2, vSpace*5+20, 'backButton', onButtonPressedDif);
    btnBack.anchor.setTo(0.5, 0.5);
    
}

function onButtonPressedDif(button) {
    if (button === btnPlus && branchesTotal+1<=8) {
        branchesTotal=branchesTotal+1;
        difText.setText(branchesTotal);
    } else if (button === btnLess && branchesTotal-1>=3) {
        branchesTotal=branchesTotal-1;
        difText.setText(branchesTotal);
    } else if (button===btnMouse){
        controls='m';
        ctrlText.setText('Mouse');
    } else if (button===btnKeyboard){
        controls='k';
        ctrlText.setText('Keyboard');
    } else{
        game.state.start('welcome');
    }
}     