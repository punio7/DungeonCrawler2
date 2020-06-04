"use strict";
class DirectionsEnum extends EnumBase {
    constructor() {
        super();
        this.north = "north";
        this.south = "south";
        this.east = "east";
        this.west = "west";
        this.up = "up";
        this.down = "down";
    }

    getLocale(direction, grammaCase = GrammaCase.Mianownik) {
        if (!this.contains(direction)) {
            throw 'Invalid direction {0}'.format(direction);
        }

        return DirectionsLocales[direction][grammaCase];
    }
}

var Directions = new DirectionsEnum();
Object.freeze(Directions);