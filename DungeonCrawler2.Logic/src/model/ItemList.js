"use strict";
class ItemList extends EntityList {
    constructor() {
        super();
    }
    
    hasLightSource() {
        return this.Array.some(i => i.isLightSource() === true);
    }
}