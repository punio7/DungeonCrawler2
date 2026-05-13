import { CommandCallback } from '../commandsUtils/CommandCallback';
import { CommandParser } from '../commandsUtils/CommandParser';

export abstract class Command {
    constructor() {}

    Execute(command: CommandParser, commandCallback: CommandCallback) {
        this.ExecuteBody(command, commandCallback);
        if (!commandCallback.interruptFlow) {
            commandCallback.CallIfNotCalled();
        }
    }
    abstract ExecuteBody(command: CommandParser, commandCallback: CommandCallback): void;
}
