import './OriginalPreview.css'

export default function OriginalPreview({ imageCanvas, visible, onClose }) {
  if (!visible || !imageCanvas) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>原图预览</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <img 
            src={imageCanvas.toDataURL('image/png')} 
            alt="原图" 
            className="original-image"
          />
        </div>
      </div>
    </div>
  )
}
