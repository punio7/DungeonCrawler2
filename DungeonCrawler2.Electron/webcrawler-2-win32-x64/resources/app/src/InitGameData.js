"use strict";

var DirectionsLocales = {};
var version = "";

function InitGameData() {
    let gameTemplate = JSON.parse(Engine.LoadData('res/Game.json'));
    Game = new GameModel(gameTemplate);

    let itemTypesTemplate = JSON.parse(Engine.LoadData('res/ItemTypes.json'));
    Game.ItemTypes = new ItemTypesModel(itemTypesTemplate);

    let itemTemplates = JSON.parse(Engine.LoadData('res/Items.json')).ItemsTemplates;
    Game.ItemTemplates = new ItemTemplatesModel(itemTemplates);

    let characterTemplates = JSON.parse(Engine.LoadData('res/Characters.json')).CharactersTemplates;
    Game.CharacterTemplates = new CharacterTemplatesModel(characterTemplates);

    DirectionsLocales = JSON.parse(Engine.LoadData('res/Directions.json'))
    version = Engine.LoadData('version.txt').replace("\n", Engine.EndLine);

    Game.Player = new Player();
    Game.Player.Location = Game.StartingRoom;
}