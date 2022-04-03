import { CommandCallback } from './CommandCallback';
import { Commands } from './CommandsManager';
import { Prompt } from './commonLogic/Prompt';
import { InitCommands } from './InitCommands';
import { Game, InitGameData, Version } from './InitGameData';
import './commonLogic/InputFunctions';
import './Utils';

function Init() {
    InitGameData();
    InitCommands();
    Engine.Output('Dungeon Crawler 2, wersja:');
    Engine.Output(Version);
    Commands.Go.changePlayerLocation(
        Game.GetRoom(Game.StartingRoom),
        new CommandCallback(() => {
            Engine.Output('');
            Prompt.Print();
        }),
    );
}

declare global {
    function Init(): void;
}
global.Init = Init;
