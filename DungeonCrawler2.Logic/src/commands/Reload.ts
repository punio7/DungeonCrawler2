import { CommandParser } from '../commandsUtils/CommandParser';
import { Command } from './Command';

export class Reload extends Command {
    get acceptableStates() {
        return [];
    }

    ExecuteBody(command: CommandParser) {
        Engine.Reload();
    }
}
