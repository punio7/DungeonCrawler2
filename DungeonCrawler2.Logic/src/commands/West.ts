import { CommandCallback } from '../CommandCallback';
import { CommandParser } from '../CommandParser';
import { Commands } from '../CommandsManager';
import { Direction } from '../enums/Direction';
import { Command } from './Command';

export class West extends Command {
    ExecuteBody(_: CommandParser, commandCallback: CommandCallback) {
        Commands.Go.goToDirection(Direction.west, commandCallback);
    }
}
