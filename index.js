VELOCITY = 2
BULLET_DIR_X = 1 
BULLET_DIR_Y = 1
BULLET_POS_X = 0
BULLET_POS_Y = 1
GRID_SIZE = 50
GRID_PADDING = 5
MOB_SIZE = 40
MOB_LIFE=1000
BULLET_SIZE = 15
BULLET = null
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

function renderBullet() {

    BULLET = document.createElement('div')
    BULLET.style.width = BULLET_SIZE + 'px'
    BULLET.style.height = BULLET_SIZE + 'px'
    BULLET.style.borderRadius = '50px'
    BULLET.style.backgroundColor = 'chartreuse'
    BULLET.style.position = 'absolute'
    BULLET.style.left = BULLET_POS_X + 'px'
    BULLET.style.top = BULLET_POS_Y + 'px'
    BULLET.style.display = 'none'
    
    ARENA.append(BULLET)
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

function mobCollisionY() {
    let bullet_rect = BULLET.getBoundingClientRect()

    for(i of ARENA_GRIDS) {
        const mob = i['grid'].querySelector('div')
        
        if (mob!=null) {
            const mob_rect = i['grid'].getBoundingClientRect()

            // in top
            if (bullet_rect.bottom >= mob_rect.top && bullet_rect.top <= mob_rect.top
                && bullet_rect.left+SAFE_BOUND <= mob_rect.right && bullet_rect.right-SAFE_BOUND >= mob_rect.left) {
                
                BULLET_DIR_Y *= -1
                // BULLET_POS_Y = calculateRepositionOnColisionMob(COLISION_SIDES.TOP, i['grid'])

                shake(i)
                console.log('colidiu em cima');
            }

            // in bottom
            if (bullet_rect.top <= mob_rect.bottom && bullet_rect.bottom >= mob_rect.bottom
                && bullet_rect.left+SAFE_BOUND <= mob_rect.right && bullet_rect.right-SAFE_BOUND >= mob_rect.left) {

                BULLET_DIR_Y *= -1
                // BULLET_POS_Y = calculateRepositionOnColisionMob(COLISION_SIDES.BOTTOM, i['grid'])
                
                shake(i)
                console.log('colidiu em baixo');
            }
            
        }
    }
}

function mobCollisionX() {
    let bullet_rect = BULLET.getBoundingClientRect()
    
    for(i of ARENA_GRIDS) {
        const mob = i['grid'].querySelector('div')
        if (mob!=null) {
            const mob_rect = i['grid'].getBoundingClientRect()

            // in left
            if (bullet_rect.right >= mob_rect.left && bullet_rect.left <= mob_rect.left
                && bullet_rect.top+SAFE_BOUND <= mob_rect.bottom && bullet_rect.bottom-SAFE_BOUND >= mob_rect.top) {
                
                BULLET_DIR_X *= -1
                // BULLET_POS_X = calculateRepositionOnColisionMob(COLISION_SIDES.LEFT, i['grid'])
                
                shake(i)
                console.log('colidiu na esquerda');
            }

            // in right
            if (bullet_rect.left <= mob_rect.right && bullet_rect.right >= mob_rect.right
                && bullet_rect.top+SAFE_BOUND <= mob_rect.bottom && bullet_rect.bottom-SAFE_BOUND >= mob_rect.top) {
                
                BULLET_DIR_X *= -1
                
                // BULLET_POS_X = calculateRepositionOnColisionMob(COLISION_SIDES.RIGHT, i['grid'])
                
                shake(i)
                console.log('colidiu na direita');
            }
        }
    }
}

function shiftBullet() {
    BULLET.style.left = (parseFloat(BULLET.style.left) + (BULLET_POS_X*BULLET_DIR_X)) + 'px'
    BULLET.style.top = (parseFloat(BULLET.style.top) + BULLET_POS_Y*BULLET_DIR_Y) + 'px'
}

function arenaCollisionX() {
    let bullet_rect = BULLET.getBoundingClientRect()
    let arena_rect = ARENA.getBoundingClientRect()
    
    // colision on left or right side arena
    if (bullet_rect.left <= arena_rect.left) {
        BULLET_DIR_X *= -1
        console.log('bateu arena equerda');
    }
    if (bullet_rect.right >= arena_rect.right) {
        console.log('bateu arena direita');
        BULLET_DIR_X *= -1
    }
}

function arenaCollisionY() {
    let bullet_rect = BULLET.getBoundingClientRect()
    let arena_rect = ARENA.getBoundingClientRect()

    // colision on top arena
    if (bullet_rect.top <= arena_rect.top) {
        BULLET_DIR_Y *= -1
        console.log('bateu arena topo');
    }

    // colision on bottom arena
    if (bullet_rect.bottom >= arena_rect.bottom + shot_position.offsetHeight) {
        ON=false
        clearInterval(INTERVAL)
        INTERVAL=null
        BULLET.remove()
        BULLET_DIR_Y = 1
        BULLET_DIR_X = 1
        renderBullet()
        LEVEL++

        levelUpdate(LEVEL)

        console.log('bolinha destruida');
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
        
        ARENA.style.cursor = 'none'

        ARENA.append(LINE)
    })
}


function setBulletPosition(x, y) {
    BULLET_POS_X = x
    BULLET_POS_Y = y
    BULLET.style.left = BULLET_POS_X + 'px'
    BULLET.style.top = BULLET_POS_Y + 'px'
}

function shoot() {
    ARENA.addEventListener('click', (e) => {
        
        if (!ON) {

            let x = e.x - shot_position_rect.x
            let y = e.y - shot_position_rect.y

            let l = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

            x = (x / l)
            y = (y / l)

            setBulletPosition(
                (shot_position_rect.x + shot_position_rect.width/2 - bullet_rect.width/2 - arena_rect.x),
                (shot_position_rect.y - arena_rect.y)
            )

            BULLET_POS_X = (x * VELOCITY)
            BULLET_POS_Y = (y * VELOCITY)

            BULLET.style.display = 'block'

            INTERVAL = setInterval(()=>{
                shiftBullet()
                arenaCollisionX()
                arenaCollisionY()
                mobCollisionX()
                mobCollisionY()
            })

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
    BULLET_DIR_X = BULLET_DIR_Y = 1
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
    
    
    renderBullet()
    bullet_rect = BULLET.getBoundingClientRect()
    
    createArenaGrid()
    levelUpdate()
    
    drawLine()
    shoot()
})