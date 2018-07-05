"use strict";
class Take extends Command {
    ExecuteBody(command) {
        if (command.getArgument(1) === null) {
            Engine.Output("Wziąć co?");
            return;
        }

        if (command.getArgument(2) === null) {
            if (command.getArgument(1).toLowerCase() === "all") {
                if (!Game.getRoom(Game.Player.Location).getItems().any()) {
                    Engine.Output("Nic tu nie ma.");
                    return;
                }
                this.takeAllFromLocation();
            }
            else {
                let itemList = Game.getRoom(Game.Player.Location).getItems();
                let item = itemList.find(command.getArgument(1), command.getNumber(1));
                if (item === null) {
                    Engine.Output("Tutaj nie ma czegoś takiego jak {0}.".format(command.getArgument(1)));
                    return;
                }
                this.takeItemFromLocation(item, itemList);
            }
        }
        else {
            //TODO: Take from container
            Engine.Output("​¯\\_(ツ)_/¯");
        }
    }

    takeItemFromLocation(item, itemList) {
        if (!item.isTakeable()) {
            Engine.Output("Nie możesz podnieść {0}.".format(item.getName(GrammaCase.Dopelniacz)));
            return false;
        }

        this.takeItem(item, itemList);
        Engine.Output("Podnosisz {0}.".format(item.getName(GrammaCase.Biernik)));
        return true;
    }

    takeAllFromLocation() {
        let itemList = Game.getRoom(Game.Player.Location).getItems();
        let i = 0;
        for (var item = itemList.elementAt(i); item != null; item = itemList.elementAt(i)) {
            if (!this.takeItemFromLocation(item, itemList)) {
                i++;
            }
        }
    }

    takeItem(item, itemList) {
        itemList.remove(item);
        if (item.isStackable()) {
            let existingStack = Game.Player.getInventory().findById(item.Id);
            if (existingStack !== null) {
                existingStack.addStack(item.getStack());
                return;
            }
        }
        Game.Player.getInventory().add(item);
    }
};