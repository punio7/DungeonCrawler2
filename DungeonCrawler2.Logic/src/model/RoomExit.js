"use strict";
class RoomExit {
    constructor(template) {
        this.RoomId = 0;
        Object.assign(this, template);
        delete this.Direction;
    }

    isDoor() {
        return this.IsDoor == true;
    }
    isClosed() {
        return this.IsClosed == true;
    }
    isLocked() {
        return this.IsLocked == true;
    }
    getKeyNumber() {
        if (this.KeyNumber == undefined) {
            return null;
        }
        return this.KeyNumber;
    }
}