"use strict";
class NoCommand extends Command {
    ExecuteBody(command) {
        Engine.Output("Chyba ty.");
    }
};