"use strict";
class Room {
    constructor(template) {
        this.Id = 0;
        this.Name = '';
        this.Description = '';
        this.IsNaturalLight = false;
        this.Exits = [];
        this.IsVisited = false;
        Object.assign(this, template);
    }

    LoadRoomData() {
        let exitsModel = {};
        this.Exits.forEach(exit => {
            let direction = exit.Direction;
            exitsModel[direction] = new RoomExit(exit);
        });
        this.Exits = exitsModel;

        this.Items = new ItemList(this.Items);

        if (this.Characters !== undefined) {
            let charactersModel = new CharacterList();
            this.Characters.forEach(characterId => {
                charactersModel.add(Game.SpawnCharacter(characterId));
            });
            this.Characters = charactersModel;
        }

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