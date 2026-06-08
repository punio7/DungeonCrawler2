import { CharactersData } from './CharactersData';
import { ItemTemplates } from '../model/ItemTemplates';
import { ItemTypesData } from './ItemTypesData';
import { RacesData } from './RacesData';
import { RoomTemplates } from '../model/RoomTemplates';
import { ClassesData } from './ClassesData';

class DataModel {
    ItemTypes: ItemTypesData;
    ItemTemplates: ItemTemplates;
    CharacterTemplates: CharactersData;
    RoomTemplates: RoomTemplates;
    Races: RacesData;
    Classes: ClassesData;
    constructor() {
        this.ItemTypes = new ItemTypesData(undefined);
        this.ItemTemplates = new ItemTemplates(undefined);
        this.CharacterTemplates = new CharactersData(undefined);
        this.RoomTemplates = new RoomTemplates(undefined);
        this.Races = new RacesData(undefined);
        this.Classes = new ClassesData(undefined);
    }
}

export var Data = new DataModel();
