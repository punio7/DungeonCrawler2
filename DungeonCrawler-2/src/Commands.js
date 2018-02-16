"use strict";
class CommandsManager {
    constructor() {
        this.CommandsList = [];    
    };

    Execute(game, command) {
        let parser = new CommandParser(command);
        let commandName = parser.getCommand();
        this.CommandsList[commandName].Execute(game, parser);
    };
};

var Commands = new CommandsManager();
Commands.CommandsList["test"] = new Test();