import { EquipmentSlot } from '../enums/EquipmentSlot';
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
    Inventory?: ItemListTemplateElement[];
    Equipment?: EquipmentTemplate[];
}
