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

    getIdle() {
        if (this.Idle === undefined) {
            return "leży tutaj";
        }
        return this.Idle;
    }

    isLightSource() {
        return this.IsLightSource === true;
    }

    isTakeable() {
        //TODO: przedmioty nie do wzięcia
        return true;
    }
}