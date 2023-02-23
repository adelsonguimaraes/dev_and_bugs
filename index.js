VELOCITY = 1.5
BULLET_DIR_X = 1 
BULLET_DIR_Y = -1
BULLET_POS_X = 0
BULLET_POS_Y = 1
GRID_SIZE = 60
MOB_SIZE = 40
BULLET_SIZE = 15
BULLET = null
ARENA = null
ARENA_ROWS = 6
ARENA_COLUMNS = 8
ARENA_GRIDS = []
SAFE_BOUND = 2
MIN_DAMAGE = 0.01
INTERVAL=null
LINE=null
ANGLE=null
ON = false


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
        li.style.padding = '0'
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
    BULLET.style.backgroundColor = 'orange'
    BULLET.style.position = 'absolute'
    BULLET.style.left = BULLET_POS_X + 'px'
    BULLET.style.top = BULLET_POS_Y + 'px'
    
    ARENA.append(BULLET)
}

function shake(pos) {
    pos['grid'].style.animation = 'shake 0.5s'
    setTimeout(()=>{
        pos['grid'].style.animation = ''
    }, 300)

    const life = pos['grid'].querySelector('div#life')
    const life_rect = life.getBoundingClientRect()
    const damage = (life_rect.width * MIN_DAMAGE)
    const new_life = (life_rect.width - damage)
    life.style.width = new_life + 'px'

    if (new_life<=0) pos['grid'].innerHTML = ''
}

function colisionMobY() {
    const bullet_rect = BULLET.getBoundingClientRect()
    
    for(i of ARENA_GRIDS) {
        const mob = i['grid'].querySelector('div')
        
        if (mob!=null) {
            const mob_rect = i['grid'].getBoundingClientRect()

            // in top
            if (bullet_rect.bottom >= mob_rect.top && bullet_rect.top <= mob_rect.top
                && bullet_rect.left+SAFE_BOUND <= mob_rect.right && bullet_rect.right-SAFE_BOUND >= mob_rect.left) {
                BULLET_DIR_Y *= -1
                shake(i)
                console.log('colidiu em cima');
            }

            // in bottom
            if (bullet_rect.top <= mob_rect.bottom && bullet_rect.bottom >= mob_rect.bottom
                && bullet_rect.left+SAFE_BOUND <= mob_rect.right && bullet_rect.right-SAFE_BOUND >= mob_rect.left) {
                BULLET_DIR_Y *= -1
                shake(i)
                console.log('colidiu em baixo');
            }
            
        }
    }
}


function colisionMobX() {
    const bullet_rect = BULLET.getBoundingClientRect()
    
    for(i of ARENA_GRIDS) {
        const mob = i['grid'].querySelector('div')
        if (mob!=null) {
            const mob_rect = i['grid'].getBoundingClientRect()

            // in left
            if (bullet_rect.right >= mob_rect.left && bullet_rect.left <= mob_rect.left
                && bullet_rect.top+SAFE_BOUND <= mob_rect.bottom && bullet_rect.bottom-SAFE_BOUND >= mob_rect.top) {
                BULLET_DIR_X *= -1
                shake(i)
                console.log('colidiu na esquerda');
            }

            // in right
            if (bullet_rect.left <= mob_rect.right && bullet_rect.right >= mob_rect.right
                && bullet_rect.top+SAFE_BOUND <= mob_rect.bottom && bullet_rect.bottom-SAFE_BOUND >= mob_rect.top) {
                BULLET_DIR_X *= -1
                shake(i)
                console.log('colidiu na direita');
            }
        }
    }
}

function moveX() {
    let bullet_rect = BULLET.getBoundingClientRect()
    let arena_rect = ARENA.getBoundingClientRect()
    
    // colision on left or right side arena
    if (bullet_rect.left <= arena_rect.left || bullet_rect.right >= arena_rect.right) {
        BULLET_DIR_X *= -1
    }

    // calc deslocation if BULLET_POS_X > or < 0
    if (BULLET_POS_X > 0 || BULLET_POS_X < 0) {
        BULLET_POS_X += (VELOCITY*BULLET_DIR_X)
        BULLET.style.left = BULLET_POS_X+'px'
    }
}

function moveY() {
    let bullet_rect = BULLET.getBoundingClientRect()
    let arena_rect = ARENA.getBoundingClientRect()

    // colision on top arena
    if (bullet_rect.top <= arena_rect.top) {
        BULLET_DIR_Y *= -1
    }

    // colision on bottom arena
    if (bullet_rect.bottom >= arena_rect.bottom) {
        ON=false
        clearInterval(INTERVAL)
        INTERVAL=null
        BULLET.remove()
        BULLET_DIR_Y *= -1
    }

    BULLET_POS_Y += (VELOCITY*BULLET_DIR_Y)

    BULLET.style.top = BULLET_POS_Y+'px'
}

function dropCreature() {
    const pos = Math.floor(Math.random() * ARENA_GRIDS.length)
    // pos = 13
    const mob = document.createElement('div')
    const life = document.createElement('div')
    const grid_rect = ARENA_GRIDS[pos]['grid'].getBoundingClientRect()

    if (ARENA_GRIDS[pos]['grid'].querySelector('div')!=null){
        return dropCreature()
    }

    mob.style.left = grid_rect.left + 'px'
    mob.style.width = MOB_SIZE + 'px'
    mob.style.height = MOB_SIZE + 'px'
    mob.style.backgroundColor = 'yellow'
    mob.style.backgroundSize = 'cover'
    mob.style.backgroundImage = 'url(https://media.tenor.com/gFvc0poigIYAAAAM/demon-red.gif)'
    
    life.style.width = MOB_SIZE + 'px'
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
        const shot_position = document.querySelector('.shot--position')
        const shot_position_rect = shot_position.getBoundingClientRect()
        const x1 = shot_position_rect.left
        const y1 = shot_position_rect.top
        const x2 = e.pageX
        const y2 = e.pageY

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

        if (document.querySelector('div#line')==null) document.body.append(LINE)
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
            const arena_rect = ARENA.getBoundingClientRect()
            const shot_position = document.querySelector('.shot--position')
            const shot_position_rect = shot_position.getBoundingClientRect()

            // shooting direction considering the center
            BULLET_DIR_X = (e.x > shot_position_rect.x) ? 1 : -1
            
            renderBullet()

            setBulletPosition(e.pageX - arena_rect.left, e.pageY - arena_rect.top)
            INTERVAL = setInterval(()=>{
                moveX()
                moveY()
                colisionMobX()
                colisionMobY()
            })

            ON = true
        }
    })
}

document.addEventListener("DOMContentLoaded", (_) => {
    ARENA = document.querySelector('.arena')
    createArenaGrid()
    
    drawLine()
    shoot()

    dropCreature()
    dropCreature()
    dropCreature()
    dropCreature()
    dropCreature()
    dropCreature()
    dropCreature()

})