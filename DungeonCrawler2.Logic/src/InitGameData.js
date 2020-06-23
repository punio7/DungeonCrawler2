"use strict";

var Local = {};
var version = "";

function InitGameData() {
    let gameTemplate = JSON.parse(Engine.LoadData('res/Game.json'));
    Game = new GameModel(gameTemplate);

    let itemTypesTemplate = JSON.parse(Engine.LoadData('res/ItemTypes.json')).ItemTypes;
    GameData.ItemTypes = new ItemTypesModel(itemTypesTemplate);

    let itemTemplates = JSON.parse(Engine.LoadData('res/Items.json')).ItemsTemplates;
    GameData.ItemTemplates = new ItemTemplatesModel(itemTemplates);

    let characterTemplates = JSON.parse(Engine.LoadData('res/Characters.json')).CharactersTemplates;
    GameData.CharacterTemplates = new CharacterTemplatesModel(characterTemplates);

    Local = JSON.parse(Engine.LoadData('res/Local.pl.json'));
    version = Engine.LoadData('version.txt').replace("\n", Engine.EndLine);

    Game.Player = new Player();
    Game.Player.Location = Game.StartingRoom;
}