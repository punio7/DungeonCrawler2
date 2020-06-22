"use strict";
class EngineUtilsClass {
    OutputPrinter(message, callback, delay = 60, isNewLine = true) {
        this.printNext(message, callback, delay, isNewLine);
    }

    printNext(message, callback, delay, isNewLine) {
        if (message.isNullOrEmpty()) {
            if (isNewLine === true) {
                Engine.Output("");
            }
            callback();
            return;
        }

        Engine.Output(message[0], false);
        setTimeout(() => {
            this.printNext(message.slice(1), callback, delay, isNewLine);
        }, delay);
    }
}

var EngineUtils = new EngineUtilsClass();