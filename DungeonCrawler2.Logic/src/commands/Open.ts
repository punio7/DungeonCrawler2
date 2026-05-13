import { CommandParser } from '../commandsUtils/CommandParser';
import { Direction, DirectionHelper } from '../enums/Direction';
import { Game, Local } from '../InitGameData';
import { Command } from './Command';

export class Open extends Command {
    ExecuteBody(command: CommandParser): void {
        let direction = null;
        let argument = command.getArgument(1);

        if (argument === null) {
            Engine.Output(Local.Commands.Open.NoDirection);
            return;
        }

        direction = DirectionHelper.parseShort(argument.toLowerCase());
        if (direction === null) {
            Engine.Output(Local.Commands.Open.WrongDirection.format(argument));
            return;
        }

        this.openDirection(direction);
    }

    openDirection(direction: Direction) {
        let room = Game.getRoom(Game.Player.getLocation());
        let exit = room.getExit(direction);
        if (exit === null || exit.isHidden() || !exit.isDoor()) {
            Engine.Output(Local.Commands.Open.NoDoor);
            return;
        }

        if (!exit.isClosed()) {
            Engine.Output(Local.Commands.Open.AlreadyOpen);
            return;
        }

        if (exit.isLocked()) {
            Engine.Output(Local.Commands.Open.Locked);
            return;
        }
        exit.Door!.IsClosed = false;
        let nextRoom = Game.getRoom(exit.getRoomId());
        let nextDoor = nextRoom.getExitToRoom(room.Id)?.Door;
        if (nextDoor) {
            nextDoor.IsClosed = false;
        }
        Engine.Output(Local.Commands.Open.Opened);
    }
}
