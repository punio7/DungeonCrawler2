"use strict";
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
        if (typeof itemDefinition === "string") {
            let template = this.ItemTemplates.getTemplate(itemDefinition);
            return new Item(template);
        }
        else {
            if (itemDefinition.Chance !== undefined) {
                if (Random.nextInt(1, 100) > itemDefinition.Chance) {
                    return null;
                }
            }

            let templateId = null;
            if (typeof itemDefinition.ItemId === "string") {
                templateId = itemDefinition.ItemId;
            }
            else {
                templateId = this.resolveRandomTemplateId(itemDefinition);
                if (templateId === null) {
                    return null;
                }
            }

            let template = this.ItemTemplates.getTemplate(templateId);
            let item = new Item(template);
            item.setStack(this.stackValue(itemDefinition, templateId));
            return item;
        }

    }

    resolveRandomTemplateId(itemDefinition) {
        if (itemDefinition.ChanceList === undefined) {
            itemDefinition.ChanceList = [];
            itemDefinition.ItemId.forEach(() => {
                itemDefinition.ChanceList.push(1);
            })
        }
        if (itemDefinition.ItemId.length !== itemDefinition.ChanceList.length) {
            throw "Item definition has {0} specified ids but only {1} spiecified chances in ChanceList"
                .format(itemDefinition.ItemId.length, itemDefinition.ChanceList.length);
        }

        let chanceSum = itemDefinition.ChanceList.reduce((a, b) => a + b);
        let selectedCahnce = Random.nextInt(1, chanceSum);
        chanceSum = 0;
        for (var i = 0; i < itemDefinition.ChanceList.length; i++) {
            chanceSum += itemDefinition.ChanceList[i];
            if (selectedCahnce <= chanceSum) {
                return itemDefinition.ItemId[i];
            }
        }

        return null;
    }

    stackValue(itemDefinition, selectedItemId) {
        let stack = itemDefinition.Stack;
        if (Array.isArray(stack)) {
            let stackIndex = itemDefinition.ItemId.indexOf(selectedItemId);
            stack = stack[stackIndex];
        }

        if (stack === undefined || stack === null) {
            return 1;
        }
        if (typeof stack === "number") {
            return stack;
        }
        else {
            return Random.nextInt(stack.Min, stack.Max);
        }
    }

    spawnCharacter(characterId) {
        let template = this.CharacterTemplates.getTemplate(characterId);
        return new Character(template);
    }

    getItemType(itemTypeName) {
        return this.ItemTypes.getItemType(itemTypeName);
    }
};

var Game = new GameModel();