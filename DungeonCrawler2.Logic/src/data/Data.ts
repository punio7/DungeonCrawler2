import { CharactersData } from './CharactersData';
import { ItemTemplates } from '../model/ItemTemplates';
import { ItemTypes } from '../model/ItemTypes';
import { RacesData } from './RacesData';
import { RoomTemplates } from '../model/RoomTemplates';
import { ClassesData } from './ClassesData';

class DataModel {
    ItemTypes: ItemTypes;
    ItemTemplates: ItemTemplates;
    CharacterTemplates: CharactersData;
    RoomTemplates: RoomTemplates;
    Races: RacesData;
    Classes: ClassesData;
    constructor() {
        this.ItemTypes = new ItemTypes(undefined);
        this.ItemTemplates = new ItemTemplates(undefined);
        this.CharacterTemplates = new CharactersData(undefined);
        this.RoomTemplates = new RoomTemplates(undefined);
        this.Races = new RacesData(undefined);
        this.Classes = new ClassesData(undefined);
    }
}

export var Data = new DataModel();
