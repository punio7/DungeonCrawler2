"use strict";

var Game = {};

function Execute(command) {
    Commands.Execute(command);
};

Engine.LoadScript('src/model/Game.js');

function InitGameData() {
    let gameTemplate = JSON.parse(Engine.LoadData('res/game.json'));
    Game = new GameModel(gameTemplate);
}

InitGameData();
Engine.LoadScript('src/CommandParser.js');
Engine.LoadScript('src/commands/Command.js');
Engine.LoadScript('src/commands/Reload.js');
Engine.LoadScript('src/commands/Test.js');
Engine.LoadScript('src/Commands.js');

Engine.Output(Game.Name);