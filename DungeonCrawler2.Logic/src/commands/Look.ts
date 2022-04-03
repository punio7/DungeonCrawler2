import { CommandParser } from '../CommandParser';
import { Direction, DirectionHelper } from '../enums/Direction';
import { GrammaCase } from '../enums/GrammaCase';
import { Game, Local } from '../InitGameData';
import { Character } from '../model/Character';
import { Item } from '../model/Item';
import { Room } from '../model/Room';
import { Command } from './Command';

export class Look extends Command {
    ExecuteBody(command: CommandParser) {
        let room = Game.GetRoom(Game.Player.Location);

        if (!Game.Player.canSee()) {
            Engine.Output(Local.Commands.Look.CantSee);
            return;
        }

        let argument = command.getArgument(1);
        if (argument === null) {
            this.lookRoom(room);
            return;
        }

        let character = room.getCharacters().find(argument, command.getNumber(1));
        if (character !== null) {
            this.lookCharacter(character);
            return;
        }

        let item = room.getItems().find(argument, command.getNumber(1));
        if (item !== null) {
            this.lookItem(item);
            return;
        }

        item = Game.Player.getInventory().find(argument, command.getNumber(1));
        if (item !== null) {
            this.lookItem(item);
            return;
        }

        Engine.Output(Local.Commands.Look.NoObject.format(command.getArgument(1)));
    }

    lookRoom(room: Room) {
        let message = '';
        message += room.getName() + Engine.EndLine;
        message += this.exitsString(room) + Engine.EndLine;
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

    private lookItem(item: Item) {
        Engine.Output(Local.Commands.Look.YouLookAt.format(item.getName(GrammaCase.Celownik)));
        Engine.Output(item.getDescription());
    }

    lookCharacter(character: Character) {
        Engine.Output(Local.Commands.Look.YouLookAt.format(character.getName(GrammaCase.Celownik)));
        Engine.Output(character.getDescription());
        //TODO: stan zdrowia
    }

    exitsString(room: Room): string {
        let returnString = '|g' + Local.Commands.Look.Exits + ': [ ';
        let firstExit = true;
        let directions = room.getExitsDirections();
        directions.forEach((direction) => {
            if (!firstExit) {
                returnString += ', ';
            }
            firstExit = false;
            returnString += DirectionHelper.getLocale(direction);
        });
        returnString += ' ]|W';
        return returnString;
    }
}
