"use strict";
class ItemList extends EntityList {
    constructor(template) {
        super();

        if (template !== undefined) {
            template.forEach(itemDefinition => {
                this.add(Game.spawnItem(itemDefinition));
            });
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