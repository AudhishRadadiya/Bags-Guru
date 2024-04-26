import { memo } from 'react';
import { useDispatch } from 'react-redux';
import ExportIcon from '../../../Assets/Images/export.svg';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getExportMfgExcel } from 'Services/Production/mfgLiveServices';

const MFGLiveExport = ({
  searchQuery,
  applied,
  dates,
  field_filter,
  exportAcces,
}) => {
  const dispatch = useDispatch();
  return (
    <div>
      <li>
        <Dropdown className="dropdown_common export_dropdown position-static">
          <OverlayTrigger
            overlay={props => <Tooltip {...props}>Export</Tooltip>}
            placement="bottom"
          >
            <Dropdown.Toggle
              id="dropdown-basic"
              className="btn_border icon_btn"
              disabled={exportAcces ? false : true}
            >
              <img src={ExportIcon} alt="" />
            </Dropdown.Toggle>
          </OverlayTrigger>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={e => {
                dispatch(
                  getExportMfgExcel(searchQuery, applied, dates, field_filter),
                );
              }}
            >
              XLS
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    </div>
  );
};

export default memo(MFGLiveExport);
