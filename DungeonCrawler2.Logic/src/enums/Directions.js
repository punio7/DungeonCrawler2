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
}

var Directions = new DirectionsEnum();
Object.freeze(Directions);