"use strict";
class Inventory extends Command {
    ExecuteBody(command) {
        Engine.Output("Obecnie przy sobie posiadasz:");
        if (!Game.Player.getInventory().any()) {
            Engine.Output("{0}Ogólnie nic".format(Engine.NonBreakingSpace.repeat(4)));
        }
        else {
            Engine.Output(Game.Player.getInventory().printShortFormat());
        }
    }
};