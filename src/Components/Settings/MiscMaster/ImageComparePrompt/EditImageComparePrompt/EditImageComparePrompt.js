import { memo, useCallback, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { updateImageComparePrompt } from 'Services/Settings/MiscMasterService';
import ImageComparePromptForm, {
  getImageComparePromptInitialValues,
} from './ImageComparePromptForm';

const EditImageComparePrompt = ({ visible, editData, onHide, onSuccess }) => {
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const { miscMasterCRUDLoading } = useSelector(({ miscMaster }) => miscMaster);

  const handleHide = useCallback(() => {
    formRef.current?.resetForm();
    onHide();
  }, [onHide]);

  const handleSave = useCallback(async () => {
    const values = await formRef.current?.submitForm();
    if (!values) return;

    const result = await dispatch(
      updateImageComparePrompt({
        title: values?.title,
        instructions: values?.instructions,
        categories: values?.categories,
        provider: values?.provider,
        model_name: values?.model_name,
      }),
    );

    if (result) {
      formRef.current?.resetForm();
      onSuccess?.();
      onHide();
    }
  }, [dispatch, onHide, onSuccess]);

  return (
    <Dialog
      header="Edit Image Compare Prompt"
      visible={visible}
      draggable={false}
      className="modal_Wrapper modal_medium"
      onHide={handleHide}
    >
      <ImageComparePromptForm
        ref={formRef}
        initialValues={getImageComparePromptInitialValues(editData)}
        availableProviders={editData?.available_providers || []}
      />

      <div className="button_group d-flex align-items-center justify-content-end pt-3">
        <button
          type="button"
          className="btn_border btn btn-primary"
          onClick={handleHide}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn_primary ms-3 btn btn-primary"
          onClick={handleSave}
          disabled={miscMasterCRUDLoading}
        >
          Update
        </button>
      </div>
    </Dialog>
  );
};

export default memo(EditImageComparePrompt);
