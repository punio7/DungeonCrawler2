import { Game } from '../InitGameData';
import { Character } from './Character';

export class Player extends Character {
    Location: number;
    PreviousLocation: number;

    constructor(template: any) {
        super();

        if (this.Location === undefined) {
            this.Location = 0;
        }
        if (this.PreviousLocation === undefined) {
            this.PreviousLocation = 0;
        }
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
        let room = Game.GetRoom(this.Location);
        return room.hasLightSource();
    }
}
