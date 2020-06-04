"use strict";
class EnumBase {
    parse(string) {
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                if (key === string) {
                    return this[key];
                }
            }
        }
        return null;
    }

    contains(string) {
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                if (key === string) {
                    return true;
                }
            }
        }
        return false;
    }

    parseShort(string) {
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                if (key.startsWith(string)) {
                    return this[key];
                }
            }
        }
        return null;
    }

    getKey(value) {
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                if (this[key] === value) {
                    return key;
                }
            }
        }
        return null;
    }

    /**
     * @param {(value: T, key: string) => void} callback
     */
    forEach(callback) {
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                callback(this[key], key);
            }
        }
    }
}