import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import PlusIcon from '../../Assets/Images/plus.svg';
import PdfIcon from '../../Assets/Images/pdf.svg';
import MailIcon from '../../Assets/Images/mail.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import TranchIcon from '../../Assets/Images/trash.svg';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Image } from 'primereact/image';
import { getProductList } from 'Services/Products/ProductService';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setSelectedProductData } from 'Store/Reducers/Products/ProductSlice';
import { useFormik } from 'formik';
import moment from 'moment';
import _ from 'lodash';
import { getFormattedDate, roundValueThousandSeparator } from 'Helper/Common';
import {
  getAllUserPartyList,
  getPartiesAdvisor,
  getSingleListParties,
  getTransporterPartyList,
} from 'Services/partiesService';
import DropZone from 'Components/Common/DropZone';
import * as Yup from 'yup';
import {
  createProformaInvoice,
  getProformaDetail,
  getProformaToPdf,
  proformaHandleChange,
  updateProformaInvoice,
} from 'Services/Sales/ProformaService';
import Skeleton from 'react-loading-skeleton';

import Loader from 'Components/Common/Loader';
import { clearProformaInvoiceDetail } from 'Store/Reducers/Sales/ProformaInvoiceSlice';
import { getPreviousTransporter } from 'Services/Sales/OrderServices';

