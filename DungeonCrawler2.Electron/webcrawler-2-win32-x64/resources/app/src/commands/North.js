"use strict";
class North extends Command {
    ExecuteBody(command) {
        Commands.Go.goToDirection(Directions.north);
    }
};