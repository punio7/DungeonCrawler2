"use strict";
class Down extends Command {
    ExecuteBody(command) {
        Commands.Go.goToDirection(Directions.down);
    }
};