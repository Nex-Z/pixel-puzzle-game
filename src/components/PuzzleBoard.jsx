import { useMemo } from 'react'
import { findEmptyPiece, canMove, getClipPathString } from '../utils/puzzle'
import './PuzzleBoard.css'

export default function PuzzleBoard({ pieces, rows, cols, onPieceClick, isComplete }) {
  const emptyIndex = useMemo(() => {
    if (!pieces) return -1
    return findEmptyPiece(pieces)
  }, [pieces])

  const getCanMove = (index) => {
    if (emptyIndex === -1 || isComplete) return false
    return canMove(index, emptyIndex, rows, cols)
  }

  const pieceDimensions = useMemo(() => {
    const boardSize = 480
    const gap = 2
    const totalGaps = (cols - 1) * gap
    const totalGapsY = (rows - 1) * gap
    return {
      width: (boardSize - totalGaps) / cols,
      height: (boardSize - totalGapsY) / rows,
      boardSize
    }
  }, [rows, cols])

  if (!pieces || pieces.length === 0) {
    return (
      <div className="puzzle-board-empty">
        <p>请上传图片并开始游戏</p>
      </div>
    )
  }

  return (
    <div
      className={`puzzle-board ${isComplete ? 'complete' : ''}`}
      style={{
        width: pieceDimensions.boardSize,
        height: pieceDimensions.boardSize
      }}
    >
      {pieces.map((piece, index) => {
        const isEmpty = piece.correctPosition === -1
        const row = Math.floor(index / cols)
        const col = index % cols

        const x = col * (pieceDimensions.width + 2)
        const y = row * (pieceDimensions.height + 2)

        const correctRow = Math.floor(piece.correctPosition / cols)
        const correctCol = piece.correctPosition % cols
        const imgX = correctCol * (pieceDimensions.width + 2)
        const imgY = correctRow * (pieceDimensions.height + 2)

        const clipPath = isEmpty ? 'none' : getClipPathString(piece, pieceDimensions.width, pieceDimensions.height)

        return (
          <div
            key={piece.id}
            className={`puzzle-piece ${isEmpty ? 'empty' : ''} ${getCanMove(index) ? 'movable' : ''}`}
            onClick={() => !isEmpty && getCanMove(index) && onPieceClick(index)}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: pieceDimensions.width,
              height: pieceDimensions.height,
              backgroundImage: isEmpty ? 'none' : `url(${piece.currentImage.toDataURL()})`,
              backgroundSize: `${pieceDimensions.boardSize}px ${pieceDimensions.boardSize}px`,
              backgroundPosition: `-${imgX}px -${imgY}px`,
              clipPath: clipPath,
              WebkitClipPath: clipPath,
              zIndex: isEmpty ? 0 : 1
            }}
          />
        )
      })}
    </div>
  )
}