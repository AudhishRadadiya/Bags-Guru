import { memo, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { resetImageComparePrompt } from 'Services/Settings/MiscMasterService';

const ResetImageComparePrompt = ({ visible, onHide, onSuccess }) => {
  const dispatch = useDispatch();
  const { miscMasterCRUDLoading } = useSelector(({ miscMaster }) => miscMaster);

  const handleConfirm = useCallback(async () => {
    const result = await dispatch(resetImageComparePrompt());

    if (result) {
      onSuccess?.();
      onHide();
    }
  }, [dispatch, onHide, onSuccess]);

  return (
    <Dialog
      header="Reset Confirmation"
      visible={visible}
      draggable={false}
      className="modal_Wrapper modal_small"
      onHide={onHide}
    >
      <div className="delete_wrapper py-4">
        <p className="text-center">
          Are you sure you want to reset the prompt to factory default?
        </p>
      </div>

      <div className="d-flex justify-content-center">
        <Button className="btn_border" onClick={onHide}>
          Cancel
        </Button>

        <Button
          className="btn_primary ms-3"
          onClick={handleConfirm}
          disabled={miscMasterCRUDLoading}
        >
          Reset Prompt
        </Button>
      </div>
    </Dialog>
  );
};

export default memo(ResetImageComparePrompt);
