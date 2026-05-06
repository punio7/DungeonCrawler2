import { ItemTemplate } from '../templates/ItemTemplate';

class ItemTemplatesList {
    [templateId: string]: ItemTemplate;
}

export class ItemTemplates {
    list: ItemTemplatesList = new ItemTemplatesList();

    constructor(itemTemplates: ItemTemplate[] | undefined) {
        if (itemTemplates === undefined) {
            return;
        }

        if (!Array.isArray(itemTemplates)) {
            throw 'Item templates must be an array';
        }

        itemTemplates.forEach((value, index) => {
            this.addNewItemTemplate(value);
        });
    }

    addNewItemTemplate(itemTemplate: ItemTemplate) {
        if (this.list[itemTemplate.Id] !== undefined) {
            throw 'Item template {0} is already defined!'.format(itemTemplate.Id);
        }
        this.list[itemTemplate.Id] = itemTemplate;
    }

    getTemplate(itemId: string): ItemTemplate {
        if (this.list[itemId] === undefined) {
            throw 'No item template defined for {0}!'.format(itemId);
        }
        return this.list[itemId];
    }
}
