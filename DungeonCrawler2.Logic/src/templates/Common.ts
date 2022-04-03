type EntityNameForms = string[7];
type EntityNameWithPlurals = EntityNameForms[3];
export type EntityName = EntityNameForms | EntityNameWithPlurals;

type ItemId = string;
interface StackChance {
    Min: number;
    Max: number;
}
export type Stack = number | StackChance;
type ItemSpawnChance = number;

export interface ItemChanceTemplate {
    ItemId: ItemId;
    Chance?: ItemSpawnChance;
    Stack?: Stack;
    Inventory?: ItemListTemplateElement[];
}

export interface ItemChanceOneOfTemplate {
    ItemId: (ItemId | null)[];
    ChanceList?: number[];
    Stack?: Stack[];
}

export type ItemListTemplateElement = ItemId | ItemChanceTemplate | ItemChanceOneOfTemplate;
