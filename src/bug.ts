import { BugModels, BugModelsInterface } from './bug_models.js';
import { BugLife } from './bug_life.js';
import { Sprite } from './sprite.js';
import { Block } from './block.js';
import { LoadData } from './load_data.js';

interface BugDrawInterface {
    ctx: CanvasRenderingContext2D, block: Block, level: number
}

interface BugRedrawInterface {
    ctx: CanvasRenderingContext2D, block: Block
}

export class Bug{
    static models: Array<BugModels> = []
    private life: BugLife|null
    private width: number
    private height: number
    private img: HTMLImageElement|null
    private model?: BugModels|null = null
    private spriteIndex: number
    private spriteEslapsed: number
    private spriteHold: number
    private effectActive: boolean

    constructor(model: BugModels|null) {
        this.life = null
        this.width = 50
        this.height = 50
        this.img = null
        this.model = model
        this.spriteIndex = 0
        this.spriteEslapsed = 0
        this.spriteHold = 10
        this.effectActive = false
    }

    getLife = () : BugLife => this.life!

    setLife = (life: BugLife) : BugLife => this.life = life

    setModel = (model: BugModels) : BugModels => this.model = model

    getModel = () => this.model

    getSprite = () => {
        const filter = (this.effectActive) ? Sprite.types.EFFECT : Sprite.types.NORMAL
        const sprites = this.model!.listSprites().filter(e => e.getType() == filter)
        return sprites[this.spriteIndex]
    }

    isEffectActive = () : boolean => this.effectActive

    getEffect = () : string|null => {
        const effect = this.model!.getEffect()
        if (effect==null) return null
        return effect.getName()
    }

    effectActiveToogle = () => this.effectActive = !this.effectActive

    incrementSpriteIndex = () => {
        const filter = (this.effectActive) ? Sprite.types.EFFECT : Sprite.types.NORMAL
        const sprites = this.model!.listSprites().filter(e => e.getType() == filter)
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

    redraw({ctx, block}: BugRedrawInterface) {
        const sprite = this.getSprite()
        
        ctx.beginPath()
        ctx.fillStyle = '#ffffff2b'
        ctx.fillRect(block.getX()+5, block.getY()+5, block.getWidth()-10, block.getHeight()-10)
        
        ctx.drawImage(
            this.img!, sprite.getCropX(), sprite.getCropY(),
            sprite.getWidth(), sprite.getHeight(),
            block.x+5, block.y+5, this.width, this.height
        )
        ctx.closePath()

        this.incrementSpriteIndex()

        if (this.life != null) this.life.draw({ctx: ctx, block: block});
    }

    draw({ctx, block, level}: BugDrawInterface) : void {
        if (this.model==null) this.raffleModel(level)
        
        const sprite = this.getSprite()

        this.img = new Image()
        this.img.onload = () => this.redraw({ctx, block})
        this.img.src = sprite.getImg()

        block.setBug(this)
    }

    raffleModel(level: number) : void {
        let rand = Math.floor(Math.random() * 100)
        
        const fitModels = Bug.models.filter(e => (e.getEmergenceLevel()<=level && e.getEmergenceLevel()!=null) 
            && (rand >= e.getRangeRaffle().getMin()! && rand <= e.getRangeRaffle().getMax()!))
        rand = Math.floor(Math.random() * fitModels.length)
        const model = fitModels[rand]

        this.setModel(model)
    }

    static createModels = async () => {
        const data:Array<BugModelsInterface> = await LoadData.get('./data/bug_models.json')
        data.forEach((e) => Bug.models.push(BugModels.fromJson(e)));
    }
}