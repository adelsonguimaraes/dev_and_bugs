import { Sprite } from "./sprite"

interface BossInterface {
    id:number
    name:string
    life:number
    sprites:Array<Sprite>
}

export class Boss {
    private id:number
    private name:string
    private life:number
    private sprites:Array<Sprite>

    constructor({id, name, life, sprites}: BossInterface) {
        this.id = id
        this.name = name
        this.life = life
        this.sprites = sprites
    }

    static fromJson(data: BossInterface) : Boss {
        const obj = new Boss(data)
        data.sprites.forEach(e => {
            const sprite = Sprite.fromJson(e)
            obj.sprites.push(sprite)
        })
        return this
    }

    getLife = () => this.life
    setLife = ({life}) => this.life = life
}