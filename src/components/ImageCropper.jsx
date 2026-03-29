import { useState, useRef, useEffect, useCallback } from 'react'
import { cropImage } from '../utils/crop'
import './ImageCropper.css'

function ImageCropper({ image, onCrop, onCancel }) {
  const containerRef = useRef(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [cropArea, setCropArea] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [previewUrl, setPreviewUrl] = useState(null)

  const minSize = 100

  useEffect(() => {
    if (!image) return

    const img = new Image()
    img.onload = () => {
      const container = containerRef.current
      if (!container) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      let displayWidth = img.width
      let displayHeight = img.height

      if (displayWidth > containerWidth || displayHeight > containerHeight) {
        const ratio = Math.min(containerWidth / displayWidth, containerHeight / displayHeight)
        displayWidth = Math.round(displayWidth * ratio)
        displayHeight = Math.round(displayHeight * ratio)
      }

      setImageSize({ width: displayWidth, height: displayHeight })

      const size = Math.min(displayWidth, displayHeight)
      const x = Math.round((displayWidth - size) / 2)
      const y = Math.round((displayHeight - size) / 2)

      setCropArea({
        x,
        y,
        size,
        displaySize: size
      })
    }
    img.src = image
  }, [image])

  const getCropPosition = useCallback((clientX, clientY) => {
    const container = containerRef.current
    if (!container) return { x: 0, y: 0 }

    const rect = container.getBoundingClientRect()
    const scrollLeft = container.scrollLeft
    const scrollTop = container.scrollTop

    const x = clientX - rect.left + scrollLeft
    const y = clientY - rect.top + scrollTop

    return { x, y }
  }, [])

  const constrainCropArea = useCallback((area) => {
    const constrained = { ...area }

    if (constrained.x < 0) {
      constrained.x = 0
    }
    if (constrained.y < 0) {
      constrained.y = 0
    }
    if (constrained.x + constrained.size > imageSize.width) {
      constrained.x = imageSize.width - constrained.size
    }
    if (constrained.y + constrained.size > imageSize.height) {
      constrained.y = imageSize.height - constrained.size
    }

    if (constrained.size < minSize) {
      constrained.size = minSize
    }

    return constrained
  }, [imageSize])

  const handleMouseDown = useCallback((e, type) => {
    e.preventDefault()
    e.stopPropagation()

    const pos = getCropPosition(e.clientX, e.clientY)
    setDragStart(pos)
    setIsDragging(true)
    setDragType(type)
  }, [getCropPosition])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !cropArea) return

    const pos = getCropPosition(e.clientX, e.clientY)
    const deltaX = pos.x - dragStart.x
    const deltaY = pos.y - dragStart.y

    let newArea = { ...cropArea }

    switch (dragType) {
      case 'move':
        newArea.x = cropArea.x + deltaX
        newArea.y = cropArea.y + deltaY
        break
      case 'nw':
        newArea.x = cropArea.x + deltaX
        newArea.y = cropArea.y + deltaY
        newArea.size = cropArea.size - deltaX
        if (newArea.size < minSize) {
          newArea.x = cropArea.x - (minSize - cropArea.size)
          newArea.size = minSize
        }
        break
      case 'ne':
        newArea.y = cropArea.y + deltaY
        newArea.size = cropArea.size + deltaX
        if (newArea.size < minSize) {
          newArea.y = cropArea.y - (minSize - cropArea.size)
          newArea.size = minSize
        }
        break
      case 'sw':
        newArea.x = cropArea.x + deltaX
        newArea.size = cropArea.size - deltaY
        if (newArea.size < minSize) {
          newArea.x = cropArea.x - (minSize - cropArea.size)
          newArea.size = minSize
        }
        break
      case 'se':
        newArea.size = cropArea.size + deltaY
        if (newArea.size < minSize) {
          newArea.size = minSize
        }
        break
      default:
        break
    }

    newArea = constrainCropArea(newArea)
    setCropArea(newArea)
    setDragStart(pos)
  }, [isDragging, dragType, cropArea, dragStart, getCropPosition, constrainCropArea])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragType(null)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const generatePreview = useCallback(async () => {
    if (!cropArea || !image) return

    try {
      const canvas = await cropImage(image, cropArea, imageSize)
      setPreviewUrl(canvas.toDataURL('image/png'))
    } catch (err) {
      console.error('生成预览失败:', err)
    }
  }, [cropArea, image, imageSize])

  useEffect(() => {
    if (cropArea) {
      generatePreview()
    }
  }, [cropArea, generatePreview])

  const handleConfirm = useCallback(async () => {
    if (!cropArea || !image) return

    try {
      const canvas = await cropImage(image, cropArea, imageSize)
      onCrop(canvas)
    } catch (err) {
      console.error('裁剪失败:', err)
    }
  }, [cropArea, image, imageSize, onCrop])

  if (!image) return null

  return (
    <div className="image-cropper">
      <div className="crop-header">
        <h3>📐 选择正方形区域</h3>
        <p className="crop-hint">拖拽选择框选择图片中要拼图的部分</p>
      </div>

      <div className="crop-content">
        <div className="crop-main">
          <div
            ref={containerRef}
            className="crop-container"
            style={{ width: imageSize.width, height: imageSize.height }}
          >
            <img
              src={image}
              alt="待裁剪"
              className="crop-image"
              style={{ width: imageSize.width, height: imageSize.height }}
              draggable={false}
            />

            {cropArea && (
              <>
                <div
                  className="crop-overlay"
                  style={{
                    clipPath: `polygon(
                      0% 0%,
                      0% 100%,
                      ${cropArea.x}px 100%,
                      ${cropArea.x}px ${cropArea.y}px,
                      ${cropArea.x + cropArea.size}px ${cropArea.y}px,
                      ${cropArea.x + cropArea.size}px ${cropArea.y + cropArea.size}px,
                      ${cropArea.x}px ${cropArea.y + cropArea.size}px,
                      ${cropArea.x}px 100%,
                      100% 100%,
                      100% 0%
                    )`
                  }}
                />

                <div
                  className="crop-selection"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.size,
                    height: cropArea.size
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                >
                  <div className="crop-handle nw" onMouseDown={(e) => handleMouseDown(e, 'nw')} />
                  <div className="crop-handle ne" onMouseDown={(e) => handleMouseDown(e, 'ne')} />
                  <div className="crop-handle sw" onMouseDown={(e) => handleMouseDown(e, 'sw')} />
                  <div className="crop-handle se" onMouseDown={(e) => handleMouseDown(e, 'se')} />

                  <div className="crop-grid">
                    <div className="crop-line horizontal" style={{ top: '33.33%' }} />
                    <div className="crop-line horizontal" style={{ top: '66.66%' }} />
                    <div className="crop-line vertical" style={{ left: '33.33%' }} />
                    <div className="crop-line vertical" style={{ left: '66.66%' }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="crop-preview-section">
          <h4>裁剪预览</h4>
          <div className="crop-preview">
            {previewUrl ? (
              <img src={previewUrl} alt="裁剪预览" className="preview-img" />
            ) : (
              <div className="preview-placeholder">选择区域后显示预览</div>
            )}
          </div>
        </div>
      </div>

      <div className="crop-actions">
        <button className="crop-btn cancel" onClick={onCancel}>
          取消
        </button>
        <button className="crop-btn confirm" onClick={handleConfirm} disabled={!cropArea}>
          确认裁剪
        </button>
      </div>
    </div>
  )
}

export default ImageCropper
