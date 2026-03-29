import { useEffect, useRef, useState } from 'react'
import { getImageData, pixelateImage } from '../utils/pixelate'
import './PixelPreview.css'

function PixelPreview({ image, pixelSize = 8, onCanvasReady }) {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!image) {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      if (onCanvasReady) onCanvasReady(null)
      return
    }

    const processImage = async () => {
      setLoading(true)
      setError(null)

      try {
        const imageData = await getImageData(image)
        const pixelatedCanvas = pixelateImage(imageData, pixelSize)

        const canvas = canvasRef.current
        if (canvas) {
          const maxWidth = 500
          const maxHeight = 500
          let width = pixelatedCanvas.width
          let height = pixelatedCanvas.height

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = Math.round(width * ratio)
            height = Math.round(height * ratio)
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(pixelatedCanvas, 0, 0, width, height)
          
          if (onCanvasReady) onCanvasReady(canvas)
        }
      } catch (err) {
        setError('图片处理失败，请重试')
        console.error('Pixel preview error:', err)
        if (onCanvasReady) onCanvasReady(null)
      } finally {
        setLoading(false)
      }
    }

    processImage()
  }, [image, pixelSize, onCanvasReady])

  if (!image) {
    return (
      <div className="pixel-preview empty">
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <p className="empty-text">上传图片后将显示像素化预览</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pixel-preview">
      <div className="preview-header">
        <h3 className="preview-title">像素化预览</h3>
        <span className="pixel-info">{pixelSize}px 像素块</span>
      </div>
      
      <div className="preview-container">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>处理中...</p>
          </div>
        )}
        
        {error && (
          <div className="error-overlay">
            <p>{error}</p>
          </div>
        )}
        
        <canvas ref={canvasRef} className="preview-canvas" />
      </div>
    </div>
  )
}

export default PixelPreview
