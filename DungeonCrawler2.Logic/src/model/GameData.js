"use strict";

class GameDataModel {
    constructor() {
        this.ItemTypes = new ItemTypesModel();
        this.ItemTemplates = new ItemTemplatesModel();
        this.CharacterTemplates = new CharacterTemplatesModel();
    }
}

var GameData = new GameDataModel();