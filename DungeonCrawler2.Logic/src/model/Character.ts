import { GrammaCase } from '../enums/GrammaCase';
import { EntityBase } from './EntityBase';
import { Equipment } from './Equipment';
import { ItemList } from './ItemList';

export class Character extends EntityBase {
    Name: string[];
    Description: string;
    Idle: string;
    Inventory: ItemList;
    Equipment: Equipment;

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
            return new ItemList();
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
}
