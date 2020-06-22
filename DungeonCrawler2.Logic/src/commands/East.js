"use strict";
class East extends Command {
    ExecuteBody(command, commandCallback) {
        Commands.Go.goToDirection(Directions.east, commandCallback);
    }
};