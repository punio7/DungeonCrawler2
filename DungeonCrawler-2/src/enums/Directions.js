"use strict";
class DirectionsEnum {
    constructor() {
        this.North = "north";
        this.South = "south";
        this.East = "east";
        this.West = "west";
        this.Up = "up";
        this.Down = "down";
    }

    parse(directionString) {
        let parsedDirection = directionString.toLowerCase();
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const value = this[key];
                if (value.includes(parsedDirection)) {
                    return value;
                }
            }
        }
        return null;
    }
}

var Directions = new DirectionsEnum();
Object.freeze(Directions);