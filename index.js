const MOB_EFFECTS = {
    PHANTOM: 'phantom',
    DIVIDE: 'divide',
    EVENTS: {
        LEVEL_UP: 'level_up',
        DEAD: 'dead',
        COLISION: 'colision'
    },
    EVENT: null,
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
        NAME: 'Demon',
        IMG: 'https://media.tenor.com/gFvc0poigIYAAAAM/demon-red.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: null,
        LEVEL: 0,
        RAFFLE: {MIN: 0, MAX: 100},
        ALERT: false
    },
    {
        NAME: 'Bat',
        IMG: 'https://i.gifer.com/origin/ce/ce1c245954005ac923e3cea5f70518df_w200.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: MOB_EFFECTS.PHANTOM,
        LEVEL: 10,
        RAFFLE: {MIN: 20, MAX: 40},
        ALERT: false
    },
    {
        NAME: 'Slime',
        IMG: 'https://media.tenor.com/mgZBc6GhNlUAAAAC/game-pixel-art.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: null,
        LEVEL: 1000,
        RAFFLE: {MIN: 1000, MAX: 1000},
        ALERT: false
    },
    {
        NAME: 'Big Slime',
        IMG: 'https://media.tenor.com/DuJ4EA8BUVUAAAAC/slime-pixel-art.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: MOB_EFFECTS.DIVIDE,
        LEVEL: 20,
        RAFFLE: {MIN: 55, MAX: 58},
        ALERT: false
    },
    {
        NAME: 'Sonolento',
        IMG: './img/sonolento.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: MOB_EFFECTS.DIVIDE,
        LEVEL: 99999,
        RAFFLE: {MIN: 55, MAX: 58},
        ALERT: false
    },
]

const BOSSES = [
    {
        NAME: MOBS[0].NAME,
        IMG: MOBS[0].IMG,
        ALERT: false
    },
    {
        NAME: MOBS[1].NAME,
        IMG: MOBS[1].IMG,
        ALERT: false
    },
    {
        NAME: MOBS[2].NAME,
        IMG: MOBS[2].IMG,
        ALERT: false
    },
    {
        NAME: MOBS[3].NAME,
        IMG: MOBS[3].IMG,
        ALERT: false
    },
    {
        NAME: 'Sonolento',
        IMG: './img/sonolento.gif',
        ALERT: false
    },
    {
        NAME: 'Procrastinador',
        IMG: './img/procrastinador.gif',
        ALERT: false
    },
]

const DUNGEONS = {
    LIST: [
        {
            LEVEL: 50,
            BOSS: BOSSES[0].IMG,
            BG: '#221a06',
            MULTIPLIER: 60,
            NAME: 'Amarela'
        },
        {
            LEVEL: 100,
            BOSS: BOSSES[1].IMG,
            BG: '#221628',
            MULTIPLIER: 70,
            NAME: 'Roxa'
        },
        {
            LEVEL: 150,
            BOSS: BOSSES[2].IMG,
            BG: '#090b20',
            MULTIPLIER: 80,
            NAME: 'Azul'
        },
        {
            LEVEL: 200,
            BOSS: BOSSES[3].IMG,
            BG: '#a18b8b',
            MULTIPLIER: 90,
            NAME: 'Branca'
        },
        {
            LEVEL: 250,
            BOSS: BOSSES[4].IMG,
            BG: '#4c270a',
            MULTIPLIER: 95,
            NAME: 'Laranja'
        },
        {
            LEVEL: 300,
            BOSS: BOSSES[5].IMG,
            BG: '#260000',
            MULTIPLIER: 100,
            NAME: 'Vermelha'
        },
    ],
    getLevels() {
        const levels = this.LIST.map(e => e.LEVEL)
        return levels
    },
    getByLevel(level) {
        const d = this.LIST.filter(e => e.LEVEL == level)
        if(d.length<0) console.error('Dungeons.getByLevel: Nenhum resultado foi encontrado');
        return d[0]
    }
}

