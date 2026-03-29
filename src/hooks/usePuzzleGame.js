import { useState, useCallback } from 'react';
import {
  splitImage,
  shufflePuzzle,
  canMove,
  movePiece,
  isPuzzleComplete,
  createEmptyPiece,
} from '../utils/puzzle';

export function usePuzzleGame() {
  const [pieces, setPieces] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [gameConfig, setGameConfig] = useState({ rows: 0, cols: 0 });

  const startGame = useCallback((imageCanvas, rows, cols) => {
    let newPieces = splitImage(imageCanvas, rows, cols);
    
    const emptyPiece = createEmptyPiece();
    newPieces[newPieces.length - 1] = emptyPiece;
    
    newPieces = shufflePuzzle(newPieces, rows, cols);
    
    setPieces(newPieces);
    setMoves(0);
    setIsComplete(false);
    setGameConfig({ rows, cols });
  }, []);

  const handleMovePiece = useCallback((pieceIndex) => {
    if (isComplete) return false;

    const emptyIndex = pieces.findIndex(p => p.correctPosition === -1);
    
    if (emptyIndex === -1) return false;

    if (!canMove(pieceIndex, emptyIndex, gameConfig.rows, gameConfig.cols)) {
      return false;
    }

    const newPieces = movePiece(pieces, pieceIndex, emptyIndex);
    const newMoves = moves + 1;
    const complete = isPuzzleComplete(newPieces);

    setPieces(newPieces);
    setMoves(newMoves);
    setIsComplete(complete);

    return true;
  }, [pieces, moves, isComplete, gameConfig]);

  const resetGame = useCallback(() => {
    setPieces([]);
    setMoves(0);
    setIsComplete(false);
    setGameConfig({ rows: 0, cols: 0 });
  }, []);

  const reshufflePuzzle = useCallback(() => {
    if (pieces.length === 0) return;
    
    const newPieces = shufflePuzzle([...pieces], gameConfig.rows, gameConfig.cols);
    setPieces(newPieces);
    setMoves(0);
    setIsComplete(false);
  }, [pieces, gameConfig]);

  return {
    pieces,
    moves,
    isComplete,
    gameConfig,
    startGame,
    movePiece: handleMovePiece,
    resetGame,
    reshufflePuzzle,
  };
}
