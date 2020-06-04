"use strict";
class Player extends Character {
    constructor() {
        super();
        this.Location = 0;
        this.PreviousLocation = 0;
    }

    /**@returns {number} */
    getLocation() {
        return this.Location;
    }

    /**
     * 
     * @param {number} value
     */
    setLocation(value) {
        this.Location = value;
    }

    /**@returns {number} */
    getPreviousLocation() {
        return this.PreviousLocation;
    }

    /**@returns {number} */
    setPreviousLocation(value) {
        this.PreviousLocation = value;
    }

    /**@returns {boolean} */
    canSee() {
        let room = Game.getRoom(this.Location);
        return room.hasLightSource();
    }
};