"use strict";
class ItemList extends EntityList {
    constructor() {
        super();
    }

    LoadFromTemplate(template) {
        if (template !== undefined) {
            template.forEach(itemDefinition => {
                this.add(Game.SpawnItem(itemDefinition));
            });
        }
    }

    LoadFromSave(saveItemList) {
        Object.assign(this, saveItemList);
        for (var i = 0; i < this.Array.length; i++) {
            this.Array[i] = Game.LoadItemFromSave(this.Array[i]);
        }
    }

    add(item) {
        if (item === null) {
            return;
        }
        if (!item instanceof Item) {
            throw new "Only Items can be added to item list";
        }
        super.add(item);
    }

    hasLightSource() {
        return this.Array.some(i => i.isLightSource() === true);
    }
}