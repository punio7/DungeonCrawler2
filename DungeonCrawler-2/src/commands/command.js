"use strict";
class Command {
    constructor() {
        this.game = null;
    };
    Execute(game, command) {
        this.game = game;
        this.ExecuteBody(command);
    };
    ExecuteBody(command) {

    }
}