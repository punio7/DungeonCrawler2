"use strict";

var Game = {};

function Execute(command) {
    Commands.Execute(command);
};

Engine.LoadScript('src/Utils.js')

Engine.LoadScript('src/InitGameData.js')
InitGameData();

Engine.LoadScript('src/InitCommands.js')
InitCommands();