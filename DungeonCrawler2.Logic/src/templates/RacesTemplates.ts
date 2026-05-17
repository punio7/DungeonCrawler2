import { RaceName } from '../enums/RaceName';
import { IStats } from '../model/CharacterStats';

export interface RaceTemplate {
    Id: string;
    Name: string[];
    Stats: IStats;
}

class RacesList {
    [templateId: string]: RaceTemplate;
}

export class RacesTemplates {
    list: RacesList = new RacesList();

    constructor(races: RaceTemplate[] | undefined) {
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

    addNewRaceTemplate(raceTemplate: RaceTemplate) {
        if (this.list[raceTemplate.Id] !== undefined) {
            throw 'Race template {0} is already defined!'.format(raceTemplate.Id);
        }
        this.list[raceTemplate.Id] = raceTemplate;
    }

    getTemplate(raceId: RaceName): RaceTemplate {
        if (this.list[raceId] === undefined) {
            throw 'No race template defined for {0}!'.format(raceId);
        }
        return this.list[raceId];
    }
}
