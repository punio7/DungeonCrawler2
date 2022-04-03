import { Direction, DirectionHelper } from '../enums/Direction';
import { CharacterList } from './CharacterList';
import { ItemList } from './ItemList';
import { RoomExit } from './RoomExit';
import { RoomExitsList } from './RoomExitsList';

export class Room {
    Id: number;
    Name: string;
    Description: string;
    IsNaturalLight: boolean;
    Exits: RoomExitsList;
    IsVisited: boolean;
    OnFirstEnterEvent: any;
    IsLoaded: boolean;
    Items: ItemList;
    Characters: CharacterList;
    OnEnterEvent: any;
    constructor() {
        this.Id = 0;
        this.Name = '';
        this.Description = '';
        this.IsNaturalLight = false;
        this.Exits = {};
        this.IsVisited = false;
        this.OnFirstEnterEvent = null;
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

    getExit(direction: Direction): RoomExit | null {
        if (this.Exits[direction] === undefined) {
            return null;
        }
        return this.Exits[direction];
    }

    getExitsDirections(): Direction[] {
        return DirectionHelper.parseArray(Object.keys(this.Exits));
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
}
