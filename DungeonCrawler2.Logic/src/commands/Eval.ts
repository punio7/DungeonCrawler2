import { CommandParser } from '../CommandParser';
import { Command } from './Command';

export class Eval extends Command {
    ExecuteBody(command: CommandParser) {
        let argument = command.getArgument(1);
        if (argument === null) {
            return;
        }
        Engine.Output(eval(argument));
    }
}
