class RangeRaffle {
    constructor({ min, max }) {
        this.getMin = () => this.min;
        this.getMax = () => this.max;
        this.min = min;
        this.max = max;
    }
}
RangeRaffle.fromJson = (data) => {
    // const obj = new RangeRaffle(data);
    // if (data==null) return data
    // this.min = data.min
    // this.max = data.max
    return data;
};
export { RangeRaffle };
