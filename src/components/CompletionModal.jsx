import { formatTime } from '../utils/format'
import { isNewRecord } from '../utils/leaderboard'
import './CompletionModal.css'

export default function CompletionModal({ time, moves, rows, cols, onSave, onPlayAgain, onClose }) {
  const isRecord = isNewRecord(rows, cols, time)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="completion-modal" onClick={e => e.stopPropagation()}>
        <div className="completion-header">
          {isRecord ? (
            <>
              <div className="celebration">🎉</div>
              <h2>新纪录！</h2>
            </>
          ) : (
            <h2>🎉 恭喜完成！</h2>
          )}
        </div>
        
        <div className="completion-stats">
          <div className="completion-stat">
            <span className="label">用时</span>
            <span className="value">{formatTime(time)}</span>
          </div>
          <div className="completion-stat">
            <span className="label">移动次数</span>
            <span className="value">{moves}</span>
          </div>
          <div className="completion-stat">
            <span className="label">难度</span>
            <span className="value">{rows}×{cols}</span>
          </div>
        </div>

        <div className="completion-actions">
          <button className="btn btn-primary" onClick={onSave}>
            💾 保存成绩
          </button>
          <button className="btn btn-secondary" onClick={onPlayAgain}>
            🔄 再玩一次
          </button>
        </div>
      </div>
    </div>
  )
}
