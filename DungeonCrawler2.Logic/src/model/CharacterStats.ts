import { AttributesTemplate, StatsTemplate } from '../data/Common';
import { Character } from './Character';

export interface IStats {
    Strength: number;
    Dexterity: number;
    Agility: number;
    Endurance: number;
    Vitality: number;
}

export class Stats implements IStats {
    Strength: number = 0;
    Dexterity: number = 0;
    Agility: number = 0;
    Endurance: number = 0;
    Vitality: number = 0;

    constructor(stats?: StatsTemplate) {
        if (stats) {
            Object.assign(this, stats);
        }
    }

    add(other: IStats) {
        return addStats(this, other);
    }

    multiply(other: IStats) {
        return multiplyStats(this, other);
    }
}

export interface IAttributes {
    Attack: number;
    Defense: number;
    Health: number;
    Armor: number;
    ArmorProtection: number;
    Fatigue: number;
    Damage: number;
}

export class Attributes implements IAttributes {
    Attack: number = 0;
    Defense: number = 0;
    Health: number = 0;
    Armor: number = 0;
    ArmorProtection: number = 0;
    Fatigue: number = 0;
    Damage: number = 0;

    constructor(attributes?: AttributesTemplate) {
        if (attributes) {
            Object.assign(this, attributes);
        }
    }

    add(other: IAttributes) {
        return addAttributes(this, other);
    }

    multiply(attrModifier: IAttributes): Attributes {
        return multiplyAttributes(this, attrModifier);
    }
}

export class CharacterStats {
    Level: number = 1;

    statsBase: IStats = new Stats();
    statsBonus: IStats = new Stats();
    statsTotal: IStats = new Stats();

    attrBonus: IAttributes = new Attributes();
    attrModifier: IAttributes = new Attributes();
    attrTotal: IAttributes = new Attributes();

    currentHealth: number = 100;
    currentArmor: number = 0;

    constructor() {}

    loadFromSave(savedStats: CharacterStats) {
        Object.assign(this, savedStats);
    }
}

export function addStats(a: IStats, b: IStats) {
    return new Stats({
        Strength: a.Strength + b.Strength,
        Dexterity: a.Dexterity + b.Dexterity,
        Agility: a.Agility + b.Agility,
        Endurance: a.Endurance + b.Endurance,
        Vitality: a.Vitality + b.Vitality,
    });
}

export function multiplyStats(a: IStats, b: IStats) {
    return new Stats({
        Strength: Math.round(a.Strength * b.Strength),
        Dexterity: Math.round(a.Dexterity * b.Dexterity),
        Agility: Math.round(a.Agility * b.Agility),
        Endurance: Math.round(a.Endurance * b.Endurance),
        Vitality: Math.round(a.Vitality * b.Vitality),
    });
}

export function addAttributes(a: IAttributes, b: IAttributes) {
    return new Attributes({
        Attack: a.Attack + b.Attack,
        Defense: a.Defense + b.Defense,
        Health: a.Health + b.Health,
        Armor: a.Armor + b.Armor,
        ArmorProtection: a.ArmorProtection + b.ArmorProtection,
        Fatigue: a.Fatigue + b.Fatigue,
        Damage: a.Damage + b.Damage,
    });
}

export function multiplyAttributes(a: IAttributes, b: IAttributes) {
    return new Attributes({
        Attack: Math.round(a.Attack * b.Attack),
        Defense: Math.round(a.Defense * b.Defense),
        Health: Math.round(a.Health * b.Health),
        Armor: Math.round(a.Armor * b.Armor),
        ArmorProtection: Math.round(a.ArmorProtection * b.ArmorProtection),
        Fatigue: Math.round(a.Fatigue * b.Fatigue),
        Damage: Math.round(a.Damage * b.Damage),
    });
}
