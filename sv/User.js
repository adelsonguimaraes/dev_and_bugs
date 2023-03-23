class User{
    constructor(socketId, name, ability, points=0) {
        this.socketId = socketId
        this.name = name
        this.ability = ability
        this.points = points
    }

    setPoints(points) {
        this.points = points
    }
}

module.exports = User