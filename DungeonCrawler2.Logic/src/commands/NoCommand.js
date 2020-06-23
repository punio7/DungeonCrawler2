"use strict";
class NoCommand extends Command {
    ExecuteBody(command) {
        Engine.Output(Local.Commands.NoCommand.NoCommand);
    }
};