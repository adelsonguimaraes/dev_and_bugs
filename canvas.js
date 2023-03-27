class Block {
    constructor({x , y, bg, width, height, bug=null}) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.bg = bg
        this.bug = bug
    }

    getX = () => this.x
    getY = () => this.y
    getWidth = () => this.width
    getHeight = () => this.height

    draw(ctx) {
        ctx.fillStyle = this.bg
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    setBug(bug) {
        this.bug = bug
    }

    getBug() {
        return this.bug
    }

    removeBug() {
        this.setBug(null)
    }
}

class CanvasArena{
    constructor(size) {
        this.canvas = null
        this.ctx = null
        this.rows = 8
        this.colums = 6
        this.gridBlockSize = size
        this.canvasWith = 360
        this.canvasHeight = 560
        this.gridBg1 = '#40404081'
        this.gridBg2 = '#34343481'
    }

    getCenter() {
        return {x: this.canvasWith/2, y: this.canvasHeight/2}
    }

    getCanvas() {
        this.canvas = document.querySelector('canvas#arena')
        this.ctx = this.canvas.getContext('2d')
    }

    setCanvasConfig() {
        this.ctx.fillStyle = '#1f1f1f'
        this.canvas.width = this.canvasWith
        this.canvas.height = this.canvasHeight
        this.ctx.fillRect(0, 0, this.canvasWith, this.canvasHeigth)
    }

    createGrid({width=0, height=0, blocks=[]}) {
        let x = 0
        let y = 0
        let current_line = 0
        let bg = this.gridBg1
        for(let i=0; i<(this.rows*this.colums); i++) {
            const diff = parseInt(i/this.colums)
            if (current_line < diff) {
                current_line = diff
                y+=this.gridBlockSize
                bg = (bg == this.gridBg1) ? this.gridBg2 : this.gridBg1
                x=0
            }
            const block = new Block({x: x, y: y, bg: bg, width: width, height: height})
            block.draw(this.ctx)
            
            bg = (bg == this.gridBg1) ? this.gridBg2 : this.gridBg1
            x+=this.gridBlockSize

            blocks.push(block)
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvasWith, this.canvasHeight)
    }

    clearDeadZone() {
        this.ctx.clearRect(0, this.canvasHeight - 80, this.canvasWith, 80)
    }
}

class Shop {
    static #bullet
    static #extra_damage
    static #ininital_value = 2
    static divBulletValue = document.querySelector('div.menu .item-bullet .value')
    static divDamageValue = document.querySelector('div.menu .item-damage .value')

    static reset() {
        this.#bullet = this.#ininital_value
        this.#extra_damage = this.#ininital_value
    }

    static getBullet = () => this.#bullet
    static getExtraDamage = () => this.#extra_damage

    static setBulletPrice = ({totalBullets}) => {
        this.#bullet*= (totalBullets)
    }

    static setExtraDamagePrice = ({totalExtraDamage}) => {
        this.#extra_damage*= (totalExtraDamage)
    }


    static displayValues = () => {
        this.divBulletValue.innerHTML = this.#bullet
        this.divDamageValue.innerHTML = this.#extra_damage
    }
}

class AllowedCollisions {
    constructor(left=null, right=true, top=true, bottom=true) {
        this.left = left
        this.right = right
        this.top = top
        this.bottom = bottom
    }
}

class RangeRaffle {
    #min
    #max

    constructor({min, max}) {
        this.#min = min
        this.#max = max
    }

    getMin = () => this.#min
    getMax = () => this.#max
}

class Sprite {
    #id
    #img
    #width
    #height
    #cropX
    #cropY
    #type
    
    static types = this.#setTypes()

    constructor({id, img, width, height, cropX, cropY, type=Sprite.types.NORMAL}) {
        this.#id = id
        this.#img = img
        this.#width = width
        this.#height = height
        this.#cropX = cropX
        this.#cropY = cropY
        this.#type = type
    }

    getImg = () => this.#img
    getCropX = () => this.#cropX
    getCropY = () => this.#cropY
    getWidth = () => this.#width
    getHeight = () => this.#height
    getType = () => this.#type

    static #setTypes() {
        return {
            NORMAL: 0,
            EFFECT: 1,
        }
    }
}

class BugEffects {
    #name
    #event
    #action
    static names = this.#setNames()
    static events = this.#setEvents()
    static actions = this.#setActions()
            
    constructor({name, event, action}) {
        this.#name = name
        this.#event = event
        this.#action = action
    }

    getName = () => this.#name
    
    getEvent = () => this.#event

    getAction = () => this.#action

    static #setActions() {
        return {
            phantom({block}) {
                const bug = block.getBug()
                bug.effectActiveToogle()
            },
            divide({callback, model}) {
                callback({sequence: 2, model})
            }
        }
    }

    static #setNames() {
        return {
            PHANTOM: 'phantom',
            DIVIDE: 'divide',
        }
    }

    static #setEvents() {
        return {
            LELVEL_UP: 'level_up',
            DIVIDE: 'divide',
            COLLISION: 'collision'
        }
    }
}


