import { CommandParser } from '../commandsUtils/CommandParser';
import { Local } from '../InitGameData';
import { Command } from './Command';

export class NoCommand extends Command {
    ExecuteBody(_: CommandParser) {
        Engine.Output(Local.Commands.NoCommand.NoCommand);
    }
}