const BOSS_CONTROLLER = {
    ON: false,
    ELEMENT: null,
    LIFE: 0,
    reset() {
        this.ON = false
        this.ELEMENT = null
        this.LIFE = 0
    },
    removeMobs() {
        ARENA_GRIDS[20]['grid'].innerHTML = ''
        ARENA_GRIDS[21]['grid'].innerHTML = ''
        ARENA_GRIDS[26]['grid'].innerHTML = ''
        ARENA_GRIDS[27]['grid'].innerHTML = ''
    },
    showBoss() {
        const compare_dungeon_Levels = DUNGEONS.getLevels().map(e => `${LEVEL} == ${e}`).join(' || ')
        if (!this.ON && eval(compare_dungeon_Levels)) {
            const dungeon = DUNGEONS.getByLevel(LEVEL)

            showLevel('Dungeon ' + dungeon.NAME)
            // THEME_ON = playSound(SOUNDS.BOSS_BATTLE, 0.2, true)

            // setTimeout(() => {
                this.removeMobs()

                const slot =  document.querySelector("li#slot_20").getBoundingClientRect()
                const boss_area = document.createElement('div')
                const ar = document.querySelector('div.arena').getBoundingClientRect()
                boss_area.style.width = (GRID_SIZE*2) + 'px'
                boss_area.style.height = (GRID_SIZE*2) + 'px'
                // boss_area.style.backgroundColor = 'orange'
                boss_area.style.position = 'absolute'
                boss_area.style.left = (slot.x - ar.x) + 'px'
                boss_area.style.top = (slot.y - ar.y) + 'px'
                boss_area.style.backgroundImage = "url("+ dungeon.BOSS +")"
                boss_area.style.backgroundSize = '80% 80%'
                boss_area.style.backgroundRepeat = 'no-repeat'
                boss_area.style.backgroundPosition = 'center'
                boss_area.style.display = 'flex'
                boss_area.style.justifyContent = 'center';
                // boss_area.style.opacity = '0.2'
                
                const bl = this.showBossLife()
                boss_area.append(bl)

                this.ELEMENT = boss_area
                this.ON = true
                
                this.LIFE = (MOB_LIFE + (MOB_LIFE*MOB_LIFE_INCREMENT/100))
                this.LIFE *= dungeon.MULTIPLIER
                
                ARENA.append(boss_area)
                ARENA.style.backgroundColor = dungeon.BG
                
            // }, 50);
        }
    },
    showBossLife() {
        const bl = document.createElement('div')
        bl.id = 'boss_life'
        bl.style.width = '80%'
        bl.style.height = '10px'
        bl.style.backgroundColor = 'red'
        bl.style.position = 'absolute'
        bl.style.bottom = 0
        return bl
    },
    applyDamage() {

        if (this.ELEMENT == null) return false

        const el_life = this.ELEMENT.querySelector('#boss_life')
        const critical =  CRITICAL_CONTROLLER.tryCritical(EXTRA_DAMAGE)
    
        // calc damage basead in MOB_LIFE dafault
        const damage = ((MIN_DAMAGE + EXTRA_DAMAGE)/100 * MOB_LIFE) + critical
        if (critical>0) CRITICAL_CONTROLLER.criticalLog(damage)
        
        const current_life =  (parseInt(el_life.style.width) / 100) * this.LIFE

        const new_life = (current_life-damage)

        const new_life_percent = (new_life*100) / this.LIFE
        el_life.style.width = new_life_percent + '%'

        if (new_life <= 0) {
            this.ELEMENT.remove()
            this.reset()
            playSound(SOUNDS.BUG_FINISH, 1.0)
            setLogTerminal("Boss derrotado!!!!")
            // THEME_ON.pause()
            // THEME_ON = null

        }else{
            playSound(SOUNDS.SHOOT_COLISION, 1.0)
        }
    },
    dropConflict(pos) {
        if (this.ON) {
            if (ARENA_GRIDS[pos]['grid'].id == "slot_20"
            || ARENA_GRIDS[pos]['grid'].id == "slot_21"
            || ARENA_GRIDS[pos]['grid'].id == "slot_26"
            || ARENA_GRIDS[pos]['grid'].id == "slot_27") {
                return true
            }
        }
        return false
    },
    colisionLeft(r, b, br, ar) {
       if ((br.right >= r.left && br.left <= r.left) && (br.bottom >= r.top && br.top<= r.bottom)) {
           const calc = (r.left - ar.left) - (BULLET_SIZE + 1)

           setBulletPosition(b, calc)
           incrementColision(b)
           this.applyDamage()
           b.dataset.directionX *= -1
        }
    },
    colisionRight(r, b, br, ar) {
        if ((br.left <= r.right && br.right >= r.right) && (br.bottom >= r.top && br.top<= r.bottom)) {
            const calc = (r.right - ar.left) + 1

            setBulletPosition(b, calc)
            incrementColision(b)
            this.applyDamage()
            b.dataset.directionX *= -1
         }
     },
     colisionTop(r, b, br, ar) {
        bdr = document.body.getBoundingClientRect()

        if ((br.bottom >= r.top && br.top <= r.top) && (br.right >= r.left && br.left <= r.right)) {
            const calc = (r.top - ar.top) - (BULLET_SIZE + 1)
            setBulletPosition(b, null, calc)
            incrementColision(b)
            this.applyDamage()
            b.dataset.directionY *= -1
         }
     },
     colisionBottom(r, b, br, ar) {
        if ((br.top <= r.bottom && br.bottom >= r.bottom) && (br.right >= r.left && br.left <= r.right)) {
            const calc = (r.bottom - ar.top) + 1
            setBulletPosition(b, null, calc)
            incrementColision(b)
            this.applyDamage()
            b.dataset.directionY *= -1
            
         }
     },
    colisions() {
        if (!this.ON || this.ELEMENT == null) return false

        const bullets = Array.from(document.querySelectorAll('div.bullet'))
        const r =  this.ELEMENT.getBoundingClientRect()
        const ar = ARENA.getBoundingClientRect()

        for (b of bullets) {
            const br = b.getBoundingClientRect()
            this.colisionLeft(r, b, br, ar)
            this.colisionRight(r, b, br, ar)
            this.colisionTop(r, b, br, ar)
            this.colisionBottom(r, b, br, ar)
        }
    }
}

const SYSTEM_CONTROLLER = {
    reset() {
        const btn_reset = document.querySelector('div.btn-reset-game')
        btn_reset.addEventListener('click', (_) => {
            const res = window.confirm('Deseja reiniciar o jogo?')
            if (res) {
                reset()
                setLogTerminal('O jogo foi reiniciado pelo usuário', true)
            }
        })
    }
}

const CRITICAL_CONTROLLER = {
    PROBABILITY: 1,
    MULTIPLIER_FACTOR: 3,
    tryCritical(extra_damage) {
        const random = Math.floor(Math.random() * 100)
        const probablity = (this.PROBABILITY + extra_damage)
        
        if (random <= probablity) {
            setLogTerminal(`CRITICAL!!! O dano foi multiplicado ${this.MULTIPLIER_FACTOR}x`, true)
            return this.MULTIPLIER_FACTOR
        }
        return 0
    },
    criticalLog(damage) {
        setLogTerminal(`CRITICAL!!! ${Math.floor(damage)}x${Math.floor(this.MULTIPLIER_FACTOR)} = ${Math.floor(damage*this.MULTIPLIER_FACTOR)}`, true)
    }
}

