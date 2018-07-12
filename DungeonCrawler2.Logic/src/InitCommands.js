"use strict";

function Execute(command) {
    Commands.Execute(command);
};

function InitCommands() {
    Commands.SetDefaultCommand(new NoCommand());

    Commands.RegisterCommand("Down", new Down());
    Commands.RegisterCommand("Drop", new Drop());

    Commands.RegisterCommand("East", new East());
    Commands.RegisterCommand("Eval", new Eval());

    Commands.RegisterCommand("Go", new Go());

    Commands.RegisterCommand("Inventory", new Inventory());

    Commands.RegisterCommand("Json", new Json());

    Commands.RegisterCommand("Look", new Look());

    Commands.RegisterCommand("North", new North());

    Commands.RegisterCommand("Reload", new Reload());

    Commands.RegisterCommand("South", new South());
    Commands.RegisterCommand("Scan", new Scan());

    Commands.RegisterCommand("Take", new Take());
    Commands.RegisterCommand("Test", new Test());

    Commands.RegisterCommand("Up", new Up());

    Commands.RegisterCommand("West", new West());
}