import { Direction } from '../enums/Direction';
import { CharacterTemplate } from './CharacterTemplate';
import { ItemListTemplateElement } from './Common';

export interface RoomTemplate {
    Id: number;
    Name?: string;
    Description?: string;
    IsNaturalLight?: boolean;
    Exits?: ExitTemplate[];
    Items?: ItemListTemplateElement[];
    Characters?: string[];
    OnFirstEnterEvent?: string;
    OnEnterEvent?: string;
}

interface ExitTemplate {
    Direction: Direction;
    RoomId: number;
    isHidden?: boolean;
    Door?: DoorTemplate;
}

interface DoorTemplate {
    IsLocked?: boolean;
    IsClosed?: boolean;
    KeyId?: string;
}
