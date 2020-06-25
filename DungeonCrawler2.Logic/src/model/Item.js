﻿"use strict";
class Item {
    getName(grammaCase = GrammaCase.Mianownik) {
        if (!this.isStackable()) {
            return this.Name[grammaCase] + Engine.DefaultColor;
        }
        else {
            return this.getStack() + " " + this.getPluralName(grammaCase) + Engine.DefaultColor;
        }
    }

    getPluralName(grammaCase = GrammaCase.Mianownik) {
        if (!Array.isArray(this.Name[0])) {
            return this.Name[grammaCase];
        }
        else {
            switch (this.getStack()) {
                case 1:
                    return this.Name[0][grammaCase];
                case 2:
                case 3:
                case 4:
                    return this.Name[1][grammaCase];
                default:
                    return this.Name[2][grammaCase];
            }
        }
    }

    getDescription() {
        return this.Description + Engine.DefaultColor;
    }

    getIdle() {
        if (this.Idle === undefined) {
            return "leży na ziemi";
        }
        return this.Idle;
    }

    isLightSource() {
        return this.IsLightSource === true;
    }

    isStackable() {
        if (this.IsStackable === undefined) {
            return false;
        }
        return this.IsStackable;
    }

    getStack() {
        if (this.Stack === undefined) {
            return 1;
        }
        return this.Stack;
    }

    setStack(value) {
        if (this.isStackable()) {
            this.Stack = value;
        }
    }

    addStack(value) {
        if (this.isStackable()) {
            this.Stack += value;
        }
    }

    getType() {
        return this.Type;
    }

    isTakeable() {
        switch (this.getType()) {
            case ItemTypes.Static:
            case ItemTypes.StaticContainer:
            case ItemTypes.Lever:
                return false;
            default:
                return true;
        }
    }

    /** 
     * @returns {ItemList} Items inventory- container 
     */
    getInventory() {
        if (this.Inventory === undefined) {
            return null;
        }
        return this.Inventory;
    }
}