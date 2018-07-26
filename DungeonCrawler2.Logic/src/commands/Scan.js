"use strict";
class Scan extends Command {
    ExecuteBody(command) {
        let room = Game.getRoom(Game.Player.getLocation());

        if (!Game.Player.canSee()) {
            Engine.Output("Nic nie widzisz w tej ciemności.");
            return;
        }
        let playerRoom = Game.getRoom(Game.Player.Location);

        Engine.Output("Rozglądajac się dookoła dostrzegasz:");
        Engine.Output("Tutaj:");
        Engine.Output(this.printCharacters(Game.Player.Location));

        Directions.forEach((direction) => {
            let exit = playerRoom.getExit(direction);
            if (exit !== null && !exit.isHidden() && !exit.isClosed()) {
                Engine.Output("Na {0}:".format(Directions.getLocale(direction, GrammaCase.Miejscownik)));
                Engine.Output(this.printCharacters(exit.RoomId));
            }
        });
    }

    printCharacters(roomId) {
        let room = Game.getRoom(roomId);
        if (!room.getCharacters().any()) {
            return Engine.NonBreakingSpace.repeat(4) + "nikogo nie ma";
        }

        return room.getCharacters().printShortFormat(true);
    }
};