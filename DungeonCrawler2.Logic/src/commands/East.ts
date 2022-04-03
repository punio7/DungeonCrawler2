import { CommandCallback } from '../CommandCallback';
import { CommandParser } from '../CommandParser';
import { Commands } from '../CommandsManager';
import { Direction } from '../enums/Direction';
import { Command } from './Command';

export class East extends Command {
    ExecuteBody(_: CommandParser, commandCallback: CommandCallback) {
        Commands.Go.goToDirection(Direction.east, commandCallback);
    }
}
