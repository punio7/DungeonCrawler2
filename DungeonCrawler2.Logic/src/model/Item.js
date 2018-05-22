"use strict";
class Item {
    constructor(template) {

        Object.assign(this, template);

        this.Type = Game.getItemType(this.Type);
    }

    getName(grammaCase = GrammaCase.Mianownik) {
        return this.Name[grammaCase];
    }

    getDescription() {
        return this.Description;
    }

    isLightSource() {
        return this.IsLightSource === true;
    }
}