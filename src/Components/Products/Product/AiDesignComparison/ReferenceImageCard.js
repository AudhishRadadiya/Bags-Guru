import { memo } from 'react';
import { Checkbox } from 'primereact/checkbox';

const ReferenceImageCard = ({ image, isSelected, onToggle }) => {
  const handleCardClick = () => {
    onToggle(image.image_url);
  };

  const handleCheckboxChange = e => {
    e?.originalEvent?.stopPropagation();

    onToggle(image.image_url);
  };

  const stopPropagation = e => e.stopPropagation();

  return (
    <div
      className={`reference_image_card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
    >
      <div
        className="reference_image_card_check"
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
      >
        <Checkbox
          inputId={`ref-${image.id}`}
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
      </div>

      <div className="reference_image_card_img">
        <img src={image.image_url} alt={image.image_name} />
      </div>

      <div className="reference_image_card_info">
        {image.label ? (
          <span className="reference_image_label">{image.label}</span>
        ) : null}

        <p className="reference_image_name" title={image.image_name}>
          {image.image_name}
        </p>
      </div>
    </div>
  );
};

export default memo(ReferenceImageCard);
