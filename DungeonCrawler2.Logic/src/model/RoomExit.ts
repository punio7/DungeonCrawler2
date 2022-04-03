export class RoomExit {
    RoomId: number;
    IsDoor: boolean | undefined;
    IsClosed: boolean | undefined;
    IsLocked: boolean | undefined;
    IsHidden: boolean | undefined;
    KeyNumber: number | undefined;
    Direction: any;
    constructor(template: unknown) {
        this.RoomId = 0;
        Object.assign(this, template);
        delete this.Direction;
    }

    GetRoomId() {
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
