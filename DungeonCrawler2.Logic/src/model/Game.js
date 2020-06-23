"use strict";
class GameModel {
    constructor(template) {
        if (template === undefined) {
            return;
        }

        this.Name = '';
        this.StartingRoom = 0;
        this.Rooms = [];

        this.ItemFactory = new ItemFactory();

        Object.assign(this, template);
        this.Player = new Player(this.Player);

        for (var i = 0; i < this.Rooms.length; i++) {
            this.Rooms[i] = new Room(this.Rooms[i]);
            if (this.Rooms[i].Id !== i) {
                throw 'Room with Id {0} is placed on index {1}, fix Rooms data'.format(this.Rooms[i].Id, i);
            }
        }
    };

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
            room.LoadRoomData();
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
     * @param {string} characterId
     * @returns {Character}
     */
    SpawnCharacter(characterId) {
        let template = GameData.CharacterTemplates.getTemplate(characterId);
        return new Character(template);
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
     */
    InvokeGlobalEvent(name, args) {
        let event = GlobalEvents[name];
        if (event === undefined || typeof event !== "function") {
            throw "Global event with name {0} doesn't exist".format(name);
        }

        return event(args);
    }
};

var Game = new GameModel();