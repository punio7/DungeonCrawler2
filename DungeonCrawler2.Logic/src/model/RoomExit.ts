import { RoomDoor } from './RoomDoor';

export class RoomExit {
    RoomId: number = 0;
    IsHidden?: boolean;
    Door?: RoomDoor;
    constructor() {}

    loadFromSave(savedExit: RoomExit) {
        Object.assign(this, savedExit);
        if (savedExit.Door !== undefined) {
            this.Door = new RoomDoor();
            this.Door.loadFromSave(savedExit.Door);
        }
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
