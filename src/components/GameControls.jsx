import './GameControls.css'

export default function GameControls({ onStart, onReset, onToggleOriginal, onReshuffle, gameStarted, isComplete }) {
  return (
    <div className="game-controls">
      {!gameStarted ? (
        <button className="btn btn-primary" onClick={onStart}>
          🎮 开始游戏
        </button>
      ) : (
        <>
          <button className="btn btn-secondary" onClick={onReset}>
            🔄 重置
          </button>
          {!isComplete && (
            <button className="btn btn-secondary" onClick={onReshuffle}>
              🔀 重新打乱
            </button>
          )}
          <button className="btn btn-outline" onClick={onToggleOriginal}>
            🖼️ 查看原图
          </button>
        </>
      )}
    </div>
  )
}
