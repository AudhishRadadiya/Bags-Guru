import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
// import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import Stock from 'Assets/Images/available-stock.svg';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  createSalesOrderJob,
  getJobItem,
  updateSalesOrderJob,
} from 'Services/Sales/OrderServices';
import { getProductList } from 'Services/Products/ProductService';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Calendar } from 'primereact/calendar';
import { toast } from 'react-toastify';
import Loader from 'Components/Common/Loader';
import {
  convertIntoNumber,
  getFormattedDate,
  roundValueThousandSeparator,
} from 'Helper/Common';
import {
  clearAddSelectedJobData,
  clearUpdateSelectedJobData,
  clearViewSelectedJobData,
  setAddSelectedJobData,
  setIsGetInitialValuesJob,
  setUpdateSelectedJobData,
  setViewSelectedJobData,
} from 'Store/Reducers/Sales/SalesOrderSlice';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { InputNumber } from 'primereact/inputnumber';

const addJobSchema = Yup.object().shape({
  due_date: Yup.string().required('Delivery date is required'),
  product_id: Yup.string().required('Product is required'),
  qty: Yup.string().required('Qty is required'),
  rate: Yup.string().when('unit_pc', unit_pc => {
    return unit_pc.includes(1)
      ? Yup.string().required('Rate is required')
      : Yup.string().notRequired();
  }),
  qty_kg: Yup.string().when('unit_pc', unit_pc => {
    return unit_pc.includes(0)
      ? Yup.string().required('Quantity is required')
      : Yup.string().notRequired();
  }),
  rate_kg: Yup.string().when('unit_pc', unit_pc => {
    return unit_pc.includes(0)
      ? Yup.string().required('Rate is required')
      : Yup.string().notRequired();
  }),
  // qty: Yup.number().required('Quantity is required'),
});

