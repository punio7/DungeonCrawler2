"use strict";
class Test extends Command {
    ExecuteBody(command) {
        Engine.Output(command.getCommand() + " " + command.getArgument(0) + " " + this.game.getName() + " aaa");
        Engine.Output(this instanceof Command);
        throw "Test exception";
    }
};