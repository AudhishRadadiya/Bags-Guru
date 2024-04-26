import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import { Calendar } from 'primereact/calendar';
import {
  setImporttedPurchaseReceive,
  setImporttedPurchaseReceiveExcelData,
} from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import ReactTable from 'Components/Common/ReactTable';
import {
  convertIntoNumber,
  excelSerialDateToUTC,
  getFormattedDate,
} from 'Helper/Common';
import { importPurchaseOrderReceived } from 'Services/Purchase/purchaseOrderService';
import { toast } from 'react-toastify';

const convertToTitleCase = str => {
  const words = str.split('_');
  const convertedStr = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return convertedStr;
};

export default function ImportPurchaseEntryStepThree() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const {
    importtedPurchaseReceive,
    importtedPurchaseReceiveExcelData,
    purchaseOrderLoading,
    purchaseOrderImportData,
  } = useSelector(({ purchaseOrder }) => purchaseOrder);

  const { activeItemGroupList } = useSelector(({ settings }) => settings);
  const { importItemGroupName } = purchaseOrderImportData;

  const findItemGroupName = activeItemGroupList[0]?.items?.find(
    item => item?.value === importItemGroupName,
  );

  useEffect(() => {
    loadTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key, val, id, tabledata) => {
    if (tabledata?.length) {
      let dataList = [...tabledata];
      dataList[id].show[key] = val;
      setData(dataList);
    }
  };

  const moveToBasePage = useCallback(() => {
    dispatch(setImporttedPurchaseReceive([]));
    dispatch(setImporttedPurchaseReceiveExcelData([]));
    navigate('/purchase-receive');
  }, [dispatch, navigate]);

  const loadTableData = () => {
    if (
      !importtedPurchaseReceiveExcelData?.length &&
      !importtedPurchaseReceive?.length
    ) {
      // navigate('/import-purchase-entry-stepone');
      navigate('/import-received-stepone');
      return;
    }

    if (
      importtedPurchaseReceiveExcelData?.length &&
      importtedPurchaseReceive?.length
    ) {
      const headers = importtedPurchaseReceiveExcelData[0];
      const tableData = importtedPurchaseReceiveExcelData
        ?.slice(1)
        ?.map((rowData, i) => {
          const showData = Object.fromEntries(
            headers?.map((header, j) => {
              const value =
                header === 'date'
                  ? excelSerialDateToUTC(rowData[j]) || ''
                  : header?.toLowerCase() === 'width'
                  ? rowData[j]
                    ? `${rowData[j]}”`
                    : ''
                  : header?.toLowerCase() === 'net weight'
                  ? rowData[j]
                    ? convertIntoNumber(rowData[j])
                    : ''
                  : header?.toLowerCase() === 'rate'
                  ? rowData[j]
                    ? `₹${rowData[j]}`
                    : ''
                  : rowData[j]?.toString() || '';
              return [header, value];
            }),
          );
          // return { show: { id: i + 1, ...showData } };
          return { show: showData };
        });

      setData(tableData);

      const tableColumns = headers.map(header => ({
        Header: convertToTitleCase(header),
        accessor: `show.${header}`,
        Cell: ({ row, value }) => {
          const html = getHTMLForParty(value, header, row?.id, tableData);
          return <div className="form_group text-start">{html}</div>;
        },
      }));

      setColumns(tableColumns);
    }
  };

  const getHTMLForParty = (value, header, id, tableData) => {
    if (header === 'date') {
      // const convertedDate =
      //   typeof value === 'number' ? excelSerialDateToUTC(value) : value;
      return (
        <div className="date_select_wrapper">
          <Calendar
            id="ReceiveDate"
            placeholder="Select Receive Date"
            showIcon
            showButtonBar
            dateFormat="dd-mm-yy"
            name="date"
            value={value}
            onChange={e => handleChange(header, e.value, id, tableData)}
          />
        </div>
      );
    } else {
      // return (
      //   <InputText
      //     value={value}
      //     onChange={e => handleChange(header, e.target.value, id, tableData)}
      //   />
      // );
      return <span>{value}</span>;
    }
  };

  const onSave = async () => {
    let payload = [...data];

    const checkValidations = payload?.some(item => {
      const newObj = {};

      for (const key in item.show) {
        if (Object.prototype.hasOwnProperty.call(item.show, key)) {
          const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
          newObj[normalizedKey] = item.show[key];
        }
      }
      if (
        findItemGroupName?.label?.toLowerCase() === 'roll' &&
        (!newObj?.rate || !newObj?.net_weight || !newObj?.id)
      ) {
        return true;
      } else if (!newObj?.rate || !newObj?.net_weight) {
        return true;
      }
    });

    const updated = payload?.map(item => {
      const newObj = {};
      for (const key in item.show) {
        if (Object.prototype.hasOwnProperty.call(item.show, key)) {
          const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
          newObj[normalizedKey] = item.show[key];
        }
      }
      return newObj;
    });

    const newPayload = {
      purchase_data: updated?.map(x => {
        const rate = parseFloat(x?.rate?.replace(/[^\d.-]/g, ''));
        const width = parseFloat(x?.width?.replace(/[^\d.-]/g, ''));

        if (findItemGroupName?.label?.toLowerCase() === 'roll') {
          return {
            po_number: Number(x?.po_number),
            color: x?.color,
            width: width,
            is_mm: x?.is_mm?.toLowerCase() === 'yes' ? 1 : 0,
            gsm: Number(x?.gsm),
            design_name: x?.design_name,
            lamination: x?.lamination,
            texture: x?.texture,
            material: x?.material,
            cylinder_charge: Number(x?.cylinder_charge),
            id: x?.id,
            length: Number(x?.length),
            net_weight: String(x?.net_weight),
            rate: rate,
            rate_in: x?.rate_in,
            date: getFormattedDate(new Date()),
            // item_no: Number(x.show?.item_no),
            // date: getFormattedDate(x.show?.date),
          };
        } else if (findItemGroupName?.label?.toLowerCase() === 'carton') {
          return {
            po_number: Number(x?.po_number),
            ply: x?.ply,
            width: width,
            is_mm: x?.is_mm?.toLowerCase() === 'yes' ? 1 : 0,
            height: x?.height,
            length: Number(x?.length),
            net_weight: String(x?.net_weight),
            rate: rate,
            date: getFormattedDate(new Date()),
          };
        } else if (findItemGroupName?.label?.toLowerCase() === 'ink') {
          return {
            po_number: Number(x?.po_number),
            color: x?.color,
            ink_type: x?.ink_type,
            net_weight: String(x?.net_weight),
            rate: rate,
            date: getFormattedDate(new Date()),
          };
        } else {
          return {
            po_number: Number(x?.po_number),
            name: x?.name,
            net_weight: String(x?.net_weight),
            rate: rate,
            date: getFormattedDate(new Date()),
          };
        }
      }),
    };

    if (data?.length > 500) {
      toast.error('You can only upload upto 500 records at a time!');
    } else if (checkValidations) {
      toast.error('Please fill the valid data in the Excel file');
    } else {
      const result = await dispatch(importPurchaseOrderReceived(newPayload));
      if (result) {
        moveToBasePage();
      }
    }
  };

  return (
    <div className="main_Wrapper">
      {purchaseOrderLoading && <Loader />}
      <div className="import_parti_wrapper border rounded-3 bg_white">
        <div className="impoer_parties_step_head import_purchase_step_head">
          <h3>Import Purchase Receive</h3>
          <ul>
            <li className="complete">
              <span>
                Upload File <span className="line"></span>
              </span>
            </li>
            {/* <li className="complete">
              <span>
                Map Columns <span className="line"></span>
              </span>
            </li> */}
            <li className="active">
              <span>
                Confirm Import <span className="line"></span>
              </span>
            </li>
          </ul>
        </div>
        <div className="import_parties_content">
          <div className="import_parties_conttent_head p-3">
            <h3 className="mb-2 mt-3 text-center">Import Records</h3>
            <p className="text-center text_light mb-4">
              {/* Showing 1-5 of 5 imported records */}
              {`Showing ${data?.length} entries`}
            </p>
          </div>
          <div className="table_wrapper import_record_table">
            <ReactTable columns={columns} data={data} />
          </div>
          <div className="button_group d-flex align-items-center justify-content-end p-3">
            <Button className="btn_border" onClick={moveToBasePage}>
              Cancel
            </Button>
            <Button
              className="btn_border mx-3"
              // onClick={() => navigate('/import-purchase-entry-steptwo')}
              onClick={() => {
                // navigate('/import-purchase-entry-stepone')
                navigate('/import-received-stepone');
              }}
            >
              Previous
            </Button>
            <Button className="btn_primary" onClick={onSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