export default function JobDetail({ initialValues }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order_id, job_id } = useParams();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');
  const [error, setError] = useState(false);
  const [productOptionList, setProductOptionList] = useState([]);
  const [selectProduct, setSelectProduct] = useState({});
  // const [jobValue, setJobValue] = useState(initialValues);
  const [orderId, setOrderId] = useState('');

  const { allProductList, productLoading } = useSelector(
    ({ product }) => product,
  );
  const {
    salesOrderJobCRUDLoading,
    salesJobOrderDetail,
    salesOrderCRUDLoading,

    isGetInitialValuesJob,
    addSelectedJobData,
    updateSelectedJobData,
    viewSelectedJobData,
  } = useSelector(({ salesOrder }) => salesOrder);

  // const loadRequiredData = useCallback(() => {
  //   dispatch(getProductList(0, 0));
  // }, [dispatch]);

  // useEffect(() => {
  //   loadRequiredData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (locationPath?.length < 3) {
  //   } else if (job_id) {
  //     dispatch(getJobItem(job_id));
  //   }
  // }, [job_id, locationPath?.length, dispatch]);

  // useEffect(() => {
  //   if (allProductList?.length > 0) {
  //     const productList = allProductList?.map(data => {
  //       return { label: data?.product_code, value: data?._id };
  //     });
  //     setProduct(productList);
  //   }
  // }, [allProductList]);

  // const productOptionList = useMemo(() => {
  //   if (allProductList?.length) {
  //     const optionList = allProductList?.map(data => {
  //       return { label: data?.product_code, value: data?._id };
  //     });
  //     return optionList;
  //   }
  // }, [allProductList]);

  // useEffect(() => {
  //   if (values.due_date === '' && !job_id) {
  //     setFieldValue('due_date', new Date());
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (
  //     job_id &&
  //     Object.keys(salesJobOrderDetail)?.length > 0 &&
  //     allProductList?.length > 0
  //   ) {
  //     let product = allProductList?.filter(
  //       data => data?._id === salesJobOrderDetail?.product_id,
  //     );
  //     setSelectProduct(product[0]);
  //     setOrderId(salesJobOrderDetail?.salesOrder_id);
  //     // setJobValue({
  //     //   ...salesJobOrderDetail,
  //     //   product_id: salesJobOrderDetail?.product_id,
  //     //   qty: salesJobOrderDetail.qty,
  //     //   rate:
  //     //     salesJobOrderDetail.unit_pc === 1 ? salesJobOrderDetail?.rate : '',
  //     //   amount:
  //     //     salesJobOrderDetail.unit_pc === 1 ? salesJobOrderDetail?.amount : 0,
  //     //   qty_kg: salesJobOrderDetail.kg_qty,
  //     //   rate_kg:
  //     //     salesJobOrderDetail.unit_pc === 0 ? salesJobOrderDetail?.rate : '',
  //     //   amount_kg:
  //     //     salesJobOrderDetail.unit_pc === 0 ? salesJobOrderDetail?.amount : 0,
  //     //   final_amount: salesJobOrderDetail?.final_amount,
  //     //   due_date: salesJobOrderDetail?.due_date
  //     //     ? new Date(salesJobOrderDetail?.due_date)
  //     //     : '',
  //     // });
  //   }
  // }, [allProductList, job_id, salesJobOrderDetail]);

  const submitHandle = useCallback(
    async values => {
      let result;
      const due_date = getFormattedDate(values.due_date);
      // if (values?._id && !values?.isDuplicated) {
      //   const payload = {
      //     ...values,
      //     orderId: values?._id,
      //   };
      //   result = await dispatch(updateSalesOrder(payload));
      // } else {
      if (job_id) {
        const payload = {
          ...values,
          salesOrder_id: values?.sales_order_id,
          broker_unit_pc: values?.unit_pc,
          discount: Number(values.discount)?.toFixed(2),
          qty: Number(values.qty),
          kg_qty: Number(values.qty_kg),
          rate:
            values?.unit_pc === 0
              ? Number(values.rate_kg)?.toFixed(2)
              : Number(values.rate)?.toFixed(2),
          stereo_charge: Number(values.stereo_charge)?.toFixed(2),
          additional_charge: Number(values.additional_charge)?.toFixed(2),
          amount:
            values?.unit_pc === 0
              ? Number(values.amount_kg)?.toFixed(2)
              : Number(values.amount)?.toFixed(2),
          gst_amount: Number(values.gst_amount)?.toFixed(2),
          gst_percentage: Number(values?.gst_percentage)?.toFixed(2),
          job_id: values?._id,
          due_date: due_date,
        };
        result = await dispatch(updateSalesOrderJob(payload));
        if (result) {
          dispatch(
            setIsGetInitialValuesJob({
              ...isGetInitialValuesJob,
              update: false,
            }),
          );
          dispatch(clearUpdateSelectedJobData());
        }
      } else {
        const payload = {
          ...values,
          salesOrder_id: order_id,
          broker_unit_pc: values?.unit_pc,
          amount:
            values?.unit_pc === 0
              ? Number(values.amount_kg)?.toFixed(2)
              : Number(values.amount)?.toFixed(2),
          discount: Number(values.discount)?.toFixed(2),
          qty: Number(values.qty)?.toFixed(2),
          kg_qty: Number(values.qty_kg)?.toFixed(2),
          rate:
            values?.unit_pc === 0
              ? Number(values.rate_kg)?.toFixed(2)
              : Number(values.rate)?.toFixed(2),
          stereo_charge: Number(values.stereo_charge)?.toFixed(2),
          additional_charge: Number(values.additional_charge)?.toFixed(2),
          gst_amount: Number(values.gst_amount)?.toFixed(2),
          gst_percentage: Number(values?.gst_percentage)?.toFixed(2),
        };
        result = await dispatch(createSalesOrderJob(payload));
        if (result) {
          dispatch(
            setIsGetInitialValuesJob({
              ...isGetInitialValuesJob,
              add: false,
            }),
          );
          dispatch(clearAddSelectedJobData());
        }
      }
      if (result) {
        // navigate(`/order-details/${orderId ? orderId : order_id}`);
        navigate(-1);
      }
    },
    // [dispatch, isGetInitialValuesJob, job_id, navigate, orderId, order_id],
    [job_id, navigate, order_id, salesJobOrderDetail],
  );

  const {
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
    setValues,
    setFieldTouched,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: addJobSchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    if (allProductList?.length > 0) {
      const checkSelectedProductData =
        locationPath[1] === 'update-job'
          ? updateSelectedJobData
          : viewSelectedJobData;
      if (job_id && !checkSelectedProductData?.selected_product_detail) {
        const productDetail = allProductList?.find(
          data => data?._id === values?.product_id,
        );
        commonUpdateFieldValue('selected_product_detail', productDetail);
        // setSelectProduct(product);
      }
      const optionList = allProductList?.map(data => {
        return { label: data?.product_code, value: data?._id };
      });
      setProductOptionList(optionList);
    }
  }, [allProductList, values, initialValues]);

  useEffect(() => {
    if (
      values?.selected_product_detail &&
      Object.keys(values?.selected_product_detail)?.length > 0 &&
      // locationPath?.[1] === 'add-job'
      order_id
    ) {
      const amt = values.unit_pc === 1 ? values?.amount : values?.amount_kg;
      const gstAmount =
        (Number(amt) * Number(values?.selected_product_detail?.material_gst)) /
        100;
      const finalAmount =
        Number(amt) -
        Number(values.discount) +
        Number(values.stereo_charge) +
        Number(values.additional_charge) +
        Number(gstAmount);
      setValues({
        ...values,
        product_id: values?.selected_product_detail?._id,
        gst_percentage: values?.selected_product_detail?.material_gst,
        gst_amount: gstAmount ? gstAmount?.toFixed(2) : 0,
        final_amount: finalAmount ? finalAmount?.toFixed(2) : 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.selected_product_detail]);

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (job_id) {
      if (locationPath[1] === 'job-details') {
        dispatch(
          setViewSelectedJobData({
            ...viewSelectedJobData,
            [fieldName]: fieldValue,
          }),
        );
      } else {
        dispatch(
          setUpdateSelectedJobData({
            ...updateSelectedJobData,
            [fieldName]: fieldValue,
          }),
        );
      }
    } else {
      dispatch(
        setAddSelectedJobData({
          ...addSelectedJobData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleQtyPCS = e => {
    if (
      values?.selected_product_detail &&
      Object.keys(values?.selected_product_detail)?.length <= 0 &&
      e.value?.length === 1 &&
      error === false
    ) {
      toast.error('Please select product first');
      setError(false);
    }

    // Showing error when qty is blank :
    if (e.value === '') {
      setError(false);
    }

    // Set the value in variables:
    const amount = Number(e.value) * Number(values.rate);
    const weight = convertIntoNumber(
      values?.selected_product_detail?.bag_weight?.split(' ')[0],
    );
    let kg_qty = convertIntoNumber((Number(e.value) * weight) / 1000);

    // const gstAmount =
    //   (Number(e.value) * Number(values.rate) * Number(values.gst_percentage)) /
    //   100;
    // const finalAmount =
    //   amount -
    //   Number(values.discount) +
    //   Number(values.stereo_charge) +
    //   Number(values.additional_charge) +
    //   gstAmount;

    const calculate_TaxableAmount =
      amount -
      convertIntoNumber(values.discount) +
      convertIntoNumber(values.stereo_charge) +
      convertIntoNumber(values.additional_charge);

    const calculate_GST =
      (calculate_TaxableAmount * convertIntoNumber(values.gst_percentage)) /
      100;

    const calculate_final_amount = calculate_TaxableAmount + calculate_GST;

    if (kg_qty % 10 != 0) {
      let kg = convertIntoNumber(kg_qty / 10);
      // let round = Number.isInteger(Number(kg))
      //   ? Number(kg.split('.')[0])
      //   : Number(kg.split('.')[0]) + 1;
      let round = Number.isInteger(kg) ? kg : Math.ceil(kg);
      kg_qty = round * 10;
    }

    const Obj = {
      qty: e.value,
      qty_kg: kg_qty ? kg_qty : 0,
      amount: amount ? convertIntoNumber(amount) : 0,
      pcs_taxable_amount: calculate_TaxableAmount
        ? convertIntoNumber(calculate_TaxableAmount)
        : 0,
      gst_amount: calculate_GST ? convertIntoNumber(calculate_GST) : 0,
      final_amount: calculate_final_amount
        ? convertIntoNumber(calculate_final_amount)
        : 0,
    };

    // Set the feild value in form:
    setFieldValue('qty', e.value);
    setFieldValue('qty_kg', kg_qty ? kg_qty : 0);
    setFieldValue('amount', amount ? convertIntoNumber(amount) : 0);
    setFieldValue(
      'pcs_taxable_amount',
      calculate_TaxableAmount ? convertIntoNumber(calculate_TaxableAmount) : 0,
    );
    setFieldValue(
      'gst_amount',
      calculate_GST ? convertIntoNumber(calculate_GST) : 0,
    );
    setFieldValue(
      'final_amount',
      calculate_final_amount ? convertIntoNumber(calculate_final_amount) : 0,
    );

    // if (values?.unit_pc === 1) {
    // }
    // commonUpdateFieldValue('qty');

    if (job_id) {
      dispatch(
        setUpdateSelectedJobData({
          ...updateSelectedJobData,
          ...Obj,
        }),
      );
    } else {
      dispatch(
        setAddSelectedJobData({
          ...addSelectedJobData,
          ...Obj,
        }),
      );
    }
  };

  const handleRatePCS = e => {
    const amount =
      convertIntoNumber(values.qty) * convertIntoNumber(e.target.value);

    const calculate_TaxableAmount =
      amount -
      convertIntoNumber(values.discount) +
      convertIntoNumber(values.stereo_charge) +
      convertIntoNumber(values.additional_charge);

    const calculate_GST =
      (calculate_TaxableAmount * convertIntoNumber(values.gst_percentage)) /
      100;

    const calculate_final_amount = calculate_TaxableAmount + calculate_GST;

    // const gstAmount =
    //   (Number(values.qty) *
    //     Number(e.target.value) *
    //     Number(values.gst_percentage)) /
    //   100;

    // const finalAmount =
    //   amount -
    //   Number(values.discount) +
    //   Number(values.stereo_charge) +
    //   Number(values.additional_charge) +
    //   gstAmount;

    const Obj = {
      rate: e.target.value,
      amount: amount ? convertIntoNumber(amount) : 0,
      pcs_taxable_amount: calculate_TaxableAmount
        ? convertIntoNumber(calculate_TaxableAmount)
        : 0,
      gst_amount: calculate_GST ? convertIntoNumber(calculate_GST) : 0,
      final_amount: calculate_final_amount
        ? convertIntoNumber(calculate_final_amount)
        : 0,
    };

    setFieldValue('rate', e.target.value);
    setFieldValue('amount', amount ? convertIntoNumber(amount) : 0);
    setFieldValue(
      'pcs_taxable_amount',
      calculate_TaxableAmount ? convertIntoNumber(calculate_TaxableAmount) : 0,
    );
    setFieldValue(
      'gst_amount',
      calculate_GST ? convertIntoNumber(calculate_GST) : 0,
    );
    setFieldValue(
      'final_amount',
      calculate_final_amount ? convertIntoNumber(calculate_final_amount) : 0,
    );

    // commonUpdateFieldValue('rate', e.target.value);

    if (job_id) {
      dispatch(
        setUpdateSelectedJobData({
          ...updateSelectedJobData,
          ...Obj,
        }),
      );
    } else {
      dispatch(
        setAddSelectedJobData({
          ...addSelectedJobData,
          ...Obj,
        }),
      );
    }
  };

  const handleQtyKG = e => {
    if (
      values?.selected_product_detail &&
      Object.keys(values?.selected_product_detail)?.length <= 0 &&
      e.target.value?.length === 1 &&
      error === false
    ) {
      toast.error('Please select product first');
      setError(false);
    }

    // Showing error when qty is blank :
    if (e.target.value === '') {
      setError(false);
    }

    // Set the value in variables:
    const amountKg = Number(e.target.value) * Number(values.rate_kg);
    const totalgm = Number(e.target.value) * 1000;
    const weight =
      totalgm /
      convertIntoNumber(
        values?.selected_product_detail?.bag_weight?.split(' ')[0],
      );
    // const gstAmount =
    //   (Number(e.target.value) *
    //     Number(values.rate_kg) *
    //     Number(values.gst_percentage)) /
    //   100;
    // const finalAmount =
    //   Number(e.target.value) * Number(values.rate_kg) -
    //   Number(values.discount) +
    //   Number(values.stereo_charge) +
    //   Number(values.additional_charge) +
    //   gstAmount;
    let qty = Math.round(weight);

    const calculate_TaxableAmount =
      amountKg -
      convertIntoNumber(values.discount) +
      convertIntoNumber(values.stereo_charge) +
      convertIntoNumber(values.additional_charge);

    const calculate_GST =
      (calculate_TaxableAmount * convertIntoNumber(values.gst_percentage)) /
      100;

    const calculate_final_amount = calculate_TaxableAmount + calculate_GST;

    if (qty % 100 != 0) {
      let pc = convertIntoNumber(qty / 100);
      // let round = Number.isInteger(Number(pc))
      //   ? Number(pc.split('.')[0])
      //   : Number(pc.split('.')[0]) + 1;
      let round = Number.isInteger(pc) ? pc : Math.round(pc) + 1;
      qty = round * 100;
    }

    // Set the feild value in form:

    const Obj = {
      qty: qty ? qty : 0,
      qty_kg: e.target.value,
      amount_kg: amountKg ? amountKg : 0,
      kgs_taxable_amount: calculate_TaxableAmount ? calculate_TaxableAmount : 0,
      gst_amount: calculate_GST ? convertIntoNumber(calculate_GST) : 0,
      final_amount: calculate_final_amount
        ? convertIntoNumber(calculate_final_amount)
        : 0,
    };

    setFieldValue('qty', qty ? qty : 0);
    setFieldValue('qty_kg', e.target.value);
    setFieldValue('amount_kg', amountKg ? convertIntoNumber(amountKg) : 0);
    setFieldValue(
      'kgs_taxable_amount',
      calculate_TaxableAmount ? convertIntoNumber(calculate_TaxableAmount) : 0,
    );
    setFieldValue(
      'gst_amount',
      calculate_GST ? convertIntoNumber(calculate_GST) : 0,
    );
    setFieldValue(
      'final_amount',
      calculate_final_amount ? convertIntoNumber(calculate_final_amount) : 0,
    );

    // commonUpdateFieldValue('qty_kg', e.target.value);

    if (job_id) {
      dispatch(
        setUpdateSelectedJobData({
          ...updateSelectedJobData,
          ...Obj,
        }),
      );
    } else {
      dispatch(
        setAddSelectedJobData({
          ...addSelectedJobData,
          ...Obj,
        }),
      );
    }
  };

  const handleRateKG = e => {
    const amountKg = Number(values.qty_kg) * Number(e.target.value);
    // const gstAmount =
    //   (Number(values.qty_kg) *
    //     Number(e.target.value) *
    //     Number(values.gst_percentage)) /
    //   100;
    // const finalAmount =
    //   amountKg -
    //   Number(values.discount) +
    //   Number(values.stereo_charge) +
    //   Number(values.additional_charge) +
    //   gstAmount;

    const calculate_TaxableAmount =
      amountKg -
      convertIntoNumber(values.discount) +
      convertIntoNumber(values.stereo_charge) +
      convertIntoNumber(values.additional_charge);

    const calculate_GST =
      (calculate_TaxableAmount * convertIntoNumber(values.gst_percentage)) /
      100;

    const calculate_final_amount = calculate_TaxableAmount + calculate_GST;

    const Obj = {
      rate_kg: e.target.value,
      amount_kg: amountKg ? convertIntoNumber(amountKg) : 0,
      kgs_taxable_amount: calculate_TaxableAmount ? calculate_TaxableAmount : 0,
      gst_amount: calculate_GST ? convertIntoNumber(calculate_GST) : 0,
      final_amount: calculate_final_amount
        ? convertIntoNumber(calculate_final_amount)
        : 0,
    };

    setFieldValue('rate_kg', e.target.value);
    setFieldValue('amount_kg', amountKg ? convertIntoNumber(amountKg) : 0);
    setFieldValue(
      'kgs_taxable_amount',
      calculate_TaxableAmount ? convertIntoNumber(calculate_TaxableAmount) : 0,
    );
    setFieldValue(
      'gst_amount',
      calculate_GST ? convertIntoNumber(calculate_GST) : 0,
    );
    setFieldValue(
      'final_amount',
      calculate_final_amount ? convertIntoNumber(calculate_final_amount) : 0,
    );

    if (job_id) {
      dispatch(
        setUpdateSelectedJobData({
          ...updateSelectedJobData,
          ...Obj,
        }),
      );
    } else {
      dispatch(
        setAddSelectedJobData({
          ...addSelectedJobData,
          ...Obj,
        }),
      );
    }
  };

  const handleChangeFieldsdData = (fieldObject = {}) => {
    if (job_id) {
      dispatch(
        setUpdateSelectedJobData({
          ...updateSelectedJobData,
          ...fieldObject,
        }),
      );
    } else {
      dispatch(
        setAddSelectedJobData({
          ...addSelectedJobData,
          ...fieldObject,
        }),
      );
    }

    Object.keys(fieldObject)?.map(keys => {
      return setFieldValue(keys, fieldObject[keys]);
    });
  };

  return (
    <div className="main_Wrapper">
      {(salesOrderJobCRUDLoading ||
        productLoading ||
        salesOrderCRUDLoading) && <Loader />}
      <div className="add_job_wrap">
        <Row>
          <Col lg={4}>
            <div className="add_job_left_wrap border rounded-3 bg_white p-3 mb-3">
              <div className="form_group mb-3">
                <label>
                  Select Product<span className="text-danger fs-4">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  name="product_id"
                  value={values?.product_id || ''}
                  options={productOptionList || []}
                  disabled={state?.isView || job_id}
                  onChange={e => {
                    const findProduct = allProductList?.find(
                      data => data?._id === e.target.value,
                    );
                    commonUpdateFieldValue(e.target.name, e.target.value);
                    commonUpdateFieldValue(
                      'selected_product_detail',
                      findProduct,
                    );
                    // setFieldValue('selected_product_detail', findProduct);
                    // setSelectProduct(product?.[0]);
                    setFieldValue('qty', '');
                    setFieldValue('rate', '');
                    setFieldValue('amount', 0);
                    setFieldValue('qty_kg', '');
                    setFieldValue('rate_kg', '');
                    setFieldValue('amount_kg', 0);
                    setFieldValue('final_amount', 0);
                    setFieldValue('discount', 0);
                    setFieldValue('stereo_charge', 0);
                    setFieldValue('additional_charge', 0);
                    setFieldValue('gst_amount', 0);
                    // setFieldValue('product_id', e.target.value);
                  }}
                  onBlur={handleBlur}
                  placeholder="Select Product"
                />
                {touched?.product_id && errors?.product_id && (
                  <p className="text-danger">{errors?.product_id}</p>
                )}
              </div>
              {values?.selected_product_detail &&
                Object.keys(values?.selected_product_detail)?.length > 0 && (
                  <>
                    <div className="available_stock_wrap mb-3">
                      <img src={Stock} alt="Stock Icon" className="me-2"></img>
                      <span className="text_secondary">
                        Available stock Qty:{' '}
                        {values?.selected_product_detail?.qty}
                      </span>
                    </div>
                    <h3>Product Details</h3>
                    <div className="product_detail_wrap">
                      <img
                        src={values?.selected_product_detail?.main_image}
                        alt="BagImage"
                        className="w-100"
                      />
                      <h4>Bag Size</h4>
                      <h5>{values?.selected_product_detail?.product_code}</h5>
                      <ul className="rounded_ul">
                        <li>
                          Bag Type:{' '}
                          {values?.selected_product_detail?.bag_type_name}
                        </li>
                        <li>
                          Bag Printing:{' '}
                          {values?.selected_product_detail?.print_type_name}
                        </li>
                        <li>
                          Design Name:{' '}
                          {values?.selected_product_detail?.design_name}{' '}
                        </li>
                        <li>
                          Bag Weight:{' '}
                          {values?.selected_product_detail?.bag_weight}{' '}
                        </li>
                        {!['D - CUT', 'D - CUT WITH UF'].includes(
                          values?.selected_product_detail?.bag_type_name,
                        ) && (
                          <li>
                            Handle Color:{' '}
                            {values?.selected_product_detail?.handle_color}{' '}
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
            </div>
          </Col>
          <Col lg={8}>
            <div className="add_job_right_wrap border rounded-3 bg_white p-3 mb-3">
              <Row className="mb-3">
                <Col xs={3}>
                  <div className="custom_col">
                    <div className="form_group date_select_wrapper">
                      <label htmlFor="deliveryDate">
                        Delivery Date
                        <span className="text-danger fs-4">*</span>
                      </label>
                      <Calendar
                        id="deliveryDate"
                        placeholder="Select Delivery Date"
                        showIcon
                        showButtonBar
                        // minDate={new Date()}
                        dateFormat="dd-mm-yy"
                        selectionMode="single"
                        name="due_date"
                        value={values?.due_date || ''}
                        onChange={e => {
                          commonUpdateFieldValue('due_date', e.target.value);
                        }}
                        onBlur={handleBlur}
                        disabled={state?.isView}
                      />
                      {touched?.due_date && errors?.due_date && (
                        <p className="text-danger">{errors?.due_date}</p>
                      )}
                    </div>
                  </div>
                </Col>
                <Col xs={9}>
                  <div className="form_group custom_radio_wrappper mb-3">
                    <RadioButton
                      inputId="OLDStereo"
                      name="old_stereo"
                      value={1}
                      // onChange={() => setFieldValue('old_stereo', 1)}
                      onChange={e => {
                        commonUpdateFieldValue('old_stereo', 1);
                      }}
                      disabled={state?.isView}
                      onBlur={handleBlur}
                      checked={values?.old_stereo === 1}
                      className="me-3"
                    />
                    <label htmlFor="OLDStereo" className="me-3">
                      OLD Stereo
                    </label>
                    <RadioButton
                      inputId="NEWStereo"
                      name="old_stereo"
                      value={0}
                      // onChange={() => setFieldValue('old_stereo', 0)}
                      onChange={e => {
                        commonUpdateFieldValue('old_stereo', 0);
                      }}
                      disabled={state?.isView}
                      onBlur={handleBlur}
                      checked={values?.old_stereo === 0}
                      className="me-3"
                    />
                    <label htmlFor="NEWStereo">NEW Stereo</label>
                  </div>
                </Col>
              </Row>

              <div className="radio_line_wrap mb-2">
                <div className="custom_radio_wrappper">
                  <RadioButton
                    inputId="QtyPcs"
                    name="unit_pc"
                    value={1}
                    onChange={() => {
                      // setFieldValue('unit_pc', 1);
                      commonUpdateFieldValue('unit_pc', 1);
                      setFieldValue('qty', '');
                      setFieldValue('rate', '');
                      setFieldValue('amount', 0);
                      setFieldValue('broker_rate_kg', 0);
                      setFieldValue('qty_kg', '');
                      setFieldValue('rate_kg', '');
                      setFieldValue('amount_kg', 0);
                      setFieldValue('final_amount', 0);
                      setFieldValue('discount', 0);
                      setFieldValue('stereo_charge', 0);
                      setFieldValue('additional_charge', 0);
                      setFieldValue('gst_amount', 0);
                    }}
                    onBlur={handleBlur}
                    disabled={
                      state?.isView ||
                      (job_id && salesJobOrderDetail?.unit_pc === 0)
                    }
                    checked={values?.unit_pc === 1}
                    className="me-2"
                  />
                  <label htmlFor="QtyPcs" className="me-2">
                    PCs
                  </label>
                </div>
                <div className="radio_line_input">
                  <Row>
                    <div className="custom_col">
                      <div className="form_group mb-3">
                        <label htmlFor="QtyPCs">
                          Qty(PCs)
                          <span className="text-danger fs-4">*</span>
                        </label>

                        {/* <InputNumber
                          // useGrouping={fieldName === 'transfer_weight' ? true : false}
                          useGrouping={true}
                          // min={0}
                          maxFractionDigits={
                            fieldName === 'transfer_weight' ? 2 : 0
                          }
                          name={fieldName}
                          placeholder={`Enter ${headerName}`}
                          value={data[fieldName] || ''}
                          onChange={e => onChangeTransferData(e, e.value, data)}
                        /> */}

                        <InputNumber
                          id="QtyPCs"
                          placeholder="Qty"
                          useGrouping={false}
                          className="w-100"
                          // maxFractionDigits={
                          //   fieldName === 'transfer_weight' ? 2 : 0
                          // }
                          // type="number"
                          name="qty"
                          disabled={state?.isView || values?.unit_pc === 0}
                          value={values?.qty || ''}
                          onChange={e => {
                            handleQtyPCS(e);

                            // if (
                            //   values?.selected_product_detail &&
                            //   Object.keys(values?.selected_product_detail)
                            //     ?.length <= 0 &&
                            //   e.target.value?.length === 1 &&
                            //   error === false
                            // ) {
                            //   toast.error('Please select product first');
                            //   setError(false);
                            // }
                            // if (e.target.value === '') {
                            //   setError(false);
                            // }
                            // let weight = parseFloat(
                            //   values?.selected_product_detail?.bag_weight?.split(
                            //     ' ',
                            //   )[0],
                            // );
                            // let kg_qty = parseFloat(
                            //   Number(e.target.value) * (weight / 1000),
                            // ).toFixed(2);
                            // if (kg_qty % 10 != 0) {
                            //   let kg = parseFloat(kg_qty / 10).toFixed(2);
                            //   let round = Number.isInteger(Number(kg))
                            //     ? Number(kg.split('.')[0])
                            //     : Number(kg.split('.')[0]) + 1;
                            //   kg_qty = round * 10;
                            // }
                            // setFieldValue('qty_kg', kg_qty ? kg_qty : 0);

                            // let amount =
                            //   Number(e.target.value) * Number(values.rate);
                            // setFieldValue(
                            //   'amount',
                            //   amount ? amount?.toFixed(2) : 0,
                            // );
                            // let gstAmount =
                            //   (Number(e.target.value) *
                            //     Number(values.rate) *
                            //     Number(values.gst_percentage)) /
                            //   100;
                            // if (values?.unit_pc === 1) {
                            //   let finalAmount =
                            //     amount -
                            //     Number(values.discount) +
                            //     Number(values.stereo_charge) +
                            //     Number(values.additional_charge) +
                            //     gstAmount;
                            //   setFieldValue(
                            //     'final_amount',
                            //     finalAmount ? finalAmount?.toFixed(2) : 0,
                            //   );
                            //   setFieldValue(
                            //     'gst_amount',
                            //     gstAmount ? gstAmount?.toFixed(2) : 0,
                            //   );
                            // }
                            // // setFieldValue('qty', e.target.value);
                            // commonUpdateFieldValue('qty', e.target.value);
                          }}
                          onKeyDown={e => {
                            if (e.keyCode === 8) {
                              setError(true);
                            }
                          }}
                          onBlur={handleBlur}
                        />
                        {touched?.qty && errors?.qty && (
                          <p className="text-danger">{errors?.qty}</p>
                        )}
                      </div>
                    </div>
                    <div className="custom_col">
                      <div className="form_group mb-3">
                        <label htmlFor="RatePCs">
                          Rate(PCs)
                          {values?.unit_pc === 1 ? (
                            <span className="text-danger fs-4">*</span>
                          ) : null}
                        </label>
                        <InputText
                          id="RatePCs"
                          placeholder="Rate"
                          type="number"
                          name="rate"
                          className="green_input"
                          disabled={state?.isView || values?.unit_pc === 0}
                          value={values?.rate || ''}
                          onChange={e => {
                            handleRatePCS(e);

                            // let amount =
                            //   Number(values.qty) * Number(e.target.value);
                            // setFieldValue(
                            //   'amount',
                            //   amount ? amount?.toFixed(2) : 0,
                            // );
                            // let gstAmount =
                            //   (Number(values.qty) *
                            //     Number(e.target.value) *
                            //     Number(values.gst_percentage)) /
                            //   100;
                            // if (values?.unit_pc === 1) {
                            //   let finalAmount =
                            //     amount -
                            //     Number(values.discount) +
                            //     Number(values.stereo_charge) +
                            //     Number(values.additional_charge) +
                            //     gstAmount;
                            //   setFieldValue(
                            //     'final_amount',
                            //     finalAmount ? finalAmount?.toFixed(2) : 0,
                            //   );
                            //   setFieldValue(
                            //     'gst_amount',
                            //     gstAmount ? gstAmount?.toFixed(2) : 0,
                            //   );
                            // }
                            // // setFieldValue('rate', e.target.value);
                            // commonUpdateFieldValue('rate', e.target.value);
                          }}
                          onBlur={handleBlur}
                        />
                        {touched?.rate && errors?.rate && (
                          <p className="text-danger">{errors?.rate}</p>
                        )}
                      </div>
                    </div>
                    <div className="custom_col">
                      <div className="form_group mb-3">
                        <label htmlFor="Amount">Amount</label>
                        {/* <InputText
                          id="Amount"
                          placeholder="Amount"
                          type="number"
                          name="amount"
                          value={values?.amount || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue('amount', e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled
                        /> */}

                        <InputNumber
                          id="Amount"
                          placeholder="Amount"
                          name="amount"
                          className="w-100"
                          value={values?.amount || ''}
                          onChange={e => {
                            commonUpdateFieldValue('amount', e.value);
                          }}
                          onBlur={handleBlur}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="custom_col">
                      <div className="form_group mb-3">
                        <label htmlFor="BrokerBaseRate">Broker Base Rate</label>
                        <InputText
                          id="BrokerBaseRate"
                          placeholder="00.00"
                          type="number"
                          name="broker_rate"
                          value={values?.broker_rate || ''}
                          disabled={values?.unit_pc === 0 || state?.isView}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'broker_rate',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>
                    {/* <div className="custom_col">
                      <div className="form_group mb-3">
                        <label htmlFor="TotalBrokerBaseRate">
                          Total Broker Base Rate
                        </label>
                        <InputText
                          id="TotalBrokerBaseRate"
                          placeholder="00.00"
                          type="number"
                          name="broker_total"
                          value={values?.broker_total || ''}
                          disabled={state?.isView}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div> */}
                  </Row>
                </div>
              </div>
              <div className="radio_line_wrap">
                <div className="custom_radio_wrappper">
                  <RadioButton
                    inputId="QtyKg"
                    name="unit_pc"
                    value={0}
                    onChange={() => {
                      setFieldTouched('unit_pc');
                      // setFieldValue('unit_pc', 0);
                      commonUpdateFieldValue('unit_pc', 0);
                      setFieldValue('qty', '');
                      setFieldValue('rate', '');
                      setFieldValue('amount', 0);
                      setFieldValue('broker_rate', 0);
                      setFieldValue('qty_kg', '');
                      setFieldValue('rate_kg', '');
                      setFieldValue('amount_kg', 0);
                      setFieldValue('final_amount', 0);
                      setFieldValue('discount', 0);
                      setFieldValue('stereo_charge', 0);
                      setFieldValue('additional_charge', 0);
                      setFieldValue('gst_amount', 0);
                    }}
                    disabled={
                      state?.isView ||
                      (job_id && salesJobOrderDetail?.unit_pc === 1)
                    }
                    checked={values?.unit_pc === 0}
                    className="me-2"
                  />
                  <label htmlFor="QtyKg" className="me-2">
                    KG
                  </label>
                </div>
                <div className="radio_line_input">
                  <Row>
                    <div className="custom_col">
                      <div className="form_group mb-3">
                        <label htmlFor="QtyKg">
                          Qty(KG)
                          {values?.unit_pc === 0 ? (
                            <span className="text-danger fs-4">*</span>
                          ) : null}
                        </label>
                        <InputText
                          id="QtyKg"
                          placeholder="Qty"
                          type="number"
                          name="qty_kg"
                          value={values?.qty_kg || ''}
                          disabled={state?.isView || values?.unit_pc === 1}
                          onChange={e => {
                            handleQtyKG(e);
                          }}
                          onKeyDown={e => {
                            if (e.keyCode === 8) {
                              setError(true);
                            }
                          }}
                          onBlur={handleBlur}
                        />
                        {touched?.qty_kg && errors?.qty_kg && (
                          <p className="text-danger">{errors?.qty_kg}</p>
                        )}
                      </div>
                    </div>
                    <div className="custom_col">
                      <div className="form_group mb-3">
                        <label htmlFor="RatePCs">
                          Rate(KG)
                          {values?.unit_pc === 0 ? (
                            <span className="text-danger fs-4">*</span>
                          ) : null}
                        </label>
                        <InputText
                          id="RatePCs"
                          placeholder="Rate"
                          type="number"
                          name="rate_kg"
                          className="green_input"
                          value={values?.rate_kg || ''}
                          disabled={state?.isView || values?.unit_pc === 1}
                          onChange={e => {
                            handleRateKG(e);
                            // let amountKg =
                            //   Number(values.qty_kg) * Number(e.target.value);
                            // setFieldValue(
                            //   'amount_kg',
                            //   amountKg ? amountKg?.toFixed(2) : 0,
                            // );
                            // let gstAmount =
                            //   (Number(values.qty_kg) *
                            //     Number(e.target.value) *
                            //     Number(values.gst_percentage)) /
                            //   100;
                            // if (values?.unit_pc === 0) {
                            //   let finalAmount =
                            //     amountKg -
                            //     Number(values.discount) +
                            //     Number(values.stereo_charge) +
                            //     Number(values.additional_charge) +
                            //     gstAmount;
                            //   setFieldValue(
                            //     'final_amount',
                            //     finalAmount ? finalAmount?.toFixed(2) : 0,
                            //   );
                            //   setFieldValue(
                            //     'gst_amount',
                            //     gstAmount ? gstAmount?.toFixed(2) : 0,
                            //   );
                            // }
                            // // setFieldValue('rate_kg', e.target.value);
                            // commonUpdateFieldValue('rate_kg', e.target.value);
                          }}
                          onBlur={handleBlur}
                        />
                        {touched?.rate_kg && errors?.rate_kg && (
                          <p className="text-danger">{errors?.rate_kg}</p>
                        )}
                      </div>
                    </div>
                    <div className="custom_col">
                      <div className="form_group mb-3">
                        <label htmlFor="Amount">Amount</label>
                        {/* <InputText
                          id="Amount"
                          placeholder="Amount"
                          type="number"
                          name="amount_kg"
                          value={values?.amount_kg || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue(
                              e.target.name,
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled
                        /> */}

                        <InputNumber
                          id="Amount"
                          placeholder="Amount"
                          name="amount_kg"
                          className="w-100"
                          value={values?.amount_kg || ''}
                          onChange={e => {
                            commonUpdateFieldValue('amount_kg', e.value);
                          }}
                          onBlur={handleBlur}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="custom_col">
                      <div className="form_group mb-3">
                        <label htmlFor="BrokerBaseRate">Broker Base Rate</label>
                        <InputText
                          id="BrokerBaseRate"
                          placeholder="00.00"
                          type="number"
                          name="broker_rate_kg"
                          value={values?.broker_rate_kg || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue(
                              e.target.name,
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled={values?.unit_pc === 1}
                        />
                      </div>
                    </div>
                    {/* <div className="custom_col">
                      <div className="form_group mb-3">
                        <label htmlFor="TotalBrokerBaseRate">
                          Total Broker Base Rate
                        </label>
                        <InputText
                          id="TotalBrokerBaseRate"
                          placeholder="00.00"
                          type="number"
                          name="broker_total_kg"
                          value={values?.broker_total_kg || ''}
                          disabled={state?.isView}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div> */}
                  </Row>
                </div>
              </div>
            </div>
            <Row>
              <Col xxl={4} lg={6}>
                {/* <div className="form_group mb-3">
                  <label htmlFor="insideBag">Text to Print Inside Bag</label>
                  <InputText
                    id="insideBag"
                    placeholder="Text to Print Inside Bag"
                    name="text_to_print"
                    value={values?.text_to_print || ''}
                    disabled={state?.isView}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div> */}
                {/* <div className="form_group checkbox_wrap mb-2">
                  <Checkbox
                    inputId="NotificationtoPrint"
                    name="notification_to_print"
                    value={values?.notification_to_print || ''}
                    disabled={state?.isView}
                    onChange={e =>
                      setFieldValue(
                        'notification_to_print',
                        e.target.checked ? 1 : 0,
                      )
                    }
                    checked={values?.notification_to_print === 1}
                  />
                  <label htmlFor="NotificationtoPrint">
                    Notification to Print
                  </label>
                </div> */}
                <div className="form_group checkbox_wrap mb-2">
                  <Checkbox
                    inputId="FreightInclusiveRate"
                    name="freight_inclusive_rate"
                    value={values?.freight_inclusive_rate || ''}
                    disabled={state?.isView}
                    onChange={e =>
                      // setFieldValue(
                      //   'freight_inclusive_rate',
                      //   e.target.checked ? 1 : 0,
                      // )
                      commonUpdateFieldValue(
                        e.target.name,
                        e.target.checked ? 1 : 0,
                      )
                    }
                    checked={values?.freight_inclusive_rate === 1}
                  />
                  <label htmlFor="FreightInclusiveRate">
                    Freight Inclusive Rate
                  </label>
                </div>
              </Col>
              <Col xxl={4} lg={6}>
                <div className="form_group mb-3">
                  <label htmlFor="Comment">Comment</label>
                  <InputTextarea
                    placeholder="Comment"
                    rows={6}
                    name="comment"
                    value={values?.comment || ''}
                    disabled={state?.isView}
                    // onChange={handleChange}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                    onBlur={handleBlur}
                  />
                </div>
              </Col>
              <Col xxl={4}>
                <div className="subTotal_wrapper border rounded-3 bg_white p-3">
                  <div className="form_group mb-3">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <label htmlFor="AdditionalCharges">Freight</label>
                      </Col>
                      <Col xs={7}>
                        <InputText
                          id="AdditionalCharges"
                          placeholder="0"
                          type="number"
                          name="additional_charge"
                          value={values?.additional_charge || ''}
                          disabled={state?.isView}
                          onChange={e => {
                            // const amt =
                            //   values.unit_pc === 1
                            //     ? values?.amount
                            //     : values?.amount_kg;

                            const baseTaxableAmount =
                              values.unit_pc === 1
                                ? convertIntoNumber(values.qty) *
                                  convertIntoNumber(values.rate)
                                : convertIntoNumber(values.qty_kg) *
                                  convertIntoNumber(values.rate_kg);

                            const calculate_TaxableAmount =
                              baseTaxableAmount -
                              convertIntoNumber(values.discount) +
                              convertIntoNumber(values.stereo_charge) +
                              convertIntoNumber(e.target.value);

                            const calculate_GST =
                              (calculate_TaxableAmount *
                                convertIntoNumber(values.gst_percentage)) /
                              100;

                            // const calculate_GST =
                            //   gstAmount +
                            //   (convertIntoNumber(e.target.value) *
                            //     convertIntoNumber(values.gst_percentage)) /
                            //     100;

                            // const finalAmount =
                            //   Number(amt) -
                            //   Number(values.discount) +
                            //   Number(values.stereo_charge) +
                            //   Number(e.target.value) +
                            //   Number(values.gst_amount);

                            const finalAmount =
                              calculate_TaxableAmount + calculate_GST;

                            const Obj = {
                              final_amount: finalAmount
                                ? convertIntoNumber(finalAmount)
                                : 0,
                              additional_charge: e.target.value,
                              gst_amount: calculate_GST,
                              ...(values.unit_pc === 1
                                ? {
                                    pcs_taxable_amount: calculate_TaxableAmount,
                                  }
                                : {
                                    kgs_taxable_amount: calculate_TaxableAmount,
                                  }),
                            };
                            handleChangeFieldsdData(Obj);
                          }}
                          onBlur={handleBlur}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="form_group mb-3">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <label htmlFor="StereoCharges">Stereo Charges</label>
                      </Col>
                      <Col xs={7}>
                        <InputText
                          id="StereoCharges"
                          placeholder="0"
                          type="number"
                          className="green_input"
                          name="stereo_charge"
                          value={values?.stereo_charge || ''}
                          disabled={state?.isView}
                          onChange={e => {
                            const baseTaxableAmount =
                              values.unit_pc === 1
                                ? convertIntoNumber(values.qty) *
                                  convertIntoNumber(values.rate)
                                : convertIntoNumber(values.qty_kg) *
                                  convertIntoNumber(values.rate_kg);

                            const calculate_TaxableAmount =
                              baseTaxableAmount -
                              convertIntoNumber(values.discount) +
                              convertIntoNumber(values?.additional_charge) +
                              convertIntoNumber(e.target.value);

                            const calculate_GST =
                              (calculate_TaxableAmount *
                                convertIntoNumber(values.gst_percentage)) /
                              100;

                            // const amt =
                            //   values.unit_pc === 1
                            //     ? values?.amount
                            //     : values?.amount_kg;

                            // const finalAmount =
                            //   Number(amt) -
                            //   Number(values.discount) +
                            //   Number(e.target.value) +
                            //   Number(values.additional_charge) +
                            //   Number(values.gst_amount);

                            const finalAmount =
                              calculate_TaxableAmount + calculate_GST;

                            const Obj = {
                              final_amount: finalAmount
                                ? convertIntoNumber(finalAmount)
                                : 0,
                              gst_amount: calculate_GST,
                              stereo_charge: e.target.value,
                              ...(values.unit_pc === 1
                                ? {
                                    pcs_taxable_amount: calculate_TaxableAmount,
                                  }
                                : {
                                    kgs_taxable_amount: calculate_TaxableAmount,
                                  }),
                            };

                            handleChangeFieldsdData(Obj);
                          }}
                          onBlur={handleBlur}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="form_group mb-3">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <label htmlFor="Discount">Discount ( - )</label>
                      </Col>
                      <Col xs={7}>
                        <InputText
                          id="Discount"
                          placeholder="0"
                          type="number"
                          name="discount"
                          value={values?.discount || ''}
                          disabled={state?.isView}
                          onChange={e => {
                            // const finalAmount =
                            //   Number(amt) -
                            //   Number(e.target.value) +
                            //   Number(values.stereo_charge) +
                            //   Number(values.additional_charge) +
                            //   Number(values.gst_amount);

                            const baseTaxableAmount =
                              values.unit_pc === 1
                                ? convertIntoNumber(values.qty) *
                                  convertIntoNumber(values.rate)
                                : convertIntoNumber(values.qty_kg) *
                                  convertIntoNumber(values.rate_kg);

                            const calculate_TaxableAmount =
                              baseTaxableAmount -
                              convertIntoNumber(e.target.value) +
                              convertIntoNumber(values.stereo_charge) +
                              convertIntoNumber(values?.additional_charge);

                            const calculate_GST =
                              (calculate_TaxableAmount *
                                convertIntoNumber(values.gst_percentage)) /
                              100;

                            const finalAmount =
                              calculate_TaxableAmount + calculate_GST;

                            // setFieldValue(
                            //   'final_amount',
                            //   finalAmount ? convertIntoNumber(finalAmount) : 0,
                            // );
                            // setFieldValue('discount', e.target.value);

                            // if (job_id) {
                            //   dispatch(
                            //     setUpdateSelectedJobData({
                            //       ...updateSelectedJobData,
                            //       final_amount: finalAmount
                            //         ? convertIntoNumber(finalAmount)
                            //         : 0,
                            //       discount: e.target.value,
                            //     }),
                            //   );
                            // } else {
                            //   dispatch(
                            //     setAddSelectedJobData({
                            //       ...addSelectedJobData,
                            //       final_amount: finalAmount
                            //         ? convertIntoNumber(finalAmount)
                            //         : 0,
                            //       discount: e.target.value,
                            //     }),
                            //   );
                            // }

                            const Obj = {
                              final_amount: finalAmount
                                ? convertIntoNumber(finalAmount)
                                : 0,
                              gst_amount: calculate_GST,
                              discount: e.target.value,
                              ...(values.unit_pc === 1
                                ? {
                                    pcs_taxable_amount: calculate_TaxableAmount,
                                  }
                                : {
                                    kgs_taxable_amount: calculate_TaxableAmount,
                                  }),
                            };

                            handleChangeFieldsdData(Obj);
                          }}
                          onBlur={handleBlur}
                        />
                      </Col>
                    </Row>
                  </div>

                  <div className="form_group mb-3">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <label htmlFor="SubTotal">Taxable Amount</label>
                      </Col>
                      <Col xs={7}>
                        <span>
                          ₹
                          {values.unit_pc === 1
                            ? roundValueThousandSeparator(
                                values?.pcs_taxable_amount
                                  ? values?.pcs_taxable_amount
                                  : 0,
                              )
                            : roundValueThousandSeparator(
                                values?.kgs_taxable_amount
                                  ? values?.kgs_taxable_amount
                                  : 0,
                              )}
                        </span>
                      </Col>
                    </Row>
                  </div>

                  <div className="form_group mb-3">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <label className="d-flex align-items-center">
                          GST{' '}
                          <InputText
                            id="GST1"
                            placeholder="%"
                            className="w-50 ms-3"
                            type="number"
                            name="gst_percentage"
                            disabled
                            value={values?.gst_percentage || ''}
                            onBlur={handleBlur}
                          />
                        </label>
                      </Col>
                      <Col xs={7}>
                        <InputText
                          id="GST"
                          placeholder="0"
                          type="number"
                          name="gst_amount"
                          disabled
                          value={values?.gst_amount || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue(
                              e.target.name,
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                        />
                      </Col>
                    </Row>
                  </div>
                  <hr />
                  <div className="form_group ">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <label htmlFor="FinalAmount">Final Amount</label>
                      </Col>
                      <Col xs={7}>
                        <span>
                          ₹
                          {roundValueThousandSeparator(
                            values.final_amount ? values.final_amount : 0,
                          )}
                        </span>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3">
              <Button
                onClick={() => {
                  // dispatch(
                  //   setIsGetInitialValuesJob({
                  //     ...isGetInitialValuesJob,
                  //     ...(job_id ? { update: false } : { add: false }),
                  //   }),
                  // );
                  if (job_id) {
                    dispatch(
                      setIsGetInitialValuesJob({
                        ...isGetInitialValuesJob,
                        ...(locationPath[1] === 'job-details'
                          ? { view: false }
                          : { update: false }),
                      }),
                    );

                    if (locationPath[1] === 'job-details') {
                      dispatch(clearViewSelectedJobData());
                    } else {
                      dispatch(clearUpdateSelectedJobData());
                    }
                  } else {
                    dispatch(
                      setIsGetInitialValuesJob({
                        ...isGetInitialValuesJob,
                        add: false,
                      }),
                    );
                    dispatch(clearAddSelectedJobData());
                  }
                  navigate(-1);
                }}
                className="btn_border"
              >
                Cancel
              </Button>
              {locationPath && locationPath[1] === 'job-details' ? null : (
                <Link
                  to="/order-details"
                  className="btn_primary ms-3"
                  onClick={handleSubmit}
                  disabled={state?.isView}
                >
                  {job_id ? 'Update' : 'Save'}
                </Link>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
