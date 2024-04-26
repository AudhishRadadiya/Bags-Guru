import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Badge, Col, Dropdown, Row } from 'react-bootstrap';
import SearchIcon from '../../Assets/Images/search.svg';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import DropZone from 'Components/Common/DropZone';
import {
  addParties,
  getPartiesActiveIndustry,
  getPartiesActiveMarket,
  getPartiesActivePartyTypes,
  getPartiesAddressTypes,
  getPartiesAdvisor,
  getPartiesCitiesWithoutState,
  getPartiesCity,
  getPartiesCountry,
  getPartiesCustomerSource,
  getPartiesCustomerSourceDetail,
  getPartiesState,
  getPartiesStateWithoutCountry,
  getSingleListParties,
  updateParties,
} from 'Services/partiesService';
import { addPartiesSchema } from 'Schemas/AllSchemas';

import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';

import PlusIcon from '../../Assets/Images/plus.svg';
import MinusIcon from '../../Assets/Images/minus.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import {
  clearPartiesInitialValues,
  setIsGetInitialValues,
  setPartiesInitialValues,
  setSingleListParties,
} from '../../Store/Reducers/Parties/parties.slice';
import Loader from 'Components/Common/Loader';
import { getSingleListGC } from '../../../src/Services/Settings/generalConfigurationService';
import ConfirmDialog from 'Components/Common/ConfirmDialog';

const paymentsTerms = [
  { label: 10, value: 10 },
  { label: 15, value: 15 },
  { label: 20, value: 20 },
  { label: 30, value: 30 },
  { label: 40, value: 40 },
  { label: 50, value: 50 },
];

const addPartiesData = {
  party_type: '',
  party_name: '',
  person_name: '',
  personal_email: '',
  personal_contact_no: '',
  website: '',
  city: '',
  state: '',
  country: '',
  is_mobile_app_registered: false,
  bag_rate_list: 1,
  register_mobile_number: [],
  register_email: [],
  pan_no: '',
  gst: '',
  original_advisor: '',
  present_advisor: '',
  market: '',
  industry: '',
  customer_source: '',
  customer_source_detail: '',
  customer_rating: '',
  collection_person_name: '',
  payment_terms: 30,
  collection_person_whatsapp_no: '',
  collection_person_other_mobile_no: '',
  repeat_order_days: 60,
  dnd_for_payment: false,
  company_logo: '',
  company_logo_name: '',
  comment: '',
  is_regular_customer: 0,
  is_active: true,
  party_address: [],
  address_type: '',
  business_name: '',
  gstin: '',
  tripta_code: '',
  address: '',
  pincode: '',
  city_address_details: '',
  state_address_details: '',
  country_address_details: '',
  is_default: true,
  is_same_as_shipping: false,
};

