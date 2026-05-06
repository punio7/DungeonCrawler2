import { Game } from '../InitGameData';
import { Character } from '../model/Character';
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
        return character;
    }
}
