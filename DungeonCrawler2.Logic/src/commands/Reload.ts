import { CommandParser } from '../commandsUtils/CommandParser';
import { Command } from './Command';

export class Reload extends Command {
    ExecuteBody(command: CommandParser) {
        Engine.Reload();
    }
}
