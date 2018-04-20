"use strict";
class Look extends Command {
    ExecuteBody(command) {
        if (command.getArgument(1) == null) {
            let room = Game.getRoom(Game.Player.Location);
            this.LookRoom(room);
        }
        
    }

    LookRoom(room) {
        let message = "";
        message += this.exitsString(room.Exits) + Engine.EndLine;
        message += Engine.EndLine;
        message += room.Description;
        if (room.getItems().length > 0) {
            message += Engine.EndLine + Engine.EndLine + ItemsListPrinter.PrintLongFormat(room.getItems());
        }
        Engine.Output(message);
    }

    exitsString(exits) {
        let returnString = "Wyjścia: [ "
        let firstExit = true;
        for (const direction in exits) {
            if (exits.hasOwnProperty(direction)) {
                if (!firstExit) {
                    returnString += ", ";
                }
                firstExit = false;
                returnString += this.directionLocale(direction);
            }
        }
        returnString += " ]";
        return returnString;
    }

    directionLocale(direction) {
        let locale = {
            north: "północ",
            south: "południe",
            east: "wschód",
            west: "zachód",
            up: "góra",
            down: "dół"
        }

        return locale[direction];
    }
};