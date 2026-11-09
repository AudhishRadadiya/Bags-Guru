import { memo, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'react-bootstrap';
import ReferenceImageCard from './ReferenceImageCard';
import ComparisonResultSection from './ComparisonResultSection';
import Loader from 'Components/Common/Loader';
import UploadIcon from '../../../../Assets/Images/upload.svg';
import { useSelector } from 'react-redux';

const AiDesignComparisonDialog = ({
  visible,
  onHide,
  mainImage,
  mainImageName,
  comparison,
  onApprove,
}) => {
  const fileInputRef = useRef(null);

  const { customerReferenceImages, productLoading, productCRUDLoading } =
    useSelector(({ product }) => product);

  const {
    state,
    allImages,
    selectedCount,
    maxSelection,
    toggleImageSelection,
    uploadExtraReference,
    runComparison,
  } = comparison;

  const { selectedReferenceImages, isCompared } = state;

  // const customerGroupName =
  //   productMeta?.customerGroupName || productMeta?.customer_group_name || '—';
  // const designerName =
  //   productMeta?.designerName || productMeta?.designer_name || '—';

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (file) uploadExtraReference(file);
    // e.target.value = '';
  };

  const dialogFooter = (
    <div className="ai_comparison_footer">
      <Button
        className="btn_primary ms-3 ai_compare_btn"
        onClick={() => {
          if (isCompared || !mainImage) return;
          runComparison(mainImage);
        }}
        disabled={isCompared || !mainImage}
      >
        {isCompared ? 'Compared' : 'Compare with AI'}
      </Button>
      <Button
        className="btn_border ms-3"
        onClick={onHide}
        disabled={productCRUDLoading}
      >
        Rejected
      </Button>
      <Button
        className="btn_primary ms-3"
        onClick={onApprove}
        disabled={productCRUDLoading}
      >
        Approved
      </Button>
    </div>
  );

  return (
    <Dialog
      header="AI Design Comparison"
      visible={visible}
      draggable={false}
      className="modal_Wrapper ai_design_comparison_dialog"
      onHide={onHide}
      style={{ width: '95vw', maxWidth: '1400px' }}
      footer={dialogFooter}
    >
      {(productCRUDLoading || productLoading) && <Loader />}

      <div className="ai_comparison_panels">
        <div className="ai_comparison_panel main_design_panel">
          <h5>Main Design Image</h5>
          <div className="main_design_preview">
            {mainImage ? (
              <img src={mainImage} alt={mainImageName || 'Main design'} />
            ) : (
              <div className="main_design_empty">
                <p>No main image uploaded</p>
              </div>
            )}
          </div>
          {mainImageName ? (
            <p className="image_file_name">{mainImageName}</p>
          ) : null}
          {mainImage ? (
            <span className="saved_product_badge">Saved Product Image</span>
          ) : null}
        </div>

        <div className="ai_comparison_panel reference_panel">
          <div className="reference_panel_content">
            <div className="reference_panel_header">
              <h5>Reference Images</h5>
              <span className="reference_tab_active">
                Fetched from Customer History (
                {customerReferenceImages?.reference_images?.length ?? 0})
              </span>
            </div>

            <div className="reference_images_row">
              <div className="reference_images_scroll">
                {allImages.map(image => (
                  <ReferenceImageCard
                    key={image.id}
                    image={image}
                    isSelected={selectedReferenceImages.includes(
                      image.image_url,
                    )}
                    onToggle={toggleImageSelection}
                  />
                ))}
              </div>

              <div className="add_extra_reference_wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="d-none"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="add_extra_reference_btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img src={UploadIcon} alt="" />
                  <span>Add Extra Reference</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="reference_selection_hint">
              You can select 1 to {maxSelection} references to compare
            </p>
            <p className="reference_selection_count">
              Selected {selectedCount} of {maxSelection}
            </p>
          </div>
        </div>
      </div>

      <ComparisonResultSection />
    </Dialog>
  );
};

export default memo(AiDesignComparisonDialog);
