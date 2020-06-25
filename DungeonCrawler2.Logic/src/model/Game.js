"use strict";
class GameModel {
    constructor() {
        this.Name = '';
        this.StartingRoom = 0;
        this.Rooms = [];

        this.ItemFactory = new ItemFactory();
        this.CharacterFactory = new CharacterFactory();
        this.RoomFactory = new RoomFactory();
    }

    LoadFromTemplate(template) {
        Object.assign(this, template);
        let player = new Player();
        this.CharacterFactory.LoadFromTemplate(player, this.Player);
        this.Player = player;

        for (var i = 0; i < this.Rooms.length; i++) {
            this.Rooms[i] = this.RoomFactory.SpawnRoom(this.Rooms[i]);
            if (this.Rooms[i].Id !== i) {
                throw 'Room with Id {0} is placed on index {1}, fix Rooms data'.format(this.Rooms[i].Id, i);
            }
        }
    }

    getName() {
        return this.Name;
    }

    /**
     * 
     * @param {number} roomId
     * @returns {Room}
     */
    GetRoom(roomId) {
        let room = this.Rooms[roomId];
        if (room === undefined) {
            throw 'Invalid Room Id: {0}'.format(roomId);
        }
        if (!room.isLoaded()) {
            this.RoomFactory.LoadRoomData(room);
        }
        return room;
    }

    /**
     * 
     * @param {any} itemDefinition
     * @returns {Item}
     */
    SpawnItem(itemDefinition) {
        return this.ItemFactory.SpawnItem(itemDefinition);
    }

    /**
     * 
     * @param {any} saveItem Item object from save data
     * @returns {Item} Item model object
     */
    LoadItemFromSave(saveItem) {
        return this.ItemFactory.LoadFromSave(saveItem);
    }

    /**
     * 
     * @param {string} characterId
     * @returns {Character}
     */
    SpawnCharacter(characterId) {
        return this.CharacterFactory.SpawnCharacter(characterId);
    }

    /**
     * 
     * @param {any} saveCharacter Character object from save data
     * @returns {Character} Character model object
     */
    LoadCharacterFromSave(saveCharacter) {
        return this.CharacterFactory.LoadFromSave(saveCharacter);
    }

    /**
     * 
     * @param {string} itemTypeName
     * @returns {string}
     */
    GetItemType(itemTypeName) {
        return GameData.ItemTypes.GetItemType(itemTypeName);
    }

    /**
     * 
     * @param {string} name
     * @param {GlobalEventArgs} args
     * @returns {boolean} Should current action be interrupted
     */
    InvokeGlobalEvent(name, args) {
        let event = GlobalEvents[name];
        if (event === undefined || typeof event !== "function") {
            throw "Global event with name {0} doesn't exist".format(name);
        }

        return event(args);
    }
};