const Room = require('./Room.js')
const User = require('./User.js')
const Bug = require('./Bug.js')

const LIMIT_SHOOT = 5

class Controller {
    constructor() {
        this.rooms = []
    }

    addRoom(socketId, name, mode, bugs) {
        const users = [new User(socketId, name)]

        const room = new Room()
        const bug = new Bug()
        room.setUsers(users)
        room.setMode(mode)
        room.setBugs(bug.setDataList(bugs))
        this.rooms.push(room)

        return room
    }

    getRoom(idRoom) {
        return this.rooms.find(e => e.id == idRoom)
    }

    getRoomBySocketId (socketId) {
        return this.rooms.find(e => e.getRoomBySocketId(socketId))
    }

    setRoomData(old_data, new_data) {
        const index = this.rooms.indexOf(old_data)
        this.rooms[index] = new_data
    }

    addUserInRoom(socketId, name, partyId) {
        const exists = this.roomExists(partyId)
        let data = null
        let result = false

        if (exists.result) {
            const user = new User(socketId, name)
            exists.data.users.push(user)
            exists.data.setPlaying(true)
            exists.data.toggleCurrentPlayer()
            data = exists.data
            result = true
        }
        
        return {'result': result, 'data': data}
    }

    roomExists(idRoom) {
        const room = this.getRoom(idRoom.toString().replace('#party_', ''))
        const index = this
        return {'result': (room) ? true : false, 'data': room}
    }

    roomUpdate(data) {
        const res = this.roomExists(data.partyId)
        let res_data = null
        let result = false
        if (res.result) {
            const room = new Room()
            room.setData(res.data)
            room.setMode(data.mode);
            this.setRoomData(res.data, room)
            res_data = room
            result = true
        }
        return {'result': result, 'data': res_data}
    }

    shooting(socketId, data) {
        const room = this.getRoomBySocketId(socketId)
        room.incrementCurrentShooting()
        
        return {'result': true, 'data': room}
    }
}

module.exports = Controller