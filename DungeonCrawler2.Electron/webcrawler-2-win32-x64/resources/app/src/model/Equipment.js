"use strict";
class Equipment {
    constructor(template) {
        this.Array = [];
    }

    validateSlot(slot) {
        if (EquipmentSlots.getKey(slot) === null) {
            throw "{0} is not a proper equipment slot.".format(slot);
        }
    }

    equip(slot, item) {
        if (item === null) {
            return;
        }
        if (!item instanceof Item) {
            throw "Only Item objects can be added to equipment.";
        }
        this.validateSlot(slot);
        if (this.Array[slot] !== undefined) {
            throw "Cannot equip, {0} already contains an item.".format(EquipmentSlots.getKey(slot));
        }

        this.Array[slot] = item;
    }

    remove(slot) {
        this.validateSlot(slot);
        if (this.Array[slot] === undefined) {
            throw "Cannot remove, {0} doesn't contains an item.".format(EquipmentSlots.getKey(slot));
        }

        delete this.Array[slot];
    }

    get(slot) {
        this.validateSlot(slot);

        if (this.Array[slot] === undefined) {
            return null;
        }
        return this.Array[slot];
    }

    hasLightSource() {
        return this.Array.some(i => i.isLightSource() === true);
    }
}