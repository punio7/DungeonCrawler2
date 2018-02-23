"use strict";
class GameModel {
    constructor(template) {
        this.Name = '';
        Object.assign(this, template);
    };

    getName() {
        return this.Name;
    }
};