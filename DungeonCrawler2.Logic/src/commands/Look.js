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
        }
        else {
            let item = room.getItems().find(command.getArgument(1), command.getNumber(1));
            if (item !== null) {
                this.lookItem(item);
            }
            else {
                let character = room.getCharacters().find(command.getArgument(1), command.getNumber(1));
                if (character !== null) {
                    this.lookCharacter(character);
                }
                else {
                    Engine.Output("Tu nie ma nic takiego.");
                }
            }
        }
    }

    lookRoom(room) {
        let message = "";
        message += room.getName() + Engine.EndLine;
        message += this.exitsString(room.Exits) + Engine.EndLine;
        message += Engine.EndLine;
        message += room.Description;
        if (room.getCharacters().any()) {
            message += Engine.EndLine + Engine.EndLine + room.getCharacters().printLongFormat();
        }
        if (room.getItems().any()) {
            message += Engine.EndLine + Engine.EndLine + room.getItems().printLongFormat();
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