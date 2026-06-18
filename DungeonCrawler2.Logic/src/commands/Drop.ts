import { CommandParser } from '../commandsUtils/CommandParser';
import { GramaCase } from '../enums/GramaCase';
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
            let count = command.getCount(1);

            if (item.isStackable() && count !== null && count < item.getStack()) {
                this.dropCount(item, count);
            } else {
                this.dropItem(item);
            }
        }
    }

    dropAll() {
        while (Game.Player.getInventory().any()) {
            this.dropItem(Game.Player.getInventory().elementAt(0)!);
        }
    }

    dropItem(item: Item) {
        Game.Player.getInventory().remove(item);
        Game.getRoom(Game.Player.Location).getItems().add(item);
        Engine.Output(Local.Commands.Drop.Dropped.format(item.getName(GramaCase.Biernik)));
    }

    dropCount(item: Item, count: number) {
        item.addStack(-count);
        let newItem = new Item();
        //newItem.loadFromSave(item);
        newItem.Id = item.Id;
        newItem.setStack(count);
        let roomItems = Game.getRoom(Game.Player.Location).getItems();
        roomItems.add(newItem);
        Engine.Output(Local.Commands.Drop.Dropped.format(newItem.getName(GramaCase.Biernik)));
    }
}
