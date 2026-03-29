const STORAGE_KEY = 'pixel-puzzle-leaderboard'

export function saveScore(record) {
  const scores = getAllScores()
  const gridKey = `${record.rows}x${record.cols}`
  
  if (!scores[gridKey]) {
    scores[gridKey] = []
  }
  
  scores[gridKey].push({
    time: record.time,
    moves: record.moves,
    date: record.date,
    pixelSize: record.pixelSize
  })
  
  scores[gridKey].sort((a, b) => a.time - b.time)
  scores[gridKey] = scores[gridKey].slice(0, 10)
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

export function getScores(rows, cols) {
  const scores = getAllScores()
  const gridKey = `${rows}x${cols}`
  return scores[gridKey] || []
}

export function getAllScores() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function clearScores(rows, cols) {
  if (rows && cols) {
    const scores = getAllScores()
    const gridKey = `${rows}x${cols}`
    delete scores[gridKey]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function isNewRecord(rows, cols, time) {
  const scores = getScores(rows, cols)
  if (scores.length === 0) return true
  return time < scores[0].time
}
