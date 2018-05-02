interface String {
    ToUrlSafeString(): string;
}

String.prototype.ToUrlSafeString = function(): string {
    return this
        .replace(/[^a-zA-Z0-9_.]/g, '')
        .replace(' ', '-')
        .toLowerCase();
};
