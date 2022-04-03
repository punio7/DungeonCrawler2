export class CommandCallback {
    callback: Function;
    callbackCalled: boolean;
    interruptFlow: boolean;
    constructor(callback: Function) {
        this.callback = callback;
        this.callbackCalled = false;
        this.interruptFlow = false;
    }

    /** If command can cause interruptFlow, make sure to call this method at the end of command execution */
    CallIfNotCalled() {
        if (!this.callbackCalled) {
            this.callback();
            this.callbackCalled = true;
        }
    }
}
