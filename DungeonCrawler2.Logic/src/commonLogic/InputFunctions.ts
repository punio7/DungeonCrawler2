import { Commands } from '../CommandsManager';
import { EngineUtils } from './EngineUtils';

export var InputFunctions = 'true';

function Execute(command: string) {
    Commands.Execute(command);
}

function SkipPrinter() {
    EngineUtils.SkipPrinter();
}

function ResumeExecution() {
    Commands.ExecuteNext();
}

declare global {
    function Execute(command: string): void;
    function SkipPrinter(): void;
    function ResumeExecution(): void;
}
global.Execute = Execute;
global.SkipPrinter = SkipPrinter;
global.ResumeExecution = ResumeExecution;
