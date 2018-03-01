"use strict";

function InitGameData() {
    Engine.LoadScript('src/model/Game.js');
    Engine.LoadScript('src/model/ItemTypes.js');

    let gameTemplate = JSON.parse(Engine.LoadData('res/game.json'));
    Game = new GameModel(gameTemplate);

    let itemTypesTemplate = JSON.parse(Engine.LoadData('res/ItemTypes.json'));
    Game.ItemTypes = new ItemTypesModel(itemTypesTemplate);
}