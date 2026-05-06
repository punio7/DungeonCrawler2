import { EnumHelper } from './EnumHelper';

export type ItemType2 =
    | 'Weapon1H'
    | 'Weapon2H'
    | 'Shield'
    | 'Armor'
    | 'Shoulders'
    | 'Gloves'
    | 'Greaves'
    | 'Boots'
    | 'Helmet'
    | 'Shirt'
    | 'Pants'
    | 'WildShield'
    | 'WildArmor'
    | 'WildShoulders'
    | 'WildGloves'
    | 'WildGreaves'
    | 'WildBoots'
    | 'WildHelmet'
    | 'Ring'
    | 'Necklace'
    | 'Potion'
    | 'Food'
    | 'Trash'
    | 'Currency'
    | 'Container'
    | 'StaticContainer'
    | 'Quest'
    | 'Static'
    | 'Lever';

export enum ItemType {
    Weapon1H = 'Weapon1H',
    Weapon2H = 'Weapon2H',
    Shield = 'Shield',
    Armor = 'Armor',
    Shoulders = 'Shoulders',
    Gloves = 'Gloves',
    Greaves = 'Greaves',
    Boots = 'Boots',
    Helmet = 'Helmet',
    Shirt = 'Shirt',
    Pants = 'Pants',
    WildShield = 'WildShield',
    WildArmor = 'WildArmor',
    WildShoulders = 'WildShoulders',
    WildGloves = 'WildGloves',
    WildGreaves = 'WildGreaves',
    WildBoots = 'WildBoots',
    WildHelmet = 'WildHelmet',
    Ring = 'Ring',
    Necklace = 'Necklace',
    Potion = 'Potion',
    Food = 'Food',
    Trash = 'Trash',
    Currency = 'Currency',
    Container = 'Container',
    StaticContainer = 'StaticContainer',
    Quest = 'Quest',
    Static = 'Static',
    Lever = 'Lever',
}

class ItemTypeHelperClass extends EnumHelper<ItemType> {
    constructor() {
        super(ItemType);
    }
}

export var ItemTypeHelper = new ItemTypeHelperClass();
