import { useCallback, useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import FileUpload from 'Components/Common/FileUpload';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setImporttedPurchaseReceive,
  setImporttedPurchaseReceiveExcelData,
  setPurchaseOrderImportData,
} from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { getActiveItemGroupList } from 'Services/Settings/MiscMasterService';
import { MultiSelect } from 'primereact/multiselect';
import {
  getImportExcelFile,
  getPurchaseOrderByItemGroup,
} from 'Services/Purchase/purchaseOrderService';
import Loader from 'Components/Common/Loader';
import * as XLSX from 'xlsx';

// For all version support of csv or excel file
const csvFile =
  '.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

export default function ImportPurchaseEntryStepOne() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [itemGroupName, setItemGroupName] = useState();
  // const [purchaseList, setPurchaseList] = useState([]);
  const {
    importtedPurchaseReceive,
    purchaseOrderListByItemGroup,
    purchaseOrderImportData,
    purchaseOrderLoading,
  } = useSelector(({ purchaseOrder }) => purchaseOrder);
  const { activeItemGroupList } = useSelector(({ settings }) => settings);

  const { importItemGroupName, importPurchaseOrderList } =
    purchaseOrderImportData;

  useEffect(() => {
    dispatch(getActiveItemGroupList());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [importtedPurchaseReceive]);

  const handleChange = e => {
    // setItemGroupName(e.value);
    dispatch(
      setPurchaseOrderImportData({
        ...purchaseOrderImportData,
        importItemGroupName: e.value,
        importPurchaseOrderList: [],
      }),
    );
    dispatch(getPurchaseOrderByItemGroup(e.value));
  };

  const onCancel = useCallback(() => {
    navigate('/purchase-receive');
    dispatch(setImporttedPurchaseReceive([]));
  }, [dispatch, navigate]);

  const handleImportExcel = () => {
    if (importItemGroupName && importPurchaseOrderList?.length > 0) {
      const payload = {
        item_group: importItemGroupName,
        purchase_order: importPurchaseOrderList,
      };
      dispatch(getImportExcelFile(payload));
    }
  };

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
          dispatch(setImporttedPurchaseReceiveExcelData(updated));
        }
      };

      reader.readAsArrayBuffer(excelData);
    }
  }, [dispatch, importtedPurchaseReceive, navigate]);

  return (
    <>
      {purchaseOrderLoading && <Loader />}

      <div className="main_Wrapper">
        <div className="border rounded-3 bg_white">
          <div className="impoer_parties_step_head import_purchase_step_head import_data_receive">
            <h3>Import Purchase Receive</h3>
            <ul>
              <li className="active">
                <span>
                  Upload File <span className="line"></span>
                </span>
              </li>
              {/* <li>
                <span>
                  Map Columns <span className="line"></span>
                </span>
              </li> */}
              <li>
                <span>
                  Confirm Import <span className="line"></span>
                </span>
              </li>
            </ul>
          </div>
          <div className="import_parties_content import_purchase_content">
            <div className="import_parties_conttent_head p-3">
              <Row className="gy-2 align-items-end">
                <Col md={3}>
                  <div className="form_group">
                    <label htmlFor="Item_group">Item Group Name</label>
                    <div>
                      <ReactSelectSingle
                        // filter
                        options={activeItemGroupList[0]?.items}
                        placeholder="Select Item Group Name"
                        name="Item_group"
                        value={importItemGroupName}
                        onChange={e => handleChange(e)}
                      />
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="form_group">
                    <label htmlFor="Item_group">Purchase Order Listing</label>
                    <MultiSelect
                      filter
                      options={purchaseOrderListByItemGroup}
                      placeholder="Select Purchase Order"
                      value={importPurchaseOrderList}
                      className="w-100"
                      onChange={e => {
                        dispatch(
                          setPurchaseOrderImportData({
                            ...purchaseOrderImportData,
                            importPurchaseOrderList: e.value,
                          }),
                        );
                      }}
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <div className="button_group">
                    <Button className="btn_primary" onClick={handleImportExcel}>
                      Get Data
                    </Button>
                  </div>
                </Col>
              </Row>

              <h3 className="mb-2 mt-3 text-center">File Upload</h3>
              <p className="text-center text_light mb-4">
                Upload a File you want to import
              </p>
            </div>
            <div className="px-3">
              <FileUpload
                fileAccept={csvFile}
                setAccepttedFiles={setImporttedPurchaseReceive}
                accepttedFiles={importtedPurchaseReceive}
              />
            </div>
            <div className="button_group d-flex align-items-center justify-content-end p-3">
              <Button className="btn_border" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                className="btn_primary ms-3"
                // onClick={() => navigate('/import-purchase-entry-steptwo')}
                onClick={() => {
                  // navigate('/import-purchase-entry-stepthree')
                  // handleRender
                  navigate('/import-received-steptwo');
                }}
                disabled={
                  !importtedPurchaseReceive?.length || !importItemGroupName
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
