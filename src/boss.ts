import { Sprite } from "./sprite.js"
import { Block } from './block';

interface BossDrawInterface {
    ctx: CanvasRenderingContext2D, 
    block: Block,
    life?: number
}

interface BossComputedLifeInterface {
    baseBugLife: number, 
    incrementBugLife: number
}

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
    private img?: HTMLImageElement
    private spriteIndex: number = 0
    private spriteEslapsed: number = 0
    private spriteHold: number = 10
    

    constructor({id, name, life, sprites}: BossInterface) {
        this.id = id
        this.name = name
        this.life = life
        this.sprites = sprites
    }

    static fromJson(data: BossInterface) : Boss {
        const obj = new Boss(data)
        obj.sprites = []
        data.sprites.forEach(e => {
            const sprite = Sprite.fromJson(e)
            obj.sprites.push(sprite)
        })

        return obj
    }

    getLife = () => this.life
    setLife = (life: number) => this.life = life

    setComputedLife({baseBugLife, incrementBugLife}: BossComputedLifeInterface) : void {
        this.life = (baseBugLife + (baseBugLife*(incrementBugLife/100)))
        this.life *= 10
    }

    incrementSpriteIndex = () => {
        const filter = Sprite.types.NORMAL
        const sprites = this.sprites.filter(e => e.getType() == filter)
        if (this.spriteEslapsed>=this.spriteHold) {
            this.spriteEslapsed=0
            if (this.spriteIndex>=(sprites.length-1)) {
                this.spriteIndex = 0; 
            }else {
                this.spriteIndex++
            }
        }else{
            this.spriteEslapsed++
        }
    }

    getSprite = () => {
        const filter = Sprite.types.NORMAL
        const sprites = this.sprites.filter(e => e.getType() == filter)
        return sprites[this.spriteIndex]
    }

    redraw({ctx, block}: BossDrawInterface) {
        const sprite = this.getSprite()
        const width = (block.getWidth()*2)-10
        const height = (block.getHeight()*2)-10
        
        ctx.beginPath()
        ctx.fillStyle = '#ffffff2b'
        ctx.fillRect(block.getX()+5, block.getY()+5, width, height)
        
        ctx.drawImage(
            this.img!, sprite.getCropX(), sprite.getCropY(),
            sprite.getWidth(), sprite.getHeight(),
            block.x+5, block.y+5, width, height
        )
        ctx.closePath()

        this.incrementSpriteIndex()

        // if (this.life != null) this.life.draw({ctx: ctx, block: block});
    }

    draw = ({ctx, block, life}: BossDrawInterface) => {
        const sprite = this.getSprite();

        this.img = new Image()
        this.img!.onload = () => this.redraw({ctx, block})
        this.img!.src = sprite.getImg()
        this.setLife(life!)

        // block.setBug(this)
    }
}