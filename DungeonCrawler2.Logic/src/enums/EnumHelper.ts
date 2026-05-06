export abstract class EnumHelper<EnumType> {
    source: any;
    constructor(source: any) {
        this.source = source;
    }

    parse(value: string): EnumType | null {
        if (this.source.hasOwnProperty(value)) {
            return this.source[value] as EnumType;
        }
        return null;
    }

    parseArray(values: string[]) {
        let array: EnumType[] = [];
        values.forEach((key) => {
            let parsed: EnumType | null = this.parse(key);
            if (parsed !== null) {
                array.push(parsed);
            }
        });
        return array;
    }

    contains(string: string): boolean {
        if (this.source.hasOwnProperty(string)) {
            return true;
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
