import { ClassId } from '../enums/ClassName';
import { StatsTemplate } from './Common';

export interface ClassTemplate {
    Id: string;
    Name: string[];
    Stats: StatsTemplate;
}

class ClassesList {
    [templateId: string]: ClassTemplate;
}

export class ClassesData {
    list: ClassesList = new ClassesList();

    constructor(classes: ClassTemplate[] | undefined) {
        if (classes === undefined) {
            return;
        }

        if (!Array.isArray(classes)) {
            throw 'Class templates must be an array';
        }

        classes.forEach((value) => {
            this.addNewClassTemplate(value);
        });
    }

    addNewClassTemplate(classTemplate: ClassTemplate) {
        if (this.list[classTemplate.Id] !== undefined) {
            throw 'Class template {0} is already defined!'.format(classTemplate.Id);
        }
        this.list[classTemplate.Id] = classTemplate;
    }

    getTemplate(classId: ClassId): ClassTemplate {
        if (this.list[classId] === undefined) {
            throw 'No class template defined for {0}!'.format(classId);
        }
        return this.list[classId];
    }
}
