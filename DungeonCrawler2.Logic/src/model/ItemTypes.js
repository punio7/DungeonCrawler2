"use strict";

class ItemTypesModel {
    constructor(itemTypesTemplate) {
        if (itemTypesTemplate === undefined) {
            return;
        }

        if (!Array.isArray(itemTypesTemplate)) {
            throw "Item types template must be an array";
        }

        itemTypesTemplate.forEach((value, index) => {
            this.AddNewItemType(value);
        });
    }

    AddNewItemType(itemType) {
        if (this[itemType.Id] !== undefined) {
            throw "Item type {0} is already defined!".format(itemType.Id);
        }
        this[itemType.Id] = itemType;
    }

    GetItemType(itemTypeName) {
        if (this[itemTypeName] === undefined) {
            throw "Item type " + itemTypeName + " is not defined!";
        }
        return this[itemTypeName];
    }
}