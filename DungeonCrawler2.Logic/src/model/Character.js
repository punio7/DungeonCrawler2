"use strict";
class Character {
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