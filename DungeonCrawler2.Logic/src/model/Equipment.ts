import { EquipmentSlot, EquipmentSlotHelper } from '../enums/EquipmentSlot';
import { Item } from './Item';

class EquipmentList {
    [slot: string]: Item;
}

export class Equipment {
    List: EquipmentList;
    constructor() {
        this.List = new EquipmentList();
    }

    loadFromSave(savedEquipment: Equipment) {
        for (const eqSlot in savedEquipment.List) {
            let newItem = new Item();
            newItem.loadFromSave(savedEquipment.List[eqSlot]);
            this.List[eqSlot] = newItem;
        }
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
        if (this.List[slot] !== undefined) {
            throw 'Cannot equip, {0} already contains an item.'.format(EquipmentSlotHelper.getKey(slot));
        }

        this.List[slot] = item;
    }

    remove(slot: EquipmentSlot) {
        this.validateSlot(slot);
        if (this.List[slot] === undefined) {
            throw new Error("Cannot remove, {0} doesn't contains an item.".format(EquipmentSlotHelper.getKey(slot)));
        }

        delete this.List[slot];
    }

    get(slot: EquipmentSlot) {
        this.validateSlot(slot);

        if (this.List[slot] === undefined) {
            return null;
        }
        return this.List[slot];
    }

    find(name: string, number = 1): [Item, EquipmentSlot] | null {
        let found: [Item, EquipmentSlot] | null = null;
        for (const eqSlot in this.List) {
            if (this.List.hasOwnProperty(eqSlot)) {
                let item = this.List[eqSlot];
                if (item.getName().search(name) >= 0) {
                    if (number <= 1) {
                        found = [item, EquipmentSlotHelper.parse(eqSlot)!];
                        break;
                    } else {
                        number--;
                    }
                }
            }
        }

        return found;
    }

    hasLightSource() {
        let hasLight = false;
        for (const key in this.List) {
            let item = this.List[key];
            if (item.isLightSource()) {
                hasLight = true;
                break;
            }
        }
        return hasLight;
    }

    print(): string {
        let output = '';
        EquipmentSlotHelper.forEach((eqSlot) => {
            if (this.List.hasOwnProperty(eqSlot)) {
                const item = this.List[eqSlot];
                if (output !== '') {
                    output += Engine.EndLine;
                }
                output += '{0}: {1}\n'.format(EquipmentSlotHelper.getLocale(eqSlot), item.getName());
            }
        });

        return output;
    }
}
