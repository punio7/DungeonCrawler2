"use strict";
class Go extends Command {
    ExecuteBody(command) {
        let direction = Directions.parseShort(command.getArgument(1).toLowerCase());
        if (direction === null) {
            Engine.Output("Może lepiej zostać tutaj i zjeść kilka pierogów?");
            return;
        }

        this.goToDirection(direction);
    }

    goToDirection(direction) {
        let exit = Game.getRoom(Game.Player.getLocation()).getExit(direction);

        if (exit === null || exit.isHidden()) {
            Engine.Output("Nie możesz tam pójść.");
            return;
        }

        if (exit.isClosed()) {
            Engine.Output("Przejście jest zamknięte.");
            return;
        }

        let newRoom = Game.getRoom(exit.getRoomId());
        Game.Player.setPreviousLocation(Game.Player.getLocation());
        this.changePlayerLocation(newRoom);
    }

    changePlayerLocation(room) {
        Game.Player.Location = room.Id;
        room.IsVisited = true;
        //TODO: Zdarzenie globalne przy wejściu
        Commands.Look.lookRoom(room);
        //TODO: Zdarzenia przy wejściu
    }
};