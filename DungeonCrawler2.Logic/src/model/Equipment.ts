import { EquipmentSlot, EquipmentSlotHelper } from '../enums/EquipmentSlot';
import { Item } from './Item';

export class Equipment {
    Array: Item[];
    constructor() {
        this.Array = [];
    }

    validateSlot(slot: EquipmentSlot) {
        if (EquipmentSlotHelper.getKey(slot) === null) {
            throw '{0} is not a proper equipment slot.'.format(slot);
        }
    }

    equip(slot: EquipmentSlot, item: Item | null) {
        if (item === null) {
            return;
        }
        this.validateSlot(slot);
        if (this.Array[slot] !== undefined) {
            throw 'Cannot equip, {0} already contains an item.'.format(EquipmentSlotHelper.getKey(slot));
        }

        this.Array[slot] = item;
    }

    remove(slot: EquipmentSlot) {
        this.validateSlot(slot);
        if (this.Array[slot] === undefined) {
            throw "Cannot remove, {0} doesn't contains an item.".format(EquipmentSlotHelper.getKey(slot));
        }

        delete this.Array[slot];
    }

    get(slot: EquipmentSlot) {
        this.validateSlot(slot);

        if (this.Array[slot] === undefined) {
            return null;
        }
        return this.Array[slot];
    }

    hasLightSource() {
        return this.Array.some((i) => i.isLightSource() === true);
    }
}
