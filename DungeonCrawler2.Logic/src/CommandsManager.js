"use strict";
class CommandsManager {
    constructor() {
        this.Tree = new CommandTree();
    };

    Execute(command) {
        let parser = new CommandParser(command);
        let commandName = parser.getCommand();

        let commandObject = this.Tree.GetCommand(commandName);
        if (commandObject !== undefined && commandObject !== null) {
            Engine.Output("");
            commandObject.Execute(Game, parser);
            Engine.Output("");
            Prompt.Print();
        }
        else {
            throw 'Command object for {0} not found'.format(commandName);
        }
    };

    SetDefaultCommand(commandObject) {
        this.Tree.SetDefaultCommand(commandObject);
    }

    RegisterCommand(commandName, commandObject) {
        this.Tree.AddNewCommand(commandName, commandObject);
        this[commandName] = commandObject;
    }
};

var Commands = new CommandsManager();