import { CommandCallback } from './CommandCallback';
import { CommandParser } from './CommandParser';
import { Command } from './commands/Command';
import { Down } from './commands/Down';
import { Drop } from './commands/Drop';
import { East } from './commands/East';
import { Eval } from './commands/Eval';
import { Go } from './commands/Go';
import { Inventory } from './commands/Inventory';
import { Json } from './commands/Json';
import { Look } from './commands/Look';
import { North } from './commands/North';
import { Reload } from './commands/Reload';
import { Scan } from './commands/Scan';
import { South } from './commands/South';
import { Take } from './commands/Take';
import { Test } from './commands/Test';
import { Up } from './commands/Up';
import { West } from './commands/West';
import { CommandTree } from './CommandTree';
import { Prompt } from './commonLogic/Prompt';

class CommandList {
    Down: Down;
    Drop: Drop;
    East: East;
    Eval: Eval;
    Go: Go;
    Inventory: Inventory;
    Json: Json;
    Look: Look;
    North: North;
    Reload: Reload;
    South: South;
    Scan: Scan;
    Take: Take;
    Test: Test;
    Up: Up;
    West: West;
}

interface CommandDictionary {
    [commandName: string]: Command;
}

class CommandsManager extends CommandList {
    Tree: CommandTree;
    isCommandExecuting: boolean;
    commandQueue: any[];
    Commands: CommandDictionary = {};

    constructor() {
        super();
        this.Tree = new CommandTree();
        this.isCommandExecuting = false;
        this.commandQueue = [];
    }

    Execute(command: string) {
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

        Engine.Output('');
        commandObject.Execute(parser, new CommandCallback(() => this.AfterExecute()));
    }

    AfterExecute() {
        Engine.Output('');
        Prompt.Print();
        this.ExecuteNext();
    }

    SetDefaultCommand(commandObject: Command) {
        this.Tree.SetDefaultCommand(commandObject);
    }

    RegisterCommand<CommandName extends keyof CommandList>(name: CommandName, object: CommandList[CommandName]) {
        this.Tree.AddNewCommand(name, object);
        let commandList = this as CommandList;
        commandList[name] = object;
    }
}

export var Commands = new CommandsManager();
