class Stat {
    base: number;
    race: number;
    class: number;
    bonus: number;
    total: number;
}

class Attribute {
    stat: number;
    level: number;
    eq: number;
    bonus: number;
    modifier: number;
    total: number;
}

export class CharacterStats {
    level: number;
    
    strength: Stat;
    dexterity: Stat;
    agility: Stat;
    endurance: Stat;
    vitality: Stat;
    
    attack: Attribute;
    defense: Attribute;
    health: Attribute = new Attribute();
    armor: Attribute;
    fatigue: Attribute;
    damage: Attribute;
    
    currentHealth: number;
    currentArmor: number;
    
    constructor() {
        this.currentHealth = 100;
        this.health.total = 100;
    }
}