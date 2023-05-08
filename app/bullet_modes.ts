export class BulletModes {
    private id: number
    private name: string
    private aceleration: number
    private colisions: number
    private color: string
    private damage: number
    private point: number

    constructor(id: number, name: string, aceleration: number, colisions: number, color: string, damage: number, point: number) {
        this.id = id
        this.name = name
        this.aceleration = aceleration
        this.colisions = colisions
        this.color = color
        this.damage = damage
        this.point = point
    }

    getId = () : number => this.id
    getName = () : string => this.name

    getAceleration() : number {
        return this.aceleration
    }

    getColisions() : number {
        return this.colisions
    }

    getColor() : string {
        return this.color
    }

    getDamage = () : number => this.damage
    getPoint = () : number => this.point
}