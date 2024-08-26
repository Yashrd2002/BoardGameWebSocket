const { initialState } = require('./gameLogic');

const rooms = {};

function createRoom(roomId) {
    if (!rooms[roomId]) {
        rooms[roomId] = {
            players: [],
            gameState: { ...initialState },
        };
    }
}

function joinRoom(roomId, playerId, ws) {
    if (rooms[roomId]) {
        if (rooms[roomId].players.length < 2) {
            rooms[roomId].players.push({ playerId, ws });
            ws.send(JSON.stringify({ type: 'roomJoined', roomId }));
            return true;
        }
    }
    return false;
}

function leaveRoom(roomId, playerId) {
    if (rooms[roomId]) {
        rooms[roomId].players = rooms[roomId].players.filter(p => p.playerId !== playerId);
        if (rooms[roomId].players.length === 0) {
            delete rooms[roomId];
        }
    }
}

function getRoom(roomId) {
    return rooms[roomId];
}

module.exports = { createRoom, joinRoom, leaveRoom, getRoom };


