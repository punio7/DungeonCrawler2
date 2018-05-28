﻿"use strict";
class EntityList {
    constructor() {
        this.Array = [];
    }

    add(item) {
        this.Array.push(item);
    }

    remove(item) {
        let index = array.indexOf(item);
        if (index > -1) {
            this.Array.splice(index, 1);
        }
    }

    any() {
        return this.Array.length > 0;
    }

    find(name, number = 1) {
        let found = null;
        this.Array.forEach(item => {
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

    printLongFormat() {
        let returnString = "";
        this.Array.forEach(entity => {
            if (returnString !== "") {
                returnString += Engine.EndLine;
            }
            returnString += Engine.NonBreakingSpace + Engine.NonBreakingSpace + Engine.NonBreakingSpace + Engine.NonBreakingSpace;
            returnString += entity.getName().startWithUpper() + " " + entity.getIdle();
        });
        return returnString;
    }
}