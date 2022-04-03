import { EquipmentSlotHelper } from '../enums/EquipmentSlot';
import { Game } from '../InitGameData';
import { Character } from '../model/Character';
import { Equipment } from '../model/Equipment';
import { GameData } from '../model/GameData';
import { ItemList } from '../model/ItemList';
import { CharacterTemplate } from '../templates/CharacterTemplate';

export class CharacterFactory {
    SpawnCharacter(characterId: string) {
        let template = GameData.CharacterTemplates.getTemplate(characterId);
        let character = new Character();
        character = this.LoadFromTemplate(character, template);

        return character;
    }

    LoadFromTemplate(character: Character, template: CharacterTemplate) {
        character.Id = template.Id;
        character.Name = template.Name;
        character.Description = template.Description;
        character.Idle = template.Idle;

        let inventoryModel = new ItemList();
        if (template.Inventory !== undefined) {
            template.Inventory.forEach((itemDefinition: any) => {
                inventoryModel.add(Game.SpawnItem(itemDefinition));
            });
        }
        character.Inventory = inventoryModel;

        let equipmentModel = new Equipment();
        if (template.Equipment !== undefined) {
            template.Equipment.forEach((eq) => {
                equipmentModel.equip(eq.Slot, Game.SpawnItem(eq.Item));
            });
        }
        character.Equipment = equipmentModel;
        return character;
    }

    LoadFromSave(saveCharacter: any) {
        let character = new Character();
        Object.assign(character, saveCharacter);

        let inventoryModel = new ItemList();
        if (saveCharacter.Inventory !== undefined) {
            saveCharacter.Inventory.forEach((savedItem: any) => {
                inventoryModel.add(Game.LoadItemFromSave(savedItem));
            });
        }
        character.Inventory = inventoryModel;

        let equipmentModel = new Equipment();
        if (saveCharacter.Equipment !== undefined) {
            saveCharacter.Equipment.forEach((eq: any) => {
                equipmentModel.equip(eq.Slot, Game.LoadItemFromSave(eq.Item));
            });
        }
        character.Equipment = equipmentModel;

        return character;
    }
}
