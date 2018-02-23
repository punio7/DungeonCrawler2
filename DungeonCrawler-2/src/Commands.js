"use strict";
class CommandsManager {
    constructor() {
        this.CommandsList = [];    
    };

    Execute(command) {
        let parser = new CommandParser(command);
        let commandName = parser.getCommand();
        this.CommandsList[commandName].Execute(Game, parser);
    };
};

var Commands = new CommandsManager();
Commands.CommandsList["test"] = new Test();
Commands.CommandsList["reload"] = new Reload();