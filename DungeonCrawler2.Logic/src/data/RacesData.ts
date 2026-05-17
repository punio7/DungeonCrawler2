import { RaceId } from '../enums/RaceId';
import { StatsTemplate } from './Common';

export interface RaceData {
    Id: string;
    Name: string[];
    Stats: StatsTemplate;
}

class RacesList {
    [templateId: string]: RaceData;
}

export class RacesData {
    list: RacesList = new RacesList();

    constructor(races: RaceData[] | undefined) {
        if (races === undefined) {
            return;
        }

        if (!Array.isArray(races)) {
            throw 'Item templates must be an array';
        }

        races.forEach((value, index) => {
            this.addNewRaceTemplate(value);
        });
    }

    addNewRaceTemplate(raceTemplate: RaceData) {
        if (this.list[raceTemplate.Id] !== undefined) {
            throw 'Race template {0} is already defined!'.format(raceTemplate.Id);
        }
        this.list[raceTemplate.Id] = raceTemplate;
    }

    getTemplate(raceId: RaceId): RaceData {
        if (this.list[raceId] === undefined) {
            throw 'No race template defined for {0}!'.format(raceId);
        }
        return this.list[raceId];
    }
}
