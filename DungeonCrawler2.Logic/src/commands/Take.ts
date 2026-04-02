import {CommandParser} from '../CommandParser';
import {GrammaCase} from '../enums/GrammaCase';
import {Game, Local} from '../InitGameData';
import {Item} from '../model/Item';
import {ItemList} from '../model/ItemList';
import {Command} from './Command';

export class Take extends Command {
    ExecuteBody(command: CommandParser) {
        let argument1 = command.getArgument(1);
        if (argument1 === null) {
            Engine.Output(Local.Commands.Take.NoArgument);
            return;
        }
        
        let number1 = command.getNumber(1);
        let argument2 = command.getArgument(2);
        if (argument2 === null) {   //pick up item from location
            if (argument1.toLowerCase() === 'all') {
                if (!Game.GetRoom(Game.Player.Location).getItems().any()) {
                    Engine.Output(Local.Commands.Take.NoItems);
                    return;
                }
                this.takeAllFromLocation();
            } else {
                let itemList = Game.GetRoom(Game.Player.Location).getItems();
                let item = itemList.find(argument1, number1);
                if (item === null) {
                    Engine.Output(Local.Commands.Take.NoItemFound.format(argument1));
                    return;
                }
                this.takeItemFromLocation(item, itemList);
            }
        } else {    //take item from container
            let number2 = command.getNumber(2);
            let container = Game.Player.getInventory().find(argument2, number2);
            if (container !== null) {
                this.takeItemFromContainer(argument1, number1, container);
                return;
            }
            
            let itemList = Game.GetRoom(Game.Player.Location).getItems();
            container = itemList.find(argument2, number2);
            if (container !== null) {
                this.takeItemFromContainer(argument1, number1, container);
                return;
            }

            Engine.Output(Local.Commands.Take.NoItemFound.format(argument2));
        }
    }

    takeItemFromContainer(name: string, number: number, container: Item) {
        if (!container.isContainer()) {
            Engine.Output(Local.Commands.Take.IsNoContainer.format(container.getName().startWithUpper()));
            return;
        }
        if (container.isLocked()) {
            Engine.Output(Local.Commands.Take.ContainerIsLocked.format(container.getName().startWithUpper()));
            return;
        }
        
        let item = container.getInventory()!.find(name, number);
        if (item === null) {
            Engine.Output(Local.Commands.Take.NoItemFoundInContainer.format(container.getName().startWithUpper(), name));
            return;
        }
        this.takeItem(item, container.getInventory()!)
        Engine.Output(Local.Commands.Take.TakeItemFromContainer.format(item.getName(), container.getName(GrammaCase.Celownik).startWithUpper()));
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
        for (let item = itemList.elementAt(i); item != null; item = itemList.elementAt(i)) {
            if (!this.takeItemFromLocation(item, itemList)) {
                i++;
            }
        }
    }

    takeAllGold(container: Item) {
        let itemList = container.getInventory()!;
        let gold: Item | null = null;
        while ((gold = itemList.findById("gold")) !== null) {
            this.takeItem(gold, itemList)
            Engine.Output(Local.Commands.Take.TakeItemFromContainer.format(gold.getName(), container.getName(GrammaCase.Celownik).startWithUpper()));
        }
    }

    takeItem(item: Item, itemList: ItemList) {
        itemList.remove(item);
        Game.Player.getInventory().add(item);
    }
}
