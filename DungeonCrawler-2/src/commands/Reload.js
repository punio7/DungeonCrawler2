"use strict";
class Reload extends Command {
    ExecuteBody(command) {
        Engine.Reload();
    }
};