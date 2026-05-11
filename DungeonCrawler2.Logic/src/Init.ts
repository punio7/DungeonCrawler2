import { CommandCallback } from './commandsUtils/CommandCallback';
import { Commands } from './commandsUtils/CommandsManager';
import { Prompt } from './commonLogic/Prompt';
import { InitCommands } from './commandsUtils/InitCommands';
import { Game, InitGameData, Version } from './InitGameData';
import './commonLogic/InputFunctions';
import './commonLogic/StringUtils';

function Init() {
    InitGameData();
    InitCommands();
    Engine.Output('Dungeon Crawler 2, wersja:');
    Engine.Output(Version);
    Commands.Go.changePlayerLocation(
        Game.getRoom(Game.StartingRoom),
        new CommandCallback(() => {
            Engine.Output('');
            Prompt.Print();
        }),
    );
}

declare global {
    function Init(): void;
}
globalThis.Init = Init;
