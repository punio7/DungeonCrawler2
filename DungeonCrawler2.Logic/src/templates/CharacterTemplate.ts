import { ClassId } from '../enums/ClassName';
import { EquipmentSlot } from '../enums/EquipmentSlot';
import { RaceId } from '../enums/RaceId';
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
    Race: RaceId;
    Class: ClassId;
    Stats: IStats;
    Inventory?: ItemListTemplateElement[];
    Equipment?: EquipmentTemplate[];
}
