export class Boss {
    private id:number
    private name:string
    private life:number
    private sprites:Array<Sprite>

    constructor(id: number, name: string, life: number, sprites:Array<Sprite>) {
        this.id = id
        this.name = name
        this.life = life
        this.sprites = sprites
    }

    fromJson(data) : Boss {
        this.id = data.id
        this.name = data.name
        this.life = data.life
        data.sprites.forEach(e => {
            const sprite = new Sprite()
            sprite.fromJson(e)
            this.sprites.push(sprite)
        })
        return this
    }

    getLife = () => this.life
    setLife = ({life}) => this.life = life
}