import { CommandCallback } from '../CommandCallback';
import { CommandParser } from '../CommandParser';
import { GrammaCase } from '../enums/GrammaCase';
import { Game, Local } from '../InitGameData';
import { Character } from '../model/Character';
import { Item } from '../model/Item';
import { Command } from './Command';

export class Exam extends Command {
    ExecuteBody(command: CommandParser): void {
        let room = Game.GetRoom(Game.Player.Location);
        let argument = command.getArgument(0);
        let number = command.getNumber(1);

        if (argument === null) {
            Engine.Output(Local.Commands.Exam.NoArgument);
            return;
        }

        let character = room.getCharacters().find(argument, number);
        if (character !== null) {
            this.examCharacter(character);
            return;
        }

        let item = room.getItems().find(argument, number);
        if (item !== null) {
            this.examItem(item);
            return;
        }

        item = Game.Player.getInventory().find(argument, number);
        if (item !== null) {
            this.examItem(item);
            return;
        }

        Engine.Output(Local.Commands.Exam.NoObject.format(argument));
    }

    examCharacter(character: Character) {
        Engine.Output(Local.Commands.Look.YouLookAt.format(character.getName(GrammaCase.Celownik)));
        Engine.Output(character.getDescription());

        //TODO: stan zdrowia
    }
    examItem(item: Item) {
        Engine.Output(Local.Commands.Look.YouLookAt.format(item.getName(GrammaCase.Celownik)));
        Engine.Output(item.getDescription());
        if (item.isContainer()) {
            Engine.Output(Local.Commands.Exam.Contains);
            let items = item.getInventory()!;
            if (items.any()) {
                Engine.Output(items.printLongFormat());
            } else {
                Engine.Output(Local.Commands.Inventory.NoItems.format(Engine.NonBreakingSpace.repeat(4)));
            }
        }
    }
}
