import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import PlusIcon from '../../../Assets/Images/plus.svg';
import PdfIcon from '../../../Assets/Images/pdf.svg';
import MailIcon from '../../../Assets/Images/mail.svg';
import SearchIcon from '../../../Assets/Images/search.svg';
import TranchIcon from '../../../Assets/Images/trash.svg';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Image } from 'primereact/image';
import { getProductList } from 'Services/Products/ProductService';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  setProductForProforma,
  setSelectedProductData,
} from 'Store/Reducers/Products/ProductSlice';
import { useFormik } from 'formik';
import moment from 'moment';
import _ from 'lodash';
import {
  convertIntoNumber,
  getFormattedDate,
  roundValueThousandSeparator,
} from 'Helper/Common';
import {
  getAllUserPartyList,
  getPartiesAdvisor,
  getSingleListParties,
} from 'Services/partiesService';
import DropZone from 'Components/Common/DropZone';
import * as Yup from 'yup';

import Skeleton from 'react-loading-skeleton';

import Loader from 'Components/Common/Loader';
import {
  clearAddProformaInvoiceData,
  clearUpdateProformaInvoiceData,
  setAddSelectedProformaInvoiceData,
  setIsGetInitialValuesProformaInvoice,
  setUpdateSelectedProformaInvoiceData,
  setViewSelectedProformaInvoiceData,
} from 'Store/Reducers/Sales/ProformaInvoiceSlice';
import { getPreviousTransporter } from 'Services/Sales/OrderServices';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import {
  createProformaInvoice,
  getProformaToPdf,
  updateProformaInvoice,
} from 'Services/Sales/ProformaService';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setAllFilters } from 'Store/Reducers/Common';

const addProformachema = Yup.object().shape({
  party_name: Yup.string().required('Party Name is required'),
  invoice_date: Yup.date().required('Invoice Date is required'),
  transporter: Yup.string().required('Transporter is required'),
  present_advisor: Yup.string().required('Present Advisor is required'),
});

