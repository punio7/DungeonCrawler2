"use strict";
class Json extends Command {
    ExecuteBody(command) {
        Engine.Output(JSON.stringify(eval(command.getArgument(1))));
    }
};