"use strict";
class EquipmentSlotsEnum extends EnumBase {
    constructor() {
        super();
        this.Torso = 0;
        this.Arms = 1;
        this.Hands = 2;
        this.Legs = 3;
        this.Feets = 4;
        this.Head = 5;
        this.RightHand = 6;
        this.LeftHand = 7;
        this.Shirt = 8;
        this.Pants = 9;
        this.Coat = 10;
        this.RightRing = 11;
        this.LeftRing = 12;
        this.Necklace = 13;
        this.Torch = 14;
    }
}

var EquipmentSlots = new EquipmentSlotsEnum();