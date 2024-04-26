import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { memo } from 'react';

const AddItemGroupDialog = memo(
  ({ show, setShow, onSave, name, is_active, handleChange }) => {
    return (
      <>
        <Dialog
          header="Add Item Group"
          visible={!!show}
          draggable={false}
          className="modal_Wrapper modal_small z_index_max"
          onHide={() => setShow(false)}
        >
          <div className="newattiribute_content_wrap">
            <div className="form_group mb-3">
              <div className="form_group my-3">
                <label htmlFor="item_group_name">Name</label>
                <InputText
                  id="item_group_name"
                  placeholder="Write Item Group name here"
                  name="name"
                  value={name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="form_group checkbox_wrap">
                <Checkbox
                  inputId="Active"
                  name="is_active"
                  value={is_active}
                  checked={is_active === 1}
                  onChange={e =>
                    handleChange('is_active', e.target.checked ? 1 : 0)
                  }
                  required
                />
                <label htmlFor="Active">Is Active</label>
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

export default AddItemGroupDialog;
