const LIMIT_SHOOTING = 5

class Room{
    constructor(level = 0, timer = 0, bullets = 0, mode = null, playing=false, current_player=null, users = [], bugs = []) {
        this.id = Date.now()
        this.level = level
        this.timer = timer
        this.bullets = bullets
        this.mode = mode
        this.playing = playing
        this.current_player = current_player
        this.users = users
        this.bugs = bugs
        this.current_shooting = 1
    }

    setData(data) {
        this.id = data.id
        this.level = data.level
        this.timer = data.timer
        this.bullets = data.bullets
        this.mode = data.mode
        this.playing = data.playing
        this.current_player = data.current_player
        this.users = data.users
        this.bugs = data.bugs
        this.current_shooting = 1
    }
    
    setLevel(level) {
        this.level = level
    }

    getLevel() {
        return this.level
    }

    setTimer(timer) {
        this.timer = timer
    }

    getTimer() {
        this.timer
    }

    setBullets(bullets) {
        this.bullets = bullets
    }

    getBullets() {
        return this.bullets
    }

    setMode(mode) {
        this.mode = mode
    }

    setPlaying(playing) {
        this.playing = playing
    }

    setCurrentPlayer(current_player) {
        this.current_player = current_player
    }

    toggleCurrentPlayer() {
        this.current_player = (this.current_player==null || this.current_player==1) ? 0 : 1 
    }

    setUsers(users) {
        this.users = users
    }

    getUsers() {
        return this.users
    }

    setBugs(bugs) {
        this.bugs = bugs
    }

    getRoomBySocketId(socketId) {
        if (this.users.find(e => e.socketId == socketId)) return this
    }

    incrementCurrentShooting() {
        if (this.current_shooting >= LIMIT_SHOOTING) {
            this.current_shooting=1
            return this.toggleCurrentPlayer()
        }
        this.current_shooting++
    }
}

module.exports = Room