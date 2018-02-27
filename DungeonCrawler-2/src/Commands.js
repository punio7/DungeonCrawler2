"use strict";
class CommandsManager {
    constructor() {
        this.List = [];    
    };

    Execute(command) {
        let parser = new CommandParser(command);
        let commandName = parser.getCommand();

        let commandObject = this.List[commandName];
        if (commandObject != undefined) {
            commandObject.Execute(Game, parser);
        }
        else {
            Engine.Output("Chyba ty.");
        }
    };

    RegisterCommand(commandName, commandObject) {
        if (!(commandObject instanceof Command)) {
            throw "Command object must extend Command class";
        }

        this.List[commandName] = commandObject;
    }
};