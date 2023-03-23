class Block {
    constructor({x , y, bg, width, height, bug=null}) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.bg = bg
        this.bug = bug
    }

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

const MOB_EFFECTS = {
    PHANTOM: 'phantom',
    DIVIDE: 'divide',
    EVENTS: {
        LEVEL_UP: 'level_up',
        DEAD: 'dead',
        COLISION: 'colision'
    },
    EVENT: null,
    reset() {
        this.EVENT = null
    },
    phantomEffect() {
        const phantoms = this.listMobsPhantoms()

        for (p of phantoms) {
            if (this.EVENT == this.EVENTS.LEVEL_UP) {
                if (p.dataset.effectActive==String(false) && (LEVEL % 2) == 0) {
                    p.style.opacity = '0.1'
                    p.dataset.effectActive = true
                }else{
                    p.style.opacity = '1'
                    p.dataset.effectActive = false
                }
            }
        }
    },
    divideEffect(pos) {
        if(pos) { 
            const mob = pos['grid'].querySelector('div');
            
            if (this.EVENT == this.EVENTS.DEAD && mob.dataset.effect == this.DIVIDE) {
                const life = calcMobLife(pos)

                if (life<=0) {
                    setLogTerminal('Big Slime destruído, dos mini slime surgindo', true)
                    sequenceDropCreature(2, MOBS[2])
                }
            }
        }
    },
    listMobsPhantoms () {
        const phantoms = document.querySelectorAll("div.arena li div[data-effect='phantom']")
        return phantoms
    },
    listMobsEffectives() {
        const effectives = document.querySelectorAll("div.arena li > div[data-effect]:not([data-effect='null'])")
        return effectives
    },
    applyEffect(event, data) {
        this.EVENT = event 
        const grids = ARENA_GRIDS.filter(e => e['grid'].querySelector('div'))

        this.phantomEffect()
        this.divideEffect(data)
    }
}

const MOBS = [
    {
        ID: 1,
        NAME: 'Demon',
        IMG: 'https://media.tenor.com/gFvc0poigIYAAAAM/demon-red.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: null,
        LEVEL: 0,
        RAFFLE: {MIN: 0, MAX: 100},
        ALERT: false
    },
    {
        ID: 2,
        NAME: 'Bat',
        IMG: 'https://i.gifer.com/origin/ce/ce1c245954005ac923e3cea5f70518df_w200.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: MOB_EFFECTS.PHANTOM,
        LEVEL: 10,
        RAFFLE: {MIN: 20, MAX: 40},
        ALERT: false
    },
    {
        ID: 3,
        NAME: 'Slime',
        IMG: 'https://media.tenor.com/mgZBc6GhNlUAAAAC/game-pixel-art.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: null,
        LEVEL: 1000,
        RAFFLE: {MIN: 1000, MAX: 1000},
        ALERT: false
    },
    {
        ID: 4,
        NAME: 'Big Slime',
        IMG: 'https://media.tenor.com/DuJ4EA8BUVUAAAAC/slime-pixel-art.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: MOB_EFFECTS.DIVIDE,
        LEVEL: 20,
        RAFFLE: {MIN: 55, MAX: 58},
        ALERT: false
    },
    {
        ID: 5,
        NAME: 'Sonolento',
        IMG: './img/sonolento.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: MOB_EFFECTS.DIVIDE,
        LEVEL: 99999,
        RAFFLE: {MIN: 55, MAX: 58},
        ALERT: false
    },
]

