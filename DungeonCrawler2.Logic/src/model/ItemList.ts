import { Game } from '../InitGameData';
import { EntityList } from './EntityList';
import { Item } from './Item';

export class ItemList extends EntityList<Item> {
    constructor() {
        super();
    }

    loadFromSave(savedList: ItemList) {
        this.Array = savedList.Array.map((item) => {
            let newItem = new Item();
            newItem.loadFromSave(item);
            return newItem;
        });
    }

    add(item: Item | null): void {
        if (item === null) {
            return;
        }
        if (item.isStackable()) {
            let existingStack = Game.Player.getInventory().findById(item.Id);
            if (existingStack !== null) {
                existingStack.addStack(item.getStack());
                return;
            }
        }
        super.add(item);
    }

    hasLightSource() {
        return this.Array.some((i) => i.isLightSource() === true);
    }
}
