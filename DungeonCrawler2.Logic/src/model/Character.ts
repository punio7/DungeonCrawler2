import { GrammaCase } from '../enums/GrammaCase';
import { EntityBase } from './EntityBase';
import { Equipment } from './Equipment';
import { ItemList } from './ItemList';
import { CharacterStats } from './CharacterStats';
import { Local } from '../InitGameData';
import { GameData } from './GameData';
import { CharacterTemplate } from '../templates/CharacterTemplate';

export class Character extends EntityBase {
    Inventory: ItemList = new ItemList();
    Equipment: Equipment = new Equipment();
    Stats: CharacterStats = new CharacterStats();

    private getTemplate(): CharacterTemplate {
        return GameData.CharacterTemplates.getTemplate(this.Id);
    }

    getName(grammaCase = GrammaCase.Mianownik) {
        return this.getTemplate().Name[grammaCase];
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

    getHealthLevel(description: boolean) {
        let percentage = (this.Stats.currentHealth * 100) / this.Stats.health.total;
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
}
