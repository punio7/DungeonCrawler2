"use strict";
class Test extends Command {
    ExecuteBody(command) {
        Engine.Output(command.getCommand() + " " + this.game.name);
    }
};