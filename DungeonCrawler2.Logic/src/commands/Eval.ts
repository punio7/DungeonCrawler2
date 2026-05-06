import { CommandParser } from '../CommandParser';
import { Command } from './Command';
import { Game as GameVar } from '../InitGameData';

export class Eval extends Command {
    ExecuteBody(command: CommandParser) {
        let argument = command.getArgument(1);
        if (argument === null) {
            return;
        }
        let game = GameVar;

        Engine.Output(eval(argument));
    }
}
