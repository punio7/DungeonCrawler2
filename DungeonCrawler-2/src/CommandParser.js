"use strict";
class CommandParser {
    constructor(commandString) {
        this.commandString = commandString;
        this.parsedCommand = '';
    };

    getCommand() {
        if (this.parsedCommand === '') {
            let spaceIndex = this.commandString.indexOf(' ');
            if (spaceIndex === -1) {
                this.parsedCommand = this.commandString;
            }
            else {
                this.parsedCommand = this.commandString.slice(0, spaceIndex)
            }
        }
        this.parsedCommand = this.parsedCommand.toLowerCase();
        return this.parsedCommand;
    };

    getArgument(index) {
        return this.commandString.split(" ")[index + 1];
    };

    getNumber(index) {
        return 1;
    };
};