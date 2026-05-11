import { Character } from './Character';
import { EntityList } from './EntityList';

export class CharacterList extends EntityList<Character> {
    constructor() {
        super();
    }

    loadFromSave(savedList: CharacterList) {
        this.Array = savedList.Array.map((item) => {
            let newChar = new Character();
            newChar.loadFromSave(item);
            return newChar;
        });
    }

    hasLightSource() {
        return this.Array.some((c) => c.hasLightSource() === true);
    }
}
