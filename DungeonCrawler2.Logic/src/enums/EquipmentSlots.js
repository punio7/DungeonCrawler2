"use strict";
class EquipmentSlotsEnum extends EnumBase {
    constructor() {
        super();
        this.None = 0;
        this.Torso = 1;
        this.Arms = 2;
        this.Hands = 3;
        this.Legs = 4;
        this.Feets = 5;
        this.Head = 6;
        this.MainHand = 7;
        this.OffHand = 8;
        this.Shirt = 9;
        this.Pants = 10;
        this.Coat = 11;
        this.RightRing = 12;
        this.LeftRing = 13;
        this.Necklace = 14;
        this.Torch = 15;
    }
}

var EquipmentSlots = new EquipmentSlotsEnum();