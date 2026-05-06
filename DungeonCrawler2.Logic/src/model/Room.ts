import { Direction, DirectionHelper } from '../enums/Direction';
import { CharacterList } from './CharacterList';
import { GameData } from './GameData';
import { ItemList } from './ItemList';
import { RoomExit } from './RoomExit';
import { RoomExitsList } from './RoomExitsList';

export class Room {
    Id: number = 0;
    Exits: RoomExitsList = new RoomExitsList();
    IsVisited: boolean = false;
    Items: ItemList = new ItemList();
    Characters: CharacterList = new CharacterList();

    constructor() {}

    getTemplate() {
        return GameData.RoomTemplates.getTemplate(this.Id);
    }

    getName() {
        return this.getTemplate().Name;
    }

    getDescription() {
        return this.getTemplate().Description;
    }

    getItems() {
        return this.Items;
    }

    getCharacters() {
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
        if (this.getTemplate().IsNaturalLight) {
            return true;
        }
        if (this.getItems().hasLightSource()) {
            return true;
        }
        return this.getCharacters().hasLightSource();
    }

    getOnFirstEnterEvent() {
        if (this.getTemplate().OnFirstEnterEvent === undefined) {
            return null;
        }
        return this.getTemplate().OnFirstEnterEvent;
    }

    getOnEnterEvent() {
        if (this.getTemplate().OnEnterEvent === undefined) {
            return null;
        }
        return this.getTemplate().OnEnterEvent;
    }
}
