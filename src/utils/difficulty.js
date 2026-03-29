export const DIFFICULTY_PRESETS = [
  { id: 'beginner', name: '入门', rows: 2, cols: 2 },
  { id: 'easy', name: '简单', rows: 3, cols: 3 },
  { id: 'normal', name: '普通', rows: 4, cols: 4 },
  { id: 'medium', name: '中等', rows: 5, cols: 5 },
  { id: 'hard', name: '困难', rows: 6, cols: 6 },
  { id: 'expert', name: '专家', rows: 8, cols: 8 },
]

export const GRID_LIMITS = {
  MIN: 2,
  MAX: 10,
}

export function detectAspectRatio(width, height) {
  if (!width || !height || width <= 0 || height <= 0) {
    return 'square'
  }
  
  const ratio = width / height
  const tolerance = 0.1
  
  if (Math.abs(ratio - 1) < tolerance) {
    return 'square'
  } else if (ratio > 1) {
    return 'landscape'
  } else {
    return 'portrait'
  }
}

export function recommendGrid(width, height, difficulty) {
  if (!width || !height || width <= 0 || height <= 0) {
    const preset = DIFFICULTY_PRESETS.find(p => p.id === difficulty) || DIFFICULTY_PRESETS[0]
    return { rows: preset.rows, cols: preset.cols }
  }
  
  const preset = DIFFICULTY_PRESETS.find(p => p.id === difficulty) || DIFFICULTY_PRESETS[0]
  const aspectRatio = detectAspectRatio(width, height)
  
  if (aspectRatio === 'square') {
    return { rows: preset.rows, cols: preset.cols }
  }
  
  const baseSize = preset.rows
  const ratio = width / height
  
  if (aspectRatio === 'landscape') {
    const cols = Math.round(baseSize * ratio)
    return { 
      rows: baseSize, 
      cols: Math.max(GRID_LIMITS.MIN, Math.min(GRID_LIMITS.MAX, cols))
    }
  } else {
    const rows = Math.round(baseSize / ratio)
    return { 
      rows: Math.max(GRID_LIMITS.MIN, Math.min(GRID_LIMITS.MAX, rows)), 
      cols: baseSize 
    }
  }
}

export function validateGridInput(value) {
  const num = parseInt(value, 10)
  if (isNaN(num)) return { valid: false, value: GRID_LIMITS.MIN }
  if (num < GRID_LIMITS.MIN) return { valid: false, value: GRID_LIMITS.MIN }
  if (num > GRID_LIMITS.MAX) return { valid: false, value: GRID_LIMITS.MAX }
  return { valid: true, value: num }
}

export function getDifficultyById(id) {
  return DIFFICULTY_PRESETS.find(p => p.id === id) || null
}

export function getTotalPieces(rows, cols) {
  return rows * cols
}
