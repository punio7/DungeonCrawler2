"use strict";
class Test extends Command {
    ExecuteBody(command) {
        Engine.Output(command.getCommand() + " " + command.getNumber(1) + command.getArgument(1) + " " + command.getNumber(2) + command.getArgument(2) + " " + Game.getName() + " aaa");
        throw "Test exception";
    }
};