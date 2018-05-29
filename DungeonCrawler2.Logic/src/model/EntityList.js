﻿"use strict";
class EntityList {
    constructor() {
        this.Array = [];
    }

    add(item) {
        this.Array.push(item);
    }

    remove(item) {
        let index = this.Array.indexOf(item);
        if (index > -1) {
            this.Array.splice(index, 1);
        }
    }

    any() {
        return this.Array.length > 0;
    }

    elementAt(index) {
        if (this.Array[index] === undefined) {
            return null;
        }
        return this.Array[index];
    }

    length() {
        return this.Array.length;
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

    printLongFormat(indent = true) {
        return this.print(indent, true);
    }

    printShortFormat(indent = true) {
        return this.print(indent, false);
    }

    print(indent = true, longFormat = true) {
        let returnString = "";
        this.Array.forEach(entity => {
            if (returnString !== "") {
                returnString += Engine.EndLine;
            }
            if (indent === true) {
                returnString += Engine.NonBreakingSpace + Engine.NonBreakingSpace + Engine.NonBreakingSpace + Engine.NonBreakingSpace;
            }
            returnString += entity.getName().startWithUpper();
            if (longFormat === true) {
                returnString += " " + entity.getIdle() + "."
            }
        });
        return returnString;
    }
}