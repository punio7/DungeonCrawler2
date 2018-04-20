"use strict";

var Commands = {};

function Execute(command) {
    Commands.Execute(command);
};

function InitCommands() {
    Engine.LoadScript('src/CommandParser.js');
    Engine.LoadScript('src/commands/Command.js');

    Engine.LoadScript('src/commonLogic/ItemsListPrinter.js');

    Engine.LoadScript('src/commands/NoCommand.js');
    Engine.LoadScript('src/commands/Reload.js');
    Engine.LoadScript('src/commands/Test.js');
    Engine.LoadScript('src/commands/Eval.js');
    Engine.LoadScript('src/commands/Json.js');
    Engine.LoadScript('src/commands/Look.js');

    Engine.LoadScript('src/CommandTree.js');
    Engine.LoadScript('src/CommandsManager.js');

    Commands = new CommandsManager();
    Commands.SetDefaultCommand(new NoCommand());
    Commands.RegisterCommand("Eval", new Eval());
    Commands.RegisterCommand("Json", new Json());
    Commands.RegisterCommand("Look", new Look());
    Commands.RegisterCommand("Test", new Test());
    Commands.RegisterCommand("Reload", new Reload());
    //Commands.RegisterCommand("error", {});
}