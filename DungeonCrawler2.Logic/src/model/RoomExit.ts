import {RoomDoor} from "./RoomDoor";

export class RoomExit {
    RoomId: number;
    IsHidden?: boolean;
    Door?: RoomDoor;
    Direction: any;
    constructor(template: unknown) {
        this.RoomId = 0;
        Object.assign(this, template);
        delete this.Direction;
    }

    getRoomId() {
        return this.RoomId;
    }

    isDoor() {
        return this.Door !== undefined;
    }

    isClosed() {
        return this.Door?.IsClosed === true;
    }

    isLocked() {
        return this.Door?.IsLocked === true;
    }

    isHidden() {
        return this.IsHidden === true;
    }

    getKeyId() {
        if (this.Door?.KeyId === undefined) {
            return null;
        }
        return this.Door.KeyId!;
    }
}
