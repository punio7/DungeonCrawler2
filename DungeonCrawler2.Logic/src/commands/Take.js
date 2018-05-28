"use strict";
class Take extends Command {
    ExecuteBody(command) {
        if (command.getArgument(1) === null) {
            Engine.Output("Wziąć co?");
            return;
        }

        if (command.getArgument(2) === null) {
            if (command.getArgument(1) === "all") {
                this.takeAllFromLocation();
            }
            else {
                this.takeItemFromLocation(command.getArgument(1), command.getNumber(1));
            }
        }
        else {
            //TODO: Take from container
            Engine.Output("​¯\\_(ツ)_/¯");
        }
    }

    takeItemFromLocation(itemName, number) {
        let itemList = Game.getRoom(Game.Player.Location).getItems();
        let item = itemList.find(itemName, number);

        if (item === null) {
            Engine.Output("Tutaj nie ma czegoś takiego jak {0}.".format(itemName));
            return;
        }
        if (!item.isTakeable()) {
            Engine.Output("Nie możesz podnieść {0}.".format(item.getName(GrammaCase.Dopelniacz)));
            return;
        }

        this.takeItem(item, itemList);
        Engine.Output("Podnosisz {0}.".format(item.getName()));
    }

    takeAllFromLocation() {
        //TODO: Take All from location
        Engine.Output("​¯\\_(ツ)_/¯");
    }

    takeItem(item, itemList) {
        itemList.remove(item);
        Game.Player.getInventory().add(item);
    }
};