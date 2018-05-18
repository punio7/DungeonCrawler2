"use strict";

class ItemTypesModel {
    constructor(itemTypesTemplate) {
        if (itemTypesTemplate === undefined) {
            return;
        }

        if (!Array.isArray(itemTypesTemplate)) {
            throw "Item types template must be an array";
        }

        this.currentNewIndex = 0;

        itemTypesTemplate.forEach((value, index) => {
            this.AddNewItemType(value);
        });
    };

    AddNewItemType(itemTypeName) {
        if (this[itemTypeName] !== undefined) {
            throw "Item type {0} is already defined!".format(itemTypeName);
        }
        this[itemTypeName] = this.currentNewIndex++;
    };

    getItemType(itemTypeName) {
        if (this[itemTypeName] === undefined) {
            throw "Item type " + itemTypeName + " is not defined!";
        }
        return this[itemTypeName];
    }
};