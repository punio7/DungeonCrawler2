"use strict";
class Look extends Command {
    ExecuteBody(command) {
        let room = Game.getRoom(Game.Player.Location);

        if (!Game.Player.canSee()) {
            Engine.Output("Nic nie widzisz w tej ciemności.");
            return;
        }

        if (command.getArgument(1) === null) {
            this.lookRoom(room);
            return;
        }

        let character = room.getCharacters().find(command.getArgument(1), command.getNumber(1));
        if (character !== null) {
            this.lookCharacter(character);
            return;
        }

        let item = room.getItems().find(command.getArgument(1), command.getNumber(1));
        if (item !== null) {
            this.lookItem(item);
            return;
        }

        item = Game.Player.getInventory().find(command.getArgument(1), command.getNumber(1));
        if (item !== null) {
            this.lookItem(item);
            return;
        }

        Engine.Output("Tu nie ma nic takiego jak {0}.".format(command.getArgument(1)));
    }

    lookRoom(room) {
        let message = "";
        message += room.getName() + Engine.EndLine;
        message += this.exitsString(room.Exits) + Engine.EndLine;
        message += Engine.EndLine;
        message += room.Description;
        if (room.getCharacters().any()) {
            message += Engine.EndLine + Engine.EndLine + room.getCharacters().printLongFormat(false);
        }
        if (room.getItems().any()) {
            if (!room.getCharacters().any()) {
                message += Engine.EndLine;
            }
            message += Engine.EndLine + room.getItems().printLongFormat(true);
        }
        Engine.Output(message);
    }

    lookItem(item) {
        Engine.Output("Przyglądasz się {0}.".format(item.getName(GrammaCase.Celownik)));
        Engine.Output(item.getDescription());
    }

    lookCharacter(character) {
        Engine.Output("Przyglądasz się {0}.".format(character.getName(GrammaCase.Celownik)));
        Engine.Output(character.getDescription());
        //TODO: stan zdrowia
    }

    exitsString(exits) {
        let returnString = "|gWyjścia: [ "
        let firstExit = true;
        for (const direction in exits) {
            if (exits.hasOwnProperty(direction)) {
                if (!firstExit) {
                    returnString += ", ";
                }
                firstExit = false;
                returnString += Directions.getLocale(direction);
            }
        }
        returnString += " ]|W";
        return returnString;
    }
};