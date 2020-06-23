"use strict";
class GlobalEventsClass {
    TestGlobalEvent(args) {
        EngineUtils.OutputPrinter(Local.GlobalEvents.TestGlobalEvent.Message, args.ContinueCommandCallback);
        return true;
    }
}

var GlobalEvents = new GlobalEventsClass();