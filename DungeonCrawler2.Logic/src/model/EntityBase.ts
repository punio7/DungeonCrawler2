export abstract class EntityBase {
    Id: string;
    abstract getName(): string;
    abstract getIdle(): string;
}
