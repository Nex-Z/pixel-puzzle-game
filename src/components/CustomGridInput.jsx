import { useState, useCallback } from 'react'
import { validateGridInput, GRID_LIMITS } from '../utils/difficulty'
import './CustomGridInput.css'

function CustomGridInput({ rows, cols, onGridChange, disabled }) {
  const [localRows, setLocalRows] = useState(rows.toString())
  const [localCols, setLocalCols] = useState(cols.toString())
  const [errors, setErrors] = useState({ rows: '', cols: '' })

  const validateAndNotify = useCallback((field, value) => {
    const result = validateGridInput(value)
    
    if (!result.valid) {
      setErrors(prev => ({
        ...prev,
        [field]: `请输入 ${GRID_LIMITS.MIN}-${GRID_LIMITS.MAX} 之间的数字`
      }))
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    if (field === 'rows') {
      setLocalRows(value)
      if (result.valid) {
        onGridChange(result.value, cols)
      }
    } else {
      setLocalCols(value)
      if (result.valid) {
        onGridChange(rows, result.value)
      }
    }
  }, [rows, cols, onGridChange])

  const handleRowsChange = (e) => {
    validateAndNotify('rows', e.target.value)
  }

  const handleColsChange = (e) => {
    validateAndNotify('cols', e.target.value)
  }

  const handleBlur = (field) => {
    const value = field === 'rows' ? localRows : localCols
    const result = validateGridInput(value)
    
    if (field === 'rows') {
      setLocalRows(result.value.toString())
      onGridChange(result.value, cols)
    } else {
      setLocalCols(result.value.toString())
      onGridChange(rows, result.value)
    }
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="custom-grid-input">
      <h4 className="custom-grid-title">自定义网格</h4>
      <div className="input-group">
        <div className="input-field">
          <label htmlFor="rows-input">行数</label>
          <input
            id="rows-input"
            type="number"
            min={GRID_LIMITS.MIN}
            max={GRID_LIMITS.MAX}
            value={localRows}
            onChange={handleRowsChange}
            onBlur={() => handleBlur('rows')}
            disabled={disabled}
            className={errors.rows ? 'error' : ''}
          />
          {errors.rows && <span className="error-message">{errors.rows}</span>}
        </div>
        <span className="separator">×</span>
        <div className="input-field">
          <label htmlFor="cols-input">列数</label>
          <input
            id="cols-input"
            type="number"
            min={GRID_LIMITS.MIN}
            max={GRID_LIMITS.MAX}
            value={localCols}
            onChange={handleColsChange}
            onBlur={() => handleBlur('cols')}
            disabled={disabled}
            className={errors.cols ? 'error' : ''}
          />
          {errors.cols && <span className="error-message">{errors.cols}</span>}
        </div>
      </div>
      <p className="range-hint">范围: {GRID_LIMITS.MIN} - {GRID_LIMITS.MAX}</p>
    </div>
  )
}

export default CustomGridInput
