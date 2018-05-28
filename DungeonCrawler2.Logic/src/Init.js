﻿"use strict";

Engine.LoadScript('src/Utils.js')
Engine.LoadScript('src/InitGameData.js')
Engine.LoadScript('src/InitCommands.js')

Engine.LoadScript('src/model/Game.js');
Engine.LoadScript('src/enums/EnumBase.js');
Engine.LoadScript('src/enums/Directions.js');
Engine.LoadScript('src/enums/GrammaCase.js');
Engine.LoadScript('src/enums/EquipmentSlots.js');
Engine.LoadScript('src/model/Room.js');
Engine.LoadScript('src/model/RoomExit.js');
Engine.LoadScript('src/model/Equipment.js');
Engine.LoadScript('src/model/Character.js');
Engine.LoadScript('src/model/Player.js');
Engine.LoadScript('src/model/EntityList.js');
Engine.LoadScript('src/model/ItemTemplates.js');
Engine.LoadScript('src/model/ItemTypes.js');
Engine.LoadScript('src/model/Item.js');
Engine.LoadScript('src/model/ItemList.js');
Engine.LoadScript('src/model/CharacterTemplates.js');
Engine.LoadScript('src/model/CharacterList.js');


Engine.LoadScript('src/CommonLogic/Prompt.js');

Engine.LoadScript('src/CommandParser.js');
Engine.LoadScript('src/commands/Command.js');

Engine.LoadScript('src/commands/NoCommand.js');
Engine.LoadScript('src/commands/Reload.js');
Engine.LoadScript('src/commands/Test.js');
Engine.LoadScript('src/commands/Eval.js');
Engine.LoadScript('src/commands/Json.js');
Engine.LoadScript('src/commands/Look.js');

Engine.LoadScript('src/CommandTree.js');
Engine.LoadScript('src/CommandsManager.js');

function Init() {
    InitGameData();
    InitCommands();
    Prompt.Print();
}