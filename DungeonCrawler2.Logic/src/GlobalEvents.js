"use strict";
class GlobalEventsClass {
    TestGlobalEvent(args) {
        EngineUtils.OutputPrinter("Testing global events...", args.ContinueCommandCallback);
        return true;
    }
}

var GlobalEvents = new GlobalEventsClass();