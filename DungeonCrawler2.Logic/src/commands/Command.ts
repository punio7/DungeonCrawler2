import { CommandCallback } from '../commandsUtils/CommandCallback';
import { CommandParser } from '../commandsUtils/CommandParser';
import { CommandList } from '../commandsUtils/CommandsManager';
import { EngineUtils } from '../commonLogic/EngineUtils';
import { PlayerState } from '../enums/PlayerState';
import { Game, Local } from '../InitGameData';

export abstract class Command {
    constructor() {}

    get acceptableStates() {
        return [PlayerState.Standing];
    }

    Execute(command: CommandParser, commandCallback: CommandCallback) {
        if (this.validatePlayerState()) {
            this.ExecuteBody(command, commandCallback);
        }
        if (!commandCallback.interruptFlow) {
            commandCallback.CallIfNotCalled();
        }
    }

    validatePlayerState() {
        if (this.acceptableStates.length <= 0) {
            return true;
        }

        if (this.acceptableStates.includes(Game.Player.getState())) {
            return true;
        }

        let message = Local.Commands.Common.PlayerStateMessages[Game.Player.getState()] as string;
        if (message) {
            Engine.Output(message);
        } else {
            Engine.Output(Local.Commands.Common.PlayerStateMessages.Generic);
        }

        return false;
    }

    abstract ExecuteBody(command: CommandParser, commandCallback: CommandCallback): void;

    Help() {
        let helpTopic = this.constructor.name as keyof CommandList;
        let commandHelp = (Local.Commands[helpTopic] as any).Help as string[] | undefined;

        if (commandHelp && commandHelp.length > 0) {
            EngineUtils.OutputLines(commandHelp);
        } else {
            Engine.Output(Local.Commands.Help.NoHelp);
        }
    }
}
