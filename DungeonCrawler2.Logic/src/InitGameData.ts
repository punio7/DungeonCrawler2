import { ItemTypes } from '../res/ItemTypes.json';
import { ItemsTemplates } from '../res/Items.json';
import { CharactersTemplates } from '../res/Characters.json';
import { Local as LocalPl } from '../res/Local.pl.json';
import { GameTemplate } from '../res/Game.json';
import { Races } from '../res/Races.json';
import { Classes } from '../res/Classes.json';
import { GameModel } from './model/Game';
import { ItemTypes as ItemTypesList } from './model/ItemTypes';
import { CharactersData } from './data/CharactersData';
import { ItemTemplates } from './model/ItemTemplates';
import { Data } from './data/Data';
import { RoomTemplates } from './model/RoomTemplates';
import { RacesData } from './data/RacesData';
import { ClassesData } from './data/ClassesData';

export var Local = LocalPl;
export var Game: GameModel = new GameModel();
export var Version = '';

export function InitGameData() {
    Game = new GameModel();
    Data.ItemTypes = new ItemTypesList(ItemTypes);
    Data.ItemTemplates = new ItemTemplates(ItemsTemplates);
    Data.CharacterTemplates = new CharactersData(CharactersTemplates);
    Data.RoomTemplates = new RoomTemplates(GameTemplate.Rooms);
    Data.Races = new RacesData(Races);
    Data.Classes = new ClassesData(Classes);
    Version = Engine.LoadData('version.txt').replace('\n', Engine.EndLine);

    Game.Player.Location = Game.StartingRoom;
}

export function LoadGame(savedGame: string) {
    const game = JSON.parse(savedGame) as GameModel;
    Game = new GameModel();
    Game.loadGame(game);
}
