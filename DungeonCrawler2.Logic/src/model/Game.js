﻿"use strict";
class GameModel {
    constructor(template) {
        if (template === undefined) {
            return;
        }

        this.Name = '';
        this.StartingRoom = 0;
        this.Rooms = [];

        this.Player = new Player();
        this.ItemTypes = new ItemTypesModel();
        this.ItemTemplates = new ItemTemplatesModel();
        this.CharacterTemplates = new CharacterTemplatesModel();
        this.ItemFactory = new ItemFactory();

        Object.assign(this, template);

        for (var i = 0; i < this.Rooms.length; i++) {
            this.Rooms[i] = new Room(this.Rooms[i]);
            if (this.Rooms[i].Id != i) {
                throw 'Room with Id {0} is placed on index {1}, fix Rooms data'.format(this.Rooms[i].Id, i);
            }
        }
    };

    getName() {
        return this.Name;
    }

    getRoom(roomId) {
        let room = this.Rooms[roomId];
        if (room === undefined) {
            throw 'Invalid Room Id: {0}'.format(roomId);
        }
        if (!room.isLoaded()) {
            room.LoadRoomData();
        }
        return room;
    }

    spawnItem(itemDefinition) {
        return this.ItemFactory.spawnItem(itemDefinition);
    }

    spawnCharacter(characterId) {
        let template = this.CharacterTemplates.getTemplate(characterId);
        return new Character(template);
    }

    getItemType(itemTypeName) {
        return this.ItemTypes.getItemType(itemTypeName);
    }

    invokeGlobalEvent(name, args) {
        let event = GlobalEvents[name];
        if (event === undefined || typeof event !== "function") {
            throw "Global event with name {0} doesn't exist".format(name);
        }

        return event(args);
    }
};

var Game = new GameModel();