import { Canvas } from "./canvas.js"
import { Player } from "./player.js"
import { Bullet } from "./bullet.js"
import { Boss } from "./boss.js"
import { Dungeon } from "./dungeon.js"
import { LoadData } from "./load_data.js"
import { Alert } from "./alert.js"
import { Block } from './block.js';
import { Bug } from "./bug.js"
import { BugLife } from "./bug_life.js"
import { BugEffects } from "./bug_effects.js"
import { Shop } from './shop.js';

export class Controller{
    requestAnimationFrameId:number = 0
    blockWidth:number = 60
    blockHeight:number = 60
    canvas:Canvas = new Canvas(this.blockHeight)
    player:Player = new Player()
    blocks:Array<Block> = []
    velocity:number = 1
    bullets:Array<Bullet> = []
    bulletSize:number = 2
    totalBullets:number = 1
    bulletDelay:number = 10
    baseBugLife:number = 1000
    incrementBugLife:number = 3
    sequenceDrops:number = 2
    level:number = 1
    mousePosition: {x:number|null, y:number|null} = {x:null, y:null}
    on:boolean = false
    gameOver:boolean = false
    bosses:Array<Boss> = []
    dungeons:Array<Dungeon> = []

    constructor() {
        // this.blockWidth = 60
        // this.blockHeight = 60
        // this.canvas = new CanvasArena(this.blockHeight)
        // this.player = new Player()
        // this.blocks = []
        // this.velocity = 10
        // this.bullets = []
        // this.bulletSize = 2
        // this.totalBullets = 1
        // this.bulletDelay = 10
        // this.baseBugLife = 1000
        // this.incrementBugLife = 3
        // this.sequenceDrops = 2
        // this.level = 1
        // this.mousePosition = {x:null, y:null}
        // this.on = false
        // this.gameOver = false
        // this.bosses = []
        // this.dungeons = []

        this.DOMContentLoaded()
    }

    createBosses = async () : Promise<void> => {
        const data = await LoadData.get('./data/bosses.json')
        data.forEach((e:any) => this.bosses.push(Boss.fromJson(e)));
    }

    createDungeons = () : void => {
        this.dungeons = [
            new Dungeon({id: 1, name: 'Amarela', level: 2, multiplier: 60, color: '#221a06', boss: this.bosses[0]}),
            new Dungeon({id: 2, name: 'Roxa', level: 100, multiplier: 70, color: '#221628', boss: this.bosses[1]}),
            new Dungeon({id: 3, name: 'Azul', level: 150, multiplier: 80, color: '#090b20', boss: this.bosses[2]}),
            new Dungeon({id: 4, name: 'Branca', level: 200, multiplier: 90, color: '#a18b8b', boss: this.bosses[3]}),
        ]
    }

    enterInDungeon = () : void => {
        const dungeon = this.dungeons.find(e => e.getLevel() == this.level)

        if (dungeon!=null) {
            dungeon.toEnter()
            const msg = `Dugeon ${dungeon.getName()}`
            Alert.displayEventInfo(msg)
            this.canvas.setColor(dungeon.getColor())

            const boss = dungeon.getBoss()
            const block = this.blocks[20]
            const blockLife = this.blocks[26]
            boss.draw({ctx: this.canvas.ctx, block: block, blockLife: blockLife})
            
            const life = new BugLife()
            life.setComputedLife({
                baseBugLife: this.baseBugLife, 
                incrementBugLife: this.incrementBugLife, 
                level: this.level,
                isBoss: true})
            life.draw({ctx: this.canvas.ctx, block: blockLife})

            boss.setLife(life)
        }
    }

    controllerSequenceDrop = () => {
        if (this.level>=30) {
            if (Alert.isAlerted(Alert.DROP_BUGS_3X)) return false
            
            this.sequenceDrops=3
            Alert.displayEventInfo(Alert.DROP_BUGS_3X)
        }
    }

    getRandomFreeBlock() : Block {
        const idx = Math.floor(Math.random() * (this.blocks.length-1))
        const block = this.blocks[idx]
        if (block.getBug()!=null) return this.getRandomFreeBlock()
        return block
    }

    incrementBugLifeUpdate = () => this.incrementBugLife+=3

