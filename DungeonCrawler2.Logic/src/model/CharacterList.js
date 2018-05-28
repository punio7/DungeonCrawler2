"use strict";
class CharacterList extends EntityList {
    constructor() {
        super();
    }

    add(character) {
        if (!character instanceof Character) {
            throw new "Only Characters can be added to character list";
        }
        super.add(character);
    }

    hasLightSource() {
        return this.Array.some(c => c.hasLightSource() === true);
    }
}