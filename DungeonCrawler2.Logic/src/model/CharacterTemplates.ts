export class CharacterTemplatesModel {
    [templateId: string]: any;
    constructor(characterTemplates: any | undefined) {
        if (characterTemplates === undefined) {
            return;
        }

        if (!Array.isArray(characterTemplates)) {
            throw 'Character templates must be an array';
        }

        characterTemplates.forEach((value, index) => {
            this.addNewCharacterTemplate(value);
        });
    }

    addNewCharacterTemplate(characterTemplate: any) {
        if (this[characterTemplate.Id] !== undefined) {
            throw 'Character template {0} is already defined!'.format(characterTemplate.Id);
        }
        this[characterTemplate.Id] = characterTemplate;
    }

    getTemplate(characterId: string) {
        if (this[characterId] === undefined) {
            throw 'No Character template defined for Id {0}!'.format(characterId);
        }
        return this[characterId];
    }
}
