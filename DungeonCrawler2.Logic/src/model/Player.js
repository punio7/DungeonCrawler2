"use strict";
class Player extends Character {
    constructor(template) {
        super(template);

        if (this.Location === undefined) {
            this.Location = 0;
        }
        if (this.PreviousLocation === undefined) {
            this.PreviousLocation = 0;
        }
    }

    /**@returns {number} Get Player's current location*/
    getLocation() {
        return this.Location;
    }

    /**
     * 
     * @param {number} value Set Player's current location
     */
    setLocation(value) {
        this.Location = value;
    }

    /**@returns {number} Get Player's previous location*/
    getPreviousLocation() {
        return this.PreviousLocation;
    }

    /**
     * 
     * @param {any} value Set Player's previous location
     */
    setPreviousLocation(value) {
        this.PreviousLocation = value;
    }

    /**@returns {boolean} Returns true if player can see in current location*/
    canSee() {
        let room = Game.GetRoom(this.Location);
        return room.hasLightSource();
    }
};