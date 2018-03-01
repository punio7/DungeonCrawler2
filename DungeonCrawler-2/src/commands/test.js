"use strict";
class Test extends Command {
    ExecuteBody(command) {
        Engine.Output(command.getCommand() + " " + command.getArgument(0) + " " + Game.getName() + " aaa");
        Engine.Output(this instanceof Command);
        throw "Test exception";
    }
};