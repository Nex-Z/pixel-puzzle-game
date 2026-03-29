export function cropImage(imageSrc, cropArea, imageSize) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    if (!imageSrc.startsWith('data:')) {
      img.crossOrigin = 'anonymous'
    }

    img.onload = () => {
      const scaleX = img.width / imageSize.width
      const scaleY = img.height / imageSize.height

      const cropX = Math.round(cropArea.x * scaleX)
      const cropY = Math.round(cropArea.y * scaleY)
      const cropWidth = Math.round(cropArea.size * scaleX)
      const cropHeight = Math.round(cropArea.size * scaleY)

      const canvas = document.createElement('canvas')
      canvas.width = cropWidth
      canvas.height = cropHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法获取Canvas上下文'))
        return
      }

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      )

      resolve(canvas)
    }

    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }

    img.src = imageSrc
  })
}

export function getImageDimensions(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    if (!imageSrc.startsWith('data:')) {
      img.crossOrigin = 'anonymous'
    }

    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }

    img.src = imageSrc
  })
}
