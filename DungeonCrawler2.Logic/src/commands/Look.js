"use strict";
class Look extends Command {
    ExecuteBody(command) {
        let room = Game.getRoom(Game.Player.Location);
        if (command.getArgument(1) == null) {
            this.LookRoom(room);
        }
        else {
            let item = room.getItems().Find(command.getArgument(1), command.getNumber(1));
            if (item != null) {
                this.LookItem(item);
            }
            else {
                Engine.Output("Tu nie ma nic takiego.");
            }
        }
    }

    LookRoom(room) {
        let message = "";
        message += this.exitsString(room.Exits) + Engine.EndLine;
        message += Engine.EndLine;
        message += room.Description;
        if (room.getItems().Any()) {
            message += Engine.EndLine + Engine.EndLine + room.getItems().PrintLongFormat();
        }
        Engine.Output(message);
    }

    LookItem(item) {
        Engine.Output(item.getDescription());
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