class BugModels {
    #id
    #name
    #sprites
    #description
    #allowedCollisions
    #effect
    #emergenceLevel
    #rangeRaffle
    #alertDrop
    static effects = this.#createEffects()

    constructor({id, name, sprites, description, allowedCollisions, effect, emergenceLevel, rangeRaffle}) {
        this.#id = id
        this.#name = name
        this.#sprites = sprites
        this.#description = description
        this.#allowedCollisions = allowedCollisions
        this.#effect = effect
        this.#emergenceLevel = emergenceLevel
        this.#rangeRaffle = rangeRaffle
        this.#alertDrop = false
    }

    getEffect = () => this.#effect
    getEmergenceLevel = () => this.#emergenceLevel
    getRangeRaffle = () => this.#rangeRaffle
    setAlertDrop = (alert) => this.#alertDrop = alert
    listSprites = () => this.#sprites

    static #createEffects () {
        return {
            PHANTOM: new BugEffects({
                name: BugEffects.names.PHANTOM, 
                event: BugEffects.events.LELVEL_UP,
                action: BugEffects.actions.phantom
            }),
            DIVIDE: new BugEffects({
                name: BugEffects.names.DIVIDE, 
                event: BugEffects.events.DEAD,
                action: BugEffects.actions.divide
            }),
        }
    }
}

class BugLife{
    #life
    #width
    #height
    #color
    
    constructor() {
        this.#life = 1000
        this.#width = 50
        this.#height = 5
        this.#color = 'red'
    }

    setComputedLife({baseBugLife, incrementBugLife, level}) {
        this.#life = (level<=1) 
            ? baseBugLife 
            : (baseBugLife + (baseBugLife*(incrementBugLife/100)))
    }

    setWidth(width) {
        this.#width = width
    }

    getWidth() {
        return this.#width
    }

    setColor(color) {
        this.#color = color
    }

    getColor() {
        return this.#color
    }

