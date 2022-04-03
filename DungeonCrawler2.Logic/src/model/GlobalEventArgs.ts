import { CommandCallback } from '../CommandCallback';

export class GlobalEventArgs {
    Type: number;
    Sender: any;
    FinishCommandCallback: CommandCallback;
    ContinueCommandCallback: Function;
    constructor(type: number, sender: any, finishCommandCallback: CommandCallback, continueCommandCallback: Function) {
        this.Type = type;
        this.Sender = sender;
        this.FinishCommandCallback = finishCommandCallback;
        this.ContinueCommandCallback = continueCommandCallback;
    }
}
