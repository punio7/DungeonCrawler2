import { CharacterTemplates } from './CharacterTemplates';
import { ItemTemplates } from './ItemTemplates';
import { ItemTypes } from './ItemTypes';
import { RacesTemplates } from '../templates/RacesTemplates';
import { RoomTemplates } from './RoomTemplates';
import { ClassesData } from '../templates/ClassesData';

class GameDataModel {
    ItemTypes: ItemTypes;
    ItemTemplates: ItemTemplates;
    CharacterTemplates: CharacterTemplates;
    RoomTemplates: RoomTemplates;
    Races: RacesTemplates;
    Classes: ClassesData;
    constructor() {
        this.ItemTypes = new ItemTypes(undefined);
        this.ItemTemplates = new ItemTemplates(undefined);
        this.CharacterTemplates = new CharacterTemplates(undefined);
        this.RoomTemplates = new RoomTemplates(undefined);
        this.Races = new RacesTemplates(undefined);
        this.Classes = new ClassesData(undefined);
    }
}

export var GameData = new GameDataModel();
