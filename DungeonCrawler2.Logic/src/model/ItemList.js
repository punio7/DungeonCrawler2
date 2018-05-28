"use strict";
class ItemList extends EntityList {
    constructor() {
        super();
    }

    add(item) {
        if (!item instanceof Item) {
            throw new "Only Items can be added to item list";
        }
        super.add(item);
    }

    hasLightSource() {
        return this.Array.some(i => i.isLightSource() === true);
    }
}