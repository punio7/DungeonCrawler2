"use strict";
class RoomExit {
    constructor(template) {
        this.RoomId = 0;
        Object.assign(this, template);
        delete this.Direction;
    }

    getRoomId() {
        return this.RoomId;
    }

    isDoor() {
        return this.IsDoor === true;
    }

    isClosed() {
        return this.IsClosed === true;
    }

    isLocked() {
        return this.IsLocked === true;
    }

    isHidden() {
        return this.IsHidden === true;
    }

    getKeyNumber() {
        if (this.KeyNumber == undefined) {
            return null;
        }
        return this.KeyNumber;
    }
}