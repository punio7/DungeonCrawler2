"use strict";
class West extends Command {
    ExecuteBody(command) {
        Commands.Go.goToDirection(Directions.west);
    }
};