import { EngineUtils } from './commonLogic/EngineUtils';
import { Local } from './InitGameData';
import { GlobalEventArgs } from './model/GlobalEventArgs';

class GlobalEventsClass {
    [commandName: string]: (args: GlobalEventArgs) => boolean;
    TestGlobalEvent(args: GlobalEventArgs) {
        EngineUtils.OutputPrinter(Local.GlobalEvents.TestGlobalEvent.Message, args.ContinueCommandCallback);
        return true;
    }
}

export var GlobalEvents = new GlobalEventsClass();
