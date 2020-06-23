"use strict";
class Drop extends Command {
    ExecuteBody(command) {
        if (command.getArgument(1) === null) {
            Engine.Output(Local.Commands.Drop.NoArgument);
            return;
        }

        if (command.getArgument(1).toLowerCase() === "all") {
            if (!Game.Player.getInventory().any()) {
                Engine.Output(Local.Commands.Drop.NoItems);
                return;
            }

            this.dropAll();
        }
        else {
            let item = Game.Player.getInventory().find(command.getArgument(1), command.getNumber(1));
            if (item === null) {
                Engine.Output(Local.Commands.Drop.NoItemFound.format(command.getArgument(1)));
                return;
            }

            this.dropItem(item);
        }
    }

    dropAll() {
        while (Game.Player.getInventory().any()) {
            this.dropItem(Game.Player.getInventory().elementAt(0));
        }
    }

    dropItem(item) {
        Game.Player.getInventory().remove(item);
        Game.GetRoom(Game.Player.Location).getItems().add(item);
        Engine.Output(Local.Commands.Drop.Dropped.format(item.getName(GrammaCase.Biernik)));
    }
};