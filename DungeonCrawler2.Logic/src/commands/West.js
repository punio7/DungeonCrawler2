"use strict";
class West extends Command {
    ExecuteBody(command, commandCallback) {
        Commands.Go.goToDirection(Directions.west, commandCallback);
    }
};