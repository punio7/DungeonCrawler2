import { RoomTemplate } from './RoomTemplate';

export interface GameTemplate {
    Name: string;
    StartingRoom: number;
    Rooms: RoomTemplate[];
}
