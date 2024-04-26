import { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import BagLogo from '../../Assets/Images/bag_gurulogo.svg';
import UploadLogo from '../../Assets/Images/upload-logo-icon-blue.svg';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { addCompanyAddressSchema, addCompanySchema } from 'Schemas/AllSchemas';
import { useDispatch } from 'react-redux';
import ActionBtn from '../../Assets/Images/action.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import {
  getPartiesAddressTypes,
  getPartiesCity,
  getPartiesCountry,
  getPartiesState,
} from 'Services/partiesService';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import {
  createNewCompany,
  getBusinessTypeList,
  getCompanyDetails,
  updateCompany,
} from 'Services/Settings/companyService';
import {
  setPartiesCity,
  setPartiesState,
} from 'Store/Reducers/Parties/parties.slice';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { uploadFile } from 'Services/CommonService';
import Loader from 'Components/Common/Loader';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import {
  companyAddress,
  setCompanyDetails,
} from 'Store/Reducers/Settings/SettingSlice';
import Skeleton from 'react-loading-skeleton';
import { getFactoryLocationList } from 'Services/Settings/MiscMasterService';

export default function Company({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_edit_access, is_delete_access } = hasAccess;

  const [deletePopup, setDeletePopup] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);

  const { loading, businessTypeList, companyDetails, settingsCRUDLoading } =
    useSelector(({ settings }) => settings);
  const { miscMasterLoading, factoryLocationList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );
  const {
    partiesLoading,
    partiesCategoriesLoading,
    partiesState,
    partiesCountry,
    partiesCity,
    partiesAddressType,
  } = useSelector(({ parties }) => parties);

  const loadRequiredData = useCallback(async () => {
    const res = await dispatch(getBusinessTypeList());
    if (res?.length > 0) {
      dispatch(getCompanyDetails());
      dispatch(getPartiesCountry());
      dispatch(getPartiesAddressTypes());
      dispatch(getFactoryLocationList());
    }
  }, [dispatch]);

  // const loadData = useCallback(() => {
  //   dispatch(getCompanyDetails());
  //   dispatch(getPartiesCountry());
  //   dispatch(getPartiesAddressTypes());
  //   dispatch(getFactoryLocationList());
  // }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (businessTypeList?.length > 0) loadData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [businessTypeList?.length]);

  const submitHandle = useCallback(
    async values => {
      let result;

      let payload = {
        ...values,
        address: values?.company_address,
      };

      if (values?._id) {
        payload = {
          ...payload,
          company_id: values?._id,
        };
        result = await dispatch(updateCompany(payload));
      } else {
        result = await dispatch(createNewCompany(payload));
      }
      if (result) {
        dispatch(getCompanyDetails());
        dispatch(setPartiesCity([]));
        dispatch(setPartiesState([]));
      }
    },
    [dispatch],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    setValues,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: companyDetails,
    validationSchema: addCompanySchema,
    onSubmit: submitHandle,
  });

  const addressFormik = useFormik({
    enableReinitialize: true,
    initialValues: companyAddress,
    validationSchema: addCompanyAddressSchema,
    onSubmit: company_address => {
      const address_type_name = partiesAddressType?.find(
        x => x?._id === company_address?.address_type,
      )?.name;
      const country_name = partiesCountry?.find(
        x => x?._id === company_address?.country,
      )?.name;
      const state_name = partiesState?.find(
        x => x?._id === company_address?.state,
      )?.name;
      const city_name = partiesCity?.find(
        x => x?._id === company_address?.city,
      )?.name;
      const location_name = factoryLocationList?.find(
        x => x?._id === company_address?.location,
      )?.name;

      let data = {
        ...company_address,
        address_type_name,
        state_name,
        country_name,
        city_name,
        location_name,
        no: company_address?._id
          ? company_address?.no
          : values?.company_address?.length + 1,
      };

      if (company_address?._id) {
        let list = [...values?.company_address];
        const index = list?.findIndex(x => x?._id === company_address?._id);
        if (index >= 0) {
          list?.splice(index, 1, data);
          setValues(prev => ({
            ...prev,
            company_address: list,
          }));
        }
      } else {
        setValues(prev => ({
          ...prev,
          company_address: [...prev.company_address, data],
        }));
      }
      addressFormik.resetForm();
    },
  });

  // const onCancel = useCallback(() => {
  //   resetForm();
  //   dispatch(setPartiesCity([]));
  //   dispatch(setPartiesState([]));
  // }, [dispatch, resetForm]);

  useEffect(() => {
    if (addressFormik.values?.country) {
      const countryCode = partiesCountry?.find(
        x => x?._id === addressFormik.values?.country,
      )?.country_code;
      if (countryCode) dispatch(getPartiesState({ code: countryCode }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partiesCountry, addressFormik.values?.country]);

  useEffect(() => {
    if (addressFormik.values?.state) {
      const stateCode = partiesState?.find(
        x => x?._id === addressFormik.values?.state,
      )?._id;
      if (stateCode) dispatch(getPartiesCity({ state_id: stateCode }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partiesState, addressFormik.values?.state]);

  const handleEdit = useCallback(
    item_no => {
      const address = values?.company_address?.find(x => x?.no === item_no);
      addressFormik.setValues(address);
    },
    [addressFormik, values?.company_address],
  );

  const handleDelete = useCallback(
    item_no => {
      if (item_no) {
        let data = JSON.parse(JSON.stringify({ ...values }));
        const selectedIndex = values?.company_address?.findIndex(
          x => x?.no === item_no,
        );
        data?.company_address?.splice(selectedIndex, 1);
        dispatch(setCompanyDetails(data));
        setValues(data);
        setDeletePopup(false);
      }
    },
    [dispatch, setValues, values],
  );

  const stockConsumptionAction = item => {
    return (
      <div className="edit_row">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="ection_btn"
            disabled={is_edit_access || is_delete_access ? false : true}
          >
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {is_edit_access && (
              <Dropdown.Item onClick={() => handleEdit(item?.no)}>
                <img src={EditIcon} alt="" /> Edit
              </Dropdown.Item>
            )}
            {is_delete_access && (
              <Dropdown.Item
                onClick={() => {
                  setDeletePopup(item?.no);
                }}
              >
                <img src={TrashIcon} alt="" /> Delete
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const fileHandler = async files => {
    const uploadedFile = files[0];

    if (files[0]) {
      const fileSizeLimit = 1 * 1024 * 1024; // 1MB limit
      const nameLength = files[0].name.split('.');

      const extension = nameLength[nameLength?.length - 1]?.toLowerCase();
      if (
        (extension !== 'png' || extension !== 'jpg' || extension !== 'jpeg') &&
        extension === undefined
      ) {
        toast.error('file type not supported');
      } else if (uploadedFile?.size <= fileSizeLimit) {
        const result = await dispatch(uploadFile(uploadedFile));
        if (result) {
          setValues({ ...values, company_logo: result });
        }
      } else {
        toast.error('Upload company logo must not be larger than 1mb.');
      }
    }
  };

  return (
    <>
      {(partiesLoading || partiesCategoriesLoading || settingsCRUDLoading) && (
        <Loader />
      )}
      <div className="main_Wrapper">
        <div className="party_detail_wrap">
          <Row className="g-0">
            <Col lg={6}>
              <div className="parties_detail_left">
                <h3 className="mb-3">Company Details</h3>
                <Row>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label>
                        Company Logo <span className="text-danger fs-4">*</span>
                      </label>
                      <div className="company_logo_wrap">
                        <div className="company_logo">
                          <img
                            loading="lazy"
                            src={values?.company_logo || BagLogo}
                            alt="Bag Icon"
                          />
                        </div>
                        <div className="upload_logo">
                          <InputText
                            type="file"
                            id="UploadFile"
                            accept=".png, .jpg, .jpeg"
                            value={''}
                            style={{ visibility: 'hidden', opacity: 0 }}
                            onChange={e => fileHandler(e.target.files)}
                          />
                          <label
                            htmlFor="UploadFile"
                            className="cursor-pointer"
                          >
                            <img
                              src={UploadLogo}
                              alt="Upload Logo"
                              className="me-2"
                            />
                            Upload Logo
                          </label>
                        </div>
                      </div>
                      {touched?.company_logo && errors?.company_logo && (
                        <p className="text-danger">{errors?.company_logo}</p>
                      )}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="CompanyName">
                        Company Name <span className="text-danger fs-4">*</span>
                      </label>
                      <InputText
                        id="CompanyName"
                        placeholder="Company Name"
                        name="company_name"
                        value={values?.company_name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched?.company_name && errors?.company_name && (
                        <p className="text-danger">{errors?.company_name}</p>
                      )}
                    </div>
                    <div className="form_group mb-3">
                      <label htmlFor="LegalName">
                        Legal Name <span className="text-danger fs-4">*</span>
                      </label>
                      <InputText
                        id="LegalName"
                        placeholder="Legal Name"
                        name="legal_name"
                        value={values?.legal_name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched?.legal_name && errors?.legal_name && (
                        <p className="text-danger">{errors?.legal_name}</p>
                      )}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="Website">
                        Website <span className="text-danger fs-4">*</span>
                      </label>
                      <InputText
                        id="Website"
                        placeholder="Website"
                        name="website"
                        value={values?.website || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched?.website && errors?.website && (
                        <p className="text-danger">{errors?.website}</p>
                      )}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="DirectorName">
                        Director Name{' '}
                        <span className="text-danger fs-4">*</span>
                      </label>
                      <InputText
                        id="DirectorName"
                        placeholder="Director Name"
                        name="director_name"
                        value={values?.director_name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched?.director_name && errors?.director_name && (
                        <p className="text-danger">{errors?.director_name}</p>
                      )}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="EmailId">
                        Email Id <span className="text-danger fs-4">*</span>
                      </label>
                      <InputText
                        id="EmailId"
                        placeholder="Email Id"
                        name="email_id"
                        value={values?.email_id || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched?.email_id && errors?.email_id && (
                        <p className="text-danger">{errors?.email_id}</p>
                      )}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="MobileNo">
                        Mobile No <span className="text-danger fs-4">*</span>
                      </label>
                      <InputText
                        id="MobileNo"
                        type="number"
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
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label>
                        Business Type{' '}
                        <span className="text-danger fs-4">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        name="business_type"
                        value={values?.business_type || ''}
                        onChange={handleChange}
                        options={businessTypeList || []}
                        placeholder="Business Type"
                      />
                      {touched?.business_type && errors?.business_type && (
                        <p className="text-danger">{errors?.business_type}</p>
                      )}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="GstNo">
                        GST No. <span className="text-danger fs-4">*</span>
                      </label>
                      <InputText
                        id="GstNo"
                        placeholder="GST No."
                        name="gst_no"
                        value={values?.gst_no || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched?.gst_no && errors?.gst_no && (
                        <p className="text-danger">{errors?.gst_no}</p>
                      )}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="PanNo">
                        PAN No <span className="text-danger fs-4">*</span>
                      </label>
                      <InputText
                        id="PanNo"
                        placeholder="PAN No"
                        name="pan_no"
                        value={values?.pan_no || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched?.pan_no && errors?.pan_no && (
                        <p className="text-danger">{errors?.pan_no}</p>
                      )}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="TanNo">
                        TAN No <span className="text-danger fs-4">*</span>
                      </label>
                      <InputText
                        id="TanNo"
                        placeholder="TAN No"
                        name="tan_no"
                        value={values?.tan_no || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched?.tan_no && errors?.tan_no && (
                        <p className="text-danger">{errors?.tan_no}</p>
                      )}
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
                        <label htmlFor="AddressType">
                          Address Type{' '}
                          <span className="text-danger fs-4">*</span>
                        </label>
                        <ReactSelectSingle
                          filter
                          onChange={addressFormik.handleChange}
                          name="address_type"
                          onBlur={addressFormik.handleBlur}
                          value={addressFormik.values?.address_type || ''}
                          options={partiesAddressType || []}
                          placeholder="Address Type"
                        />
                        {addressFormik.touched?.address_type &&
                          addressFormik.errors?.address_type && (
                            <p className="textaddressFormik.-danger">
                              {errors?.address_type}
                            </p>
                          )}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="Location">
                          Location <span className="text-danger fs-4">*</span>
                        </label>
                        <ReactSelectSingle
                          filter
                          id={'Location'}
                          onChange={addressFormik.handleChange}
                          name="location"
                          onBlur={addressFormik.handleBlur}
                          value={addressFormik.values?.location || ''}
                          options={factoryLocationList || []}
                          placeholder="Location"
                        />

                        {addressFormik.touched?.location &&
                          addressFormik.errors?.location && (
                            <p className="text-danger">
                              {addressFormik.errors?.location}
                            </p>
                          )}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="Address">
                          Address <span className="text-danger fs-4">*</span>
                        </label>
                        <InputTextarea
                          placeholder="Address"
                          rows={1}
                          name="address"
                          value={addressFormik.values?.address || ''}
                          onChange={addressFormik.handleChange}
                          onBlur={addressFormik.handleBlur}
                        />

                        {addressFormik.touched?.address &&
                          addressFormik.errors?.address && (
                            <p className="text-danger">
                              {addressFormik.errors?.address}
                            </p>
                          )}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="State">
                          Country <span className="text-danger fs-4">*</span>
                        </label>
                        <ReactSelectSingle
                          filter
                          onChange={addressFormik.handleChange}
                          name="country"
                          onBlur={addressFormik.handleBlur}
                          value={addressFormik.values?.country || ''}
                          options={partiesCountry || []}
                          placeholder="Country"
                        />
                        {addressFormik.touched?.country &&
                          addressFormik.errors?.country && (
                            <p className="text-danger">
                              {addressFormik.errors?.country}
                            </p>
                          )}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="State">
                          State <span className="text-danger fs-4">*</span>
                        </label>
                        <ReactSelectSingle
                          filter
                          onChange={addressFormik.handleChange}
                          name="state"
                          onBlur={addressFormik.handleBlur}
                          value={addressFormik.values?.state || ''}
                          options={partiesState || []}
                          placeholder="State"
                        />
                        {addressFormik.touched?.state &&
                          addressFormik.errors?.state && (
                            <p className="text-danger">
                              {addressFormik.errors?.state}
                            </p>
                          )}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="City">
                          City <span className="text-danger fs-4">*</span>
                        </label>
                        <ReactSelectSingle
                          filter
                          onChange={addressFormik.handleChange}
                          name="city"
                          value={addressFormik.values?.city || ''}
                          options={partiesCity || []}
                          placeholder="City"
                          onBlur={addressFormik.handleBlur}
                        />
                        {addressFormik.touched?.city &&
                          addressFormik.errors?.city && (
                            <p className="text-danger">
                              {addressFormik.errors?.city}
                            </p>
                          )}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="PinCode">
                          Pincode <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          id="PinCode"
                          type="number"
                          placeholder="Pincode"
                          name="pincode"
                          value={addressFormik.values?.pincode || ''}
                          onChange={addressFormik.handleChange}
                          onBlur={addressFormik.handleBlur}
                        />
                        {addressFormik.touched?.pincode &&
                          addressFormik.errors?.pincode && (
                            <p className="text-danger">
                              {addressFormik.errors?.pincode}
                            </p>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <div className="button_group d-flex align-items-center pt-3">
                    <Button
                      className="btn_primary"
                      type="submit"
                      onClick={() =>
                        is_edit_access && addressFormik.handleSubmit()
                      }
                      disabled={!is_edit_access}
                    >
                      {addressFormik.values?.no ? 'Update' : 'Add'}
                    </Button>
                    <Button
                      className="btn_border ms-3"
                      onClick={() => addressFormik.resetForm()}
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="data_table_wrapper cell_padding_large auto_height with_colspan_head  is_filter max_height">
                  <button
                    type="button"
                    className="table_filter_btn"
                    onClick={() => setFilterToggle(!filterToggle)}
                  >
                    <img src={SearchIcon} alt="" />
                  </button>
                  <DataTable
                    value={values?.company_address}
                    sortMode="multiple"
                    sortField="name"
                    sortOrder={1}
                    emptyMessage={
                      (loading || partiesLoading || miscMasterLoading) && (
                        <Skeleton count={2} />
                      )
                    }
                    dataKey="no"
                    filterDisplay="row"
                  >
                    <Column
                      field="no"
                      header="No"
                      sortable
                      filter={filterToggle}
                    ></Column>
                    <Column
                      field="address_type_name"
                      header="Address Type"
                      sortable
                      filter={filterToggle}
                    ></Column>
                    <Column
                      field="location_name"
                      header="Location"
                      sortable
                      filter={filterToggle}
                    ></Column>
                    <Column
                      field="address"
                      header="Address"
                      sortable
                      filter={filterToggle}
                    ></Column>
                    <Column
                      field="country_name"
                      header="Country"
                      sortable
                      filter={filterToggle}
                    ></Column>
                    <Column
                      field="state_name"
                      header="State"
                      sortable
                      filter={filterToggle}
                    ></Column>
                    <Column
                      field="city_name"
                      header="City"
                      sortable
                      filter={filterToggle}
                    ></Column>
                    <Column
                      field="pincode"
                      header="Pincode"
                      sortable
                      filter={filterToggle}
                    ></Column>
                    <Column
                      field="action"
                      header="Action"
                      body={stockConsumptionAction}
                    ></Column>
                  </DataTable>
                </div>
                <div className="button_group d-flex align-items-center justify-content-end p-3">
                  {/* <Button className="btn_border" onClick={onCancel}>
                    Cancel
                  </Button> */}
                  <Button
                    className="btn_primary ms-3"
                    type="submit"
                    onClick={() => is_edit_access && handleSubmit()}
                    disabled={!is_edit_access}
                  >
                    {values?._id ? 'Update' : 'Save'}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </>
  );
}
