"use strict";
class Command {
    constructor() {
        
    }

    /**
     * 
     * @param {CommandParser} command Comman parser with command info and parameters
     * @param {CommandCallback} commandCallback Callback to continue execution after command finishes
     */
    Execute(command, commandCallback) {
        
        this.ExecuteBody(command, commandCallback);
        if (!commandCallback.interruptFlow) {
            commandCallback.CallIfNotCalled();
        }
    }

    /**
     * 
     * @param {CommandParser} command Comman parser with command info and parameters
     * @param {CommandCallback} commandCallback Callback to continue execution after command finishes
     */
    ExecuteBody(command, commandCallback) {
    }
}