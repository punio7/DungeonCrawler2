"use strict";
class South extends Command {
    ExecuteBody(command, commandCallback) {
        Commands.Go.goToDirection(Directions.south, commandCallback);
    }
};