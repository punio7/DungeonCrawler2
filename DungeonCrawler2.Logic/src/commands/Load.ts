import { CommandParser } from '../commandsUtils/CommandParser';
import { Commands } from '../commandsUtils/CommandsManager';
import { LoadGame, Local } from '../InitGameData';
import { Command } from './Command';

export class Load extends Command {
    ExecuteBody(command: CommandParser) {
        let saveData = Engine.Load();
        Engine.Output(Local.Commands.Load.Loading);
        LoadGame(saveData);
        Engine.Output(Local.Commands.Load.Loaded);
        Commands.Look.lookRoom();
    }
}
