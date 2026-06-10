import { CommandCallback } from '../commandsUtils/CommandCallback';
import { CommandParser } from '../commandsUtils/CommandParser';
import { EngineUtils } from '../commonLogic/EngineUtils';
import { Local } from '../InitGameData';

export abstract class Command {
    constructor() {}

    Execute(command: CommandParser, commandCallback: CommandCallback) {
        this.ExecuteBody(command, commandCallback);
        if (!commandCallback.interruptFlow) {
            commandCallback.CallIfNotCalled();
        }
    }
    abstract ExecuteBody(command: CommandParser, commandCallback: CommandCallback): void;

    Help() {
        let commandHelp = (Local.Commands as any)[this.constructor.name]?.Help as string[];

        if (commandHelp && commandHelp.length > 0) {
            EngineUtils.OutputLines(commandHelp);
        } else {
            Engine.Output(Local.Commands.Help.NoHelp);
        }
    }
}
