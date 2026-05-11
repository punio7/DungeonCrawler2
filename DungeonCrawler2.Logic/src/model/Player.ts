import { Game } from '../InitGameData';
import { Character } from './Character';

export class Player extends Character {
    Location: number = 0;
    PreviousLocation: number = 0;

    constructor() {
        super();
    }

    loadFromSave(savedPlayer: Player) {
        Object.assign(this, savedPlayer);
        super.loadFromSave(savedPlayer);
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
