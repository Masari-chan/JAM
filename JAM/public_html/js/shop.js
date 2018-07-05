/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var shopState = {
    preload: loadConfigAssetsS,
    create: doConfigS
};
/*
var bonusButton1;

function loadConfigAssetsS() {
    game.load.image('speedBonusButton', 'assets/imgs/speedBonus.png');
    game.load.image('nextButton', 'assets/imgs/nextButton.png');
}

function doConfigS() {
    game.add.image(0, 0, 'bg');

    var textTitle = 'Want to buy bonuses?';
    var styleTitle = {font: 'Rammetto One', fontSize: '20pt', fontWeight: 'bold', fill: '#b60404'};
    game.add.text(game.world.width / 2-180, 100, textTitle, styleTitle);

    var vSpace = (game.world.height - 80) / 6;
    
    message=game.add.text(game.world.width / 2-260, vSpace*5, '' ,{fontSize: '40px', fill: '#000'} );
    
    scoreText=game.add.text(650, 5, 'Score: ' + score,{fontSize: '25px', fill: '#000'});
    
    game.add.text(game.world.width / 2-40, vSpace*3+60, '100 sp' ,{fontSize: '20px', fill: '#000'} );
    bonusButton1 = game.add.button(game.world.width / 2-10, vSpace*3, 'speedBonusButton', onButtonPressed);
    bonusButton1.anchor.setTo(0.5, 0.5);
    
    nextButton = game.add.button(game.world.width / 2, vSpace*6, 'nextButton', onButtonPressed);
    nextButton.anchor.setTo(0.5, 0.5);
   

}

function onButtonPressed(button) {

    if(button===bonusButton1){
        if(bulletSpeed-0,2>0){
            if(score>=100){
            score=score-100;
            bulletSpeed=bulletSpeed-0,2;
            message.setText('BULLET SPEED INCREASED!');
            scoreText.setText(score);
            }
            else{
                message.setText('Not enough score points: '+ score);
            }
        }
    }
    else{
        game.state.start('B');
    }
}*/
