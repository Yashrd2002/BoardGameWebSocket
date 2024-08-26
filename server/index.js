const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { initialState, makeMove } = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.static('../client/build'));

const rooms = {};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'join') {
                const room = data.room;
                if (!rooms[room]) {
                    rooms[room] = { ...initialState };
                }
                ws.room = room;
                ws.send(JSON.stringify({ type: 'update', gameState: rooms[room] }));
            }

            if (ws.room && rooms[ws.room]) {
                if (data.type === 'move') {
                    const move = data.move;
                    rooms[ws.room] = makeMove(rooms[ws.room], move);
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN && client.room === ws.room) {
                            client.send(JSON.stringify({ type: 'update', gameState: rooms[ws.room] }));
                        }
                    });
                } else if (data.type === 'reset') {
                    rooms[ws.room] = { ...initialState };
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN && client.room === ws.room) {
                            client.send(JSON.stringify({ type: 'update', gameState: rooms[ws.room] }));
                        }
                    });
                } else {
                    console.log('Unknown message type');
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ error: error.message }));
        }
    });
});

server.listen(8600, () => {
    console.log('Server is running on port 8000');
});
