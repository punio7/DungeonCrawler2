"use strict";
class CharacterFactory {
    SpawnCharacter(characterId) {
        let template = GameData.CharacterTemplates.getTemplate(characterId);
        let character = new Character();
        character = this.LoadFromTemplate(character, template);

        return character;
    }

    LoadFromTemplate(character, template) {
        Object.assign(character, template);

        let inventoryModel = new ItemList();
        if (character.Inventory !== undefined) {
            character.Inventory.forEach(itemDefinition => {
                inventoryModel.add(Game.SpawnItem(itemDefinition));
            });
        }
        character.Inventory = inventoryModel;

        let equipmentModel = new Equipment();
        if (character.Equipment !== undefined) {
            character.Equipment.forEach(eq => {
                equipmentModel.equip(EquipmentSlots.parse(eq.Slot), Game.SpawnItem(eq.Item));
            });
        }
        character.Equipment = equipmentModel;
        return character;
    }

    LoadFromSave(saveCharacter) {
        let character = new Character();
        Object.assign(character, saveCharacter);

        let inventoryModel = new ItemList();
        if (character.Inventory !== undefined) {
            character.Inventory.forEach(savedItem => {
                inventoryModel.add(Game.LoadItemFromSave(savedItem));
            });
        }
        character.Inventory = inventoryModel;

        let equipmentModel = new Equipment();
        if (character.Equipment !== undefined) {
            character.Equipment.forEach(eq => {
                equipmentModel.equip(EquipmentSlots.parse(eq.Slot), Game.LoadItemFromSave(eq.Item));
            });
        }
        character.Equipment = equipmentModel;

        return character;
    }
}