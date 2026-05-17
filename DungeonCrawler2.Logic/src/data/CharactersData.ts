import { ClassId } from '../enums/ClassName';
import { EquipmentSlot } from '../enums/EquipmentSlot';
import { RaceId } from '../enums/RaceId';
import { IStats } from '../model/CharacterStats';
import { ItemListTemplateElement } from './Common';

interface EquipmentData {
    Slot: EquipmentSlot;
    Item: ItemListTemplateElement;
}

export interface CharacterData {
    Id: string;
    Name: string[];
    Idle: string;
    Description: string;
    Level: number;
    Race: RaceId;
    Class: ClassId;
    Stats: IStats;
    Inventory?: ItemListTemplateElement[];
    Equipment?: EquipmentData[];
}

class CharactersList {
    [templateId: string]: CharacterData;
}

export class CharactersData {
    list = new CharactersList();
    constructor(characterTemplates?: any) {
        if (characterTemplates === undefined) {
            return;
        }

        if (!Array.isArray(characterTemplates)) {
            throw 'Character templates must be an array';
        }

        characterTemplates.forEach((value, index) => {
            this.addNewCharacterTemplate(value);
        });
    }

    addNewCharacterTemplate(characterTemplate: any) {
        if (this.list[characterTemplate.Id] !== undefined) {
            throw 'Character template {0} is already defined!'.format(characterTemplate.Id);
        }
        this.list[characterTemplate.Id] = characterTemplate;
    }

    getTemplate(characterId: string) {
        if (this.list[characterId] === undefined) {
            throw 'No Character template defined for Id {0}!'.format(characterId);
        }
        return this.list[characterId];
    }
}
