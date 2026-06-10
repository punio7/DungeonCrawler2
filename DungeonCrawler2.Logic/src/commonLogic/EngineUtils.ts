class EngineUtilsClass {
    skipPrinter: boolean = false;

    OutputPrinter(message: string, callback: Function, delay = 60, isNewLine = true) {
        this.skipPrinter = false;
        this.printNext(message, callback, delay, isNewLine);
    }

    private printNext(message: string, callback: Function, delay: number, isNewLine: boolean) {
        if (message.isNullOrEmpty()) {
            if (isNewLine === true) {
                Engine.Output('');
            }
            callback();
            return;
        }
        if (this.skipPrinter === true) {
            delay = 0;
        }

        Engine.Output(message[0], false);
        Engine.StartTimer(() => {
            this.printNext(message.slice(1), callback, delay, isNewLine);
        }, delay);
    }

    SkipPrinter() {
        this.skipPrinter = true;
    }

    PrintColumns(items: string[], columns: number, columnLength: number) {
        let output = '';
        let columnNumber = 0;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            output += item;
            let numOfSpaces = columnLength - item.length;
            output += Engine.NonBreakingSpace.repeat(numOfSpaces);
            columnNumber++;

            if (columnNumber > columns) {
                Engine.Output(output);
                columnNumber = 0;
                output = '';
            }
        }
        if (output !== '') {
            Engine.Output(output);
        }
    }

    OutputLines(lines: string[]) {
        for (let i = 0; i < lines.length; i++) {
            Engine.Output(lines[i]);
        }
    }
}

export var EngineUtils = new EngineUtilsClass();
