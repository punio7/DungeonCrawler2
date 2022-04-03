import { Local } from '../InitGameData';
import { EnumHelper } from './EnumHelper';
import { GrammaCase } from './GrammaCase';

export enum Direction {
    north = 'north',
    south = 'south',
    east = 'east',
    west = 'west',
    up = 'up',
    down = 'down',
}

class DirectionHelperClass extends EnumHelper<Direction> {
    constructor() {
        super(Direction);
    }

    getLocale(direction: Direction, grammaCase = GrammaCase.Mianownik) {
        return Local.Directions[direction][grammaCase];
    }
}

export var DirectionHelper = new DirectionHelperClass();
