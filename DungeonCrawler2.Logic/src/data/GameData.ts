import { RoomData } from './RoomData';

export interface GameData {
    Name: string;
    StartingRoom: number;
    Rooms: RoomData[];
}
