import { Local } from '../InitGameData';
import { EnumHelper } from './EnumHelper';
import { GramaCase } from './GramaCase';

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

    getLocale(direction: Direction, grammaCase = GramaCase.Mianownik) {
        return Local.Directions[direction][grammaCase];
    }
}

export var DirectionHelper = new DirectionHelperClass();
