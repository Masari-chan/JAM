var endState = {
    preload: loadEnd,
    create: createEnd,
    update: updateEnd
};

var remainingTimeEnd;
function loadEnd() {
    game.load.image('backButton', 'assets/imgs/backButton.png');
}
function createEnd() {
    game.stage.backgroundColor = "#823f09";
    keyIntro = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    scoreText = game.add.text(275, 130, 'Final score: ' + score,{fontSize: '40px', fill: '#000'});
    //timeText = game.add.text(275, 150, 'Final time: ' + EL TIEMPO,{fontSize: '40px', fill: '#000'});
    infoText = game.add.text(175, 450, 'Press ENTER to restart',{fontSize: '40px', fill: '#000'});


    
}
function updateEnd() {
    manageKey();
}

function manageKey(){
    //game.time.events.remove(timerClockEnd);
    if(keyIntro.justDown) game.state.start('welcome');
}