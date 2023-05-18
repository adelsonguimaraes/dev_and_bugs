const express = require('express')
const http = require('http')
const cors = require('cors')
const Controller = require('./controller')
const socket_events = require('./SocketEvents')

const router_web = require('./routes/web')

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)

app.use(express.static('./app/'))
app.use(cors())
app.use(express.json())

app.use('/', router_web)

const conns = []
const controller = new Controller()

io.on('connection', (socket) => {
    conns.push(socket)

    const socketEvents = new socket_events(socket)

    socketEvents.createParty(controller.addRoom.bind(controller))
    socketEvents.updateParty(controller.roomUpdate.bind(controller))
    socketEvents.partyExists(controller.roomExists.bind(controller))
    socketEvents.enterTheParty(controller.addUserInRoom.bind(controller))
    socketEvents.shooting(controller.shooting.bind(controller))
    socketEvents.drawLine(controller.getRoomBySocketId.bind(controller))
    
    socket.on('mouse-position-share', (data) => 
        conns.forEach(e => socket.to(e.id).emit('mouse-position-received', data)))
})

server.listen(4000, () => {
    console.log('App up on port 4000');
})