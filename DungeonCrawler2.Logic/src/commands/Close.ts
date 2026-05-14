import { CommandParser } from '../commandsUtils/CommandParser';
import { Direction, DirectionHelper } from '../enums/Direction';
import { Game, Local } from '../InitGameData';
import { Command } from './Command';

export class Close extends Command {
    ExecuteBody(command: CommandParser): void {
        let direction = null;
        let argument = command.getArgument(1);

        if (argument === null) {
            Engine.Output(Local.Commands.Close.NoDirection);
            return;
        }

        direction = DirectionHelper.parseShort(argument.toLowerCase());
        if (direction === null) {
            Engine.Output(Local.Commands.Close.WrongDirection.format(argument));
            return;
        }

        this.closeDirection(direction);
    }

    closeDirection(direction: Direction) {
        const room = Game.getRoom(Game.Player.getLocation());
        const exit = room.getExit(direction);
        const isTrapDoor = direction === Direction.down || direction === Direction.up;
        if (exit === null || exit.isHidden() || !exit.isDoor()) {
            if (isTrapDoor) {
                Engine.Output(Local.Commands.Close.NoTrapDoor);
            } else {
                Engine.Output(Local.Commands.Close.NoDoor);
            }
            return;
        }

        if (exit.isClosed()) {
            if (isTrapDoor) {
                Engine.Output(Local.Commands.Close.TrapDoorAlreadyClosed);
            } else {
                Engine.Output(Local.Commands.Close.AlreadyClosed);
            }
            return;
        }

        exit.Door!.IsClosed = true;
        let nextRoom = Game.getRoom(exit.getRoomId());
        let nextDoor = nextRoom.getExitToRoom(room.Id)?.Door;
        if (nextDoor) {
            nextDoor.IsClosed = true;
        }
        if (isTrapDoor) {
            Engine.Output(Local.Commands.Close.TrapDoorClosed);
        } else {
            Engine.Output(Local.Commands.Close.Closed);
        }
    }
}
