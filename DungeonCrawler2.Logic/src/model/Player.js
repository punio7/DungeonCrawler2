"use strict";
class Player extends Character {
    constructor() {
        super();
        this.Location = 0;
    }

    canSee() {
        let room = Game.getRoom(this.Location);
        return room.hasLightSource();
    }
};