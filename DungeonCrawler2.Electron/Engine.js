function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class EngineClass {
    constructor() {
        this.Input;
        this.EndLine = '<br/>';
        this.NonBreakingSpace = "&nbsp;"
        this.fileSystem = require('fs');
        this.loadScript = require('load-script');
        this.lineFinished = true;
        this.currentTextClass = "W";
    }

    Output(message, isNewLine = true) {
        let element = null;

        this.analyzeAndWrite(message);

        if (isNewLine === true) {
            $('#consoleOutput').append(this.EndLine);
        }

        var consoleContainer = $('.consoleContainer');
        consoleContainer[0].scrollTop = consoleContainer[0].scrollHeight;
    }

    analyzeAndWrite(message) {
        var messageToWrite = "";
        this.currentTextClass = "W"
        for (var i = 0; i < message.length; i++) {
            if (message[i] !== '|') {
                messageToWrite += message[i];
            }
            else {
                this.write(messageToWrite);
                messageToWrite = "";
                i++;
                this.changeTextClass(message[i]);
            }
        }

        this.write(messageToWrite);
    }

    changeTextClass(code) {
        this.currentTextClass = code;
    }

    write(message) {
        if (message === "") {
            return;
        }

        var element = $('<span>');
        element.addClass(this.currentTextClass);
        element.html(message);
        $('#consoleOutput').append(element);
    }

    async OutputPrinter(message, isNewLine = true, delay = 60) {
        this.Output(message, isNewLine);
        //if (message == "") message = this.EndLine;

        //let element = null;
        //if (this.lineFinished === true) {
        //    element = $('<div>');
        //    $('#consoleOutput').append(element);
        //}
        //else {
        //    element = $('#consoleOutput div:last-child');
        //}

        //for (var i = 0; i < message.length; i++) {
        //    element.html(element.html() + message[i]);
        //    element[0].scrollIntoView({
        //        behavior: 'smooth'
        //    });
        //    await sleep(delay);
        //}
        //this.lineFinished = isNewLine;
    }

    LoadScript(location) {
        console.log('Loading script file ' + location);
        var data = this.fileSystem.readFileSync(location, { encoding: 'utf-8' });
        //eval(data);
        this.loadScript(location, { async: false });
    }

    LoadData(location) {
        console.log('Loading data file ' + location);
        var data = this.fileSystem.readFileSync(location, { encoding: 'utf-8' });
        return data.replace(/^\uFEFF/, '');
    }

    Reload() {
        location.reload();
    }

    Exit() {

    }
};

var Engine = new EngineClass();