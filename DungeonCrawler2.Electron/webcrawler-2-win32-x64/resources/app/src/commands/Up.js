"use strict";
class Up extends Command {
    ExecuteBody(command) {
        Commands.Go.goToDirection(Directions.up);
    }
};