const ProformaInvoiceDetail = ({ initialValues }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { proformaId } = useParams();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const [newAttributeModal, setNewAttributeModal] = useState({
    openModel: false,
    isViewData: false,
  });
  const [fixedTerm, setFixedTerm] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [filterToggle, setFilterToggle] = useState(false);

  const { allFilters } = useSelector(({ common }) => common);
  const { productForProforma, productCount, productLoading } = useSelector(
    ({ product }) => product,
  );
  const { productDataCurrentPage, productDataPageLimit } = allFilters?.proforma;

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
    isGetInitialValuesProformaInvoice,
    updateSelectedProformaInvoiceData,
    addSelectedProformaInvoiceData,
    // viewSelectedProformaInvoiceData,
  } = useSelector(({ proformaInvoice }) => proformaInvoice);
  const { previousTransporter } = useSelector(({ salesOrder }) => salesOrder);

  const checkViewValidation =
    state?.isView || locationPath[1] === 'proforma-details';

  const loadRequiredData = useCallback(() => {
    dispatch(getAllUserPartyList());
    // dispatch(getTransporterPartyList());
    dispatch(getPartiesAdvisor());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
    // return () => {
    //   dispatch(setSelectedProductData([]));
    //   dispatch(clearProformaInvoiceDetail());
    //   handleSinglePartiesDetailsClear();
    // };
  }, []);

  const submitHandle = useCallback(
    async values => {
      const checkEmptyFieldCondition = values?.proforma_item?.some(item => {
        if (item?.is_rate_per_kg) {
          return !item?.weight || !item?.kg_rate;
        } else {
          return !item?.pcs || !item?.rate;
        }
      });

      if (!values?.proforma_item?.length) {
        toast.error('Please add atleast one product.');
        return;
      } else if (checkEmptyFieldCondition) {
        toast.error('Please enter values of PCs & Rate.');
        return;
      }

      let result;
      let proforma_invoice_item = values?.proforma_item?.map(data => {
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

        if (result) {
          dispatch(
            setIsGetInitialValuesProformaInvoice({
              ...isGetInitialValuesProformaInvoice,
              update: false,
            }),
          );
          dispatch(clearUpdateProformaInvoiceData());
        }
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

        if (result) {
          dispatch(
            setIsGetInitialValuesProformaInvoice({
              ...isGetInitialValuesProformaInvoice,
              add: false,
            }),
          );
          dispatch(clearAddProformaInvoiceData());
        }
      }
      if (result) {
        navigate('/proforma-invoice');
      }
    },
    [
      proformaId,
      dispatch,
      isGetInitialValuesProformaInvoice,
      fixedTerm,
      navigate,
    ],
  );

  const { handleBlur, values, errors, touched, handleSubmit, setFieldValue } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: addProformachema,
      onSubmit: submitHandle,
    });

  useEffect(() => {
    if (
      proformaId &&
      values?.proforma_item?.length > 0 &&
      productForProforma?.length > 0
      // !updateSelectedProformaInvoiceData?.selected_product
    ) {
      const newArray = values?.proforma_item?.map(item => {
        const obj = productForProforma?.find(
          item2 => item2._id === item.product_id,
        );
        if (obj) {
          return obj;
        }
        return item;
      });
      // setSelectedProduct(newArray);
      commonUpdateFiledValue('selected_product', newArray);
    }
  }, [productForProforma, values?.proforma_item]);

  useEffect(() => {
    let data = `RATE: The above prices are EXW Surat \nVALIDITY: The quote is valid for 15 days from the date of issue \nPAYMENT TERMS: 30% advance, remaining 70% before dispatch \nQuantity: The actual quantity of bags may vary by +/- 10%. Billing will be done as per the actual number of bags manufactured \nDESIGN: We are not responsible for any error in the design once it is finalized by the buyer Kindly check all color's, PANTONE codes, matter, size of name and logos, phone numbers, address, spelling, pin codes, etc. \nTOLERANCE / VARIATION: 1% of bags from the total supplied quantity may have some printing defect, registration issue, sealing issue, etc. due to human errors that cannot be detected during QC. We will replace/refund the quantity of bags that are sent back to us (subject to authenticity). \n`;
    setFixedTerm(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.invoice_date]);

  useEffect(() => {
    if (previousTransporter) {
      let transporter = transporterPartyList?.find(
        x => x?._id === previousTransporter?.transporter,
      );

      commonUpdateFiledValue(
        'transporter',
        transporter ? transporter?._id : '',
      );
    }
  }, [previousTransporter, transporterPartyList, setFieldValue]);

  const handleTransporterData = e => {
    const name = e.target.name;
    const value = e.target.value;

    const selectedTrasporter = transporterPartyList?.find(
      data => data?._id === value,
    );
    setFieldValue('transporter_gst', selectedTrasporter?.gst);
    setFieldValue(
      'transporter_phone_no',
      selectedTrasporter?.personal_contact_no,
    );
    setFieldValue('transporter', value);

    if (proformaId) {
      // if (checkViewValidation) {
      //   dispatch(
      //     setViewSelectedProformaInvoiceData({
      //       ...viewSelectedProformaInvoiceData,
      //       [name]: value,
      //       transporter_gst: selectedTrasporter?.gst,
      //       transporter_phone_no: selectedTrasporter?.personal_contact_no,
      //     }),
      //   );
      // } else {
      dispatch(
        setUpdateSelectedProformaInvoiceData({
          ...updateSelectedProformaInvoiceData,
          [name]: value,
          transporter_gst: selectedTrasporter?.gst,
          transporter_phone_no: selectedTrasporter?.personal_contact_no,
        }),
      );
      // }
    } else {
      dispatch(
        setAddSelectedProformaInvoiceData({
          ...addSelectedProformaInvoiceData,
          [name]: value,
          transporter_gst: selectedTrasporter?.gst,
          transporter_phone_no: selectedTrasporter?.personal_contact_no,
        }),
      );
    }
  };

  const onCustomChange = useCallback(
    (key, val) => {
      let list;
      if (key === 'billing_address') {
        list = [...values?.billing_address];
      } else list = [...values?.shipping_address];
      list[0] = singleListParties?.party_address?.find(x => x?._id === val);
      commonUpdateFiledValue(key, list);
    },
    [
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
        disabled={checkViewValidation}
      ></Checkbox>
    );
  };
  const totalCount = (data, key) => {
    let NewData = data?.length > 0 ? data : [];
    const aa = NewData?.reduce((sum, cuurent) => {
      if (Object.keys(cuurent)?.includes(key)) {
        return sum + Number(cuurent[key]);
      } else {
        return sum;
      }
    }, 0)?.toFixed(2);
    return aa;
  };

  const handleChangeData = (e, option, key) => {
    let list = [...JSON.parse(JSON.stringify(values?.proforma_item))];

    const index = list?.findIndex(x => x?._id === option?._id);

    if (index >= 0) list[index][key] = e;

    if (key === 'pcs') {
      const taxPercentage = list[index]['tax_percentage']
        ? convertIntoNumber(list[index]['tax_percentage'])
        : 0;
      const rate = list[index]['rate']
        ? convertIntoNumber(list[index]['rate'])
        : 0;
      const charge = list[index]['charge']
        ? convertIntoNumber(list[index]['charge'])
        : 0;
      const discount = list[index]['discount']
        ? convertIntoNumber(list[index]['discount'])
        : 0;

      const bgWeight = parseFloat(list[index]['bag_weight']?.split(' ')[0]);
      const amount = e * rate;
      // const finalAmount = amount - discount + charge + gstAmount;
      const finalAmount = amount - discount + charge;
      const gstAmount = (finalAmount * taxPercentage) / 100;
      let kg_qty = convertIntoNumber(e * (bgWeight / 1000));

      if (kg_qty % 10 != 0) {
        let kg = convertIntoNumber(kg_qty / 10);
        let round = Number.isInteger(kg) ? kg : Math.round(kg) + 1;
        kg_qty = round * 10;
      }
      list[index]['weight'] = kg_qty ? kg_qty : 0;
      list[index]['amount'] = amount ? convertIntoNumber(amount) : 0;
      list[index]['gst_amount'] = gstAmount ? convertIntoNumber(gstAmount) : 0;
      list[index]['final_amount'] = finalAmount
        ? convertIntoNumber(finalAmount)
        : 0;
    }

    if (key === 'rate') {
      const taxPercentage = list[index]['tax_percentage']
        ? convertIntoNumber(list[index]['tax_percentage'])
        : 0;
      const pcs = list[index]['pcs']
        ? convertIntoNumber(list[index]['pcs'])
        : 0;
      const charge = list[index]['charge']
        ? convertIntoNumber(list[index]['charge'])
        : 0;
      const discount = list[index]['discount']
        ? convertIntoNumber(list[index]['discount'])
        : 0;

      const amount = e * pcs;
      // const finalAmount = amount - discount + charge + gstAmount;
      const finalAmount = amount - discount + charge;
      const gstAmount = (finalAmount * taxPercentage) / 100;

      list[index]['amount'] = amount ? convertIntoNumber(amount) : 0;
      list[index]['gst_amount'] = gstAmount ? convertIntoNumber(gstAmount) : 0;
      list[index]['final_amount'] = finalAmount
        ? convertIntoNumber(finalAmount)
        : 0;
    }

    if (key === 'weight') {
      const taxPercentage = list[index]['tax_percentage']
        ? convertIntoNumber(list[index]['tax_percentage'])
        : 0;
      const kgRate = list[index]['kg_rate']
        ? convertIntoNumber(list[index]['kg_rate'])
        : 0;
      const charge = list[index]['charge']
        ? convertIntoNumber(list[index]['charge'])
        : 0;
      const discount = list[index]['discount']
        ? convertIntoNumber(list[index]['discount'])
        : 0;

      const totalgm = e * 1000;
      const bgWeight =
        totalgm / parseFloat(list[index]['bag_weight']?.split(' ')[0]);
      let qty = Math.round(bgWeight);
      if (qty % 100 !== 0) {
        const pc = convertIntoNumber(qty / 100);
        const round = Number.isInteger(pc) ? pc : Math.round(pc) + 1;
        qty = round * 100;
      }
      const amount = e * kgRate;
      // const finalAmount = amount - discount + charge + gstAmount;
      const finalAmount = amount - discount + charge;
      const gstAmount = (finalAmount * taxPercentage) / 100;

      list[index]['pcs'] = qty ? qty : 0;
      list[index]['amount'] = amount ? convertIntoNumber(amount) : 0;
      list[index]['gst_amount'] = gstAmount ? convertIntoNumber(gstAmount) : 0;
      list[index]['final_amount'] = finalAmount
        ? convertIntoNumber(finalAmount)
        : 0;
    }

    if (key === 'kg_rate') {
      const weight = list[index]['weight']
        ? convertIntoNumber(list[index]['weight'])
        : 0;
      const taxPercentage = list[index]['tax_percentage']
        ? convertIntoNumber(list[index]['tax_percentage'])
        : 0;
      const charge = list[index]['charge']
        ? convertIntoNumber(list[index]['charge'])
        : 0;
      const discount = list[index]['discount']
        ? convertIntoNumber(list[index]['discount'])
        : 0;
      const amount = e * weight;
      // const finalAmount = amount - discount + charge + gstAmount;
      const finalAmount = amount - discount + charge;
      const gstAmount = (finalAmount * taxPercentage) / 100;

      list[index]['amount'] = amount ? convertIntoNumber(amount) : 0;
      list[index]['gst_amount'] = gstAmount ? convertIntoNumber(gstAmount) : 0;
      list[index]['final_amount'] = finalAmount
        ? convertIntoNumber(finalAmount)
        : 0;
    }

    if (key === 'charge') {
      const amount = list[index]['amount']
        ? convertIntoNumber(list[index]['amount'])
        : 0;
      const taxPercentage = list[index]['tax_percentage']
        ? convertIntoNumber(list[index]['tax_percentage'])
        : 0;
      const charge = list[index]['charge']
        ? convertIntoNumber(list[index]['charge'])
        : 0;
      const discount = list[index]['discount']
        ? convertIntoNumber(list[index]['discount'])
        : 0;
      // const finalAmount = amount - discount + e + gstAmount;
      const finalAmount = amount - discount + e;
      const gstAmount = (finalAmount * taxPercentage) / 100;
      list[index]['gst_amount'] = gstAmount ? convertIntoNumber(gstAmount) : 0;
      list[index]['final_amount'] = finalAmount
        ? convertIntoNumber(finalAmount)
        : 0;
    }

    if (key === 'discount') {
      const amount = list[index]['amount']
        ? convertIntoNumber(list[index]['amount'])
        : 0;
      const taxPercentage = list[index]['tax_percentage']
        ? convertIntoNumber(list[index]['tax_percentage'])
        : 0;
      const charge = list[index]['charge']
        ? convertIntoNumber(list[index]['charge'])
        : 0;

      // let finalAmount = amount - e + charge + gstAmount;
      const finalAmount = amount - e + charge;
      let gstAmount = (finalAmount * taxPercentage) / 100;
      list[index]['gst_amount'] = gstAmount ? convertIntoNumber(gstAmount) : 0;
      list[index]['final_amount'] = finalAmount
        ? convertIntoNumber(finalAmount)
        : 0;
    }

    if (key === 'tax_percentage') {
      const amount = list[index]['amount']
        ? convertIntoNumber(list[index]['amount'])
        : 0;
      const discount = list[index]['discount']
        ? convertIntoNumber(list[index]['discount'])
        : 0;
      const charge = list[index]['charge']
        ? convertIntoNumber(list[index]['charge'])
        : 0;

      // const finalAmount = amount - discount + charge + gstAmount;
      const finalAmount = amount - discount + charge;
      const gstAmount = (finalAmount * e) / 100;
      list[index]['gst_amount'] = gstAmount ? convertIntoNumber(gstAmount) : 0;
      list[index]['final_amount'] = finalAmount
        ? convertIntoNumber(finalAmount)
        : 0;
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

    // setLocalSelectedProductData(list);
    // dispatch(setSelectedProductData(res));
    // commonUpdateFiledValue('proforma_item', list);

    let totalAmount = totalCount(list, 'amount');
    let discount = totalCount(list, 'discount');
    let stereoCharge = totalCount(list, 'charge');
    let taxAmount = totalCount(list, 'gst_amount');
    let taxableAmount = totalCount(list, 'final_amount');

    // let final_amount =
    //   Number(totalAmount) -
    //   Number(discount) +
    //   Number(stereoCharge) +
    //   // Number(taxAmount) +
    //   (values?.freight ? Number(values?.freight) : 0);

    let total_taxable_amount =
      convertIntoNumber(taxableAmount) +
      convertIntoNumber(values?.freight ? values?.freight : 0);

    // Calculate total taxable amount
    const maxTaxObject = list.find(
      obj =>
        obj.tax_percentage === Math.max(...list.map(obj => obj.tax_percentage)),
    );
    let taxable_freight_amount =
      (convertIntoNumber(values?.freight ? values?.freight : 0) *
        (maxTaxObject ? maxTaxObject?.tax_percentage : 0)) /
      100;

    let final_amount =
      total_taxable_amount +
      (convertIntoNumber(taxAmount) + taxable_freight_amount);

    // let final_amount =
    //   convertIntoNumber(taxableAmount) + convertIntoNumber(taxAmount);

    // setFieldValue('total_amount', convertIntoNumber(totalAmount));
    setFieldValue('total_amount', convertIntoNumber(total_taxable_amount));
    setFieldValue('discount', convertIntoNumber(discount));
    setFieldValue('streo_charge', convertIntoNumber(stereoCharge));
    // setFieldValue('tax_amount', convertIntoNumber(taxAmount));
    setFieldValue(
      'tax_amount',
      convertIntoNumber(taxAmount) + taxable_freight_amount,
    );
    // setFieldValue(
    //   'final_amount',
    //   final_amount ? convertIntoNumber(final_amount) : 0,
    // );
    setFieldValue(
      'final_amount',
      final_amount ? convertIntoNumber(final_amount) : 0,
    );
    setFieldValue('proforma_item', list);

    if (proformaId) {
      dispatch(
        setUpdateSelectedProformaInvoiceData({
          ...updateSelectedProformaInvoiceData,
          total_amount: convertIntoNumber(totalAmount),
          discount: convertIntoNumber(discount),
          streo_charge: convertIntoNumber(stereoCharge),
          tax_amount: convertIntoNumber(taxAmount),
          final_amount: final_amount ? convertIntoNumber(final_amount) : 0,
          proforma_item: list,
        }),
      );
    } else {
      dispatch(
        setAddSelectedProformaInvoiceData({
          ...addSelectedProformaInvoiceData,
          total_amount: convertIntoNumber(totalAmount),
          discount: convertIntoNumber(discount),
          streo_charge: convertIntoNumber(stereoCharge),
          tax_amount: convertIntoNumber(taxAmount),
          final_amount: final_amount ? convertIntoNumber(final_amount) : 0,
          proforma_item: list,
        }),
      );
    }
  };

  const hsnTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="number"
          placeholder="0"
          className="w-100"
          value={data?.hsn}
          disabled={checkViewValidation}
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
          disabled={data?.is_rate_per_kg || checkViewValidation}
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
          disabled={!data?.is_rate_per_kg || checkViewValidation}
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
          disabled={data?.is_rate_per_kg || checkViewValidation}
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
          disabled={!data?.is_rate_per_kg || checkViewValidation}
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
          disabled={checkViewValidation}
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
          disabled={checkViewValidation}
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
          disabled={checkViewValidation}
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
          disabled={checkViewValidation}
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

  const finalAmountTemplate = data => {
    return <span>{roundValueThousandSeparator(data?.final_amount)}</span>;
  };

  const handleDelete = data => {
    if (data) {
      const newArray = values?.proforma_item?.filter(i => i?._id !== data?._id);
      const filteredSelectedData = values?.selected_product?.filter(
        item => item?._id !== data?.product_id,
      );

      let totalAmount = totalCount(newArray, 'amount');
      let discount = totalCount(newArray, 'discount');
      let stereoCharge = totalCount(newArray, 'charge');
      let taxAmount = totalCount(newArray, 'gst_amount');

      let taxableAmount = totalCount(newArray, 'final_amount');
      let final_amount =
        convertIntoNumber(taxableAmount) + convertIntoNumber(taxAmount);

      // let final_amount =
      //   Number(totalAmount) -
      //   Number(discount) +
      //   Number(stereoCharge) +
      //   Number(taxAmount) +
      //   (values?.freight ? Number(values?.freight) : 0);

      setFieldValue('total_amount', convertIntoNumber(taxableAmount));
      setFieldValue('discount', convertIntoNumber(discount));
      setFieldValue('streo_charge', convertIntoNumber(stereoCharge));
      setFieldValue('tax_amount', convertIntoNumber(taxAmount));
      setFieldValue(
        'final_amount',
        final_amount ? convertIntoNumber(final_amount) : 0,
      );

      setFieldValue('proforma_item', newArray);
      setFieldValue('selected_product', filteredSelectedData);
      // setSelectedProduct(filteredSelectedData);

      if (
        proformaId
        //  &&
        // (state?.isEdit || locationPath[1] === 'update-proforma-invoice')
      ) {
        dispatch(
          setUpdateSelectedProformaInvoiceData({
            ...updateSelectedProformaInvoiceData,
            proforma_item: newArray,
            selected_product: filteredSelectedData,
            total_amount: convertIntoNumber(taxableAmount),
            discount: convertIntoNumber(discount),
            streo_charge: convertIntoNumber(stereoCharge),
            tax_amount: convertIntoNumber(taxAmount),
            final_amount: final_amount ? convertIntoNumber(final_amount) : 0,
          }),
        );
      } else {
        dispatch(
          setAddSelectedProformaInvoiceData({
            ...addSelectedProformaInvoiceData,
            proforma_item: newArray,
            selected_product: filteredSelectedData,
            total_amount: convertIntoNumber(taxableAmount),
            discount: convertIntoNumber(discount),
            streo_charge: convertIntoNumber(stereoCharge),
            tax_amount: convertIntoNumber(taxAmount),
            final_amount: final_amount ? convertIntoNumber(final_amount) : 0,
          }),
        );
      }
    }
  };

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
        <Image
          src={data?.main_image}
          alt="Image"
          disabled={checkViewValidation}
        />
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
    // setSelectedProduct(data);
    commonUpdateFiledValue('selected_product', newList);
  };

  const filteredBillingList = useMemo(() => {
    if (!values?.billing_addrees_list) {
      return [];
    }
    const billingAddresses = Array.isArray(values?.billing_address)
      ? values?.billing_address
      : [values?.billing_address];

    const filteredList =
      values?.billing_addrees_list?.filter(
        obj => !billingAddresses.some(obj2 => obj?._id === obj2?._id),
      ) || [];

    const foundItem =
      values?.billing_addrees_list.find(
        x =>
          x._id === billingAddresses[0]?.value ||
          x._id === billingAddresses[0]?._id,
      ) || {};

    return Object.keys(foundItem)?.length > 0
      ? [...filteredList, { ...foundItem }]
      : [...filteredList];
  }, [values?.billing_addrees_list, values?.billing_address]);

  const filteredShippingList = useMemo(() => {
    if (!values?.shipping_addrees_list) {
      return [];
    }

    const shippingAddresses = Array.isArray(values?.shipping_address)
      ? values?.shipping_address
      : [values?.shipping_address];

    const filteredList =
      values?.shipping_addrees_list?.filter(
        obj => !shippingAddresses.some(obj2 => obj?._id === obj2?._id),
      ) || [];

    const foundItem =
      values?.shipping_addrees_list?.find(
        x =>
          x?._id === shippingAddresses[0]?.value ||
          x?._id === shippingAddresses[0]?._id,
      ) || {};

    return Object.keys(foundItem)?.length > 0
      ? [...filteredList, { ...foundItem }]
      : [...filteredList];
  }, [values?.shipping_addrees_list, values?.shipping_address]);

  const handleProductSearchInput = e => {
    dispatch(
      getProductList(
        productDataPageLimit,
        productDataCurrentPage,
        e.target.value,
      ),
    );
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleProductSearchInput, 800),
    [],
  );

  const commonUpdateFiledValue = (fieldName, fieldValue) => {
    if (proformaId) {
      // if (checkViewValidation) {
      //   dispatch(
      //     setViewSelectedProformaInvoiceData({
      //       ...viewSelectedProformaInvoiceData,
      //       [fieldName]: fieldValue,
      //     }),
      //   );
      // } else {
      dispatch(
        setUpdateSelectedProformaInvoiceData({
          ...updateSelectedProformaInvoiceData,
          [fieldName]: fieldValue,
        }),
      );
      // }
    } else {
      dispatch(
        setAddSelectedProformaInvoiceData({
          ...addSelectedProformaInvoiceData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleChangeFieldsdData = (fieldObject = {}) => {
    if (proformaId) {
      // if (checkViewValidation) {
      //   dispatch(
      //     setViewSelectedProformaInvoiceData({
      //       ...viewSelectedProformaInvoiceData,
      //       ...fieldObject,
      //     }),
      //   );
      // } else {
      dispatch(
        setUpdateSelectedProformaInvoiceData({
          ...updateSelectedProformaInvoiceData,
          ...fieldObject,
        }),
      );
      // }
    } else {
      dispatch(
        setAddSelectedProformaInvoiceData({
          ...addSelectedProformaInvoiceData,
          ...fieldObject,
        }),
      );
    }

    Object.keys(fieldObject)?.forEach(keys => {
      setFieldValue(keys, fieldObject[keys]);
    });
  };

  const partyHandleChange = async e => {
    const field_name = e.target.name;
    const field_value = e.value;
    const res = await dispatch(getSingleListParties(e.value));

    if (res) {
      const billingList = res?.party_address?.filter(
        x => x?.address_type_name === 'BILLING',
      );
      const shippingList = res?.party_address?.filter(
        x => x?.address_type_name !== 'BILLING',
      );

      setFieldValue('billing_addrees_list', billingList);
      setFieldValue('shipping_addrees_list', shippingList);

      if (locationPath?.[1] === 'add-proforma-invoice') {
        setFieldValue('present_advisor', res.present_advisor);
        setFieldValue('shipping_address', [{ ...shippingList?.[0] }]);
        setFieldValue('billing_address', [{ ...billingList?.[0] }]);
        dispatch(
          setAddSelectedProformaInvoiceData({
            ...addSelectedProformaInvoiceData,
            [field_name]: field_value,
            address_list: [''],
            billing_addrees_list: billingList,
            shipping_addrees_list: shippingList,
            shipping_address: [{ ...shippingList?.[0] }],
            billing_address: [{ ...billingList?.[0] }],
            present_advisor: res.present_advisor,
          }),
        );
      } else {
        const newBillingList = billingList?.filter(x =>
          proformaInvoiceDetail?.billing_address.includes(x?._id),
        );

        const newShippingList = shippingList?.filter(x =>
          proformaInvoiceDetail?.shipping_address.includes(x?._id),
        );

        setFieldValue('present_advisor', res.present_advisor);
        setFieldValue('billing_address', newBillingList);
        setFieldValue('shipping_address', newShippingList);
        dispatch(
          setUpdateSelectedProformaInvoiceData({
            ...updateSelectedProformaInvoiceData,
            [field_name]: field_value,
            shipping_address: newShippingList,
            billing_address: newBillingList,
            present_advisor: res.present_advisor,
          }),
        );
      }
    }
  };

  const onPageRowsChange = useCallback(
    page => {
      // setPageLimit(page);
      // setCurrentPage(page === 0 ? 0 : 1);
      dispatch(setProductForProforma([]));
      const updateCurrentPage = page === 0 ? 0 : 1;
      dispatch(
        setAllFilters({
          ...allFilters,
          proforma: {
            ...allFilters?.proforma,
            productDataCurrentPage: updateCurrentPage,
            productDataPageLimit: page,
          },
        }),
      );
    },
    [allFilters, dispatch],
  );

  const onPageChange = useCallback(
    page => {
      dispatch(setProductForProforma([]));
      let pageIndex = productDataCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(
        setAllFilters({
          ...allFilters,
          proforma: {
            ...allFilters?.proforma,
            productDataCurrentPage: pageIndex,
          },
        }),
      );
    },
    [dispatch, productDataCurrentPage, allFilters],
  );

  return (
    <>
      <div className="main_Wrapper">
        {(proformaLoading || partiesLoading || productLoading) && <Loader />}
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
                        disabled={checkViewValidation || proformaId}
                        options={allUserPartyList}
                        name="party_name"
                        onChange={e => {
                          dispatch(getPreviousTransporter(e.value));
                          setFieldValue('party_name', e.value);
                          partyHandleChange(e);
                          // commonUpdateFiledValue('party_name', e.value);
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
                          disabled={checkViewValidation}
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
                          name="billing_address"
                          disabled={checkViewValidation}
                          value={
                            values?.billing_address?.[0]?.value ||
                            values?.billing_address?.[0]?._id ||
                            ''
                          }
                          onChange={e =>
                            onCustomChange('billing_address', e.value)
                          }
                          // onChange={e => {
                          //   commonUpdateFiledValue('billing_address', e.value);
                          // }}
                          options={filteredBillingList}
                          // options={
                          //   values?.billing_addrees_list && [
                          //     ...values?.billing_addrees_list?.filter(
                          //       obj =>
                          //         !values?.billing_address?.some(
                          //           obj2 => obj?._id === obj2?._id,
                          //         ),
                          //     ),
                          //     values?.billing_addrees_list?.find(
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
                          name="shipping_address"
                          disabled={checkViewValidation}
                          value={
                            values?.shipping_address?.[0]?.value ||
                            values?.shipping_address?.[0]?._id ||
                            ''
                          }
                          onChange={e =>
                            onCustomChange('shipping_address', e.value)
                          }
                          // onChange={e => {
                          //   commonUpdateFiledValue('shipping_address', e.value);
                          // }}
                          options={filteredShippingList}
                          // options={[
                          //   ...values?.shipping_addrees_list?.filter(
                          //     obj =>
                          //       !values?.shipping_address?.some(
                          //         obj2 => obj?._id === obj2?._id,
                          //       ),
                          //   ),
                          //   values?.shipping_addrees_list?.find(
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
                        disabled={checkViewValidation || proformaId}
                        // onChange={handleChange}
                        onChange={e => {
                          commonUpdateFiledValue(e.target.name, e.target.value);
                        }}
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
                        disabled={checkViewValidation}
                        name="present_advisor"
                        onChange={e => {
                          const findObj = partiesAdvisor?.find(
                            item => item?._id === e.target.value,
                          );
                          const changeFieldObj = {
                            present_advisor_name: findObj ? findObj?.label : '',
                            present_advisor: e.target.value,
                          };
                          handleChangeFieldsdData(changeFieldObj);
                          // commonUpdateFiledValue(e.target.name, e.target.value);
                        }}
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
                        disabled={checkViewValidation}
                        name="tripta_no"
                        value={values?.tripta_no || ''}
                        // onChange={handleChange}
                        onChange={e => {
                          commonUpdateFiledValue(e.target.name, e.target.value);
                        }}
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
                        disabled={checkViewValidation}
                        value={values?.booking_station || ''}
                        onChange={e => {
                          commonUpdateFiledValue(e.target.name, e.target.value);
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
                        disabled={checkViewValidation}
                        // onChange={handleChange}
                        onChange={e => {
                          // commonUpdateFiledValue(e.target.name, e.target.value);
                          handleTransporterData(e);
                        }}
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
                        disabled={checkViewValidation}
                        value={values?.transporter_phone_no || ''}
                        // onChange={handleChange}
                        onChange={e => {
                          commonUpdateFiledValue(e.target.name, e.target.value);
                        }}
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
                        disabled={checkViewValidation}
                        value={values?.transporter_gst || ''}
                        // onChange={handleChange}
                        onChange={e => {
                          commonUpdateFiledValue(e.target.name, e.target.value);
                        }}
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
                        disabled={checkViewValidation}
                        value={values?.total_bundle || ''}
                        onChange={e => {
                          // setFieldValue('total_bundle', Number(e.target.value));
                          commonUpdateFiledValue(
                            e.target.name,
                            Number(e.target.value),
                          );
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
                            if (values?.proforma_item?.length > 0) {
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
                          disabled={
                            values?.party_name === '' || checkViewValidation
                          }
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
                  values?.proforma_item
                  // proformaId
                  //   ? values?.proforma_item
                  //   : // newAttributeModal?.isViewData &&
                  //   values?.proforma_item?.length > 0
                  //   ? values?.proforma_item
                  //   : []
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
                {/* <Column
                  field="amount"
                  header="Amount"
                  className="with_input_field"
                  sortable
                /> */}
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
                  body={finalAmountTemplate}
                  className="with_input_field"
                  sortable
                />
                <Column
                  field="action"
                  body={actionTemplate}
                  header="Action"
                  hidden={checkViewValidation}
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
                  disabled={checkViewValidation}
                  value={values?.comment || ''}
                  // onChange={handleChange}
                  onChange={e => {
                    // setFieldValue('total_bundle', Number(e.target.value));
                    commonUpdateFiledValue('comment', e.target.value);
                  }}
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
                  disabled={checkViewValidation}
                  value={
                    !proformaId
                      ? `${fixedTerm || ''}OTHER:${
                          values?.terms_and_condition || ''
                        }`
                      : values?.terms_and_condition || ''
                  }
                  onChange={e => {
                    if (!proformaId) {
                      // setFieldValue(
                      //   'terms_and_condition',
                      //   e.target.value?.split(fixedTerm + 'OTHER:')?.[1],
                      // );
                      commonUpdateFiledValue(
                        'terms_and_condition',
                        e.target.value?.split(fixedTerm + 'OTHER:')?.[1],
                      );
                    } else {
                      // setFieldValue('terms_and_condition', e.target.value);
                      commonUpdateFiledValue(
                        'terms_and_condition',
                        e.target.value,
                      );
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
                disabled={checkViewValidation}
                value={values?.attachment || ''}
                setFieldValue={setFieldValue}
                fieldName="attachment"
                initialAddImgValue={addSelectedProformaInvoiceData}
                initialUpdateImgValue={updateSelectedProformaInvoiceData}
                setAddInitialImgValue={setAddSelectedProformaInvoiceData}
                setUpdateInitialImgValue={setUpdateSelectedProformaInvoiceData}
                fieldImgName="attachment_name"
                fieldImgValue={values?.attachment_name}
              />
            </Col>
            <Col xxl={3} md={6}>
              <div className="border rounded-3 bg_white p-3 mb-3">
                <ul>
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
                            name="freight"
                            placeholder="0"
                            disabled={checkViewValidation}
                            value={values?.freight}
                            onChange={e => {
                              // Calculate Taxable Amount / Sub Total :
                              let amount_total = totalCount(
                                values?.proforma_item,
                                'final_amount',
                              );
                              let taxable_amount =
                                convertIntoNumber(amount_total) +
                                convertIntoNumber(e.target.value);

                              // Calculate Tax Amount :
                              const maxTaxObject = values?.proforma_item.find(
                                obj =>
                                  obj.tax_percentage ===
                                  Math.max(
                                    ...values?.proforma_item.map(
                                      obj => obj.tax_percentage,
                                    ),
                                  ),
                              );
                              let taxable_freight_amount =
                                (convertIntoNumber(e.target.value) *
                                  (maxTaxObject
                                    ? maxTaxObject?.tax_percentage
                                    : 0)) /
                                100;
                              let taxAmount = totalCount(
                                values?.proforma_item,
                                'gst_amount',
                              );

                              let final_amount =
                                taxable_amount +
                                (convertIntoNumber(taxAmount) +
                                  taxable_freight_amount);

                              setFieldValue('total_amount', taxable_amount);
                              setFieldValue(
                                'freight',
                                convertIntoNumber(e.target.value),
                              );
                              setFieldValue(
                                'tax_amount',
                                convertIntoNumber(taxAmount) +
                                  taxable_freight_amount,
                              );
                              setFieldValue(
                                'final_amount',
                                final_amount
                                  ? convertIntoNumber(final_amount)
                                  : 0,
                              );

                              if (proformaId) {
                                // if (checkViewValidation) {
                                //   dispatch(
                                //     setViewSelectedProformaInvoiceData({
                                //       ...viewSelectedProformaInvoiceData,
                                //       total_amount: taxable_amount,
                                //       freight: Number(e.target.value),
                                //       tax_amount:
                                //         convertIntoNumber(taxAmount) +
                                //         taxable_freight_amount,
                                //       final_amount:
                                //         convertIntoNumber(final_amount),
                                //     }),
                                //   );
                                // } else {
                                dispatch(
                                  setUpdateSelectedProformaInvoiceData({
                                    ...updateSelectedProformaInvoiceData,
                                    total_amount: taxable_amount,
                                    freight: Number(e.target.value),
                                    tax_amount:
                                      convertIntoNumber(taxAmount) +
                                      taxable_freight_amount,
                                    final_amount:
                                      convertIntoNumber(final_amount),
                                  }),
                                );
                                // }
                              } else {
                                dispatch(
                                  setAddSelectedProformaInvoiceData({
                                    ...addSelectedProformaInvoiceData,
                                    total_amount: taxable_amount,
                                    freight: Number(e.target.value),
                                    tax_amount:
                                      convertIntoNumber(taxAmount) +
                                      taxable_freight_amount,
                                    final_amount:
                                      convertIntoNumber(final_amount),
                                  }),
                                );
                              }
                            }}
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
                        <span>
                          {/* {values?.total_amount} */}₹
                          {roundValueThousandSeparator(values?.streo_charge)}
                        </span>
                      </Col>
                      {/* <Col md={8}>
                        <div className="form_group">
                          <InputText
                            type="number"
                            id="Freight"
                            placeholder="₹00.00"
                            name="streo_charge"
                            disabled={checkViewValidation}
                            value={values?.streo_charge}
                          />
                        </div>
                      </Col> */}
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
                        <span>
                          {/* {values?.total_amount} */}₹
                          {roundValueThousandSeparator(values?.discount)}
                        </span>
                      </Col>
                      {/* <Col md={8}>
                        <div className="form_group">
                          <InputText
                            type="number"
                            id="Freight"
                            placeholder="00.00"
                            disabled={checkViewValidation}
                            value={values?.discount}
                          />
                        </div>
                      </Col> */}
                    </Row>
                  </li>
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col md={4}>
                        <label htmlFor="" className="mb-md-0 mb-1">
                          {/* Sub Total */}
                          Taxable Amount
                        </label>
                      </Col>
                      <Col md={8}>
                        <span>
                          {/* {values?.total_amount} */}₹
                          {roundValueThousandSeparator(values?.total_amount)}
                        </span>
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
                        <span>
                          ₹{roundValueThousandSeparator(values?.tax_amount)}
                        </span>
                      </Col>
                      {/* <Col md={8}>
                        <div className="form_group">
                          <InputText
                            // type="number"
                            id="Freight"
                            disabled={checkViewValidation}
                            placeholder="₹00.00"
                            // value={values?.tax_amount}
                            value={roundValueThousandSeparator(
                              values?.tax_amount,
                              'decimal',
                            )}
                          />
                        </div>
                      </Col> */}
                    </Row>
                  </li>
                  <hr />
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col md={4}>
                        <label htmlFor="Total" className="mb-md-0 mb-1">
                          Total Amount
                        </label>
                      </Col>
                      <Col md={8}>
                        <span>
                          {/* {values?.final_amount} */}₹
                          {roundValueThousandSeparator(values?.final_amount)}
                        </span>
                      </Col>
                    </Row>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <div className="button_group d-flex justify-content-end">
            <Button
              className="btn_border"
              onClick={() => {
                if (proformaId) {
                  dispatch(
                    setIsGetInitialValuesProformaInvoice({
                      ...isGetInitialValuesProformaInvoice,
                      update: false,
                      // ...(locationPath[1] === 'proforma-details'
                      //   ? { view: false }
                      //   : { update: false }),
                    }),
                  );
                } else {
                  dispatch(
                    setIsGetInitialValuesProformaInvoice({
                      ...isGetInitialValuesProformaInvoice,
                      add: false,
                    }),
                  );
                }
                navigate('/proforma-invoice');
              }}
            >
              Cancel
            </Button>

            <Button
              className="btn_primary ms-3"
              onClick={handleSubmit}
              disabled={checkViewValidation}
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
              let newArray = values?.proforma_item?.map(item => {
                const obj = values?.selected_product?.find(
                  item2 => item2._id === item.product_id,
                );
                if (obj) {
                  return obj;
                }
                return item;
              });
              // setProducts(newArray);
              commonUpdateFiledValue('selected_product', newArray);
              // setSelectedProduct(newArray);
            } else {
              // setProducts(localSelectedProductData);
              commonUpdateFiledValue('selected_product', values?.proforma_item);
              // setSelectedProduct(values?.proforma_item);
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
                              disabled={checkViewValidation}
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
                  selection={values?.selected_product}
                  // selection={displayArrayInChunks(selectedProduct, 2)}
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
                <CustomPaginator
                  dataList={productForProforma}
                  pageLimit={productDataPageLimit}
                  onPageChange={onPageChange}
                  onPageRowsChange={onPageRowsChange}
                  currentPage={productDataCurrentPage}
                  totalCount={productCount}
                />
              </div>
            </div>
            <div className="button_group d-flex justify-content-end mt-3">
              <Button
                className="btn_border"
                onClick={() => {
                  if (proformaId) {
                    let newArray = values?.proforma_item?.map(item => {
                      const obj = values?.selected_product?.find(
                        item2 => item2?.product_id === item?.product_id,
                      );
                      if (obj) {
                        return obj;
                      }
                      return item;
                    });
                    // setProducts(newArray);
                    commonUpdateFiledValue('selected_product', newArray);
                    // setSelectedProduct(newArray);
                  } else {
                    // setProducts(values?.proforma_item);
                    commonUpdateFiledValue(
                      'selected_product',
                      values?.proforma_item,
                    );
                    // setSelectedProduct(values?.proforma_item);
                  }
                  setNewAttributeModal({ openModel: false, isViewData: true });
                }}
              >
                Cancel
              </Button>
              <Button
                className="btn_primary ms-3"
                disabled={values?.selected_product?.length === 0}
                onClick={() => {
                  if (
                    values?.proforma_item?.length > 0 &&
                    values?.selected_product?.length > 0
                  ) {
                    let res = values?.selected_product?.map(item => {
                      const obj = values?.proforma_item?.find(
                        item2 => item2?.product_id === item?.product_id,
                      );
                      if (obj) {
                        return obj;
                      }
                      return item;
                    });
                    // commonUpdateFiledValue('proforma_item', res);
                    const changeFieldObj = {
                      proforma_item: res,
                      selected_product: values?.selected_product,
                    };
                    handleChangeFieldsdData(changeFieldObj);
                  } else {
                    // commonUpdateFiledValue('proforma_item', newSelectedList);
                    const changeFieldObj = {
                      proforma_item: values?.selected_product,
                      selected_product: values?.selected_product,
                    };
                    handleChangeFieldsdData(changeFieldObj);
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
};
export default memo(ProformaInvoiceDetail);
