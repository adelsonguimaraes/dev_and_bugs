import { BulletModes } from "./bullet_modes.js"
import { Canvas } from "./canvas.js"

interface moveDirectionsInterface {
    left: string,
    right:string
}

export class Player {
    movement:number
    movementColor:string
    size:number
    x:number|null
    y:number|null
    img:CanvasImageSource|null = null
    points:number
    damage:number
    extraDamage:number
    moveDirections:moveDirectionsInterface

    constructor() {
        this.movement = 50
        this.movementColor = '#10a580'
        this.size = 25
        this.x = null
        this.y = null
        // this.img = null
        this.points = 0
        this.damage = 40
        this.extraDamage = 0
        this.moveDirections = {left: 'left', right: 'right'}
    }

    setX = (x: number) => this.x = x
    getX = () => this.x
    setY = (y: number) => this.y = y
    getY = () => this.y
    setPoints = (points: number) => this.points = points
    getPoints = () => this.points
    incrementPoints = (bulletMode: BulletModes) => this.points+= bulletMode.getPoint()
    getCenter = () => ({x: this.x, y: this.y})
    getRight = () => (this.x!+this.size)
    getLeft = () => (this.x!-this.size)
    getTop = () => (this.y!+this.size)
    resetMoviment = () => this.movement=50

    moving(direction:string) {
        if (this.movement<=0) {
            return false
        }

        if (direction==this.moveDirections.right) {
            this.x!++
        }else {
            this.x!--
        }
        this.movement--
    }


    moveToRight(limit: number) : void {
        const keys = ['ArrowRight', 'd']
        document.body.addEventListener('keydown', (e) => {
            if (keys.indexOf(e.key)>=0) {
                if (this.getRight()>=limit) return false
                this.moving(this.moveDirections.right)
            }
        })

        document.body.addEventListener('keyup', (e) => {
            if (keys.indexOf(e.key)>=0) {
                console.log('parou de andar para a direita')
            }
        })
    }

    moveToLeft(limit: number) : void {
        const keys = ['ArrowLeft', 'a']
        document.body.addEventListener('keydown', (e) => {
            if (keys.indexOf(e.key)>=0) {
                if (this.getLeft()<=limit) return false
                this.moving(this.moveDirections.left)
            }
        })
        document.body.addEventListener('keyup', (e) => {
            if (keys.indexOf(e.key)<=0) {
                console.log('parou de andar para a direita')
            }
        })
    }

    drawMovementBar(ctx: CanvasRenderingContext2D) : void {
        ctx.beginPath()
        ctx.fillStyle = '#d9d9d9'
        ctx.fillRect(this.getLeft(), this.getTop()+2, this.size*2, 5)
        ctx.fillStyle = this.movementColor
        ctx.fillRect(this.getLeft(), this.getTop()+2, this.movement, 5)
        ctx.strokeStyle = 'black'
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
    }

    draw(canvas:Canvas) : void {
        this.setX(canvas.width/2)
        this.setY(canvas.height-40)

        this.img = new Image()
        this.img.onload = () => canvas.ctx.drawImage(this.img, (this.x!-this.size), (this.y!-this.size), 50, 50)
        this.img.src = "./img/nerd-cat.gif"
        canvas.ctx.closePath()

        this.moveToRight(canvas.width)
        this.moveToLeft(0)
    }

    redraw = (ctx: CanvasRenderingContext2D) : void => {
        ctx.drawImage(this.img!, (this.x!-this.size), (this.y!-this.size), 50, 50)
        this.drawMovementBar(ctx)
    }
    // setMovement = (movement) => this.movement = movement
    getDamage = () : number => this.damage
    setExtraDamage = (extraDamage: number) : number => this.extraDamage = extraDamage
    getExtraDamage = () : number => this.extraDamage

}