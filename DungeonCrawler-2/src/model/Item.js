"use strict";
class Item {
    constructor(template) {
        
        Object.assign(this, template);

        this.Type = Game.getItemType(this.Type);
    }

    getName(grammaCase) {
        if (grammaCase === undefined) {
            return this.Name[0];
        }
        else {
            return this.Name[grammaCase];
        }
    }
}