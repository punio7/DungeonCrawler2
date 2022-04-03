import { ItemTypes } from '../res/ItemTypes.json';
import { ItemsTemplates } from '../res/Items.json';
import { CharactersTemplates } from '../res/Characters.json';
import { Local as LocalPl } from '../res/Local.pl.json';
import { GameModel } from './model/Game';
import { ItemTypesModel } from './model/ItemTypes';
import { CharacterTemplatesModel } from './model/CharacterTemplates';
import { ItemTemplatesModel } from './model/ItemTemplates';
import { GameData } from './model/GameData';

export var Local: any = {};
export var Game: GameModel = new GameModel();
export var Version = '';

export function InitGameData() {
    Game = new GameModel();
    Game.LoadFromTemplate();
    GameData.ItemTypes = new ItemTypesModel(ItemTypes);
    GameData.ItemTemplates = new ItemTemplatesModel(ItemsTemplates);
    GameData.CharacterTemplates = new CharacterTemplatesModel(CharactersTemplates);
    Local = LocalPl;
    Version = Engine.LoadData('version.txt').replace('\n', Engine.EndLine);

    Game.Player.Location = Game.StartingRoom;
}
