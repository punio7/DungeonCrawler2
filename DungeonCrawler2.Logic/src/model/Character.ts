import { GramaCase } from '../enums/GramaCase';
import { EntityBase } from './EntityBase';
import { Equipment } from './Equipment';
import { ItemList } from './ItemList';
import { addStats, Attributes, CharacterStats, IAttributes, IStats, multiplyStats, Stats } from './CharacterStats';
import { Local } from '../InitGameData';
import { Data } from '../data/Data';
import { CharacterData } from '../data/CharactersData';

export class Character extends EntityBase {
    Inventory: ItemList = new ItemList();
    Equipment: Equipment = new Equipment();
    Stats: CharacterStats = new CharacterStats();

    private getTemplate(): CharacterData {
        return Data.CharacterTemplates.getTemplate(this.Id);
    }

    loadFromSave(savedCharacter: Character) {
        Object.assign(this, savedCharacter);
        this.Inventory = new ItemList();
        this.Inventory.loadFromSave(savedCharacter.Inventory);
        this.Equipment = new Equipment();
        this.Equipment.loadFromSave(savedCharacter.Equipment);
        this.Stats = new CharacterStats();
        this.Stats.loadFromSave(savedCharacter.Stats);
    }

    getName(gramaCase = GramaCase.Mianownik) {
        return this.getTemplate().Name[gramaCase];
    }

    getDescription() {
        return this.getTemplate().Description;
    }

    getIdle() {
        return this.getTemplate().Idle;
    }

    getInventory() {
        return this.Inventory;
    }

    getEquipment() {
        return this.Equipment;
    }

    hasLightSource() {
        return this.getEquipment().hasLightSource();
    }

    getRace() {
        return Data.Races.getTemplate(this.getTemplate().Race);
    }

    getClass() {
        return Data.Classes.getTemplate(this.getTemplate().Class);
    }

    getHealthLevel(description: boolean) {
        let percentage = (this.Stats.currentHealth * 100) / this.Stats.statsTotal.Strength;
        let level: string;
        if (percentage >= 100) {
            level = description ? Local.Stats.HealthLevels.Full : '█████';
            return '|G' + level + Engine.DefaultColor;
        }
        if (percentage > 80) {
            level = description ? Local.Stats.HealthLevels.LightWounds : '█████';
            return '|g' + level + Engine.DefaultColor;
        }
        if (percentage > 60) {
            level = description ? Local.Stats.HealthLevels.MediumWounds : '████░';
            return '|Y' + level + Engine.DefaultColor;
        }
        if (percentage > 40) {
            level = description ? Local.Stats.HealthLevels.SeriousWounds : '███░░';
            return '|Y' + level + Engine.DefaultColor;
        }
        if (percentage > 20) {
            level = description ? Local.Stats.HealthLevels.HeavyWounds : '██░░░';
            return '|R' + level + Engine.DefaultColor;
        }
        if (percentage >= 0) {
            level = description ? Local.Stats.HealthLevels.NearDeath : '█░░░░';
            return '|R' + level + Engine.DefaultColor;
        }
        level = description ? Local.Stats.HealthLevels.Dead : '░░░░░';
        return '|R' + level + Engine.DefaultColor;
    }

    recalculate() {
        let statsRace = new Stats(this.getRace().Stats);
        let statsClass = this.calculateClassStats();
        let statsBonus = this.calculateStatsBonus();
        let statsTotal = new Stats()
            .add(this.Stats.statsBase)
            .add(multiplyStats(this.Stats.statsBase, addStats(statsClass, statsRace)))
            .add(statsBonus);
        this.Stats.statsTotal = statsTotal;

        let attrStats = this.calculateAttributesFromStats(this.Stats.statsTotal);
        let attrLevel = this.calculateAttributesFromLevel();
        let attrEq = this.calculateAttributesFromEquipment();
        //TODO: recalculate attrBonus from buffs, debuffs, conditions etc.
        let attrBonus = new Attributes();
        let attrModifier = this.calculateAttributesModifier();
        let attributesTotal = new Attributes().add(attrStats).add(attrLevel).add(attrEq).add(attrBonus);
        // damage attribute is a bonus modifier based on weapon damage
        attributesTotal.Damage = (attrStats.Damage + attrBonus.Damage) * attrEq.Damage;
        // character's total protection is the average protection of all equipped armor
        attributesTotal.ArmorProtection = attributesTotal.ArmorProtection / 6;
        attributesTotal = attributesTotal.multiply(attrModifier);
        this.Stats.attrTotal = attributesTotal;
    }

    calculateClassStats() {
        // Character's class bonuses increases the given
        // amount every 2 levels
        let classMultiply = Math.floor(this.Stats.Level / 2);
        return new Stats(this.getClass().Stats).multiplyByNumber(classMultiply);
    }

    calculateStatsBonus() {
        let bonusStats = new Stats();
        for (let slot in this.Equipment.Array) {
            let item = this.Equipment.Array[slot];
            if (item.getStatsBonus() !== null) {
                bonusStats = bonusStats.add(item.getStatsBonus()!);
            }
        }
        return bonusStats;
    }

    calculateAttributesFromStats(stats: IStats) {
        return new Attributes({
            Attack: Math.floor(5 * stats.Dexterity + 0.25 * stats.Agility),
            Defense: Math.floor(5 * stats.Agility + 0.25 * stats.Dexterity),
            Health: Math.floor(2 * stats.Strength + 0.5 * stats.Endurance),
            Armor: stats.Endurance,
            ArmorProtection: 0,
            Fatigue: Math.round(20 + 0.045 * stats.Endurance + 0.04 * stats.Vitality),
            Damage: (Math.pow(this.Stats.Level + stats.Strength, 0.9) * 1.2) / 100,
        });
    }

    calculateAttributesFromLevel() {
        return new Attributes({
            Attack: 3 * this.Stats.Level,
            Defense: 3 * this.Stats.Level,
            Health: 4 * this.Stats.Level,
            Armor: 0,
            ArmorProtection: 0,
            Fatigue: Math.floor(0.1 * this.Stats.Level),
            Damage: 0, //Damage stat calculations include the level
        });
    }

    calculateAttributesModifier() {
        //TODO: calculate attributes modifier from buffs, debuffs, conditions etc.
        return new Attributes({
            Attack: 1,
            Defense: 1,
            Health: 1,
            Armor: 1,
            ArmorProtection: 1,
            Fatigue: 1,
            Damage: 1,
        });
    }

    calculateAttributesFromEquipment() {
        let attributes = new Attributes();

        for (let slot in this.Equipment.Array) {
            let item = this.Equipment.Array[slot];
            if (item.getAttributes() !== null) {
                attributes = attributes.add(item.getAttributes()!);
            }
        }
        return attributes;
    }
}
