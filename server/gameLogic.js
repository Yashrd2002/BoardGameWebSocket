const initialState = {
  board: [
    ["AP1", "AH3", "AH1", "AH2", "AP1"],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    ["BP1", "BH3", "BH1", "BH2", "BP1"],
  ],
  currentPlayer: "A",
  moveHistory: [],
  gameOver: false,
};

function isValidMove(
    board,
    fromRow,
    fromCol,
    toRow,
    toCol,
    pieceType,
    currentPlayer
  ) {
    if (toRow < 0 || toRow >= 5 || toCol < 0 || toCol >= 5) {
      return false;
    }
  
    const destination = board[toRow][toCol];
    if (destination && destination[0] === currentPlayer) {
      return false;
    }
  
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    
    switch (pieceType) {
      case "Pawn":
        return (
          (Math.abs(rowDiff) === 1 && colDiff === 0) ||
          (Math.abs(colDiff) === 1 && rowDiff === 0)
        );
      case "Hero1":
        return (
          (Math.abs(rowDiff) === 2 && colDiff === 0) ||
          (Math.abs(colDiff) === 2 && rowDiff === 0)
        );
      case "Hero2":
        return Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2;
      case "Hero3":
        return (
          (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
          (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
        );
      default:
        return false;
    }
  }
  

function makeMove(state, move) {
  const { board, currentPlayer } = state;
  const { fromRow, fromCol, toRow, toCol } = move;

  const piece = board[fromRow][fromCol];
  if (!piece || piece[0] !== currentPlayer[0]) {
    return state;
  }

  

  const pieceType = getPieceType(piece);
  // console.log(
  //   isValidMove(board, fromRow, fromCol, toRow, toCol, pieceType, currentPlayer)
  // );

  if (
    !isValidMove(
      board,
      fromRow,
      fromCol,
      toRow,
      toCol,
      pieceType,
      currentPlayer
    )
  ) {
    return state;
  }

  const newBoard = board.map((row) => row.slice());
  if (pieceType === "Hero3") {
    if (
      newBoard[toRow][toCol] &&
      newBoard[toRow][toCol][0] !== currentPlayer[0]
    ) {
      newBoard[toRow][toCol] = null;
    }
  }
  if (pieceType === 'Hero1' || pieceType === 'Hero2') {
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    let stepRow = 0;
    let stepCol = 0;

    if (pieceType === 'Hero1') {
        stepRow = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
        stepCol = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
    } else if (pieceType === 'Hero2') {
        stepRow = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
        stepCol = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
    }

    let checkRow = fromRow + stepRow;
    let checkCol = fromCol + stepCol;
    
    
    while (checkRow !== toRow || checkCol !== toCol) {
        if (newBoard[checkRow][checkCol] && newBoard[checkRow][checkCol][0] !== currentPlayer[0]) {
            newBoard[checkRow][checkCol] = null;
        }
        checkRow += stepRow;
        checkCol += stepCol;
    }
}

  newBoard[toRow][toCol] = board[fromRow][fromCol];
  newBoard[fromRow][fromCol] = null;

  const nextPlayer = currentPlayer === "A" ? "B" : "A";

  const moveHistory = [
    ...state.moveHistory,
    `Player ${currentPlayer} ${piece} moved from [${fromRow}, ${fromCol}] to [${toRow}, ${toCol}]`,
  ];

  const winner = checkGameOver(newBoard);

  return {
    ...state,
    board: newBoard,
    currentPlayer: nextPlayer,
    moveHistory,
    gameOver: !!winner,
    winner,
  };
}

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

function checkGameOver(board) {
  const aPieces = board
    .flat()
    .filter((cell) => cell && cell.startsWith("A")).length;
  const bPieces = board
    .flat()
    .filter((cell) => cell && cell.startsWith("B")).length;

  if (aPieces === 0) {
    return "B";
  } else if (bPieces === 0) {
    return "A";
  } else {
    return null;
  }
}



module.exports = { initialState, makeMove };
