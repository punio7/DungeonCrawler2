import { CommandParser } from '../CommandParser';
import { DirectionHelper } from '../enums/Direction';
import { GrammaCase } from '../enums/GrammaCase';
import { Game, Local } from '../InitGameData';
import { Command } from './Command';

export class Scan extends Command {
    ExecuteBody(command: CommandParser) {
        let room = Game.GetRoom(Game.Player.getLocation());

        if (!Game.Player.canSee()) {
            Engine.Output(Local.Commands.Scan.CantSee);
            return;
        }
        let playerRoom = Game.GetRoom(Game.Player.Location);

        Engine.Output(Local.Commands.Scan.LookingAroundYouSee);
        Engine.Output(Local.Commands.Scan.Here);
        Engine.Output(this.printCharacters(Game.Player.Location));

        DirectionHelper.forEach((direction) => {
            let exit = playerRoom.getExit(direction);
            if (exit !== null && !exit.isHidden() && !exit.isClosed()) {
                Engine.Output(
                    Local.Commands.Scan.InDirection.format(
                        DirectionHelper.getLocale(direction, GrammaCase.Miejscownik),
                    ),
                );
                Engine.Output(this.printCharacters(exit.RoomId));
            }
        });
    }

    private printCharacters(roomId: number) {
        let room = Game.GetRoom(roomId);
        if (!room.getCharacters().any()) {
            return Engine.NonBreakingSpace.repeat(4) + Local.Commands.Scan.NoOneThere;
        }

        return room.getCharacters().printShortFormat(true);
    }
}
