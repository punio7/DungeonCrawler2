import { CommandParser } from '../commandsUtils/CommandParser';
import { GramaCase } from '../enums/GramaCase';
import { Game, Local } from '../InitGameData';
import { Command } from './Command';
import { ItemType } from '../enums/ItemType';
import { EquipmentSlot } from '../enums/EquipmentSlot';
import { Commands } from '../commandsUtils/CommandsManager';
import { PlayerState } from '../enums/PlayerState';

export class Hold extends Command {
    get acceptableStates() {
        return [PlayerState.Standing, PlayerState.Fighting];
    }

    ExecuteBody(command: CommandParser) {
        let argument1 = command.getArgument(1);
        if (argument1 === null) {
            Engine.Output(Local.Commands.Hold.NoArgument);
            return;
        }

        let number1 = command.getNumber(1);
        let item = Game.Player.getInventory().find(argument1, number1);
        if (item === null) {
            Engine.Output(Local.Commands.Hold.NoItemFound.format(argument1));
            return;
        }

        let slot = item.getEquipmentSlot();
        if (slot === EquipmentSlot.MainHand) {
            slot = EquipmentSlot.OffHand;
        }
        if (slot == null || (slot !== EquipmentSlot.OffHand && slot !== EquipmentSlot.Torch)) {
            Engine.Output(
                Local.Commands.Hold.ItemNotEquippable.format(item.getName(GramaCase.Dopelniacz).startWithUpper()),
            );
            return;
        }

        let itemType = item.getType();
        if (itemType !== ItemType.Weapon1H && itemType !== ItemType.Shield && itemType !== ItemType.Torch) {
            Engine.Output(
                Local.Commands.Hold.ItemNotEquippable.format(item.getName(GramaCase.Dopelniacz).startWithUpper()),
            );
            return;
        }

        let holdingItem = Game.Player.getEquipment().get(slot);
        if (holdingItem !== null) {
            Commands.Remove.remove(slot, holdingItem);
        }

        Commands.Wear.equipItem(item, slot);
        Engine.Output(Local.Commands.Hold.Equipped.format(item.getName(GramaCase.Biernik)));
    }
}
