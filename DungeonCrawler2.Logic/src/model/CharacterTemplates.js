"user strict";
class CharacterTemplatesModel {
    constructor(characterTemplates) {
        if (characterTemplates === undefined) {
            return;
        }

        if (!Array.isArray(characterTemplates)) {
            throw "Character templates must be an array";
        }

        characterTemplates.forEach((value, index) => {
            this.addNewCharacterTemplate(value);
        });
    };

    addNewCharacterTemplate(characterTemplate) {
        if (this[characterTemplate.Id] !== undefined) {
            throw "Character template {0} is already defined!".format(characterTemplate.Id);
        }
        this[characterTemplate.Id] = characterTemplate;
    };

    getTemplate(characterId) {
        if (this[characterId] === undefined) {
            throw "No Character template defined for Id {0}!".format(itemTemplate.Id);
        }
        return this[characterId];
    }
}