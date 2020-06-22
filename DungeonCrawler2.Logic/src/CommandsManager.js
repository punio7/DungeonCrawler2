"use strict";
class CommandsManager {
    constructor() {
        this.Tree = new CommandTree();
        this.isCommandExecuting = false;
        this.commandQueue = [];
    }

    /**
     * 
     * @param {string} command String content of command
     */
    Execute(command) {
        this.commandQueue.push(command);
        if (this.isCommandExecuting === false) {
            this.isCommandExecuting = true;
            this.ExecuteNext();
        }
    }

    ExecuteNext() {
        if (this.commandQueue.length <= 0) {
            this.isCommandExecuting = false;
            return;
        }
        let command = this.commandQueue[0];
        this.commandQueue.shift();
        let parser = new CommandParser(command);
        let commandName = parser.getCommand();

        let commandObject = this.Tree.GetCommand(commandName);
        if (commandObject === undefined || commandObject === null) {
            throw 'Command object for {0} not found'.format(commandName);
        }

        Engine.Output("");
        commandObject.Execute(parser, new CommandCallback(() => this.AfterExecute()));
    }

    AfterExecute() {
        Engine.Output("");
        Prompt.Print();
        this.ExecuteNext();
    }

    SetDefaultCommand(commandObject) {
        this.Tree.SetDefaultCommand(commandObject);
    }

    RegisterCommand(commandName, commandObject) {
        this.Tree.AddNewCommand(commandName, commandObject);
        this[commandName] = commandObject;
    }
};

var Commands = new CommandsManager();