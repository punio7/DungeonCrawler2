import { EnumHelper } from "./EnumHelper";

export enum GlobalEventType {
    BeforeRoomEnter = 1,
}

class GlobalEventTypeHelperClass extends EnumHelper<GlobalEventType> {
    constructor() {
        super(GlobalEventType);
    }
}

export var GlobalEventTypeHelper = new GlobalEventTypeHelperClass();
