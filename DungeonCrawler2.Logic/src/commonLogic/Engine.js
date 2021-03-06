﻿"use strict";
class EngineClass {
    constructor() {
        this.Input;
        this.EndLine = '<br/>';
        this.NonBreakingSpace = "&nbsp;"
        this.DefaultColor = '|W';
    }

    /**
     * 
     * @param {string} message
     * @param {boolean} isNewLine
     */
    Output(message = "", isNewLine = true) { }

    /**
     * 
     * @param {string} location
     */
    LoadScript(location) { }

    /**
     * 
     * @param {string} location Location of a file to load
     * @returns {object}
     */
    LoadData(location) { }

    Reload() { }

    Exit() { }
}

var Engine = new EngineClass();