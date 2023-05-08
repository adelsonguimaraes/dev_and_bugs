export class Dungeon {
    private id:number
    private name:string
    private level:number
    private boss:Boss
    private multiplier:number
    private color:string
    private inside:boolean

    constructor(id:number, name:string, level:number, boss:Boss, multiplier:number, color:string) {
        this.id = id
        this.name = name
        this.level = level
        this.boss = boss
        this.multiplier = multiplier
        this.color = color
        this.inside = false
    }

    getName = ():string => this.name
    getLevel =():number => this.level
    getBoss = ():Boss => this.boss
    getColor = ():string => this.color
    getComputedBossLife = ():number => this.boss.getLife() * this.multiplier
    toEnter = ():boolean => this.inside = true
    toGoOut = ():boolean => this.inside = false
}