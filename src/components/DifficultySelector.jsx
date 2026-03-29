import { useState, useCallback } from 'react'
import { DIFFICULTY_PRESETS, getTotalPieces } from '../utils/difficulty'
import CustomGridInput from './CustomGridInput'
import './DifficultySelector.css'

function DifficultySelector({ 
  onDifficultyChange, 
  initialDifficulty = 'normal',
  initialRows = 4,
  initialCols = 4
}) {
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty)
  const [customMode, setCustomMode] = useState(false)
  const [grid, setGrid] = useState({ 
    rows: initialRows, 
    cols: initialCols 
  })

  const handleDifficultySelect = useCallback((difficulty) => {
    const preset = DIFFICULTY_PRESETS.find(p => p.id === difficulty)
    if (!preset) return
    
    setSelectedDifficulty(difficulty)
    setCustomMode(false)
    setGrid({ rows: preset.rows, cols: preset.cols })
    
    onDifficultyChange({
      difficulty,
      rows: preset.rows,
      cols: preset.cols,
      totalPieces: preset.rows * preset.cols,
      isCustom: false
    })
  }, [onDifficultyChange])

  const handleCustomModeToggle = useCallback(() => {
    setCustomMode(true)
    setSelectedDifficulty('custom')
    
    onDifficultyChange({
      difficulty: 'custom',
      rows: grid.rows,
      cols: grid.cols,
      totalPieces: grid.rows * grid.cols,
      isCustom: true
    })
  }, [grid, onDifficultyChange])

  const handleGridChange = useCallback((rows, cols) => {
    setGrid({ rows, cols })
    
    onDifficultyChange({
      difficulty: 'custom',
      rows,
      cols,
      totalPieces: rows * cols,
      isCustom: true
    })
  }, [onDifficultyChange])

  const getDifficultyColor = (id) => {
    const colors = {
      beginner: '#4ade80',
      easy: '#a3e635',
      normal: '#facc15',
      medium: '#fb923c',
      hard: '#f87171',
      expert: '#c084fc',
    }
    return colors[id] || '#646cff'
  }

  return (
    <div className="difficulty-selector">
      <h3 className="selector-title">选择难度</h3>
      
      <div className="difficulty-buttons">
        {DIFFICULTY_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`difficulty-button ${selectedDifficulty === preset.id && !customMode ? 'active' : ''}`}
            onClick={() => handleDifficultySelect(preset.id)}
            style={{
              '--accent-color': getDifficultyColor(preset.id)
            }}
          >
            <span className="difficulty-name">{preset.name}</span>
            <span className="difficulty-grid">{preset.rows}×{preset.cols}</span>
            <span className="difficulty-pieces">{getTotalPieces(preset.rows, preset.cols)} 块</span>
          </button>
        ))}
      </div>

      <div className="custom-section">
        <button
          className={`custom-toggle ${customMode ? 'active' : ''}`}
          onClick={handleCustomModeToggle}
        >
          <svg 
            className="custom-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
          </svg>
          自定义网格
        </button>
        
        {customMode && (
          <CustomGridInput
            rows={grid.rows}
            cols={grid.cols}
            onGridChange={handleGridChange}
          />
        )}
      </div>

      <div className="current-selection">
        <span className="selection-label">当前选择：</span>
        <span className="selection-value">
          {customMode ? '自定义' : DIFFICULTY_PRESETS.find(p => p.id === selectedDifficulty)?.name}
          {' '}({grid.rows}×{grid.cols} = {getTotalPieces(grid.rows, grid.cols)} 块)
        </span>
      </div>
    </div>
  )
}

export default DifficultySelector
