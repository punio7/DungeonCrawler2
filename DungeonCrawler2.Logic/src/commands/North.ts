import { CommandCallback } from '../commandsUtils/CommandCallback';
import { CommandParser } from '../commandsUtils/CommandParser';
import { Commands } from '../commandsUtils/CommandsManager';
import { Direction } from '../enums/Direction';
import { Command } from './Command';

export class North extends Command {
    ExecuteBody(_: CommandParser, commandCallback: CommandCallback) {
        Commands.Go.goToDirection(Direction.north, commandCallback);
    }
}
