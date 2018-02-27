"use strict";

var Commands = {};

function InitCommands() {
    Engine.LoadScript('src/CommandParser.js');
    Engine.LoadScript('src/commands/Command.js');

    Engine.LoadScript('src/commands/Eval.js');
    Engine.LoadScript('src/commands/Reload.js');
    Engine.LoadScript('src/commands/Test.js');
    Engine.LoadScript('src/Commands.js');

    Commands = new CommandsManager();
    Commands.RegisterCommand("test", new Test());
    Commands.RegisterCommand("reload", new Reload());
    Commands.RegisterCommand("eval", new Eval());
    //Commands.RegisterCommand("error", {});
}