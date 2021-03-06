"use strict";
class Inventory extends Command {
    ExecuteBody(command) {
        Engine.Output(Local.Commands.Inventory.YourItems);
        if (!Game.Player.getInventory().any()) {
            Engine.Output(Local.Commands.Inventory.NoItems.format(Engine.NonBreakingSpace.repeat(4)));
        }
        else {
            Engine.Output(Game.Player.getInventory().printShortFormat());
        }
    }
};