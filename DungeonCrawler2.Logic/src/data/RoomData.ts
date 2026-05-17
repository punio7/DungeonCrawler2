import { Direction } from '../enums/Direction';
import { ItemListTemplateElement } from './Common';

export interface RoomData {
    Id: number;
    Name?: string;
    Description?: string;
    IsNaturalLight?: boolean;
    Exits?: ExitData[];
    Items?: ItemListTemplateElement[];
    Characters?: string[];
    OnFirstEnterEvent?: string;
    OnEnterEvent?: string;
}

export interface ExitData {
    Direction: Direction;
    RoomId: number;
    isHidden?: boolean;
    Door?: DoorData;
}

interface DoorData {
    IsLocked?: boolean;
    IsClosed?: boolean;
    KeyId?: string;
}
