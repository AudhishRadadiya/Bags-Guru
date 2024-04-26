import {
  getPartiesActiveIndustry,
  getPartiesActiveMarket,
  getPartiesActivePartyTypes,
  getPartiesAddressTypes,
  getPartiesAdvisor,
  getPartiesCitiesWithoutState,
  getPartiesCountry,
  getPartiesCustomerSource,
  getPartiesCustomerSourceDetail,
  getPartiesStateWithoutCountry,
  addNewPartiesFromExcel,
  getCustomerRating,
} from 'Services/partiesService';
import {
  setImporttedParties,
  setImporttedPartyExcelData,
} from 'Store/Reducers/Parties/parties.slice';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { convertStringToArray } from 'Helper/Common';
import ReactTable from 'Components/Common/ReactTable';
import { useCallback, useEffect, useState } from 'react';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import Loader from 'Components/Common/Loader';

const convertToTitleCase = str => {
  const words = str.split('_');
  const convertedStr = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return convertedStr;
};

const getFlagToValue = val => {
  if (val === '1') {
    return 'Yes';
  } else if (val === '0') {
    return 'No';
  } else {
    return val;
  }
};

export default function ImportPartiesStepThree() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const {
    importtedPartiesExcelData,
    importtedParties,
    partiesStateWithoutCountry,
    partiesCitiesWithoutState,
    partiesActivePartyTypes,
    partiesAdvisor,
    partiesActiveMarket,
    partiesActiveIndustry,
    partiesCustomerSource,
    partiesCustomerSourceDetail,
    partiesAddressType,
    partiesCountry,
    partiesCRUDLoading,
    customerRating,
  } = useSelector(({ parties }) => parties);

  const handleChange = useCallback(
    (key, val, id) => {
      if (data?.length) {
        let dataList = [...data];
        dataList[id].show[key] = val;
        setData(dataList);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.length],
  );

  const loadData = useCallback(() => {
    dispatch(getPartiesActivePartyTypes());
    dispatch(getPartiesAdvisor());
    dispatch(getPartiesActiveMarket());
    dispatch(getPartiesActiveIndustry());
    dispatch(getPartiesCustomerSource());
    dispatch(getPartiesCustomerSourceDetail());
    dispatch(getPartiesAddressTypes());
    dispatch(getPartiesCountry());
    dispatch(getPartiesStateWithoutCountry());
    dispatch(getPartiesCitiesWithoutState());
    dispatch(getCustomerRating());
  }, [dispatch]);

  const loadRequiredData = useCallback(() => {
    if (!importtedPartiesExcelData?.length && !importtedParties?.length) {
      navigate('/import-parties');
      return;
    }

    if (
      importtedPartiesExcelData?.length &&
      importtedParties?.length &&
      partiesActivePartyTypes?.length &&
      partiesStateWithoutCountry?.length &&
      partiesCountry?.length &&
      partiesCitiesWithoutState?.length &&
      partiesAddressType?.length &&
      partiesAdvisor?.length &&
      partiesActiveIndustry?.length &&
      customerRating?.length
    ) {
      const headers = importtedPartiesExcelData[0];
      const tableData = importtedPartiesExcelData.slice(1).map((rowData, i) => {
        const showData = Object.fromEntries(
          headers.map((header, j) => {
            const value = getFlagToValue(rowData[j]) || '';
            return [header, value];
          }),
        );
        return { show: { id: i + 1, ...showData } };
      });

      const tableColumns = headers.map(header => ({
        Header: convertToTitleCase(header),
        accessor: `show.${header}`,
        Cell: ({ row, value }) => {
          let dropdownList;
          switch (header) {
            case 'party_type':
              dropdownList = partiesActivePartyTypes;
              break;
            case 'country':
              dropdownList = partiesCountry;
              break;
            case 'state':
              dropdownList = partiesStateWithoutCountry;
              break;
            case 'city':
              dropdownList = partiesCitiesWithoutState;
              break;
            case 'address_type':
              dropdownList = partiesAddressType;
              break;
            case 'original_advisor':
            case 'present_advisor':
              dropdownList = partiesAdvisor;
              break;
            case 'customer_rating':
              dropdownList = customerRating;
              break;
            case 'industry':
              dropdownList = partiesActiveIndustry;
              break;
            default:
              break;
          }

          const html = getHTMLForParty(
            value,
            header,
            dropdownList,
            handleChange,
            row?.id,
          );

          return <div className="form_group text-center">{html}</div>;
        },
      }));

      setColumns(tableColumns);
      setData(tableData);
    }
  }, [
    handleChange,
    importtedParties?.length,
    importtedPartiesExcelData,
    navigate,
    partiesActiveIndustry,
    partiesActivePartyTypes,
    partiesAddressType,
    partiesAdvisor,
    partiesCitiesWithoutState,
    partiesCountry,
    partiesStateWithoutCountry,
    customerRating,
  ]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadRequiredData();
  }, [
    partiesActivePartyTypes,
    partiesAddressType,
    partiesAdvisor,
    partiesCitiesWithoutState,
    partiesCountry,
    partiesStateWithoutCountry,
    customerRating,
  ]);

  const getHTMLForParty = (value, header, dropDownList, handleChange, id) => {
    const dropdown = dropDownList?.map(x => ({
      label: x?.label || x?.name || x?.first_name + ' ' + x?.last_name,
      value: x?.name || x?.first_name || x?.label,
      id: x?._id || x?.value,
    }));

    if (value === 'Yes' || value === 'No') {
      return (
        <Checkbox
          inputId={header}
          name={header}
          checked={value === 'Yes' ? true : false}
          onChange={e => {
            handleChange(header, e.checked ? 'Yes' : 'No', id);
          }}
        />
      );
    } else if (
      header === 'party_type' ||
      header === 'country' ||
      header === 'city' ||
      header === 'state' ||
      header === 'address_type' ||
      header === 'original_advisor' ||
      header === 'present_advisor' ||
      header === 'industry' ||
      header === 'customer_rating'
    ) {
      const styleColor =
        header === 'party_type' ? (value ? '#7b7b7b' : 'red') : '#7b7b7b';
      return (
        <ReactSelectSingle
          filter
          name={header}
          value={value || ''}
          style={{
            borderColor: styleColor,
          }}
          options={dropdown}
          onChange={e => handleChange(header, e.target.value, id)}
          placeholder={header}
        />
      );
    } else {
      const styleColor =
        header === 'party_name' || header === 'person_name'
          ? value
            ? '#7b7b7b'
            : 'red'
          : '#7b7b7b';
      return (
        <InputText
          value={value}
          style={{ borderColor: styleColor }}
          onChange={e => handleChange(header, e.target.value, id)}
        />
      );
    }
  };

  const onSave = useCallback(async () => {
    let payload = [...data];

    const newPayload = {
      partyList: payload?.map(x => {
        return {
          party_name: x?.show?.party_name,
          person_name: x?.show?.person_name,
          personal_email: x?.show?.personal_email,
          personal_contact_no: x?.show?.personal_contact_no?.toString(),
          website: x?.show?.website,
          register_mobile_number: x?.show?.register_mobile_number
            ? [x?.show?.register_mobile_number?.toString()]
            : [],
          register_email: x?.show?.register_email
            ? [x?.show?.register_email?.toString()]
            : [],
          pan_no: x?.show?.pan_no,
          collection_person_name: x?.show?.collection_person_name,
          payment_terms: x?.show?.payment_terms,
          collection_person_whatsapp_no:
            x?.show?.collection_person_whatsapp_no?.toString(),
          collection_person_other_mobile_no:
            x?.show?.collection_person_other_mobile_no?.toString(),
          repeat_order_days: x?.show?.repeat_order_days,
          company_logo: x?.show?.company_logo,
          comment: x?.show?.comment,
          is_mobile_app_registered:
            x?.show?.is_mobile_app_registered === 'Yes' ? 1 : 0,
          is_active: x?.show?.is_active === 'Yes' ? 1 : 0,
          is_regular_customer: 0,
          dnd_for_payment: x?.show?.dnd_for_payment === 'Yes' ? 1 : 0,
          party_type:
            partiesActivePartyTypes?.find(y => y?.name === x?.show?.party_type)
              ?._id || null,
          original_advisor:
            partiesAdvisor?.find(
              y => y?.first_name === x?.show?.original_advisor,
            )?._id || null,
          present_advisor:
            partiesAdvisor?.find(
              y => y?.first_name === x?.show?.present_advisor,
            )?._id || null,
          market:
            partiesActiveMarket?.find(y => y?.name === x?.show?.market)?._id ||
            null,
          industry:
            partiesActiveIndustry?.find(y => y?.name === x?.show?.industry)
              ?._id || null,
          customer_source:
            partiesCustomerSource?.find(
              y => y?.name === x?.show?.customer_source,
            )?._id || null,
          customer_source_detail:
            partiesCustomerSourceDetail?.find(
              y => y?.name === x?.show?.customer_source_detail,
            )?._id || null,
          gst: x?.show?.gstin?.toString(),
          city:
            partiesCitiesWithoutState?.find(y => y?.name === x?.show?.city)
              ?._id || null,
          country:
            partiesCountry?.find(y => y?.name === x?.show?.country)?._id ||
            null,
          state:
            partiesStateWithoutCountry?.find(y => y?.name === x?.show?.state)
              ?._id || null,
          bag_rate_list: x?.show?.bag_rate_list,
          customer_rating:
            customerRating?.find(y => y?.label === x?.show?.customer_rating)
              ?.value || null,
          party_address:
            // x?.show?.party_address === ''
            //   ?
            {
              address_type:
                partiesAddressType?.find(y => y?.name === x?.show?.address_type)
                  ?._id || null,
              business_name: x?.show?.business_name || '',
              gstin: x?.show?.gstin || '',
              tripta_code: String(x?.show?.tripta_code) || '',
              pincode: x?.show?.pincode || '',
              address: x?.show?.address || '',
              city:
                partiesCitiesWithoutState?.find(y => y?.name === x?.show?.city)
                  ?._id || null,
              country:
                partiesCountry?.find(y => y?.name === x?.show?.country)?._id ||
                null,
              state:
                partiesStateWithoutCountry?.find(
                  y => y?.name === x?.show?.state,
                )?._id || null,
              is_default: x?.show?.is_default === 'Yes' ? 1 : 0,
              is_same_as_shipping:
                x?.show?.is_same_as_shipping === 'Yes' ? 1 : 0,
            },
          // : x?.show?.party_address,
        };
      }),
    };

    const result = await dispatch(addNewPartiesFromExcel(newPayload));
    if (result) {
      dispatch(setImporttedParties([]));
      dispatch(setImporttedPartyExcelData([]));
      navigate('/parties');
    }
  }, [
    data,
    dispatch,
    navigate,
    partiesActiveIndustry,
    partiesActiveMarket,
    partiesActivePartyTypes,
    partiesAddressType,
    partiesAdvisor,
    partiesCitiesWithoutState,
    partiesCountry,
    partiesCustomerSource,
    partiesCustomerSourceDetail,
    partiesStateWithoutCountry,
  ]);

  const onCancel = useCallback(() => {
    dispatch(setImporttedParties([]));
    dispatch(setImporttedPartyExcelData([]));
    navigate('/parties');
  }, [dispatch, navigate]);

  return (
    <div className="main_Wrapper">
      {partiesCRUDLoading && <Loader />}
      <div className="import_parti_wrapper border rounded-3 bg_white">
        <div className="impoer_parties_step_head">
          <h3>Import Parties </h3>
          <ul>
            <li className="complete">
              <span>
                Upload File <span className="line"></span>
              </span>
            </li>
            <li className="complete">
              <span>
                Map Columns <span className="line"></span>
              </span>
            </li>
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
              {`Showing ${data?.length} entries`}
            </p>
          </div>
          <div className="table_wrapper import_record_table">
            <ReactTable columns={columns} data={data} />
          </div>
          <div className="button_group d-flex align-items-center justify-content-end p-3">
            <Button className="btn_border" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              className="btn_border mx-3"
              onClick={() => {
                // navigate('/import-parties-map-columns')
                navigate('/import-parties-steptwo');
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
