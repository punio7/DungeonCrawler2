"use strict";
class Player {
    constructor() {
        this.Location = 0;
    }

    canSee() {
        let room = Game.getRoom(this.Location);
        return room.hasLightSource();
    }
};