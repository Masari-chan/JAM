/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var aboutState = {
    preload: loadAboutAssets,
    create: showInstructions
};

var author1, author2, author3;

function loadAboutAssets() {
    game.load.image('backButton', 'assets/imgs/backButton.png');
}

function showInstructions() {
    game.stage.backgroundColor = "#823f09";

    var textTitle = 'Honey Collector';
    var styleTitle = {font: 'Nosifer', fontSize: '20pt', fontWeight: 'bold', fill: '#FA9503'};
    game.add.text(75, 25, textTitle, styleTitle);

    var authors = 'El equipo, JAM :';
    game.add.text(125, game.world.height / 6 + 75, authors, {font: 'bold 20pt Sniglet', fill: '#FA9503'});

    author1 = game.add.text(175, game.world.height / 6 + 130, 'Aitana Juárez Lifante',
            { font: 'bold 18pt Sniglet', fill: '#FA9503'} );
    author1.inputEnabled = true;
    author1.events.onInputOver.add(overText, this);
    author1.events.onInputOut.add(outText, this);
    
    author2 = game.add.text(175, game.world.height / 6 + 170, 'Jesús Moreno Córcoles',
            { font: 'bold 18pt Sniglet', fill: '#FA9503' });
    author2.inputEnabled = true;
    author2.events.onInputOver.add(overText, this);
    author2.events.onInputOut.add(outText, this);

    author3 = game.add.text(175, game.world.height / 6 + 210, 'María Saborit Ribelles',
            { font: 'bold 18pt Sniglet', fill: '#FA9503' });
    author3.inputEnabled = true;
    author3.events.onInputOver.add(overText, this);
    author3.events.onInputOut.add(outText, this);
    
    var instructions = 'El juego consiste en recolectar miel: ';
    instructions += 'Disparas botes. ';
    instructions += 'Si una gota de miel cae al suelo, tu barra de trabajo, disminuye. ';
    instructions += 'Algunas avispas vendran a robar la miel de tu panal, disparales para evitarlo. ';
    instructions += 'En algunas ocasiones del panal caerá jalea real, es muy recomendable tomarla, recupera la barra de trabajo.';
    
    var instrucText = game.add.text(0, 0, instructions, { font: '14pt Sniglet', fill: '#b60404' });
    instrucText.setTextBounds(30, game.world.height-170, game.world.width-60);
    instrucText.boundsAlignH = 'center';
    instrucText.boundsAlignV = 'middle';
    instrucText.wordWrap = true;
    instrucText.wordWrapWidth = game.world.width-60;
    
    var btnPlay = game.add.button(game.world.width / 2, game.world.height - 60, 'backButton', onBackButtonPressed);
    btnPlay.anchor.setTo(0.5, 0.5);
}

function onBackButtonPressed() {
    game.state.start('welcome');
}

function overText(text, pointer) {
    text.fill = '#0e0eb3';
}

function outText(text, pointer) {
    text.fill = '#b60404';
}
