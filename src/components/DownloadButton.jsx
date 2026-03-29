import { downloadCanvas, generateFilename } from '../utils/download'
import './DownloadButton.css'

export default function DownloadButton({ canvas, disabled }) {
  const handleDownload = () => {
    if (canvas && !disabled) {
      downloadCanvas(canvas, generateFilename())
    }
  }

  return (
    <button 
      className="download-btn" 
      onClick={handleDownload}
      disabled={disabled || !canvas}
    >
      📥 下载像素图
    </button>
  )
}
