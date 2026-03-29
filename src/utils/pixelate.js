export function pixelateImage(imageData, pixelSize) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const { width, height, data } = imageData;
  
  canvas.width = width;
  canvas.height = height;
  
  const outputData = ctx.createImageData(width, height);
  
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      let r = 0, g = 0, b = 0, a = 0;
      let count = 0;
      
      for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
          count++;
        }
      }
      
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      a = Math.round(a / count);
      
      for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          outputData.data[i] = r;
          outputData.data[i + 1] = g;
          outputData.data[i + 2] = b;
          outputData.data[i + 3] = a;
        }
      }
    }
  }
  
  ctx.putImageData(outputData, 0, 0);
  
  return canvas;
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getImageData(imgSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (e) => reject(new Error('图片加载失败: ' + (e.message || '未知错误')));
    img.src = typeof imgSrc === 'string' ? imgSrc : imgSrc.src;
  });
}
