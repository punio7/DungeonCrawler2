import { CommandParser } from '../CommandParser';
import { Command } from './Command';

export class Json extends Command {
    ExecuteBody(command: CommandParser) {
        let argument = command.getArgument(1);
        if (argument === null) {
            return;
        }
        Engine.Output(JSON.stringify(eval(argument)));
    }
}
