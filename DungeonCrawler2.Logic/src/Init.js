"use strict";

Engine.LoadScript('src/Utils.js')

Engine.LoadScript('src/InitGameData.js')

Engine.LoadScript('src/InitCommands.js')

function Init() {
    InitGameData();
    InitCommands();
    Prompt.Print();
}