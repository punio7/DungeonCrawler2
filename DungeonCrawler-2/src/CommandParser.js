﻿"use strict";
class CommandParser {
    constructor(commandString) {
        this.commandString = commandString;
        this.parsedCommand = '';
        this.parsedArguments = null;
        this.parsedNumbers = null;
    };

    getCommand() {
        if (this.parsedCommand === '') {
            this.parseCommand();
        }
        this.parsedCommand = this.parsedCommand.toLowerCase();
        return this.parsedCommand;
    };

    parseCommand() {
        let spaceIndex = this.commandString.indexOf(' ');
        if (spaceIndex === -1) {
            this.parsedCommand = this.commandString;
        }
        else {
            this.parsedCommand = this.commandString.slice(0, spaceIndex)
        }
    }

    getArgument(index) {
        if (this.parsedArguments === null) {
            this.parseArguments();
        }
        if (this.parsedArguments[index] === undefined) {
            return null;
        }
        return this.parsedArguments[index];
    };

    getNumber(index) {
        if (this.parsedNumbers === null) {
            this.parseArguments();
        }
        if (this.parsedNumbers[index] === undefined) {
            return null;
        }
        return this.parsedNumbers[index];
    };

    parseArguments() {
        this.parsedArguments = [];
        this.parsedNumbers = [];
        let startIndex = this.commandString.indexOf(' ')
        let endIndex;
        let currentCommand = this.commandString;
        let currentArgumentNumber = 0;

        while (startIndex !== -1) {
            startIndex++;
            currentCommand = currentCommand.slice(startIndex);
            currentArgumentNumber++;
            let parsedNumber = null;

            while (!currentCommand === '' && currentCommand[0] === ' ') {
                currentCommand = currentCommand.slice(1);
            }
            if (currentCommand === '') {
                break;
            }
            // wyciąganie numeru dla argumentu
            if (currentCommand[0].isNumber()) {
                let currentIndex = 1;
                while (currentCommand[currentIndex].isNumber()) {
                    currentIndex++;
                }
                if (currentCommand[currentIndex] === '.') {
                    parsedNumber = Number.parseInt(currentCommand.slice(0, currentIndex), 10);
                    this.parsedNumbers[currentArgumentNumber] = parsedNumber;
                    currentCommand = currentCommand.slice(currentIndex + 1);

                    if (currentCommand === '') {
                        break;
                    }
                }
            }
            //jezeli nie wskazano liczby, to domyślnie jest 1
            if (parsedNumber === null) {
                this.parsedNumbers[currentArgumentNumber] = 1;
            }

            //wyciąganie treści argumentu
            if (currentCommand[0] === '"') {
                startIndex = 1;
                endIndex = currentCommand.indexOf('"', 1);
            }
            else {
                startIndex = 0;
                endIndex = currentCommand.indexOf(' ', 1);
            }
            if (endIndex === -1) {
                endIndex = currentCommand.length;
            }

            this.parsedArguments[currentArgumentNumber] = currentCommand.slice(startIndex, endIndex);
            startIndex = endIndex;
        }
    }
};