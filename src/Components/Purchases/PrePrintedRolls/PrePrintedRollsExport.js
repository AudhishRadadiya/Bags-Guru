import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExportIcon from '../../../Assets/Images/export.svg';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getExportPrePrintedRollsExcel } from 'Services/Purchase/PrePrintedStatusService';

const PrePrintedRollsExport = ({ exportAccess }) => {
  const dispatch = useDispatch();

  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { searchQuery } = allCommon?.prePrintedStatus;

  const { applied, dates } = allFilters?.prePrintedStatus;

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
              disabled={exportAccess ? false : true}
            >
              <img src={ExportIcon} alt="" />
            </Dropdown.Toggle>
          </OverlayTrigger>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={e => {
                dispatch(
                  getExportPrePrintedRollsExcel(searchQuery, applied, dates),
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

export default memo(PrePrintedRollsExport);
