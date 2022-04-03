import { EnumHelper } from "./EnumHelper";

export enum EquipmentSlot {
    None = 0,
    Torso = 1,
    Arms = 2,
    Hands = 3,
    Legs = 4,
    Feets = 5,
    Head = 6,
    MainHand = 7,
    OffHand = 8,
    Shirt = 9,
    Pants = 10,
    Coat = 11,
    RightRing = 12,
    LeftRing = 13,
    Necklace = 14,
    Torch = 15,
}

class EquipmentSlotHelperClass extends EnumHelper<EquipmentSlot> {
    constructor() {
        super(EquipmentSlot);
    }
}

export var EquipmentSlotHelper = new EquipmentSlotHelperClass();
