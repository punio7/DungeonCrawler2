export abstract class EnumHelper<EnumType> {
    source: any;
    constructor(source: any) {
        this.source = source;
    }

    parse(value: string): EnumType | null {
        for (const key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                if (key === value) {
                    return this.source[key] as EnumType;
                }
            }
        }
        return null;
    }

    parseArray(values: string[]) {
        let array: EnumType[] = [];
        values.forEach((key) => {
            let direction: EnumType | null = this.parse(key);
            if (direction !== null) {
                array.push(direction);
            }
        });
        return array;
    }

    contains(string: string): boolean {
        for (const key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                if (key === string) {
                    return true;
                }
            }
        }
        return false;
    }

    parseShort(string: string): EnumType | null {
        for (const key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                if (key.startsWith(string)) {
                    return this.source[key] as EnumType;
                }
            }
        }
        return null;
    }

    getKey(value: string | number): string | null {
        for (const key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                if (this.source[key] === value) {
                    return key;
                }
            }
        }
        return null;
    }

    forEach(callback: { (value: EnumType, key: string): void }): void {
        for (const key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                callback(this.source[key], key);
            }
        }
    }
}
