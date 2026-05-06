import { CommandParser } from '../CommandParser';
import { Command } from './Command';
import { Game as GameVar } from '../InitGameData';
import { GameData } from '../model/GameData';

export class Json extends Command {
    ExecuteBody(command: CommandParser) {
        let argument = command.getArgument(1);
        if (argument === null) {
            return;
        }
        let game = GameVar;
        let gameData = GameData;
        Engine.Output(JSON.stringify(eval(argument)));
    }
}
