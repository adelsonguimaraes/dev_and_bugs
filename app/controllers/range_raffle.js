class RangeRaffle {
    constructor({ min, max }) {
        this.getMin = () => this.min;
        this.getMax = () => this.max;
        this.min = min !== null && min !== void 0 ? min : 0;
        this.max = max !== null && max !== void 0 ? max : 0;
    }
}
RangeRaffle.fromJson = (data) => {
    const obj = new RangeRaffle(data);
    if (data == null)
        return data;
    obj.min = data.min;
    obj.max = data.max;
    return obj;
};
export { RangeRaffle };
