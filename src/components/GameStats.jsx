import { formatTime } from '../utils/format'
import './GameStats.css'

export default function GameStats({ time, moves, rows, cols }) {
  return (
    <div className="game-stats">
      <div className="stat-item">
        <span className="stat-label">⏱️ 时间</span>
        <span className="stat-value">{formatTime(time)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">👆 移动</span>
        <span className="stat-value">{moves}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">📐 网格</span>
        <span className="stat-value">{rows}×{cols}</span>
      </div>
    </div>
  )
}
