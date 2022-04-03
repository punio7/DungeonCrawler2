import { Character } from './Character';
import { EntityList } from './EntityList';

export class CharacterList extends EntityList<Character> {
    constructor() {
        super();
    }

    hasLightSource() {
        return this.Array.some((c) => c.hasLightSource() === true);
    }
}
