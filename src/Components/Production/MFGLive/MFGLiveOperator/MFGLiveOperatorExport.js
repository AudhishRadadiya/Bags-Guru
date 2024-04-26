import { Dropdown } from 'react-bootstrap';
import ExportIcon from '../../../../Assets/Images/export.svg';

export default function MFGLiveOperatorExport({ onExport }) {
  return (
    <div>
      <li>
        <Dropdown className="dropdown_common export_dropdown position-static">
          <Dropdown.Toggle id="dropdown-basic" className="btn_border icon_btn">
            <img src={ExportIcon} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onExport('pdf')}>PDF</Dropdown.Item>
            <Dropdown.Item onClick={() => onExport('excel')}>XLS</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    </div>
  );
}
