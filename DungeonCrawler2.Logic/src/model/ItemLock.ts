import { LockTemplate } from '../templates/Common';

export class ItemLock {
    IsLocked: boolean;
    KeyId: string;
    constructor(template: LockTemplate) {
        this.IsLocked = true;
        this.KeyId = '';
        Object.assign(this, template);
    }
}
