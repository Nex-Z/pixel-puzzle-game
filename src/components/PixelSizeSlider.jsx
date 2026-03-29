import './PixelSizeSlider.css';

function PixelSizeSlider({ value = 8, onChange, min = 4, max = 32 }) {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="pixel-size-slider">
      <div className="slider-header">
        <label className="slider-label">像素大小</label>
        <span className="slider-value">{value}px</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="slider-input"
      />
      <div className="slider-marks">
        <span>{min}px</span>
        <span>{max}px</span>
      </div>
    </div>
  );
}

export default PixelSizeSlider;
