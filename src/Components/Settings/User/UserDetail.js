import { memo, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import UserImg from '../../../Assets/Images/user-profile.jpg';
import UploadIcon from '../../../Assets/Images/upload-icon.svg';
import AddUpload from '../../../Assets/Images/add-upload-img.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import Download from '../../../Assets/Images/download.svg';
import TrueIcon from '../../../Assets/Images/true-white.svg';
import ReactSelectSingle from '../../../Components/Common/ReactSelectSingle';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { addUserSchema } from 'Schemas/Settings/UserSchema';
import { useDispatch } from 'react-redux';
import {
  createNewUser,
  downloadIdCard,
  updateUser,
} from 'Services/Settings/userService';
import {
  clearAddSelectedUserData,
  clearSelectedUser,
  clearUpdateSelectedUserData,
  setAddSelectedUserData,
  setIsGetInitialValuesUser,
  setUpdateSelectedUserData,
} from 'Store/Reducers/Settings/User.slice';
import { toast } from 'react-toastify';
import {
  getActiveFactoryLocationList,
  getActiveOperatorRoleList,
} from 'Services/Settings/companyService';
import Loader from 'Components/Common/Loader';
import { uploadFile } from 'Services/CommonService';
import {
  getActiveMachineTypeList,
  getActivePrintTechnologyList,
} from 'Services/Settings/MiscMasterService';
import { Button } from 'primereact/button';
import { getFormattedDate } from 'Helper/Common';

export const bloodGroup = [
  { label: 'A positive (A+)', value: 'A +ve' },
  { label: 'A negative (A-)', value: 'A -ve' },
  { label: 'B positive (B+)', value: 'B +ve' },
  { label: 'B negative (B-)', value: 'B -ve' },
  { label: 'AB positive (AB+)', value: 'AB +ve' },
  { label: 'AB negative (AB-)', value: 'AB -ve' },
  { label: 'O positive (O+)', value: 'O +ve' },
  { label: 'O negative (O-)', value: 'O -ve' },
];
export const maritalStatus = [
  { label: 'Married', value: 'Married' },
  { label: 'Single', value: 'Single' },
  { label: 'Divorced', value: 'Divorced' },
];

const UserDetail = ({ initialValues }) => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');

  // const [isActiveAdhaarLink, setIsActiveAdhaarLink] = useState(true);
  // const [profileToggle, setProfileToggle] = useState(false);
  // const [selectedRollData, setSelectedRollData] = useState({});

  const {
    loading: settingLoading,
    activeFactoryLocationList,
    userRoles,
    activeOperatorRole,
  } = useSelector(({ settings }) => settings);
  const {
    usersLoading,
    usersCRUDLoading,
    // selectedUser,
    isGetInitialValuesUser,
    addSelectedUserData,
    updateSelectedUserData,
    viewSelectedUsertData,
  } = useSelector(({ user }) => user);
  const { activePrintTechnologyList, activeMachineTypeList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );

  const machineAndPrintTechnologyTypes = [
    ...activeMachineTypeList,
    ...activePrintTechnologyList,
  ];

  const loadData = useCallback(() => {
    dispatch(getActiveFactoryLocationList());
    dispatch(getActiveOperatorRoleList());
    dispatch(getActivePrintTechnologyList());
    dispatch(getActiveMachineTypeList());
  }, [dispatch]);

  useEffect(() => {
    loadData();
    // return () => dispatch(clearSelectedUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (locationPath?.length < 3) dispatch(clearSelectedUser());
  //   else if (user_id) dispatch(getSingleUser(user_id));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user_id]);

  const submitHandle = useCallback(
    async values => {
      let result;
      const MachineTypeData = [];
      const PrintTechnologyData = [];

      if (values?.operator === 1) {
        values?.machineType_printTechnology?.length > 0 &&
          values.machineType_printTechnology.map(item => {
            const filterMachineTypeData = activeMachineTypeList.find(
              data => data?._id === item,
            );
            filterMachineTypeData
              ? MachineTypeData.push(item)
              : PrintTechnologyData.push(item);
          });
      }

      const { role_name, machineType_printTechnology, ...ObjectValue } = values;

      if (user_id) {
        const payload = {
          ...ObjectValue,
          dob: getFormattedDate(values.dob),
          role: values?.office_staff === 0 ? null : values?.role,
          joining_date: getFormattedDate(values.joining_date),
          // operator_role: values?.operator === 0 ? null : values?.operator_role,
          machine_type: values?.operator === 0 ? [] : MachineTypeData,
          print_technology: values?.operator === 0 ? [] : PrintTechnologyData,
          login_allowed: values?.login_allowed === true ? 1 : 0,
          // ...(values?.office_staff === 1 && {
          calculate_brokerage:
            values?.selected_roll?.name?.toLowerCase() === 'advisor'
              ? values?.calculate_brokerage
                ? 1
                : 0
              : 0,
          // }),
          bag_machine: values?.operator === 0 ? [] : values?.bag_machine,
          user_id: values?._id,
        };

        result = await dispatch(updateUser(payload));
        if (result) {
          dispatch(
            setIsGetInitialValuesUser({
              ...isGetInitialValuesUser,
              update: false,
            }),
          );
          dispatch(clearUpdateSelectedUserData());
        }
      } else {
        const payload = {
          ...ObjectValue,
          joining_date: getFormattedDate(values.joining_date),
          dob: getFormattedDate(values?.dob),
          role: values?.office_staff === 0 ? null : values?.role,
          // operator_role: values?.operator === 0 ? null : values?.operator_role,
          machine_type: values?.operator === 0 ? [] : MachineTypeData,
          print_technology: values?.operator === 0 ? [] : PrintTechnologyData,
          login_allowed: values?.login_allowed === true ? 1 : 0,
          // ...(values?.office_staff === 1 && {
          calculate_brokerage:
            values?.selected_roll?.name?.toLowerCase() === 'advisor'
              ? values?.calculate_brokerage
                ? 1
                : 0
              : 0,
          // }),
          bag_machine: values?.operator === 0 ? [] : values?.bag_machine,
        };

        result = await dispatch(createNewUser(payload));
        if (result) {
          dispatch(
            setIsGetInitialValuesUser({
              ...isGetInitialValuesUser,
              add: false,
            }),
          );
          dispatch(clearAddSelectedUserData());
        }
      }
      if (result) {
        dispatch(clearSelectedUser());
        navigate('/users');
      }
    },
    [user_id, activeMachineTypeList, dispatch, navigate],
  );

  const { handleBlur, errors, values, touched, handleSubmit, setFieldValue } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: addUserSchema,
      onSubmit: submitHandle,
    });

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (user_id) {
      dispatch(
        setUpdateSelectedUserData({
          ...updateSelectedUserData,
          [fieldName]: fieldValue,
        }),
      );
      // if (locationPath[1] === 'update-user') {
      //   dispatch(
      //     setUpdateSelectedUserData({
      //       ...updateSelectedUserData,
      //       [fieldName]: fieldValue,
      //     }),
      //   );
      // } else {
      //   dispatch(
      //     setViewSelectedUsertData({
      //       ...viewSelectedUsertData,
      //       [fieldName]: fieldValue,
      //     }),
      //   );
      // }
    } else {
      dispatch(
        setAddSelectedUserData({
          ...addSelectedUserData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleChangeFieldsdData = (fieldObject = {}) => {
    if (user_id) {
      dispatch(
        setUpdateSelectedUserData({
          ...updateSelectedUserData,
          ...fieldObject,
        }),
      );
      // if (locationPath[1] === 'update-user') {
      //   dispatch(
      //     setUpdateSelectedUserData({
      //       ...updateSelectedUserData,
      //       ...fieldObject,
      //     }),
      //   );
      // } else {
      //   dispatch(
      //     setViewSelectedUsertData({
      //       ...viewSelectedUsertData,
      //       ...fieldObject,
      //     }),
      //   );
      // }
    } else {
      dispatch(
        setAddSelectedUserData({
          ...addSelectedUserData,
          ...fieldObject,
        }),
      );
    }

    // ** // set all fields in form:
    Object.keys(fieldObject)?.forEach(keys => {
      setFieldValue(keys, fieldObject[keys]);
    });
  };

  const findedRollOption = useMemo(() => {
    if (userRoles?.length) {
      const filterdData = userRoles?.find(data => data.value === values?.role);
      // setSelectedRollData(filterdData);
      commonUpdateFieldValue('selected_roll', filterdData);
      return filterdData;
    }
  }, [userRoles, values?.role]);

  const onDownloadIdCard = useCallback(() => {
    if (user_id)
      dispatch(
        downloadIdCard({
          user_id,
        }),
      );
  }, [dispatch, user_id]);

  const onCancel = useCallback(() => {
    // dispatch(clearSelectedUser());
    if (user_id) {
      dispatch(
        setIsGetInitialValuesUser({
          ...isGetInitialValuesUser,
          update: false,
        }),
      );
    } else {
      dispatch(
        setIsGetInitialValuesUser({
          ...isGetInitialValuesUser,
          add: false,
        }),
      );
      dispatch(clearAddSelectedUserData());
    }

    // dispatch(clearAddSelectedUserData());
    navigate('/users');
  }, [user_id, dispatch, navigate]);

  const handleRoleChange = useCallback((role, val) => {
    if (role === 'staff') {
      // setValues(prevValues => ({
      //   ...prevValues,
      //   operator: val,
      //   office_staff: val === 0 ? 1 : 0,
      // }));
      // setFieldValue('machineType_printTechnology', []);

      const fieldChangeObj = {
        operator: val,
        office_staff: val === 0 ? 1 : 0,
        machineType_printTechnology: [],
      };

      handleChangeFieldsdData(fieldChangeObj);
    } else if (role === 'operator') {
      // setValues(prevValues => ({
      //   ...prevValues,
      //   operator: val === 0 ? 1 : 0,
      //   office_staff: val,
      // }));
      // setFieldValue('role', '');
      const fieldChangeObj = {
        operator: val === 0 ? 1 : 0,
        office_staff: val,
        role: '',
      };

      handleChangeFieldsdData(fieldChangeObj);
    }
  }, []);

  const fileHandler = async (key, files) => {
    const uploadedFile = files[0];

    if (files[0]) {
      const fileSizeLimit = 10 * 1024 * 1024; // 10MB limit
      const nameLength = files[0].name.split('.');

      const extension = nameLength[nameLength?.length - 1]?.toLowerCase();
      if (extension !== 'pdf' && extension === undefined) {
        toast.error('file type not supported');
      } else if (uploadedFile?.size <= fileSizeLimit) {
        const result = await dispatch(uploadFile(uploadedFile));
        if (result) {
          // setValues({ ...values, [key]: result });
          commonUpdateFieldValue(key, result);
        }
      } else {
        let str;
        if (key === 'adhar_card_link') str = 'Adhaar Card';
        else if (key === 'pan_card_link') str = 'Pan Card';
        else if (key === 'profile_logo') str = 'Profile logo';
        toast.error(`Upload ${str} must not be larger than 10mb.`);
      }
    }
  };

  const onDownload = useCallback(e => {
    e.stopPropagation();
  }, []);

  const onRemove = useCallback(
    (e, key) => {
      e.stopPropagation();
      e.preventDefault();
      // setFieldValue(key, '');
      commonUpdateFieldValue(key, '');
    },
    [setFieldValue],
  );

  const handleMachineAndPrintTechnology = (e, checked) => {
    const selectedId = e.target.value;
    const currentValues = [...values.machineType_printTechnology];

    if (checked) {
      // If checked, add the selectedId to the array
      currentValues.push(selectedId);
    } else {
      // If unchecked, remove the selectedId from the array
      const index = currentValues.indexOf(selectedId);
      if (index !== -1) {
        currentValues.splice(index, 1);
      }
    }
    commonUpdateFieldValue('machineType_printTechnology', currentValues);
  };

  return (
    <>
      {(usersLoading || settingLoading || usersCRUDLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="add_user_wrap">
          <Row>
            <Col xxl={3} lg={4}>
              <Button
                className="toggle_button_wrap trans_btn"
                onClick={() => {
                  // setProfileToggle(!profileToggle);
                  commonUpdateFieldValue(
                    'profile_toggle',
                    !values?.profile_toggle,
                  );
                }}
              >
                <img src={AddUpload} alt="AddUploadImage" />
              </Button>
              <div
                className={
                  values?.profile_toggle === true
                    ? 'border rounded-3 bg_white add_user_left_wrap p-3 active'
                    : 'border rounded-3 bg_white add_user_left_wrap p-3'
                }
              >
                <div className="add_user_left_inner">
                  <div className="usere_profile_wrap text-center">
                    <div className="profile_img_wrap">
                      {values?.profile_logo ? (
                        <img
                          src={values?.profile_logo || UserImg}
                          alt=""
                          className="user_img"
                        />
                      ) : (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{
                            fontSize: 'xxx-large',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          {values?.first_name && values?.last_name
                            ? `${values?.first_name?.charAt(0)?.toUpperCase()}
                          ${values?.last_name?.charAt(0)?.toUpperCase()}`
                            : 'UN'}
                        </div>
                      )}
                      <div className="upload_profile_custom">
                        {!state?.isView && (
                          <InputText
                            type="file"
                            id="UserUploadFile"
                            accept=".png, .jpg, .jpeg"
                            value={''}
                            style={{ visibility: 'hidden', opacity: 0 }}
                            onChange={e =>
                              fileHandler('profile_logo', e.target.files)
                            }
                          />
                        )}
                        <label htmlFor="UserUploadFile">
                          <img src={AddUpload} alt="AddUploadImage" />
                        </label>
                      </div>
                    </div>
                    {touched?.profile_logo && errors?.profile_logo && (
                      <p className="text-danger">{errors?.profile_logo}</p>
                    )}
                    <h2 className="mb-lg-3 mb-2">
                      {values?.first_name
                        ? values?.first_name + ' ' + values?.last_name
                        : 'Full Name'}
                    </h2>
                    <h3 className="mb-lg-3 mb-2 fw-bold">
                      {values?.operator === 1
                        ? values?.operator_role_name
                        : values?.role_name}
                    </h3>
                    <h3 className="mb-lg-3 mb-2 fw-bold">
                      Emp No: {values?.emp_no ? values?.emp_no : 'N/A'}
                    </h3>
                  </div>
                  <ul>
                    <li>
                      <label htmlFor="">Address</label>
                      <span>
                        {values?.current_address
                          ? values?.current_address
                          : 'N/A'}
                      </span>
                    </li>
                    <li>
                      <label htmlFor="">Blood Group</label>
                      <span>
                        {values?.blood_group
                          ? bloodGroup?.find(
                              x => x?.value === values?.blood_group,
                            )?.label
                          : 'N/A'}
                      </span>
                    </li>
                  </ul>
                </div>
                {user_id ? (
                  <div className="mt-3 text-end">
                    <Button
                      className="btn_primary d-inline-block"
                      onClick={onDownloadIdCard}
                      disabled={state?.isView}
                    >
                      Download ID Card
                    </Button>
                  </div>
                ) : null}
              </div>
            </Col>
            <Col xxl={9} lg={8}>
              <div className="add_user_right_wrap">
                <div className="border rounded-3 bg_white p-3 mb-3">
                  <Row>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="FirstName">
                          First Name <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          id="FirstName"
                          placeholder="First Name"
                          name="first_name"
                          value={values?.first_name || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'first_name',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled={state?.isView}
                        />
                        {touched?.first_name && errors?.first_name && (
                          <p className="text-danger">{errors?.first_name}</p>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="LastName">
                          Last Name <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          id="LastName"
                          placeholder="Last Name"
                          name="last_name"
                          value={values?.last_name || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue('last_name', e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled={state?.isView}
                        />
                        {touched?.last_name && errors?.last_name && (
                          <p className="text-danger">{errors?.last_name}</p>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="Email">
                          Email <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          id="Email"
                          placeholder="Email"
                          name="email"
                          value={values?.email || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue('email', e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled={state?.isView}
                        />
                        {touched?.email && errors?.email && (
                          <p className="text-danger">{errors?.email}</p>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="MobileNo">
                          Mobile No <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          id="MobileNo"
                          placeholder="Mobile No"
                          name="mobile_no"
                          value={values?.mobile_no || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue('mobile_no', e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled={state?.isView}
                        />
                        {touched?.mobile_no && errors?.mobile_no && (
                          <p className="text-danger">{errors?.mobile_no}</p>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group date_select_wrapper mb-3">
                        <label htmlFor="BirthDate">Birth Date</label>
                        <Calendar
                          id="BirthDate"
                          placeholder="Birth Date"
                          showIcon
                          name="dob"
                          dateFormat="dd-mm-yy"
                          value={values?.dob || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue('dob', e.target.value);
                          }}
                          onBlur={handleBlur}
                          showButtonBar
                          disabled={state?.isView}
                        />
                        {touched?.dob && errors?.dob && (
                          <p className="text-danger">{errors?.dob}</p>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group">
                        <label>Gender</label>
                      </div>
                      <div className="d-flex flex-wrap gap-3 custom_radio_wrappper mb-3">
                        <div className="d-flex align-items-center">
                          <RadioButton
                            inputId="Male"
                            value={1}
                            name="gender"
                            checked={values?.gender === 1}
                            // onChange={handleChange}
                            onChange={e => {
                              commonUpdateFieldValue('gender', e.target.value);
                            }}
                            onBlur={handleBlur}
                            disabled={state?.isView}
                          />
                          <label htmlFor="Male" className="ms-2">
                            Male
                          </label>
                        </div>
                        <div className="d-flex align-items-center ms-2">
                          <RadioButton
                            inputId="feMale"
                            value={2}
                            name="gender"
                            checked={values?.gender === 2}
                            // onChange={handleChange}
                            onChange={e => {
                              commonUpdateFieldValue('gender', e.target.value);
                            }}
                            onBlur={handleBlur}
                            disabled={state?.isView}
                          />
                          <label htmlFor="Male" className="ms-2">
                            Female
                          </label>
                        </div>
                        <div className="d-flex align-items-center ms-2">
                          <RadioButton
                            inputId="Other"
                            name="gender"
                            value={3}
                            checked={values?.gender === 3}
                            // onChange={handleChange}
                            onChange={e => {
                              commonUpdateFieldValue('gender', e.target.value);
                            }}
                            onBlur={handleBlur}
                            disabled={state?.isView}
                          />
                          <label htmlFor="Other" className="ms-2">
                            Other
                          </label>
                        </div>
                        {touched?.gender && errors?.gender && (
                          <p className="text-danger">{errors?.gender}</p>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xxl={8}>
                      <Row>
                        <Col sm={6}>
                          <div className="form_group mb-3">
                            <label htmlFor="AddressType">Blood Group</label>
                            <ReactSelectSingle
                              filter
                              options={bloodGroup}
                              placeholder="Blood Group"
                              name="blood_group"
                              value={values?.blood_group || ''}
                              // onChange={handleChange}
                              onChange={e => {
                                commonUpdateFieldValue(
                                  'blood_group',
                                  e.target.value,
                                );
                              }}
                              onBlur={handleBlur}
                              disabled={state?.isView}
                            />
                            {touched?.blood_group && errors?.blood_group && (
                              <p className="text-danger">
                                {errors?.blood_group}
                              </p>
                            )}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="form_group mb-3">
                            <label htmlFor="AddressType">
                              Marital Status{' '}
                              <span className="text-danger fs-4">*</span>
                            </label>
                            <ReactSelectSingle
                              filter
                              options={maritalStatus}
                              placeholder="Marital Status"
                              name="marital_status"
                              value={values?.marital_status || ''}
                              // onChange={handleChange}
                              onChange={e => {
                                commonUpdateFieldValue(
                                  'marital_status',
                                  e.target.value,
                                );
                              }}
                              onBlur={handleBlur}
                              disabled={state?.isView}
                            />
                            {touched?.marital_status &&
                              errors?.marital_status && (
                                <p className="text-danger">
                                  {errors?.marital_status}
                                </p>
                              )}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="form_group mb-3">
                            <label htmlFor="CurrentAddress">
                              Current Address{' '}
                            </label>
                            <InputTextarea
                              placeholder="Current Address"
                              rows={2}
                              name="current_address"
                              value={values?.current_address || ''}
                              // onChange={handleChange}
                              onChange={e => {
                                commonUpdateFieldValue(
                                  'current_address',
                                  e.target.value,
                                );
                              }}
                              onBlur={handleBlur}
                              disabled={state?.isView}
                            />
                            {touched?.current_address &&
                              errors?.current_address && (
                                <p className="text-danger">
                                  {errors?.current_address}
                                </p>
                              )}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="form_group mb-3">
                            <label htmlFor="PermanentAddress">
                              Permanent Address
                            </label>
                            <InputTextarea
                              placeholder="Permanent Address"
                              rows={2}
                              name="permanent_address"
                              value={values?.permanent_address || ''}
                              // onChange={handleChange}
                              onChange={e => {
                                commonUpdateFieldValue(
                                  'permanent_address',
                                  e.target.value,
                                );
                              }}
                              onBlur={handleBlur}
                              disabled={state?.isView}
                            />
                            {touched?.permanent_address &&
                              errors?.permanent_address && (
                                <p className="text-danger">
                                  {errors?.permanent_address}
                                </p>
                              )}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col xxl={4} md={6}>
                      <div className="form_group">
                        <div className="attached_wrap">
                          <ul className="d-flex flex-wrap">
                            <li className="active">
                              <div
                                className="attached_check"
                                id="adhar_card_linkId"
                                onClick={() => {
                                  // !state?.isView && setIsActiveAdhaarLink(true);
                                  if (!state?.isView) {
                                    commonUpdateFieldValue(
                                      'active_adhaar_link',
                                      true,
                                    );
                                  }
                                }}
                              >
                                <img
                                  src={values?.adhar_card_link ? TrueIcon : ''}
                                  alt=""
                                />
                              </div>
                              <label
                                htmlFor="adhar_card_linkId"
                                onClick={() => {
                                  // !state?.isView && setIsActiveAdhaarLink(true)
                                  if (!state?.isView) {
                                    commonUpdateFieldValue(
                                      'active_adhaar_link',
                                      true,
                                    );
                                  }
                                }}
                              >
                                Aadhar card Attached
                              </label>
                            </li>
                            <li className="active">
                              <div
                                className="attached_check"
                                id="pan_card_linkId"
                                onClick={() => {
                                  // !state?.isView && setIsActiveAdhaarLink(false)
                                  if (!state?.isView) {
                                    commonUpdateFieldValue(
                                      'active_adhaar_link',
                                      false,
                                    );
                                  }
                                }}
                              >
                                <img
                                  src={values?.pan_card_link ? TrueIcon : ''}
                                  alt=""
                                />
                              </div>
                              <label
                                htmlFor="pan_card_linkId"
                                onClick={() => {
                                  // !state?.isView && setIsActiveAdhaarLink(false)
                                  if (!state?.isView) {
                                    commonUpdateFieldValue(
                                      'active_adhaar_link',
                                      false,
                                    );
                                  }
                                }}
                              >
                                Pan card Attached
                              </label>
                            </li>
                            {touched?.adhar_card_link &&
                              errors?.adhar_card_link && (
                                <p className="text-danger">
                                  {errors?.adhar_card_link}
                                </p>
                              )}
                            &nbsp;
                            {touched?.pan_card_link &&
                              errors?.pan_card_link && (
                                <p className="text-danger">
                                  {errors?.pan_card_link}
                                </p>
                              )}
                          </ul>
                        </div>
                        {values?.active_adhaar_link ? (
                          <div className="upload_file_custom">
                            {!state?.isView && (
                              <InputText
                                type="file"
                                id="AdhaarUploadFile"
                                accept=".pdf"
                                value={''}
                                onChange={e =>
                                  fileHandler('adhar_card_link', e.target.files)
                                }
                              />
                            )}
                            <label htmlFor="AdhaarUploadFile">
                              <iframe
                                src={values?.adhar_card_link || UploadIcon}
                                alt="Adhaar Card"
                                className="img-fluid"
                                title="Adhaar Card"
                              />
                              {values?.adhar_card_link ? (
                                <div className="mt-2">
                                  <a
                                    href={values?.adhar_card_link || ''}
                                    className="btn_border me-3"
                                    style={{ width: '35px', height: '35px' }}
                                    onClick={onDownload}
                                    download={'Adhar_Card'}
                                  >
                                    <img
                                      src={Download}
                                      alt=""
                                      className="mb-0"
                                    />
                                  </a>
                                  <Button
                                    className="btn_border"
                                    onClick={e =>
                                      onRemove(e, 'adhar_card_link')
                                    }
                                    style={{ width: '35px', height: '35px' }}
                                    disabled={state?.isView}
                                  >
                                    <img
                                      src={TrashIcon}
                                      alt=""
                                      className="mb-0"
                                    />
                                  </Button>
                                </div>
                              ) : (
                                <div className="upload_text">
                                  Upload your Adhaar Card{' '}
                                  <span className="text_primary">
                                    Choose file PDF
                                  </span>
                                </div>
                              )}
                            </label>
                          </div>
                        ) : (
                          <div className="upload_file_custom">
                            {!state?.isView && (
                              <InputText
                                type="file"
                                id="PanUploadFile"
                                accept=".pdf"
                                value={''}
                                onChange={e =>
                                  fileHandler('pan_card_link', e.target.files)
                                }
                              />
                            )}
                            <label htmlFor="PanUploadFile">
                              <iframe
                                src={values?.pan_card_link || UploadIcon}
                                alt="PAN Card"
                                className="img-fluid"
                                title="Pan Card"
                              />
                              {values?.pan_card_link ? (
                                <div className="mt-2">
                                  <a
                                    href={values?.pan_card_link || ''}
                                    className="btn_border me-3"
                                    style={{ width: '35px', height: '35px' }}
                                    onClick={onDownload}
                                    download={'pan_card'}
                                  >
                                    <img
                                      src={Download}
                                      alt=""
                                      className="mb-0"
                                    />
                                  </a>
                                  <Button
                                    className="btn_border"
                                    onClick={e => onRemove(e, 'pan_card_link')}
                                    style={{ width: '35px', height: '35px' }}
                                    disabled={state?.isView}
                                  >
                                    <img
                                      src={TrashIcon}
                                      alt=""
                                      className="mb-0"
                                    />
                                  </Button>
                                </div>
                              ) : (
                                <div className="upload_text">
                                  Upload your PAN Card{' '}
                                  <span className="text_primary d-block">
                                    Choose file PDF
                                  </span>
                                </div>
                              )}
                            </label>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="border rounded-3 bg_white p-3">
                  <Row>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="UserName">
                          User Name <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          id="UserName"
                          placeholder="User Name"
                          name="user_name"
                          value={values?.user_name || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue('user_name', e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled={state?.isView}
                        />
                        {touched?.user_name && errors?.user_name && (
                          <p className="text-danger">{errors?.user_name}</p>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="UserEmailID">
                          User Email ID{' '}
                          <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          id="UserEmailID"
                          placeholder="User Email ID"
                          name="user_email_id"
                          value={values?.user_email_id || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'user_email_id',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled={state?.isView}
                        />
                        {touched?.user_email_id && errors?.user_email_id && (
                          <p className="text-danger">{errors?.user_email_id}</p>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="Password">
                          Password <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          id="Password"
                          placeholder="Password"
                          name="password"
                          value={values?.password || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue('password', e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled={state?.isView}
                        />
                        {touched?.password && errors?.password && (
                          <p className="text-danger">{errors?.password}</p>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="EmpNo">
                          Emp No <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          id="EmpNo"
                          placeholder="Emp No"
                          name="emp_no"
                          value={values?.emp_no || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue('emp_no', e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled={state?.isView}
                        />
                        {touched?.emp_no && errors?.emp_no && (
                          <p className="text-danger">{errors?.emp_no}</p>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group date_select_wrapper mb-3">
                        <label htmlFor="JoiningDate">Joining Date </label>
                        <Calendar
                          id="JoiningDate"
                          placeholder="Joining Date"
                          showIcon
                          dateFormat="dd-mm-yy"
                          name="joining_date"
                          value={values?.joining_date || ''}
                          onChange={e => {
                            // setFieldValue('joining_date', e.value);
                            commonUpdateFieldValue('joining_date', e.value);
                          }}
                          onBlur={handleBlur}
                          showButtonBar
                          disabled={state?.isView}
                        />
                        {touched?.joining_date && errors?.joining_date && (
                          <p className="text-danger">{errors?.joining_date}</p>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="AddressType">
                          Factory Location{' '}
                          <span className="text-danger fs-4">*</span>
                        </label>
                        <ReactSelectSingle
                          filter
                          options={activeFactoryLocationList}
                          placeholder="Factory Location"
                          name="factory_location"
                          value={values?.factory_location || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'factory_location',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled={state?.isView}
                        />
                        {touched?.factory_location &&
                          errors?.factory_location && (
                            <p className="text-danger">
                              {errors?.factory_location}
                            </p>
                          )}
                      </div>
                    </Col>

                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <div className="d-flex flex-wrap gap-3 custom_radio_wrappper mb-2">
                          <div className="d-flex align-items-center">
                            <RadioButton
                              inputId="Operator"
                              name="operator"
                              value={values?.operator}
                              onChange={e =>
                                handleRoleChange('operator', e.target.value)
                              }
                              onBlur={handleBlur}
                              checked={values?.operator === 1}
                              disabled={state?.isView}
                            />
                            <label htmlFor="Operator" className="ms-2">
                              Operator
                            </label>
                          </div>
                          {touched?.operator && errors?.operator && (
                            <p className="text-danger">{errors?.operator}</p>
                          )}
                        </div>
                        {/* {values?.operator === 1 ? (
                          <>
                            <label>
                              Role <span className="text-danger fs-4">*</span>
                            </label>
                            <ReactSelectSingle
                              filter
                              options={activeOperatorRole}
                              placeholder="Role"
                              name="operator_role"
                              value={values?.operator_role || ''}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {touched?.operator_role &&
                              errors?.operator_role && (
                                <p className="text-danger">
                                  {errors?.operator_role}
                                </p>
                              )}
                          </>
                        ) : null} */}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <div className="custom_radio_wrappper mb-2">
                          <div className="d-flex align-items-center">
                            <RadioButton
                              inputId="Staff"
                              name="office_staff"
                              value={values?.office_staff}
                              onChange={e =>
                                handleRoleChange('staff', e.target.value)
                              }
                              checked={values?.office_staff === 1}
                              disabled={state?.isView}
                            />
                            <label htmlFor="Staff" className="ms-2">
                              Staff
                            </label>
                          </div>
                          {touched?.office_staff && errors?.office_staff && (
                            <p className="text-danger">
                              {errors?.office_staff}
                            </p>
                          )}
                        </div>
                        {values?.office_staff === 1 && (
                          <>
                            <label>
                              Role <span className="text-danger fs-4">*</span>
                            </label>
                            <ReactSelectSingle
                              filter
                              value={values?.role}
                              options={userRoles}
                              placeholder="Role"
                              name="role"
                              // onChange={handleChange}
                              onChange={e =>
                                commonUpdateFieldValue('role', e.target.value)
                              }
                              onBlur={handleBlur}
                              disabled={state?.isView}
                            />
                            {touched?.role && errors?.role && (
                              <p className="text-danger">{errors?.role}</p>
                            )}

                            <div className="form_group checkbox_wrap mt-3">
                              <>
                                <div className="d-flex me-3">
                                  <Checkbox
                                    inputId="loginPermission"
                                    checked={values?.login_allowed}
                                    name="login_allowed"
                                    value={values?.login_allowed}
                                    onChange={e => {
                                      // setFieldValue('login_allowed', e.checked);
                                      commonUpdateFieldValue(
                                        'login_allowed',
                                        e.checked,
                                      );
                                    }}
                                    onBlur={handleBlur}
                                    disabled={state?.isView}
                                  />
                                  <label htmlFor="loginPermission">
                                    Login Allowed{' '}
                                  </label>
                                </div>
                                <div className="d-flex me-2">
                                  {findedRollOption?.name?.toLowerCase() ===
                                    'advisor' && (
                                    <>
                                      <Checkbox
                                        inputId="loginPermission"
                                        checked={values?.calculate_brokerage}
                                        name="calculate_brokerage"
                                        value={values?.calculate_brokerage}
                                        onChange={e => {
                                          // setFieldValue(
                                          //   'calculate_brokerage',
                                          //   e.checked,
                                          // );
                                          commonUpdateFieldValue(
                                            'calculate_brokerage',
                                            e.checked,
                                          );
                                        }}
                                        onBlur={handleBlur}
                                        disabled={state?.isView}
                                      />
                                      <label htmlFor="loginPermission">
                                        Calculate Brokerage{' '}
                                      </label>
                                    </>
                                  )}
                                </div>
                              </>
                            </div>

                            {/* {findedRollOption?.name?.toLowerCase() ===
                              'advisor' && (
                              <div className="form_group checkbox_wrap mt-3">
                                <Checkbox
                                  inputId="loginPermission"
                                  checked={values?.calculate_brokerage}
                                  name="calculate_brokerage"
                                  value={values?.calculate_brokerage}
                                  onChange={e => {
                                    setFieldValue(
                                      'calculate_brokerage',
                                      e.checked,
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  disabled={state?.isView}
                                />
                                <label htmlFor="loginPermission">
                                  Calculate Brokerage{' '}
                                </label>
                              </div>
                            )} */}
                          </>
                        )}
                      </div>
                    </Col>
                    <Col xxl={4} sm={6}>
                      <div className="form_group mb-3">
                        <label>Status</label>
                        <div className="checkbox_wrap">
                          <Checkbox
                            inputId="StatusActive"
                            name="is_active"
                            value={values?.is_active}
                            checked={values?.is_active === 1}
                            onChange={e => {
                              // setFieldValue(
                              //   'is_active',
                              //   e.target.checked ? 1 : 0,
                              // )
                              commonUpdateFieldValue(
                                'is_active',
                                e.target.checked ? 1 : 0,
                              );
                            }}
                            disabled={state?.isView}
                          />
                          <label htmlFor="StatusActive">Active</label>
                        </div>
                        {touched?.is_active && errors?.is_active && (
                          <p className="text-danger">{errors?.is_active}</p>
                        )}
                      </div>
                    </Col>
                    {values?.operator === 1 ? (
                      <Col xxl={4} xl={6}>
                        <div className="border rounded-3 bg_white p-3 print_check_wrap">
                          <h4 className="mb-3">
                            Machine Type & Print Technology
                            {values?.operator === 1 && (
                              <span className="text-danger fs-4">*</span>
                            )}
                          </h4>
                          <Row>
                            <Col>
                              <ul className="d-flex flex-wrap">
                                {machineAndPrintTechnologyTypes?.map((x, i) => {
                                  return (
                                    <li key={i} className="w-100">
                                      <div className="form_group checkbox_wrap mb10">
                                        <Checkbox
                                          inputId={x?._id}
                                          name="machineType_printTechnology"
                                          value={x?._id}
                                          // onChange={handleChange}
                                          // onChange={e =>
                                          //   handleMachineAndPrintTechnology(
                                          //     e,
                                          //     e.target.checked,
                                          //   )
                                          // }
                                          onChange={e =>
                                            handleMachineAndPrintTechnology(
                                              e,
                                              e.target.checked,
                                            )
                                          }
                                          // onChange={e => {
                                          //   commonUpdateFieldValue(
                                          //     'machineType_printTechnology',
                                          //     e.checked,
                                          //   );
                                          // }}
                                          checked={
                                            values?.machineType_printTechnology
                                              ?.length > 0
                                              ? values?.machineType_printTechnology?.includes(
                                                  x?._id,
                                                )
                                              : false
                                          }
                                          disabled={state?.isView}
                                        />
                                        <label htmlFor={x?._id}>
                                          {x?.name}
                                        </label>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </Col>
                          </Row>
                        </div>
                        {touched?.machineType_printTechnology &&
                          errors?.machineType_printTechnology && (
                            <p className="text-danger">
                              {errors?.machineType_printTechnology}
                            </p>
                          )}
                        {/* {touched?.bag_machine && errors?.bag_machine && (
                          <p className="text-danger">{errors?.bag_machine}</p>
                        )} */}
                      </Col>
                    ) : /* <Col xxl={4} xl={6}>
                        <div className="border rounded-3 bg_white p-3 print_check_wrap">
                          <h4 className="mb-3">
                            Printing Technology & Machine Type{' '}
                            {values?.operator === 1 && (
                              <span className="text-danger fs-4">*</span>
                            )}
                          </h4>
                          <Row>
                            <Col>
                              <ul className="d-flex flex-wrap">
                                {activePrintTechnologyList?.map((x, i) => {
                                  return (
                                    <li key={i} className="w-100">
                                      <div className="form_group checkbox_wrap">
                                        <Checkbox
                                          inputId={x?._id}
                                          name="print_technology"
                                          value={x?._id}
                                          onChange={handleChange}
                                          checked={values?.print_technology?.includes(
                                            x?._id,
                                          )}
                                        />
                                        <label htmlFor={x?._id}>
                                          {x?.name}
                                        </label>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </Col>
                            <Col>
                              <ul>
                                {activeBagMachineList?.map((x, i) => {
                                  return (
                                    <li key={i} className="w-100">
                                      <div className="form_group checkbox_wrap">
                                        <Checkbox
                                          inputId={x?._id}
                                          name="bag_machine"
                                          value={x?._id}
                                          onChange={handleChange}
                                          checked={values?.bag_machine?.includes(
                                            x?._id,
                                          )}
                                        />
                                        <label htmlFor={x?._id}>
                                          {x?.name}
                                        </label>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </Col>
                          </Row>
                        </div>
                        {touched?.print_technology &&
                          errors?.print_technology && (
                            <p className="text-danger">
                              {errors?.print_technology}
                            </p>
                          )}
                        {touched?.bag_machine && errors?.bag_machine && (
                          <p className="text-danger">{errors?.bag_machine}</p>
                        )}
                      </Col> */
                    null}

                    {values?.operator === 1 && (
                      <>
                        <Col xxl={4} sm={6}>
                          <div className="form_group checkbox_wrap mb10">
                            <Checkbox
                              inputId="timingLogin"
                              checked={values?.timing_based_login === 1}
                              name="timing_based_login"
                              value={values?.timing_based_login}
                              onChange={e => {
                                // setFieldValue(
                                //   'timing_based_login',
                                //   e.target.checked ? 1 : 0,
                                // )
                                commonUpdateFieldValue(
                                  'timing_based_login',
                                  e.target.checked ? 1 : 0,
                                );
                              }}
                              onBlur={handleBlur}
                              disabled={state?.isView}
                            />
                            <label htmlFor="timingLogin">
                              Timing Based Login{' '}
                              {values?.timing_based_login === 1 ? (
                                <span className="text-danger fs-4">*</span>
                              ) : null}
                            </label>
                          </div>

                          {values?.timing_based_login === 1 ? (
                            <>
                              <div className="form_group mb-3">
                                <InputText
                                  id="EmpNo"
                                  placeholder="HH:MM AM  to  HH:MM PM"
                                  name="login_time"
                                  value={values?.login_time || ''}
                                  // onChange={handleChange}
                                  onChange={e => {
                                    commonUpdateFieldValue(
                                      'login_time',
                                      e.target.value,
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  disabled={state?.isView}
                                />
                              </div>
                              {touched?.login_time && errors?.login_time && (
                                <p className="text-danger">
                                  {errors?.login_time}
                                </p>
                              )}
                            </>
                          ) : null}
                          {touched?.timing_based_login &&
                            errors?.timing_based_login && (
                              <p className="text-danger">
                                {errors?.timing_based_login}
                              </p>
                            )}

                          <div className="form_group checkbox_wrap">
                            <Checkbox
                              inputId="loginPermission"
                              checked={values?.login_allowed}
                              name="login_allowed"
                              value={values?.login_allowed}
                              onChange={e => {
                                // setFieldValue('login_allowed', e.checked);
                                commonUpdateFieldValue(
                                  'login_allowed',
                                  e.checked,
                                );
                              }}
                              onBlur={handleBlur}
                              disabled={state?.isView}
                            />
                            <label htmlFor="loginPermission">
                              Login Allowed{' '}
                            </label>
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </div>
              </div>
              <div className="button_group d-flex align-items-center justify-content-end pt-3">
                <Button
                  type="button"
                  className="btn_border"
                  onClick={onCancel}
                  disabled={usersCRUDLoading}
                >
                  Cancel
                </Button>
                {locationPath && locationPath[1] !== 'user-details' && (
                  <Button
                    type="submit"
                    className="btn_primary ms-3"
                    onClick={handleSubmit}
                  >
                    {user_id ? 'Update' : 'Save'}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default memo(UserDetail);