class BugModels {
    constructor() {
        this.id,
        this.name,
        this.img,
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

    calcLife({damage=0, extraDamage=0, baseBugLife=0}) {
        const damageComputed = ((damage + extraDamage)/100 * baseBugLife)

        const current_life = (this.#width*2)/100*this.#life
        const new_life = (current_life-damageComputed)
        const new_life_percent = ((new_life*100/this.#life)/2)
        this.setWidth(new_life_percent)

        return new_life
    }
}

class Bug{
    constructor({id=null, life=null, blockIndex=null, srcImg=null}) {
        this.id = id
        this.life = null
        this.blockIndex = blockIndex
        this.width = 50
        this.height = 50
        this.srcImg = srcImg
        this.img = null
    }

    getLife() {
        return this.life
    }

    setLife(life) {
        this.life = life
    }

    redraw({ctx, block}) {
        ctx.beginPath()
        ctx.fillStyle = 'transparent'
        ctx.fillRect(block.x, block.y, this.width, this.height)
        ctx.drawImage(this.img, block.x+5, block.y+5, this.width, this.height)
        ctx.closePath()

        if (this.life != null) this.life.draw({ctx: ctx, block: block});
    }

    draw({ctx=null, block=null}) {
        ctx.beginPath()
        ctx.fillStyle = 'transparent'
        ctx.fillRect(block.x, block.y, this.width, this.height)
        
        this.img = new Image()
        this.img.onload = () => ctx.drawImage(this.img, block.x+5, block.y+5, this.width, this.height)
        this.img.src = this.srcImg
        ctx.closePath()

        block.setBug(this)
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
    incrementPoints = () => this.points++
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

    constructor({id, name, aceleration, colisions, color}) {
        this.#id = id
        this.#name = name
        this.#aceleration = aceleration
        this.#colisions = colisions
        this.#color = color
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

    getColisions() {
        return this.#colisions
    }

    setSize(size) {
        this.#size = size
    }

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

    setInitDelay(initDelay) {
        this.#initDelay = initDelay
    }

    getMode() {
        return this.#mode
    }

    setMode(mode) {
        this.#mode = mode
    }

    getOrientationX() {
        return this.#orX
    }

    toogleOrientationX() {
        this.#orX*=-1 
    }

    getOrientationY() {
        return this.#orY
    }

    toogleOrientationY() {
        this.#orY*=-1 
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.#x, this.#y, this.#size, 0, 2 * Math.PI)
        ctx.fillStyle = this.#mode.getColor()
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
    }

    createModes() {
        this.#modes = [
            new BulletModes({id: 1, name:'Normal', aceleration: 1, colisions: 0, color: 'green', damage: 1, point: 1}),
            new BulletModes({id: 2, name:'Moderate', aceleration: 2, colisions: 15, color: '#ffa000', damage: 2, point: 2}),
            new BulletModes({id: 3, name:'High', aceleration: 3, colisions: 30, color: '#e22b2b', damage: 3, point: 3}),
            new BulletModes({id: 4, name:'Insane', aceleration: 5, colisions: 50, color: 'white', damage: 5, point: 4})
        ]
    }
}

class Controller{
    constructor() {
        this.blockWidth = 60
        this.blockHeight = 60
        this.canvasArena = new CanvasArena(this.blockHeight)
        this.player = new Player()
        this.blocks = []
        this.velocity = 5
        this.bullets = []
        this.bulletSize = 10
        this.totalBullets = 1
        this.bulletDelay = 10
        this.baseBugLife = 1000
        this.sequenceDrops = 2
        this.level = 1
        this.mousePosition = {x:null, y:null}
        this.on = false
        this.gameOver = false

        this.DOMContentLoaded()
    }

    getRandomFreeBlock() {
        const idx = Math.floor(Math.random() * (this.blocks.length-1))
        const block = this.blocks[idx]
        if (block.getBug()!=null) return this.getRandomFreeBlock()
        return block
    }

    dropBug() {
        const block = this.getRandomFreeBlock()
        const bug = new Bug({id: MOBS.ID, blockIndex: 0, srcImg: MOBS[0].IMG, life: 100})
        bug.draw({ctx: this.canvasArena.ctx, block: block})
        
        const life = new BugLife()
        bug.setLife(life)
        life.draw({ctx: this.canvasArena.ctx, block: block})
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

    dropSequence({sequence = 0}) {
        if (this.checkGameOver()) return false

        let count = 0
        while(count<sequence) {
            this.dropBug()
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
            console.log('Perfect');
        }
    }

    apllyBugDamage(block) {
        if (block.getBug()==null) return false

        block.getBug().getLife().calcLife({
            damage: this.player.getDamage(), 
            extraDamage: this.player.getExtraDamage(), 
            baseBugLife: this.baseBugLife});
        const life = block.getBug().getLife().getWidth()
        if (life<=0) {
            this.player.incrementPoints()
            this.perfect()
            block.removeBug()
            console.log('bug eliminado');
        }
    }

    bulletColisionBug(bullet) {
        const coords = bullet.getCoords()
        
        const bugs = this.blocks.filter(e => e.bug != null)
        const colisionLeftBug = bugs.find(e => 
            (Math.round(coords.right)>=Math.round(e.x)) 
            && (Math.round(coords.left)<Math.round(e.x)) 
            && (Math.round(coords.bottom)>=Math.round(e.y)) 
            && (Math.round(coords.top)<=Math.round(e.y+e.height)
            && (bullet.getOrientationX()>0)))
        
        const colisionRightBug = bugs.find(e => 
            (Math.round(coords.left)<=Math.round(e.x+e.width)) 
            && (Math.round(coords.right)>Math.round(e.x+e.width)) 
            && (Math.round(coords.left)>=Math.round(e.x)) 
            && (Math.round(coords.bottom)>=Math.round(e.y)) 
            && (Math.round(coords.top)<=Math.round(e.y+e.height)
            && (bullet.getOrientationX()<0)))

        const colisionTopBug = bugs.find(e => 
            (Math.round(coords.bottom)>=Math.round(e.y)) 
            && (Math.round(coords.top) < Math.round(e.y)) 
            && (Math.round(coords.bottom)<=Math.round(e.y+e.height)) 
            && (Math.round(coords.left)<=Math.round(e.x+e.width) 
            && (Math.round(coords.right)>=Math.round(e.x))
            && (bullet.getOrientationY()<0)))

        const colisionBottomBug = bugs.find(e => 
            (Math.round(coords.top)<=Math.round(e.y+e.height)) 
            && (Math.round(coords.bottom) > Math.round(e.y+e.height)) 
            && (Math.round(coords.left)<=Math.round(e.x+e.width) 
            && (Math.round(coords.right)>=Math.round(e.x))
            && (bullet.getOrientationY()>0)))
        

        if (colisionLeftBug) {
            bullet.toogleDirectionX()
            bullet.incrementColisions()
            bullet.setCoords({x: colisionLeftBug.x-coords.size})
            this.apllyBugDamage(colisionLeftBug)

        }if (colisionRightBug) {
            bullet.toogleDirectionX()
            bullet.incrementColisions()
            bullet.setCoords({x:colisionRightBug.x+colisionRightBug.width+coords.size})
            this.apllyBugDamage(colisionRightBug)

        }if (colisionTopBug) {
            bullet.toogleDirectionY()
            bullet.incrementColisions()
            bullet.setCoords({y:colisionTopBug.y-coords.size})
            this.apllyBugDamage(colisionTopBug)

        }if (colisionBottomBug){
            bullet.toogleDirectionY()
            bullet.incrementColisions()
            bullet.setCoords({y:colisionBottomBug.y+colisionBottomBug.height+coords.size})
            this.apllyBugDamage(colisionBottomBug)
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
    }

    incrementLevel() {
        if (this.bullets.length<=0) {
            this.level++
            this.player.resetMoviment()
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
        ctx.clearRect(0, 0, this.canvasArena.canvasWith, this.canvasArena.canvasHeight)
        ctx.arc(x, y, 10, 0, 2 * Math.PI)
        ctx.fillStyle = 'white'
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

    inShooting() {
        return this.on
    }

    startShooting() {
        this.on = true
    }

    stopShooting() {
        this.on = false
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
        })
    }
}