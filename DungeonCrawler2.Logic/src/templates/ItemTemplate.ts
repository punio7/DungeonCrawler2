import { ItemType } from '../enums/ItemType';
import { EntityName } from './Common';

export interface ItemTemplate {
    Id: string;
    Name: EntityName;
    Idle?: string;
    Description: string;
    Type: ItemType;
    IsLightSource?: boolean;
    IsStackable?: boolean;
}
