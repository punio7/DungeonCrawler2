export class RoomDoor {
    IsLocked?: boolean;
    IsClosed?: boolean;
    KeyId?: string;
    constructor(template: unknown) {
        this.IsClosed = true;
        Object.assign(this, template);
        if (this.IsLocked === undefined && this.IsClosed !== undefined) {
            this.IsLocked = true;
        }
    }
}