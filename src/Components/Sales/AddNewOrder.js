import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import PlusIcon from '../../Assets/Images/plus.svg';
import MinusIcon from '../../Assets/Images/minus.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  getAllUserPartyList,
  getPartiesAdvisor,
  getSingleListParties,
  getTransporterPartyList,
} from 'Services/partiesService';
import { useFormik } from 'formik';
import { salesOrderSchema } from 'Schemas/Sales/OrderSchemas';
import {
  clearSelectedSalesOrder,
  setUploadImage,
} from 'Store/Reducers/Sales/SalesOrderSlice';
import {
  createSalesOrder,
  getPreviousTransporter,
  getSalesOrdersItem,
  updateSalesOrder,
  updateStatusSalesOrder,
} from 'Services/Sales/OrderServices';
import Loader from 'Components/Common/Loader';
import { Dialog } from 'primereact/dialog';
import { uploadFile } from 'Services/CommonService';
import { FileDrop } from 'react-file-drop';
import UploadIcon from '../../Assets/Images/upload.svg';
import Download from '../../Assets/Images/download.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { getFormattedDate } from 'Helper/Common';

export default function AddNewOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef();
  const ref = useRef();
  const { order_id } = useParams();
  const { pathname } = useLocation();
  const locationPath = pathname?.split('/');
  const [filename, setFileName] = useState();
  const [addressList, setAddressList] = useState([]);
  const [billingList, setBillingList] = useState([]);
  const [shippingList, setShippingList] = useState([]);
  const [approvedPopup, setApprovedPopup] = useState({
    show: false,
    data: {},
  });

  const {
    partiesLoading,
    partiesAdvisor,
    transporterPartyList,
    allUserPartyList,
    singleListParties,
  } = useSelector(({ parties }) => parties);

  const {
    salesOrderLoading,
    salesOrderCRUDLoading,
    selectedOrder,
    uploadImage,
    previousTransporter,
  } = useSelector(({ salesOrder }) => salesOrder);

  const { settingsCRUDLoading } = useSelector(({ settings }) => settings);

  const loadRequiredData = useCallback(() => {
    dispatch(getPartiesAdvisor());
    dispatch(getTransporterPartyList());
    dispatch(getAllUserPartyList());
  }, [dispatch]);

  useEffect(() => {
    if (locationPath?.length < 3) {
      dispatch(clearSelectedSalesOrder());
      setAddressList([]);
      setBillingList([]);
      setShippingList([]);
    } else if (order_id) dispatch(getSalesOrdersItem(order_id));
  }, [order_id, locationPath?.length, dispatch]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (values?._id && !values?.isDuplicated) {
        const payload = {
          ...values,
          original_advisor: values?.original_advisor_id,
          present_advisor: values?.present_advisor_id,
          order_id: values?._id,
          order_date: getFormattedDate(values?.order_date),
          billing_address: values?.billing_address?.map(x => x?._id),
          shipping_address: values?.shipping_address?.map(x => x?._id),
        };
        result = await dispatch(updateSalesOrder(payload));
      } else {
        const payload = {
          ...values,
          original_advisor: values?.original_advisor_id,
          present_advisor: values?.present_advisor_id,
          order_date: getFormattedDate(values?.order_date),
          billing_address: values?.billing_address?.map(x => x?._id),
          shipping_address: values?.shipping_address?.map(x => x?._id),
        };
        result = await dispatch(createSalesOrder(payload));
      }
      if (result) {
        dispatch(clearSelectedSalesOrder());
        setAddressList([]);
        setBillingList([]);
        setShippingList([]);
        navigate('/order');
      }
    },
    [dispatch, navigate],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: selectedOrder,
    validationSchema: salesOrderSchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    loadRequiredData();

    return () => {
      dispatch(clearSelectedSalesOrder());
      setAddressList([]);
      setBillingList([]);
      setShippingList([]);
    };
  }, [loadRequiredData, dispatch]);

  useEffect(() => {
    if (locationPath?.[1] === 'add-new-order' && values.order_date === '') {
      setFieldValue('order_date', new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.invoice_date]);

  const fileHandler = useCallback(
    async files => {
      const nameLength = files[0]?.name?.split('.');
      const extension = nameLength[nameLength?.length - 1]?.toLowerCase();
      const uploadedFile = files ? [...files] : [];
      let result = '';
      let arr = [];
      for (let i = 0; i <= uploadedFile.length; i++) {
        const item = uploadedFile[i];
        result = await dispatch(uploadFile(item));
        if (result) arr.push(result);
      }
      // await uploadedFile.forEach(async e => {
      //   result = await dispatch(uploadFile(e));
      //   if (result) arr.push(result);
      //   // if (result) {
      //   //   dispatch(setUploadImage([...uploadImage, result]));
      //   // }
      //   // if (arr?.length > 0) {
      //   //   setFieldValue('attachment', arr);
      //   // }
      // });
      dispatch(setUploadImage([...arr]));
      setFieldValue('attachment', [...values.attachment, ...arr]);
    },
    [dispatch, setFieldValue, values],
  );

  const filePicker = useCallback(() => {
    inputRef?.current?.click();
  }, []);

  const onDownload = useCallback(e => {
    e.stopPropagation();
  }, []);

  const onRemove = useCallback(
    (e, index) => {
      const updatedData = [...values?.attachment];
      updatedData.splice(index, 1);
      setFieldValue('attachment', updatedData);
      e.stopPropagation();
      // setImage('');
      // setFileName('');
      // setFieldValue(fieldName, '');
    },
    [values, setFieldValue],
  );

  useEffect(() => {
    if (order_id) {
      setFieldValue('order_date', new Date(selectedOrder?.order_date));
    }
  }, [selectedOrder, setFieldValue, order_id]);

  const loadAddress = useCallback(async () => {
    const res = await dispatch(getSingleListParties(values?.party_name));
    if (res) {
      const billingList = res?.party_address?.filter(
        x => x?.address_type_name === 'BILLING',
      );
      const shippingList = res?.party_address?.filter(
        x => x?.address_type_name !== 'BILLING',
      );
      setBillingList(billingList);
      setShippingList(shippingList);
      if (locationPath?.[1] === 'add-new-order') {
        setFieldValue('shipping_address', [{ ...shippingList?.[0] }]);
        setFieldValue('billing_address', [{ ...billingList?.[0] }]);
        setFieldValue('present_advisor', res.present_advisor_name);
        setFieldValue('original_advisor', res.original_advisor_name);
        setFieldValue('present_advisor_id', res.present_advisor);
        setFieldValue('original_advisor_id', res.original_advisor);
        setAddressList(['']);
      } else {
        const newBillingList = billingList?.filter(x =>
          selectedOrder?.billing_address.includes(x?._id),
        );

        const newShippingList = shippingList?.filter(x =>
          selectedOrder?.shipping_address.includes(x?._id),
        );
        setAddressList(
          selectedOrder?.billing_address?.length >
            selectedOrder?.shipping_address?.length
            ? selectedOrder?.billing_address?.map(x => x)
            : selectedOrder?.shipping_address?.map(x => x),
        );

        setFieldValue('billing_address', newBillingList);
        setFieldValue('shipping_address', newShippingList);
      }
    }
  }, [dispatch, locationPath, setFieldValue, values?.party_name]);

  useEffect(() => {
    if (values?.party_name) loadAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.party_name]);

  useEffect(() => {
    if (previousTransporter) {
      let transporter = transporterPartyList?.find(
        x => x?._id === previousTransporter?.transporter,
      );
      setFieldValue('transporter', transporter?._id);
    }
  }, [previousTransporter, transporterPartyList, setFieldValue]);
  const onCancel = useCallback(() => {
    dispatch(clearSelectedSalesOrder());
    navigate('/order');
  }, [dispatch, navigate]);

  const onAddPartyAddress = useCallback(() => {
    let list = [...addressList];
    list?.push('');
    setAddressList(list);
  }, [addressList]);

  const onRemovePartyAddress = useCallback(
    index => {
      let updatedBillingAddress = [
        ...JSON.parse(JSON.stringify(values?.billing_address)),
      ];
      let updatedShippingAddress = [
        ...JSON.parse(JSON.stringify(values?.shipping_address)),
      ];
      updatedBillingAddress?.splice(index, 1);
      updatedShippingAddress?.splice(index, 1);
      setFieldValue('shipping_address', updatedShippingAddress);
      setFieldValue('billing_address', updatedBillingAddress);
      let list = [...addressList];
      list?.splice(index, 1);
      setAddressList(list);
    },
    [
      addressList,
      setFieldValue,
      values?.billing_address,
      values?.shipping_address,
    ],
  );

  const onCustomChange = useCallback(
    (key, val, index) => {
      let list;
      if (key === 'billing_address') {
        list = [...values?.billing_address];
      } else list = [...values?.shipping_address];
      list[index] = singleListParties?.party_address?.find(x => x?._id === val);
      setFieldValue(key, list);
    },
    [
      setFieldValue,
      singleListParties?.party_address,
      values?.billing_address,
      values?.shipping_address,
    ],
  );
  const onUpdateStatusOfOrderJob = useCallback(
    async status => {
      const res = await dispatch(updateStatusSalesOrder(order_id, status));
      if (res) {
        setApprovedPopup({
          show: false,
          data: {},
        });
        navigate('/order');
      }
    },
    [dispatch, navigate, order_id],
  );

  const onStatusCancel = useCallback(() => {
    setApprovedPopup({
      show: false,
      data: {},
    });
  }, []);
  return (
    <>
      {(salesOrderLoading || partiesLoading || settingsCRUDLoading) && (
        <Loader />
      )}
      <div className="main_Wrapper">
        <div className="addnew_order_wrap border rounded-3 bg_white p-3">
          <Row>
            {values?.order_no ? (
              <Col lg={3} md={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="OrderNo">Order No</label>
                  <InputText
                    id="OrderNo"
                    placeholder="Order No"
                    type="number"
                    name={'order_no'}
                    value={values?.order_no || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled
                  />
                  {touched?.order_no && errors?.order_no && (
                    <p className="text-danger">{errors?.order_no}</p>
                  )}
                </div>
              </Col>
            ) : null}
            <Col lg={3} md={4} sm={6}>
              <div className="form_group mb-3">
                <label>
                  Party Name <span className="text-danger fs-4">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  name={'party_name'}
                  value={values?.party_name || ''}
                  disabled={order_id}
                  options={allUserPartyList} // for party name
                  onChange={e => {
                    dispatch(getPreviousTransporter(e.value));
                    setFieldValue('party_name', e.value);
                  }}
                  onBlur={handleBlur}
                  placeholder="Party Name"
                />
                {touched?.party_name && errors?.party_name && (
                  <p className="text-danger">{errors?.party_name}</p>
                )}
              </div>
            </Col>
            <Col lg={3} md={4} sm={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="OrderDate">
                  Order Date
                  <span className="text-danger fs-4">*</span>
                </label>
                <Calendar
                  id="OrderDate"
                  placeholder="Select Order Date"
                  showIcon
                  showButtonBar
                  maxDate={new Date()}
                  name="order_date"
                  dateFormat="dd-mm-yy"
                  value={values?.order_date || ''}
                  disabled={order_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched?.order_date && errors?.order_date && (
                  <p className="text-danger">{errors?.order_date}</p>
                )}
              </div>
            </Col>
            <Col lg={3} md={4} sm={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="DueDate">Due Date</label>
                <Calendar
                  id="DueDate"
                  placeholder="Select Due Date"
                  showIcon
                  showButtonBar
                  name="due_date"
                  minDate={new Date()}
                  dateFormat="dd-mm-yy"
                  value={values?.due_date || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched?.due_date && errors?.due_date && (
                  <p className="text-danger">{errors?.due_date}</p>
                )}
              </div>
            </Col>
            <Col lg={3} md={4} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="City">Transporter</label>
                <ReactSelectSingle
                  filter
                  value={values?.transporter || ''}
                  options={transporterPartyList}
                  name="transporter"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Transporter"
                />
                {touched?.transporter && errors?.transporter && (
                  <p className="text-danger">{errors?.transporter}</p>
                )}
              </div>
            </Col>
            <Col lg={3} md={4} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="BookingStation">Booking Station</label>
                <InputText
                  id="BookingStation"
                  placeholder="Booking Station"
                  name="booking_station"
                  value={values?.booking_station || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched?.booking_station && errors?.booking_station && (
                  <p className="text-danger">{errors?.booking_station}</p>
                )}
              </div>
            </Col>
            <Col lg={3} md={4} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="State">Present Advisor</label>
                {/* <ReactSelectSingle
                  filter
                  name={'present_advisor'}
                  value={values?.present_advisor || ''}
                  options={partiesAdvisor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Present Advisor"
                /> */}
                <InputText
                  placeholder="Present Advisor"
                  name="present_advisor"
                  value={values?.present_advisor || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                {touched?.present_advisor && errors?.present_advisor && (
                  <p className="text-danger">{errors?.present_advisor}</p>
                )}
              </div>
            </Col>
            <Col lg={3} md={4} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="State">Original Advisor</label>
                {/* <ReactSelectSingle
                  filter
                  name={'original_advisor'}
                  value={values?.original_advisor || ''}
                  options={partiesAdvisor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Original Advisor"
                /> */}
                <InputText
                  placeholder="Original Advisor"
                  name="original_advisor"
                  value={values?.original_advisor || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                {touched?.original_advisor && errors?.original_advisor && (
                  <p className="text-danger">{errors?.original_advisor}</p>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col xl={3}>
              <div className="order_radio_wrap">
                <Row>
                  <div className="col-xxxl-6 custom_col">
                    <div className="form_group">
                      <label>CC Attach ?</label>
                      {touched?.is_cc_attach && errors?.is_cc_attach && (
                        <p className="text-danger">{errors?.is_cc_attach}</p>
                      )}
                      <div className="d-flex flex-wrap gap-3 custom_radio_wrappper">
                        <div className="d-flex align-items-center">
                          <RadioButton
                            inputId="AttachYes"
                            name="is_cc_attach"
                            value={1}
                            onChange={() => setFieldValue('is_cc_attach', 1)}
                            onBlur={handleBlur}
                            checked={values?.is_cc_attach === 1}
                          />
                          <label htmlFor="AttachYes" className="ms-2">
                            Yes
                          </label>
                        </div>
                        <div className="d-flex align-items-center">
                          <RadioButton
                            inputId="AttachNo"
                            name="is_cc_attach"
                            value={0}
                            onChange={() => setFieldValue('is_cc_attach', 0)}
                            checked={values?.is_cc_attach === 0}
                          />
                          <label htmlFor="AttachNo" className="ms-2">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxxl-6 custom_col">
                    <div className="form_group">
                      <label>Multiple Billing For Order ?</label>
                      {touched?.multiple_billing &&
                        errors?.multiple_billing && (
                          <p className="text-danger">
                            {errors?.multiple_billing}
                          </p>
                        )}
                      <div className="d-flex flex-wrap gap-3 custom_radio_wrappper">
                        <div className="d-flex align-items-center">
                          <RadioButton
                            inputId="MultiOrderYes"
                            name="multiple_billing"
                            value={1}
                            onChange={() =>
                              setFieldValue('multiple_billing', 1)
                            }
                            checked={values?.multiple_billing === 1}
                            onBlur={handleBlur}
                          />
                          <label htmlFor="MultiOrderYes" className="ms-2">
                            Yes
                          </label>
                        </div>
                        <div className="d-flex align-items-center">
                          <RadioButton
                            inputId="MultiOrderNo"
                            name="multiple_billing"
                            value={0}
                            onChange={() => {
                              setFieldValue('multiple_billing', 0);
                              setAddressList([' ']);
                              setFieldValue('shipping_address', [
                                { ...shippingList?.[0] },
                              ]);
                              setFieldValue('billing_address', [
                                { ...billingList?.[0] },
                              ]);
                            }}
                            checked={values?.multiple_billing === 0}
                            onBlur={handleBlur}
                          />
                          <label htmlFor="MultiOrderNo" className="ms-2">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxxl-6 custom_col">
                    <div className="form_group">
                      <label>Dispatch After Payment ?</label>
                      {touched?.dispatch_after_payment &&
                        errors?.dispatch_after_payment && (
                          <p className="text-danger">
                            {errors?.dispatch_after_payment}
                          </p>
                        )}
                      <div className="d-flex flex-wrap gap-3 custom_radio_wrappper">
                        <div className="d-flex align-items-center">
                          <RadioButton
                            inputId="PaymentYes"
                            name="dispatch_after_payment"
                            value={1}
                            onChange={() =>
                              setFieldValue('dispatch_after_payment', 1)
                            }
                            checked={values?.dispatch_after_payment === 1}
                            onBlur={handleBlur}
                          />
                          <label htmlFor="PaymentYes" className="ms-2">
                            Yes
                          </label>
                        </div>
                        <div className="d-flex align-items-center">
                          <RadioButton
                            inputId="PaymentNo"
                            name="dispatch_after_payment"
                            value={0}
                            onChange={() =>
                              setFieldValue('dispatch_after_payment', 0)
                            }
                            checked={values?.dispatch_after_payment === 0}
                            onBlur={handleBlur}
                          />
                          <label htmlFor="PaymentNo" className="ms-2">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxxl-6 custom_col">
                    <div className="form_group">
                      <label>Dispatch on Customer Invoice ?</label>
                      {touched?.dispatch_on_invoice &&
                        errors?.dispatch_on_invoice && (
                          <p className="text-danger">
                            {errors?.dispatch_on_invoice}
                          </p>
                        )}
                      <div className="d-flex flex-wrap gap-3 custom_radio_wrappper">
                        <div className="d-flex align-items-center">
                          <RadioButton
                            inputId="InvoiceYes"
                            name="dispatch_on_invoice"
                            value={1}
                            onChange={() =>
                              setFieldValue('dispatch_on_invoice', 1)
                            }
                            checked={values?.dispatch_on_invoice === 1}
                            onBlur={handleBlur}
                          />
                          <label htmlFor="InvoiceYes" className="ms-2">
                            Yes
                          </label>
                        </div>
                        <div className="d-flex align-items-center">
                          <RadioButton
                            inputId="InvoiceNo"
                            name="dispatch_on_invoice"
                            value={0}
                            onChange={() =>
                              setFieldValue('dispatch_on_invoice', 0)
                            }
                            checked={values?.dispatch_on_invoice === 0}
                            onBlur={handleBlur}
                          />
                          <label htmlFor="InvoiceNo" className="ms-2">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Row>
              </div>
            </Col>
            <Col xl={6} lg={8}>
              <Row>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="AdvanceAmount">Advance Amount</label>
                    <InputText
                      id="AdvanceAmount"
                      type="number"
                      placeholder="Advance Amount"
                      name="advance_amount"
                      value={values?.advance_amount || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="Comment">Comment</label>
                    <InputTextarea
                      placeholder="Comment"
                      type="textarea"
                      rows={1}
                      name="comment"
                      value={values?.comment || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.comment && errors?.comment && (
                      <p className="text-danger">{errors?.comment}</p>
                    )}
                  </div>
                </Col>

                {addressList?.map((x, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="plus_address_wrap d-flex align-items-center mb-3">
                        <h3 className="m-0">Address Details {i + 1} </h3>{' '}
                        {values?.multiple_billing === 1 ? (
                          i === 0 ? (
                            <Button
                              className="btn_primary ms-2"
                              onClick={onAddPartyAddress}
                              disabled={addressList?.length === 3}
                            >
                              <img
                                src={PlusIcon}
                                alt="Plus Icon"
                                className="plus_btn m-0"
                              />
                            </Button>
                          ) : (
                            <Button
                              className="btn_primary ms-2 p-1"
                              onClick={() => onRemovePartyAddress(i)}
                            >
                              <img
                                src={MinusIcon}
                                alt="Minus Icon"
                                className="plus_btn m-0"
                              />
                            </Button>
                          )
                        ) : null}
                      </div>
                      <Col md={6}>
                        <div className="form_group mb-3">
                          <label>Business Billing Address</label>
                          <div className="address_select_wrap">
                            <ReactSelectSingle
                              name={'billing_address'}
                              value={
                                values?.billing_address?.[i]?.value ||
                                values?.billing_address?.[i]?._id ||
                                ''
                              }
                              onChange={e =>
                                onCustomChange('billing_address', e.value, i)
                              }
                              options={[
                                ...billingList?.filter(
                                  obj =>
                                    !values?.billing_address?.some(
                                      obj2 => obj?._id === obj2?._id,
                                    ),
                                ),
                                billingList?.find(
                                  x =>
                                    x?._id ===
                                      values?.billing_address?.[i]?.value ||
                                    x?._id ===
                                      values?.billing_address?.[i]?._id,
                                ),
                              ]}
                              placeholder="Business"
                            />
                            {values?.billing_address?.[i]?.address ? (
                              <div className="address_wrap">
                                {values?.billing_address?.[i]?.address},<br />
                                {values?.billing_address?.[i]?.city_name},
                                {values?.billing_address?.[i]?.state_name},
                                {values?.billing_address?.[i]?.pincode},
                                <br />
                                {values?.billing_address?.[i]?.country_name}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form_group mb-3">
                          <label>Business Shipping Address</label>
                          <div className="address_select_wrap">
                            <ReactSelectSingle
                              value={
                                values?.shipping_address?.[i]?.value ||
                                values?.shipping_address?.[i]?._id ||
                                ''
                              }
                              onChange={e =>
                                onCustomChange('shipping_address', e.value, i)
                              }
                              options={[
                                ...shippingList?.filter(
                                  obj =>
                                    !values?.shipping_address?.some(
                                      obj2 => obj?._id === obj2?._id,
                                    ),
                                ),
                                shippingList?.find(
                                  x =>
                                    x?._id ===
                                      values?.shipping_address?.[i]?.value ||
                                    x?._id ===
                                      values?.shipping_address?.[i]?._id,
                                ),
                              ]}
                              placeholder="Business"
                            />
                            {values?.shipping_address?.[i]?.address ? (
                              <div className="address_wrap">
                                {values?.shipping_address?.[i]?.address},<br />
                                {values?.shipping_address?.[i]?.city_name},
                                {values?.shipping_address?.[i]?.state_name},
                                {values?.shipping_address?.[i]?.pincode},
                                <br />
                                {values?.shipping_address?.[i]?.country_name}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </Col>
                    </React.Fragment>
                  );
                })}
              </Row>
            </Col>
            {/* <Col xl={6} lg={8}>
              <Row>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="AdvanceAmount">Advance Amount</label>
                    <InputText
                      id="AdvanceAmount"
                      type="number"
                      placeholder="Advance Amount"
                      name="advance_amount"
                      value={values?.advance_amount || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.advance_amount && errors?.advance_amount && (
                      <p className="text-danger">{errors?.advance_amount}</p>
                    )}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="Comment">Comment</label>
                    <InputTextarea
                      placeholder="Comment"
                      rows={1}
                      name="comment"
                      value={values?.comment || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.comment && errors?.comment && (
                      <p className="text-danger">{errors?.comment}</p>
                    )}
                  </div>
                </Col>
                {addressList?.map((x, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="plus_address_wrap d-flex align-items-center mb-3">
                        <h3 className="m-0">Address Details {i + 1}</h3>{' '}
                        {values?.multiple_billing === 1 ? (
                          i === 0 ? (
                            <Button
                              className="btn_primary ms-2"
                              onClick={onAddPartyAddress}
                              disabled={addressList?.length === 3}
                            >
                              <img
                                src={PlusIcon}
                                alt="Plus Icon"
                                className="plus_btn m-0"
                              />
                            </Button>
                          ) : (
                            <Button
                              className="btn_primary ms-2 p-1"
                              onClick={() => onRemovePartyAddress(i)}
                            >
                              <img
                                src={MinusIcon}
                                alt="Minus Icon"
                                className="plus_btn m-0"
                              />
                            </Button>
                          )
                        ) : null}
                      </div>
                      <Col md={6}>
                        <div className="form_group mb-3">
                          <label>Business Billing Address</label>
                          <div className="address_select_wrap">
                            <ReactSelectSingle
                              name={'billing_address'}
                              value={values?.billing_address[i]?.value || ''}
                              onChange={e =>
                                onCustomChange('billing_address', e.value, i)
                              }
                              options={
                                i === 0
                                  ? billingList
                                  : [
                                      ...billingList?.filter(
                                        obj =>
                                          !values?.billing_address?.some(
                                            obj2 => obj?._id === obj2?._id,
                                          ),
                                      ),
                                      billingList?.find(
                                        x =>
                                          x?._id ===
                                          values?.billing_address[i]?.value,
                                      ),
                                    ]
                              }
                              placeholder="Business"
                            />
                            {values?.billing_address[i]?.address ? (
                              <div className="address_wrap">
                                {values?.billing_address[i]?.address},<br />
                                {values?.billing_address[i]?.city_name},
                                {values?.billing_address[i]?.state_name},
                                {values?.billing_address[i]?.pincode},
                                <br />
                                {values?.billing_address[i]?.country_name}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form_group mb-3">
                          <label>Business Shipping Address</label>
                          <div className="address_select_wrap">
                            <ReactSelectSingle
                              value={values?.shipping_address[i]?.value || ''}
                              onChange={e =>
                                onCustomChange('shipping_address', e.value, i)
                              }
                              options={
                                i === 0
                                  ? shippingList
                                  : [
                                      ...shippingList?.filter(
                                        obj =>
                                          !values?.shipping_address?.some(
                                            obj2 => obj?._id === obj2?._id,
                                          ),
                                      ),
                                      shippingList?.find(
                                        x =>
                                          x?._id ===
                                          values?.shipping_address[i]?.value,
                                      ),
                                    ]
                              }
                              placeholder="Business"
                            />
                            {values?.billing_address[i]?.address ? (
                              <div className="address_wrap">
                                {values?.billing_address[i]?.address},<br />
                                {values?.billing_address[i]?.city_name},
                                {values?.billing_address[i]?.state_name},
                                {values?.billing_address[i]?.pincode},
                                <br />
                                {values?.billing_address[i]?.country_name}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </Col>
                    </React.Fragment>
                  );
                })}
              </Row>
            </Col> */}
            <Col xl={3} lg={4} md={6}>
              {/* <DropZone
                module="sales"
                value={values?.attachment || ''}
                setFieldValue={setFieldValue}
                fieldName={'attachment'}
              /> */}

              <FileDrop
                ref={ref}
                onTargetClick={filePicker}
                onDrop={f => fileHandler(f)}
                className="image-dropzone"
              >
                <div className="upload_file_custom">
                  <input
                    // accept=".png"
                    // accept=".png, .jpg, .jpeg"
                    value={''}
                    style={{ visibility: 'hidden', opacity: 0 }}
                    ref={inputRef}
                    type="file"
                    multiple
                    onChange={e => fileHandler(e.target.files)}
                    // disabled={disabled}
                  />
                  <label htmlFor="UploadFile">
                    <img
                      src={UploadIcon}
                      alt=""
                      className="img-fluid"
                      style={{
                        height: '75px',
                        width: '100%',
                        objectFit: 'contain',
                      }}
                    />
                    <div className="upload_text">Upload your files</div>
                  </label>
                  <div className="uploaded_img_main">
                    {values?.attachment &&
                      values?.attachment?.map((d, i) => {
                        return (
                          <div className="uploaded_image_wrapper">
                            {/* <img
                              src={values?.attachment[i]}
                              alt=""
                              className="img-fluid uploaded_img"
                            /> */}
                            <iframe
                              src={values?.attachment[i]}
                              title="Iframe Example"
                              className="uploaded_doc"
                            ></iframe>
                            <div className="download_wrap">
                              <a
                                href={values?.attachment[i] || ''}
                                className="btn_transperant"
                                onClick={onDownload}
                                download={filename}
                              >
                                <img
                                  src={Download}
                                  alt=""
                                  className="mb-0 me-0"
                                />
                              </a>

                              <Button
                                className="btn_transperant"
                                onClick={e => {
                                  onRemove(e, i);
                                }}
                              >
                                <img src={TrashIcon} alt="" className="mb-0" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <p>{filename ? filename : ''}</p>
                </div>
              </FileDrop>
              {/* {touched?.attachment && errors?.attachment && (
                <p className="text-danger">{errors?.attachment}</p>
              )} */}
            </Col>
          </Row>
        </div>
        <div className="button_group d-flex align-items-center justify-content-end pt-3">
          <Button
            className="btn_border"
            onClick={onCancel}
            // disabled={salesOrderCRUDLoading}
          >
            Cancel
          </Button>
          <Button className="btn_primary ms-3" onClick={handleSubmit}>
            {order_id ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>
      <Dialog
        header={approvedPopup.data === 'Yes' ? 'Reject' : 'Approve'}
        visible={approvedPopup.show}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setApprovedPopup({ ...approvedPopup, show: false })}
      >
        <div className="approval_content_wrap">
          <p className="text-center mb-4">
            Are you sure you want to{' '}
            {approvedPopup.data === 'Yes' ? (
              <span className="text-danger">Reject?</span>
            ) : (
              <span className="text-success">Approve?</span>
            )}
          </p>
          <div className="button_group d-flex align-items-center justify-content-center">
            <Button className="btn_border" onClick={onStatusCancel}>
              Cancel
            </Button>
            <Button
              className="btn_primary ms-2"
              onClick={() => {
                onUpdateStatusOfOrderJob(approvedPopup.data === 'Yes' ? 5 : 1);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
