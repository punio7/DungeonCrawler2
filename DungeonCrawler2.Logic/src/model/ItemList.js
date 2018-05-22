"use strict";
class ItemList {
    constructor() {
        this.itemsArray = [];
    }

    Add(item) {
        this.itemsArray.push(item);
    }

    Remove(item) {
        let index = array.indexOf(item);
        if (index > -1) {
            this.itemsArray.splice(index, 1);
        }
    }

    Any() {
        return this.itemsArray.length > 0;
    }

    Find(name, number = 1) {
        let found = null;
        this.itemsArray.forEach(item => {
            if (item.getName().search(name) >= 0) {
                if (number <= 1) {
                    found = item;
                    return;
                }
                else {
                    number--;
                }
            }
        });
        return found;
    }

    HasLightSource() {
        return this.itemsArray.some(i => i.isLightSource() === true);
    }

    PrintLongFormat() {
        let returnString = "";
        this.itemsArray.forEach(item => {
            if (returnString !== "") {
                returnString += Engine.EndLine;
            }
            returnString += "    " + item.getName().startWithUpper() + " " + item.Idle;
        });
        return returnString;
    }
}