"use strict";
class Drop extends Command {
    ExecuteBody(command) {
        if (command.getArgument(1) === null) {
            Engine.Output("Co chcesz wyrzucić?")
            return;
        }

        if (command.getArgument(1).toLowerCase() === "all") {
            if (!Game.Player.getInventory().any()) {
                Engine.Output("Przecież nic nie masz biedaku.");
                return;
            }

            this.dropAll();
        }
        else {
            let item = Game.Player.getInventory().find(command.getArgument(1), command.getNumber(1));
            if (item === null) {
                Engine.Output("Nie masz czegoś takiego jak {0}.".format(command.getArgument(1)));
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
        Game.getRoom(Game.Player.Location).getItems().add(item);
        Engine.Output("Upuszczasz {0}.".format(item.getName(GrammaCase.Biernik)));
    }
};