export class RoomDoor {
    IsLocked?: boolean;
    IsClosed?: boolean;
    KeyId?: string;
    constructor() {}

    loadFromSave(savedDoor: RoomDoor) {
        Object.assign(this, savedDoor);
    }
}
