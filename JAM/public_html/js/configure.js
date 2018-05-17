/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var configState = {
    preload: loadConfigAssets,
    create: doConfig
};

var btnEasy, btnAvg, btnNgtm;

function loadConfigAssets() {
    game.load.image('easyButton', 'assets/imgs/easyButton.png');
    game.load.image('avgButton', 'assets/imgs/averageButton.png');
    game.load.image('ngtmButton', 'assets/imgs/nightmareButton.png');
}

function doConfig() {
    //game.add.image(0, 0, 'bg');

    var textTitle = 'Choose play level:';
    var styleTitle = {font: 'Rammetto One', fontSize: '20pt', fontWeight: 'bold', fill: '#b60404'};
    game.add.text(200, 40, textTitle, styleTitle);

    var vSpace = (game.world.height - 80) / 3;

    btnEasy = game.add.button(game.world.width / 2, vSpace, 'easyButton', onButtonPressed);
    btnEasy.anchor.setTo(0.5, 0.5);
    btnAvg = game.add.button(game.world.width / 2, vSpace * 2, 'avgButton', onButtonPressed);
    btnAvg.anchor.setTo(0.5, 0.5);
    btnNgtm = game.add.button(game.world.width / 2, vSpace * 3, 'ngtmButton', onButtonPressed);
    btnNgtm.anchor.setTo(0.5, 0.5);
}

function onButtonPressed(button) {
    if (button === btnEasy) {
        // do stuff here
        damage = DEFAULT_DAMAGE;
        healthAid = DEFAULT_HEALTH;
        secondsToGo = DEFAULT_TIME;
        jumpsToKill = DEFAULT_JUMPS_TO_KILL;
        playerDeathTimePenalty = DEFAULT_PLAYER_DEATH_TIME_PENALTY;
    } else if (button === btnAvg) {
        // do stuff here
        damage = DEFAULT_DAMAGE * 1.5;
        healthAid = DEFAULT_HEALTH - 2;
        secondsToGo = DEFAULT_TIME - 90;
        jumpsToKill = DEFAULT_JUMPS_TO_KILL + 1;
        playerDeathTimePenalty = DEFAULT_PLAYER_DEATH_TIME_PENALTY + 10;
    } else {
        // do stuff here
        damage = DEFAULT_DAMAGE * 2;
        healthAid = DEFAULT_HEALTH - 5;
        secondsToGo = DEFAULT_TIME - 150;
        jumpsToKill = DEFAULT_JUMPS_TO_KILL + 3;
        playerDeathTimePenalty = DEFAULT_PLAYER_DEATH_TIME_PENALTY + 25;
    }
    // Come back to welcome
    game.state.start('welcome');
}
