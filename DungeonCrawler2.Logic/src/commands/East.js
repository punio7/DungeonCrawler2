"use strict";
class East extends Command {
    ExecuteBody(command) {
        Commands.Go.goToDirection(Directions.east);
    }
};