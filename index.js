GRID_SIZE = 60
GRID_PADDING = 10
MOB_SIZE = 40
MOB_LIFE=1000
MOB_LIFE_INCREMENT=10
MOB_HUE_ROTATE="0.0"


VELOCITY = 3

const MOB_EFFECTS = {
    PHANTOM: 'phantom',
    phantomEffect(mob) {
        if (mob.dataset.effectActive==String(false) && (LEVEL % 2) == 0) {
            mob.style.opacity = '0.1'
            mob.dataset.effectActive = true
        }else{
            mob.style.opacity = '1'
            mob.dataset.effectActive = false
        }
    },
    applyEffect() {
        const grids = ARENA_GRIDS.filter(e => e['grid'].querySelector('div'))
        
        for(e of grids) {
            const mob = e['grid'].querySelector('div')

            if (mob.dataset.effect!=null) {
                switch(mob.dataset.effect) {
                    case this.PHANTOM: {
                        this.phantomEffect(mob)
                        break
                    }
                }
            }
        }
    }
}
const MOBS = [
    {
        NAME: 'Demon',
        IMG: 'https://media.tenor.com/gFvc0poigIYAAAAM/demon-red.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: null,
        LEVEL: 0,
        RAFFLE: {MIN: 0, MAX: 100}
    },
    {
        NAME: 'Bat',
        IMG: 'https://i.gifer.com/origin/ce/ce1c245954005ac923e3cea5f70518df_w200.gif',
        COLISIONS: {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true},
        EFFECT: MOB_EFFECTS.PHANTOM,
        LEVEL: 10,
        RAFFLE: {MIN: 20, MAX: 30}
    },
]

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
        this.BULLET = 150
        this.EXTRA_DAMAGE = 50
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
MIN_DAMAGE = 20
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
        if (POINTS > PRICES.BULLET) {
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
        if (POINTS > PRICES.EXTRA_DAMAGE) {
            setLogTerminal("Comprou o item Extra Damage por " + PRICES.EXTRA_DAMAGE + " pontos")

            POINTS -= PRICES.EXTRA_DAMAGE
            EXTRA_DAMAGE++

            PRICES.extraDamageUpdate()
            setExtraDamage(EXTRA_DAMAGE)
            setPoints(POINTS)
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
        bg1 = '#404040'
        bg2 = '#343434'
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

    const showBullet = setInterval((_) => {
        if (CURRENT_BULLETS>=TOTAL_BULLETS) return clearInterval(showBullet)
        
        createBullet(x,y)
        CURRENT_BULLETS++
    }, 200)
}

const SOUNDS = {
    THEME: 'theme',
    PERFECT: 'perfect'
}

const playSound = (sound, volume = 1.0, repeat = false) => {
    const audio = new Audio()
    audio.src = `./audio/${sound}.mp3`
    audio.volume = volume
    audio.loop = repeat
    audio.play()
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

const shake = (pos) => {
    const mob = pos['grid']

    mob.querySelector('div').style.animation = 'shake 0.5s'
    setTimeout(()=>{
        if (mob.querySelector('div')!=null) mob.querySelector('div').style.animation = ''
    }, 300)

    
    const life = mob.querySelector('div#life')
    const mob_personal_life = pos['mob'].life
    
    // calc damage basead in MOB_LIFE dafault
    const damage = ((MIN_DAMAGE + EXTRA_DAMAGE)/100 * MOB_LIFE)
    
    const current_life =  (parseInt(life.style.width) / 100) * mob_personal_life
    const new_life = (current_life-damage)
    const new_life_percent = (new_life*100) / mob_personal_life
    
    life.style.width = new_life_percent + '%'

    if (new_life<=0) {
        mob.innerHTML = ''
        perfect()
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
    }
    if (bullet_rect.right >= arena_rect.right) {
        const calc = calculateRepositionOnColisionArena(COLISION_SIDES.RIGHT)
        setBulletPosition(bullet, calc)
        incrementColision(bullet)
        bullet.dataset.directionX *= -1
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
    }

    // colision on bottom arena
    if (bullet_rect.bottom >= arena_rect.bottom + shot_position.offsetHeight) {
        const total_bullets_display = getTotalDisplayBullets()

        bullet.remove()
        
        if (total_bullets_display<=1 && CURRENT_BULLETS>=TOTAL_BULLETS) {
            
            setLogTerminal("Disparo foi finalizado")
            
            removeAllBullets()
            ON=false
            clearInterval(INTERVAL)
            INTERVAL=null
            LEVEL++
            CURRENT_BULLETS=0
            levelUpdate(LEVEL)
            ARENA.style.filter = 'none'

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
    fitMobs = MOBS.filter(m => (+r >= +m.RAFFLE.MIN) && (+r <= +m.RAFFLE.MAX) && (+LEVEL >= m.LEVEL))
    r = Math.floor(Math.random()*fitMobs.length)
    return MOBS[r]
}

const dropCreature = () => {
    const pos = Math.floor(Math.random() * ARENA_GRIDS.length)
    const mob = document.createElement('div')
    const life = document.createElement('div')
    const grid_rect = ARENA_GRIDS[pos]['grid'].getBoundingClientRect()

    if (ARENA_GRIDS[pos]['grid'].querySelector('div')!=null) {
        total = ARENA_GRIDS.filter(e => e['grid'].querySelector('div')).length
        if (total>=ARENA_GRIDS.length) return false
        return dropCreature()
    }

    mob_raffle = mobRaffle()

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

const sequenceDropCreature = (sequence) => {
    count=0
    while(count < sequence) {
        dropCreature()
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

const drawLine = () => {
    ARENA.addEventListener('mousemove', (e) => {
        if (ON) return false

        const arena_rect = ARENA.getBoundingClientRect()
        const x1 = shot_position_rect.left + (shot_position_rect.width/2) - arena_rect.x
        const y1 = shot_position_rect.top + (shot_position_rect.height/2) - arena_rect.y
        const x2 = e.pageX-arena_rect.x
        const y2 = e.pageY-arena_rect.y

        const length = Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2 - y1), 2))
        

        const cx = ((x1 + x2) / 2)
        const cy = ((y1 + y2) / 2)
        
        const bx = (shot_position_rect.x + (shot_position_rect.width/2) - (BULLET_SIZE/2) - arena_rect.x)
        const by =  (shot_position_rect.y - arena_rect.y)

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
    })
}

const setBulletPosition = (b, x=null, y=null) => {
    if (x!=null) b.style.left = x + 'px'
    if (y!=null) b.style.top = y + 'px'
}

const shoot = () => {
    ARENA.addEventListener('click', (e) => {
        
        if (!ON) {
            security()

            let x = e.x - shot_position_rect.x - (shot_position_rect.width/2) - (BULLET_SIZE/2)
            let y = e.y - shot_position_rect.y - (shot_position_rect.height/2) - (BULLET_SIZE/2)

            let l = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

            x = (x / l)
            y = (y / l)

            const bx = (shot_position_rect.x + (shot_position_rect.width/2) - (BULLET_SIZE/2) - arena_rect.x)
            const by =  (shot_position_rect.y - arena_rect.y)
            
            renderBullet(bx, by)

            BULLET_DISPLACEMENT_X = (x * VELOCITY)
            BULLET_DISPLACEMENT_Y = (y * VELOCITY)

            INTERVAL = setInterval(shiftBullet)

            ON = true

            LINE.remove()

            setLogTerminal("Disparo realizado")
        }
    })
}

const MOB_DROP_AMOUNTS = {
    LEVEL_0: {min:0, max:30, drops: 2},
    LEVEL_30: {min:30, max:50, drops: 3},
    LEVEL_50: {min: 50, max:100,  drops: 4},
    LEVEL_100: {min: 100, max:999999, drops: 5},
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

        }else if (LEVEL>=this.LEVEL_50.min && LEVEL<=this.LEVEL_50.max) {
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

const levelUpdate = () => {
    info = document.querySelector('div.info')
    info.querySelector('div.level').innerHTML = 'Level: ' + LEVEL
    
    setLogTerminal("Novos bugs entraram na arena")
    
    MOB_DROP_AMOUNTS.changeDrops()
    MOB_EFFECTS.applyEffect()

    setExtraDamage()
    gameOver()
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
    MOB_LIFE_INCREMENT=10
    MOB_HUE_ROTATE="0.0"
    setPoints(POINTS)
    createArenaGrid()
    levelUpdate()
    setExtraDamage(0)
    setTotalBullets(1)
    PRICES.reset()
    MOB_DROP_AMOUNTS.reset()
}

const gameOver = () => {
    total = ARENA_GRIDS.filter(e => e['grid'].querySelector('div')).length
    
    if (total>=ARENA_GRIDS.length) {
        setLogTerminal(`O jogo acabou, você chegou ao Level: ${LEVEL}`, true)
        res = alert('Game Over')
        if (res==undefined) {
            reset()
        }
    }
}

const setLogTerminal = (log, error=false) => {
    const ul = document.querySelector('div.terminal ul')
    const li = document.createElement('li')
    li.innerText = 'home/DevsAndBugs> ' + log
    if (error) li.classList.add('log-error')
    ul.append(li)
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
        THEME_ON=playSound(SOUNDS.THEME, 0.2, true)
        setLogTerminal('Música do jogo iniciada, aproveite.', true);
    })
}

document.addEventListener("DOMContentLoaded", (_) => {
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