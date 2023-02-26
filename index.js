GRID_SIZE = 50
GRID_PADDING = 5
MOB_SIZE = 40
MOB_LIFE=1000


VELOCITY = 2
VELOCITY_MODERATE = 2
VELOCITY_HIGH = 3
VELOCITY_INSANE = 5


MODERATE_VELOCITY_COLOR = '#ffa000'
HIGH_VELOCITY_COLOR =  '#e22b2b'


ACTIVE_MODERATE_VELOCITY = 15
ACTIVE_HIGH_VELOCITY = 30
ACTIVE_INSANE_VELOCITY = 50


BULLET_DIR_X = 1 
BULLET_DIR_Y = 1
BULLET_SIZE = 15
BULLET_DISPLACEMENT_X = 0
BULLET_DISPLACEMENT_Y = 1
TOTAL_BULLETS = 3
CURRENT_BULLETS = 0


ARENA = null
ARENA_ROWS = 6
ARENA_COLUMNS = 8
ARENA_GRIDS = []


SAFE_BOUND = 2
MIN_DAMAGE = 50

INTERVAL=null
LINE=null
ANGLE=null

LEVEL=1
ON = false

COLISION_SIDES = {
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right'
}

function createArenaGrid() {
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
        createBullet(x,y)
        CURRENT_BULLETS++
        if (CURRENT_BULLETS>=TOTAL_BULLETS) clearInterval(showBullet)
    }, 200)
}

function shake(pos) {
    pos['grid'].style.animation = 'shake 0.5s'
    setTimeout(()=>{
        pos['grid'].style.animation = ''
    }, 300)


    const life = pos['grid'].querySelector('div#life')

    const current_life =  (parseInt(life.style.width.replace('px', '')) / 100) * MOB_LIFE

    const damage = (MIN_DAMAGE/100 * MOB_LIFE)
    const new_life = (current_life-damage)
    const new_life_percent = (new_life*100) / MOB_LIFE
    
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
                
                shake(i)
            }

            // in bottom
            if (bullet_rect.top <= mob_rect.bottom && bullet_rect.bottom >= mob_rect.bottom
                && bullet_rect.left+SAFE_BOUND <= mob_rect.right && bullet_rect.right-SAFE_BOUND >= mob_rect.left) {

                bullet.dataset.directionY *= -1
                const calc = calculateRepositionOnColisionMob(COLISION_SIDES.BOTTOM, i['grid'])
                setBulletPosition(bullet, null, calc)
                incrementColision(bullet)
                
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
                
                shake(i)
            }

            // in right
            if (bullet_rect.left <= mob_rect.right && bullet_rect.right >= mob_rect.right
                && bullet_rect.top+SAFE_BOUND <= mob_rect.bottom && bullet_rect.bottom-SAFE_BOUND >= mob_rect.top) {
                
                bullet.dataset.directionX *= -1
                
                const calc = calculateRepositionOnColisionMob(COLISION_SIDES.RIGHT, i['grid'])
                setBulletPosition(bullet, calc)
                incrementColision(bullet)
                
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
        if (b.dataset.totalColisions>=ACTIVE_MODERATE_VELOCITY) {
            acelation = VELOCITY_MODERATE
            setBulletColor(b, MODERATE_VELOCITY_COLOR)
        }
        if (b.dataset.totalColisions>=ACTIVE_HIGH_VELOCITY) {
            acelation = VELOCITY_HIGH
            setBulletColor(b, HIGH_VELOCITY_COLOR)
        }
        if (b.dataset.totalColisions>=ACTIVE_INSANE_VELOCITY) {
            acelation = VELOCITY_INSANE
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

function dropCreature() {
    const pos = Math.floor(Math.random() * ARENA_GRIDS.length)
    // pos = 13
    const mob = document.createElement('div')
    const life = document.createElement('div')
    const grid_rect = ARENA_GRIDS[pos]['grid'].getBoundingClientRect()

    if (ARENA_GRIDS[pos]['grid'].querySelector('div')!=null){
        total = ARENA_GRIDS.filter(e => e.mob != null).length
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

    ARENA_GRIDS[pos]['mob'] = {'health': 100}
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
        }
    })
}

function levelUpdate() {
    info = document.querySelector('div.info')
    info.querySelector('div.level').innerHTML = 'Level: ' + LEVEL
    MIN_DAMAGE -= (MIN_DAMAGE*0.1)

    dropCreature()
    dropCreature()

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
    createArenaGrid()
    levelUpdate()
}

function gameOver() {
    total = ARENA_GRIDS.filter(e => e.mob != null).length
    
    if (total>=ARENA_GRIDS.length) {
        res = alert('Game Over')
        if (res==undefined) {
            reset()
        }
    }
}

document.addEventListener("DOMContentLoaded", (_) => {
    ARENA = document.querySelector('.arena')
    arena_rect = ARENA.getBoundingClientRect()
    shot_position = document.querySelector('.shot--position')
    shot_position_rect = shot_position.getBoundingClientRect()
    
    
    createArenaGrid()
    levelUpdate()
    
    drawLine()
    shoot()
})