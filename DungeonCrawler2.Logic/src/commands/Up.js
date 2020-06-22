"use strict";
class Up extends Command {
    ExecuteBody(command, commandCallback) {
        Commands.Go.goToDirection(Directions.up, commandCallback);
    }
};