const MOVEMENT_PLAYER_CONTROLLER = {
    PLAYER_MOVIMENT_LIMITATION: 60,
    PLAYERS_CURRENT_MOVEMENT: 0,
    ON: false,
    SOUND_ON: null,
    reset() {
        this.PLAYERS_CURRENT_MOVEMENT = 0
        this.updateMovimentBar()
        this.ON = false
    },
    restarPositionPlayer() {
        const shot_position = document.querySelector('div.shot--position')
        shot_position.style.left = '160px';
        shot_position.style.transform = 'scaleX(1)';
    },
    updateMovimentBar () {
        const bar = document.querySelector('div.movement-bar')
        const percent = (this.PLAYER_MOVIMENT_LIMITATION-this.PLAYERS_CURRENT_MOVEMENT) * 100 / this.PLAYER_MOVIMENT_LIMITATION
        bar.style.width = percent + '%'
        this.ON = true
        if (LINE!=null) LINE.remove()
    },
    startSoundEffect() {
        if (this.SOUND_ON==null) {
            this.SOUND_ON = playSound(SOUNDS.MOVEMENT, 1.0)
            setTimeout(() => this.stopSoundEffect(), 1000);
        }
    },
    stopSoundEffect() {
        if (this.SOUND_ON!=null) {
            this.SOUND_ON.pause()
            this.SOUND_ON=null
        }
    },
    stopAtLimitLeft() { 
        const shot_position = document.querySelector('div.shot--position')
        const spr = shot_position.getBoundingClientRect()
        const ar = document.querySelector('div.arena').getBoundingClientRect()
        const left = ((spr.left + spr.width) >= ar.right)
        
        if (left) {
            this.stopSoundEffect()
            setLogTerminal('Chegou no limite da área de tiro', true)
            return false
        }
        return true
    },
    stopAtLimitRight() {
        const shot_position = document.querySelector('div.shot--position')
        const spr = shot_position.getBoundingClientRect()
        const ar = document.querySelector('div.arena').getBoundingClientRect()
        const right = (spr.left <= ar.left)

        if (right) {
            this.stopSoundEffect()
            setLogTerminal('Chegou no limite da área de tiro', true)
            return false
        }
        return true
    },
    allowed() {
        if (this.PLAYERS_CURRENT_MOVEMENT >= this.PLAYER_MOVIMENT_LIMITATION) {
            this.stopSoundEffect()
            setLogTerminal('Seu limite de movimento foi atingido', true)
            return false
        }
        if (ON) {
            setLogTerminal('Não pode ser movimentar durante o disparo', true)
            return false
        }
        return true
    },
    moveRight() {
        if (!this.stopAtLimitLeft()) return false
        if (!this.allowed()) return false

        const shot_position = document.querySelector('div.shot--position')
        shot_position.style.left = parseFloat(shot_position.style.left) + 1 + 'px'
        shot_position.style.transform = "scaleX(1)"
        this.PLAYERS_CURRENT_MOVEMENT++
        this.updateMovimentBar()
        this.startSoundEffect()
    },
    moveLeft() {
        if (!this.stopAtLimitRight()) return false
        if (!this.allowed()) return false
        
        const shot_position = document.querySelector('div.shot--position')
        shot_position.style.left = parseFloat(shot_position.style.left) - 1 + 'px'
        shot_position.style.transform = "scaleX(-1)"
        this.PLAYERS_CURRENT_MOVEMENT++
        this.updateMovimentBar()
        this.startSoundEffect()
    },
    INTERVAL: null,
    movePlayer() {
        document.oncontextmenu = function() {return false};
        document.querySelector('div.touch-movement-left').addEventListener('touchstart', (e) => {
            const touch = e.touches[0]
            this.INTERVAL = setInterval((_) => {this.moveLeft()}, 50)
        })
        document.querySelector('div.touch-movement-left').addEventListener('touchend', (e) => {
            const touch = e.touches[0]
            clearInterval(this.INTERVAL)
        })

        document.querySelector('div.touch-movement-right').addEventListener('touchstart', (e) => {
            e.stopPropagation()
            const touch = e.touches[0]
            this.INTERVAL = setInterval((_) => {this.moveRight()}, 50)
        })
        document.querySelector('div.touch-movement-right').addEventListener('touchend', (e) => {
            const touch = e.touches[0]
            clearInterval(this.INTERVAL)
        })
            
        document.addEventListener('keydown', (e) => {
            if (e.code==='ArrowRight') this.moveRight()
            if (e.code==='ArrowLeft') this.moveLeft()
        })
        document.addEventListener('keyup', (e) => {
            if (e.code==='ArrowRight' || e.code==='ArrowLeft') this.ON = false
        })
    }
}


GRID_SIZE = 60
GRID_PADDING = 10
MOB_SIZE = 40
MOB_LIFE = 1000
MOB_LIFE_INCREMENT = 3
MOB_HUE_ROTATE = "0.0"


VELOCITY = 3

const VELOCITY_MODES = {
    NORMAL: null,
    MODARATE: {ACTIVATE: 15, ACELERATION: 2, COLOR: '#ffa000', DAMAGE: 2, POINT: 2},
    HIGH: {ACTIVATE: 30, ACELERATION: 3, COLOR: '#e22b2b', DAMAGE: 3, POINT: 3},
    INSANE: {ACTIVATE: 50, ACELERATION: 5, COLOR: 'white', DAMAGE: 5, POINT: 4},
}

const PRICES = {
    BULLET: null,
    EXTRA_DAMAGE: null,
    reset() {
        this.BULLET = 2
        this.EXTRA_DAMAGE = 2
        this.bulletPriceUpdate()
        this.extraDamageUpdate()
    },
    bulletPriceUpdate() {
        const value = document.querySelector('li.shop-item-bullet div.value')
        PRICES.BULLET = (PRICES.BULLET*TOTAL_BULLETS)
        value.innerHTML = PRICES.BULLET + ' Points'
    },
    extraDamageUpdate() {
        const value = document.querySelector('li.shop-item-extra-damage div.value')
        PRICES.EXTRA_DAMAGE = (EXTRA_DAMAGE>0) ? (PRICES.EXTRA_DAMAGE*EXTRA_DAMAGE) : PRICES.EXTRA_DAMAGE
        value.innerHTML = PRICES.EXTRA_DAMAGE + ' Points'
    }
}


BULLET_DIR_X = 1 
BULLET_DIR_Y = 1
BULLET_SIZE = 15
BULLET_DISPLACEMENT_X = 0
BULLET_DISPLACEMENT_Y = 1
TOTAL_BULLETS = 1
CURRENT_BULLETS = 0
BULLET_PRICE = 50

ARENA = null
ARENA_ROWS = 6
ARENA_COLUMNS = 8
ARENA_GRIDS = []


SAFE_BOUND = 0
MIN_DAMAGE = 40
EXTRA_DAMAGE = 0

INTERVAL=null
LINE=null
ANGLE=null

LEVEL=1
POINTS=0

ON = false

COLISION_SIDES = {
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right'
}

