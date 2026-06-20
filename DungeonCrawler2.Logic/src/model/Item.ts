import { GramaCase } from '../enums/GramaCase';
import { ItemType, ItemTypeHelper } from '../enums/ItemType';
import { EntityBase } from './EntityBase';
import { ItemList } from './ItemList';
import { Local } from '../InitGameData';
import { ItemLock } from './ItemLock';
import { ItemTemplate } from '../data/ItemData';
import { Data } from '../data/Data';
import { Attributes, IAttributes, IStats, Stats } from './CharacterStats';
import { EquipmentSlotHelper } from '../enums/EquipmentSlot';

export class Item extends EntityBase {
    Stack?: number;
    Inventory?: ItemList;
    Lock?: ItemLock;

    constructor() {
        super();
    }

    private getTemplate(): ItemTemplate {
        return Data.ItemTemplates.getTemplate(this.Id);
    }

    getName(gramaCase = GramaCase.Mianownik) {
        let name = this.getTemplate().Name;
        if (!this.isStackable()) {
            return name[gramaCase] + Engine.DefaultColor;
        } else {
            return this.getStack() + ' ' + this.getPluralName(gramaCase) + Engine.DefaultColor;
        }
    }

    getPluralName(gramaCase = GramaCase.Mianownik) {
        let name = this.getTemplate().Name;
        if (!Array.isArray(name[0])) {
            return name[gramaCase];
        } else {
            switch (this.getStack()) {
                case 1:
                    return name[0][gramaCase];
                case 2:
                case 3:
                case 4:
                    return name[1][gramaCase];
                default:
                    return name[2][gramaCase];
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

    splitStack(count: number) {
        if (!this.isStackable() || count > this.getStack() || count <= 0) {
            return null;
        }
        this.addStack(-count);
        let newItem = new Item();
        newItem.loadFromSave(this);
        newItem.setStack(count);
        return newItem;
    }

    getType() {
        return ItemTypeHelper.parse(this.getTemplate().Type)!;
    }

    getEquipmentSlot() {
        let type = this.getType();
        let typeData = Data.ItemTypes.getItemType(type);
        let slot = EquipmentSlotHelper.parse(typeData.Slot);
        return slot;
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

    getStatsBonus(): IStats | null {
        if (this.getTemplate().BonusStats === undefined) {
            return null;
        }
        return new Stats(this.getTemplate().BonusStats!);
    }

    getAttributes(): IAttributes | null {
        if (this.getTemplate().Attributes === undefined) {
            return null;
        }
        return new Attributes(this.getTemplate().Attributes!);
    }

    getRequirements(): IStats | null {
        if (this.getTemplate().Requirements === undefined) {
            return null;
        }
        return new Stats(this.getTemplate().Requirements!);
    }

    getValue() {
        return this.getTemplate().Value ?? 0;
    }
}
