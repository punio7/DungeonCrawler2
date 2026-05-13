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
        let room = Game.getRoom(Game.Player.getLocation());
        let exit = room.getExit(direction);
        if (exit === null || exit.isHidden() || !exit.isDoor()) {
            Engine.Output(Local.Commands.Close.NoDoor);
            return;
        }

        if (exit.isClosed()) {
            Engine.Output(Local.Commands.Close.AlreadyClosed);
            return;
        }

        exit.Door!.IsClosed = true;
        let nextRoom = Game.getRoom(exit.getRoomId());
        let nextDoor = nextRoom.getExitToRoom(room.Id)?.Door;
        if (nextDoor) {
            nextDoor.IsClosed = true;
        }
        Engine.Output(Local.Commands.Close.Closed);
    }
}
