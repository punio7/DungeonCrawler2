"use strict";
class RoomExit {
    constructor(template) {
        this.RoomId = 0;
        Object.assign(this, template);
        delete this.Direction;
    }

    isDoor() {
        return this.IsDoor;
    }
    isClosed() {
        return this.IsClosed;
    }
    isLocked() {
        return this.IsLocked;
    }
    getKeyNumber() {
        return this.KeyNumber;
    }
}