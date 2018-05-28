"use strict";
class South extends Command {
    ExecuteBody(command) {
        Commands.Go.goToDirection(Directions.south);
    }
};