"use strict";

class ItemTypesEnum extends EnumBase {
    constructor() {
        super();
        this.Weapon1H           = "Weapon1H";
        this.Weapon2H           = "Weapon2H";
        this.Shield             = "Shield";
        this.Armor              = "Armor";
        this.Shoulders          = "Shoulders";
        this.Gloves             = "Gloves";
        this.Greaves            = "Greaves";
        this.Boots              = "Boots";
        this.Helmet             = "Helmet";
        this.Shirt              = "Shirt";
        this.Pants              = "Pants";
        this.WildShield         = "WildShield";
        this.WildArmor          = "WildArmor";
        this.WildShoulders      = "WildShoulders";
        this.WildGloves         = "WildGloves";
        this.WildGreaves        = "WildGreaves";
        this.WildBoots          = "WildBoots";
        this.WildHelmet         = "WildHelmet";
        this.Ring               = "Ring";
        this.Necklace           = "Necklace";
        this.Potion             = "Potion";
        this.Food               = "Food";
        this.Trash              = "Trash";
        this.Currency           = "Currency";
        this.Container          = "Container";
        this.StaticContainer    = "StaticContainer";
        this.Quest              = "Quest";
        this.Static             = "Static";
        this.Lever              = "Lever";
    }
}

var ItemTypes = new ItemTypesEnum();