import { GlobalEvents } from '../GlobalEvents';
import { Character } from './Character';
import { GameData } from './GameData';
import { GlobalEventArgs } from './GlobalEventArgs';
import { Item } from './Item';
import { Player } from './Player';
import { Room } from './Room';
import { RoomFactory } from '../factories/RoomFactory';
import { ItemFactory } from '../factories/ItemFactory';
import { CharacterFactory } from '../factories/CharacterFactory';

export class GameModel {
    Name: string;
    StartingRoom: number;
    Rooms: Room[];
    ItemFactory: ItemFactory;
    CharacterFactory: CharacterFactory;
    RoomFactory: RoomFactory;
    Player = new Player(undefined);

    constructor() {
        this.Name = '';
        this.StartingRoom = 0;
        this.Rooms = [];

        this.ItemFactory = new ItemFactory();
        this.CharacterFactory = new CharacterFactory();
        this.RoomFactory = new RoomFactory();
    }

    getName() {
        return this.Name;
    }

    getRoom(roomId: number): Room {
        let room = this.Rooms[roomId];
        if (room === undefined) {
            const roomTemplate = GameData.RoomTemplates.getTemplate(roomId);
            room = this.Rooms[roomId] = this.RoomFactory.spawnRoom(roomTemplate);
            this.RoomFactory.loadFromData(room);
        }
        return room;
    }

    spawnItem(itemDefinition: any): Item | null {
        return this.ItemFactory.spawnItem(itemDefinition);
    }

    spawnCharacter(characterId: string): Character {
        return this.CharacterFactory.spawnCharacter(characterId);
    }

    getItemType(itemTypeName: string): string {
        return GameData.ItemTypes.getItemType(itemTypeName);
    }

    invokeGlobalEvent(name: string, args: GlobalEventArgs): boolean {
        let event = GlobalEvents[name];
        if (event === undefined || typeof event !== 'function') {
            throw "Global event with name {0} doesn't exist".format(name);
        }

        return event(args);
    }
}
