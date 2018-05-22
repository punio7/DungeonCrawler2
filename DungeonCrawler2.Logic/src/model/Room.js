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
        this.Items.forEach(itemId => {
            newItems.Add(Game.spawnItem(itemId));
        });
        this.Items = newItems;
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
    }

    hasLightSource() {
        if (this.IsNaturalLight === true) {
            return true;
        }
        if (this.getItems().HasLightSource()) {
            return true;
        }
        //TODO: characters

        return false;
    }
};