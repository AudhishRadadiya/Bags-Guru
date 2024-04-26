import { useCallback, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'react-bootstrap';
import { Column } from 'primereact/column';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { useDispatch } from 'react-redux';
import { setImporttedPurchaseReceiveExcelData } from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import SearchIcon from '../../Assets/Images/search.svg';
import { excelSerialDateToUTC } from 'Helper/Common';
import { Calendar } from 'primereact/calendar';

// export const givenData = [
//   { label: 'po_number', value: 'po_number' },
//   { label: 'date', value: 'date' },
//   { label: 'item_no', value: 'item_no' },
//   { label: 'id', value: 'id' },
//   { label: 'length', value: 'length' },
//   { label: 'net_weight', value: 'net_weight' },
//   { label: 'rate', value: 'rate' },
// ];

// export const givenData = [
//   { label: 'po_number', value: 'po_number' },
//   { label: 'width', value: 'width' },
//   { label: 'is_mm', value: 'is_mm' },
//   { label: 'color', value: 'color' },
//   { label: 'ink_type', value: 'ink_type' },
//   { label: 'ply', value: 'ply' },
//   { label: 'name', value: 'name' },
//   { label: 'height', value: 'height' },
//   { label: 'gsm', value: 'gsm' },
//   { label: 'design_name', value: 'design_name' },
//   { label: 'texture', value: 'texture' },
//   { label: 'lamination', value: 'lamination' },
//   // { label: 'item_no', value: 'item_no' },
//   { label: 'id', value: 'id' },
//   { label: 'length', value: 'length' },
//   { label: 'net_weight', value: 'net_weight' },
//   { label: 'rate', value: 'rate' },
//   { label: 'date', value: 'date' },
// ];

export const givenRollData = [
  { label: 'po_number', value: 'po_number' },
  { label: 'color', value: 'color' },
  { label: 'width', value: 'width' },
  { label: 'is_mm', value: 'is_mm' },
  { label: 'gsm', value: 'gsm' },
  { label: 'design_name', value: 'design_name' },
  { label: 'lamination', value: 'lamination' },
  { label: 'texture', value: 'texture' },
  { label: 'material', value: 'material' },
  { label: 'cylinder_charge', value: 'cylinder_charge' },
  { label: 'id', value: 'id' },
  { label: 'length', value: 'length' },
  { label: 'net_weight', value: 'net_weight' },
  { label: 'rate', value: 'rate' },
];

export const givenCartonData = [
  { label: 'po_number', value: 'po_number' },
  { label: 'ply', value: 'ply' },
  { label: 'width', value: 'width' },
  { label: 'is_mm', value: 'is_mm' },
  { label: 'height', value: 'height' },
  { label: 'length', value: 'length' },
  { label: 'net_weight', value: 'net_weight' },
  { label: 'rate', value: 'rate' },
];

export const givenInkData = [
  { label: 'po_number', value: 'po_number' },
  { label: 'color', value: 'color' },
  { label: 'ink_type', value: 'ink_type' },
  { label: 'net_weight', value: 'net_weight' },
  { label: 'rate', value: 'rate' },
];

export const givenSellotapeData = [
  { label: 'po_number', value: 'po_number' },
  { label: 'name', value: 'name' },
  { label: 'net_weight', value: 'net_weight' },
  { label: 'rate', value: 'rate' },
];

export default function ImportPurchaseEntryStepTwo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { state, pathname } = useLocation();

  const {
    importtedPurchaseReceive,
    importtedPurchaseReceiveExcelData,
    purchaseOrderImportData,
  } = useSelector(({ purchaseOrder }) => purchaseOrder);
  const { activeItemGroupList } = useSelector(({ settings }) => settings);

  const {
    importItemGroupName,
    // importPurchaseOrderList,
    // purchaseOrderImportExcel,
  } = purchaseOrderImportData;

  const findItemGroupName = activeItemGroupList[0]?.items?.find(
    item => item?.value === importItemGroupName,
  );

  const givenData =
    findItemGroupName?.label?.toLowerCase() === 'roll'
      ? givenRollData
      : findItemGroupName?.label?.toLowerCase() === 'carton'
      ? givenCartonData
      : findItemGroupName?.label?.toLowerCase() === 'ink'
      ? givenInkData
      : findItemGroupName?.label?.toLowerCase() === 'sellotape'
      ? givenSellotapeData
      : [];

  const [data, setData] = useState([]);
  const [purchaseReceiveData, setPurchaseReceiveData] = useState([]);
  const [dropDownList, setDropDownList] = useState(givenData);
  const [filterToggle, setFilterToggle] = useState(false);

  const loadData = useCallback(async () => {
    if (importtedPurchaseReceive?.length < 1) {
      // navigate('/import-purchase-entry-stepone');
      navigate('/import-received-stepone');
    } else {
      const excelData = importtedPurchaseReceive?.[0]?.file;
      const reader = new FileReader();

      reader.onload = async e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Access the first sheet in the workbook
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        let updated = jsonData?.filter(x => x?.length > 0);

        if (updated?.length > 0) {
          updated?.shift();
          setPurchaseReceiveData(updated);
          dispatch(setImporttedPurchaseReceiveExcelData(updated));
        }
      };

      reader.readAsArrayBuffer(excelData);
    }
  }, [dispatch, importtedPurchaseReceive, navigate]);

  const loadRequiredData = useCallback(() => {
    let newArr = [];
    for (let i = 0; i < purchaseReceiveData[0]?.length; i++) {
      newArr.push({
        id: i,
        importedHeader: purchaseReceiveData?.[0]?.[i] || '',
        systemHeader:
          purchaseReceiveData?.[0]?.[i] === givenData?.[i]?.label
            ? givenData?.[i]?.value
            : '',
        sample: purchaseReceiveData?.[1]?.[i] || '',
      });
    }

    const filtered = givenData?.filter(
      (x, i) => newArr?.[i]?.importedHeader !== x?.label,
    );

    setDropDownList(filtered);
    setData(newArr);
  }, [purchaseReceiveData]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (importtedPurchaseReceive) loadRequiredData();
  }, [importtedPurchaseReceive, loadRequiredData]);

  const importedHeaderTemplate = row => {
    return (
      <div className="form_group">
        <InputText value={row?.importedHeader || ''} />
      </div>
    );
  };

  const systemHeaderTemplate = row => {
    return (
      <ReactSelectSingle
        filter
        value={row?.systemHeader}
        options={row?.systemHeader ? givenData : dropDownList}
        onChange={e => handleChange(e.target.value, row?.id)}
        placeholder="Address Type"
      />
    );
  };

  const sampleTemplate = row => {
    if (row?.importedHeader === 'date') {
      const convertedDate = excelSerialDateToUTC(row?.sample);
      return (
        <div className="date_select_wrapper">
          <Calendar
            id="ReceiveDate"
            placeholder="Select Receive Date"
            showIcon
            showButtonBar
            dateFormat="dd-mm-yy"
            name="date"
            value={convertedDate || ''}
            disabled
            // onChange={handleChange}
          />
        </div>
      );
    } else {
      return (
        <div className="form_group">
          <InputText value={row?.sample || ''} />
        </div>
      );
    }
  };

  const handleChange = useCallback(
    (val, itemId) => {
      let list = [...data];
      list[itemId].systemHeader = val;
      setData(list);

      let updatedParty = [...importtedPurchaseReceiveExcelData[0]];
      let tableData = importtedPurchaseReceiveExcelData?.slice(1);
      updatedParty[itemId] = val;
      updatedParty = [updatedParty, ...tableData];
      dispatch(setImporttedPurchaseReceiveExcelData(updatedParty));

      const filtered = dropDownList?.filter((x, i) => val !== x?.label);
      setDropDownList(filtered);
    },
    [data, dispatch, dropDownList, importtedPurchaseReceiveExcelData],
  );

  return (
    <div className="main_Wrapper">
      <div className="import_parti_wrapper border rounded-3 bg_white">
        <div className="impoer_parties_step_head ">
          <h3>Import Purchase Receive</h3>
          <ul>
            <li className="complete">
              <span>
                Upload File <span className="line"></span>
              </span>
            </li>
            <li className="active">
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
            <h3 className="mb-2 mt-3 text-center">Column Mapper</h3>
            <p className="text-center text_light mb-4">
              Map your columns with headers present in the system
            </p>
          </div>

          <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter min_input_table roll_consumpsion_wrapper">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() => {
                setFilterToggle(!filterToggle);
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={data}
              selectionMode="false"
              rows={10}
              filterDisplay="row"
              dataKey="_id"
            >
              <Column
                field="importedHeader"
                header="Imported Header"
                body={importedHeaderTemplate}
                sortable
                filter={filterToggle}
              />
              <Column
                field="systemHeader"
                header="System Header"
                body={systemHeaderTemplate}
                sortable
                filter={filterToggle}
              />
              <Column
                field="sample"
                header="Sample"
                sortable
                body={sampleTemplate}
                filter={filterToggle}
              />
            </DataTable>
          </div>

          <div className="button_group d-flex align-items-center justify-content-end p-3">
            <Button
              className="btn_border"
              onClick={() => navigate('/purchase-receive')}
            >
              Cancel
            </Button>
            <Button
              className="btn_border mx-3"
              onClick={() => {
                //  navigate('/import-purchase-entry-stepone')
                navigate('/import-received-stepone');
              }}
            >
              Previous
            </Button>
            <Button
              className="btn_primary"
              onClick={() => {
                // navigate('/import-purchase-entry-stepthree')
                navigate('/import-received-steptwo');
              }}
              disabled={dropDownList?.length > 0 ? true : false}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
