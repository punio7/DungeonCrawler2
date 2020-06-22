"use strict";
class Down extends Command {
    ExecuteBody(command, commandCallback) {
        Commands.Go.goToDirection(Directions.down, commandCallback);
    }
};