export default function AddProformaInvoice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { proformaId } = useParams();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');
  const [newAttributeModal, setNewAttributeModal] = useState({
    openModel: false,
    isViewData: false,
  });
  const [filterToggle, setFilterToggle] = useState(false);
  const [fixedTerm, setFixedTerm] = useState('');
  const [billingList, setBillingList] = useState([]);
  const [shippingList, setShippingList] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [localSelectedProductData, setLocalSelectedProductData] = useState([]);
  const { productForProforma, productLoading } = useSelector(
    ({ product }) => product,
  );
  const {
    allUserPartyList,
    partiesAdvisor,
    transporterPartyList,
    singleListParties,
    partiesLoading,
  } = useSelector(({ parties }) => parties);
  const {
    proformaInvoiceDetail,
    proformaLoading,
    addProformaPage,
    updateProformaPage,
    proformaDetailsPage,
  } = useSelector(({ proformaInvoice }) => proformaInvoice);
  const { previousTransporter } = useSelector(({ salesOrder }) => salesOrder);
  const addProformachema = Yup.object().shape({
    party_name: Yup.string().required('Party Name is required'),
    invoice_date: Yup.date().required('Invoice Date is required'),
    transporter: Yup.string().required('Transporter is required'),
    present_advisor: Yup.string().required('Present Advisor is required'),
  });

  const [
    initialValuesForAddProformaInvoice,
    setInitialValuesForAddProformaInvoice,
  ] = useState(proformaDetailsPage);

  const loadRequiredData = useCallback(() => {
    dispatch(getAllUserPartyList());
    dispatch(getTransporterPartyList());
    dispatch(getPartiesAdvisor());
    dispatch(getProductList(0, 0));
  }, [dispatch]);
  useEffect(() => {
    loadRequiredData();
    return () => {
      dispatch(setSelectedProductData([]));
      dispatch(clearProformaInvoiceDetail());
      handleSinglePartiesDetailsClear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (
      locationPath[1] === 'update-proforma-invoice' &&
      Object.keys(updateProformaPage)?.length > 0
    ) {
      setInitialValuesForAddProformaInvoice(updateProformaPage);
    } else if (
      locationPath[1] === 'proforma-details' &&
      Object.keys(proformaDetailsPage)?.length > 0
    ) {
      setInitialValuesForAddProformaInvoice(proformaDetailsPage);
    } else if (proformaId)
      dispatch(getProformaDetail(proformaId, locationPath[1]));
    else if (locationPath[1] === 'add-proforma-invoice') {
      if (Object.keys(addProformaPage)?.length > 0) {
        setInitialValuesForAddProformaInvoice(addProformaPage);
      } else {
        setInitialValuesForAddProformaInvoice(proformaInvoiceDetail);
      }
    }
  }, [locationPath]);

  const submitHandle = useCallback(
    async values => {
      let result;
      let proforma_invoice_item = localSelectedProductData?.map(data => {
        return {
          product_id: data?.product_id,
          remark: data?.remark,
          hsn: data?.hsn,
          is_rate_per_kg: data?.is_rate_per_kg,
          qty: data?.pcs,
          kg_qty: data?.weight,
          rate: data?.is_rate_per_kg ? data?.kg_rate : data?.rate,
          charge: data?.charge,
          discount: data?.discount,
          total_amount: data?.amount,
          tax_percentage: data?.tax_percentage,
          final_amount: data?.final_amount,
        };
      });
      if (proformaId) {
        const payload = {
          ...values,
          invoice_date: getFormattedDate(values?.invoice_date),
          proforma_id: proformaId,
          billing_address: values?.billing_address[0]?._id,
          shipping_address: values?.shipping_address[0]?._id,
          terms_and_condition: values?.terms_and_condition,
          proforma_invoice_item: proforma_invoice_item,
          total_bundle: Number(values?.total_bundle),
        };

        result = await dispatch(updateProformaInvoice(payload));
      } else {
        const payload = {
          ...values,
          invoice_date: getFormattedDate(values?.invoice_date),
          billing_address: values?.billing_address[0]?._id,
          shipping_address: values?.shipping_address[0]?._id,
          terms_and_condition: values?.terms_and_condition
            ? fixedTerm + 'OTHER:' + values?.terms_and_condition
            : fixedTerm,
          proforma_invoice_item: proforma_invoice_item,
          total_bundle: Number(values?.total_bundle),
        };

        result = await dispatch(createProformaInvoice(payload));
      }
      if (result) {
        setBillingList([]);
        setShippingList([]);
        navigate('/proforma-invoice');
      }
    },
    [dispatch, localSelectedProductData, navigate, proformaId, fixedTerm],
  );

  const handleSinglePartiesDetailsClear = useCallback(() => {
    setBillingList([]);
    setShippingList([]);
    setFieldValue('shipping_address', '');
    setFieldValue('billing_address', '');
    setFieldValue('present_advisor', '');
  }, []);

  const {
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesForAddProformaInvoice,
    validationSchema: addProformachema,
    onSubmit: submitHandle,
  });
  useEffect(() => {
    if (proformaId) {
      setFieldValue(
        'invoice_date',
        new Date(
          moment(
            initialValuesForAddProformaInvoice?.invoice_date,
            'DD-MM-YYYY',
          ).format(),
        ),
      );
      setFieldValue(
        'streo_charge',
        initialValuesForAddProformaInvoice?.final_stereo_charge
          ? initialValuesForAddProformaInvoice?.final_stereo_charge?.toFixed(2)
          : '0.00',
      );
      if (
        initialValuesForAddProformaInvoice?.proforma_item &&
        productForProforma?.length > 0
      ) {
        let data = initialValuesForAddProformaInvoice?.proforma_item?.map(i => {
          return {
            ...i,
            product_id: i?.product_id,
            remark: i?.remark,
            hsn: i?.hsn,
            is_rate_per_kg: i?.is_rate_per_kg,
            main_image: i?.product_image,
            pcs: i?.qty,
            rate: i?.is_rate_per_kg ? '' : i?.rate,
            weight: i?.kg_qty,
            kg_rate: i?.is_rate_per_kg ? i?.rate : '',
            charge: i?.charge,
            discount: i?.discount,
            amount: i?.total_amount ? i?.total_amount?.toFixed(2) : 0,
            tax_percentage: i?.tax_percentage,
            final_amount: i?.final_amount ? i?.final_amount?.toFixed(2) : 0,
          };
        });

        let newArray = initialValuesForAddProformaInvoice?.proforma_item?.map(
          item => {
            const obj = productForProforma?.find(
              item2 => item2._id === item.product_id,
            );
            if (obj) {
              return obj;
            }
            return item;
          },
        );

        setLocalSelectedProductData(data);
        setProducts(newArray);
      }
    }
  }, [
    proformaId,
    initialValuesForAddProformaInvoice,
    productForProforma,
    dispatch,
    setFieldValue,
  ]);

  useEffect(() => {
    if (
      values.invoice_date === '' &&
      locationPath?.[1] === 'add-proforma-invoice'
    ) {
      setFieldValue('invoice_date', new Date());
      dispatch(
        proformaHandleChange(locationPath[1], 'invoice_date', new Date()),
      );
    }
    let data = `RATE: The above prices are EXW Surat \nVALIDITY: The quote is valid for 15 days from the date of issue \nPAYMENT TERMS: 30% advance, remaining 70% before dispatch \nQuantity: The actual quantity of bags may vary by +/- 10%. Billing will be done as per the actual number of bags manufactured \nDESIGN: We are not responsible for any error in the design once it is finalized by the buyer Kindly check all color's, PANTONE codes, matter, size of name and logos, phone numbers, address, spelling, pin codes, etc. \nTOLERANCE / VARIATION: 1% of bags from the total supplied quantity may have some printing defect, registration issue, sealing issue, etc. due to human errors that cannot be detected during QC. We will replace/refund the quantity of bags that are sent back to us (subject to authenticity). \n`;
    setFixedTerm(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.invoice_date]);

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
      if (locationPath?.[1] === 'add-proforma-invoice') {
        setFieldValue('shipping_address', [{ ...shippingList?.[0] }]);
        setFieldValue('billing_address', [{ ...billingList?.[0] }]);
        setFieldValue('present_advisor', res.present_advisor);
      } else {
        const newBillingList = billingList?.filter(x =>
          initialValuesForAddProformaInvoice?.billing_address?.includes(x?._id),
        );
        const newShippingList = shippingList?.filter(x =>
          initialValuesForAddProformaInvoice?.shipping_address?.includes(
            x?._id,
          ),
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
    if (values?.transporter) {
      let selectedTrasporter = transporterPartyList?.filter(
        data => data?._id === values?.transporter,
      );
      setFieldValue('transporter_gst', selectedTrasporter?.[0]?.gst);
      setFieldValue(
        'transporter_phone_no',
        selectedTrasporter?.[0]?.personal_contact_no,
      );
      dispatch(
        proformaHandleChange(
          locationPath[1],
          'transporter_gst',
          selectedTrasporter?.[0]?.gst,
        ),
      );
      dispatch(
        proformaHandleChange(
          locationPath[1],
          'transporter_phone_no',
          selectedTrasporter?.[0]?.personal_contact_no,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.transporter]);

  useEffect(() => {
    if (previousTransporter) {
      let transporter = transporterPartyList?.find(
        x => x?._id === previousTransporter?.transporter,
      );
      setFieldValue('transporter', transporter?._id);
      dispatch(
        proformaHandleChange(locationPath[1], 'transporter', transporter?._id),
      );
    }
  }, [previousTransporter, transporterPartyList, setFieldValue]);

  const onCustomChange = useCallback(
    (key, val) => {
      let list;
      if (key === 'billing_address') {
        list = [...values?.billing_address];
      } else list = [...values?.shipping_address];
      list[0] = singleListParties?.party_address?.find(x => x?._id === val);
      setFieldValue(key, list);
    },
    [
      setFieldValue,
      singleListParties?.party_address,
      values?.billing_address,
      values?.shipping_address,
    ],
  );
  const ratePerKgTemplate = data => {
    return (
      <Checkbox
        onChange={e => handleChangeData(e.checked, data, 'is_rate_per_kg')}
        checked={data?.is_rate_per_kg}
        disabled={state?.isView}
      ></Checkbox>
    );
  };
  const totalCount = (data, key) => {
    let NewData = data?.length > 0 ? data : [];
    return NewData?.reduce((sum, cuurent) => {
      if (Object.keys(cuurent)?.includes(key)) {
        return sum + Number(cuurent[key]);
      } else {
        return sum;
      }
    }, 0)?.toFixed(2);
  };
  const handleChangeData = (e, option, key) => {
    let list = [...JSON.parse(JSON.stringify(localSelectedProductData))];
    const index = list?.findIndex(x => x?._id === option?._id);
    if (index >= 0) list[index][key] = e;
    if (key === 'pcs') {
      let bgWeight = parseFloat(list[index]['bag_weight']?.split(' ')[0]);
      let kg_qty = parseFloat(e * (bgWeight / 1000)).toFixed(2);
      if (kg_qty % 10 != 0) {
        let kg = parseFloat(kg_qty / 10).toFixed(2);
        let round = Number.isInteger(Number(kg))
          ? Number(kg.split('.')[0])
          : Number(kg.split('.')[0]) + 1;
        kg_qty = round * 10;
      }
      list[index]['weight'] = kg_qty ? kg_qty : 0;
      let amount = e * Number(list[index]['rate']);
      list[index]['amount'] = amount ? amount?.toFixed(2) : 0;
      let gstAmount = (amount * Number(list[index]['tax_percentage'])) / 100;
      let finalAmount =
        amount -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? finalAmount?.toFixed(2) : 0;
    }
    if (key === 'rate') {
      let amount = e * Number(list[index]['pcs']);
      list[index]['amount'] = amount ? amount?.toFixed(2) : 0;
      let gstAmount = (amount * Number(list[index]['tax_percentage'])) / 100;
      let finalAmount =
        amount -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? finalAmount?.toFixed(2) : 0;
    }
    if (key === 'weight') {
      let totalgm = e * 1000;
      let bgWeight =
        totalgm / parseFloat(list[index]['bag_weight']?.split(' ')[0]);
      let qty = Math.round(bgWeight);
      if (qty % 100 != 0) {
        let pc = parseFloat(qty / 100).toFixed(2);
        let round = Number.isInteger(Number(pc))
          ? Number(pc.split('.')[0])
          : Number(pc.split('.')[0]) + 1;
        qty = round * 100;
      }
      list[index]['pcs'] = qty ? qty : 0;
      let amount = e * Number(list[index]['kg_rate']);
      list[index]['amount'] = amount ? amount?.toFixed(2) : 0;
      let gstAmount = (amount * Number(list[index]['tax_percentage'])) / 100;
      let finalAmount =
        amount -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? finalAmount?.toFixed(2) : 0;
    }
    if (key === 'kg_rate') {
      let amount = e * Number(list[index]['weight']);
      list[index]['amount'] = amount ? amount?.toFixed(2) : 0;
      let gstAmount = (amount * Number(list[index]['tax_percentage'])) / 100;
      let finalAmount =
        amount -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? finalAmount?.toFixed(2) : 0;
    }
    if (key === 'charge') {
      let gstAmount =
        (Number(list[index]['amount']) *
          Number(list[index]['tax_percentage'])) /
        100;
      let finalAmount =
        Number(list[index]['amount']) -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? finalAmount?.toFixed(2) : 0;
    }
    if (key === 'discount') {
      let gstAmount =
        (Number(list[index]['amount']) *
          Number(list[index]['tax_percentage'])) /
        100;
      let finalAmount =
        Number(list[index]['amount']) -
        e +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? finalAmount?.toFixed(2) : 0;
    }
    if (key === 'tax_percentage') {
      let gstAmount = (Number(list[index]['amount']) * e) / 100;
      let finalAmount =
        Number(list[index]['amount']) -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? finalAmount?.toFixed(2) : 0;
    }
    if (key === 'is_rate_per_kg' && e === true) {
      list[index]['amount'] = '';
      list[index]['rate'] = '';
      list[index]['pcs'] = '';
      list[index]['kg_rate'] = '';
      list[index]['weight'] = '';
      list[index]['charge'] = '';
      list[index]['discount'] = '';
      list[index]['gst_amount'] = '';
      list[index]['final_amount'] = '';
    }
    if (key === 'is_rate_per_kg' && e === false) {
      list[index]['amount'] = '';
      list[index]['rate'] = '';
      list[index]['pcs'] = '';
      list[index]['kg_rate'] = '';
      list[index]['weight'] = '';
      list[index]['charge'] = '';
      list[index]['discount'] = '';
      list[index]['gst_amount'] = '';
      list[index]['final_amount'] = '';
    }

    setLocalSelectedProductData(list);
    let totalAmount = totalCount(list, 'amount');
    let discount = totalCount(list, 'discount');
    let stereoCharge = totalCount(list, 'charge');
    let taxAmount = totalCount(list, 'gst_amount');
    let final_amount =
      Number(totalAmount) -
      Number(discount) +
      Number(stereoCharge) +
      Number(taxAmount) +
      Number(values?.freight);
    setFieldValue('total_amount', totalAmount);
    setFieldValue('discount', discount);
    setFieldValue('streo_charge', stereoCharge);
    setFieldValue('tax_amount', taxAmount);
    setFieldValue(
      'final_amount',
      final_amount ? Number(final_amount)?.toFixed(2) : 0,
    );
  };
  const hsnTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="number"
          placeholder="0"
          className="w-100"
          value={data?.hsn}
          disabled={state?.isView}
          onChange={e => {
            handleChangeData(
              e.target.value ? Number(e.target.value) : '',
              data,
              'hsn',
            );
          }}
        />
      </div>
    );
  };
  const pcsTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="number"
          placeholder="0"
          className="w-100"
          value={data?.pcs}
          disabled={data?.is_rate_per_kg || state?.isView}
          onChange={e => {
            handleChangeData(
              e.target.value ? Number(e.target.value) : '',
              data,
              'pcs',
            );
          }}
        />
      </div>
    );
  };
  const weightTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          placeholder="0"
          type="number"
          className="w-100"
          value={data?.weight}
          disabled={!data?.is_rate_per_kg || state?.isView}
          onChange={e => {
            handleChangeData(
              e.target.value ? Number(e.target.value) : '',
              data,
              'weight',
            );
          }}
        />
      </div>
    );
  };

  const pcRateTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="number"
          placeholder="0"
          className="w-100"
          value={data?.rate}
          disabled={data?.is_rate_per_kg || state?.isView}
          onChange={e => {
            handleChangeData(
              e.target.value ? Number(e.target.value) : '',
              data,
              'rate',
            );
          }}
        />
      </div>
    );
  };

  const kgRateTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="number"
          placeholder="0"
          className="w-100"
          value={data?.kg_rate}
          disabled={!data?.is_rate_per_kg || state?.isView}
          onChange={e => {
            handleChangeData(
              e.target.value ? Number(e.target.value) : '',
              data,
              'kg_rate',
            );
          }}
        />
      </div>
    );
  };

  const cylinderTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="number"
          placeholder="0"
          className="w-100"
          value={data?.charge}
          disabled={state?.isView}
          onChange={e => {
            handleChangeData(
              e.target.value ? Number(e.target.value) : '',
              data,
              'charge',
            );
          }}
        />
      </div>
    );
  };

  const discountTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="number"
          placeholder="0"
          className="w-100"
          value={data?.discount}
          disabled={state?.isView}
          onChange={e => {
            handleChangeData(
              e.target.value ? Number(e.target.value) : '',
              data,
              'discount',
            );
          }}
        />
      </div>
    );
  };
  const remarkTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="text"
          placeholder="Text"
          className="w-100"
          disabled={state?.isView}
          value={data?.remark}
          onChange={e => {
            handleChangeData(e.target.value, data, 'remark');
          }}
        />
      </div>
    );
  };
  const taxTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="number"
          placeholder="0"
          className="w-100"
          disabled={state?.isView}
          value={data?.tax_percentage}
          onChange={e => {
            handleChangeData(
              e.target.value ? Number(e.target.value) : '',
              data,
              'tax_percentage',
            );
          }}
        />
      </div>
    );
  };
  const handleDelete = useCallback(
    data => {
      if (data) {
        const newArray = localSelectedProductData?.filter(
          i => i?._id !== data?._id,
        );
        let totalAmount = totalCount(newArray, 'amount');
        let discount = totalCount(newArray, 'discount');
        let stereoCharge = totalCount(newArray, 'charge');
        let taxAmount = totalCount(newArray, 'gst_amount');
        let final_amount =
          Number(totalAmount) -
          Number(discount) +
          Number(stereoCharge) +
          Number(taxAmount) +
          Number(values?.freight);
        setFieldValue('total_amount', totalAmount);
        setFieldValue('discount', discount);
        setFieldValue('streo_charge', stereoCharge);
        setFieldValue('tax_amount', taxAmount);
        setFieldValue(
          'final_amount',
          final_amount ? Number(final_amount)?.toFixed(2) : 0,
        );

        setProducts(newArray);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, localSelectedProductData],
  );

  const actionTemplate = data => {
    return (
      <div className="action_btn_img">
        <ul>
          <li className="me-2">
            <img
              src={TranchIcon}
              alt="TranchIcon"
              onClick={() => handleDelete(data)}
            />
          </li>
        </ul>
      </div>
    );
  };

  const handleFilterUpdate = () => {
    setFilterToggle(!filterToggle);
  };

  const imageTemplate = data => {
    return (
      <div className="image_zoom_Wrapper">
        <Image src={data?.main_image} alt="Image" disabled={state?.isView} />
      </div>
    );
  };

  const printTypeCode = data => {
    return `${data?.print_type_name} (${data?.print_type_code})`;
  };

  const sizeTemplate = data => {
    return data?.gusset !== 0
      ? `W ${data?.width} × H ${data?.height} × G ${data?.gusset}`
      : `W ${data?.width} × H ${data?.height}`;
  };

  const handleCheckboxTemplate = data => {
    let newList = data?.map((x, i) => {
      return {
        ...x,
        image: x?.main_image,
        product_code: x?.product_code,
        remark: '',
        hsn: '',
        is_rate_per_kg: false,
        qty: '',
        rate: '',
        charge: '',
        final_amount: '',
        discount: '',
        total_amount: '',
        tax_percentage: x?.material_gst ? x?.material_gst : '',
        weight: '',
        kg_rate: '',
        gst_amount: '',
        product_id: x._id,
      };
    });
    setProducts(newList);
  };

  const filteredBillingList = useMemo(() => {
    if (!billingList) {
      return [];
    }
    const billingAddresses = Array.isArray(values?.billing_address)
      ? values?.billing_address
      : [values?.billing_address];

    const filteredList =
      billingList?.filter(
        obj => !billingAddresses.some(obj2 => obj?._id === obj2?._id),
      ) || [];

    const foundItem =
      billingList.find(
        x =>
          x._id === billingAddresses[0]?.value ||
          x._id === billingAddresses[0]?._id,
      ) || {};

    return Object.keys(foundItem)?.length > 0
      ? [...filteredList, { ...foundItem }]
      : [...filteredList];
  }, [billingList, values?.billing_address]);

  const filteredShippingList = useMemo(() => {
    if (!shippingList) {
      return [];
    }

    const shippingAddresses = Array.isArray(values?.shipping_address)
      ? values?.shipping_address
      : [values?.shipping_address];

    const filteredList =
      shippingList?.filter(
        obj => !shippingAddresses.some(obj2 => obj?._id === obj2?._id),
      ) || [];

    const foundItem =
      shippingList?.find(
        x =>
          x?._id === shippingAddresses[0]?.value ||
          x?._id === shippingAddresses[0]?._id,
      ) || {};

    return Object.keys(foundItem)?.length > 0
      ? [...filteredList, { ...foundItem }]
      : [...filteredList];
  }, [shippingList, values?.shipping_address]);

  const handleProductSearchInput = e => {
    dispatch(getProductList(0, 0, e.target.value));
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleProductSearchInput, 800),
    [],
  );

  const commonUpdateFiledValue = (fieldName, fieldValue) => {
    dispatch(proformaHandleChange(locationPath[1], fieldName, fieldValue));
    setFieldValue(fieldName, fieldValue);
  };
  return (
    <>
      <div className="main_Wrapper">
        {(proformaLoading || partiesLoading) && <Loader />}
        <div className="add_perfoma_invoice_wrap">
          <div className="border rounded-3 bg_white p-3 mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <h3>Sales Information</h3>
              {proformaId && (
                <ul className="d-flex">
                  <li
                    style={{ cursor: 'pointer' }}
                    className="me-2"
                    onClick={() => {
                      dispatch(getProformaToPdf(proformaId));
                    }}
                  >
                    <img src={PdfIcon} alt="PDFIcon"></img>
                  </li>
                  {/* <li
                    className="me-2"
                    onClick={() => {
                      dispatch(getMailProformaInvoice(proformaId));
                    }}
                  >
                    <img src={MailIcon} alt="MailIcon"></img>
                  </li> */}
                </ul>
              )}
            </div>
            <Row>
              <Col xl={6}>
                <Row>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label>
                        Party <span className="text-danger fs-4">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        value={values?.party_name || ''}
                        disabled={state?.isView || proformaId}
                        options={allUserPartyList}
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
                  {values?.invoice_no && proformaId ? (
                    <Col lg={4}>
                      <div className="form_group mb-3">
                        <label htmlFor="InvoiceNo">Invoice No.</label>
                        <InputText
                          id="InvoiceNo"
                          placeholder="3307"
                          name="invoice_no"
                          disabled={state?.isView}
                          value={values?.invoice_no || ''}
                        />
                      </div>
                    </Col>
                  ) : null}
                </Row>
                <Row>
                  <Col sm={6}>
                    <h5 className="mb-2">Bill To</h5>
                    <div className="form_group mb-3">
                      <div className="address_select_wrap">
                        <ReactSelectSingle
                          name={'billing_address'}
                          disabled={state?.isView}
                          value={
                            values?.billing_address?.[0]?.value ||
                            values?.billing_address?.[0]?._id ||
                            ''
                          }
                          onChange={e =>
                            onCustomChange('billing_address', e.value)
                          }
                          options={filteredBillingList}
                          // options={
                          //   billingList && [
                          //     ...billingList?.filter(
                          //       obj =>
                          //         !values?.billing_address?.some(
                          //           obj2 => obj?._id === obj2?._id,
                          //         ),
                          //     ),
                          //     billingList?.find(
                          //       x =>
                          //         x?._id ===
                          //           values?.billing_address?.[0]?.value ||
                          //         x?._id === values?.billing_address?.[0]?._id,
                          //     ),
                          //   ]
                          // }
                          placeholder="Business"
                        />
                        {values?.billing_address &&
                        values?.billing_address?.[0]?.address ? (
                          <div className="address_wrap">
                            {values?.billing_address?.[0]?.address},<br />
                            {values?.billing_address?.[0]?.city_name},
                            {values?.billing_address?.[0]?.state_name},
                            {values?.billing_address?.[0]?.pincode},
                            <br />
                            {values?.billing_address?.[0]?.country_name}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <h5 className="mb-2">Ship To</h5>
                    <div className="form_group mb-3">
                      <div className="address_select_wrap">
                        <ReactSelectSingle
                          name={'shipping_address'}
                          disabled={state?.isView}
                          value={
                            values?.shipping_address?.[0]?.value ||
                            values?.shipping_address?.[0]?._id ||
                            ''
                          }
                          onChange={e =>
                            onCustomChange('shipping_address', e.value)
                          }
                          options={filteredShippingList}
                          // options={[
                          //   ...shippingList?.filter(
                          //     obj =>
                          //       !values?.shipping_address?.some(
                          //         obj2 => obj?._id === obj2?._id,
                          //       ),
                          //   ),
                          //   shippingList?.find(
                          //     x =>
                          //       x?._id ===
                          //         values?.shipping_address?.[0]?.value ||
                          //       x?._id === values?.shipping_address?.[0]?._id,
                          //   ),
                          // ]}
                          placeholder="Business"
                        />
                        {values?.shipping_address &&
                        values?.shipping_address?.[0]?.address ? (
                          <div className="address_wrap">
                            {values?.shipping_address?.[0]?.address},<br />
                            {values?.shipping_address?.[0]?.city_name},
                            {values?.shipping_address?.[0]?.state_name},
                            {values?.shipping_address?.[0]?.pincode},
                            <br />
                            {values?.shipping_address?.[0]?.country_name}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col md={4} sm={6}>
                    <div className="form_group date_select_wrapper mb-3">
                      <label htmlFor="InvoiceDate">
                        Invoice Date<span className="text-danger fs-4">*</span>
                      </label>
                      <Calendar
                        id="InvoiceDate"
                        placeholder="Select Invoice Date"
                        showIcon
                        showButtonBar
                        maxDate={new Date()}
                        dateFormat="dd-mm-yy"
                        name="invoice_date"
                        value={values?.invoice_date || ''}
                        disabled={state?.isView || proformaId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched?.invoice_date && errors?.invoice_date && (
                        <p className="text-danger">{errors?.invoice_date}</p>
                      )}
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className="form_group mb-3">
                      <label>
                        Present Advisor
                        <span className="text-danger fs-4">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        value={values?.present_advisor || ''}
                        options={partiesAdvisor}
                        disabled={state?.isView}
                        name="present_advisor"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Present Advisor"
                      />
                      {touched?.present_advisor && errors?.present_advisor && (
                        <p className="text-danger">{errors?.present_advisor}</p>
                      )}
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="TriptaeNo">TRIPTA No.</label>
                      <InputText
                        id="TriptaeNo"
                        placeholder="Tripta No"
                        disabled={state?.isView}
                        name="tripta_no"
                        value={values?.tripta_no || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="BookingStation">Booking station</label>
                      <InputText
                        id="BookingStation"
                        placeholder="Booking station"
                        name="booking_station"
                        disabled={state?.isView}
                        value={values?.booking_station || ''}
                        onChange={e => {
                          commonUpdateFiledValue(
                            'booking_station',
                            e.target.value,
                          );
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="City">
                        Transporter<span className="text-danger fs-4">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        value={values?.transporter || ''}
                        options={transporterPartyList}
                        name="transporter"
                        disabled={state?.isView}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Transporter"
                      />
                      {touched?.transporter && errors?.transporter && (
                        <p className="text-danger">{errors?.transporter}</p>
                      )}
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="TransportNo">Transport Phone No</label>
                      <InputText
                        id="TransportNo"
                        placeholder="Transport Phone No"
                        name="transporter_phone_no"
                        disabled={state?.isView}
                        value={values?.transporter_phone_no || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="TransportGst">Transport GSTIN</label>
                      <InputText
                        id="TransportGst"
                        placeholder="Transport GSTIN"
                        name="transporter_gst"
                        disabled={state?.isView}
                        value={values?.transporter_gst || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="TotalBundles">Total Bundles</label>
                      <InputText
                        id="TotalBundles"
                        placeholder="Total Bundles"
                        name="total_bundle"
                        disabled={state?.isView}
                        value={values?.total_bundle || ''}
                        onChange={e => {
                          setFieldValue('total_bundle', Number(e.target.value));
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div className="table_main_Wrapper bg-white">
            <div className="top_filter_wrap">
              <Row className="align-items-center">
                <Col md={2}>
                  <div className="page_title">
                    <h3 className="m-0">Product Details</h3>
                  </div>
                </Col>
                <Col md={10}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li>
                        <Button
                          className="btn_primary"
                          onClick={e => {
                            if (localSelectedProductData?.length > 0) {
                              setNewAttributeModal({
                                openModel: true,
                                isViewData: true,
                              });
                            } else {
                              setNewAttributeModal({
                                openModel: true,
                                isViewData: false,
                              });
                            }
                          }}
                          disabled={values?.party_name === '' || state?.isView}
                        >
                          <img src={PlusIcon} alt="" />
                          Add Product
                        </Button>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper auto_height cell_padding_small break_header max_height">
              <DataTable
                value={
                  proformaId
                    ? localSelectedProductData
                    : newAttributeModal?.isViewData &&
                      localSelectedProductData?.length > 0
                    ? localSelectedProductData
                    : []
                }
                filterDisplay="menu"
                selectionMode="false"
                dataKey="_id"
              >
                <Column
                  field="image"
                  body={imageTemplate}
                  header="Image"
                  sortable
                />
                <Column
                  field="product_code"
                  header="Product Code"
                  className="product_code"
                  sortable
                />
                <Column
                  field="remark"
                  header="Remarks"
                  className=""
                  sortable
                  body={remarkTemplate}
                />

                <Column
                  field="hsn"
                  header="HSN"
                  sortable
                  body={hsnTemplate}
                  className="with_input_field"
                />
                <Column
                  field="ratePerKg"
                  body={ratePerKgTemplate}
                  header="Rate/kg?"
                  sortable
                />
                <Column
                  field="pcs"
                  body={pcsTemplate}
                  header="PCs"
                  className="with_input_field column_group border_left"
                  sortable
                />
                <Column
                  field="weight"
                  body={weightTemplate}
                  header="KGs"
                  className="with_input_field column_group with_before half_left quantity border_right"
                  sortable
                />
                <Column
                  field="pcRate"
                  body={pcRateTemplate}
                  header="PC Rate"
                  className="with_input_field column_group"
                  sortable
                />
                <Column
                  field="kgRate"
                  body={kgRateTemplate}
                  header="KG Rate"
                  className="with_input_field column_group with_before half_left rate border_right"
                  sortable
                />
                <Column
                  field="amount"
                  header="Amount"
                  className="with_input_field"
                  sortable
                />
                <Column
                  field="charge"
                  body={cylinderTemplate}
                  header="Stereo Charge"
                  className="with_input_field"
                  sortable
                />
                <Column
                  field="discount"
                  body={discountTemplate}
                  className="with_input_field"
                  header="Discount"
                  sortable
                />

                <Column
                  field="tax"
                  body={taxTemplate}
                  header="Tax"
                  className="with_input_field"
                  sortable
                />
                <Column
                  field="final_amount"
                  header="Final Amount"
                  className="with_input_field"
                  sortable
                />
                <Column
                  field="action"
                  body={actionTemplate}
                  header="Action"
                  hidden={state?.isView}
                />
              </DataTable>
            </div>
          </div>
        </div>
        <div className="add_sales_bottom_wrap mt-3">
          <Row>
            <Col xxl={3} md={6}>
              <div className="form_group mb-3">
                <label htmlFor="Comment">Comment</label>
                <InputTextarea
                  id="Comment"
                  name="comment"
                  placeholder="Write Comment"
                  disabled={state?.isView}
                  value={values?.comment || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                />
              </div>
            </Col>
            <Col xxl={3} md={6}>
              <div className="form_group mb-3">
                <label htmlFor="Terms">Terms & Conditions</label>

                <InputTextarea
                  id="Terms"
                  name="terms_and_condition"
                  placeholder="Terms & conditions"
                  disabled={state?.isView}
                  value={
                    !proformaId
                      ? `${fixedTerm || ''}OTHER:${
                          values?.terms_and_condition || ''
                        }`
                      : values?.terms_and_condition || ''
                  }
                  onChange={e => {
                    if (!proformaId) {
                      setFieldValue(
                        'terms_and_condition',
                        e.target.value?.split(fixedTerm + 'OTHER:')?.[1],
                      );
                    } else {
                      setFieldValue('terms_and_condition', e.target.value);
                    }
                  }}
                  onBlur={handleBlur}
                  rows={15}
                />
              </div>
            </Col>
            <Col xxl={3} md={6}>
              <DropZone
                module="sales"
                disabled={state?.isView}
                value={values?.attachment || ''}
                setFieldValue={setFieldValue}
                fieldName={'attachment'}
              />
            </Col>
            <Col xxl={3} md={6}>
              <div className="border rounded-3 bg_white p-3 mb-3">
                <ul>
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col md={4}>
                        <label htmlFor="" className="mb-md-0 mb-1">
                          Sub Total
                        </label>
                      </Col>
                      <Col md={8}>
                        <span>
                          {/* {values?.total_amount} */}
                          {roundValueThousandSeparator(
                            values?.total_amount,
                            'decimal',
                          )}
                        </span>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col md={4}>
                        <label htmlFor="Discount" className="mb-md-0 mb-1">
                          Discount ( - )
                        </label>
                      </Col>
                      <Col md={8}>
                        <div className="form_group">
                          <InputText
                            type="number"
                            id="Freight"
                            placeholder="00.00"
                            disabled={state?.isView}
                            value={values?.discount}
                          />
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col md={4}>
                        <label htmlFor="streoCharge" className="mb-md-0 mb-1">
                          Stereo Charges
                        </label>
                      </Col>
                      <Col md={8}>
                        <div className="form_group">
                          <InputText
                            type="number"
                            id="Freight"
                            placeholder="₹00.00"
                            name="streo_charge"
                            disabled={state?.isView}
                            value={values?.streo_charge}
                          />
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col md={4}>
                        <label htmlFor="Freight" className="mb-md-0 mb-1">
                          Freight
                        </label>
                      </Col>
                      <Col md={8}>
                        <div className="form_group">
                          <InputText
                            id="Freight"
                            type="number"
                            placeholder="₹00.00"
                            disabled={state?.isView}
                            value={values?.freight}
                            onChange={e => {
                              let final_amount =
                                Number(values?.total_amount) -
                                Number(values?.discount) +
                                Number(values?.streo_charge) +
                                Number(values?.tax_amount) +
                                Number(e.target.value);
                              setFieldValue('freight', Number(e.target.value));
                              setFieldValue(
                                'final_amount',
                                final_amount
                                  ? Number(final_amount)?.toFixed(2)
                                  : 0,
                              );
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col md={4}>
                        <label htmlFor="Tax" className="mb-md-0 mb-1">
                          Tax
                        </label>
                      </Col>
                      <Col md={8}>
                        <div className="form_group">
                          <InputText
                            // type="number"
                            id="Freight"
                            disabled={state?.isView}
                            placeholder="₹00.00"
                            // value={values?.tax_amount}
                            value={roundValueThousandSeparator(
                              values?.tax_amount,
                              'decimal',
                            )}
                          />
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <hr />
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col md={4}>
                        <label htmlFor="Total" className="mb-md-0 mb-1">
                          Total
                        </label>
                      </Col>
                      <Col md={8}>
                        <span>
                          {/* {values?.final_amount} */}
                          {roundValueThousandSeparator(
                            values?.final_amount,
                            'decimal',
                          )}
                        </span>
                      </Col>
                    </Row>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <div className="button_group d-flex justify-content-end">
            <Link to="/proforma-invoice" className="btn_border">
              Cancel
            </Link>

            <Button
              className="btn_primary ms-3"
              onClick={handleSubmit}
              disabled={state?.isView}
            >
              {proformaId ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
        <Dialog
          header="Add Product"
          visible={newAttributeModal?.openModel}
          draggable={false}
          className="modal_Wrapper modal_large"
          onHide={() => {
            setNewAttributeModal({ openModel: false, isViewData: true });
            if (proformaId) {
              let newArray = localSelectedProductData?.map(item => {
                const obj = products?.find(
                  item2 => item2._id === item.product_id,
                );
                if (obj) {
                  return obj;
                }
                return item;
              });
              setProducts(newArray);
            } else {
              setProducts(localSelectedProductData);
            }
          }}
        >
          <div className="add_product_content_wrap">
            <div className="table_main_Wrapper bg-white">
              <div className="top_filter_wrap">
                <Row className="align-items-center">
                  <Col md={3}>
                    <div className="page_title">
                      <h3 className="m-0">Select Product</h3>
                    </div>
                  </Col>
                  <Col md={9}>
                    <div className="right_filter_wrapper">
                      <ul>
                        <li className="search_input_wrap">
                          <div className="form_group">
                            <InputText
                              id="search"
                              placeholder="Search"
                              type="search"
                              disabled={state?.isView}
                              className="input_wrap small search_wrap"
                              value={searchProduct}
                              onChange={e => {
                                debounceHandleSearchInput(e);
                                setSearchProduct(e.target.value);
                              }}
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="data_table_wrapper is_filter without_all_select data_table_collapsable">
                <button
                  type="button"
                  className="table_filter_btn"
                  onClick={() => {
                    handleFilterUpdate();
                  }}
                >
                  <img src={SearchIcon} alt="" />
                </button>
                <DataTable
                  value={productForProforma}
                  filterDisplay="row"
                  sortMode="single"
                  selectionMode="checkbox"
                  onSelectionChange={e => {
                    handleCheckboxTemplate(e.value);
                  }}
                  selection={products}
                  sortField="name"
                  sortOrder={1}
                  dataKey="_id"
                  // dataKey={proformaId ? 'product_id' : '_id'}
                  emptyMessage={
                    productLoading ? <Skeleton count={10} /> : false
                  }
                >
                  <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '3rem' }}
                  ></Column>
                  <Column
                    field="image"
                    header="Image"
                    sortable
                    body={imageTemplate}
                    filter={filterToggle}
                  ></Column>
                  <Column
                    field="design_name"
                    header="Design Name"
                    sortable
                    filter={filterToggle}
                  ></Column>
                  <Column
                    field="size"
                    header="Size"
                    sortable
                    filter={filterToggle}
                    body={sizeTemplate}
                  ></Column>
                  <Column
                    field="gsm"
                    header="GSM"
                    sortable
                    filter={filterToggle}
                  ></Column>
                  <Column
                    field="print_type_name"
                    header="Printing Type"
                    sortable
                    filter={filterToggle}
                    body={printTypeCode}
                  ></Column>
                  <Column
                    field="product_code"
                    header="Product Code"
                    sortable
                    filter={filterToggle}
                    className="product_code"
                  ></Column>
                  <Column
                    field="qty"
                    header="Qty"
                    sortable
                    filter={filterToggle}
                  ></Column>
                </DataTable>
              </div>
            </div>
            <div className="button_group d-flex justify-content-end mt-3">
              <Button
                className="btn_border"
                onClick={() => {
                  if (proformaId) {
                    let newArray = localSelectedProductData?.map(item => {
                      const obj = products?.find(
                        item2 => item2._id === item.product_id,
                      );
                      if (obj) {
                        return obj;
                      }
                      return item;
                    });
                    setProducts(newArray);
                  } else {
                    setProducts(localSelectedProductData);
                  }
                  setNewAttributeModal({ openModel: false, isViewData: true });
                }}
              >
                Cancel
              </Button>
              <Button
                className="btn_primary ms-3"
                disabled={products?.length === 0}
                onClick={() => {
                  if (proformaId) {
                    let res = products.map(item => {
                      const obj = localSelectedProductData.find(
                        item2 => item2.product_id === item._id,
                      );
                      if (obj) {
                        return obj;
                      }
                      return item;
                    });
                    setLocalSelectedProductData(res);
                  } else {
                    setLocalSelectedProductData(products);
                  }
                  setNewAttributeModal({ openModel: false, isViewData: true });
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
}
