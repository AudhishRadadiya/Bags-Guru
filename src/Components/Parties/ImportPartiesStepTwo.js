import { InputText } from 'primereact/inputtext';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { useDispatch } from 'react-redux';
import { setImporttedPartyExcelData } from 'Store/Reducers/Parties/parties.slice';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SearchIcon from '../../Assets/Images/search.svg';

export const givenData = [
  { label: 'party_type', value: 'party_type' },
  { label: 'party_name', value: 'party_name' },
  { label: 'person_name', value: 'person_name' },
  { label: 'personal_email', value: 'personal_email' },
  { label: 'personal_contact_no', value: 'personal_contact_no' },
  { label: 'website', value: 'website' },
  {
    label: 'is_mobile_app_registered',
    value: 'is_mobile_app_registered',
  },
  { label: 'bag_rate_list', value: 'bag_rate_list' },
  { label: 'register_mobile_number', value: 'register_mobile_number' },
  { label: 'register_email', value: 'register_email' },
  { label: 'pan_no', value: 'pan_no' },
  { label: 'original_advisor', value: 'original_advisor' },
  { label: 'present_advisor', value: 'present_advisor' },
  { label: 'market', value: 'market' },
  { label: 'industry', value: 'industry' },
  { label: 'customer_source', value: 'customer_source' },
  { label: 'customer_source_detail', value: 'customer_source_detail' },
  { label: 'customer_rating', value: 'customer_rating' },
  { label: 'collection_person_name', value: 'collection_person_name' },
  { label: 'payment_terms', value: 'payment_terms' },
  {
    label: 'collection_person_whatsapp_no',
    value: 'collection_person_whatsapp_no',
  },
  {
    label: 'collection_person_other_mobile_no',
    value: 'collection_person_other_mobile_no',
  },
  { label: 'repeat_order_days', value: 'repeat_order_days' },
  { label: 'dnd_for_payment', value: 'dnd_for_payment' },
  { label: 'company_logo', value: 'company_logo' },
  { label: 'comment', value: 'comment' },
  // { label: 'is_regular_customer', value: 'is_regular_customer' },
  { label: 'is_active', value: 'is_active' },
  // { label: 'party_address', value: 'party_address' },
  { label: 'address_type', value: 'address_type' },
  { label: 'business_name', value: 'business_name' },
  { label: 'gstin', value: 'gstin' },
  { label: 'tripta_code', value: 'tripta_code' },
  { label: 'address', value: 'address' },
  { label: 'pincode', value: 'pincode' },
  { label: 'city', value: 'city' },
  { label: 'state', value: 'state' },
  { label: 'country', value: 'country' },
  { label: 'is_default', value: 'is_default' },
  { label: 'is_same_as_shipping', value: 'is_same_as_shipping' },
];

export default function ImportPartiesStepTwo({ hasAccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [partyData, setPartyData] = useState([]);
  const [dropDownList, setDropDownList] = useState(givenData);
  const [filterToggle, setFilterToggle] = useState(false);

  const { importtedParties, importtedPartiesExcelData } = useSelector(
    ({ parties }) => parties,
  );

  const loadData = useCallback(async () => {
    if (importtedParties?.length < 1) {
      navigate('/import-parties');
    } else {
      const excelData = importtedParties?.[0]?.file;

      const reader = new FileReader();

      reader.onload = async e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Access the first sheet in the workbook
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const updated = jsonData?.filter(x => x?.length > 0);

        setPartyData(updated);
        if (updated?.length > 0) dispatch(setImporttedPartyExcelData(updated));
      };

      reader.readAsArrayBuffer(excelData);
    }
  }, [dispatch, importtedParties, navigate]);

  const loadRequiredData = useCallback(() => {
    let newArr = [];
    for (let i = 0; i < partyData[0]?.length; i++) {
      newArr.push({
        id: i,
        importedHeader: partyData?.[0]?.[i] || '',
        systemHeader:
          partyData?.[0]?.[i] === givenData?.[i]?.label
            ? givenData?.[i]?.value
            : '',
        sample: partyData?.[1]?.[i] || '',
      });
    }

    const filtered = givenData?.filter(
      (x, i) => newArr?.[i]?.importedHeader !== x?.label,
    );

    setDropDownList(filtered);
    setData(newArr);
  }, [partyData]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (importtedParties) loadRequiredData();
  }, [importtedParties, loadRequiredData]);

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
    return (
      <div className="form_group">
        <InputText value={row?.sample || ''} />
      </div>
    );
  };

  const handleChange = useCallback(
    (val, itemId) => {
      let list = [...data];
      list[itemId].systemHeader = val;
      setData(list);

      let updatedParty = [...importtedPartiesExcelData[0]];
      let tableData = importtedPartiesExcelData?.slice(1);
      updatedParty[itemId] = val;
      updatedParty = [updatedParty, ...tableData];
      dispatch(setImporttedPartyExcelData(updatedParty));

      const filtered = dropDownList?.filter((x, i) => val !== x?.label);
      setDropDownList(filtered);
    },
    [data, dispatch, dropDownList, importtedPartiesExcelData],
  );

  return (
    <div className="main_Wrapper">
      <div className="import_parti_wrapper border rounded-3 bg_white">
        <div className="impoer_parties_step_head">
          <h3>Import Parties </h3>
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
            <Button className="btn_border" onClick={() => navigate('/parties')}>
              Cancel
            </Button>
            <Button
              className="btn_border mx-3"
              onClick={() => navigate('/import-parties')}
            >
              Previous
            </Button>
            <Button
              className="btn_primary"
              onClick={() => {
                // navigate('/import-parties-import-records')
                navigate('/import-parties-import-three');
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
