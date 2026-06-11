import { CommandParser } from '../commandsUtils/CommandParser';
import { Local } from '../InitGameData';
import { Command } from './Command';

export class NoCommand extends Command {
    get acceptableStates() {
        return [];
    }

    ExecuteBody(_: CommandParser) {
        Engine.Output(Local.Commands.NoCommand.NoCommand);
    }
}
