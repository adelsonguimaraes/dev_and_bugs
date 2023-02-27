GRID_SIZE = 50
GRID_PADDING = 5
MOB_SIZE = 40
MOB_LIFE=1000
MOB_LIFE_INCREMENT=10
MOB_HUE_ROTATE="0.0"


VELOCITY = 2

const VELOCITY_MODES = {
    NORMAL: null,
    MODARATE: {ACTIVATE: 15, ACELERATION: 2, COLOR: '#ffa000', DAMAGE: 2, POINT: 2},
    HIGH: {ACTIVATE: 30, ACELERATION: 3, COLOR: '#e22b2b', DAMAGE: 3, POINT: 3},
    INSANE: {ACTIVATE: 50, ACELERATION: 5, COLOR: 'white', DAMAGE: 5, POINT: 4},
}

const PRICES = {
    BULLET: 150,
    EXTRA_DAMAGE: 50,
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


SAFE_BOUND = 2
MIN_DAMAGE = 50
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

shop = () => {
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

setExtraDamage = (ex_damage=null) => {
    if (ex_damage!=null) EXTRA_DAMAGE = ex_damage
    const ed = document.querySelector('div.equipment div.extra-damage')
    ed.innerHTML = `Damage: ${Math.round((MIN_DAMAGE + EXTRA_DAMAGE)/100 * MOB_LIFE)}<br>Extra: ${EXTRA_DAMAGE}%`
}

const setTotalBullets = (total) => {
    const total_bullet = document.querySelector('div.equipment div.bullets')
    TOTAL_BULLETS=total
    total_bullet.innerHTML = 'Bullets: ' + TOTAL_BULLETS
}

incrementPoints = (bullet) => {
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

createArenaGrid = () => {
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

createBullet = (x,y) => {
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

setBulletColor = (bullet, color) => bullet.style.backgroundColor = color
incrementColision = (bullet) => bullet.dataset.totalColisions++

renderBullet = (x, y) => {
    CURRENT_BULLETS=0
    

    createBullet(x,y)
    CURRENT_BULLETS++

    const showBullet = setInterval((_) => {
        if (CURRENT_BULLETS>=TOTAL_BULLETS) return clearInterval(showBullet)
        
        createBullet(x,y)
        CURRENT_BULLETS++
    }, 200)
}

function shake(pos) {
    pos['grid'].style.animation = 'shake 0.5s'
    setTimeout(()=>{
        pos['grid'].style.animation = ''
    }, 300)


    const life = pos['grid'].querySelector('div#life')
    const mob_personal_life = pos['mob'].life
    
    // calc damage basead in MOB_LIFE dafault
    const damage = ((MIN_DAMAGE + EXTRA_DAMAGE)/100 * MOB_LIFE)
    
    const current_life =  (parseInt(life.style.width) / 100) * mob_personal_life
    const new_life = (current_life-damage)
    const new_life_percent = (new_life*100) / mob_personal_life
    
    life.style.width = new_life_percent + '%'

    if (new_life<=0) pos['grid'].innerHTML = ''
}

function calculateRepositionOnColisionMob(side, mob) {
    const mob_rect = mob.getBoundingClientRect()
    
    switch(side) {
        case COLISION_SIDES.TOP: {
            const calculation = (mob_rect.y - arena_rect.top - BULLET_SIZE)
            return calculation
        }
        case COLISION_SIDES.BOTTOM: {
            const calculation = (mob_rect.y + mob_rect.height) - arena_rect.top + BULLET_SIZE
            return calculation
        }
        case COLISION_SIDES.LEFT: {
            const calculation = (mob_rect.x - arena_rect.left - BULLET_SIZE)
            return calculation
        }
        case COLISION_SIDES.RIGHT: {
            const calculation = (mob_rect.x + mob_rect.width) - arena_rect.left + BULLET_SIZE
            return calculation
        }
    }
}

function mobCollisionY(bullet) {
    let bullet_rect = bullet.getBoundingClientRect()

    for(i of ARENA_GRIDS) {
        const mob = i['grid'].querySelector('div')
        
        if (mob!=null) {
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

function mobCollisionX(bullet) {
    let bullet_rect = bullet.getBoundingClientRect()
    
    for(i of ARENA_GRIDS) {
        const mob = i['grid'].querySelector('div')
        if (mob!=null) {
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

function shiftBullet() {
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
        arenaCollisionY(b, bullets.length)
        mobCollisionX(b)
        mobCollisionY(b)
    }
}

function arenaCollisionX(bullet) {
    let bullet_rect = bullet.getBoundingClientRect()
    let arena_rect = ARENA.getBoundingClientRect()
    
    // colision on left or right side arena
    if (bullet_rect.left <= arena_rect.left) {
        bullet.dataset.directionX *= -1
        incrementColision(bullet)        
    }
    if (bullet_rect.right >= arena_rect.right) {
        incrementColision(bullet)
        bullet.dataset.directionX *= -1
    }
}

function arenaCollisionY(bullet, last) {
    let bullet_rect = bullet.getBoundingClientRect()
    let arena_rect = ARENA.getBoundingClientRect()

    // colision on top arena
    if (bullet_rect.top <= arena_rect.top) {
        bullet.dataset.directionY *= -1
        incrementColision(bullet)
    }

    // colision on bottom arena
    if (bullet_rect.bottom >= arena_rect.bottom + shot_position.offsetHeight) {
        
        bullet.remove()

        if (last<=1 && CURRENT_BULLETS>=TOTAL_BULLETS) {
            
            setLogTerminal("Disparo foi finalizado")

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

incrementCreatureColorFilter = () => {

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

function dropCreature() {
    const pos = Math.floor(Math.random() * ARENA_GRIDS.length)
    const mob = document.createElement('div')
    const life = document.createElement('div')
    const grid_rect = ARENA_GRIDS[pos]['grid'].getBoundingClientRect()

    if (ARENA_GRIDS[pos]['grid'].querySelector('div')!=null) {
        total = ARENA_GRIDS.filter(e => e['grid'].querySelector('div')).length
        if (total>=ARENA_GRIDS.length) return false
        return dropCreature()
    }

    mob.style.left = grid_rect.left + 'px'
    mob.style.width = MOB_SIZE + 'px'
    mob.style.height = MOB_SIZE + 'px'
    mob.style.backgroundColor = 'yellow'
    mob.style.backgroundSize = 'cover'
    mob.style.backgroundImage = 'url(https://media.tenor.com/gFvc0poigIYAAAAM/demon-red.gif)'
    
    life.style.width = 100 + '%'
    life.style.height = 6 + 'px'
    life.style.backgroundColor = 'red'
    life.id = 'life'

    let life_mob = MOB_LIFE

    if (LEVEL>1) {
        life_mob = (MOB_LIFE + (MOB_LIFE*MOB_LIFE_INCREMENT/100))
        incrementCreatureColorFilter()
    }

    mob.style.filter = `hue-rotate(${MOB_HUE_ROTATE}rad)`

    ARENA_GRIDS[pos]['mob'] = {'life': life_mob}
    ARENA_GRIDS[pos]['grid'].style.display = 'flex'
    ARENA_GRIDS[pos]['grid'].style.flexDirection = 'column'
    ARENA_GRIDS[pos]['grid'].append(mob)
    ARENA_GRIDS[pos]['grid'].append(life)
}

function drawLine() {
    ARENA.addEventListener('mousemove', (e) => {

        if (ON) return false

        const arena_rect = ARENA.getBoundingClientRect()
        const x1 = shot_position_rect.left-arena_rect.left
        const y1 = shot_position_rect.top-arena_rect.top
        const x2 = e.pageX-arena_rect.left
        const y2 = e.pageY-arena_rect.top

        const length = Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2 - y1), 2))
        const cx = ((x1 + x2) / 2)
        const cy = ((y1 + y2) / 2)

        ANGLE = Math.atan2((y1-y2), (x1-x2))*(180/Math.PI)

        LINE = document.querySelector('div#line') ?? document.createElement('div')
        LINE.id = 'line'
        LINE.style.color = 'green'
        LINE.style.height = '5px'
        LINE.style.backgroundColor = 'green'
        LINE.style.position = 'absolute'
        LINE.style.top = cy -  (LINE.offsetHeight/2) + (shot_position_rect.height/2) + 'px'
        LINE.style.left = cx - (LINE.offsetWidth/2) + (shot_position_rect.width/2) + 'px'
        LINE.style.width = length + 'px'
        LINE.style.transform = `rotate(${ANGLE}deg)`
        
        ARENA.append(LINE)
    })
}

function setBulletPosition(b, x=null, y=null) {
    if (x!=null) b.style.left = x + 'px'
    if (y!=null) b.style.top = y + 'px'
}

function shoot() {
    ARENA.addEventListener('click', (e) => {
        
        if (!ON) {

            let x = e.x - shot_position_rect.x
            let y = e.y - shot_position_rect.y

            let l = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

            x = (x / l)
            y = (y / l)

            const bx = (shot_position_rect.x + shot_position_rect.width/2 - BULLET_SIZE/2 - arena_rect.x)
            const by =   (shot_position_rect.y - arena_rect.y)
            
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

function levelUpdate() {
    info = document.querySelector('div.info')
    info.querySelector('div.level').innerHTML = 'Level: ' + LEVEL
    
    setLogTerminal("Novos bugs entraram na arena")
    dropCreature()
    dropCreature()

    setExtraDamage()
    gameOver()
}

function reset() {
    LEVEL = 1
    clearInterval(INTERVAL)
    INTERVAL = null
    MIN_DAMAGE = 50
    ARENA_GRIDS = []
    ON = false
    ARENA.innerHTML = ''
    BULLET_DIR_X = 1
    BULLET_DIR_Y = 1
    POINTS=0
    setPoints(POINTS)
    createArenaGrid()
    levelUpdate()
    setExtraDamage(0)
    setTotalBullets(1)
}

function gameOver() {
    total = ARENA_GRIDS.filter(e => e['grid'].querySelector('div')).length
    
    console.log(total, ARENA_GRIDS.length);

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

document.addEventListener("DOMContentLoaded", (_) => {
    ARENA = document.querySelector('.arena')
    arena_rect = ARENA.getBoundingClientRect()
    shot_position = document.querySelector('.shot--position')
    shot_position_rect = shot_position.getBoundingClientRect()
    
    setLogTerminal("Novo jogo iniciado")
    
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