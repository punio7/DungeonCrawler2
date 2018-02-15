"use strict";
class Command {
    constructor() {
        this.game = null;
    };
    execute(game) {
        this.game = game;
        this.executeBody();
    };
    executeBody() {

    }
}