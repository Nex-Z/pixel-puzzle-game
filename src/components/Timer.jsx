import './Timer.css'

function Timer({ time, isRunning }) {
  return (
    <div className={`timer ${isRunning ? 'running' : ''}`}>
      <div className="timer-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
      <div className="timer-display">
        <span className="timer-time">{time.formatted}</span>
        <span className="timer-label">{isRunning ? '计时中' : '已暂停'}</span>
      </div>
      {isRunning && (
        <div className="timer-pulse">
          <span className="pulse-dot"></span>
        </div>
      )}
    </div>
  )
}

export default Timer
