import { useState, useCallback, useEffect } from 'react'
import './App.css'
import ImageUploader from './components/ImageUploader'
import PixelSizeSlider from './components/PixelSizeSlider'
import PixelPreview from './components/PixelPreview'
import DifficultySelector from './components/DifficultySelector'
import PuzzleBoard from './components/PuzzleBoard'
import GameControls from './components/GameControls'
import GameStats from './components/GameStats'
import OriginalPreview from './components/OriginalPreview'
import Leaderboard from './components/Leaderboard'
import CompletionModal from './components/CompletionModal'
import DownloadButton from './components/DownloadButton'
import { usePuzzleGame } from './hooks/usePuzzleGame'
import { useTimer } from './hooks/useTimer'
import { saveScore } from './utils/leaderboard'

function App() {
  const [originalImage, setOriginalImage] = useState(null)
  const [pixelSize, setPixelSize] = useState(8)
  const [pixelCanvas, setPixelCanvas] = useState(null)
  const [gameConfig, setGameConfig] = useState({ rows: 4, cols: 4 })
  const [gameStarted, setGameStarted] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  const { pieces, moves, isComplete, startGame, movePiece, resetGame, reshufflePuzzle } = usePuzzleGame()
  const { seconds, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer()

  const handleImageUpload = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalImage(e.target.result)
      setGameStarted(false)
      resetGame()
      resetTimer()
    }
    reader.readAsDataURL(file)
  }, [resetGame, resetTimer])

  const handlePixelSizeChange = useCallback((size) => {
    setPixelSize(size)
  }, [])

  const handleDifficultyChange = useCallback((config) => {
    setGameConfig({ rows: config.rows, cols: config.cols })
  }, [])

  const handlePixelCanvasReady = useCallback((canvas) => {
    setPixelCanvas(canvas)
  }, [])

  const handleStartGame = useCallback(() => {
    if (!pixelCanvas) return
    startGame(pixelCanvas, gameConfig.rows, gameConfig.cols)
    setGameStarted(true)
    startTimer()
  }, [pixelCanvas, gameConfig, startGame, startTimer])

  const handleReset = useCallback(() => {
    resetGame()
    resetTimer()
    setGameStarted(false)
  }, [resetGame, resetTimer])

  const handleReshuffle = useCallback(() => {
    reshufflePuzzle()
    resetTimer()
    startTimer()
  }, [reshufflePuzzle, resetTimer, startTimer])

  const handlePieceClick = useCallback((index) => {
    const moved = movePiece(index)
    if (moved && isComplete) {
      stopTimer()
      setShowCompletion(true)
    }
  }, [movePiece, isComplete, stopTimer])

  const handleSaveScore = useCallback(() => {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    
    saveScore({
      rows: gameConfig.rows,
      cols: gameConfig.cols,
      time: seconds,
      moves,
      date: dateStr,
      pixelSize
    })
    
    setShowCompletion(false)
  }, [gameConfig, seconds, moves, pixelSize])

  const handlePlayAgain = useCallback(() => {
    setShowCompletion(false)
    handleReshuffle()
  }, [handleReshuffle])

  useEffect(() => {
    if (isComplete && gameStarted) {
      stopTimer()
      setShowCompletion(true)
    }
  }, [isComplete, gameStarted, stopTimer])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧩 像素拼图游戏</h1>
        <button className="leaderboard-btn" onClick={() => setShowLeaderboard(true)}>
          🏆 排行榜
        </button>
      </header>

      <main className="app-main">
        {!gameStarted ? (
          <div className="setup-section">
            {!originalImage && (
              <div className="upload-section">
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            )}

            {originalImage && (
              <div className="preview-section">
                <div className="controls-row">
                  <PixelSizeSlider 
                    value={pixelSize} 
                    onChange={handlePixelSizeChange} 
                  />
                  <DownloadButton canvas={pixelCanvas} />
                </div>
                
                <PixelPreview 
                  image={originalImage}
                  pixelSize={pixelSize}
                  onCanvasReady={handlePixelCanvasReady}
                />

                <div className="difficulty-section">
                  <h3>选择难度</h3>
                  <DifficultySelector 
                    onDifficultyChange={handleDifficultyChange}
                    initialDifficulty="normal"
                  />
                </div>

                <button 
                  className="start-btn"
                  onClick={handleStartGame}
                  disabled={!pixelCanvas}
                >
                  🎮 开始游戏
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="game-section">
            <GameStats 
              time={seconds}
              moves={moves}
              rows={gameConfig.rows}
              cols={gameConfig.cols}
            />
            
            <PuzzleBoard 
              pieces={pieces}
              rows={gameConfig.rows}
              cols={gameConfig.cols}
              onPieceClick={handlePieceClick}
              isComplete={isComplete}
            />

            <GameControls 
              onStart={handleStartGame}
              onReset={handleReset}
              onToggleOriginal={() => setShowOriginal(true)}
              onReshuffle={handleReshuffle}
              gameStarted={gameStarted}
              isComplete={isComplete}
            />
          </div>
        )}
      </main>

      {showOriginal && pixelCanvas && (
        <OriginalPreview 
          imageCanvas={pixelCanvas}
          visible={showOriginal}
          onClose={() => setShowOriginal(false)}
        />
      )}

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}

      {showCompletion && (
        <CompletionModal 
          time={seconds}
          moves={moves}
          rows={gameConfig.rows}
          cols={gameConfig.cols}
          onSave={handleSaveScore}
          onPlayAgain={handlePlayAgain}
          onClose={() => setShowCompletion(false)}
        />
      )}
    </div>
  )
}

export default App
