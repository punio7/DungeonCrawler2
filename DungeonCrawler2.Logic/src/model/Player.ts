import { Game } from '../InitGameData';
import { Character } from './Character';

export class Player extends Character {
    Location: number = 0;
    PreviousLocation: number = 0;

    constructor(template: any) {
        super();
    }

    getLocation(): number {
        return this.Location;
    }

    setLocation(value: number) {
        this.Location = value;
    }

    getPreviousLocation(): number {
        return this.PreviousLocation;
    }

    setPreviousLocation(value: number) {
        this.PreviousLocation = value;
    }

    canSee(): boolean {
        let room = Game.getRoom(this.Location);
        return room.hasLightSource();
    }
}
