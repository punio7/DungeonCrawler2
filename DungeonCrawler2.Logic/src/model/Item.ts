import { GrammaCase } from '../enums/GrammaCase';
import { ItemType, ItemTypeHelper } from '../enums/ItemType';
import { EntityBase } from './EntityBase';
import { ItemList } from './ItemList';
import { Local } from '../InitGameData';
import { ItemLock } from './ItemLock';
import { ItemTemplate } from '../templates/ItemTemplate';
import { GameData } from './GameData';

export class Item extends EntityBase {
    Stack?: number;
    Inventory?: ItemList;
    Lock?: ItemLock;

    constructor(template: ItemTemplate) {
        super();
        this.Id = template.Id;
        if (this.isContainer()) {
            this.Inventory = new ItemList();
        }
    }

    private getTemplate(): ItemTemplate {
        return GameData.ItemTemplates.getTemplate(this.Id);
    }

    getName(grammaCase = GrammaCase.Mianownik) {
        let name = this.getTemplate().Name;
        if (!this.isStackable()) {
            return name[grammaCase] + Engine.DefaultColor;
        } else {
            return this.getStack() + ' ' + this.getPluralName(grammaCase) + Engine.DefaultColor;
        }
    }

    getPluralName(grammaCase = GrammaCase.Mianownik) {
        let name = this.getTemplate().Name;
        if (!Array.isArray(name[0])) {
            return name[grammaCase];
        } else {
            switch (this.getStack()) {
                case 1:
                    return name[0][grammaCase];
                case 2:
                case 3:
                case 4:
                    return name[1][grammaCase];
                default:
                    return name[2][grammaCase];
            }
        }
    }

    getDescription() {
        return this.getTemplate().Description + Engine.DefaultColor;
    }

    getIdle() {
        if (this.getTemplate().Idle === undefined) {
            return Local.Commands.Look.DefaultIdle;
        }
        return this.getTemplate().Idle!;
    }

    isLightSource() {
        return this.getTemplate().IsLightSource === true;
    }

    isStackable() {
        if (this.getTemplate().IsStackable === undefined) {
            return false;
        }
        return this.getTemplate().IsStackable;
    }

    getStack() {
        if (this.Stack === undefined) {
            return 1;
        }
        return this.Stack;
    }

    setStack(value: number) {
        if (this.isStackable()) {
            this.Stack = value;
        }
    }

    addStack(value: number) {
        if (this.isStackable()) {
            if (this.Stack === undefined) {
                this.Stack = 1;
            }
            this.Stack += value;
        }
    }

    getType() {
        return ItemTypeHelper.parse(this.getTemplate().Type);
    }

    isTakeable() {
        switch (this.getType()) {
            case ItemType.Static:
            case ItemType.StaticContainer:
            case ItemType.Lever:
                return false;
            default:
                return true;
        }
    }

    getInventory(): ItemList | null {
        if (this.Inventory === undefined) {
            return null;
        }
        return this.Inventory;
    }

    isContainer() {
        let type = this.getTemplate().Type;
        return type == ItemType.Container || type == ItemType.StaticContainer;
    }

    isLocked() {
        return this.Lock?.IsLocked === true;
    }

    setIsLocked(value: boolean) {
        if (this.Lock !== undefined) {
            this.Lock.IsLocked = value;
        }
    }
}
