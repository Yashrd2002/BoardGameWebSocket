import React, { useState } from "react";

const Board = ({ board = [], currentPlayer, spectate }) => {
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handleCellClick = (row, col) => {
    if (spectate) return;
    const piece = board[row][col];
    const ws = window.ws;
    if (piece && piece[0] === currentPlayer) {
      setSelectedPiece({ piece, row, col });
    } else if (selectedPiece && selectedPiece.piece[0] === currentPlayer) {
      const { row: fromRow, col: fromCol } = selectedPiece;
      if (ws && ws.readyState === WebSocket.OPEN) {
        const move = { fromRow, fromCol, toRow: row, toCol: col };
        console.log("Sending move:", move);
        ws.send(JSON.stringify({ type: "move", move }));
      } else {
        console.error("WebSocket connection is not open");
      }

      setSelectedPiece(null);
    }
  };

  const getValidMoves = () => {
    if (spectate) return;
    if (!selectedPiece) return [];
    const { piece, row, col } = selectedPiece;
    const pieceType = getPieceType(piece);

    const directions = {
      Pawn: [
        { dRow: 1, dCol: 0 },
        { dRow: -1, dCol: 0 },
        { dRow: 0, dCol: 1 },
        { dRow: 0, dCol: -1 },
      ],
      Hero1: [
        { dRow: 2, dCol: 0 },
        { dRow: -2, dCol: 0 },
        { dRow: 0, dCol: 2 },
        { dRow: 0, dCol: -2 },
      ],
      Hero2: [
        { dRow: 2, dCol: 2 },
        { dRow: 2, dCol: -2 },
        { dRow: -2, dCol: 2 },
        { dRow: -2, dCol: -2 },
      ],
      Hero3: [
        { dRow: 2, dCol: 1 },
        { dRow: 2, dCol: -1 },
        { dRow: -2, dCol: 1 },
        { dRow: -2, dCol: -1 },
        { dRow: 1, dCol: 2 },
        { dRow: 1, dCol: -2 },
        { dRow: -1, dCol: 2 },
        { dRow: -1, dCol: -2 },
      ],
    };

    const validMoves = [];

    if (!directions[pieceType]) {
      console.error(`Invalid piece type: ${pieceType}`);
      return validMoves;
    }

    directions[pieceType].forEach(({ dRow, dCol }) => {
      const newRow = row + dRow;
      const newCol = col + dCol;

      console.log(
        `Attempting to move ${pieceType} from (${row}, ${col}) to (${newRow}, ${newCol})`
      );

      if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5) {
        if (!board[newRow][newCol] || board[newRow][newCol][0] !== piece[0]) {
          validMoves.push({ row: newRow, col: newCol });
          console.log(`Valid move for ${pieceType} to (${newRow}, ${newCol})`);
        } else {
          console.log(
            `Blocked move for ${pieceType} to (${newRow}, ${newCol})`
          );
        }
      } else {
        console.log(
          `Out of bounds move for ${pieceType} to (${newRow}, ${newCol})`
        );
      }
    });

    return validMoves;
  };

  const validMoves = getValidMoves();
  
  return (
    <div className=" inline-block md:m-[20px] mt-6">
      <h2 className="text-lg text-[#b3a6a6]">
        Current Player: <span className={`${currentPlayer==="A"?"text-red-500":"text-blue-500"}`}>{currentPlayer}</span>
      </h2>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <button
              key={colIndex}
              className={`md:w-[60px] md:h-[60px] w-[50px] h-[50px] md:text-xl border m-[2px] border-[#ffffff57] ${
                validMoves?.some(
                  (move) => move.row === rowIndex && move.col === colIndex
                )
                  ? "bg-green-400 cursor-pointer text-black"
                  : ""
              } ${cell?.charAt(0)==="A"?"text-red-500":"text-blue-500"}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell || ""}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

function getPieceType(piece) {
  if (piece.startsWith("AP1") || piece.startsWith("BP1")) {
    return "Pawn";
  } else if (piece.startsWith("AH1") || piece.startsWith("BH1")) {
    return "Hero1";
  } else if (piece.startsWith("AH2") || piece.startsWith("BH2")) {
    return "Hero2";
  } else if (piece.startsWith("AH3") || piece.startsWith("BH3")) {
    return "Hero3";
  }
}

export default Board;
