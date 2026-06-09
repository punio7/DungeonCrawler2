import { CommandParser } from '../commandsUtils/CommandParser';
import { GramaCase } from '../enums/GramaCase';
import { Game, Local } from '../InitGameData';
import { Command } from './Command';
import { Item } from '../model/Item';
import { EquipmentSlot } from '../enums/EquipmentSlot';

export class Remove extends Command {
    ExecuteBody(command: CommandParser) {
        let argument1 = command.getArgument(1);
        if (argument1 === null) {
            Engine.Output(Local.Commands.Remove.NoArgument);
            return;
        }

        if (argument1.toLowerCase() === 'all') {
            this.removeAll();
            return;
        }

        let number1 = command.getNumber(1);
        let foundInEq = Game.Player.getEquipment().find(argument1, number1);
        if (foundInEq === null) {
            Engine.Output(Local.Commands.Remove.ItemNotFound.format(argument1));
            return;
        }

        let [item, itemSlot] = foundInEq;

        this.remove(itemSlot, item);
    }

    removeAll() {
        let equipment = Game.Player.getEquipment();
        for (const eqSlot in equipment.List) {
            let item = equipment.List[eqSlot];
            this.remove(eqSlot as EquipmentSlot, item);
        }
    }

    public remove(itemSlot: EquipmentSlot, item: Item) {
        Game.Player.getEquipment().remove(itemSlot);
        Game.Player.getInventory().add(item);
        Engine.Output(Local.Commands.Remove.Removed.format(item.getName(GramaCase.Biernik)));
    }
}
