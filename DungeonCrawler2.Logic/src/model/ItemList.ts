import { Game } from '../InitGameData';
import { EntityList } from './EntityList';
import { Item } from './Item';

export class ItemList extends EntityList<Item> {
    constructor() {
        super();
    }

    loadFromTemplate(template: any) {
        if (template !== undefined) {
            template.forEach((itemDefinition: any) => {
                this.add(Game.SpawnItem(itemDefinition));
            });
        }
    }

    loadFromSave(saveItemList: any) {
        Object.assign(this, saveItemList);
        for (var i = 0; i < this.Array.length; i++) {
            this.Array[i] = Game.LoadItemFromSave(this.Array[i]);
        }
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
