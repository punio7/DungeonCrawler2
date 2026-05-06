class Stat {
    base: number = 0;
    race: number = 0;
    class: number = 0;
    bonus: number = 0;
    total: number = 0;
}

class Attribute {
    stat: number = 0;
    level: number = 0;
    eq: number = 0;
    bonus: number = 0;
    modifier: number = 0;
    total: number = 0;
}

export class CharacterStats {
    level: number = 1;

    strength: Stat = new Stat();
    dexterity: Stat = new Stat();
    agility: Stat = new Stat();
    endurance: Stat = new Stat();
    vitality: Stat = new Stat();

    attack: Attribute = new Attribute();
    defense: Attribute = new Attribute();
    health: Attribute = new Attribute();
    armor: Attribute = new Attribute();
    fatigue: Attribute = new Attribute();
    damage: Attribute = new Attribute();

    currentHealth: number = 100;
    currentArmor: number = 0;

    constructor() {
        this.health.total = 100;
    }
}
