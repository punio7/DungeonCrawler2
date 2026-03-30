import { EngineUtils } from './commonLogic/EngineUtils';
import { Local } from './InitGameData';
import { GlobalEventArgs } from './model/GlobalEventArgs';

class GlobalEventsClass {
    // If global events returns true, it signals interruption of command execution flow
    // such event must call one of the supplied callbacks:
    // - args.ContinueCommandCallback if the event decides it want to resume the execution 
    //      of the command it was invoked by
    // - args.FinishCommandCallback if the event decides to terminate the execution 
    //      of the command it was invoked by
    [globalEventName: string]: (args: GlobalEventArgs) => boolean;
    TestGlobalEvent(args: GlobalEventArgs) {
        EngineUtils.OutputPrinter(Local.GlobalEvents.TestGlobalEvent.Message, args.ContinueCommandCallback);
        return true;
    }
}

export var GlobalEvents = new GlobalEventsClass();
