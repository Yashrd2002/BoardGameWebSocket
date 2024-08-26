const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { initialState, makeMove } = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.static('../client/build'));

let gameState = { ...initialState };

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('Received message:', message);
        try {
            const data = JSON.parse(message);

            if (data.type === 'move') {
                const move = data.move;
                if (
                    typeof move.fromRow !== 'number' ||
                    typeof move.fromCol !== 'number' ||
                    typeof move.toRow !== 'number' ||
                    typeof move.toCol !== 'number'
                ) {
                    throw new Error('Invalid move format');
                }

                console.log('Parsed move:', move);

                gameState = makeMove(gameState, move);

            } else if (data.type === 'reset') {
                gameState = { ...initialState };
            } else {
                throw new Error('Unknown message type');
            }
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(gameState));
                }
            });
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ error: error.message }));
        }
    });
    ws.send(JSON.stringify(gameState));
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
