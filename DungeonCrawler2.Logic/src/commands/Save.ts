import { CommandParser } from '../commandsUtils/CommandParser';
import { Game, Local } from '../InitGameData';
import { Command } from './Command';

export class Save extends Command {
    get acceptableStates() {
        return [];
    }

    ExecuteBody(command: CommandParser) {
        const json = JSON.stringify(Game);
        Engine.Save(json);
        Engine.Output(Local.Commands.Save.Saved);
    }
}
