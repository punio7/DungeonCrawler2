"use strict";
class EngineUtilsClass {
    OutputPrinter(message, callback, delay = 60, isNewLine = true) {
        this.skipPrinter = false;
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
        if (this.skipPrinter === true) {
            delay = 0;
        }

        Engine.Output(message[0], false);
        setTimeout(() => {
            this.printNext(message.slice(1), callback, delay, isNewLine);
        }, delay);
    }

    SkipPrinter() {
        this.skipPrinter = true;
    }
}

var EngineUtils = new EngineUtilsClass();