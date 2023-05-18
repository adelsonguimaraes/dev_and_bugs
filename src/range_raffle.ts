export interface RangeRaffleInterface {
    min?:number,
    max?:number
}

export class RangeRaffle {
    min?:number
    max?:number

    constructor({min, max}:RangeRaffleInterface) {
        this.min = min ?? 0
        this.max = max ?? 0
    }

    static fromJson = (data: RangeRaffleInterface) => {
        const obj = new RangeRaffle(data);
        if (data==null) return data

        obj.min = data.min!
        obj.max = data.max!
        return obj
    }

    getMin = () => this.min
    getMax = () => this.max
}