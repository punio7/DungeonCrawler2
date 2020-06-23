class EngineClass {
    constructor() {
        this.Input;
        this.EndLine = '<br/>';
        this.NonBreakingSpace = "&nbsp;"
        this.fileSystem = require('fs');
        this.loadScript = require('load-script');
        this.lineFinished = true;
        this.currentTextClass = "W";
        this.defaultColorCode = "W";
    }

    get DefaultColor() {
        return "|" + this.defaultColorCode;
    }

    Output(message = "", isNewLine = true) {
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
        this.currentTextClass = this.defaultColorCode;
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

    LoadScript(location) {
        console.log('Loading script file ' + location);
        var data = this.fileSystem.readFileSync(__dirname + '/' + location, { encoding: 'utf-8' });
        //eval(data);
        this.loadScript(location, { async: false });
    }

    LoadData(location) {
        console.log('Loading data file ' + location);
        var data = this.fileSystem.readFileSync(__dirname + '/' + location, { encoding: 'utf-8' });
        return data.replace(/^\uFEFF/, '');
    }

    Reload() {
        location.reload();
    }

    Exit() {

    }
};

var Engine = new EngineClass();