const shop = () => {
    const shop_box = document.querySelector('div.shop')
    const shop_item_bullet = document.querySelector('li.shop-item-bullet')
    const shop_item_extra_damage = document.querySelector('li.shop-item-extra-damage')
    
    document.querySelector('div.shop-btn').addEventListener('click', (_) => {
        if (ON) return setLogTerminal("Não permitido durante disparo", true)
        
        shop_box.style.display = 'flex'
        setLogTerminal("Acessando a lojinha")
    })
    document.querySelector('div.close-shop-btn').addEventListener('click', (_) => {
        shop_box.style.display = 'none'
        setLogTerminal("Saindo da lojinha")
    })

    shop_item_bullet.querySelector('div.action').addEventListener('click', (_) => {
        if (POINTS >= PRICES.BULLET) {
            setLogTerminal("Comprou o item Bullet por " + PRICES.BULLET + " pontos")
            
            POINTS -= PRICES.BULLET
            TOTAL_BULLETS++
            setTotalBullets(TOTAL_BULLETS)

            PRICES.bulletPriceUpdate()
            setPoints(POINTS)

        }else{
            setLogTerminal("Pontos insuficientes para comprar o item", true)
        }
    })

    shop_item_extra_damage.querySelector('div.action').addEventListener('click', (_) => {
        if (POINTS >= PRICES.EXTRA_DAMAGE) {
            
            POINTS -= PRICES.EXTRA_DAMAGE
            EXTRA_DAMAGE++
            
            PRICES.extraDamageUpdate()
            setExtraDamage(EXTRA_DAMAGE)
            setPoints(POINTS)

            setLogTerminal("Comprou o item Extra Damage por " + PRICES.EXTRA_DAMAGE + " pontos")
            setLogTerminal("Pobabilidade de dano crítico subiu para " + (CRITICAL_CONTROLLER.PROBABILITY + EXTRA_DAMAGE) + "%", true)
        }else{
            setLogTerminal("Pontos insuficientes para comprar o item", true)
        }
    })
}

const setPoints = (points) => {
    const p = document.querySelector('div.points')
    const p2 = document.querySelector('div.shop div.points')
    p.innerHTML = 'Points: ' + points
    p2.innerHTML = 'Points: ' + points
}

const setExtraDamage = (ex_damage=null) => {
    if (ex_damage!=null) EXTRA_DAMAGE = ex_damage
    const ed = document.querySelector('div.equipment div.extra-damage')
    ed.innerHTML = `Damage: ${Math.round((MIN_DAMAGE + EXTRA_DAMAGE)/100 * MOB_LIFE)}<br>Extra: ${EXTRA_DAMAGE}%`
}

const setTotalBullets = (total) => {
    const total_bullet = document.querySelector('div.equipment div.bullets')
    TOTAL_BULLETS=total
    total_bullet.innerHTML = 'Bullets: ' + TOTAL_BULLETS
}

const incrementPoints = (bullet) => {
    if (bullet.dataset.totalColisions>=VELOCITY_MODES.MODARATE.ACTIVATE
    && bullet.dataset.totalColisions<VELOCITY_MODES.HIGH.ACTIVATE) {
        POINTS += VELOCITY_MODES.MODARATE.POINT
    }else if (bullet.dataset.totalColisions>=VELOCITY_MODES.HIGH.ACTIVATE
    && bullet.dataset.totalColisions<VELOCITY_MODES.INSANE.ACTIVATE) {
        POINTS += VELOCITY_MODES.HIGH.POINT
    }else if (bullet.dataset.totalColisions>=VELOCITY_MODES.INSANE.ACTIVATE) {
        POINTS += VELOCITY_MODES.INSANE.POINT
    }else{
        POINTS += 1
    }

    setPoints(POINTS)
}

const security = () => {
    const ul = ARENA.querySelector('ul')
    if (ul==null) {
        alert('Alterações externas foram identificadas no jogo e ele será reiniciado')
        document.location.reload()
    }

    ul.innerHTML = ''
    for(g of ARENA_GRIDS) {
        ul.append(g['grid'])
    }
}

// const setArenaBgColor = (boss=false) => {
//     const slots = Array.from(document.querySelectorAll('div.arena ul li'))
//     let count = 0
//     for (s of slots) {
//         if (count>=ARENA_ROWS) {
//             invert = !invert
//             count = 0
//         }
//         if (invert) {
//             bg = ((r % 2)==0) ? bg2 : bg1
//         }else{
//             bg = ((r % 2)==0) ? bg1 : bg2
//         }
//         s.style.backgroundColor = (boss) ? '' : ''
//         count ++
//     }
// }

const bg1 = '#40404081'
const bg2 = '#34343481'

const createArenaGrid = () => {
    const ul = document.createElement('ul')
    ul.style.margin = 0
    ul.style.padding = 0
    ul.style.width = '100%'
    ul.style.height = '100%'
    ul.style.listStyle = 'none'
    ul.style.display = 'flex'
    ul.style.flexDirection = 'row'
    ul.style.flexWrap = 'wrap'
    

    let count = 0
    let invert = false
    for(let r=0; r<ARENA_ROWS*ARENA_COLUMNS; r++) {
        bg = null

        if (count>=ARENA_ROWS) {
            invert = !invert
            count = 0
        }
        
        if (invert) {
            bg = ((r % 2)==0) ? bg2 : bg1
        }else{
            bg = ((r % 2)==0) ? bg1 : bg2
        }
        
        const li = document.createElement('li')
        li.id = 'slot_'+r
        li.style.width = GRID_SIZE + 'px'
        li.style.height = GRID_SIZE + 'px'
        li.style.backgroundColor = bg
        li.style.padding = GRID_PADDING + 'px'
        li.style.margin = '0'
        li.style.display = 'flex'
        li.style.alignItems = 'center'
        li.style.justifyContent = 'center'

        ARENA_GRIDS.push({'grid':li, 'mob':null})

        ul.append(li)

        count++
    }

    ARENA.append(ul)
}

const createBullet = (x,y) => {
    const bullet = document.createElement('div')
    bullet.classList.add('bullet')
    bullet.style.width = BULLET_SIZE + 'px'
    bullet.style.height = BULLET_SIZE + 'px'
    bullet.style.borderRadius = '50px'
    bullet.style.backgroundColor = 'chartreuse'
    bullet.style.position = 'absolute'
    bullet.style.left = x + 'px'
    bullet.style.top = y + 'px'
    bullet.dataset.directionX = 1
    bullet.dataset.directionY = 1
    bullet.dataset.totalColisions = 0
    
    ARENA.append(bullet)  
}

const setBulletColor = (bullet, color) => bullet.style.backgroundColor = color
const incrementColision = (bullet) => bullet.dataset.totalColisions++

const renderBullet = (x, y) => {
    CURRENT_BULLETS=0
    
    createBullet(x,y)
    CURRENT_BULLETS++
    const a = playSound(SOUNDS.SHOOT, 1.0)

    const showBullet = setInterval((_) => {
        if (CURRENT_BULLETS>=TOTAL_BULLETS) return clearInterval(showBullet)
        
        createBullet(x,y)
        CURRENT_BULLETS++
        const a = playSound(SOUNDS.SHOOT, 1.0)
    }, 200)
}

