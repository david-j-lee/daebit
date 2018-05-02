interface Array<T> {
    Sum(prop: any): number;
}

Array.prototype.Sum = function(prop: any): number {
    let total = 0;
    for (let i = 0, len = this.length; i < len; i++) {
        total += this[i][prop];
    }
    return total;
};
