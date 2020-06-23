"use strict";
class Character {
    constructor(template) {
        Object.assign(this, template);

        let inventoryModel = new ItemList();
        if (this.Inventory !== undefined) {
            this.Inventory.forEach(itemDefinition => {
                inventoryModel.add(Game.SpawnItem(itemDefinition));
            });
        }
        this.Inventory = inventoryModel;

        let equipmentModel = new Equipment();
        if (this.Equipment !== undefined) {
            this.Equipment.forEach(eq => {
                equipmentModel.equip(EquipmentSlots.parse(eq.Slot), Game.SpawnItem(eq.Item));
            });
        }
        this.Equipment = equipmentModel;
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