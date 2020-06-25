"use strict";
class Room {
    constructor() {
        this.Id = 0;
        this.Name = '';
        this.Description = '';
        this.IsNaturalLight = false;
        this.Exits = [];
        this.IsVisited = false;
    }

    isLoaded() {
        return this.IsLoaded;
    }

    getName() {
        return this.Name;
    }

    getItems() {
        if (this.Items === undefined) {
            return new ItemList();
        }
        return this.Items;
    }

    getCharacters() {
        if (this.Characters === undefined) {
            return new CharacterList();
        }
        return this.Characters;
    }

    /**
     * 
     * @param {DirectionsEnum} direction
     * @returns {RoomExit}
     */
    getExit(direction) {
        if (this.Exits[direction] === undefined) {
            return null;
        }
        return this.Exits[direction];
    }

    hasLightSource() {
        if (this.IsNaturalLight === true) {
            return true;
        }
        if (this.getItems().hasLightSource()) {
            return true;
        }
        if (this.getCharacters().hasLightSource()) {
            return true;
        }

        return false;
    }

    getOnFirstEnterEvent() {
        if (this.OnFirstEnterEvent === undefined) {
            return null;
        }
        return this.OnFirstEnterEvent;
    }

    getOnEnterEvent() {
        if (this.OnEnterEvent === undefined) {
            return null;
        }
        return this.OnEnterEvent;
    }
};