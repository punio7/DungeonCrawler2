import { Local } from '../InitGameData';
import { EnumHelper } from './EnumHelper';

export enum EquipmentSlot {
    Head = 'Head',
    Torso = 'Torso',
    Arms = 'Arms',
    Hands = 'Hands',
    Legs = 'Legs',
    Feet = 'Feet',
    Shirt = 'Shirt',
    Pants = 'Pants',
    Coat = 'Coat',
    Necklace = 'Necklace',
    RightRing = 'RightRing',
    LeftRing = 'LeftRing',
    MainHand = 'MainHand',
    OffHand = 'OffHand',
    Torch = 'Torch',
}

class EquipmentSlotHelperClass extends EnumHelper<EquipmentSlot> {
    constructor() {
        super(EquipmentSlot);
    }

    getLocale(slot: EquipmentSlot): string {
        return Local.EquipmentSlot[slot] || slot;
    }
}

export var EquipmentSlotHelper = new EquipmentSlotHelperClass();
