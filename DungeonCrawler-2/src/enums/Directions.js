"use strict";
class DirectionsEnum {
    constructor() {
        this.north = "north";
        this.south = "south";
        this.east = "east";
        this.west = "west";
        this.up = "up";
        this.down = "down";
    }

    parse(directionString) {
        let parsedDirection = directionString.toLowerCase();
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                if (key.includes(parsedDirection)) {
                    return key;
                }
            }
        }
        return null;
    }
}

var Directions = new DirectionsEnum();
Object.freeze(Directions);