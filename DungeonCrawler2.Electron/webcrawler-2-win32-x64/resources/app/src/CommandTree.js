"use strict";

class CommandTree {
    constructor() {
        this.root = { command: null };
    };

    AddNewCommand(name, object) {
        if (!name || name === "") {
            throw "New command name cannot be null or empty";
        }
        this.ValidateCommandObject(object);

        let currentNode = this.root;
        
        name.toLowerCase().split("").forEach((currentChar) => {
            if (currentNode[currentChar] === undefined) {
                currentNode[currentChar] = { command: object };
            }
            currentNode = currentNode[currentChar];
        });
    }

    SetDefaultCommand(object) {
        this.ValidateCommandObject(object);

        this.root.command = object;
    }

    ValidateCommandObject(object) {
        if (object === undefined || object === null) {
            throw "Command object cannot be null";
        }
        if (!(object instanceof Command)) {
            throw "Command object must extend Command class";
        }
    }

    GetCommand(name) {
        let currentNode = this.root;

        name.toLowerCase().split("").some((currentChar) => {
            if (currentNode[currentChar] === undefined) {
                //command not found- return default command
                currentNode = this.root;
                return true;
            }
            currentNode = currentNode[currentChar];
            return false;
        });

        return currentNode.command;
    }
};