"use strict";
class GlobalEventArgs {
    /**
     * 
     * @param {string} type String from GlobalEventType
     * @param {any} sender Game entity that activated the event
     * @param {CommandCallback} finishCommandCallback Callback to be called to interrupt and finish command execution
     * @param {function} continueCommandCallback Callback to be called to continue command execution
     */
    constructor(type, sender, finishCommandCallback, continueCommandCallback) {
        this.Type = type;
        this.Sender = sender;
        this.FinishCommandCallback = finishCommandCallback;
        this.ContinueCommandCallback = continueCommandCallback;
    }
}