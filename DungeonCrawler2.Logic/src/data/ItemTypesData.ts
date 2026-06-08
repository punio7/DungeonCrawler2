class ItemTypesList {
    [itemTypeId: string]: ItemTypeData;
}

export interface ItemTypeData {
    Id: string;
    Name: string[];
    Slot?: string;
    PlayerAllowed?: boolean;
}

export class ItemTypesData {
    list = new ItemTypesList();
    constructor(itemTypesTemplate: ItemTypeData[] | undefined) {
        if (itemTypesTemplate === undefined) {
            return;
        }

        if (!Array.isArray(itemTypesTemplate)) {
            throw 'Item types template must be an array';
        }

        itemTypesTemplate.forEach((value, index) => {
            this.addNewItemType(value);
        });
    }

    addNewItemType(itemType: ItemTypeData) {
        if (this.list[itemType.Id] !== undefined) {
            throw 'Item type {0} is already defined!'.format(itemType.Id);
        }
        this.list[itemType.Id] = itemType;
    }

    getItemType(itemTypeName: string) {
        if (this.list[itemTypeName] === undefined) {
            throw 'Item type ' + itemTypeName + ' is not defined!';
        }
        return this.list[itemTypeName];
    }
}
