import { CommandCallback } from '../commandsUtils/CommandCallback';
import { CommandParser } from '../commandsUtils/CommandParser';
import { Commands } from '../commandsUtils/CommandsManager';
import { Direction } from '../enums/Direction';
import { Command } from './Command';

export class South extends Command {
    ExecuteBody(_: CommandParser, commandCallback: CommandCallback) {
        Commands.Go.goToDirection(Direction.south, commandCallback);
    }
}
