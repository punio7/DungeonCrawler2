"user strict";
class ItemTemplatesModel {
    constructor(itemTemplates) {
        if (itemTemplates === undefined) {
            return;
        }

        if (!Array.isArray(itemTemplates)) {
            throw "Item templates must be an array";
        }

        itemTemplates.forEach((value, index) => {
            this.AddNewItemTemplate(value);
        });
    };

    AddNewItemTemplate(itemTemplate) {
        if (this[itemTemplate.Id] !== undefined) {
            throw "Item template {0} is already defined!".format(itemTemplate.Id);
        }
        this[itemTemplate.Id] = itemTemplate;
    };

    getTemplate(itemId) {
        if (this[itemId] === undefined) {
            throw "No item template defined for {0}!".format(itemId);
        }
        return this[itemId];
    }
}