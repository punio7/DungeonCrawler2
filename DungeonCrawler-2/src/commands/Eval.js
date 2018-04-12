"use strict";
class Eval extends Command {
    ExecuteBody(command) {
        Engine.Output(eval(command.getArgument(1)));
    }
};