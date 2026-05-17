import { ItemTypes } from '../res/ItemTypes.json';
import { ItemsTemplates } from '../res/Items.json';
import { CharactersTemplates } from '../res/Characters.json';
import { Local as LocalPl } from '../res/Local.pl.json';
import { GameTemplate } from '../res/Game.json';
import { Races } from '../res/Races.json';
import { Classes } from '../res/Classes.json';
import { GameModel } from './model/Game';
import { ItemTypes as ItemTypesList } from './model/ItemTypes';
import { CharacterTemplates } from './model/CharacterTemplates';
import { ItemTemplates } from './model/ItemTemplates';
import { GameData } from './model/GameData';
import { RoomTemplates } from './model/RoomTemplates';
import { RacesTemplates } from './templates/RacesTemplates';
import { ClassesData } from './templates/ClassesData';

export var Local = LocalPl;
export var Game: GameModel = new GameModel();
export var Version = '';

export function InitGameData() {
    Game = new GameModel();
    GameData.ItemTypes = new ItemTypesList(ItemTypes);
    GameData.ItemTemplates = new ItemTemplates(ItemsTemplates);
    GameData.CharacterTemplates = new CharacterTemplates(CharactersTemplates);
    GameData.RoomTemplates = new RoomTemplates(GameTemplate.Rooms);
    GameData.Races = new RacesTemplates(Races);
    GameData.Classes = new ClassesData(Classes);
    Version = Engine.LoadData('version.txt').replace('\n', Engine.EndLine);

    Game.Player.Location = Game.StartingRoom;
}

export function LoadGame(savedGame: string) {
    const game = JSON.parse(savedGame) as GameModel;
    Game = new GameModel();
    Game.loadGame(game);
}
