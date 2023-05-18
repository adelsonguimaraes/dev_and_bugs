"use strict";
class SocketEvents {
    constructor(socket) {
        this.socket = socket;
    }
    createParty(callback) {
        this.socket.on('create-party', (data) => {
            const res = callback(this.socket.id, data.name, data.mode, data.bugs);
            this.createPartySuccess(res);
        });
    }
    createPartySuccess(data) {
        this.socket.emit('create-party-success', { 'party': data, 'socketId': this.socket.id });
    }
    updateParty(callback) {
        this.socket.on('update-party', (data) => {
            const res = callback(data);
            if (res.result) {
                ;
                res.data.users.forEach(user => {
                    console.log(user);
                    this.socket.to(user.socketId).emit('update-party-response', res.data);
                });
            }
        });
    }
    partyExists(callback) {
        this.socket.on('party-exists', (data) => {
            const res = callback(data.party);
            this.partyExistsResponse(res);
        });
    }
    partyExistsResponse(data) {
        this.socket.emit('party-exists-response', data);
    }
    enterTheParty(callback) {
        this.socket.on('enter-the-party', (data) => {
            const res = callback(this.socket.id, data.name, data.party);
            if (res.result) {
                this.socket.emit('enter-the-party-response', { 'party': res.data, 'socketId': this.socket.id });
                res.data.users.forEach(e => {
                    this.socket.to(e.socketId).emit('partner-enter-the-party', res.data);
                });
            }
        });
    }
    shooting(callback) {
        this.socket.on('shooting', (data) => {
            const res = callback(this.socket.id, data);
            if (res.result) {
                this.socket.emit('shooting-response', { 'party': res.data, 'pageCoords': data });
                this.emitToOuthers('shooting-partner', { 'party': res.data, 'pageCoords': data }, res.data.users);
            }
        });
    }
    drawLine(callback) {
        this.socket.on('draw-line', (data) => {
            console.log('sim chegamos aqui');
            const res = callback(this.socket.id, data);
            console.log(res);
            this.emitToOuthers('draw-line-partner', data, res.users);
        });
    }
    emitToOuthers(channel, data, users) {
        users.forEach(e => this.socket.to(e.socketId).emit(channel, data));
    }
}
module.exports = SocketEvents;
