import { useState, useRef } from 'react';
import './ImageUploader.css';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function ImageUploader({ onImageUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return false;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('请上传 JPG、PNG、GIF 或 WebP 格式的图片');
      return false;
    }
    return true;
  };

  const handleFile = (file) => {
    setError(null);
    
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      if (onImageUpload) {
        onImageUpload(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <>
            <img src={preview} alt="预览" className="preview-image" />
            <button className="clear-button" onClick={handleClear}>
              ✕
            </button>
          </>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">📁</div>
            <p className="upload-text">点击或拖拽图片到此处上传</p>
            <p className="upload-hint">支持 JPG、PNG、GIF、WebP 格式</p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ImageUploader;
