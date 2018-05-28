"use strict";
class Room {
    constructor(template) {
        this.Id = 0;
        this.Name = '';
        this.Description = '';
        this.IsNaturalLight = false;
        this.Exits = [];
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

        let newItems = new ItemList();
        if (this.Items !== undefined) {
            this.Items.forEach(itemId => {
                newItems.add(Game.spawnItem(itemId));
            });
        }
        this.Items = newItems;

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

    hasLightSource() {
        if (this.IsNaturalLight === true) {
            return true;
        }
        if (this.getItems().hasLightSource()) {
            return true;
        }
        //TODO: Lista postaci
        //if (this.getCharacters().hasLightSource()) {
        //    return true;
        //}

        return false;
    }
};