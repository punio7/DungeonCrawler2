"use strict";
class North extends Command {
    ExecuteBody(command, commandCallback) {
        Commands.Go.goToDirection(Directions.north, commandCallback);
    }
};