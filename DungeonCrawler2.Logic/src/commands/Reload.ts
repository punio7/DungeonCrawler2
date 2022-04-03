import { CommandParser } from '../CommandParser';
import { Command } from './Command';

export class Reload extends Command {
    ExecuteBody(command: CommandParser) {
        Engine.Reload();
    }
}
