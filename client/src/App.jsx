import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import MoveHistory from './MoveHistory';

const App = () => {
    const [gameState, setGameState] = useState({
        board: [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ],
        currentPlayer: 'A',
        moveHistory: [],
        gameOver: false,
        winner: null,
    });

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000');
        
        ws.onmessage = (event) => {
            const state = JSON.parse(event.data);
            setGameState(state);
        };
        window.ws = ws;

        return () => {
            ws.close();
        };
    }, []);

    const handleReset = () => {
        window.ws.send(JSON.stringify({ type: 'reset' }));
    };

    return (
        <div className=" text-center p-[20px] bg-black min-h-screen text-white roboto-regular">
            <h1 className='text-[40px] roboto-medium'>Board Game</h1>
            <GameBoard board={gameState.board} currentPlayer={gameState.currentPlayer} />
            {gameState.gameOver && (
                <div className="mt-[20px]">
                    <h2 className='text-xl'>Game Over! {gameState.winner} Wins! 🎉</h2>
                    <button onClick={handleReset} className='bg-[#cbe72c] px-2 p-1 mt-4 text-black roboto-medium'>Start New Game</button>
                </div>
            )}
            <MoveHistory history={gameState.moveHistory} />
            {!gameState.gameOver && (

            <button onClick={handleReset} className='bg-[#cbe72c] px-2 p-1 mt-4 text-black roboto-medium'>Reset</button>
            )}
        </div>
    );
};

export default App;