export default function AddParties() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');
  const {
    partiesActivePartyTypes,
    partiesAdvisor,
    partiesActiveMarket,
    partiesActiveIndustry,
    partiesCustomerSource,
    partiesCustomerSourceDetail,
    partiesAddressType,
    partiesCountry,
    partiesState,
    partiesCity,
    singleListParties,
    partiesStateWithoutCountry,
    partiesCitiesWithoutState,
    partiesLoading,
    isGetInitialValues,
    partiesInitialValues,
    partiesCRUDLoading,
    customerRating,
  } = useSelector(({ parties }) => parties);
  const { singleListGC } = useSelector(
    ({ generalConfiguration }) => generalConfiguration,
  );
  const [isValidate, setIsValidate] = useState(false);
  const [partyAddress, setPartiesAddress] = useState([]);
  const [index, setIndex] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [registerPhoneIndex, setRegisterPhoneIndex] = useState([' ']);
  const [registerPhone, setRegisterPhone] = useState([]);
  const [registerEmailIndex, setRegisterEmailIndex] = useState([' ']);
  const [registerEmail, setRegisterEmail] = useState([]);
  const [checkDefault, setCheckDefault] = useState({
    default: false,
    view: false,
  });
  const [sameForDefault, setSameForDefault] = useState(false);
  const [oldPartyAddress, setOldPartyAddress] = useState([]);
  const [filterToggle, setFilterToggle] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [addressType, setAddressType] = useState('');
  const [initialValuesForParties, setInitialValuesForParties] =
    useState(addPartiesData);
  // const [companyLogoName, setCompanyLogoName] = useState('');

  // useEffect(() => {
  //   if (values?.state_address_details) {
  //     dispatch(getPartiesCity({ state_id: values?.state_address_details }));
  //   }
  // }, [dispatch, values?.state_address_details]);

  // let country = partiesCountry.filter(i => i?._id === values?.country)[0];

  // useEffect(() => {
  //   if (values?.country !== '') {
  //     dispatch(getPartiesState({ code: country?.country_code }));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [country?.country_code, dispatch]);

  // useEffect(() => {
  //   if (values?.state?.length > 0) {
  //     dispatch(getPartiesCity({ state_id: values?.state }));
  //   }
  // }, [dispatch, values?.state]);

  useEffect(() => {
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
    dispatch(getSingleListGC());
    return () => {
      dispatch(setSingleListParties(addPartiesData));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleSetIndex = length => {
    let newArray = [];
    for (let i = 1; i <= length; i++) {
      newArray.push('');
    }
    return newArray;
  };

  const partyTypeOptions = partiesActivePartyTypes?.map(partyType => ({
    label: partyType?.name,
    value: partyType?._id,
  }));
  const applicableRateOptions = [
    ...Array(singleListGC?.mobile_rate_list_count),
  ]?.map((_, index) => ({
    label: `Rate List ${index + 1}`,
    value: index + 1,
  }));
  const advisorOptions = partiesAdvisor?.map(advisor => ({
    label: `${advisor?.first_name}  ${advisor?.last_name}`,
    value: advisor?._id,
  }));

  const marketOptions = partiesActiveMarket?.map(market => ({
    label: market?.name,
    value: market?._id,
  }));

  const industryOptions = partiesActiveIndustry?.map(industry => ({
    label: industry?.name,
    value: industry?._id,
  }));

  const customerSourceOptions = partiesCustomerSource?.map(customerSource => ({
    label: customerSource?.name,
    value: customerSource?._id,
  }));

  const customerSourceDetailOptions = partiesCustomerSourceDetail?.map(
    customerSource => ({
      label: customerSource?.name,
      value: customerSource?._id,
    }),
  );

  const countryOptions = partiesCountry?.map(country => ({
    label: country?.name,
    value: country?._id,
  }));
  const stateOptions = partiesState?.map(state => ({
    label: state?.name,
    value: state?._id,
  }));

  const cityOptions = partiesCity?.map(city => ({
    label: city?.name,
    value: city?._id,
  }));

  // let checkCity = cityOptions?.filter(item => item?.value === values?.city)[0]
  //   ?.label;

  // let countryAddressDetails = partiesCountry.find(
  //   i => i?._id === values?.country_address_details,
  // );

  // useEffect(() => {
  //   if (countryAddressDetails && countryAddressDetails?.country_code) {
  //     dispatch(getPartiesState({ code: countryAddressDetails?.country_code }));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, countryAddressDetails?.country_code]);

  const handleRegisterMobileNumberIndex = value => {
    const addMoreMobileNumber = registerPhoneIndex?.length
      ? [...registerPhoneIndex, value]
      : [value];

    setRegisterPhoneIndex(addMoreMobileNumber);

    dispatch(
      setPartiesInitialValues({
        ...partiesInitialValues,
        registerPhone_index: addMoreMobileNumber,
      }),
    );
  };

  const handleRegisterMobileNumberIndexRemove = () => {
    if (registerPhoneIndex.length === 0) {
      return;
    }
    const removeMoreMobileNumber = registerPhoneIndex?.slice(0, -1);
    setRegisterPhoneIndex(removeMoreMobileNumber);

    dispatch(
      setPartiesInitialValues({
        ...partiesInitialValues,
        registerPhone_index: removeMoreMobileNumber,
      }),
    );
  };

  const handleRegisterMobileNumberRemove = index => {
    let updatedRegisterPhone = values?.register_mobile_number?.length
      ? [...values?.register_mobile_number]
      : [];
    updatedRegisterPhone?.splice(index, 1);

    dispatch(
      setPartiesInitialValues({
        ...partiesInitialValues,
        register_mobile_number: updatedRegisterPhone,
      }),
    );

    setFieldValue('register_mobile_number', updatedRegisterPhone);

    // setRegisterPhone(prevRegisterPhone => {
    //   const newRegisterPhone = [...prevRegisterPhone];
    //   newRegisterPhone.splice(index, 1);
    //   return newRegisterPhone;
    // });
  };

  const handleRegisterEmailIndex = value => {
    const addMoreEmail = registerEmailIndex?.length
      ? [...registerEmailIndex, value]
      : [value];

    setRegisterEmailIndex(addMoreEmail);

    dispatch(
      setPartiesInitialValues({
        ...partiesInitialValues,
        registerEmail_index: addMoreEmail,
      }),
    );
  };

  const handleRegisterEmailIndexRemove = () => {
    if (registerEmailIndex.length === 0) {
      return;
    }
    const removeEmail = registerEmailIndex?.slice(0, -1);
    setRegisterEmailIndex(removeEmail);

    dispatch(
      setPartiesInitialValues({
        ...partiesInitialValues,
        registerEmail_index: removeEmail,
      }),
    );
  };

  const handleRegisterEmailRemove = index => {
    let updatedRegisterEmail = values?.register_email?.length
      ? [...values?.register_email]
      : [];
    updatedRegisterEmail?.splice(index, 1);

    dispatch(
      setPartiesInitialValues({
        ...partiesInitialValues,
        register_email: updatedRegisterEmail,
      }),
    );

    setFieldValue('register_email', updatedRegisterEmail);

    // setRegisterEmail(prevRegisterEmail => {
    //   const newRegisterEmail = [...prevRegisterEmail];
    //   newRegisterEmail.splice(index, 1);
    //   return newRegisterEmail;
    // });
  };

  const handleRegisterEmailChange = (e, i) => {
    const updatedRegisterEmail = values.register_email
      ? [...values.register_email]
      : [];

    updatedRegisterEmail[i] = e.target.value;

    commonUpdateFiledValue('register_email', updatedRegisterEmail);
    // setRegisterEmail(updatedRegisterEmail);

    // dispatch(
    //   setPartiesInitialValues({
    //     ...partiesInitialValues,
    //     register_email: updatedRegisterEmail,
    //   }),
    // );
  };

  const customNoColumn = (rowData, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
  };

  const customAddressTypeColumn = rowData => {
    let addressType = partiesAddressType?.filter(
      i => i?._id === rowData?.address_type,
    )[0];
    return <span>{addressType?.name ? addressType?.name : '-'}</span>;
  };
  const customStateColumn = rowData => {
    let state = partiesStateWithoutCountry?.filter(
      i => i?._id === rowData?.state,
    )[0];

    return <span>{state?.name ? state?.name : '-'}</span>;
  };
  const customCountryColumn = rowData => {
    let country = partiesCountry?.filter(i => i?._id === rowData?.country)[0];
    return <span>{country?.name ? country?.name : '-'}</span>;
  };
  const customIsDefaultColumn = rowData => {
    return (
      <Badge bg={rowData?.is_default ? 'success' : 'secondary'}>
        {rowData?.is_default ? 'Yes' : 'No'}
      </Badge>
    );
  };
  const checkAddressTypeDefault = (isDefault, addressType) => {
    let xyz = partyAddress?.filter(
      data =>
        data?.is_default === isDefault && data?.address_type === addressType,
    );
    return xyz;
  };

  const customActionColumn = (rowData, index) => {
    return (
      <div className="edit_row">
        <Dropdown className="dropdown_common position-static position-static">
          <Dropdown.Toggle id="dropdown-basic" className="ection_btn">
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                handleEdit(rowData, index);
              }}
            >
              <img src={EditIcon} alt="" /> Edit
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setDeletePopup(index);
                //     handleDelete(index);
              }}
            >
              <img src={TrashIcon} alt="" /> Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };
  const customCityColumn = rowData => {
    let city = partiesCitiesWithoutState?.filter(
      i => i?._id === rowData?.city,
    )[0];

    return <span>{city?.name ? city?.name : '-'}</span>;
  };
  const getDifference = (array1, array2) => {
    return array1?.filter(object1 => {
      return !array2?.some(object2 => {
        return object1._id === object2._id;
      });
    });
  };
  const submitHandle = useCallback(
    async values => {
      let res = '';
      const emailAddress = values?.register_email?.filter(email => email) || [];
      const phoneNumbers =
        values?.register_mobile_number?.filter(phoneNumber => phoneNumber) ||
        [];
      let payload = {
        party_id: id || '',
        party_type: values?.party_type || '',
        party_name: values?.party_name || '',
        person_name: values?.person_name || '',
        personal_email: values?.personal_email || '',
        personal_contact_no: values?.personal_contact_no || '',
        website: values?.website || '',
        city: values?.city ? values?.city : '',
        state: values?.state ? values?.state : '',
        country: values?.country ? values?.country : '',
        is_mobile_app_registered: values?.is_mobile_app_registered ? 1 : 0,
        register_mobile_number: phoneNumbers,
        register_email: emailAddress,
        pan_no: values?.pan_no || '',
        gst: values?.gst || '',
        original_advisor: values?.original_advisor || '',
        present_advisor: values?.present_advisor || '',
        market: values?.market || '',
        industry: values?.industry || '',
        customer_source: values?.customer_source || '',
        customer_source_detail: values?.customer_source_detail || '',
        customer_rating: values?.customer_rating || '',
        collection_person_name: values?.collection_person_name || '',
        payment_terms: values?.payment_terms || '',
        collection_person_whatsapp_no:
          values?.collection_person_whatsapp_no || '',
        collection_person_other_mobile_no:
          values?.collection_person_other_mobile_no || '',
        repeat_order_days: values?.repeat_order_days || '',
        dnd_for_payment: values?.dnd_for_payment || 0,
        company_logo: values?.company_logo || '',
        comment: values?.comment || '',
        is_regular_customer: values?.is_regular_customer ? 1 : 0,
        is_active: values?.is_active ? 1 : 0,
        bag_rate_list: values?.bag_rate_list || 0,
      };
      if (id) {
        let newPartyAddress = getDifference(partyAddress, oldPartyAddress);
        let FilteredOlAddress = getDifference(partyAddress, newPartyAddress);
        payload.old_party_address = FilteredOlAddress;
        payload.new_party_address = newPartyAddress;
        res = await dispatch(updateParties(payload));
      } else {
        payload.party_address = partyAddress || [];
        res = await dispatch(addParties(payload));
      }
      dispatch(setIsGetInitialValues(false));
      dispatch(clearPartiesInitialValues());
      if (res) navigate('/parties');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      id,
      registerPhone,
      registerEmail,
      partyAddress,
      oldPartyAddress,
      navigate,
      dispatch,
    ],
  );

  const handleDelete = useCallback(
    data => {
      if (data) {
        let newArray = [...partyAddress];
        newArray.splice(data?.rowIndex, 1);
        setPartiesAddress(newArray);

        dispatch(
          setPartiesInitialValues({
            ...partiesInitialValues,
            partiesAllAddress: newArray,
          }),
        );
        setDeletePopup(false);
      }
    },
    [dispatch, partyAddress, partiesInitialValues],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    setValues,
    resetForm,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesForParties,
    validationSchema: addPartiesSchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    if (isGetInitialValues) {
      if (Object.keys(partiesInitialValues)?.length > 0) {
        setInitialValuesForParties(partiesInitialValues);
        // setValues(partiesInitialValues);
        setPartiesAddress(partiesInitialValues?.partiesAllAddress);
        setRegisterPhoneIndex(
          partiesInitialValues?.registerPhone_index || [' '],
        );
        setRegisterEmailIndex(
          partiesInitialValues?.registerEmail_index || [' '],
        );
      } else {
        setInitialValuesForParties(addPartiesData);
      }
    } else {
      dispatch(setPartiesInitialValues(addPartiesData));
      dispatch(setIsGetInitialValues(true));
      // setPartiesAddress();
      // setInitialValuesForParties(addPartiesData);
    }
  }, []);

  useEffect(() => {
    if (id && Object.keys(singleListParties)?.length > 0) {
      setValues({
        party_type: singleListParties?.party_type
          ? singleListParties?.party_type
          : '',
        party_name: singleListParties?.party_name
          ? singleListParties?.party_name
          : '',
        person_name: singleListParties?.person_name
          ? singleListParties?.person_name
          : '',
        personal_email: singleListParties?.personal_email
          ? singleListParties?.personal_email
          : '',
        personal_contact_no: singleListParties?.personal_contact_no
          ? singleListParties?.personal_contact_no
          : '',
        website: singleListParties?.website ? singleListParties?.website : '',
        city: singleListParties?.city ? singleListParties?.city : '',
        state: singleListParties?.state ? singleListParties?.state : '',
        country: singleListParties?.country ? singleListParties?.country : '',
        is_mobile_app_registered: singleListParties?.is_mobile_app_registered
          ? singleListParties?.is_mobile_app_registered
          : false,
        register_mobile_number: singleListParties?.register_mobile_number
          ? singleListParties?.register_mobile_number
          : [],
        register_email: singleListParties?.register_email
          ? singleListParties?.register_email
          : [],
        // register_email: registerEmail ? registerEmail : [],
        pan_no: singleListParties?.pan_no ? singleListParties?.pan_no : '',
        gst: singleListParties?.gst ? singleListParties?.gst : '',
        original_advisor: singleListParties?.original_advisor
          ? singleListParties?.original_advisor
          : '',
        present_advisor: singleListParties?.present_advisor
          ? singleListParties?.present_advisor
          : '',
        market: singleListParties?.market ? singleListParties?.market : '',
        industry: singleListParties?.industry
          ? singleListParties?.industry
          : '',
        customer_source: singleListParties?.customer_source
          ? singleListParties?.customer_source
          : '',
        customer_source_detail: singleListParties?.customer_source_detail
          ? singleListParties?.customer_source_detail
          : '',
        customer_rating: singleListParties?.customer_rating
          ? singleListParties?.customer_rating
          : '',
        collection_person_name: singleListParties?.collection_person_name
          ? singleListParties?.collection_person_name
          : '',
        payment_terms: singleListParties?.payment_terms
          ? singleListParties?.payment_terms
          : '',
        collection_person_whatsapp_no:
          singleListParties?.collection_person_whatsapp_no
            ? singleListParties?.collection_person_whatsapp_no
            : '',
        collection_person_other_mobile_no:
          singleListParties?.collection_person_other_mobile_no
            ? singleListParties?.collection_person_other_mobile_no
            : '',
        repeat_order_days: singleListParties?.repeat_order_days
          ? singleListParties?.repeat_order_days
          : '',
        dnd_for_payment: singleListParties?.dnd_for_payment
          ? singleListParties?.dnd_for_payment
          : false,
        company_logo: singleListParties?.company_logo
          ? singleListParties?.company_logo
          : '',
        comment: singleListParties?.comment ? singleListParties?.comment : '',
        is_regular_customer: singleListParties?.is_regular_customer
          ? singleListParties?.is_regular_customer
          : false,
        is_active: singleListParties?.is_active
          ? singleListParties?.is_active
          : false,
        bag_rate_list: singleListParties?.bag_rate_list,
        // address_type: addressType,
        business_name: '',
        gstin: '',
        tripta_code: '',
        address: '',
        pincode: '',
        city_address_details: '',
        state_address_details: '',
        country_address_details: '',
        is_default: true,
        is_same_as_shipping: false,
      });
      let registerEmailList = singleListParties?.register_email?.length;
      if (registerEmailList > 0) {
        let index = handleSetIndex(registerEmailList);
        setRegisterEmailIndex(index);
      }
      let registerPhoneList = singleListParties?.register_mobile_number?.length;
      if (registerPhoneList > 0) {
        let index = handleSetIndex(registerPhoneList);
        setRegisterPhoneIndex(index);
      }
      const payload = singleListParties?.party_address?.map(item => {
        return {
          address_type: partiesAddressType.filter(
            ele => ele._id === item.address_type,
          )[0]?._id,
          business_name: item?.business_name,
          gstin: item?.gstin,
          tripta_code: item?.tripta_code,
          address: item?.address,
          pincode: item?.pincode,
          city: item?.city,
          state: item?.state,
          country: item?.country,
          is_default: item?.is_default ? 1 : 0,
          is_same_as_shipping: item?.is_same_as_shipping ? 1 : 0,
          _id: item?._id,
        };
      });
      // setRegisterPhone(singleListParties?.register_mobile_number);
      // setRegisterEmail(singleListParties?.register_email);
      setPartiesAddress(payload?.length > 0 ? payload : []);
      setOldPartyAddress(singleListParties?.party_address);
    } else {
      setValues(partiesInitialValues);
      // setInitialValuesForParties(partiesInitialValues);
      setPartiesAddress(partiesInitialValues?.partiesAllAddress);
      setRegisterPhoneIndex(partiesInitialValues?.registerPhone_index || [' ']);
      setRegisterEmailIndex(partiesInitialValues?.registerEmail_index || [' ']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, singleListParties, id]);

  const checkCity = useMemo(() => {
    const getCity = cityOptions?.find(item => item?.value === values?.city);
    return getCity?.label;
  }, [cityOptions, values?.city]);

  const checkAddressType = useMemo(() => {
    const getPartyAddress = partiesAddressType?.find(
      i => i.value === values?.address_type,
    );
    return getPartyAddress?.label;
  }, [partiesAddressType, values?.address_type]);

  // let checkAddressType = partiesAddressType?.filter(
  //   i => i.value === values?.address_type,
  // )[0]?.label;

  useEffect(() => {
    // if (locationPath?.length < 3) {
    //   // resetForm();
    //   // setPartiesAddress([]);
    // }
    if (id) {
      dispatch(getSingleListParties(id));
    }
  }, [dispatch, id, locationPath?.length, resetForm]);

  /*   useEffect(() => {
    setValues(prevValues => ({
      ...prevValues,
      is_same_as_shipping: sameForDefault,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sameForDefault]); */

  // useEffect(() => {
  //   if (partiesAddressType?.length > 0 && addressType === '') {
  //     let defaultAddress = partiesAddressType?.find(
  //       data => data?.label?.toLowerCase() === 'shipping',
  //     );
  //     if (Object.keys(defaultAddress)?.length > 0) {
  //       setAddressType(defaultAddress?.value);
  //       setFieldValue('address_type', defaultAddress?.value);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [partiesAddressType, addressType]);

  useEffect(() => {
    let isDefaultKey = false;
    let isViewKey = false;
    if (id) {
      if (partyAddress?.length > 0) {
        if (!isEdit) {
          let isDefault = checkAddressTypeDefault(1, values?.address_type);
          if (isDefault?.length > 0) {
            isViewKey = true;
          } else {
            isDefaultKey = true;
          }
        }
      } else {
        isDefaultKey = true;
      }
      setSameForDefault(false);
    } else {
      if (partyAddress?.length > 0) {
        let isDefault = checkAddressTypeDefault(1, values?.address_type);
        if (isDefault?.length > 0) {
          isViewKey = true;
        } else {
          isDefaultKey = true;
        }
      } else {
        isDefaultKey = true;
      }
      setSameForDefault(false);
    }
    setCheckDefault({
      default: isDefaultKey,
      view: isViewKey,
    });
    setFieldValue('is_default', isDefaultKey);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyAddress]);

  const handleAddUpdate = () => {
    if (
      values?.business_name === '' ||
      // values?.gstin === '' ||
      values?.address === '' ||
      values?.pincode === '' ||
      values?.city_address_details === '' ||
      values?.state_address_details === '' ||
      values?.country_address_details === ''
    ) {
      setIsValidate(true);
    } else {
      // let defaultAddress = partiesAddressType?.filter(
      //   data => data?.label?.toLowerCase() === 'shipping',
      // );
      let payload = {
        // address_type: addressType,
        address_type: values?.address_type,
        business_name: values?.business_name,
        gstin: values?.gstin,
        tripta_code: values?.tripta_code,
        address: values?.address,
        pincode: values?.pincode,
        city: values?.city_address_details,
        state: values?.state_address_details,
        country: values?.country_address_details,
        is_default: values?.is_default ? 1 : 0,
        is_same_as_shipping: values?.is_same_as_shipping ? 1 : 0,
      };
      const Obj = {
        // address_type: defaultAddress[0]?.value,
        address_type: '',
        business_name: '',
        gstin: '',
        tripta_code: '',
        address: '',
        pincode: '',
        city_address_details: '',
        state_address_details: '',
        country_address_details: '',
        is_default: '',
        is_same_as_shipping: '',
      };
      if (isEdit) {
        setPartiesAddress(prevArray => {
          const newArray = [...prevArray];
          payload._id = prevArray[index]?._id;
          newArray.splice(index, 1, payload);
          return newArray;
        });
      } else {
        if (values?.is_same_as_shipping) {
          const anotherAddress = partiesAddressType?.filter(
            x => x?._id !== values?.address_type,
          )?.[0];
          let isDefault = checkAddressTypeDefault(1, anotherAddress?._id);
          let payload2 = {
            address_type: anotherAddress?._id,
            business_name: values?.business_name,
            gstin: values?.gstin,
            tripta_code: values?.tripta_code,
            address: values?.address,
            pincode: values?.pincode,
            city: values?.city_address_details,
            state: values?.state_address_details,
            country: values?.country_address_details,
            is_default: isDefault?.length > 0 ? 0 : 1,
            is_same_as_shipping: values?.is_same_as_shipping ? 1 : 0,
          };

          let newArry;
          if (partyAddress?.length) {
            newArry = [...partyAddress, payload, payload2];
          } else {
            newArry = [payload, payload2];
          }

          setPartiesAddress(newArry);
          dispatch(
            setPartiesInitialValues({
              ...partiesInitialValues,
              ...Obj,
              partiesAllAddress: newArry,
            }),
          );
        } else {
          let newArry;
          if (partyAddress?.length) {
            newArry = [...partyAddress, payload];
          } else {
            newArry = [payload];
          }

          setPartiesAddress(newArry);
          dispatch(
            setPartiesInitialValues({
              ...partiesInitialValues,
              ...Obj,
              partiesAllAddress: newArry,
            }),
          );
        }
      }

      setIsEdit(false);
      // setAddressType(defaultAddress[0]?.value);

      setValues(prevValues => ({
        ...prevValues,
        ...Obj,
      }));

      setIsValidate(false);
    }
  };

  const handleRegisterMobileNumberChange = (e, i) => {
    // setRegisterPhone(updatedRegisterPhone);
    const updatedRegisterPhone = values.register_mobile_number
      ? [...values.register_mobile_number]
      : [];

    updatedRegisterPhone[i] = e.target.value;

    // dispatch(
    //   setPartiesInitialValues({
    //     ...partiesInitialValues,
    //     register_mobile_number: updatedRegisterPhone,
    //   }),
    // );

    commonUpdateFiledValue('register_mobile_number', updatedRegisterPhone);
    // setFieldValue('register_mobile_number', updatedRegisterPhone);
  };

  const handleEdit = useCallback(
    (rowData, index) => {
      const {
        address_type,
        business_name,
        gstin,
        tripta_code,
        address,
        pincode,
        city,
        state,
        country,
        is_default,
        is_same_as_shipping,
      } = rowData;
      setValues(prevValues => ({
        ...prevValues,
        address_type: address_type,
        business_name: business_name,
        gstin: gstin,
        tripta_code: tripta_code,
        address: address,
        pincode: pincode,
        city_address_details: city,
        state_address_details: state,
        country_address_details: country,
        is_default: is_default ? 1 : 0,
        is_same_as_shipping: is_same_as_shipping ? 1 : 0,
      }));
      if (is_default) {
        setCheckDefault({
          default: true,
          view: false,
        });
      } else {
        setCheckDefault({
          default: false,
          view: false,
        });
      }
      if (is_same_as_shipping) {
        setSameForDefault(true);
      } else {
        setSameForDefault(false);
      }
      setFieldValue('address_type', address_type);
      setAddressType(address_type);
      setIndex(index?.rowIndex);
      setIsEdit(true);
    },
    [setValues, setIndex, setIsEdit],
  );
  const errorRender = useCallback(value => {
    return <p className="text-danger">{value} is Required!</p>;
  }, []);

  const commonUpdateFiledValue = (fieldName, fieldValue) => {
    dispatch(
      setPartiesInitialValues({
        ...partiesInitialValues,
        [fieldName]: fieldValue,
      }),
    );
    // handleChange(fieldName)(fieldValue);
    setFieldValue(fieldName, fieldValue);
  };

  return (
    <div className="main_Wrapper">
      {(partiesLoading || partiesCRUDLoading) && <Loader />}
      <div className="party_type_top_wrap">
        <Row>
          <Col xl={3} lg={4} sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="party_type">
                Party Type
                <span className="text-danger fs-4">*</span>
              </label>
              <ReactSelectSingle
                filter
                options={partyTypeOptions}
                placeholder="Select Party Type"
                name="party_type"
                value={values?.party_type || ''}
                onBlur={handleBlur}
                onChange={e => {
                  commonUpdateFiledValue('party_type', e.target.value);
                }}
                required
                disabled={state?.isView}
              />
              {touched?.party_type && errors?.party_type && (
                <p className="text-danger">{errors?.party_type}</p>
              )}
            </div>
          </Col>
          <Col xl={3} lg={4} sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="party_name">
                Party Name
                <span className="text-danger fs-4">*</span>
              </label>
              <InputText
                placeholder="Enter Party Name"
                name="party_name"
                value={values?.party_name || ''}
                onBlur={handleBlur}
                onChange={e => {
                  commonUpdateFiledValue('party_name', e.target.value);
                }}
                required
                disabled={state?.isView}
              />
              {touched?.party_name && errors?.party_name && (
                <p className="text-danger">{errors?.party_name}</p>
              )}
            </div>
          </Col>
          <Col xl={3} lg={4}>
            <div className="form_group checkbox_wrap with_input mb-3">
              <Checkbox
                inputId="is_active"
                name="is_active"
                checked={values?.is_active}
                onChange={e => {
                  commonUpdateFiledValue('is_active', e.checked);
                }}
                disabled={state?.isView}
              />
              <label htmlFor="is_active">Active</label>
              {/* <Checkbox
                inputId="is_regular_customer"
                name="is_regular_customer"
                checked={values?.is_regular_customer}
                onChange={e => {
                  commonUpdateFiledValue('is_regular_customer', e.checked);
                }}
                className="ms-4"
                disabled={state?.isView}
              />
              <label htmlFor="is_regular_customer">Regular Customer</label> */}
            </div>
          </Col>
        </Row>
      </div>

      <div className="party_detail_wrap">
        <Row className="g-0">
          <Col lg={6}>
            <div className="parties_detail_left">
              <h3 className="mb-3">Contact Details</h3>
              <Row>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="person_name">Name</label>
                    <InputText
                      placeholder="Enter Name"
                      name="person_name"
                      value={values?.person_name || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        // dispatch(
                        //   setPartiesInitialValues({
                        //     ...partiesInitialValues,
                        //     person_name: e.target.value,
                        //   }),
                        // );
                        // handleChange('person_name')(e.target.value);
                        commonUpdateFiledValue('person_name', e.target.value);
                      }}
                      disabled={state?.isView}
                      required
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="personal_email">Personal Email</label>
                    <InputText
                      placeholder="Personal Email"
                      name="personal_email"
                      value={values?.personal_email || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        // dispatch(
                        //   setPartiesInitialValues({
                        //     ...partiesInitialValues,
                        //     personal_email: e.target.value,
                        //   }),
                        // );
                        // handleChange('personal_email')(e.target.value);
                        commonUpdateFiledValue(
                          'personal_email',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                    {touched?.personal_email && errors?.personal_email && (
                      <p className="text-danger">{errors?.personal_email}</p>
                    )}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="personal_contact_no">
                      Personal Contact Number
                    </label>
                    <InputText
                      placeholder="Enter Personal Contact Number"
                      name="personal_contact_no"
                      value={values?.personal_contact_no || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        // dispatch(
                        //   setPartiesInitialValues({
                        //     ...partiesInitialValues,
                        //     personal_contact_no: e.target.value,
                        //   }),
                        // );
                        // handleChange('personal_contact_no')(e.target.value);
                        commonUpdateFiledValue(
                          'personal_contact_no',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                    {touched?.personal_contact_no &&
                      errors?.personal_contact_no && (
                        <p className="text-danger">
                          {errors?.personal_contact_no}
                        </p>
                      )}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="Website">Website</label>
                    <InputText
                      placeholder="Website"
                      name="website"
                      value={values?.website || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue('website', e.target.value);
                      }}
                      disabled={state?.isView}
                    />
                    {touched?.website && errors?.website && (
                      <p className="text-danger">{errors?.website}</p>
                    )}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="country">Country</label>
                    <ReactSelectSingle
                      filter
                      options={countryOptions}
                      placeholder="Country"
                      name="country"
                      value={values?.country}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue('country', e.target.value);
                        // setFieldValue('country', e.target.value);
                        const country = partiesCountry.find(
                          i => i?._id === e.target.value,
                        );
                        dispatch(
                          getPartiesState({ code: country?.country_code }),
                        );
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="state">State</label>
                    <ReactSelectSingle
                      filter
                      options={stateOptions}
                      placeholder="State"
                      name="state"
                      value={values?.state}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue('state', e.target.value);
                        // setFieldValue('state', e.target.value);
                        dispatch(getPartiesCity({ state_id: e.target.value }));
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="city">City</label>
                    <ReactSelectSingle
                      filter
                      options={cityOptions}
                      placeholder="City"
                      name="city"
                      value={values?.city}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue('city', e.target.value);
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
              </Row>
              <div className="form_group checkbox_wrap large mb-3">
                <Checkbox
                  inputId="is_mobile_app_registered"
                  name="is_mobile_app_registered"
                  checked={values?.is_mobile_app_registered}
                  onChange={e => {
                    commonUpdateFiledValue(
                      'is_mobile_app_registered',
                      e.checked,
                    );
                  }}
                  disabled={state?.isView}
                />
                <label htmlFor="is_mobile_app_registered">
                  Mobile App Registration
                </label>
              </div>
              {values?.is_mobile_app_registered === true && (
                <>
                  <Row>
                    <Col md={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="bag_rate_list">
                          Applicable Rate List
                        </label>
                        <ReactSelectSingle
                          filter
                          options={applicableRateOptions}
                          placeholder="Select Applicable Rate List"
                          name="bag_rate_list"
                          value={values?.bag_rate_list || ''}
                          onBlur={handleBlur}
                          onChange={e => {
                            // handleChange
                            commonUpdateFiledValue(
                              'bag_rate_list',
                              e.target.value,
                            );
                          }}
                          required
                          disabled={state?.isView}
                        />
                      </div>
                      {touched?.bag_rate_list && errors?.bag_rate_list && (
                        <p className="text-danger">{errors?.bag_rate_list}</p>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="form_group mb-3">
                        <label
                          htmlFor="MobileNumber"
                          className="d-flex justify-content-between align-items-center"
                        >
                          Register Mobile Number
                          {!state && (
                            <Button
                              className="btn_transperant"
                              onClick={() =>
                                handleRegisterMobileNumberIndex(' ')
                              }
                            >
                              <img src={PlusIcon} alt="" />
                            </Button>
                          )}
                        </label>
                        <InputText
                          placeholder="Register Mobile Number"
                          // value={registerPhone[0] || ''}
                          value={
                            values?.register_mobile_number?.length > 0
                              ? values?.register_mobile_number[0]
                              : ''
                          }
                          type="number"
                          key={index}
                          onBlur={handleBlur}
                          onChange={event => {
                            handleRegisterMobileNumberChange(event, 0);
                          }}
                          disabled={state?.isView}
                          name="register_mobile_number"
                        />
                        {touched?.register_mobile_number &&
                          errors?.register_mobile_number && (
                            <p className="text-danger">
                              {errors?.register_mobile_number}
                            </p>
                          )}
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="form_group mb-3">
                        <label
                          htmlFor="RegisterEmail"
                          className="d-flex justify-content-between align-items-center"
                        >
                          Register Email
                          {!state && (
                            <Button
                              className="btn_transperant"
                              onClick={() => {
                                handleRegisterEmailIndex(' ');
                              }}
                            >
                              <img src={PlusIcon} alt="" />
                            </Button>
                          )}
                        </label>
                        <InputText
                          id="RegisterEmail"
                          placeholder="xyz@02gmail.com"
                          // value={registerEmail[0]}
                          value={
                            values?.register_email?.length > 0
                              ? values?.register_email[0]
                              : ''
                          }
                          key={index}
                          onChange={event =>
                            handleRegisterEmailChange(event, 0)
                          }
                          name="register_email"
                          disabled={state?.isView}
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      {[...Array(registerPhoneIndex?.length)]?.map(
                        (_, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && (
                              <>
                                <div className="form_group mb-3">
                                  <label
                                    htmlFor="MobileNumber"
                                    className="d-flex justify-content-between align-items-center"
                                  >
                                    Register Mobile Number
                                    {!state && (
                                      <Button
                                        className="btn_transperant"
                                        onClick={() => {
                                          handleRegisterMobileNumberIndexRemove();
                                          handleRegisterMobileNumberRemove(
                                            index,
                                          );
                                        }}
                                      >
                                        <img src={MinusIcon} alt="" />
                                      </Button>
                                    )}
                                  </label>
                                  <InputText
                                    id="MobileNumber"
                                    placeholder="Register Mobile Number"
                                    // value={registerPhone[index] || ''}
                                    value={
                                      values?.register_mobile_number?.length > 0
                                        ? values?.register_mobile_number[index]
                                        : ''
                                    }
                                    key={index}
                                    onChange={event =>
                                      handleRegisterMobileNumberChange(
                                        event,
                                        index,
                                      )
                                    }
                                    disabled={state?.isView}
                                  />
                                </div>
                              </>
                            )}
                          </React.Fragment>
                        ),
                      )}
                    </Col>

                    <Col md={6}>
                      {[...Array(registerEmailIndex?.length)]?.map(
                        (_, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && (
                              <>
                                <div className="form_group mb-3">
                                  <label
                                    htmlFor="RegisterEmail"
                                    className="d-flex justify-content-between align-items-center"
                                  >
                                    Register Email
                                    {!state && (
                                      <Button
                                        className="btn_transperant"
                                        onClick={() => {
                                          handleRegisterEmailIndexRemove();
                                          handleRegisterEmailRemove(index);
                                        }}
                                      >
                                        <img src={MinusIcon} alt="" />
                                      </Button>
                                    )}
                                  </label>
                                  <InputText
                                    id="RegisterEmail"
                                    placeholder="xyz@02gmail.com"
                                    // value={registerEmail[index] || ''}
                                    value={
                                      values?.register_email?.length > 0
                                        ? values?.register_email[index]
                                        : ''
                                    }
                                    key={index}
                                    onChange={event =>
                                      handleRegisterEmailChange(event, index)
                                    }
                                    disabled={state?.isView}
                                  />
                                </div>
                              </>
                            )}
                          </React.Fragment>
                        ),
                      )}
                    </Col>
                  </Row>
                </>
              )}
              <h3 className="mb-3">Tax Details</h3>
              <Row>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="PANNo">PAN No</label>
                    <InputText
                      placeholder="PAN No"
                      name="pan_no"
                      value={values?.pan_no || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue('pan_no', e.target.value);
                      }}
                      disabled={state?.isView}
                    />
                    {touched?.pan_no && errors?.pan_no && (
                      <p className="text-danger">{errors?.pan_no}</p>
                    )}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="gst">GST</label>
                    <InputText
                      placeholder="GST"
                      name="gst"
                      value={values?.gst || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        // handleChange
                        commonUpdateFiledValue('gst', e.target.value);
                      }}
                      disabled={state?.isView}
                    />
                    {touched?.gst && errors?.gst && (
                      <p className="text-danger">{errors?.gst}</p>
                    )}
                  </div>
                </Col>
              </Row>
              <h3 className="mb-3">Other Details</h3>
              <Row>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="original_advisor">Original Advisor</label>
                    <ReactSelectSingle
                      filter
                      options={advisorOptions}
                      placeholder="Original Advisor"
                      name="original_advisor"
                      value={values?.original_advisor || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        // handleChange
                        commonUpdateFiledValue(
                          'original_advisor',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="present_advisor">Present Advisor</label>
                    <ReactSelectSingle
                      filter
                      options={advisorOptions}
                      placeholder="Present Advisor"
                      name="present_advisor"
                      value={values?.present_advisor || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        // handleChange
                        commonUpdateFiledValue(
                          'present_advisor',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
                {checkCity === 'Surat' && (
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="market">Market Name</label>
                      <ReactSelectSingle
                        filter
                        options={marketOptions}
                        placeholder="Market Name"
                        name="market"
                        value={values?.market || ''}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFiledValue('market', e.target.value);
                        }}
                        disabled={state?.isView}
                      />
                    </div>
                  </Col>
                )}
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="industry">Industry</label>
                    <ReactSelectSingle
                      filter
                      options={industryOptions}
                      placeholder="Industry"
                      name="industry"
                      value={values?.industry || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue('industry', e.target.value);
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="customer_source">Customer Source</label>
                    <ReactSelectSingle
                      filter
                      options={customerSourceOptions}
                      placeholder="Customer Source"
                      name="customer_source"
                      value={values?.customer_source || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue(
                          'customer_source',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="customer_source_detail">
                      Customer Source Detail
                    </label>
                    <ReactSelectSingle
                      filter
                      options={customerSourceDetailOptions}
                      placeholder="Customer Source Detail"
                      name="customer_source_detail"
                      value={values?.customer_source_detail || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue(
                          'customer_source_detail',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="customer_rating">Customer Rating</label>
                    <ReactSelectSingle
                      filter
                      options={customerRating}
                      placeholder="Customer Rating"
                      name="customer_rating"
                      value={values?.customer_rating || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue(
                          'customer_rating',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
              </Row>
              <h3 className="mb-3">Collection Related Details</h3>
              <Row>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="collection_person_name">
                      Collection Person Name
                    </label>
                    <InputText
                      placeholder="Collection Person Name"
                      name="collection_person_name"
                      value={values?.collection_person_name || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue(
                          'collection_person_name',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="payment_terms">Payments Terms (Days)</label>
                    <ReactSelectSingle
                      filter
                      options={paymentsTerms}
                      placeholder="Default Value  Will be 15 Days"
                      name="payment_terms"
                      value={values?.payment_terms || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue('payment_terms', e.target.value);
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="collection_person_whatsapp_no">
                      WhatsApp Mobile No
                    </label>
                    <InputText
                      placeholder="WhatsApp Mobile No"
                      name="collection_person_whatsapp_no"
                      value={values?.collection_person_whatsapp_no || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue(
                          'collection_person_whatsapp_no',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                    {touched?.collection_person_whatsapp_no &&
                      errors?.collection_person_whatsapp_no && (
                        <p className="text-danger">
                          {errors?.collection_person_whatsapp_no}
                        </p>
                      )}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="collection_person_other_mobile_no">
                      Other Mobile No
                    </label>
                    <InputText
                      placeholder="Other Mobile No"
                      name="collection_person_other_mobile_no"
                      value={values?.collection_person_other_mobile_no || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue(
                          'collection_person_other_mobile_no',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                    {touched?.collection_person_other_mobile_no &&
                      errors?.collection_person_other_mobile_no && (
                        <p className="text-danger">
                          {errors?.collection_person_other_mobile_no}
                        </p>
                      )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form_group checkbox_wrap">
                    <Checkbox
                      inputId="dnd_for_payment"
                      name="dnd_for_payment"
                      checked={values?.dnd_for_payment}
                      onChange={e =>
                        commonUpdateFiledValue('dnd_for_payment', e.checked)
                      }
                      disabled={state?.isView}
                    />
                    <label htmlFor="dnd_for_payment">DND for payment</label>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group">
                    <label htmlFor="repeat_order_days">
                      Max days for repeat order
                    </label>
                    <InputText
                      type="number"
                      placeholder="Max days for repeat order"
                      name="repeat_order_days"
                      value={values?.repeat_order_days || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue(
                          'repeat_order_days',
                          e.target.value,
                        );
                      }}
                      disabled={state?.isView}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={6}>
            <div className="parties_detail_right">
              <div className="address_detail_Wrap">
                <h3 className="mb-3">Address Details</h3>
                <Row>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="address_type">
                        Address Type
                        {isValidate && (
                          <span className="text-danger fs-4">*</span>
                        )}
                      </label>
                      <ReactSelectSingle
                        filter
                        options={partiesAddressType}
                        placeholder="Address Type"
                        name="address_type"
                        // value={addressType}
                        value={values?.address_type}
                        onBlur={handleBlur}
                        onChange={e => {
                          setAddressType(e.target.value);
                          // setFieldValue('address_type', e.target.value);
                          commonUpdateFiledValue(
                            'address_type',
                            e.target.value,
                          );
                        }}
                        disabled={state?.isView}
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="business_name">
                        Business Name
                        {isValidate && (
                          <span className="text-danger fs-4">*</span>
                        )}
                      </label>
                      <InputText
                        placeholder="Business Name"
                        name="business_name"
                        value={values?.business_name || ''}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFiledValue(
                            'business_name',
                            e.target.value,
                          );
                        }}
                        disabled={state?.isView}
                      />
                      {isValidate &&
                        !values?.business_name &&
                        errorRender('Business Name')}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="gstin">
                        GSTIN
                        {/* {isValidate && (
                          <span className="text-danger fs-4">*</span>
                        )} */}
                      </label>
                      <InputText
                        placeholder="GSTIN"
                        name="gstin"
                        value={values?.gstin || ''}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFiledValue('gstin', e.target.value);
                        }}
                        disabled={state?.isView}
                      />

                      {touched?.gstin && errors?.gstin && (
                        <p className="text-danger">{errors?.gstin}</p>
                      )}
                      {/* {isValidate && !values?.gstin && errorRender('Gstin')} */}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="tripta_code">Tripta Code</label>
                      <InputText
                        placeholder="Tripta Code"
                        name="tripta_code"
                        value={values?.tripta_code || ''}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFiledValue('tripta_code', e.target.value);
                        }}
                        disabled={state?.isView}
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="address">
                        Address
                        {isValidate && (
                          <span className="text-danger fs-4">*</span>
                        )}
                      </label>
                      <InputTextarea
                        placeholder="Address"
                        rows={3}
                        name="address"
                        value={values?.address || ''}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFiledValue('address', e.target.value);
                        }}
                        disabled={state?.isView}
                      />
                      {isValidate &&
                        !values?.address &&
                        errorRender('Address Name')}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="pincode">
                        Pincode
                        {isValidate && (
                          <span className="text-danger fs-4">*</span>
                        )}
                      </label>
                      <InputText
                        placeholder="Pincode"
                        name="pincode"
                        value={values?.pincode || ''}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFiledValue('pincode', e.target.value);
                        }}
                        disabled={state?.isView}
                      />
                      {touched?.pincode && errors?.pincode && (
                        <p className="text-danger">{errors?.pincode}</p>
                      )}
                      {isValidate && !values?.pincode && errorRender('Pincode')}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="country_address_details">
                        Country
                        {isValidate && (
                          <span className="text-danger fs-4">*</span>
                        )}
                      </label>
                      <ReactSelectSingle
                        filter
                        options={countryOptions}
                        placeholder="Country"
                        name="country_address_details"
                        value={values?.country_address_details || ''}
                        onBlur={handleBlur}
                        // onChange={handleChange}
                        onChange={e => {
                          // setFieldValue(
                          //   'country_address_details',
                          //   e.target.value,
                          // );
                          commonUpdateFiledValue(
                            'country_address_details',
                            e.target.value,
                          );

                          let countryAddressDetails = partiesCountry.find(
                            i => i?._id === e.target.value,
                          );
                          dispatch(
                            getPartiesState({
                              code: countryAddressDetails?.country_code,
                            }),
                          );
                        }}
                        disabled={state?.isView}
                      />
                      {isValidate &&
                        !values?.country_address_details &&
                        errorRender('Country')}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="state_address_details">
                        State{' '}
                        {isValidate && (
                          <span className="text-danger fs-4">*</span>
                        )}
                      </label>
                      <ReactSelectSingle
                        filter
                        options={stateOptions}
                        placeholder="State"
                        name="state_address_details"
                        value={values?.state_address_details || ''}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFiledValue(
                            'state_address_details',
                            e.target.value,
                          );
                          dispatch(
                            getPartiesCity({ state_id: e.target.value }),
                          );
                          // setFieldValue(
                          //   'state_address_details',
                          //   e.target.value,
                          // );
                        }}
                        disabled={state?.isView}
                      />
                      {isValidate &&
                        !values?.state_address_details &&
                        errorRender('State')}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="city_address_details">
                        City
                        {isValidate && (
                          <span className="text-danger fs-4">*</span>
                        )}
                      </label>
                      <ReactSelectSingle
                        filter
                        options={cityOptions}
                        placeholder="City"
                        name="city_address_details"
                        value={values?.city_address_details || ''}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFiledValue(
                            'city_address_details',
                            e.target.value,
                          );
                        }}
                        disabled={state?.isView}
                      />
                      {isValidate &&
                        !values?.city_address_details &&
                        errorRender('City')}
                    </div>
                  </Col>
                </Row>
                <div className="form_group checkbox_wrap mb-3">
                  {checkDefault?.view === false ? (
                    <>
                      {/* {checkAddressType === 'Shipping' && (
                        <>
                          {isShippingStatus ? null : (
                            <> */}
                      <Checkbox
                        inputId="is_default"
                        name="is_default"
                        onChange={e => {
                          commonUpdateFiledValue('is_default', e.checked);
                        }}
                        disabled={checkDefault?.default || state?.isView}
                        checked={checkDefault?.default}
                      />
                      <label htmlFor="is_default">Is Default</label>
                    </>
                  ) : null}
                  <Checkbox
                    inputId="is_same_as_shipping"
                    name="is_same_as_shipping"
                    className="ms-4"
                    disabled={(id && isEdit) || state?.isView}
                    onChange={e => {
                      setSameForDefault(!sameForDefault);
                      // setFieldValue('is_same_as_shipping', !sameForDefault);
                      commonUpdateFiledValue(
                        'is_same_as_shipping',
                        !sameForDefault,
                      );
                    }}
                    checked={sameForDefault}
                  />

                  <label htmlFor="is_same_as_shipping">
                    {checkAddressType?.toLowerCase() === 'shipping'
                      ? 'Same For Billing'
                      : 'Same For Shipping'}
                  </label>
                </div>
                <div className="Button_group d-flex">
                  <Button
                    className="btn_primary"
                    onClick={handleAddUpdate}
                    disabled={state?.isView}
                  >
                    {isEdit ? 'Update' : 'Add'}
                  </Button>
                  <Button
                    className="btn_border ms-3"
                    disabled={state?.isView}
                    onClick={() => {
                      if (id && Object.keys(singleListParties)?.length > 0) {
                        setValues({
                          ...values,
                          business_name: '',
                          gstin: '',
                          address: '',
                          pincode: '',
                          city_address_details: '',
                          state_address_details: '',
                          country_address_details: '',
                          tripta_code: '',
                        });
                      } else {
                        setPartiesAddress([]);
                        dispatch(
                          setPartiesInitialValues({
                            ...partiesInitialValues,
                            partiesAllAddress: [],
                          }),
                        );
                        setValues({
                          ...values,
                          business_name: '',
                          gstin: '',
                          address: '',
                          pincode: '',
                          city_address_details: '',
                          state_address_details: '',
                          country_address_details: '',
                          tripta_code: '',
                        });
                      }
                      setIsValidate(false);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
              <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter auto_height max_height">
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
                  value={partyAddress}
                  sortMode="multiple"
                  sortField="name"
                  sortOrder={1}
                  dataKey=""
                  filterDisplay="row"
                >
                  <Column
                    field=""
                    header="No"
                    sortable
                    body={customNoColumn}
                    filter={filterToggle}
                  ></Column>
                  <Column
                    field="business_name"
                    header="Business Name"
                    sortable
                    filter={filterToggle}
                  ></Column>
                  <Column
                    field="gstin"
                    header="GSTIN"
                    sortable
                    filter={filterToggle}
                  ></Column>
                  <Column
                    field="tripta_code"
                    header="Tripta Code"
                    sortable
                  ></Column>
                  <Column
                    field="address_type"
                    header="Address Type"
                    sortable
                    body={customAddressTypeColumn}
                    filter={filterToggle}
                  ></Column>
                  <Column
                    field="address"
                    header="Address"
                    sortable
                    filter={filterToggle}
                  ></Column>
                  <Column
                    field="city"
                    header="City"
                    sortable
                    filter={filterToggle}
                    body={customCityColumn}
                  ></Column>

                  <Column
                    field="state"
                    header="State"
                    sortable
                    filter={filterToggle}
                    body={customStateColumn}
                  ></Column>
                  <Column
                    field="country"
                    header="Country"
                    sortable
                    filter={filterToggle}
                    body={customCountryColumn}
                  ></Column>
                  <Column field="pincode" header="Pincode" sortable></Column>
                  <Column
                    field=""
                    header="Is Default"
                    sortable
                    filter={filterToggle}
                    body={customIsDefaultColumn}
                  ></Column>
                  <Column
                    field="action"
                    header="Action"
                    hidden={!id || state?.isView}
                    filter={filterToggle}
                    body={customActionColumn}
                  ></Column>
                </DataTable>
              </div>
              <div className="upload_wrapper">
                <Row>
                  <Col md={6}>
                    <div className="form_group">
                      <label htmlFor="Company Logo">Company Logo </label>

                      <DropZone
                        value={values?.company_logo}
                        module="party"
                        setFieldValue={setFieldValue}
                        initialImgValue={partiesInitialValues}
                        setInitialImgValue={setPartiesInitialValues}
                        fieldName="company_logo"
                        fieldImgName="company_logo_name"
                        fieldImgValue={values?.company_logo_name}
                        disabled={state?.isView}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="comment">Comment</label>
                      <InputTextarea
                        placeholder="Write Comment"
                        rows={7}
                        name="comment"
                        value={values?.comment}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFiledValue('comment', e.target.value);
                        }}
                        disabled={state?.isView}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="button_group d-flex align-items-center justify-content-end pt-3">
        <Button
          className="btn_border"
          onClick={() => {
            // resetForm();
            navigate('/parties');
          }}
        >
          Cancel
        </Button>
        {locationPath && locationPath[1] === 'parties-details' ? null : (
          <Button className="btn_primary ms-3" onClick={handleSubmit}>
            {id ? 'Update' : 'Save'}
          </Button>
        )}
      </div>
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
