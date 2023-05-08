import { Canvas } from "./canvas"

export class Bullet {
    private x: number
    private y: number
    private size: number
    private colisions: number
    private directionX: number
    private directionY: number
    private velocityX: number
    private velocityY: number
    private initDelay: number
    private currentDelay: number
    private mode: BulletModes
    private modes: Array<BulletModes>
    private orX: number
    private orY: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = 10
        this.colisions = 0
        this.directionX = 1
        this.directionY = 1
        // this.velocityX = null
        // this.velocityY = null
        // this.initDelay = null
        this.currentDelay = 0
        // this.mode = null
        this.modes = []
        this.orX = 1
        this.orY = 1

        this.createModes()
        this.setMode(this.modes[0])
    }

    setCoords(x: number, y: number) : void {
        if (this.currentDelay>this.initDelay) {
            this.x = x ?? this.x
            this.y = y ?? this.y
        }else{
            this.currentDelay++
        }
    }

    getCoords() : object {
        return {
            x: this.x, 
            y: this.y,
            top: (this.y-this.size/2),
            left: (this.x-this.size/2),
            right: (this.x+this.size/2),
            bottom: (this.y+this.size/2),
            size: this.size,
            dx: this.directionX, 
            dy: this.directionY,
            vx: this.velocityX,
            vy: this.velocityY,
        }
    }

    incrementColisions(canvas: Canvas) : void {
        this.colisions++
        const mode = this.modes.filter((e: BulletModes) => e.getColisions() <= this.colisions).at(-1)
        
        if (mode!.getName() == 'Insane') {
            canvas.activeInsaneMode()
        }
        this.setMode(mode!)
    }

    getColisions = () : number => this.colisions
    
    setSize = (size: number) : number => this.size = size
    
    toogleDirectionX() : void {
        this.directionX*=-1
        this.toogleOrientationX()
    }

    toogleDirectionY() : void {
        this.directionY*=-1
        this.toogleOrientationY()
    }

    setVelocityXY(vx: number, vy: number) : void {
        this.velocityX = vx
        this.velocityY = vy
    }

    setInitDelay = (initDelay: number) : number => this.initDelay = initDelay
    
    getMode = () : BulletModes => this.mode
    
    setMode = (mode: BulletModes) : BulletModes => this.mode = mode
    
    getOrientationX = () : number => this.orX
    
    toogleOrientationX = () : number => this.orX*=-1 
    
    getOrientationY = () : number => this.orY
    
    toogleOrientationY = () : number => this.orY*=-1 
    
    draw(ctx: CanvasRenderingContext2D) : void {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.fillStyle = this.mode.getColor()
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
    }

    createModes() : void {
        this.modes = [
            new BulletModes({id: 1, name:'Normal', aceleration: 1.5, colisions: 0, color: '#7fff00', damage: 1, point: 1}),
            new BulletModes({id: 2, name:'Moderate', aceleration: 2, colisions: 15, color: '#ffa000', damage: 2, point: 2}),
            new BulletModes({id: 3, name:'High', aceleration: 2.5, colisions: 30, color: '#e22b2b', damage: 2.5, point: 3}),
            new BulletModes({id: 4, name:'Insane', aceleration: 3, colisions: 50, color: 'white', damage: 3, point: 5})
        ]
    }
}