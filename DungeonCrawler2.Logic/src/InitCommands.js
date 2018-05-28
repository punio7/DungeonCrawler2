"use strict";

function Execute(command) {
    Commands.Execute(command);
};

function InitCommands() {
    Commands.SetDefaultCommand(new NoCommand());
    Commands.RegisterCommand("Eval", new Eval());
    Commands.RegisterCommand("Json", new Json());
    Commands.RegisterCommand("Look", new Look());
    Commands.RegisterCommand("Test", new Test());
    Commands.RegisterCommand("Reload", new Reload());
    //Commands.RegisterCommand("error", {});
}