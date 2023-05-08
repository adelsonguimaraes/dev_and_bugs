export class Critical {
    private static probability = 1
    private static multiplier = 3

    static tryCritical = (extra_damage:number) => {
        
        const rand = Math.floor(Math.random() * 100)
        const probablity = (this.probability + extra_damage)

        if (rand <= probablity) {
            return this.multiplier
        }
        return 0
    }
}