import { EntityName } from './Common';

export interface ItemTemplate {
    Id: string;
    Name: EntityName;
    Idle?: string;
    Description: string;
    Type: string;
    IsLightSource?: boolean;
    IsStackable?: boolean;
}
