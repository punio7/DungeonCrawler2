"use strict";
class Character {
    constructor(template) {
        Object.assign(this, template);

        let newInventory = new ItemList();
        if (this.Inventory !== undefined) {
            this.Inventory.forEach(itemDefinition => {
                newInventory.add(Game.spawnItem(itemDefinition));
            });
        }
        this.Inventory = newInventory;

        let newEquipment = new Equipment();
        if (this.Equipment !== undefined) {
            this.Equipment.forEach(eq => {
                newEquipment.equip(EquipmentSlots.parse(eq.Slot), Game.spawnItem(eq.Item));
            });
        }
        this.Equipment = newEquipment;
    }

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