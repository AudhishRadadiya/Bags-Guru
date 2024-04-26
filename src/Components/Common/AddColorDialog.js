import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { memo } from 'react';

const AddColorDialog = memo(
  ({ show, setShow, onSave, color, colorName, handleChange }) => {
    return (
      <>
        <Dialog
          header="Select Color"
          visible={!!show}
          draggable={false}
          className="modal_Wrapper modal_extra_small"
          onHide={() => setShow(false)}
        >
          <div className="newattiribute_content_wrap">
            <div className="form_group mb-3">
              <input
                type="color"
                className="w-100 border-0 rounded"
                onChange={e => handleChange('color', e.target.value)}
              />
              <p className="text-center">{color}</p>
              <div className="form_group my-3">
                <label htmlFor="color_name">Color Name</label>
                <InputText
                  id="color_name"
                  placeholder="Write Color name here"
                  name="color_name"
                  value={colorName || ''}
                  onChange={e => handleChange('color_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <Button className="btn_primary ms-auto" onClick={onSave}>
              Save
            </Button>
          </div>
        </Dialog>
      </>
    );
  },
);

export default AddColorDialog;
