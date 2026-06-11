import { CommandParser } from '../commandsUtils/CommandParser';
import { Commands, CommandsManager } from '../commandsUtils/CommandsManager';
import { EngineUtils } from '../commonLogic/EngineUtils';
import { Local } from '../InitGameData';
import { Command } from './Command';

export class Help extends Command {
    get acceptableStates() {
        return [];
    }

    ExecuteBody(command: CommandParser) {
        let argument1 = command.getArgument(1);

        if (argument1 === null) {
            this.ShowCommandsList();
            return;
        }

        let helpTopic = CommandsManager.Tree.GetCommand(argument1);
        if (helpTopic === undefined || helpTopic === null) {
            Engine.Output(Local.Commands.Help.NoHelp);
            return;
        }
        helpTopic.Help();
    }

    ShowCommandsList() {
        let commands = Object.keys(Commands);
        Engine.Output(Local.Commands.Help.AvailableCommands);
        EngineUtils.PrintColumns(commands, 4, 20);
    }
}