const SOUNDS = {
    THEME: 'theme',
    PERFECT: 'perfect',
    MOVEMENT: 'movement',
    SHOOT: 'shoot',
    SHOOT_COLISION: 'shoot_colision',
    SHOOT_COLISION_ARENA: 'shoot_colision_arena',
    BUG_FINISH: 'bug_finish',
    BOSS_BATTLE: 'boss_battle'
}

const playSound = (sound, volume = 1.0, repeat = false) => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.src = `./audio/${sound}.mp3`
    audio.volume = volume
    audio.loop = repeat
    audio.play()
    audio.onended = (_) => audio.remove()

    return audio
}

const perfect = () => {
    const bugs = ARENA_GRIDS.filter(e => e['grid'].querySelector('div'))

    if (bugs.length==0) {
        playSound(SOUNDS.PERFECT, 1.0)
        setLogTerminal(`PERFECT!!! Pontos duplicados ${POINTS}*2 = ${(POINTS*2)}`, true)
        POINTS *= 2
        setPoints(POINTS)
    }
}


const calcMobLife = (pos, update = false) => {
    const mob = pos['grid']
    const life = mob.querySelector('div#life')
    const mob_personal_life = pos['mob'].life
    
    const critical =  CRITICAL_CONTROLLER.tryCritical(EXTRA_DAMAGE)

    // calc damage basead in MOB_LIFE dafault
    const damage = ((MIN_DAMAGE + EXTRA_DAMAGE)/100 * MOB_LIFE) + critical
    if (critical>0) CRITICAL_CONTROLLER.criticalLog(damage)
    
    const current_life =  (parseInt(life.style.width) / 100) * mob_personal_life
    const new_life = (current_life-damage)

    if (update) {
        const new_life_percent = (new_life*100) / mob_personal_life
        life.style.width = new_life_percent + '%'
    }

    return new_life
}

const shake = (pos) => {
    const mob = pos['grid']
    
    mob.querySelector('div').style.animation = 'shake 0.5s'
    setTimeout(()=>{
        if (mob.querySelector('div')!=null) mob.querySelector('div').style.animation = ''
    }, 300)

   const new_life = calcMobLife(pos, true)

    if (new_life<=0) {
        MOB_EFFECTS.applyEffect(MOB_EFFECTS.EVENTS.DEAD, pos)
        
        mob.innerHTML = ''
        perfect()
        
        playSound(SOUNDS.BUG_FINISH, 1.0)
    }else{
        playSound(SOUNDS.SHOOT_COLISION, 1.0)
    }
}

const calculateRepositionOnColisionMob = (side, mob) => {
    const mob_rect = mob.getBoundingClientRect()
    
    switch(side) {
        case COLISION_SIDES.TOP: {
            const calculation = (mob_rect.y - arena_rect.top - BULLET_SIZE - 1)
            return calculation
        }
        case COLISION_SIDES.BOTTOM: {
            const calculation = (mob_rect.y + mob_rect.height) - arena_rect.top + 1 //+ BULLET_SIZE
            return calculation
        }
        case COLISION_SIDES.LEFT: {
            const calculation = (mob_rect.x - arena_rect.left - BULLET_SIZE - 1)
            return calculation
        }
        case COLISION_SIDES.RIGHT: {
            const calculation = (mob_rect.x + mob_rect.width) - arena_rect.left + 1 //+ BULLET_SIZE
            return calculation
        }
    }
}

const mobCollisionY = (bullet) => {
    let bullet_rect = bullet.getBoundingClientRect()

    for(i of ARENA_GRIDS) {
        const mob = i['grid'].querySelector('div')
        
        if (mob!=null && mob.dataset.effectActive==String(false)) {
            const mob_rect = i['grid'].getBoundingClientRect()

            // in top
            if (bullet_rect.bottom >= mob_rect.top && bullet_rect.top <= mob_rect.top
                && bullet_rect.left+SAFE_BOUND <= mob_rect.right && bullet_rect.right-SAFE_BOUND >= mob_rect.left) {
                
                bullet.dataset.directionY *= -1
                const calc = calculateRepositionOnColisionMob(COLISION_SIDES.TOP, i['grid'])
                setBulletPosition(bullet, null, calc)
                incrementColision(bullet)
                incrementPoints(bullet)

                shake(i)
            }

            // in bottom
            if (bullet_rect.top <= mob_rect.bottom && bullet_rect.bottom >= mob_rect.bottom
                && bullet_rect.left+SAFE_BOUND <= mob_rect.right && bullet_rect.right-SAFE_BOUND >= mob_rect.left) {

                bullet.dataset.directionY *= -1
                const calc = calculateRepositionOnColisionMob(COLISION_SIDES.BOTTOM, i['grid'])
                setBulletPosition(bullet, null, calc)
                incrementColision(bullet)
                incrementPoints(bullet)
                
                shake(i)
            }
            
        }
    }
}

const mobCollisionX = (bullet) => {
    let bullet_rect = bullet.getBoundingClientRect()
    
    for(i of ARENA_GRIDS) {
        const mob = i['grid'].querySelector('div')
        if (mob!=null && mob.dataset.effectActive==String(false)) {
            const mob_rect = i['grid'].getBoundingClientRect()

            // in left
            if (bullet_rect.right >= mob_rect.left && bullet_rect.left <= mob_rect.left
                && bullet_rect.top+SAFE_BOUND <= mob_rect.bottom && bullet_rect.bottom-SAFE_BOUND >= mob_rect.top) {
                
                bullet.dataset.directionX *= -1
                const calc = calculateRepositionOnColisionMob(COLISION_SIDES.LEFT, i['grid'])
                setBulletPosition(bullet, calc)
                incrementColision(bullet)
                incrementPoints(bullet)
                
                shake(i)
            }

            // in right
            if (bullet_rect.left <= mob_rect.right && bullet_rect.right >= mob_rect.right
                && bullet_rect.top+SAFE_BOUND <= mob_rect.bottom && bullet_rect.bottom-SAFE_BOUND >= mob_rect.top) {
                
                bullet.dataset.directionX *= -1
                
                const calc = calculateRepositionOnColisionMob(COLISION_SIDES.RIGHT, i['grid'])
                setBulletPosition(bullet, calc)
                incrementColision(bullet)
                incrementPoints(bullet)
                
                shake(i)
            }
        }
    }
}

const getTotalDisplayBullets = () =>document.querySelectorAll('div.bullet').length
const removeAllBullets = () => document.querySelectorAll('div.bullet').forEach(e => e.remove())

