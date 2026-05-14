import { CommandCallback } from '../commandsUtils/CommandCallback';
import { CommandParser } from '../commandsUtils/CommandParser';
import { Direction, DirectionHelper } from '../enums/Direction';
import { GramaCase } from '../enums/GramaCase';
import { Game, Local } from '../InitGameData';
import { Item } from '../model/Item';
import { Room } from '../model/Room';
import { Command } from './Command';

export class Unlock extends Command {
    ExecuteBody(command: CommandParser, commandCallback: CommandCallback): void {
        const argument = command.getArgument(1);

        if (argument === null) {
            Engine.Output(Local.Commands.Unlock.NoTarget);
            return;
        }

        const room = Game.getRoom(Game.Player.getLocation());
        const direction = DirectionHelper.parseShort(argument.toLowerCase());

        if (direction !== null) {
            this.unlockDirection(room, direction);
            return;
        }

        const number = command.getNumber(1);

        const container = room.getItems().find(argument, number);
        if (container !== null) {
            this.unlockContainer(container);
            return;
        }

        Engine.Output(Local.Commands.Unlock.InvalidTarget.format(argument));
    }

    unlockDirection(room: Room, direction: Direction) {
        const exit = room.getExit(direction);
        const isTrapDoor = direction === Direction.down || direction === Direction.up;

        if (exit === null || exit.isHidden() || !exit.isDoor()) {
            if (isTrapDoor) {
                Engine.Output(Local.Commands.Unlock.NoTrapDoor);
            } else {
                Engine.Output(Local.Commands.Unlock.NoDoor);
            }
            return;
        }

        if (!exit.isLocked()) {
            if (isTrapDoor) {
                Engine.Output(Local.Commands.Unlock.TrapDoorNotLocked);
            } else {
                Engine.Output(Local.Commands.Unlock.DoorNotLocked);
            }
            return;
        }

        const keyId = exit.getKeyId()!;

        const key = Game.Player.Inventory.findById(keyId, 1);
        if (key === null) {
            Engine.Output(Local.Commands.Unlock.KeyNotFound);
            return;
        }

        room.Exits[direction].Door!.IsLocked = false;
        let nextRoom = Game.getRoom(exit.getRoomId());
        let nextDoor = nextRoom.getExitToRoom(room.Id)?.Door;
        if (nextDoor) {
            nextDoor.IsLocked = false;
        }
        if (isTrapDoor) {
            Engine.Output(Local.Commands.Unlock.TrapDoorUnlocked.format(key.getName(GramaCase.Dopelniacz)));
        } else {
            Engine.Output(Local.Commands.Unlock.DoorUnlocked.format(key.getName(GramaCase.Dopelniacz)));
        }
    }

    unlockContainer(container: Item) {
        if (!container.isContainer()) {
            Engine.Output(Local.Commands.Unlock.NotContainer.format(container.getName().startWithUpper()));
            return;
        }

        if (!container.isLocked()) {
            Engine.Output(Local.Commands.Unlock.ContainerNotLocked.format(container.getName().startWithUpper()));
            return;
        }

        const keyId = container.Lock!.KeyId;

        const key = Game.Player.Inventory.findById(keyId, 1);
        if (key === null) {
            Engine.Output(Local.Commands.Unlock.ContainerKeyNotFound.format(container.getName(GramaCase.Dopelniacz)));
            return;
        }

        container.Lock!.IsLocked = false;
        Engine.Output(
            Local.Commands.Unlock.ContainerUnlocked.format(
                container.getName(GramaCase.Biernik),
                key.getName(GramaCase.Dopelniacz),
            ),
        );
    }
}
