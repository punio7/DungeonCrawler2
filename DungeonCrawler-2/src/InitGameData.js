"use strict";

var Game = {};

function InitGameData() {
    Engine.LoadScript('src/enums/Directions.js');
    Engine.LoadScript('src/model/Game.js');
    Engine.LoadScript('src/model/Room.js');
    Engine.LoadScript('src/model/RoomExit.js');
    Engine.LoadScript('src/model/ItemTypes.js');

    let gameTemplate = JSON.parse(Engine.LoadData('res/Game.json'));
    Game = new GameModel(gameTemplate);

    let itemTypesTemplate = JSON.parse(Engine.LoadData('res/ItemTypes.json'));
    Game.ItemTypes = new ItemTypesModel(itemTypesTemplate);
}