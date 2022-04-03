export {};

declare global {
    interface String {
        format(...args: any[]): string;
        startWithUpper(): string;
        isNumber(): boolean;
        isNullOrEmpty(): boolean;
    }
}

String.prototype.format = function (...args: string[]): string {
    return this.replace(/{(\d+)}/g, function (match: string, number: number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};

String.prototype.startWithUpper = function () {
    return this[0].toUpperCase() + this.slice(1);
};

String.prototype.isNumber = function () {
    return /^\d+$/.test(this);
};

String.prototype.isNullOrEmpty = function () {
    return this === null || this === '';
};
