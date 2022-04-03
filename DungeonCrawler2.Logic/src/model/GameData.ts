import { CharacterTemplatesModel } from './CharacterTemplates';
import { ItemTemplatesModel } from './ItemTemplates';
import { ItemTypesModel } from './ItemTypes';

class GameDataModel {
    ItemTypes: ItemTypesModel;
    ItemTemplates: ItemTemplatesModel;
    CharacterTemplates: CharacterTemplatesModel;
    constructor() {
        this.ItemTypes = new ItemTypesModel(undefined);
        this.ItemTemplates = new ItemTemplatesModel(undefined);
        this.CharacterTemplates = new CharacterTemplatesModel(undefined);
    }
}

export var GameData = new GameDataModel();