const shiftBullet = () => {
    let bullets = document.querySelectorAll('div.bullet')
    bullets = Array.from(bullets)

    for(b of bullets) {
        let acelation = 1
        if (b.dataset.totalColisions>=VELOCITY_MODES.MODARATE.ACTIVATE) {
            acelation = VELOCITY_MODES.MODARATE.ACELERATION
            setBulletColor(b, VELOCITY_MODES.MODARATE.COLOR)
        }
        if (b.dataset.totalColisions>=VELOCITY_MODES.HIGH.ACTIVATE) {
            acelation = VELOCITY_MODES.HIGH.ACELERATION
            setBulletColor(b, VELOCITY_MODES.HIGH.COLOR)
        }
        if (b.dataset.totalColisions>=VELOCITY_MODES.INSANE.ACTIVATE) {
            acelation = VELOCITY_MODES.INSANE.ACELERATION
            setBulletColor(b, VELOCITY_MODES.INSANE.COLOR)
            ARENA.style.filter = 'invert(75%)'
        }

        b.style.left = (parseFloat(b.style.left) + (BULLET_DISPLACEMENT_X*b.dataset.directionX*acelation)) + 'px'
        b.style.top = (parseFloat(b.style.top) + BULLET_DISPLACEMENT_Y*b.dataset.directionY*acelation) + 'px'

        arenaCollisionX(b)
        arenaCollisionY(b)
        mobCollisionX(b)
        mobCollisionY(b)
        BOSS_CONTROLLER.colisions()
    }
}

const calculateRepositionOnColisionArena = (side) => {
    const arena_rect = ARENA.getBoundingClientRect()
    
    switch(side) {
        case COLISION_SIDES.TOP: {
            const calculation = 1

            return calculation
        }
        // case COLISION_SIDES.BOTTOM: {
        //     const calculation = (mob_rect.y + mob_rect.height) - arena_rect.top + BULLET_SIZE
        //     return calculation
        // }
        case COLISION_SIDES.LEFT: {
            const calculation = 1
            return calculation
        }
        case COLISION_SIDES.RIGHT: {
            const calculation = (arena_rect.width - BULLET_SIZE)
            return calculation
        }
    }
}

const arenaCollisionX = (bullet) => {
    let bullet_rect = bullet.getBoundingClientRect()
    let arena_rect = ARENA.getBoundingClientRect()
    
    // colision on left or right side arena
    if (bullet_rect.left <= arena_rect.left) {
        bullet.dataset.directionX *= -1
        const calc = calculateRepositionOnColisionArena(COLISION_SIDES.LEFT)
        setBulletPosition(bullet, calc)
        incrementColision(bullet)
        playSound(SOUNDS.SHOOT_COLISION_ARENA, 1.0)
    }
    if (bullet_rect.right >= arena_rect.right) {
        const calc = calculateRepositionOnColisionArena(COLISION_SIDES.RIGHT)
        setBulletPosition(bullet, calc)
        incrementColision(bullet)
        bullet.dataset.directionX *= -1
        playSound(SOUNDS.SHOOT_COLISION_ARENA, 1.0)
    }
}

const arenaCollisionY = (bullet) => {
    let bullet_rect = bullet.getBoundingClientRect()
    let arena_rect = ARENA.getBoundingClientRect()

    // colision on top arena
    if (bullet_rect.top <= arena_rect.top) {
        bullet.dataset.directionY *= -1
        const calc = calculateRepositionOnColisionArena(COLISION_SIDES.TOP)
        setBulletPosition(bullet, null, calc)
        incrementColision(bullet)
        playSound(SOUNDS.SHOOT_COLISION_ARENA, 1.0)
    }

    // colision on bottom arena
    if (bullet_rect.bottom >= arena_rect.bottom + shot_position.offsetHeight) {
        const total_bullets_display = getTotalDisplayBullets()
        
        bullet.remove()
        
        if (total_bullets_display<=1 && CURRENT_BULLETS>=TOTAL_BULLETS) {
            
            setLogTerminal("Disparo foi finalizado")
            
            ON = false
            clearInterval(INTERVAL)
            INTERVAL=null
            if (!BOSS_CONTROLLER.ON) LEVEL++
            levelUpdate(LEVEL)
            ARENA.style.filter = 'none'
            MOVEMENT_PLAYER_CONTROLLER.reset()
            removeAllBullets()
        }
    }
}

const incrementCreatureColorFilter = () => {

    split = String(MOB_HUE_ROTATE).split('.')
    let dig1 = parseInt(split[0]);
    let dig2 = parseInt(split[1]);

    if (dig2<9) {
        dig2++
    }else{
        dig2 = 0
        dig1++
    }

    MOB_HUE_ROTATE = dig1 + '.' + dig2
}

const mobRaffle = () => {
    let r = Math.floor(Math.random() * 100)
    const fitMobs = MOBS.filter(m => (+r >= +m.RAFFLE.MIN) && (+r <= +m.RAFFLE.MAX) && (+LEVEL >= m.LEVEL))
    r = Math.floor(Math.random()*fitMobs.length)
    return fitMobs[r]
}

const validateFinalGame = () => {
    const total = ARENA_GRIDS.filter(e => e['grid'].querySelector('div')).length
    return ((total>=ARENA_GRIDS.length) || (total>=(ARENA_GRIDS.length-4) && BOSS_CONTROLLER.ON))
}

const dropCreature = (mob_raffle) => {
    if (validateFinalGame()) return false

    const pos = Math.floor(Math.random() * ARENA_GRIDS.length)
    const mob = document.createElement('div')
    const life = document.createElement('div')
    const grid_rect = ARENA_GRIDS[pos]['grid'].getBoundingClientRect()

    if (ARENA_GRIDS[pos]['grid'].querySelector('div')!=null || BOSS_CONTROLLER.dropConflict(pos)) {
        return dropCreature(mob_raffle)
    }

    if (mob_raffle==null) mob_raffle = mobRaffle()

    mob.style.left = grid_rect.left + 'px'
    mob.style.width = MOB_SIZE + 'px'
    mob.style.height = MOB_SIZE + 'px'
    mob.style.backgroundColor = 'yellow'
    mob.style.backgroundSize = 'cover'
    mob.style.backgroundImage = `url(${mob_raffle.IMG})`
    mob.dataset.effect = mob_raffle.EFFECT
    mob.dataset.effectActive = false
    
    life.style.width = 100 + '%'
    life.style.height = 6 + 'px'
    life.style.backgroundColor = 'red'
    life.id = 'life'

    let life_mob = MOB_LIFE

    if (LEVEL>1) {
        life_mob = (MOB_LIFE + (MOB_LIFE*MOB_LIFE_INCREMENT/100))
        MOB_LIFE_INCREMENT+=3
        incrementCreatureColorFilter()
    }

    mob.style.filter = `hue-rotate(${MOB_HUE_ROTATE}rad)`

    ARENA_GRIDS[pos]['mob'] = {'life': life_mob}
    ARENA_GRIDS[pos]['grid'].style.display = 'flex'
    ARENA_GRIDS[pos]['grid'].style.flexDirection = 'column'
    ARENA_GRIDS[pos]['grid'].append(mob)
    ARENA_GRIDS[pos]['grid'].append(life)
}

