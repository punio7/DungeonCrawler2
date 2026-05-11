import { CommandCallback } from '../commandsUtils/CommandCallback';

export class GlobalEventArgs {
    Type: number;
    Sender: any;
    TerminateCommandCallback: CommandCallback;
    ContinueCommandCallback: Function;
    constructor(
        type: number,
        sender: any,
        terminateCommandCallback: CommandCallback,
        continueCommandCallback: Function,
    ) {
        this.Type = type;
        this.Sender = sender;
        this.TerminateCommandCallback = terminateCommandCallback;
        this.ContinueCommandCallback = continueCommandCallback;
    }
}
