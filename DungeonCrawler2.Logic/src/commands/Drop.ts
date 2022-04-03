import { CommandParser } from '../CommandParser';
import { GrammaCase } from '../enums/GrammaCase';
import { Game, Local } from '../InitGameData';
import { Item } from '../model/Item';
import { Command } from './Command';

export class Drop extends Command {
    ExecuteBody(command: CommandParser) {
        let argument = command.getArgument(1);
        if (argument === null) {
            Engine.Output(Local.Commands.Drop.NoArgument);
            return;
        }

        if (argument.toLowerCase() === 'all') {
            if (!Game.Player.getInventory().any()) {
                Engine.Output(Local.Commands.Drop.NoItems);
                return;
            }

            this.dropAll();
        } else {
            let item = Game.Player.getInventory().find(argument, command.getNumber(1));
            if (item === null) {
                Engine.Output(Local.Commands.Drop.NoItemFound.format(argument));
                return;
            }

            this.dropItem(item);
        }
    }

    dropAll() {
        while (Game.Player.getInventory().any()) {
            this.dropItem(Game.Player.getInventory().elementAt(0)!);
        }
    }

    dropItem(item: Item) {
        Game.Player.getInventory().remove(item);
        Game.GetRoom(Game.Player.Location).getItems().add(item);
        Engine.Output(Local.Commands.Drop.Dropped.format(item.getName(GrammaCase.Biernik)));
    }
}
