import { CommandCallback } from '../CommandCallback';
import { CommandParser } from '../CommandParser';
import { Commands } from '../CommandsManager';
import { Direction } from '../enums/Direction';
import { Command } from './Command';

export class Down extends Command {
    ExecuteBody(_command: CommandParser, commandCallback: CommandCallback) {
        Commands.Go.goToDirection(Direction.down, commandCallback);
    }
}
