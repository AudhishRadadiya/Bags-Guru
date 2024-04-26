import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Sidebar } from 'primereact/sidebar';
import UploadIcon from '../../Assets/Images/upload-icon.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import Download from '../../Assets/Images/download.svg';
import { RadioButton } from 'primereact/radiobutton';
import { useDispatch } from 'react-redux';
import { getOwnProfile } from 'Services/authService';
import { useSelector } from 'react-redux';
import { downloadOwnIdCard, updateUser } from 'Services/Settings/userService';
import { useFormik } from 'formik';
import { currentUserSchema } from 'Schemas/Settings/UserSchema';
import { bloodGroup, maritalStatus } from './AddUsers';
import {
  countDaysBetweenTwoDays,
  getDMYDateFormat,
  getFormattedDate,
} from 'Helper/Common';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { toast } from 'react-toastify';
import { uploadFile } from 'Services/CommonService';
import { getCurrentUserFromLocal } from 'Services/baseService';
import {
  clearSelectedUser,
  setSelectedUser,
} from 'Store/Reducers/Settings/User.slice';
import Loader from 'Components/Common/Loader';
import moment from 'moment';

export default function MyProfile({ hasAccess }) {
  const dispatch = useDispatch();

  const [visibleRight, setVisibleRight] = useState(false);
  const [isActiveAdhaarLink, setIsActiveAdhaarLink] = useState(true);

  const { currentUser } = useSelector(({ auth }) => auth);
  const { usersCRUDLoading } = useSelector(({ user }) => user);
  const { settingsCRUDLoading } = useSelector(({ settings }) => settings);

  const loadRequiredData = useCallback(() => {
    dispatch(getOwnProfile());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
    return () => dispatch(clearSelectedUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (currentUser?._id) {
        const payload = {
          ...values,
          user_id: currentUser?._id,
          mobile_no: values?.mobile_no?.toString(),
          is_active: values?.is_active ? 1 : 0,
          operator: values?.operator ? 1 : 0,
          dob: getFormattedDate(values?.dob),
          office_staff: values?.office_staff ? 1 : 0,
          timing_based_login: values?.timing_based_login ? 1 : 0,
        };
        result = await dispatch(updateUser(payload));
        if (result) {
          let payload = { ...currentUser, values };
          dispatch(setSelectedUser(payload));
          let UserPreferences = getCurrentUserFromLocal();
          if (UserPreferences) {
            UserPreferences.profile_logo = values?.profile_logo;
            localStorage.setItem(
              'UserPreferences',
              JSON.stringify(UserPreferences),
            );
          }
          dispatch(getOwnProfile());
        }
      }
    },
    [currentUser, dispatch],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: currentUser,
    validationSchema: currentUserSchema,
    onSubmit: submitHandle,
  });

  const onDownloadIdCard = useCallback(() => {
    if (currentUser?._id) dispatch(downloadOwnIdCard());
  }, [currentUser?._id, dispatch]);

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
          setValues({ ...values, [key]: result });
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
      setFieldValue(key, '');
    },
    [setFieldValue],
  );

  return (
    <>
      {(settingsCRUDLoading || usersCRUDLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="add_profile_wrap">
          <div className="profile_top_wrap border rounded-3 bg_white p-3 flex-wrap">
            <div className="upload_file_custom">
              <InputText
                type="file"
                id="profile_logo"
                accept=".png, .jpg, .jpeg"
                value={''}
                onChange={e => fileHandler('profile_logo', e.target.files)}
              />
              <label htmlFor="profile_logo">
                <img
                  src={values?.profile_logo || ''}
                  alt="Profile Logo"
                  style={{
                    width: values?.profile_logo ? '120px' : 0,
                    height: values?.profile_logo ? '130px' : 0,
                    objectFit: 'contain',
                  }}
                  className="img-fluid"
                  title="Profile Logo"
                />
                {values?.profile_logo ? (
                  <div className="mt-2 d-flex justify-content-center align-items-center">
                    <a
                      href={values?.profile_logo || ''}
                      className="btn_border me-3"
                      style={{ width: '35px', height: '35px' }}
                      onClick={onDownload}
                      download={'Profile Logo'}
                    >
                      <img src={Download} alt="" className="mb-0" />
                    </a>
                    <Button
                      className="btn_border"
                      onClick={e => onRemove(e, 'profile_logo')}
                      style={{ width: '35px', height: '35px' }}
                    >
                      <img src={TrashIcon} alt="" className="mb-0" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      fontSize: 'xxx-large',
                      width: '120px',
                      height: '130px',
                    }}
                  >
                    {currentUser?.first_name && currentUser?.last_name
                      ? `${currentUser?.first_name?.charAt(0)?.toUpperCase()}
                ${currentUser?.last_name?.charAt(0)?.toUpperCase()}`
                      : 'UN'}
                  </div>
                )}
              </label>
            </div>

            <div className="profile_right_wrap">
              <h2>{currentUser?.first_name + ' ' + currentUser?.last_name}</h2>
              <div className="profile_personal_detail">
                <ul className="d-flex flex-wrap">
                  <li>
                    <h5>Factory Location</h5>
                    <h4>{currentUser?.factory_location_name}</h4>
                  </li>
                  <li>
                    <h5>Email</h5>
                    <h4>{currentUser?.user_email_id}</h4>
                  </li>
                  <li>
                    <h5>Mobile</h5>
                    <h4>{currentUser?.mobile_no}</h4>
                  </li>
                  <li>
                    <h5>ID card</h5>
                    <h4
                      className="text_primary cursor-pointer"
                      onClick={() => setVisibleRight(true)}
                    >
                      Digital ID Preview
                    </h4>
                    <Sidebar
                      visible={visibleRight}
                      position="right"
                      onHide={() => setVisibleRight(false)}
                      className="myprofile_sidebar"
                    >
                      <div className="add_user_left_inner">
                        <div className="usere_profile_wrap text-center text-black">
                          <div className="profile_img_wrap">
                            {currentUser?.profile_logo ? (
                              <img
                                src={currentUser?.profile_logo}
                                alt=""
                                className="user_img"
                              />
                            ) : currentUser?.first_name &&
                              currentUser?.last_name ? (
                              `${currentUser?.first_name
                                ?.charAt(0)
                                ?.toUpperCase()}
                      ${currentUser?.last_name?.charAt(0)?.toUpperCase()}`
                            ) : (
                              'UN'
                            )}
                          </div>
                          <h2 className="mb-3 fw-bold">
                            {currentUser?.first_name} {currentUser?.last_name}
                          </h2>
                          <h3 className="mb-3 fw-bold">
                            {' '}
                            {currentUser?.role_name}
                          </h3>
                          <h3 className="mb-4 fw-bold">
                            Emp No :{' '}
                            {currentUser?.emp_no ? currentUser?.emp_no : 'N/A'}
                          </h3>
                        </div>
                        <ul className="text-black">
                          <li>
                            <label>Address </label>
                            <span>{currentUser?.current_address}</span>
                          </li>
                          <li>
                            <label>Blood Group</label>
                            <span>
                              {currentUser?.blood_group
                                ? bloodGroup?.find(
                                    x => x?.value === currentUser?.blood_group,
                                  )?.label
                                : 'N/A'}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-3 text-end">
                        <Button
                          className="btn_primary d-inline-block"
                          onClick={onDownloadIdCard}
                        >
                          Download ID Card
                        </Button>
                      </div>
                    </Sidebar>
                  </li>
                </ul>
                <hr className="my-2" />
                <ul className="d-flex flex-wrap">
                  <li>
                    <h5>Role</h5>
                    <h4>
                      {currentUser?.role_name
                        ? currentUser?.role_name
                        : 'Operator'}
                    </h4>
                  </li>
                  <li>
                    <h5>Business Unit</h5>
                    <h4>Bags Guru</h4>
                  </li>
                  <li>
                    <h5>Emp No</h5>
                    <h4>{currentUser?.emp_no}</h4>
                  </li>
                  <li>
                    <h5>Joining date</h5>
                    <h4>
                      {moment(currentUser?.joining_date).format('DD-MM-YYYY')}
                    </h4>
                  </li>
                  <li>
                    <h5>Password</h5>
                    <h4>
                      Last Change{' '}
                      {countDaysBetweenTwoDays(currentUser?.updated_at)}
                    </h4>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <h3 className="my-3">Primary Details</h3>
          <div className="profile_middle_wrap">
            <div className="border rounded-3 bg_white p-3">
              <Row>
                <Col xl={3} lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="FirstName">First Name</label>
                    <InputText
                      id="FirstName"
                      placeholder="First Name"
                      name="first_name"
                      value={values?.first_name || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.first_name && errors?.first_name && (
                      <p className="text-danger">{errors?.first_name}</p>
                    )}
                  </div>
                </Col>
                <Col xl={3} lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="LastName">Last Name</label>
                    <InputText
                      id="LastName"
                      placeholder="Last Name"
                      name="last_name"
                      value={values?.last_name || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.last_name && errors?.last_name && (
                      <p className="text-danger">{errors?.last_name}</p>
                    )}
                  </div>
                </Col>
                <Col xl={3} lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="Email">Email</label>
                    <InputText
                      id="Email"
                      placeholder="Email"
                      name="email"
                      value={values?.email || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.email && errors?.email && (
                      <p className="text-danger">{errors?.email}</p>
                    )}
                  </div>
                </Col>
                <Col xl={3} lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="MobileNo">Mobile No</label>
                    <InputText
                      id="MobileNo"
                      placeholder="Mobile No"
                      name="mobile_no"
                      value={values?.mobile_no || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.mobile_no && errors?.mobile_no && (
                      <p className="text-danger">{errors?.mobile_no}</p>
                    )}
                  </div>
                </Col>
                <Col xl={3} lg={4} sm={6}>
                  <div className="form_group">
                    <label>Gender</label>
                  </div>
                  <div className="d-flex flex-wrap gap-lg-3 gap-2 custom_radio_wrappper mb-3">
                    <div className="d-flex align-items-center">
                      <RadioButton
                        inputId="Male"
                        value={1}
                        name="gender"
                        checked={values?.gender === 1}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label htmlFor="Other" className="ms-2">
                        Other
                      </label>
                    </div>
                  </div>
                </Col>
                <Col xl={3} lg={4} sm={6}>
                  <div className="form_group date_select_wrapper mb-3">
                    <label htmlFor="BirthDate">Birth Date</label>
                    <Calendar
                      id="BirthDate"
                      placeholder="Birth Date"
                      showIcon
                      name="dob"
                      dateFormat="dd-mm-yy"
                      value={new Date(values?.dob) || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      showButtonBar
                    />
                    {touched?.dob && errors?.dob && (
                      <p className="text-danger">{errors?.dob}</p>
                    )}
                  </div>
                </Col>
                <Col xl={3} lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="BloodGroup">Blood Group</label>
                    <ReactSelectSingle
                      filter
                      options={bloodGroup}
                      placeholder="Blood Group"
                      name="blood_group"
                      value={values?.blood_group || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.blood_group && errors?.blood_group && (
                      <p className="text-danger">{errors?.blood_group}</p>
                    )}
                  </div>
                </Col>
                <Col xl={3} lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="MaritalStatus">Marital Status</label>
                    <ReactSelectSingle
                      filter
                      options={maritalStatus}
                      placeholder="Marital Status"
                      name="marital_status"
                      value={values?.marital_status || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.marital_status && errors?.marital_status && (
                      <p className="text-danger">{errors?.marital_status}</p>
                    )}
                  </div>
                </Col>
                <Col xl={3} lg={4} sm={6}>
                  <div className="form_group">
                    <label htmlFor="CurrentAddress">Current Address</label>
                    <InputTextarea
                      placeholder="Current Address"
                      rows={3}
                      name="current_address"
                      value={values?.current_address || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.current_address && errors?.current_address && (
                      <p className="text-danger">{errors?.current_address}</p>
                    )}
                  </div>
                </Col>
                <Col xl={3} lg={4} sm={6}>
                  <div className="form_group">
                    <label htmlFor="PermanentAddress">Permanent Address</label>
                    <InputTextarea
                      placeholder="Permanent Address"
                      rows={3}
                      name="permanent_address"
                      value={values?.permanent_address || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
            </div>
          </div>
          <h3 className="my-3">Documents</h3>
          <div className="profile_bottom_wrap">
            <div className="border rounded-3 bg_white p-3">
              <Row>
                <Col lg={4} md={6}>
                  <div className="form_group mb-md-0 mb-3">
                    {/* {isActiveAdhaarLink ? (
                    <div className="upload_file_custom">
                      <InputText
                        type="file"
                        id="AdhaarUploadFile"
                        accept=".pdf"
                        value={''}
                        onChange={e =>
                          fileHandler('adhar_card_link', e.target.files)
                        }
                      />
                      <label htmlFor="AdhaarUploadFile">
                        <iframe
                          src={values?.adhar_card_link || UploadIcon}
                          alt="Adhaar Card"
                          className="img-fluid"
                          title="Adhaar Card"
                        />
                        {values?.adhar_card_link ? (
                          ''
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
                      <InputText
                        type="file"
                        id="PanUploadFile"
                        accept=".pdf"
                        value={''}
                        onChange={e =>
                          fileHandler('pan_card_link', e.target.files)
                        }
                      />
                      <label htmlFor="PanUploadFile">
                        <iframe
                          src={values?.pan_card_link || UploadIcon}
                          alt="PAN Card"
                          className="img-fluid"
                          title="Pan Card"
                        />
                        {values?.pan_card_link ? (
                          ''
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
                  )} */}
                    {isActiveAdhaarLink ? (
                      <div className="upload_file_custom">
                        <InputText
                          type="file"
                          id="AdhaarUploadFile"
                          accept=".pdf"
                          value={''}
                          onChange={e =>
                            fileHandler('adhar_card_link', e.target.files)
                          }
                        />
                        <label htmlFor="AdhaarUploadFile">
                          <iframe
                            src={values?.adhar_card_link || UploadIcon}
                            alt="Adhaar Card"
                            className="img-fluid"
                            title="Adhaar Card"
                          />
                          {values?.adhar_card_link ? (
                            <div className="mt-2 d-flex justify-content-center align-items-center">
                              <a
                                href={values?.adhar_card_link || ''}
                                className="btn_border me-3"
                                style={{ width: '35px', height: '35px' }}
                                onClick={onDownload}
                                target="_blank"
                                download={'Adhar_Card'}
                                rel="noreferrer"
                              >
                                <img src={Download} alt="" className="mb-0" />
                              </a>
                              <Button
                                className="btn_border"
                                onClick={e => onRemove(e, 'adhar_card_link')}
                                style={{ width: '35px', height: '35px' }}
                              >
                                <img src={TrashIcon} alt="" className="mb-0" />
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
                        <InputText
                          type="file"
                          id="PanUploadFile"
                          accept=".pdf"
                          value={''}
                          onChange={e =>
                            fileHandler('pan_card_link', e.target.files)
                          }
                        />
                        <label htmlFor="PanUploadFile">
                          <iframe
                            src={values?.pan_card_link || UploadIcon}
                            alt="PAN Card"
                            className="img-fluid"
                            title="Pan Card"
                          />
                          {values?.pan_card_link ? (
                            <div className="mt-2 d-flex justify-content-center align-items-center">
                              <a
                                href={values?.pan_card_link || ''}
                                className="btn_border me-3"
                                style={{ width: '35px', height: '35px' }}
                                onClick={onDownload}
                                target="_blank"
                                download={'pan_card'}
                                rel="noreferrer"
                              >
                                <img src={Download} alt="" className="mb-0" />
                              </a>
                              <Button
                                className="btn_border"
                                onClick={e => onRemove(e, 'pan_card_link')}
                                style={{ width: '35px', height: '35px' }}
                              >
                                <img src={TrashIcon} alt="" className="mb-0" />
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
                <Col lg={8} md={6}>
                  <ul>
                    <li className="mb-4">
                      <div
                        className="border rounded-3 bg_white  p-3 cusor-pointer"
                        onClick={() => setIsActiveAdhaarLink(true)}
                      >
                        {/*  <div
                      className="border rounded-3 bg_white d-flex justify-content-between p-3 cursor-pointer"
                      onClick={() => setIsActiveAdhaarLink(true)}
                    > */}
                        <h3 className="m-0">Aadhaar</h3>
                      </div>
                      {touched?.adhar_card_link && errors?.adhar_card_link && (
                        <p className="text-danger">{errors?.adhar_card_link}</p>
                      )}
                    </li>
                    <li>
                      <div
                        className="border rounded-3 bg_white p-3 cusor-pointer"
                        onClick={() => setIsActiveAdhaarLink(false)}
                      >
                        {/*  <div
                      className="border rounded-3 bg_white d-flex justify-content-between p-3 cursor-pointer"
                      onClick={() => setIsActiveAdhaarLink(false)}
                    > */}
                        <h3 className="m-0">Pan Card</h3>
                      </div>
                      {touched?.pan_card_link && errors?.pan_card_link && (
                        <p className="text-danger">{errors?.pan_card_link}</p>
                      )}
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-end pt-3">
            <Button
              className="btn_primary ms-3"
              onClick={() => handleSubmit(values)}
              disabled={usersCRUDLoading}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
