"use strict";
class Scan extends Command {
    ExecuteBody(command) {
        let room = Game.GetRoom(Game.Player.getLocation());

        if (!Game.Player.canSee()) {
            Engine.Output(Local.Commands.Scan.CantSee);
            return;
        }
        let playerRoom = Game.GetRoom(Game.Player.Location);

        Engine.Output(Local.Commands.Scan.LookingAroundYouSee);
        Engine.Output(Local.Commands.Scan.Here);
        Engine.Output(this.printCharacters(Game.Player.Location));

        Directions.forEach((direction) => {
            let exit = playerRoom.getExit(direction);
            if (exit !== null && !exit.isHidden() && !exit.isClosed()) {
                Engine.Output(Local.Commands.Scan.InDirection.format(Directions.getLocale(direction, GrammaCase.Miejscownik)));
                Engine.Output(this.printCharacters(exit.RoomId));
            }
        });
    }

    printCharacters(roomId) {
        let room = Game.GetRoom(roomId);
        if (!room.getCharacters().any()) {
            return Engine.NonBreakingSpace.repeat(4) + Local.Commands.Scan.NoOneThere;
        }

        return room.getCharacters().printShortFormat(true);
    }
};