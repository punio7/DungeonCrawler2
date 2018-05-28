class EngineClass {
    constructor() {
        this.Input;
        this.EndLine = '<br/>';
        this.NonBreakingSpace = "&nbsp;"
        this.fileSystem = require('fs');
        this.loadScript = require('load-script');
        this.lineFinished = true;
    }

    Output(message, isNewLine = true) {
        if (message == "") message = this.EndLine;

        let element = null;
        if (this.lineFinished === true) {
            element = $('<div>');
            element.html(message);
            $('#consoleOutput').append(element);
        }
        else {
            element = $('#consoleOutput div:last-child');
            element.html(element.html() + message);
        }
        this.lineFinished = isNewLine;
        element[0].scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
    
    LoadScript(location) {
        console.log('Loading script file ' + location);
        var data = this.fileSystem.readFileSync(location, { encoding: 'utf-8'});
        //eval(data);
        this.loadScript(location, {async: false} );
    }

    LoadData(location) {
        console.log('Loading data file ' + location);
        var data = this.fileSystem.readFileSync(location, { encoding: 'utf-8'});
        return data.replace(/^\uFEFF/, '');
    }
    
    Reload() {
    
    }
    
    Exit() {
    
    }
};

var Engine = new EngineClass();