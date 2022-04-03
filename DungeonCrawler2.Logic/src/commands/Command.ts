import { CommandCallback } from '../CommandCallback';
import { CommandParser } from '../CommandParser';

export class Command {
    constructor() {}

    Execute(command: CommandParser, commandCallback: CommandCallback) {
        this.ExecuteBody(command, commandCallback);
        if (!commandCallback.interruptFlow) {
            commandCallback.CallIfNotCalled();
        }
    }

    ExecuteBody(command: CommandParser, commandCallback: CommandCallback) {}
}
