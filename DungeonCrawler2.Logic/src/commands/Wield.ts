import { CommandParser } from '../commandsUtils/CommandParser';
import { GramaCase } from '../enums/GramaCase';
import { Game, Local } from '../InitGameData';
import { Command } from './Command';
import { ItemType } from '../enums/ItemType';
import { EquipmentSlot } from '../enums/EquipmentSlot';
import { Commands } from '../commandsUtils/CommandsManager';

export class Wield extends Command {
    ExecuteBody(command: CommandParser) {
        let argument1 = command.getArgument(1);
        if (argument1 === null) {
            Engine.Output(Local.Commands.Wield.NoArgument);
            return;
        }

        let number1 = command.getNumber(1);
        let item = Game.Player.getInventory().find(argument1, number1);
        if (item === null) {
            Engine.Output(Local.Commands.Wield.NoItemFound.format(argument1));
            return;
        }

        let slot = item.getEquipmentSlot();
        if (slot == null || slot !== EquipmentSlot.MainHand) {
            Engine.Output(
                Local.Commands.Wield.ItemNotEquippable.format(item.getName(GramaCase.Dopelniacz).startWithUpper()),
            );
            return;
        }

        let itemType = item.getType();
        if (itemType !== ItemType.Weapon1H && itemType !== ItemType.Weapon2H) {
            Engine.Output(
                Local.Commands.Wield.ItemNotEquippable.format(item.getName(GramaCase.Dopelniacz).startWithUpper()),
            );
            return;
        }

        let wieldedWeapon = Game.Player.getEquipment().get(slot);
        if (wieldedWeapon !== null) {
            Commands.Remove.remove(slot, wieldedWeapon);
        }

        if (itemType === ItemType.Weapon2H) {
            let offHandItem = Game.Player.getEquipment().get(EquipmentSlot.OffHand);
            if (offHandItem !== null) {
                Commands.Remove.remove(EquipmentSlot.OffHand, offHandItem);
            }
        }

        Game.Player.getInventory().remove(item);
        Game.Player.getEquipment().equip(slot, item);
        Engine.Output(Local.Commands.Wield.Equipped.format(item.getName(GramaCase.Biernik)));
    }
}
