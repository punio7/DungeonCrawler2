import { CommandParser } from '../CommandParser';
import { GrammaCase } from '../enums/GrammaCase';
import { Game, Local } from '../InitGameData';
import { Item } from '../model/Item';
import { ItemList } from '../model/ItemList';
import { Command } from './Command';

export class Take extends Command {
    ExecuteBody(command: CommandParser) {
        let argument1 = command.getArgument(1);
        if (argument1 === null) {
            Engine.Output(Local.Commands.Take.NoArgument);
            return;
        }

        if (command.getArgument(2) === null) {
            if (argument1.toLowerCase() === 'all') {
                if (!Game.GetRoom(Game.Player.Location).getItems().any()) {
                    Engine.Output(Local.Commands.Take.NoItems);
                    return;
                }
                this.takeAllFromLocation();
            } else {
                let itemList = Game.GetRoom(Game.Player.Location).getItems();
                let item = itemList.find(argument1, command.getNumber(1));
                if (item === null) {
                    Engine.Output(Local.Commands.Take.NoItemFound.format(argument1));
                    return;
                }
                this.takeItemFromLocation(item, itemList);
            }
        } else {
            //TODO: Take from container
            Engine.Output('​¯\\_(ツ)_/¯');
        }
    }

    takeItemFromLocation(item: Item, itemList: ItemList) {
        if (!item.isTakeable()) {
            Engine.Output(Local.Commands.Take.CannotPickUp.format(item.getName(GrammaCase.Dopelniacz)));
            return false;
        }

        this.takeItem(item, itemList);
        Engine.Output(Local.Commands.Take.PickedUp.format(item.getName(GrammaCase.Biernik)));
        return true;
    }

    takeAllFromLocation() {
        let itemList = Game.GetRoom(Game.Player.Location).getItems();
        let i = 0;
        for (var item = itemList.elementAt(i); item != null; item = itemList.elementAt(i)) {
            if (!this.takeItemFromLocation(item, itemList)) {
                i++;
            }
        }
    }

    takeItem(item: Item, itemList: ItemList) {
        itemList.remove(item);
        Game.Player.getInventory().add(item);
    }
}
