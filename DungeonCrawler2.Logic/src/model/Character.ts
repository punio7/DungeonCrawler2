import {GrammaCase} from '../enums/GrammaCase';
import {EntityBase} from './EntityBase';
import {Equipment} from './Equipment';
import {ItemList} from './ItemList';
import {CharacterStats} from "./CharacterStats";
import {Local} from "../InitGameData";

export class Character extends EntityBase {
    Name: string[];
    Description: string;
    Idle: string;
    Inventory?: ItemList;
    Equipment?: Equipment;
    Stats: CharacterStats = new CharacterStats();

    getName(grammaCase = GrammaCase.Mianownik) {
        return this.Name[grammaCase];
    }

    getDescription() {
        return this.Description;
    }

    getIdle() {
        return this.Idle;
    }

    getInventory() {
        if (this.Inventory === undefined) {
            this.Inventory = new ItemList();
        }
        return this.Inventory;
    }

    getEquipment() {
        if (this.Equipment === undefined) {
            return new Equipment();
        }
        return this.Equipment;
    }

    hasLightSource() {
        return this.getEquipment().hasLightSource();
    }

    getHealthLevel(description: boolean) {
        let percentage = (this.Stats.currentHealth * 100) / this.Stats.health.total;
        let level: string;
        if (percentage >= 100) {
            level = description ? Local.Stats.HealthLevels.Full : "█████";
            return "|G" + level + Engine.DefaultColor;
        }
        if (percentage > 80) {
            level = description ? Local.Stats.HealthLevels.LightWounds : "█████";
            return "|g" + level + Engine.DefaultColor;
        }
        if (percentage > 60) {
            level = description ? Local.Stats.HealthLevels.MediumWounds : "████░";
            return "|Y" + level + Engine.DefaultColor;
        }
        if (percentage > 40) {
            level = description ? Local.Stats.HealthLevels.SeriousWounds : "███░░";
            return "|Y" + level + Engine.DefaultColor;
        }
        if (percentage > 20) {
            level = description ? Local.Stats.HealthLevels.HeavyWounds : "██░░░";
            return "|R" + level + Engine.DefaultColor;
        }
        if (percentage >= 0) {
            level = description ? Local.Stats.HealthLevels.NearDeath : "█░░░░";
            return "|R" + level + Engine.DefaultColor;
        }
        level = description ? Local.Stats.HealthLevels.Dead : "░░░░░";
        return "|R" + level + Engine.DefaultColor;
    }
}
