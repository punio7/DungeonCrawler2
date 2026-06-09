import { CommandParser } from '../commandsUtils/CommandParser';
import { GramaCase } from '../enums/GramaCase';
import { Game, Local } from '../InitGameData';
import { Command } from './Command';
import { ItemType } from '../enums/ItemType';
import { EquipmentSlot } from '../enums/EquipmentSlot';
import { Commands } from '../commandsUtils/CommandsManager';

export class Wear extends Command {
    wearableSlots = [
        EquipmentSlot.Torso,
        EquipmentSlot.Arms,
        EquipmentSlot.Hands,
        EquipmentSlot.Legs,
        EquipmentSlot.Feet,
        EquipmentSlot.Head,
        EquipmentSlot.Shirt,
        EquipmentSlot.Pants,
        EquipmentSlot.Coat,
        EquipmentSlot.RightRing,
        EquipmentSlot.LeftRing,
        EquipmentSlot.Necklace,
    ];

    ExecuteBody(command: CommandParser) {
        let argument1 = command.getArgument(1);
        if (argument1 === null) {
            Engine.Output(Local.Commands.Wear.NoArgument);
            return;
        }

        let number1 = command.getNumber(1);
        let item = Game.Player.getInventory().find(argument1, number1);
        if (item === null) {
            Engine.Output(Local.Commands.Wear.NoItemFound.format(argument1));
            return;
        }

        let slot = item.getEquipmentSlot();
        if (slot == null || !this.wearableSlots.includes(slot)) {
            Engine.Output(Local.Commands.Wear.ItemNotEquippable.format(item.getName(GramaCase.Dopelniacz)));
            return;
        }

        if (item.getType() == ItemType.Ring) {
            slot = this.getAvailableRingSlot();
            if (slot == null) {
                Engine.Output(Local.Commands.Wear.NoFreeRingSlot);
                return;
            }
        }

        let equippedItem = Game.Player.getEquipment().get(slot);
        if (equippedItem !== null) {
            Commands.Remove.remove(slot, equippedItem);
        }

        Game.Player.getInventory().remove(item);
        Game.Player.getEquipment().equip(slot, item);
        Engine.Output(Local.Commands.Wear.Equipped.format(item.getName(GramaCase.Biernik)));
    }

    private getAvailableRingSlot(): EquipmentSlot | null {
        if (Game.Player.getEquipment().get(EquipmentSlot.RightRing) === null) {
            return EquipmentSlot.RightRing;
        }
        if (Game.Player.getEquipment().get(EquipmentSlot.LeftRing) === null) {
            return EquipmentSlot.LeftRing;
        }
        return null;
    }
}
