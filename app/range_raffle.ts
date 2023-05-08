export class RangeRaffle {
    private min:number
    private max:number

    constructor({min, max}) {
        this.min = min
        this.max = max
    }

    fromJson = (data:RangeRaffle) => {
        if (data==null) return data

        this.min = data.min
        this.max = data.max
        return this
    }

    getMin = () => this.min
    getMax = () => this.max
}