    draw({ctx, block}) {
        ctx.beginPath()
        ctx.fillStyle = '#3e0d0d'
        ctx.fillRect(block.x+5, (block.y+block.height), 50, this.#height)
        ctx.fillStyle = this.#color
        ctx.fillRect(block.x+5, (block.y+block.height), this.#width, this.#height)
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.closePath()
    }

    calcLife({damage, extraDamage, baseBugLife, bulletMode}) {
        const damageMode = bulletMode.getDamage()
    
        const damageComputed = (((damage + extraDamage)*damageMode)/100 * baseBugLife)

        const current_life = (this.#width*2)/100*this.#life
        const new_life = (current_life-damageComputed)
        const new_life_percent = ((new_life*100/this.#life)/2)
        this.setWidth(new_life_percent)

        return new_life
    }
}

class Bug{
    static models = this.#createModels()

    constructor({model = null}) {
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

    getLife = () => this.life

    setLife = (life) => this.life = life

    setModel = (model) => this.model = model

    getModel = () => this.model

    getSprite = () => {
        const filter = (this.effectActive) ? Sprite.types.EFFECT : Sprite.types.NORMAL
        const sprites = this.model.listSprites().filter(e => e.getType() == filter)
        return sprites[this.spriteIndex]
    }

    getEffect = () => {
        const effect = this.model.getEffect()
        if (effect!=null) {
            return effect.getName()
        }else{
            return null
        }

    }

    effectActiveToogle = () => this.effectActive = !this.effectActive

    incrementSpriteIndex = () => {
        const filter = (this.effectActive) ? Sprite.types.EFFECT : Sprite.types.NORMAL
        const sprites = this.model.listSprites().filter(e => e.getType() == filter)
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

    redraw({ctx, block}) {
        const sprite = this.getSprite()
        
        ctx.beginPath()
        ctx.fillStyle = '#ffffff2b'
        ctx.fillRect(block.getX()+5, block.getY()+5, block.getWidth()-10, block.getHeight()-10)
        
        ctx.drawImage(
            this.img, sprite.getCropX(), sprite.getCropY(),
            sprite.getWidth(), sprite.getHeight(),
            block.x+5, block.y+5, this.width, this.height
        )
        ctx.closePath()

        this.incrementSpriteIndex()

        if (this.life != null) this.life.draw({ctx: ctx, block: block});
    }

    draw({ctx=null, block=null, level=null}) {
        if (this.model==null) this.raffleModel({level})
        
        const sprite = this.getSprite()

        this.img = new Image()
        this.img.onload = () => this.redraw({ctx: ctx, block: block})
        this.img.src = sprite.getImg()

        block.setBug(this)
    }

    raffleModel({level}) {
        let rand = Math.floor(Math.random() * 100)
        const fitModels = Bug.models.filter(e => (e.getEmergenceLevel()<=level && e.getEmergenceLevel()!=null) 
            && (rand >= e.getRangeRaffle().getMin() && rand <= e.getRangeRaffle().getMax()))
        rand = Math.floor(Math.random() * fitModels.length)
        const model = fitModels[rand]

        this.setModel(model)
    }

    static #createModels() {
        return [
            new BugModels({
                id: 1,
                name: 'Demon',
                description: 'Surge em todos os leveis',
                allowedCollisions: new AllowedCollisions(),
                effect: null,
                emergenceLevel: 0,
                rangeRaffle: new RangeRaffle({min: 0, max: 100}),
                sprites: [
                    new Sprite({
                        id: 1,
                        img: './img/sprites/demon_sprites.png',
                        cropX: 0,
                        cropY: 10,
                        width: 230,
                        height: 230
                    }),
                    new Sprite({
                        id: 2,
                        img: './img/sprites/demon_sprites.png',
                        cropX: 219,
                        cropY: 10,
                        width: 230,
                        height: 230
                    }),
                    new Sprite({
                        id: 3,
                        img: './img/sprites/demon_sprites.png',
                        cropX: 440,
                        cropY: 10,
                        width: 230,
                        height: 230
                    }),
                    new Sprite({
                        id: 4,
                        img: './img/sprites/demon_sprites.png',
                        cropX: 660,
                        cropY: 0,
                        width: 230,
                        height: 230
                    }),
                    new Sprite({
                        id: 5,
                        img: './img/sprites/demon_sprites.png',
                        cropX: 880,
                        cropY: 0,
                        width: 230,
                        height: 230
                    }),
                    new Sprite({
                        id: 6,
                        img: './img/sprites/demon_sprites.png',
                        cropX: 0,
                        cropY: 280,
                        width: 230,
                        height: 230
                    })
                ]
            }),
            new BugModels({
                id: 2,
                name: 'Bat',
                description: 'Se torna oculto entre os leveis',
                allowerdCollisions: new AllowedCollisions(),
                effect: BugModels.effects.PHANTOM,
                emergenceLevel: 10,
                rangeRaffle: new RangeRaffle({min: 20, max: 40}),
                sprites: [
                    new Sprite({
                        id: 1,
                        img: './img/sprites/bat_sprite.png',
                        cropX: 0,
                        cropY: 0,
                        width: 200,
                        height: 200
                    }),
                    new Sprite({
                        id: 2,
                        img: './img/sprites/bat_sprite.png',
                        cropX: 200,
                        cropY: 0,
                        width: 200,
                        height: 200
                    }),
                    new Sprite({
                        id: 3,
                        img: './img/sprites/bat_sprite.png',
                        cropX: 400,
                        cropY: 0,
                        width: 200,
                        height: 200,
                        type: Sprite.types.EFFECT
                    }),
                    new Sprite({
                        id: 4,
                        img: './img/sprites/bat_sprite.png',
                        cropX: 600,
                        cropY: 0,
                        width: 200,
                        height: 200,
                        type: Sprite.types.EFFECT
                    })
                ]
            }),
            new BugModels({
                id: 3,
                name: 'Slime',
                description: 'Surge quando um Big Slime é derrotado',
                allowerdCollisions: new AllowedCollisions(),
                effect: null,
                emergenceLevel: null,
                rangeRaffle: null,
                sprites: [
                    new Sprite({
                        id: 1,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 40,
                        cropY: 80,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 2,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 400,
                        cropY: 80,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 3,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 750,
                        cropY: 80,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 4,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 1120,
                        cropY: 80,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 5,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 1480,
                        cropY: 80,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 6,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 40,
                        cropY: 440,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 7,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 400,
                        cropY: 440,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 8,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 750,
                        cropY: 440,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 9,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 1120,
                        cropY: 440,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 10,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 1480,
                        cropY: 440,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 11,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 40,
                        cropY: 800,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 12,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 400,
                        cropY: 800,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 13,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 750,
                        cropY: 800,
                        width: 280,
                        height: 280
                    }),
                    new Sprite({
                        id: 14,
                        img: './img/sprites/slime_sprite.png',
                        cropX: 1120,
                        cropY: 940,
                        width: 280,
                        height: 280
                    })
                ]
            }),
            new BugModels({
                id: 4,
                name: 'Big Slime',
                description: 'Ao ser derrotado se divide em dois slimes',
                allowerdCollisions: new AllowedCollisions(),
                effect: BugModels.effects.DIVIDE,
                emergenceLevel: 20,
                rangeRaffle: new RangeRaffle({min: 55, max: 58}),
                sprites: [
                    new Sprite({
                        id: 1,
                        img: './img/sprites/big_slime_sprite.png',
                        cropX: 0,
                        cropY: 0,
                        width: 365,
                        height: 360
                    }),
                    new Sprite({
                        id: 2,
                        img: './img/sprites/big_slime_sprite.png',
                        cropX: 365,
                        cropY: 0,
                        width: 365,
                        height: 360
                    }),
                    new Sprite({
                        id: 3,
                        img: './img/sprites/big_slime_sprite.png',
                        cropX: 730,
                        cropY: 0,
                        width: 365,
                        height: 360
                    }),
                    new Sprite({
                        id: 4,
                        img: './img/sprites/big_slime_sprite.png',
                        cropX: 1085,
                        cropY: 0,
                        width: 365,
                        height: 360
                    }),
                    new Sprite({
                        id: 5,
                        img: './img/sprites/big_slime_sprite.png',
                        cropX: 1438,
                        cropY: 0,
                        width: 365,
                        height: 360
                    }),
                    new Sprite({
                        id: 6,
                        img: './img/sprites/big_slime_sprite.png',
                        cropX: 0,
                        cropY: 360,
                        width: 365,
                        height: 360
                    }),
                    new Sprite({
                        id: 7,
                        img: './img/sprites/big_slime_sprite.png',
                        cropX: 365,
                        cropY: 360,
                        width: 365,
                        height: 360
                    }),
                ]
            }),
        ]
    }
}

class Player {
    constructor() {
        this.movement = 50
        this.movementColor = '#10a580'
        this.size = 25
        this.x = null
        this.y = null
        this.img = "./img/nerd-cat.gif"
        this.points = 0
        this.damage = 40
        this.extraDamage = 0
        this.moveDirections = {left: 'left', right: 'right'}
    }

    setX = (x) => this.x = x
    getX = () => this.x
    setY = (y) => this.y = y
    getY = () => this.y
    setPoints = (points) => this.points = points
    getPoints = () => this.points
    incrementPoints = ({bulletMode}) => this.points+= bulletMode.getPoint()
    getCenter = () => ({x: this.x, y: this.y})
    getRight = () => (this.x+this.size)
    getLeft = () => (this.x-this.size)
    getTop = () => (this.y+this.size)
    resetMoviment = () => this.movement=50

    moving({direction}) {
        if (this.movement<=0) {
            return false
        }

        if (direction==this.moveDirections.right) {
            this.x++
        }else {
            this.x--
        }
        this.movement--
    }


    moveToRight({limit}) {
        const keys = ['ArrowRight', 'd']
        document.body.addEventListener('keydown', (e) => {
            if (keys.indexOf(e.key)>=0) {
                if (this.getRight()>=limit) return false
                this.moving({direction: this.moveDirections.right})
            }
        })

        document.body.addEventListener('keyup', (e) => {
            if (keys.indexOf(e.key)>=0) {
                console.log('parou de andar para a direita')
            }
        })
    }

    moveToLeft({limit}) {
        const keys = ['ArrowLeft', 'a']
        document.body.addEventListener('keydown', (e) => {
            if (keys.indexOf(e.key)>=0) {
                if (this.getLeft()<=limit) return false
                this.moving({direction: this.moveDirections.left})
            }
        })
        document.body.addEventListener('keyup', (e) => {
            if (keys.indexOf(e.key)<=0) {
                console.log('parou de andar para a direita')
            }
        })
    }

    drawMovementBar(ctx) {
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

    draw({canvas=null}) {
        this.setX(canvas.canvasWith/2)
        this.setY(canvas.canvasHeight-40)

        this.img = new Image()
        this.img.onload = () => canvas.ctx.drawImage(this.img, (this.x-this.size), (this.y-this.size), 50, 50)
        this.img.src = "./img/nerd-cat.gif"
        canvas.ctx.closePath()

        this.moveToRight({limit: canvas.canvasWith})
        this.moveToLeft({limit: 0})
    }

    redraw = (ctx) => {
        ctx.drawImage(this.img, (this.x-this.size), (this.y-this.size), 50, 50)
        this.drawMovementBar(ctx)
    }
    // setMovement = (movement) => this.movement = movement
    getDamage = () => this.damage
    setExtraDamage = (extraDamage) => this.extraDamage = extraDamage
    getExtraDamage = () => this.extraDamage

}

class BulletModes {
    #id
    #name
    #aceleration
    #colisions
    #color
    #damage
    #point

    constructor({id, name, aceleration, colisions, color, damage, point}) {
        this.#id = id
        this.#name = name
        this.#aceleration = aceleration
        this.#colisions = colisions
        this.#color = color
        this.#damage = damage
        this.#point = point
    }

    getAceleration() {
        return this.#aceleration
    }

    getColisions() {
        return this.#colisions
    }

    getColor() {
        return this.#color
    }

    getDamage = () => this.#damage
    getPoint = () => this.#point
}

class Bullet {
    #x
    #y
    #size
    #colisions
    #directionX
    #directionY
    #velocityX
    #velocityY
    #initDelay
    #currentDelay
    #mode
    #modes
    #orX
    #orY

    constructor({x, y}) {
        this.#x = x
        this.#y = y
        this.#size = 10
        this.#colisions = 0
        this.#directionX = 1
        this.#directionY = 1
        this.#velocityX = null
        this.#velocityY = null
        this.#initDelay = null
        this.#currentDelay = 0
        this.#mode = null
        this.#modes = []
        this.#orX = 1
        this.#orY = 1

        this.createModes()
        this.setMode(this.#modes[0])
    }

    setCoords({x=null, y=null}) {
        if (this.#currentDelay>this.#initDelay) {
            this.#x = x ?? this.#x
            this.#y = y ?? this.#y
        }else{
            this.#currentDelay++
        }
    }

    getCoords() {
        return {
            x: this.#x, 
            y: this.#y,
            top: (this.#y-this.#size/2),
            left: (this.#x-this.#size/2),
            right: (this.#x+this.#size/2),
            bottom: (this.#y+this.#size/2),
            size: this.#size,
            dx: this.#directionX, 
            dy: this.#directionY,
            vx: this.#velocityX,
            vy: this.#velocityY,
        }
    }

    incrementColisions() {
        this.#colisions++
        const mode = this.#modes.filter(e => e.getColisions() <= this.#colisions).at(-1)
        this.setMode(mode)
    }

    getColisions = () => this.#colisions
    
    setSize = (size) => this.#size = size
    
    toogleDirectionX() {
        this.#directionX*=-1
        this.toogleOrientationX()
    }

    toogleDirectionY() {
        this.#directionY*=-1
        this.toogleOrientationY()
    }

    setVelocityXY({vx, vy}) {
        this.#velocityX = vx
        this.#velocityY = vy
    }

    setInitDelay = (initDelay) => this.#initDelay = initDelay
    
    getMode = () => this.#mode
    
    setMode = (mode) => this.#mode = mode
    
    getOrientationX = () => this.#orX
    
    toogleOrientationX = () => this.#orX*=-1 
    
    getOrientationY = () => this.#orY
    
    toogleOrientationY = () => this.#orY*=-1 
    
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.#x, this.#y, this.#size, 0, 2 * Math.PI)
        ctx.fillStyle = this.#mode.getColor()
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
    }

    createModes() {
        this.#modes = [
            new BulletModes({id: 1, name:'Normal', aceleration: 1, colisions: 0, color: '#7fff00', damage: 1, point: 1}),
            new BulletModes({id: 2, name:'Moderate', aceleration: 2, colisions: 15, color: '#ffa000', damage: 2, point: 2}),
            new BulletModes({id: 3, name:'High', aceleration: 3, colisions: 30, color: '#e22b2b', damage: 2.5, point: 3}),
            new BulletModes({id: 4, name:'Insane', aceleration: 5, colisions: 50, color: 'white', damage: 3, point: 5})
        ]
    }
}

class Alert {
    #id
    #description
    #alerted

    constructor({id, description}) {
        this.#id = id
        this.#description = description
        this.#alerted = false
    }

    getDescription = () => this.#description
    getAlerted = () => this.#alerted
    setAlerted = () => this.#alerted = true
}

class Controller{
    constructor() {
        this.blockWidth = 60
        this.blockHeight = 60
        this.canvasArena = new CanvasArena(this.blockHeight)
        this.player = new Player()
        this.blocks = []
        this.velocity = 10
        this.bullets = []
        this.bulletSize = 10
        this.totalBullets = 1
        this.bulletDelay = 10
        this.baseBugLife = 1000
        this.incrementBugLife = 3
        this.sequenceDrops = 2
        this.level = 1
        this.mousePosition = {x:null, y:null}
        this.on = false
        this.gameOver = false
        this.alerts = this.createAlerts()

        this.DOMContentLoaded()
    }

    createAlerts = () => {
        return {
            DROP_BUGS_3X: new Alert({id: 1, description: 'Level 30:<br>Drop de Bugs aumenta 3x'})
        }
    }

    controllerSequenceDrop = () => {
        if (this.level>=30) {
            if (this.alerts.DROP_BUGS_3X.getAlerted()) return false
            
            this.sequenceDrops=3
            this.displayEventInfo({info: this.alerts.DROP_BUGS_3X.getDescription()})
            this.alerts.DROP_BUGS_3X.setAlerted()
        }
    }

    getRandomFreeBlock() {
        const idx = Math.floor(Math.random() * (this.blocks.length-1))
        const block = this.blocks[idx]
        if (block.getBug()!=null) return this.getRandomFreeBlock()
        return block
    }

    incrementBugLifeUpdate = () => this.incrementBugLife+=3

    dropBug({model = null}) {
        const block = this.getRandomFreeBlock()
        const bug = new Bug({model: model})
        bug.draw({ctx: this.canvasArena.ctx, block: block, level: this.level})
        
        const life = new BugLife()
        life.setComputedLife({
            baseBugLife: this.baseBugLife, 
            incrementBugLife: this.incrementBugLife, 
            level: this.level})
        life.draw({ctx: this.canvasArena.ctx, block: block})

        bug.setLife(life)

        if (this.level>1) this.incrementBugLifeUpdate()

        bug.getEffect()
    }

    drawGameOver() {
        if (this.gameOver) {
            const ctx = this.canvasArena.ctx
            const center = this.canvasArena.getCenter()

            ctx.beginPath()
            ctx.fillStyle = '#1f1f1f9e'
            ctx.fillRect(0, 0, this.canvasArena.canvasWith, this.canvasArena.canvasHeight)
            ctx.font = "30px Arial";
            ctx.fillStyle = 'white'
            ctx.textAlign = "center";
            ctx.fillText("Game Over", center.x, center.y);
            ctx.closePath()
        }
    }

    checkGameOver() {
        const totalFree = this.blocks.filter(e => e.getBug()==null).length
        
        if (totalFree<=this.sequenceDrops) {
            this.gameOver = true
            this.stopAnimate()
            return true
        }
        return false
    }

    dropSequence({sequence = 0, model = null}) {
        if (this.checkGameOver()) return false

        let count = 0
        while(count<sequence) {
            this.dropBug({model})
            count++
        }
    }

    getMouseCoords(e, screen) {
        return {x: e.pageX-screen.offsetLeft, y: e.pageY-screen.offsetTop}
    }

    drawCrosshairs() {
        if (this.on || (this.mousePosition.x==null || this.mousePosition.y==null)) return false

        const playerCenter = this.player.getCenter();
        const ctx = this.canvasArena.ctx

        ctx.beginPath()
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        
        ctx.moveTo(playerCenter.x, playerCenter.y)
        ctx.lineTo(this.mousePosition.x, this.mousePosition.y)
        ctx.strokeStyle = 'green'
        ctx.stroke()
        ctx.closePath()
    }

    updateMousePosition() {
        if (this.on) return false

        const screen = this.canvasArena.canvas
        screen.addEventListener('mousemove', (e) => {
            this.mousePosition = this.getMouseCoords(e, screen)
        })
    }

    bulletColisionArena(bullet) {
        const coords = bullet.getCoords()
        const screen = this.canvasArena.canvas
        const left = (coords.left+screen.offsetLeft)
        const right = (coords.right+screen.offsetLeft)
        const top = (coords.top+screen.offsetTop)
        const bottom = (coords.bottom+screen.offsetTop)

        if ((left <= screen.offsetLeft && (bullet.getOrientationX()<0))) {
            bullet.toogleDirectionX()
            bullet.incrementColisions()
            bullet.setCoords({x: coords.size})
        }else if (right >= (screen.offsetLeft + screen.width) && (bullet.getOrientationX()>0)) {
            bullet.toogleDirectionX()
            bullet.incrementColisions()
            bullet.setCoords({x: screen.width - coords.size})
        }else if ((top <= screen.offsetTop) && (bullet.getOrientationY()>0)) {
            bullet.toogleDirectionY()
            bullet.incrementColisions()
            bullet.setCoords({y: coords.size})
        }
        else if (bottom >= (screen.offsetTop+screen.height) && (bullet.getOrientationY()<0)) {
            const idx = this.bullets.indexOf(bullet)
            if (idx>-1) this.bullets.splice(idx, 1)
            this.incrementLevel()
        }
    }

    perfect() {
        const total = this.blocks.filter(e => e.bug != null).length
        if (total<=0) {
            this.player.setPoints(this.player.getPoints()*2)
            this.displayEventInfo({info: 'Perfect'})    
        }
    }

    apllyBugDamage({block, bullet}) {
        if (block.getBug()==null) return false
        const bug = block.getBug()
        const mode = bullet.getMode()

        bug.getLife().calcLife({
            damage: this.player.getDamage(), 
            extraDamage: this.player.getExtraDamage(), 
            baseBugLife: this.baseBugLife,
            bulletMode: mode
        });
            
        const life = bug.getLife().getWidth()
        if (life<=0) {
            block.removeBug()
            if (bug.getEffect()==BugEffects.names.DIVIDE) {
                const action = bug.getModel().getEffect().getAction()
                action({callback: this.dropSequence.bind(this), model: Bug.models[2]})
            }
            this.perfect()
        }
        
        this.player.incrementPoints({bulletMode: mode})
    }

    bulletColisionBug(bullet) {
        const coords = bullet.getCoords()
        let colisionLeftBug = null
        let colisionRightBug = null
        let colisionTopBug = null
        let colisionBottomBug = null

        this.blocks.filter(block => block.bug != null)
        .forEach(block => {
            const bug = block.bug
            const notPhantomEffect = (!bug.effectActive || (bug.effectActive && bug.getEffect()!=BugEffects.names.PHANTOM))
            const bcoords = {
                left: Math.round(block.x),
                right: Math.round(block.x+block.width),
                top: Math.round(block.y),
                bottom: Math.round(block.y+block.height)
            }

            if ((Math.round(coords.right)>=bcoords.left) 
                && (Math.round(coords.left)<bcoords.left) 
                // && (Math.round(coords.right)<=bcoords.right)
                && (Math.round(coords.bottom)>=bcoords.top) 
                && (Math.round(coords.top)<=bcoords.bottom)
                && (bullet.getOrientationX()>0)
                && (notPhantomEffect)) {
                    colisionLeftBug = block
            }

            if ((Math.round(coords.left)<=bcoords.right) 
                && (Math.round(coords.right)>bcoords.right) 
                // && (Math.round(coords.left)>=bcoords.left) 
                && (Math.round(coords.bottom)>=bcoords.top) 
                && (Math.round(coords.top)<=bcoords.bottom)
                && (bullet.getOrientationX()<0)
                && (notPhantomEffect)) {
                    colisionRightBug = block
            }

            if  ((Math.round(coords.bottom)>=bcoords.top) 
                && (Math.round(coords.bottom)<=bcoords.bottom)
                // && (Math.round(coords.top)<bcoords.top) 
                && (Math.round(coords.left)<=bcoords.right)
                && (Math.round(coords.right)>=bcoords.left)
                && (bullet.getOrientationY()<0)
                && (notPhantomEffect)) {
                    colisionTopBug = block
                }

            if ((Math.round(coords.top)<=bcoords.bottom) 
                && (Math.round(coords.top)>=bcoords.top)
                // && (Math.round(coords.bottom)>bcoords.bottom)
                && (Math.round(coords.left)<=bcoords.right) 
                && (Math.round(coords.right)>=bcoords.left)
                && (bullet.getOrientationY()>0)
                && (notPhantomEffect)) {
                    colisionBottomBug = block
                }
                
        })



        if (colisionLeftBug) {
            bullet.toogleDirectionX()
            bullet.incrementColisions()
            bullet.setCoords({x: colisionLeftBug.x-coords.size})
            this.apllyBugDamage({block: colisionLeftBug, bullet: bullet})

        }else if (colisionRightBug) {
            bullet.toogleDirectionX()
            bullet.incrementColisions()
            bullet.setCoords({x:colisionRightBug.x+colisionRightBug.width+coords.size})
            this.apllyBugDamage({block: colisionRightBug, bullet: bullet})

        }else if (colisionTopBug) {
            bullet.toogleDirectionY()
            bullet.incrementColisions()
            bullet.setCoords({y:colisionTopBug.y-coords.size})
            this.apllyBugDamage({block: colisionTopBug, bullet: bullet})

        }else if (colisionBottomBug){
            bullet.toogleDirectionY()
            bullet.incrementColisions()
            bullet.setCoords({y:colisionBottomBug.y+colisionBottomBug.height+coords.size})
            this.apllyBugDamage({block: colisionBottomBug, bullet: bullet})
        }
    }

    update() {
        const ctx = this.canvasArena.ctx
        this.canvasArena.clear()
        this.blocks.forEach(e => e.draw(ctx))
        this.blocks.filter(e => e.bug!=null).forEach(e => e.bug.redraw({ctx: ctx, block: e}))
        this.drawBullets()
        this.canvasArena.clearDeadZone()
        this.drawCrosshairs()
        this.player.redraw(ctx)
        this.drawGameOver()
        this.displayLevel()
        this.displayPoints()
        this.displayBullets()
        this.displayDamage()
        this.controllerSequenceDrop() 
        Shop.displayValues()
    }

    listBugsByEvent({event}) {
        this.blocks.filter(block => block.bug != null 
            && block.getBug().getModel().getEffect() != null
            && block.getBug().getModel().getEffect().getEvent() == event)
            .forEach(e => {
                const action = e.getBug().getModel().getEffect().getAction()
                action({ctx: this.canvasArena.ctx, block: e})
            })
    }

    incrementLevel() {
        if (this.bullets.length<=0) {
            this.level++
            this.player.resetMoviment()
            this.listBugsByEvent({event: BugEffects.events.LELVEL_UP})
            this.dropSequence({sequence: this.sequenceDrops})
        }
    }

    drawBullets() {
        const ctx = this.canvasArena.ctx

        if (this.bullets.length<=0) {
            this.stopShooting()
        }
        
        for(const bullet of this.bullets) {
            const coords = bullet.getCoords()

            const aceleration = bullet.getMode().getAceleration()
            
            const x = (coords.x+(coords.vx*coords.dx*aceleration))
            const y = (coords.y+(coords.vy*coords.dy*aceleration))
            
            bullet.setCoords({x: x, y: y})
            bullet.draw(ctx)
            
            this.bulletColisionArena(bullet)
            this.bulletColisionBug(bullet)
        }
    }

    animate() {
        if (this.gameOver) return false

        requestAnimationFrame(this.animate.bind(this))
        this.update()
    }

    stopAnimate() {
        cancelAnimationFrame(this.animate.bind(this))
    }

    drawTest({x, y, ctx}) {
        // ctx.clearRect(0, 0, this.canvasArena.canvasWith, this.canvasArena.canvasHeight)
        ctx.arc(x, y, 10, 0, 2 * Math.PI)
        ctx.fillStyle = 'white'

        const sprite = Bug.models[3].listSprites()[6]

        const img = new Image()
        img.onload = () => ctx.drawImage(
            img, 
            sprite.getCropX(),
            sprite.getCropY(),
            sprite.getWidth(),
            sprite.getHeight(),
            x,
            y, 
            60,
            60
        )
        img.src = sprite.getImg()

        ctx.fill()
    }

    drawShooting() {
        const screen = this.canvasArena.canvas        
        screen.addEventListener('click', (e) => {
            
            if (this.inShooting()) return false

            const mousePosition = this.getMouseCoords(e, screen)
            const playerCenter = this.player.getCenter();

            let x = mousePosition.x - playerCenter.x
            let y = mousePosition.y - playerCenter.y
            let l = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
            const vx = (x/l)*this.velocity
            const vy = (y/l)*this.velocity

            for(let i=0; i<this.totalBullets;i++) {
                const delay = (i*this.bulletDelay)
                const bullet = new Bullet({x: playerCenter.x, y: playerCenter.y})
                bullet.setVelocityXY({vx: vx, vy: vy})
                bullet.setInitDelay(delay)
                if (vx<0) bullet.toogleOrientationX()
                this.bullets.push(bullet)
            }

            this.startShooting()
        })
    }

    inShooting = () => this.on

    startShooting = () => this.on = true

    stopShooting = () => this.on = false
    
    displayLevel = () => {
        const divLevel = document.querySelector('div.level > span')
        divLevel.innerHTML = this.level
    }

    displayEventInfo = ({info}) => {
        const divEventsInfo = document.querySelector('div.events-info')
        divEventsInfo.style = 'display: flex'
        divEventsInfo.innerHTML = info
        setTimeout((_)=>(divEventsInfo.style='display: none'), 3000)
    }

    displayPoints = () => {
        const divPoints = document.querySelector('div.points > span')
        const divCoins = document.querySelector('div.menu .coins > .value')
        divPoints.innerHTML = this.player.getPoints()
        divCoins.innerHTML = this.player.getPoints()
    }

    displayBullets = () => {
        const divBullets = document.querySelector('div.menu .item-bullet .total')
        divBullets.innerHTML = this.totalBullets
    }

    displayDamage = () => {
        const divDamage = document.querySelector('div.menu .item-damage .total')
        divDamage.innerHTML =this.player.getExtraDamage()
    }

    displayMenu = () => {
        const divTitle = document.querySelector('div.title')
        const btnClose = document.querySelector('div.menu .btn-close')
        const divMenu = document.querySelector('div.menu')

        divTitle.addEventListener('click', (_) => {    
            divMenu.style.display = 'flex'
        })

        btnClose.addEventListener('click', (_) => {
            divMenu.style.display = 'none'
        })
    }

    updateBullets = () => {
        const coins = this.player.getPoints() - Shop.getBullet()
        if (coins<0) return false
        if (this.level<1) return false

        this.totalBullets++
        Shop.setBulletPrice({totalBullets: this.totalBullets})
        
        this.player.setPoints(coins)
    }

    updateExtraDamage = () => {
        const coins = this.player.getPoints() - Shop.getExtraDamage()
        if (coins<0) return false
        if (this.level<1) return false

        const extraDamage = (this.player.getExtraDamage()+3)

        this.player.setExtraDamage(extraDamage)
        Shop.setExtraDamagePrice({totalExtraDamage: extraDamage})
        
        this.player.setPoints(coins)
    }

    shopActions = () => {
        Shop.divBulletValue.addEventListener('click', (_) => {
            this.updateBullets()
        })

        Shop.divDamageValue.addEventListener('click', (_) => {
            this.updateExtraDamage()
        })
    }

    DOMContentLoaded() {
        document.addEventListener('DOMContentLoaded', (_) => {
            this.canvasArena.getCanvas()
            this.canvasArena.setCanvasConfig()
            this.canvasArena.createGrid({width: this.blockWidth, height: this.blockHeight, blocks: this.blocks})
            this.dropSequence({sequence: this.sequenceDrops})
            this.player.draw({canvas: this.canvasArena})
            this.updateMousePosition()
            this.drawShooting()
            this.animate()
            this.displayMenu()
            this.shopActions()
            Shop.reset()
        })
    }
}