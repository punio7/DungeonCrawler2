﻿"use strict";
class Room {
    constructor(template) {
        this.Id = 0;
        this.Name = '';
        this.Description = '';
        this.IsNaturalLight = false;
        this.Exits = [];
        this.IsVisited = false;
        Object.assign(this, template);
    };
    
    LoadRoomData() {
        let oldExits = this.Exits;
        let newExits = {};
        oldExits.forEach(exit => {
            let direction = exit.Direction;
            newExits[direction] = new RoomExit(exit);
        });
        this.Exits = newExits;

        this.Items = new ItemList(this.Items)

        let newCharacters = new CharacterList();
        if (this.Characters !== undefined) {
            this.Characters.forEach(characterId => {
                newCharacters.add(Game.spawnCharacter(characterId));
            });
        }
        this.Characters = newCharacters;

        this.IsLoaded = true;
    }

    isLoaded() {
        return this.IsLoaded;
    }

    getName() {
        return this.Name;
    }

    getItems() {
        if (this.Items === undefined) {
            return [];
        }
        return this.Items;
    }

    getCharacters() {
        if (this.Characters === undefined) {
            return [];
        }
        return this.Characters;
    }

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
};