    dropBug({model = null}) {
        const block = this.getRandomFreeBlock()
        const bug = new Bug(model)
        bug.draw({ctx: this.canvas.ctx, block: block, level: this.level})
        
        const life = new BugLife()
        life.setComputedLife({
            baseBugLife: this.baseBugLife, 
            incrementBugLife: this.incrementBugLife, 
            level: this.level})
        life.draw({ctx: this.canvas.ctx, block: block})

        bug.setLife(life)

        if (this.level>1) this.incrementBugLifeUpdate()

        bug.getEffect()
    }

    drawGameOver() {
        if (this.gameOver) {
            const ctx = this.canvas.ctx
            const center = this.canvas.getCenter()

            ctx.beginPath()
            ctx.fillStyle = '#1f1f1f9e'
            ctx.fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeigth())
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
            // this.dropBug({model})
            count++
        }
    }

    getMouseCoords(e: MouseEvent, screen: HTMLCanvasElement) {
        return {x: e.pageX-screen.offsetLeft, y: e.pageY-screen.offsetTop}
    }

    drawCrosshairs() {
        if (this.on || (this.mousePosition.x==null || this.mousePosition.y==null)) return false

        const playerCenter = this.player.getCenter();
        const ctx = this.canvas.ctx

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

        const screen = this.canvas.canvas!
        screen.addEventListener('mousemove', (e) => {
            this.mousePosition = this.getMouseCoords(e, screen)
        })
    }

    bulletColisionArena(bullet: Bullet) {
        const coords = bullet.getCoords()
        const screen = this.canvas.canvas!
        const left = (coords.left+screen.offsetLeft-coords.size)
        const right = (coords.right+screen.offsetLeft+coords.size)
        const top = (coords.top+screen.offsetTop-coords.size)
        const bottom = (coords.bottom+screen.offsetTop)


        if ((left <= screen.offsetLeft && (bullet.getOrientationX()<0))) {
            bullet.toogleDirectionX()
            bullet.incrementColisions(this.canvas)
            bullet.setCoords({x: coords.size})
        }else if (right >= (screen.offsetLeft + screen.width) && (bullet.getOrientationX()>0)) {
            bullet.toogleDirectionX()
            bullet.incrementColisions(this.canvas)
            bullet.setCoords({x: screen.width - coords.size})
        }else if ((top <= screen.offsetTop) && (bullet.getOrientationY()>0)) {
            bullet.toogleDirectionY()
            bullet.incrementColisions(this.canvas)
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
            Alert.displayEventInfo(Alert.PERFECT)    
        }
    }

    apllyBugDamage({block, bullet}:{block: Block, bullet:Bullet}) {
        if (block.getBug()==null) return false
        const bug = block.getBug()!
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
                const action = bug.getModel()!.getEffect()!.getAction()
                action({callback: this.dropSequence.bind(this), model: Bug.models[2]})
            }
            this.perfect()
        }
        
        this.player.incrementPoints(mode)
    }

    bulletColisionBug(bullet: Bullet) {
        const coords = bullet.getCoords()
        let colisionLeftBug:any
        let colisionRightBug:any
        let colisionTopBug:any
        let colisionBottomBug:any

        this.blocks.filter(block => block.bug != null)
        .forEach(block => {
            const bug = block.bug!
            const notPhantomEffect = (!bug.isEffectActive() || (bug.isEffectActive() && bug.getEffect()!=BugEffects.names.PHANTOM))
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
                    bullet.stop()
            }

            if ((Math.round(coords.left)<=bcoords.right) 
                && (Math.round(coords.right)>bcoords.right) 
                // && (Math.round(coords.left)>=bcoords.left) 
                && (Math.round(coords.bottom)>=bcoords.top) 
                && (Math.round(coords.top)<=bcoords.bottom)
                && (bullet.getOrientationX()<0)
                && (notPhantomEffect)) {
                    colisionRightBug = block
                    bullet.stop()
            }

            if  ((Math.round(coords.bottom)>=bcoords.top) 
                && (Math.round(coords.bottom)<=bcoords.bottom)
                // && (Math.round(coords.top)<bcoords.top) 
                && (Math.round(coords.left)<=bcoords.right)
                && (Math.round(coords.right)>=bcoords.left)
                && (bullet.getOrientationY()<0)
                && (notPhantomEffect)) {
                    colisionTopBug = block
                    bullet.stop()
                }

            if ((Math.round(coords.top)<=bcoords.bottom) 
                // && (Math.round(coords.top)>=bcoords.bottom-20)
                && (Math.round(coords.top)>=bcoords.top)
                // && (Math.round(coords.bottom)>bcoords.bottom)
                && (Math.round(coords.left)<=bcoords.right) 
                && (Math.round(coords.right)>=bcoords.left)
                && (bullet.getOrientationY()>0)
                && (notPhantomEffect)) {
                    colisionBottomBug = block
                    bullet.stop()
                }
                
        })



        if (colisionLeftBug) {
            bullet.toogleDirectionX()
            bullet.incrementColisions(this.canvas)
            bullet.resume()
            bullet.setCoords({x: colisionLeftBug.x-coords.size/2})
            this.apllyBugDamage({block: colisionLeftBug, bullet: bullet})

        }else if (colisionRightBug) {
            bullet.toogleDirectionX()
            bullet.incrementColisions(this.canvas)
            bullet.resume()
            bullet.setCoords({x:colisionRightBug.x+colisionRightBug.width+coords.size/2})
            this.apllyBugDamage({block: colisionRightBug, bullet: bullet})

        }else if (colisionTopBug) {
            bullet.toogleDirectionY()
            bullet.incrementColisions(this.canvas)
            bullet.resume()
            bullet.setCoords({y:colisionTopBug.y-coords.size/2})
            this.apllyBugDamage({block: colisionTopBug, bullet: bullet})

        }else if (colisionBottomBug){
            bullet.toogleDirectionY()
            bullet.incrementColisions(this.canvas)
            bullet.resume()
            bullet.setCoords({y:colisionBottomBug.y+colisionBottomBug.height+coords.size/2})
            this.apllyBugDamage({block: colisionBottomBug, bullet: bullet})
        }
    }

    update() {
        const ctx = this.canvas.ctx
        this.canvas.clear()
        this.blocks.forEach(e => e.draw(ctx))
        this.blocks.filter(e => e.bug!=null).forEach(e => e.bug!.redraw({ctx: ctx, block: e}))
        this.drawBullets()
        // this.canvas.clearDeadZone()
        this.drawCrosshairs()
        this.player.redraw(ctx)
        this.drawGameOver()
        this.displayLevel()
        this.displayPoints()
        this.displayBullets()
        this.displayDamage()
        this.controllerSequenceDrop() 
        Shop.displayValues()

        const block = this.blocks[20]
        const blockLife = this.blocks[26]
        
        
        this.dungeons.find(e => e.isInside())?.getBoss().redraw({ctx: ctx, block: block, blockLife: blockLife})

        // const b = this.blocks.filter(e => e.bug!)[0]
        // const bu = {x:b.getX()+70, y:b.getY()+10, s:10}
        // this.drawTest({x:bu.x, y:bu.y, ctx: this.canvas.ctx})

        // const colisions = {
        //     left: ((bu.x+bu.s) > b.getX()),
        //     top:  (bu.y+bu.s) >= b.getY(),
        //     bottom: (bu.y-bu.s)<=(b.getY()+b.getHeight())
        // }

        // if (colisions.left && colisions.top && colisions.bottom) {
        //     console.log(bu.x+bu.s, b.getX());
        // }
        
    }

    listBugsByEvent(event: string) {
        this.blocks.filter(block => block.bug != null 
            && block.getBug()!.getModel()!.getEffect() != null
            && block.getBug()!.getModel()!.getEffect()!.getEvent() == event)
            .forEach(e => {
                const action = e.getBug()!.getModel()!.getEffect()!.getAction()
                action({ctx: this.canvas.ctx, block: e})
            })
    }

    incrementLevel() {
        if (this.bullets.length<=0) {
            this.level++
            this.player.resetMoviment()
            this.listBugsByEvent(BugEffects.events.LELVEL_UP)
            this.dropSequence({sequence: this.sequenceDrops})
            this.canvas.desactiveInsaneMode()
            this.enterInDungeon()
        }
    }

    drawBullets() {
        const ctx = this.canvas.ctx

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
            
            const dungeon = this.dungeons.find(e => e.isInside())
            if (dungeon) {
                const boss = dungeon.getBoss()
                if (boss.getLife().getWidth()>0) {
                    const blocks:Array<Block> = [this.blocks[20], this.blocks[21], this.blocks[26], this.blocks[27]]
                    boss.colision(bullet, blocks)
                }
            }
        }
    }

    animate() {
        if (this.gameOver) return false

        this.requestAnimationFrameId = requestAnimationFrame(this.animate.bind(this))
        this.update()
    }

    stopAnimate() {
        cancelAnimationFrame(this.requestAnimationFrameId)
    }

    drawTest({x, y, ctx}:{x:number, y:number, ctx:CanvasRenderingContext2D}) {
        // ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeigth())
        
        ctx.arc(x, y, 10, 0, 2 * Math.PI)
        ctx.fillStyle = 'white'

        // const sprite = Bug.models[3].listSprites()[6]

        // const img = new Image()
        // img.onload = () => ctx.drawImage(
        //     img, 
        //     sprite.getCropX(),
        //     sprite.getCropY(),
        //     sprite.getWidth(),
        //     sprite.getHeight(),
        //     x,
        //     y, 
        //     60,
        //     60
        // )
        // img.src = sprite.getImg()

        ctx.fill()
    }

    drawShooting() {
        const screen = this.canvas.canvas!        
        screen.addEventListener('click', (e) => {
            
            if (this.inShooting()) return false

            const mousePosition = this.getMouseCoords(e, screen)
            const playerCenter = this.player.getCenter();

            let x = mousePosition.x - playerCenter.x!
            let y = mousePosition.y - playerCenter.y!
            let l = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
            const vx = (x/l)*this.velocity
            const vy = (y/l)*this.velocity

            for(let i=0; i<this.totalBullets;i++) {
                const delay = (i*this.bulletDelay)
                const bullet = new Bullet({x: playerCenter.x!, y: playerCenter.y!})
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
        const divLevel = document.querySelector('div.level > span')!
        divLevel.innerHTML = this.level.toString()
    }

    displayPoints = () => {
        const divPoints = document.querySelector('div.points > span')!
        const divCoins = document.querySelector('div.menu .coins > .value')!
        divPoints.innerHTML = this.player.getPoints().toString()
        divCoins.innerHTML = this.player.getPoints().toString()
    }

    displayBullets = () => {
        const divBullets = document.querySelector('div.menu .item-bullet .total')!
        divBullets.innerHTML = this.totalBullets.toString()
    }

    displayDamage = () => {
        const divDamage = document.querySelector('div.menu .item-damage .total')!
        divDamage.innerHTML =this.player.getExtraDamage().toString()
    }

    displayMenu = () => {
        const divTitle = document.querySelector('div.title')!
        const btnClose = document.querySelector('div.menu .btn-close')!
        const divMenu:HTMLDivElement = document.querySelector('div.menu')!

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
        Shop.setBulletPrice(this.totalBullets)
        
        this.player.setPoints(coins)
    }

    updateExtraDamage = () => {
        const coins = this.player.getPoints() - Shop.getExtraDamage()
        if (coins<0) return false
        if (this.level<1) return false

        const extraDamage = (this.player.getExtraDamage()+3)

        this.player.setExtraDamage(extraDamage)
        Shop.setExtraDamagePrice(extraDamage)
        
        this.player.setPoints(coins)
    }

    shopActions = () => {
        Shop.divBulletValue!.addEventListener('click', (_) => {
            this.updateBullets()
        })

        Shop.divDamageValue!.addEventListener('click', (_) => {
            this.updateExtraDamage()
        })
    }

    DOMContentLoaded = () => {
        
        document.addEventListener('DOMContentLoaded', async (_) => {
            await Bug.createModels()
            await this.createBosses()
            this.canvas.getCanvas()
            this.canvas.setCanvasConfig()
            this.blocks = this.canvas.createGrid({width: this.blockWidth, height: this.blockHeight})
            this.createDungeons()
            this.dropSequence({sequence: this.sequenceDrops})
            this.player.draw(this.canvas)
            this.updateMousePosition()
            this.drawShooting()
            this.animate()
            this.displayMenu()
            this.shopActions()
            Shop.reset()

        })
    }
}
new Controller()