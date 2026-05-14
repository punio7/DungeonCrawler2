import { CommandCallback } from '../commandsUtils/CommandCallback';
import { CommandParser } from '../commandsUtils/CommandParser';
import { Direction, DirectionHelper } from '../enums/Direction';
import { GramaCase } from '../enums/GramaCase';
import { Game, Local } from '../InitGameData';
import { Item } from '../model/Item';
import { Room } from '../model/Room';
import { Command } from './Command';

export class Lock extends Command {
    ExecuteBody(command: CommandParser, commandCallback: CommandCallback): void {
        const argument = command.getArgument(1);

        if (argument === null) {
            Engine.Output(Local.Commands.Lock.NoTarget);
            return;
        }

        const room = Game.getRoom(Game.Player.getLocation());
        const direction = DirectionHelper.parseShort(argument.toLowerCase());

        if (direction !== null) {
            this.lockDirection(room, direction);
            return;
        }

        const number = command.getNumber(1);

        const container = room.getItems().find(argument, number);
        if (container !== null) {
            this.lockContainer(container);
            return;
        }

        Engine.Output(Local.Commands.Lock.InvalidTarget.format(argument));
    }

    lockDirection(room: Room, direction: Direction) {
        const exit = room.getExit(direction);
        const isTrapDoor = direction === Direction.down || direction === Direction.up;

        if (exit === null || exit.isHidden() || !exit.isDoor()) {
            if (isTrapDoor) {
                Engine.Output(Local.Commands.Lock.NoTrapDoor);
            } else {
                Engine.Output(Local.Commands.Lock.NoDoor);
            }
            return;
        }

        if (exit.isLocked()) {
            if (isTrapDoor) {
                Engine.Output(Local.Commands.Lock.TrapDoorAlreadyLocked);
            } else {
                Engine.Output(Local.Commands.Lock.AlreadyLocked);
            }
            return;
        }

        if (!exit.isClosed()) {
            if (isTrapDoor) {
                Engine.Output(Local.Commands.Lock.CloseTrapDoorFirst);
            } else {
                Engine.Output(Local.Commands.Lock.CloseDoorFirst);
            }
            return;
        }

        const keyId = exit.getKeyId()!;

        const key = Game.Player.Inventory.findById(keyId, 1);
        if (key === null) {
            Engine.Output(Local.Commands.Lock.KeyNotFound);
            return;
        }

        room.Exits[direction].Door!.IsLocked = true;
        let nextRoom = Game.getRoom(exit.getRoomId());
        let nextDoor = nextRoom.getExitToRoom(room.Id)?.Door;
        if (nextDoor) {
            nextDoor.IsLocked = true;
        }
        if (isTrapDoor) {
            Engine.Output(Local.Commands.Lock.TrapDoorLocked.format(key.getName(GramaCase.Dopelniacz)));
        } else {
            Engine.Output(Local.Commands.Lock.DoorLocked.format(key.getName(GramaCase.Dopelniacz)));
        }
    }

    lockContainer(container: Item) {
        if (!container.isContainer()) {
            Engine.Output(Local.Commands.Lock.NotContainer.format(container.getName().startWithUpper()));
            return;
        }

        if (!container.isLocked()) {
            Engine.Output(Local.Commands.Lock.ContainerNotLocked.format(container.getName().startWithUpper()));
            return;
        }

        const keyId = container.Lock!.KeyId;

        const key = Game.Player.Inventory.findById(keyId, 1);
        if (key === null) {
            Engine.Output(Local.Commands.Lock.ContainerKeyNotFound.format(container.getName(GramaCase.Dopelniacz)));
            return;
        }

        container.Lock!.IsLocked = true;
        Engine.Output(
            Local.Commands.Lock.ContainerLocked.format(
                container.getName(GramaCase.Biernik),
                key.getName(GramaCase.Dopelniacz),
            ),
        );
    }
}
