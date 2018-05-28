"use strict";
class Player extends Character {
    constructor() {
        super();
        this.Location = 0;
        this.PreviousLocation = 0;
    }

    getLocation() {
        return this.Location;
    }

    setLocation(value) {
        this.Location = value;
    }

    getPreviousLocation() {
        return this.PreviousLocation;
    }

    setPreviousLocation(value) {
        this.PreviousLocation = value;
    }

    canSee() {
        let room = Game.getRoom(this.Location);
        return room.hasLightSource();
    }
};