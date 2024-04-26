import FileUpload from 'Components/Common/FileUpload';
import { setImporttedParties } from 'Store/Reducers/Parties/parties.slice';
import { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// For all version support of csv or excel file
const csvFile =
  '.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

export default function ImportPartiesStepOne() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { importtedParties } = useSelector(({ parties }) => parties);

  const onCancel = useCallback(() => {
    navigate('/parties');
    dispatch(setImporttedParties([]));
  }, [dispatch, navigate]);

  return (
    <div className="main_Wrapper">
      <div className="import_parti_wrapper border rounded-3 bg_white">
        <div className="impoer_parties_step_head">
          <h3>Import Parties </h3>
          <ul>
            <li className="active">
              <span>
                Upload File <span className="line"></span>
              </span>
            </li>
            <li>
              <span>
                Map Columns <span className="line"></span>
              </span>
            </li>
            <li>
              <span>
                Confirm Import <span className="line"></span>
              </span>
            </li>
          </ul>
        </div>
        <div className="import_parties_content">
          <div className="import_parties_conttent_head p-3">
            <h3 className="mb-2 mt-3 text-center">File Upload</h3>
            <p className="text-center text_light mb-4">
              Upload a File you want to import
            </p>
          </div>
          <div className="px-3">
            <FileUpload
              fileAccept={csvFile}
              setAccepttedFiles={setImporttedParties}
              accepttedFiles={importtedParties}
            />
          </div>
          <div className="button_group d-flex align-items-center justify-content-end p-3">
            <Button className="btn_border" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              className="btn_primary ms-3"
              onClick={() => {
                // navigate('/import-parties-map-columns')
                navigate('/import-parties-steptwo');
              }}
              disabled={!importtedParties?.length}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
