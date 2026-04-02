import { CommandParser } from '../CommandParser';
import { Command } from './Command';
import { Game as GameVar, Local } from '../InitGameData';

export class Json extends Command {
    ExecuteBody(command: CommandParser) {
        let argument = command.getArgument(1);
        if (argument === null) {
            return;
        }
        let Game = GameVar;
        Engine.Output(JSON.stringify(eval(argument)));
    }
}
