import { EquipmentSlot } from '../enums/EquipmentSlot';
import { RaceName } from '../enums/RaceName';
import { IStats } from '../model/CharacterStats';
import { ItemListTemplateElement } from './Common';

interface EquipmentTemplate {
    Slot: EquipmentSlot;
    Item: ItemListTemplateElement;
}

export interface CharacterTemplate {
    Id: string;
    Name: string[];
    Idle: string;
    Description: string;
    Level: number;
    Race: RaceName;
    Stats: IStats;
    Inventory?: ItemListTemplateElement[];
    Equipment?: EquipmentTemplate[];
}
