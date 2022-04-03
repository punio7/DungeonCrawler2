import { Game } from '../InitGameData';
import { GameData } from '../model/GameData';
import { Item } from '../model/Item';
import { ItemList } from '../model/ItemList';
import { ItemChanceOneOfTemplate, ItemChanceTemplate, ItemListTemplateElement, Stack } from '../templates/Common';
import { ItemTemplate } from '../templates/ItemTemplate';
import { Random } from './Random';

export class ItemFactory {
    spawnItem(itemDefinition: ItemListTemplateElement): Item | null {
        let item = null;

        if (typeof itemDefinition === 'string') {
            return this.spawnItemByTemplateId(itemDefinition);
        } else {
            if (this.isItemChanceTemplate(itemDefinition)) {
                if (itemDefinition.Chance !== undefined) {
                    if (Random.nextInt(1, 100) > itemDefinition.Chance) {
                        return null;
                    }
                }
                let templateId = itemDefinition.ItemId;
                item = this.spawnItemByTemplateId(templateId);
                if (itemDefinition.Stack !== undefined) {
                    item.setStack(this.stackValue(itemDefinition.Stack));
                }
                this.resolveInventory(itemDefinition, item);
            } else {
                let selectetItemIndex = this.resolveRandomItemIndex(itemDefinition);
                let templateId = itemDefinition.ItemId[selectetItemIndex];
                if (templateId === null) {
                    return null;
                }
                item = this.spawnItemByTemplateId(templateId);
                if (itemDefinition.Stack !== undefined) {
                    if (itemDefinition.ItemId.length !== itemDefinition.Stack.length) {
                        throw 'Item definition has {0} specified ids but only {1} spiecified stacks'.format(
                            itemDefinition.ItemId.length,
                            itemDefinition.Stack.length,
                        );
                    }
                    item.setStack(this.stackValue(itemDefinition.Stack[selectetItemIndex]));
                }
            }
            return item;
        }
    }

    isItemChanceTemplate(itemDefinition: ItemListTemplateElement): itemDefinition is ItemChanceTemplate {
        return typeof itemDefinition !== 'string' && typeof itemDefinition.ItemId === 'string';
    }

    spawnItemByTemplateId(templateId: string): Item {
        let template: ItemTemplate = GameData.ItemTemplates.getTemplate(templateId);
        let item = new Item();
        Object.assign(item, template);
        return item;
    }

    private resolveRandomItemIndex(itemDefinition: ItemChanceOneOfTemplate): number {
        if (itemDefinition.ChanceList === undefined) {
            itemDefinition.ChanceList = [];
            itemDefinition.ItemId.forEach(() => {
                itemDefinition.ChanceList?.push(1);
            });
        }
        if (itemDefinition.ItemId.length !== itemDefinition.ChanceList.length) {
            throw 'Item definition has {0} specified ids but only {1} spiecified chances in ChanceList'.format(
                itemDefinition.ItemId.length,
                itemDefinition.ChanceList.length,
            );
        }

        let chanceSum = itemDefinition.ChanceList.reduce((a: number, b: number) => a + b);
        let selectedCahnce = Random.nextInt(1, chanceSum);
        chanceSum = 0;
        for (var i = 0; i < itemDefinition.ChanceList.length; i++) {
            chanceSum += itemDefinition.ChanceList[i];
            if (selectedCahnce <= chanceSum) {
                return i;
            }
        }
        return 0; //should never occur
    }

    private resolveInventory(itemDefinition: ItemChanceTemplate, item: Item) {
        if (itemDefinition.Inventory !== undefined) {
            let inventory = item.getInventory();
            if (inventory === null) {
                inventory = item.Inventory = new ItemList();
            }
            itemDefinition.Inventory.forEach((itemDefinition: any) => {
                inventory?.add(Game.SpawnItem(itemDefinition));
            });
        }
    }

    private stackValue(stack: Stack): number {
        if (stack === undefined || stack === null) {
            return 1;
        }
        if (typeof stack === 'number') {
            return stack;
        } else {
            return Random.nextInt(stack.Min, stack.Max);
        }
    }

    LoadFromSave(saveItem: any): Item {
        let item = new Item();
        Object.assign(item, saveItem);
        if (item.getInventory() !== null) {
            let inventoryModel = new ItemList();
            inventoryModel.loadFromSave(item.getInventory());
            item.Inventory = inventoryModel;
        }
        return item;
    }
}
