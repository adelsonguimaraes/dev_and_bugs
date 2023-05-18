import { Block } from "./block.js"
import { Critical } from './critical.js';
import { BulletModes } from './bullet_modes.js';

interface BugLifeDrawInterface {
    ctx: CanvasRenderingContext2D, block: Block
}

interface BugLifeCalcLifeInterface {
    damage: number, extraDamage: number, 
    baseBugLife: number, bulletMode: BulletModes
}

interface BugComputedLifeInterface {
    baseBugLife: number, incrementBugLife: number, level: number
}

export class BugLife{
    private life: number
    private width: number
    private height: number
    private color: string
    
    constructor() {
        this.life = 1000
        this.width = 50
        this.height = 5
        this.color = 'red'
    }

    setComputedLife({baseBugLife, incrementBugLife, level}: BugComputedLifeInterface) : void {
        this.life = (level<=1) 
            ? baseBugLife 
            : (baseBugLife + (baseBugLife*(incrementBugLife/100)))
    }

    setWidth(width: number) : void {
        this.width = width
    }

    getWidth() : number {
        return this.width
    }

    setColor(color: string) : void {
        this.color = color
    }

    getColor() : string {
        return this.color
    }

    draw({ctx, block}: BugLifeDrawInterface) : void {
        ctx.beginPath()
        ctx.fillStyle = '#3e0d0d'
        ctx.fillRect(block.x+5, (block.y+block.height), 50, this.height)
        ctx.fillStyle = this.color
        ctx.fillRect(block.x+5, (block.y+block.height), this.width, this.height)
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.closePath()
    }

    calcLife({damage, extraDamage, baseBugLife, bulletMode}: BugLifeCalcLifeInterface) : number {
        const damageMode = bulletMode.getDamage()
        const critical = Critical.tryCritical(extraDamage)
    
        const damageComputed = (((damage + extraDamage)*damageMode)/100 * baseBugLife) + critical

        const current_life = (this.width*2)/100*this.life
        const new_life = (current_life-damageComputed)
        const new_life_percent = ((new_life*100/this.life)/2)
        this.setWidth(new_life_percent)

        return new_life
    }
}