const sequenceDropCreature = (sequence, mob_select) => {
    count=0
    while(count < sequence) {
        dropCreature(mob_select)
        count++
    }
}

const createTestElement = (x, y) => {
    const teste = document.createElement('div')
    teste.style.width = '10px'
    teste.style.height = '10px'
    teste.style.backgroundColor = 'red'
    teste.style.left = x + 'px' ?? 0
    teste.style.top = y + 'px' ?? 0
    teste.style.position = 'absolute'

    ARENA.append(teste)
}

const invalidPosition = (e) => {
    const arena_rect = document.querySelector('div.arena').getBoundingClientRect()

    if ((e.pageX <= arena_rect.x || e.pageX >= (arena_rect.x + arena_rect.width))
        || (e.pageY >= (arena_rect.y + arena_rect.height)) || (e.pageY <= arena_rect.y)) {
            document.body.style.cursor = 'not-allowed'
            return true
        }
    return false
}

const showLine = (e) => {
    if (ON) return false
        if (MOVEMENT_PLAYER_CONTROLLER.ON) return false
        if (invalidPosition(e)) return false

        const spr = document.querySelector('div.shot--position').getBoundingClientRect()
        const arena_rect = ARENA.getBoundingClientRect()


        const x1 = spr.left + (spr.width/2) - arena_rect.x
        const y1 = spr.top + (spr.height/2) - arena_rect.y
        const x2 = e.pageX-arena_rect.x
        const y2 = e.pageY-arena_rect.y

        const length = Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2 - y1), 2))
        

        const cx = ((x1 + x2) / 2)
        const cy = ((y1 + y2) / 2)
        
        const bx = (spr.x + (spr.width/2) - (BULLET_SIZE/2) - arena_rect.x)
        const by =  (spr.y - arena_rect.y)

        ANGLE = Math.atan2((y1-y2), (x1-x2))*(180/Math.PI)
        
        LINE = document.querySelector('div#line') ?? document.createElement('div')
        LINE.id = 'line'
        LINE.style.color = 'green'
        LINE.style.height = '5px'
        LINE.style.backgroundColor = 'green'
        LINE.style.position = 'absolute'
        LINE.style.top =  cy -  (LINE.offsetHeight/2) + 'px'
        LINE.style.left = cx - (LINE.offsetWidth/2) + 'px'
        LINE.style.width = length + 'px'
        LINE.style.transform = `rotate(${ANGLE}deg)`
        
        ARENA.append(LINE)
}

const drawLine = () => {
    document.querySelector('div.arena').addEventListener('touchmove', (e) => {
        const touch = e.touches[0]
        showLine(touch)
    })


    document.querySelector('div.arena').addEventListener('mousemove', (e) => {
        showLine(e)
    })
}

const setBulletPosition = (b, x=null, y=null) => {
    if (x!=null) b.style.left = x + 'px'
    if (y!=null) b.style.top = y + 'px'
}

const execShoot = (e) => {
    
    security()
    removeAllBullets()
    
    const arena_rect = document.querySelector('div.arena').getBoundingClientRect()
    const spr = document.querySelector('div.shot--position').getBoundingClientRect()
    
    
    let x = e.pageX - spr.x - (spr.width/2) - (BULLET_SIZE/2)
    let y = e.pageY - spr.y - (spr.height/2) - (BULLET_SIZE/2)
    
    let l = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    
    x = (x / l)
    y = (y / l)

    const bx = (spr.x + (spr.width/2) - (BULLET_SIZE/2) - arena_rect.x)
    const by =  (spr.y - arena_rect.y)
    
    renderBullet(bx, by)
    
    BULLET_DISPLACEMENT_X = (x * VELOCITY)
    BULLET_DISPLACEMENT_Y = (y * VELOCITY)
    
    INTERVAL = setInterval(shiftBullet)
    
    ON = true
    
    if (LINE) LINE.remove()
    
    setLogTerminal("Disparo realizado")
}

const shoot = () => {
    document.querySelector('div.arena').addEventListener('touchstart', (e) => {
        const touch = e.touches[0]
        if (invalidPosition(touch)) return setLogTerminal('Posição inválida para atirar', true)
        
        if (!ON) execShoot(touch)

        return
    })

    document.querySelector('div.arena').addEventListener('click', (e) => {
        if (invalidPosition(e)) return setLogTerminal('Posição inválida para atirar', true)
        
        if (!ON) execShoot(e)
    })
}

const MOB_DROP_AMOUNTS = {
    LEVEL_0: {min:0, max:30, drops: 2},
    LEVEL_30: {min:30, max:50, drops: 3},
    LEVEL_50: {min: 50, max:100,  drops: 3},//4},
    LEVEL_100: {min: 100, max:999999, drops: 3},//5},
    ALERTS: {
        LEVEL_0: false,
        LEVEL_30: false,
        LEVEL_50: false,
        LEVEL_100: false
    },
    reset() {
        this.ALERTS.LEVEL_0 = false
        this.ALERTS.LEVEL_30 = false
        this.ALERTS.LEVEL_50 = false
        this.ALERTS.LEVEL_100 = false
    },
    changeDrops() {
        if (LEVEL>=this.LEVEL_0.min && LEVEL<=this.LEVEL_0.max) {
            sequenceDropCreature(this.LEVEL_0.drops)
            if (!this.ALERTS.LEVEL_0) setLogTerminal(`Level incial, dropando ${this.LEVEL_0.drops} bugs por level`, true)
            this.ALERTS.LEVEL_0 = true
        
        }else if (LEVEL>=this.LEVEL_30.min && LEVEL<=this.LEVEL_30.max){
            sequenceDropCreature(this.LEVEL_30.drops)
            if (!this.ALERTS.LEVEL_30) setLogTerminal(`Level ${this.LEVEL_30.min}, dropando ${this.LEVEL_30.drops} bugs por level`, true)
            this.ALERTS.LEVEL_30 = true

        }
        else if (LEVEL>=this.LEVEL_50.min && LEVEL<=this.LEVEL_50.max) {
            sequenceDropCreature(this.LEVEL_50.drops)
            if (!this.ALERTS.LEVEL_50) setLogTerminal(`Level ${this.LEVEL_50.min}, dropando ${this.LEVEL_50.drops} bugs por level`, true)
            this.ALERTS.LEVEL_50 = true
        

        }else if (LEVEL>=this.LEVEL_100.min && LEVEL<=this.LEVEL_100.max) {
            sequenceDropCreature(this.LEVEL_100.drops)
            if (!this.ALERTS.LEVEL_100) setLogTerminal(`Level ${this.LEVEL_100.min}, dropando ${this.LEVEL_100.drops} bugs por level`, true)
            this.ALERTS.LEVEL_100 = true

        }
    }
}

