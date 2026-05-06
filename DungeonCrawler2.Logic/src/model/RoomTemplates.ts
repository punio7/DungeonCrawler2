import { RoomTemplate } from '../templates/RoomTemplate';

export class RoomTemplates {
    [templateId: number]: RoomTemplate;
    Templates: RoomTemplate[] = [];

    constructor(roomTemplates?: any) {
        if (roomTemplates === undefined) {
            return;
        }

        if (!Array.isArray(roomTemplates)) {
            throw 'Room templates must be an array';
        }

        roomTemplates.forEach((value, index) => {
            this.addNewRoomTemplate(value);
        });
    }

    addNewRoomTemplate(roomTemplate: any) {
        if (this[roomTemplate.Id] !== undefined) {
            throw 'Room template {0} is already defined!'.format(roomTemplate.Id);
        }
        this[roomTemplate.Id] = roomTemplate;
        this.Templates[roomTemplate.Id] = roomTemplate;
    }

    getTemplate(roomId: number): RoomTemplate {
        if (this[roomId] === undefined) {
            throw 'No Room template defined for Id {0}!'.format(roomId);
        }
        return this[roomId];
    }
}
