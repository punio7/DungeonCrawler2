export class ItemLock {
    IsLocked: boolean;
    KeyId: string;
    constructor(template: unknown) {
        this.IsLocked = true;
        Object.assign(this, template);
    }
}