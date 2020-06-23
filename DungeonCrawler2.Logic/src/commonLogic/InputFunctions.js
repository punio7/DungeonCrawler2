"use strict";

function Execute(command) {
    Commands.Execute(command);
}

function SkipPrinter() {
    EngineUtils.SkipPrinter();
}

function ResumeExecution() {
    Commands.ExecuteNext();
}