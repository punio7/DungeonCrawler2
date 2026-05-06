import { CharacterTemplates } from './CharacterTemplates';
import { ItemTemplates } from './ItemTemplates';
import { ItemTypes } from './ItemTypes';
import { RoomTemplates } from './RoomTemplates';

class GameDataModel {
    ItemTypes: ItemTypes;
    ItemTemplates: ItemTemplates;
    CharacterTemplates: CharacterTemplates;
    RoomTemplates: RoomTemplates;
    constructor() {
        this.ItemTypes = new ItemTypes(undefined);
        this.ItemTemplates = new ItemTemplates(undefined);
        this.CharacterTemplates = new CharacterTemplates(undefined);
        this.RoomTemplates = new RoomTemplates(undefined);
    }
}

export var GameData = new GameDataModel();
