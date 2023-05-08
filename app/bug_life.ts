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

    setComputedLife(baseBugLife: number, incrementBugLife: number, level: number) : void {
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

    draw(ctx: CanvasRenderingContext2D, block: Block) : void {
        ctx.beginPath()
        ctx.fillStyle = '#3e0d0d'
        ctx.fillRect(block.x+5, (block.y+block.height), 50, this.height)
        ctx.fillStyle = this.color
        ctx.fillRect(block.x+5, (block.y+block.height), this.width, this.height)
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.closePath()
    }

    calcLife(damage: number, extraDamage: number, baseBugLife: number, bulletMode: BulletModes) : number {
        const damageMode = bulletMode.getDamage()
        const critical = Critical.tryCritical({extra_damage: extraDamage})
    
        const damageComputed = (((damage + extraDamage)*damageMode)/100 * baseBugLife) + critical

        const current_life = (this.width*2)/100*this.life
        const new_life = (current_life-damageComputed)
        const new_life_percent = ((new_life*100/this.life)/2)
        this.setWidth(new_life_percent)

        return new_life
    }
}