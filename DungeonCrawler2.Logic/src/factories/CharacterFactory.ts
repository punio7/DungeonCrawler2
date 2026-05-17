import { Game } from '../InitGameData';
import { Character } from '../model/Character';
import { Stats } from '../model/CharacterStats';
import { Equipment } from '../model/Equipment';
import { GameData } from '../model/GameData';
import { ItemList } from '../model/ItemList';
import { CharacterTemplate } from '../templates/CharacterTemplate';

export class CharacterFactory {
    spawnCharacter(characterId: string) {
        let template = GameData.CharacterTemplates.getTemplate(characterId);
        let character = new Character();
        character = this.LoadFromTemplate(character, template);

        return character;
    }

    LoadFromTemplate(character: Character, template: CharacterTemplate) {
        character.Id = template.Id;
        character.Stats.Level = template.Level;
        character.Stats.statsBase = new Stats(template.Stats);

        if (template.Inventory !== undefined) {
            let inventoryModel = new ItemList();
            template.Inventory.forEach((itemDefinition: any) => {
                inventoryModel.add(Game.spawnItem(itemDefinition));
            });
            character.Inventory = inventoryModel;
        }

        if (template.Equipment !== undefined) {
            let equipmentModel = new Equipment();
            template.Equipment.forEach((eq) => {
                equipmentModel.equip(eq.Slot, Game.spawnItem(eq.Item));
            });
            character.Equipment = equipmentModel;
        }
        character.recalculate();
        character.Stats.currentHealth = character.Stats.attrTotal.Health;
        character.Stats.currentArmor = character.Stats.attrTotal.Armor;
        return character;
    }
}
