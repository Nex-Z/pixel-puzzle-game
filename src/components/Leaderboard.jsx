import { useState, useEffect } from 'react'
import { getAllScores, clearScores } from '../utils/leaderboard'
import { formatTime } from '../utils/format'
import './Leaderboard.css'

export default function Leaderboard({ onClose }) {
  const [scores, setScores] = useState({})
  const [activeTab, setActiveTab] = useState(null)

  useEffect(() => {
    const allScores = getAllScores()
    setScores(allScores)
    const keys = Object.keys(allScores)
    if (keys.length > 0 && !activeTab) {
      setActiveTab(keys[0])
    }
  }, [activeTab])

  const handleClear = (rows, cols) => {
    if (confirm('确定要清除该难度的所有记录吗？')) {
      clearScores(rows, cols)
      setScores(getAllScores())
    }
  }

  const gridKeys = Object.keys(scores)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="leaderboard-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🏆 排行榜</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        {gridKeys.length === 0 ? (
          <div className="leaderboard-empty">
            <p>暂无记录</p>
            <p className="hint">完成拼图后将自动保存成绩</p>
          </div>
        ) : (
          <>
            <div className="leaderboard-tabs">
              {gridKeys.map(key => (
                <button
                  key={key}
                  className={`tab ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {key}
                </button>
              ))}
            </div>
            
            <div className="leaderboard-content">
              {activeTab && scores[activeTab] && (
                <>
                  <table className="score-table">
                    <thead>
                      <tr>
                        <th>排名</th>
                        <th>用时</th>
                        <th>移动</th>
                        <th>日期</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores[activeTab].map((record, index) => (
                        <tr key={index} className={index === 0 ? 'top-record' : ''}>
                          <td>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                          </td>
                          <td>{formatTime(record.time)}</td>
                          <td>{record.moves}</td>
                          <td>{record.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button 
                    className="clear-btn"
                    onClick={() => {
                      const [rows, cols] = activeTab.split('x').map(Number)
                      handleClear(rows, cols)
                    }}
                  >
                    清除记录
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