const showLevel = (level) => {
    info.querySelector('div.level').innerHTML = level
}

const levelUpdate = () => {
    info = document.querySelector('div.info')
    if (!BOSS_CONTROLLER.ON) showLevel('Level: ' + LEVEL)
    
    setLogTerminal("Novos bugs entraram na arena")
    
    MOB_DROP_AMOUNTS.changeDrops()
    MOB_EFFECTS.applyEffect(MOB_EFFECTS.EVENTS.LEVEL_UP)

    
    setExtraDamage()
    gameOver()
    
    BOSS_CONTROLLER.showBoss()
}

const reset = () => {
    LEVEL = 1
    clearInterval(INTERVAL)
    INTERVAL = null
    MIN_DAMAGE = 20
    ARENA_GRIDS = []
    ON = false
    ARENA.innerHTML = ''
    BULLET_DIR_X = 1
    BULLET_DIR_Y = 1
    POINTS=0
    MOB_LIFE_INCREMENT=3
    MOB_HUE_ROTATE="0.0"
    BOSS_CONTROLLER.reset()
    setPoints(POINTS)
    createArenaGrid()
    levelUpdate()
    setExtraDamage(0)
    setTotalBullets(1)
    PRICES.reset()
    MOB_DROP_AMOUNTS.reset()
    MOVEMENT_PLAYER_CONTROLLER.restarPositionPlayer()
    ARENA.style.backgroundColor = '#373737'
}

const gameOver = () => {
    total = ARENA_GRIDS.filter(e => e['grid'].querySelector('div')).length
    
    if (validateFinalGame()) {
        setLogTerminal(`O jogo acabou, você chegou ao Level: ${LEVEL}`, true)
        res = alert('Game Over')
        if (res==undefined) {
            reset()
        }
    }
}

LOGS = []
const setLogTerminal = (log, error=false) => {
    const ul = document.querySelector('div.terminal ul')
    const li = document.createElement('li')

    li.innerText = 'home/DevsAndBugs> ' + log
    if (error) li.classList.add('log-error')
    
    LOGS.push(li)
    LOGS = LOGS.slice(-7)
    
    ul.innerHTML = ''
    LOGS.forEach(e => ul.append(e))

    ul.scrollTo({ left: 0, top: ul.scrollHeight, behavior: "smooth" });
}

const terminalClear = () => {
    const ul = document.querySelector('div.terminal ul')
    ul.innerHTML = ''
}

THEME_ON = null
const startTheme = () => {
    const btn = document.querySelector('div.shot--area > div.play-stop-music')
    btn.addEventListener('click', (_) => {
        if (THEME_ON!=null) {
            if (THEME_ON.paused) {
                THEME_ON.play()
                return setLogTerminal('Música tocando', true);
            } else{
                THEME_ON.pause()
                setLogTerminal('Música em pausa', true);
            }
            return 
        }
        THEME_ON=playSound(SOUNDS.THEME, 0.05, true)
        setLogTerminal('Música do jogo iniciada, aproveite.', true);
    })
}

const initShootPosition = () => document.querySelector('div.shot--position').style.left = '160px'

const welcome = () => {
    const welcome = document.createElement('div')
    welcome.style.width = '100%'
    welcome.style.height  = '100vh'
    welcome.style.backgroundColor = '#000000de'
    welcome.style.position = 'absolute'
    welcome.style.zIndex = '10'
    welcome.style.display = 'flex'
    welcome.style.justifyContent = 'center'
    welcome.style.alignItems = 'center'

    const panel = document.createElement('div')
    panel.style.width = '200px'
    panel.style.height = '200px'
    panel.style.border = '1px solid white'
    panel.style.color = 'white'
    panel.style.textAlign = 'center'
    panel.style.padding = '10px'
    panel.innerHTML = "<p>Bem vindo</p>"
    panel.innerHTML += "<br>"
    panel.innerHTML += "<p>Jogo em desenvolvimento</p>"
    panel.innerHTML += "<br>"
    panel.innerHTML += "<p>Boa diversão :)</p>"
    panel.innerHTML += "<br>"
    panel.innerHTML += "<button id='iniciar' style='padding:5px 8px;'>Iniciar</button>"

    welcome.append(panel)

    document.body.append(welcome)

    document.querySelector('button#iniciar').addEventListener('click', (_) => {
        welcome.remove()
        playSound(SOUNDS.THEME, 0.2, true)
    })
}

document.addEventListener("DOMContentLoaded", (_) => {
    welcome()

    initShootPosition()
    MOVEMENT_PLAYER_CONTROLLER.reset()
    MOVEMENT_PLAYER_CONTROLLER.movePlayer()
    SYSTEM_CONTROLLER.reset()

    startTheme()

    ARENA = document.querySelector('.arena')
    arena_rect = ARENA.getBoundingClientRect()
    shot_position = document.querySelector('.shot--position')
    shot_position_rect = shot_position.getBoundingClientRect()
    
    setLogTerminal("Novo jogo iniciado")

    PRICES.reset()
    
    shop()
    setExtraDamage(EXTRA_DAMAGE)
    setTotalBullets(TOTAL_BULLETS)
    setPoints(POINTS)
    PRICES.bulletPriceUpdate()
    PRICES.extraDamageUpdate()

    createArenaGrid()
    levelUpdate()
    
    drawLine()
    shoot()

})