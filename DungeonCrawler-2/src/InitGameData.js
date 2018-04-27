"use strict";

Engine.LoadScript('src/model/Game.js');
Engine.LoadScript('src/enums/Directions.js');
Engine.LoadScript('src/enums/GrammaCase.js');
Engine.LoadScript('src/model/Room.js');
Engine.LoadScript('src/model/RoomExit.js');
Engine.LoadScript('src/model/Player.js');
Engine.LoadScript('src/model/ItemTypes.js');
Engine.LoadScript('src/model/ItemTemplates.js');
Engine.LoadScript('src/model/Item.js');
Engine.LoadScript('src/model/ItemList.js');

var Game = new GameModel();

function InitGameData() {
    let gameTemplate = JSON.parse(Engine.LoadData('res/Game.json'));
    Game = new GameModel(gameTemplate);

    let itemTypesTemplate = JSON.parse(Engine.LoadData('res/ItemTypes.json'));
    Game.ItemTypes = new ItemTypesModel(itemTypesTemplate);

    let itemTemplates = JSON.parse(Engine.LoadData('res/Items.json')).ItemsTemplates;
    Game.ItemTemplates = new ItemTemplatesModel(itemTemplates);

    Game.Player = new Player();
    Game.Player.Location = Game.StartingRoom;
}