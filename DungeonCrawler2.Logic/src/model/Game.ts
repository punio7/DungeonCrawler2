import { CharacterFactory } from '../commonLogic/CharacterFactory';
import { ItemFactory } from '../commonLogic/ItemFactory';
import { RoomFactory } from '../commonLogic/RoomFactory';
import { GlobalEvents } from '../GlobalEvents';
import { GameTemplate } from '../templates/GameTemplate';
import { Character } from './Character';
import { GameData } from './GameData';
import { GlobalEventArgs } from './GlobalEventArgs';
import { Item } from './Item';
import { Player } from './Player';
import { Room } from './Room';
import { GameTemplate as Template } from '../../res/Game.json';
import { RoomTemplate } from '../templates/RoomTemplate';
import { CharacterTemplate } from '../templates/CharacterTemplate';

export class GameModel {
    Name: string;
    StartingRoom: number;
    Rooms: any[];
    ItemFactory: ItemFactory;
    CharacterFactory: CharacterFactory;
    RoomFactory: RoomFactory;
    Player: Player;

    constructor() {
        this.Name = '';
        this.StartingRoom = 0;
        this.Rooms = [];

        this.ItemFactory = new ItemFactory();
        this.CharacterFactory = new CharacterFactory();
        this.RoomFactory = new RoomFactory();
    }

    LoadFromTemplate() {
        //Object.assign(this, template);
        let player = new Player(undefined);
        //this.CharacterFactory.LoadFromTemplate(player, this.Player);
        this.Player = player;

        for (var i = 0; i < Template.Rooms.length; i++) {
            this.Rooms[i] = this.RoomFactory.SpawnRoom(Template.Rooms[i] as RoomTemplate);
            if (this.Rooms[i].Id !== i) {
                throw 'Room with Id {0} is placed on index {1}, fix Rooms data'.format(this.Rooms[i].Id, i);
            }
        }
    }

    getName() {
        return this.Name;
    }

    GetRoom(roomId: number): Room {
        let room = this.Rooms[roomId];
        if (room === undefined) {
            throw 'Invalid Room Id: {0}'.format(roomId);
        }
        if (!room.isLoaded()) {
            this.RoomFactory.LoadRoomData(room, Template.Rooms[roomId] as RoomTemplate);
        }
        return room;
    }

    SpawnItem(itemDefinition: any): Item | null {
        return this.ItemFactory.spawnItem(itemDefinition);
    }

    LoadItemFromSave(saveItem: any): Item {
        return this.ItemFactory.LoadFromSave(saveItem);
    }

    SpawnCharacter(characterId: string): Character {
        return this.CharacterFactory.SpawnCharacter(characterId);
    }

    LoadCharacterFromSave(saveCharacter: any): Character {
        return this.CharacterFactory.LoadFromSave(saveCharacter);
    }

    GetItemType(itemTypeName: string): string {
        return GameData.ItemTypes.GetItemType(itemTypeName);
    }

    InvokeGlobalEvent(name: string, args: GlobalEventArgs): boolean {
        let event = GlobalEvents[name];
        if (event === undefined || typeof event !== 'function') {
            throw "Global event with name {0} doesn't exist".format(name);
        }

        return event(args);
    }
}
