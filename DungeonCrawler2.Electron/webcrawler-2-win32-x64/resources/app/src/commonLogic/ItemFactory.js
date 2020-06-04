"use strict";
class ItemFactory {
    spawnItem(itemDefinition) {
        if (typeof itemDefinition === "string") {
            let template = Game.ItemTemplates.getTemplate(itemDefinition);
            return new Item(template);
        }
        else {
            if (itemDefinition.Chance !== undefined) {
                if (Random.nextInt(1, 100) > itemDefinition.Chance) {
                    return null;
                }
            }

            let templateId = null;
            if (typeof itemDefinition.ItemId === "string") {
                templateId = itemDefinition.ItemId;
            }
            else {
                templateId = this.resolveRandomTemplateId(itemDefinition);
                if (templateId === null) {
                    return null;
                }
            }

            let template = Game.ItemTemplates.getTemplate(templateId);
            let item = new Item(template);
            item.setStack(this.stackValue(itemDefinition, templateId));
            this.resolveInventory(itemDefinition, item);
            return item;
        }

    }

    resolveRandomTemplateId(itemDefinition) {
        if (itemDefinition.ChanceList === undefined) {
            itemDefinition.ChanceList = [];
            itemDefinition.ItemId.forEach(() => {
                itemDefinition.ChanceList.push(1);
            })
        }
        if (itemDefinition.ItemId.length !== itemDefinition.ChanceList.length) {
            throw "Item definition has {0} specified ids but only {1} spiecified chances in ChanceList"
                .format(itemDefinition.ItemId.length, itemDefinition.ChanceList.length);
        }

        let chanceSum = itemDefinition.ChanceList.reduce((a, b) => a + b);
        let selectedCahnce = Random.nextInt(1, chanceSum);
        chanceSum = 0;
        for (var i = 0; i < itemDefinition.ChanceList.length; i++) {
            chanceSum += itemDefinition.ChanceList[i];
            if (selectedCahnce <= chanceSum) {
                return itemDefinition.ItemId[i];
            }
        }

        return null;
    }

    resolveInventory(itemDefinition, item) {
        if (itemDefinition.Inventory !== undefined) {
            let inventory = item.getInventory();
            if (inventory === null) {
                inventory = item.Inventory = new ItemList();
            }
            itemDefinition.Inventory.forEach(itemDefinition => {
                inventory.add(Game.spawnItem(itemDefinition));
            });
        }
    }

    stackValue(itemDefinition, selectedItemId) {
        let stack = itemDefinition.Stack;
        if (Array.isArray(stack)) {
            //w przypadku gdy spawnujemy item jeden z listy dostępnych
            let stackIndex = itemDefinition.ItemId.indexOf(selectedItemId);
            stack = stack[stackIndex];
        }

        if (stack === undefined || stack === null) {
            return 1;
        }
        if (typeof stack === "number") {
            return stack;
        }
        else {
            return Random.nextInt(stack.Min, stack.Max);
        }
    }
}