import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import UploadIcon from '../../Assets/Images/upload-icon.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import PdfIcon from '../../Assets/Images/pdf.svg';
import MailIcon from '../../Assets/Images/mail.svg';
import PrintIcon from '../../Assets/Images/print.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import CopyIcon from '../../Assets/Images/copy.svg';
import BundleIcon from '../../Assets/Images/bundle.svg';
import moment from 'moment';
import {
  convertIntoNumber,
  getFormattedDate,
  roundValueThousandSeparator,
} from 'Helper/Common';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import ProductImg from '../../Assets/Images/product-thumb.jpg';
import _ from 'lodash';
import ProductImgBig from '../../Assets/Images/product-bag-img.png';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ExportIcon from '../../Assets/Images/export.svg';
import { getProductList } from 'Services/Products/ProductService';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setSelectedProductData } from 'Store/Reducers/Products/ProductSlice';
import { useFormik } from 'formik';
import {
  getAllUserPartyList,
  getPartiesAdvisor,
  getSingleListParties,
  getTransporterPartyList,
} from 'Services/partiesService';
import DropZone from 'Components/Common/DropZone';
import * as Yup from 'yup';
import {
  createSalesInvoice,
  getSalesInvoiceDetail,
  salesOrderJobByParty,
  updateSalesInvoice,
} from 'Services/Sales/SalesInvoiceServices';
import Skeleton from 'react-loading-skeleton';
import Loader from 'Components/Common/Loader';
import { clearSalesInvoiceDetail } from 'Store/Reducers/Sales/SalesInvoiceSlice';
import { getActiveWarehouseList } from 'Services/Settings/MiscMasterService';

export const addProductData = {
  getProductsData() {
    return [
      {
        invoiceNo: '15917',
        image: '10/04/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: '43.00 X 1800.00',
        gsm: '42',
        printType: 'Common Print (CP)',
        productCode:
          'NONWOWEN-BAG-LU-LH-GM-CP-S-W 17.50 x H 14.00 x G 5.00 (60 GSM)-WHITE-21 JEWELS',
        qty: '1500',
      },
      {
        invoiceNo: '15917',
        image: '10/04/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: '43.00 X 1800.00',
        gsm: '42',
        printType: 'Common Print (CP)',
        productCode:
          'NONWOWEN-BAG-LU-LH-GM-CP-S-W 17.50 x H 14.00 x G 5.00 (60 GSM)-WHITE-21 JEWELS',
        qty: '1500',
      },
      {
        invoiceNo: '15917',
        image: '10/04/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: '43.00 X 1800.00',
        gsm: '42',
        printType: 'Common Print (CP)',
        productCode:
          'NONWOWEN-BAG-LU-LH-GM-CP-S-W 17.50 x H 14.00 x G 5.00 (60 GSM)-WHITE-21 JEWELS',
        qty: '1500',
      },
      {
        invoiceNo: '15917',
        image: '10/04/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: '43.00 X 1800.00',
        gsm: '42',
        printType: 'Common Print (CP)',
        productCode:
          'NONWOWEN-BAG-LU-LH-GM-CP-S-W 17.50 x H 14.00 x G 5.00 (60 GSM)-WHITE-21 JEWELS',
        qty: '1500',
      },
      {
        invoiceNo: '15917',
        image: '10/04/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: '43.00 X 1800.00',
        gsm: '42',
        printType: 'Common Print (CP)',
        productCode:
          'NONWOWEN-BAG-LU-LH-GM-CP-S-W 17.50 x H 14.00 x G 5.00 (60 GSM)-WHITE-21 JEWELS',
        qty: '1500',
      },
      {
        invoiceNo: '15917',
        image: '10/04/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: '43.00 X 1800.00',
        gsm: '42',
        printType: 'Common Print (CP)',
        productCode:
          'NONWOWEN-BAG-LU-LH-GM-CP-S-W 17.50 x H 14.00 x G 5.00 (60 GSM)-WHITE-21 JEWELS',
        qty: '1500',
      },
    ];
  },
  getProductsMini() {
    return Promise.resolve(addProductData.getProductsData()?.slice(0, 5));
  },
};

export const addItemData = {
  getProductsData() {
    return [
      {
        items: 'Nonwoven Roll',
        designName: 'Plain',
        color: 'G.Yellow ',
        lamination: 'Non lamination',
        width: '42',
        length: '1800',
        gsm: '42',
        qty: '1500',
      },
      {
        items: 'Nonwoven Roll',
        designName: 'Plain',
        color: 'G.Yellow ',
        lamination: 'Non lamination',
        width: '42',
        length: '1800',
        gsm: '42',
        qty: '1500',
      },
      {
        items: 'Nonwoven Roll',
        designName: 'Plain',
        color: 'G.Yellow ',
        lamination: 'Non lamination',
        width: '42',
        length: '1800',
        gsm: '42',
        qty: '1500',
      },
      {
        items: 'Nonwoven Roll',
        designName: 'Plain',
        color: 'G.Yellow ',
        lamination: 'Non lamination',
        width: '42',
        length: '1800',
        gsm: '42',
        qty: '1500',
      },
      {
        items: 'Nonwoven Roll',
        designName: 'Plain',
        color: 'G.Yellow ',
        lamination: 'Non lamination',
        width: '42',
        length: '1800',
        gsm: '42',
        qty: '1500',
      },
    ];
  },
  getProductsMini() {
    return Promise.resolve(addItemData.getProductsData()?.slice(0, 5));
  },
};

export const addPackageData = {
  getProductsData() {
    return [
      {
        srNo: 1,
        cartonNo: 100,
        description: ' 9"X7"X6" - BHATIA MOBILE - 80 GSM ',
        fabricColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        nettWeight: '80 KG',
        perBagWTGram: '20.98',
      },
      {
        srNo: 2,
        cartonNo: 100,
        description: ' 9"X7"X6" - BHATIA MOBILE - 80 GSM ',
        fabricColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        nettWeight: '80 KG',
        perBagWTGram: '20.98',
      },
      {
        srNo: 3,
        cartonNo: 100,
        description: ' 9"X7"X6" - BHATIA MOBILE - 80 GSM ',
        fabricColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        nettWeight: '80 KG',
        perBagWTGram: '20.98',
      },
      {
        srNo: 4,
        cartonNo: 100,
        description: ' 9"X7"X6" - BHATIA MOBILE - 80 GSM ',
        fabricColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        nettWeight: '80 KG',
        perBagWTGram: '20.98',
      },
      {
        srNo: 5,
        cartonNo: 100,
        description: ' 9"X7"X6" - BHATIA MOBILE - 80 GSM ',
        fabricColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        nettWeight: '80 KG',
        perBagWTGram: '20.98',
      },
    ];
  },
  getProductsMini() {
    return Promise.resolve(addPackageData.getProductsData()?.slice(0, 5));
  },
};

export const addPopularIndustriesData = {
  getProductsData() {
    return [
      {
        srNo: 1,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (60 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 1,
        },
      },
      {
        srNo: 2,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (60 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 1,
        },
      },
      {
        srNo: 3,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (60 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 1,
        },
      },
      {
        srNo: 4,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (60 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 1,
        },
      },
      {
        srNo: 5,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (60 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 1,
        },
      },
      {
        srNo: 6,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (70 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 2,
        },
      },
      {
        srNo: 7,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (70 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 2,
        },
      },
      {
        srNo: 8,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (70 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 2,
        },
      },
      {
        srNo: 9,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (70 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 2,
        },
      },
      {
        srNo: 10,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (70 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 2,
        },
      },
      {
        srNo: 11,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (80 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 3,
        },
      },
      {
        srNo: 12,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (80 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 3,
        },
      },
      {
        srNo: 13,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (80 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 3,
        },
      },
      {
        srNo: 14,
        productCode: '17.50 x H 14.00 x G 5.00 - Bhatia Mobile - (80 GSM)',
        fabColor: 'Peach',
        pcs: '2200',
        grossWeightKG: '80 KG',
        perBagWTGram: '20.98',
        group: {
          product: 3,
        },
      },
    ];
  },
  getProductsMini() {
    return Promise.resolve(
      addPopularIndustriesData.getProductsData()?.slice(0, 15),
    );
  },
};

export default function AddSalesInvoice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const [packageModal, setPackageModal] = useState(false);
  const [newAttributeModal, setNewAttributeModal] = useState({
    openModel: false,
    isViewData: false,
  });
  const [searchProduct, setSearchProduct] = useState('');
  const [popularIndustriesPopup, setPopularIndustriesPopup] = useState(false);
  const [addItemsPopup, setAddItemsPopup] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [billingList, setBillingList] = useState([]);
  const [shippingList, setShippingList] = useState([]);
  const [products, setProducts] = useState([]);
  const [fixedTerm, setFixedTerm] = useState('');
  const [itemData, setItemData] = useState([]);

  const { productForProforma, selectedProductData, productLoading } =
    useSelector(({ product }) => product);
  const {
    allUserPartyList,
    partiesAdvisor,
    transporterPartyList,
    singleListParties,
    partiesLoading,
  } = useSelector(({ parties }) => parties);
  const { salesInvoiceLoading, salesInvoiceDetail, orderJobByPartyList } =
    useSelector(({ salesInvoice }) => salesInvoice);
  const { miscMasterLoading, activeWarehouseList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );

  useEffect(() => {
    addItemData.getProductsMini().then(data => setItemData(data));
  }, []);

  const [packageData, setPackageData] = useState([]);

  useEffect(() => {
    addPackageData.getProductsMini().then(data => setPackageData(data));
  }, []);

  const [popularIndustriesData, setPopularIndustriesData] = useState([]);

  useEffect(() => {
    addPopularIndustriesData
      .getProductsMini()
      .then(data => setPopularIndustriesData(data));
  }, []);

  const addSalesInvoicechema = Yup.object().shape({
    party_name: Yup.string().required('Party Name is required'),
    warehouse: Yup.string().required('Warehouse Name is required'),
    invoice_date: Yup.date().required('Invoice Date is required'),
    transporter: Yup.string().required('Transporter is required'),
    present_advisor: Yup.string().required('Present Advisor is required'),
  });

  const loadRequiredData = useCallback(() => {
    dispatch(getAllUserPartyList());
    dispatch(getTransporterPartyList());
    dispatch(getPartiesAdvisor());
    // dispatch(getProductList(0, 0));
    dispatch(getActiveWarehouseList());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
    return () => {
      dispatch(clearSalesInvoiceDetail());
      dispatch(setSelectedProductData([]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (locationPath?.length < 3) {
    } else if (id) {
      dispatch(getSalesInvoiceDetail(id));
    }
  }, [id, locationPath?.length, dispatch]);

  const submitHandle = useCallback(
    async values => {
      const { warehouse, ...res } = values;

      const updatedSelectedProductData = selectedProductData.map(item => {
        let updatedItem = { ...item, pcs_error: false, kgs_error: false };

        // Validation checks
        if (!item.pcs) {
          updatedItem.pcs_error = true;
        } else {
          if (Number(item.pcs) > Number(item.available_qty)) {
            updatedItem.pcs_error = true;
          }
        }

        if (item.is_rate_per_kg) {
          if (
            !item.weight ||
            Number(item.weight) > Number(item.available_weight)
          ) {
            updatedItem.kgs_error = true;
          }
        }
        // else {
        //   if (Number(item.pcs) > Number(item.available_qty)) {
        //     updatedItem.pcs_error = true;
        //   }
        // }

        return updatedItem;
      });

      if (updatedSelectedProductData?.length > 0) {
        const aa = updatedSelectedProductData?.find(
          item => item.pcs_error === true || item.kgs_error === true,
        );
        if (aa) {
          dispatch(setSelectedProductData(updatedSelectedProductData));
          return;
        } else {
          dispatch(setSelectedProductData(updatedSelectedProductData));
        }
      }

      let result;
      let sales_invoice_item = updatedSelectedProductData?.map(data => {
        return {
          job_id: data?._id,
          product_id: data?.product_id,
          remark: data?.remark,
          hsn: data?.hsn,
          is_rate_per_kg: data?.is_rate_per_kg,
          qty: data?.pcs,
          kg_qty: data?.weight,
          rate: data?.rate,
          kg_rate: 0,
          charge: data?.charge,
          discount: data?.discount,
          total_amount: convertIntoNumber(data?.amount),
          tax_percentage: data?.tax_percentage,
          final_amount: data?.final_amount,
        };
      });

      if (id) {
        const payload = {
          ...res,
          sales_invoice_id: id,
          invoice_date: getFormattedDate(values?.invoice_date),
          billing_address: values?.billing_address[0]?._id,
          shipping_address: values?.shipping_address[0]?._id,
          terms_and_condition: values?.terms_and_condition,
          warehouse_id: values?.warehouse,
          freight: convertIntoNumber(res?.freight),
          discount: convertIntoNumber(res?.discount),
          total_amount: convertIntoNumber(res?.total_amount),
          tax_amount: convertIntoNumber(res?.tax_amount),
          final_amount: convertIntoNumber(res?.final_amount),
          streo_charge: convertIntoNumber(res?.streo_charge),
          total_pc: convertIntoNumber(res?.total_pc),
          total_kg: convertIntoNumber(res?.total_kg),
          total_charge: convertIntoNumber(res?.total_charge),
          total_discount: convertIntoNumber(res?.total_discount),
          sub_total_amount: convertIntoNumber(res?.sub_total_amount),
          sales_invoice_item: sales_invoice_item,
        };
        result = await dispatch(updateSalesInvoice(payload));
      } else {
        const payload = {
          ...res,
          invoice_date: getFormattedDate(values?.invoice_date),
          billing_address: values?.billing_address[0]?._id,
          shipping_address: values?.shipping_address[0]?._id,
          terms_and_condition: values?.terms_and_condition
            ? fixedTerm + 'OTHER:' + values?.terms_and_condition
            : fixedTerm,
          warehouse_id: values?.warehouse,
          freight: convertIntoNumber(res?.freight),
          discount: convertIntoNumber(res?.discount),
          total_amount: convertIntoNumber(res?.total_amount),
          tax_amount: convertIntoNumber(res?.tax_amount),
          final_amount: convertIntoNumber(res?.final_amount),
          streo_charge: convertIntoNumber(res?.streo_charge),
          total_pc: convertIntoNumber(res?.total_pc),
          total_kg: convertIntoNumber(res?.total_kg),
          total_charge: convertIntoNumber(res?.total_charge),
          total_discount: convertIntoNumber(res?.total_discount),
          sub_total_amount: convertIntoNumber(res?.sub_total_amount),
          sales_invoice_item: sales_invoice_item,
        };
        result = await dispatch(createSalesInvoice(payload));
      }
      // const payload = {
      //   ...values,
      //   billing_address: values?.billing_address[0]?._id,
      //   shipping_address: values?.shipping_address[0]?._id,
      //   terms_and_condition: values?.terms_and_condition,
      //   sales_invoice_item: sales_invoice_item,
      // };

      // result = await dispatch(createSalesInvoice(payload));
      // }
      if (result) {
        setBillingList([]);
        setShippingList([]);
        navigate('/sales-invoice');
      }
    },
    [dispatch, selectedProductData, navigate],
  );

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
    initialValues: salesInvoiceDetail,
    validationSchema: addSalesInvoicechema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    if (id) {
      setFieldValue(
        'invoice_date',
        new Date(
          moment(salesInvoiceDetail?.invoice_date, 'DD-MM-YYYY').format(),
        ),
      );
      setFieldValue(
        'streo_charge',
        salesInvoiceDetail?.final_stereo_charge
          ? salesInvoiceDetail?.final_stereo_charge?.toFixed(2)
          : '0.00',
      );
      setFieldValue('warehouse', salesInvoiceDetail?.warehouse_id);
      if (
        salesInvoiceDetail?.sales_invoice_item &&
        // productForProforma?.length > 0
        orderJobByPartyList?.length > 0
      ) {
        let data = salesInvoiceDetail?.sales_invoice_item?.map(i => {
          // let warehouseOption = i?.warehouse_id
          //   ? [
          //       {
          //         id: i?.warehouse_id,
          //         value: i?.warehouse_id,
          //         label: i?.warehouse_name,
          //         name: i?.warehouse_name,
          //       },
          //     ]
          //   : [];

          let qty_value = 0;
          let weight_value = 0;

          if (i?.warehouse?.length) {
            const warehouseData = i?.warehouse?.find(
              i => i?._id === values?.warehouse,
            );
            qty_value = warehouseData?.qty;
            weight_value = warehouseData?.weight;
          }

          return {
            ...i,
            // image: i?.product_image,
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
            amount: i?.total_amount
              ? convertIntoNumber(i?.total_amount)
              : '0.00',
            tax_percentage: i?.tax_percentage,
            final_amount: i?.final_amount
              ? Math.round(i?.final_amount)
              : '0.00',
            available_qty: qty_value,
            available_weight: weight_value,
            product_code: i?.product_code,
            // warehouse_id: i?.warehouse_id,
            // warehouse: warehouseOption,
          };
        });

        let newArray = salesInvoiceDetail?.sales_invoice_item?.map(item => {
          const obj = orderJobByPartyList?.find(
            item2 => item2.product_id === item.product_id,
          );
          if (obj) {
            return obj;
          }
          return item;
        });

        dispatch(setSelectedProductData(data));
        setProducts(newArray);
      }
    }
  }, [id, salesInvoiceDetail, orderJobByPartyList, dispatch, setFieldValue]);

  useEffect(() => {
    if (
      values.invoice_date === '' &&
      locationPath?.[1] === 'add-sales-invoice'
    ) {
      setFieldValue('invoice_date', new Date());
    }
    let data = `RATE: The above prices are EXW Surat \nVALIDITY: The quote is valid for 15 days from the date of issue \nPAYMENT TERMS: 30% advance, remaining 70% before dispatch \nQuantity: The actual quantity of bags may vary by +/- 10%. Billing will be done as per the actual number of bags manufactured \nDESIGN: We are not responsible for any error in the design once it is finalized by the buyer Kindly check all color's, PANTONE codes, matter, size of name and logos, phone numbers, address, spelling, pin codes, etc. \nTOLERANCE / VARIATION: 1% of bags from the total supplied quantity may have some printing defect, registration issue, sealing issue, etc. due to human errors that cannot be detected during QC. We will replace/refund the quantity of bags that are sent back to us (subject to authenticity). \n`;
    setFixedTerm(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.invoice_date]);

  const loadAddress = useCallback(async () => {
    const res = await dispatch(getSingleListParties(values?.party_name));
    dispatch(salesOrderJobByParty(values?.party_name, ''));

    if (res) {
      const billingList = res?.party_address?.filter(
        x => x?.address_type_name === 'BILLING',
      );
      const shippingList = res?.party_address?.filter(
        x => x?.address_type_name !== 'BILLING',
      );
      setBillingList(billingList);
      setShippingList(shippingList);
      if (locationPath?.[1] === 'add-sales-invoice') {
        setFieldValue('shipping_address', [{ ...shippingList?.[0] }]);
        setFieldValue('billing_address', [{ ...billingList?.[0] }]);
        setFieldValue('present_advisor', res.present_advisor);
      } else {
        const newBillingList = billingList?.filter(x =>
          salesInvoiceDetail?.billing_address?.includes(x?._id),
        );
        const newShippingList = shippingList?.filter(x =>
          salesInvoiceDetail?.shipping_address?.includes(x?._id),
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.transporter]);

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

  const handleDelete = useCallback(
    data => {
      if (data) {
        const newArray = selectedProductData?.filter(i => i?._id !== data?._id);
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
          final_amount ? Math.round(final_amount) : 0,
        );
        let totalPc = totalCount(newArray, 'pcs');
        let totalKg = totalCount(newArray, 'weight');
        setFieldValue('total_pc', totalPc);
        setFieldValue('total_kg', totalKg);
        setFieldValue('total_charge', stereoCharge);
        setFieldValue('total_discount', discount);
        setFieldValue('sub_total_amount', totalAmount);
        dispatch(setSelectedProductData(newArray));
        setProducts(newArray);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, selectedProductData],
  );

  const actionTemplate = data => {
    return (
      <ul className="d-flex">
        <li>
          <img src={TrashIcon} alt="" onClick={() => handleDelete(data)} />
        </li>
        {/* <li className="ms-2">
          <img src={CopyIcon} alt="" />
        </li> */}
      </ul>
    );
  };

  const handleChangeData = (e, option, key) => {
    let list = [...JSON.parse(JSON.stringify(selectedProductData))];
    const index = list?.findIndex(x => x?._id === option?._id);

    if (index >= 0) list[index][key] = e;

    if (key === 'pcs' && list[index]['is_rate_per_kg'] === false) {
      let amount = e * Number(list[index]['rate']);
      list[index]['amount'] = amount ? convertIntoNumber(amount) : 0;
      let gstAmount = (amount * Number(list[index]['tax_percentage'])) / 100;
      let finalAmount =
        amount -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? Math.round(finalAmount) : 0;
    }

    if (key === 'rate' && list[index]['is_rate_per_kg'] === false) {
      let amount = e * Number(list[index]['pcs']);
      list[index]['amount'] = amount ? convertIntoNumber(amount) : 0;
      let gstAmount = (amount * Number(list[index]['tax_percentage'])) / 100;
      let finalAmount =
        amount -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? Math.round(finalAmount) : 0;
    }

    // making calculation for "rate" and "kgs"
    if (['rate', 'weight'].includes(key) && list[index]['is_rate_per_kg']) {
      const calculate_amount =
        (Number(list[index]['weight']) || 0) *
        (Number(list[index]['rate']) || 0);
      list[index]['amount'] = convertIntoNumber(calculate_amount);
    }

    // making calculation for "rate" and "pcs"
    if (['rate', 'pcs'].includes(key) && !list[index]['is_rate_per_kg']) {
      const calculate_amount =
        (Number(list[index]['pcs']) || 0) * (Number(list[index]['rate']) || 0);
      list[index]['amount'] = convertIntoNumber(calculate_amount);
    }

    if (key === 'weight' && list[index]['is_rate_per_kg'] === true) {
      let amount = e * Number(list[index]['kg_rate']);
      list[index]['amount'] = amount ? convertIntoNumber(amount) : 0;
      let gstAmount = (amount * Number(list[index]['tax_percentage'])) / 100;
      let finalAmount =
        amount -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? Math.round(finalAmount) : 0;
    }
    if (key === 'kg_rate' && list[index]['is_rate_per_kg'] === true) {
      let amount = e * Number(list[index]['weight']);
      list[index]['amount'] = amount ? convertIntoNumber(amount) : 0;
      let gstAmount = (amount * Number(list[index]['tax_percentage'])) / 100;
      let finalAmount =
        amount -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? Math.round(finalAmount) : 0;
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
      list[index]['final_amount'] = finalAmount ? Math.round(finalAmount) : 0;
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
      list[index]['final_amount'] = finalAmount ? Math.round(finalAmount) : 0;
    }
    if (key === 'tax_percentage') {
      let gstAmount = (Number(list[index]['amount']) * e) / 100;
      let finalAmount =
        Number(list[index]['amount']) -
        Number(list[index]['discount']) +
        Number(list[index]['charge']) +
        gstAmount;
      list[index]['gst_amount'] = gstAmount ? gstAmount?.toFixed(2) : 0;
      list[index]['final_amount'] = finalAmount ? Math.round(finalAmount) : 0;
    }
    if (key === 'is_rate_per_kg' && e === true) {
      list[index]['pcs_error'] = false;
      list[index]['kgs_error'] = false;
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
      list[index]['pcs_error'] = false;
      list[index]['kgs_error'] = false;
      list[index]['amount'] = '';
      list[index]['kg_rate'] = '';
      list[index]['rate'] = '';
      list[index]['pcs'] = '';
      list[index]['weight'] = '';
      list[index]['charge'] = '';
      list[index]['discount'] = '';
      list[index]['gst_amount'] = '';
      list[index]['final_amount'] = '';
    }

    dispatch(setSelectedProductData(list));
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
    setFieldValue('final_amount', final_amount ? Math.round(final_amount) : 0);
    let totalPc = totalCount(list, 'pcs');
    let totalKg = totalCount(list, 'weight');
    setFieldValue('total_pc', totalPc);
    setFieldValue('total_kg', totalKg);
    setFieldValue('total_charge', stereoCharge);
    setFieldValue('total_discount', discount);
    setFieldValue('sub_total_amount', totalAmount);
  };

  const imageTemplate = data => {
    return (
      <div className="image_zoom_Wrapper">
        <Image src={data?.main_image} alt="Image" disabled={state?.isView} />
      </div>
    );
  };

  const jobImageTemplate = data => {
    return (
      <div className="image_zoom_Wrapper">
        <Image
          src={data?.product_detail?.main_image}
          alt="Image"
          disabled={state?.isView}
        />
      </div>
    );
  };

  const productCodeTemplate = data => {
    return <span>{data?.product_code}</span>;
  };

  const jobProductCodeTemplate = data => {
    return <span>{data?.product_detail?.code}</span>;
  };

  const availableQty = rowItem => {
    // let qty_value = 0;

    // if (rowItem?.warehouse?.length) {
    //   const warehouseData = rowItem?.warehouse?.find(
    //     item => item?._id === values?.warehouse,
    //   );
    //   qty_value = warehouseData?.qty;
    // }
    return <span>{rowItem?.available_qty}</span>;
  };

  const availableWeight = rowItem => {
    // let weight_value = 0;

    // if (rowItem?.warehouse?.length) {
    //   const warehouseData = rowItem?.warehouse?.find(
    //     item => item?._id === values?.warehouse,
    //   );
    //   weight_value = warehouseData?.weight;
    // }
    return <span>{rowItem?.available_weight}</span>;
  };

  const designNameTemplate = data => {
    return <span>{data?.product_detail?.design}</span>;
  };

  const bagTypeTemplate = data => {
    return <span>{data?.bag_detail?.bag_type}</span>;
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

  const ratePerKgTemplate = (data, row) => {
    const fieldName = row?.field;

    return (
      <Checkbox
        onChange={e => handleChangeData(e.checked, data, fieldName)}
        checked={data?.is_rate_per_kg}
        disabled={state?.isView}
      ></Checkbox>
    );
  };

  const pcsTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="number"
          placeholder="0"
          className={`w-100 ${data?.pcs_error ? 'border-danger' : ''}`}
          value={data?.pcs}
          disabled={state?.isView}
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
          type="number"
          placeholder="0"
          className={`w-100 ${data?.kgs_error ? 'border-danger' : ''}`}
          value={data?.weight}
          // value={data?.kgs_weight}
          disabled={state?.isView}
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

  const rateTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          type="number"
          placeholder="0"
          className="w-100"
          value={data?.rate}
          disabled={state?.isView}
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

  const pcRateTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          placeholder="0"
          type="number"
          className="w-100"
          value={data?.rate}
          disabled={state?.isView}
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
  const warehouseTemplate = data => {
    return (
      <>
        <ReactSelectSingle
          filter
          value={data?.warehouse_id}
          name="warehouse_id"
          options={data?.warehouse}
          disabled={state?.isView}
          onChange={e => {
            handleChangeData(e.target.value, data, 'warehouse_id');
          }}
          placeholder="Warehouse"
        />
      </>
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
          disabled={state?.isView}
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
          disabled={state?.isView}
          value={data?.charge}
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
          disabled={state?.isView}
          value={data?.discount}
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
              // 'gst_percentage',
              'tax_percentage',
            );
          }}
        />
      </div>
    );
  };

  // const grossWeightKGTemplate = () => {
  //   return (
  //     <div className="form_group mb-0">
  //       <InputText placeholder="80 KG" className="w-100" />
  //     </div>
  //   );
  // };
  // const nettWeightTemplate = () => {
  //   return (
  //     <div className="form_group mb-0">
  //       <InputText placeholder="80 KG" className="w-100" />
  //     </div>
  //   );
  // };
  // const perBagWTGramTemplate = () => {
  //   return (
  //     <div className="form_group mb-0">
  //       <InputText placeholder="20.98" className="w-100" />
  //     </div>
  //   );
  // };

  const handleFilterUpdate = () => {
    setFilterToggle(!filterToggle);
  };
  const remarkTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          placeholder="Text"
          className="w-100"
          value={data?.remark}
          disabled={state?.isView}
          onChange={e => {
            handleChangeData(e.target.value, data, 'remark');
          }}
        />
      </div>
    );
  };

  // const BundleTemplate = () => {
  //   return (
  //     <div
  //       className="bundle_wrap d-flex align-items-center"
  //       onClick={() => setPopularIndustriesPopup(true)}
  //     >
  //       <img src={BundleIcon} alt="" />
  //       <span className="ms-1">3 Bundle</span>
  //     </div>
  //   );
  // };
  // const packageTemplate = () => {
  //   return (
  //     <div className="add_package_wrap">
  //       <div className="icon" onClick={() => setPackageModal(true)}>
  //         <img src={PlusIcon} alt="" />
  //       </div>
  //       <span>Add Package</span>
  //     </div>
  //   );
  // };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total" colSpan={6} />
        {/* <Column footer={BundleTemplate} /> */}
        <Column footer="" />
        <Column footer={values?.total_pc} />
        <Column footer={values?.total_kg} />
        <Column footer="" />
        <Column footer={values?.sub_total_amount} />
        <Column footer={values?.total_charge} />
        <Column footer={values?.total_discount} colSpan={3} />
      </Row>
    </ColumnGroup>
  );
  const popularIndustriesGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total" colSpan={3} />
        <Column footer="30,800" />
        <Column footer="646.24" />
        <Column footer="293.72" />
      </Row>
    </ColumnGroup>
  );
  // const packageFooterGroup = (
  //   <ColumnGroup>
  //     <Row>
  //       <Column footer="Total" colSpan={3} />
  //       <Column footer="55000" />
  //       <Column footer="1161.80" />
  //       <Column footer="1161.80" />
  //     </Row>
  //   </ColumnGroup>
  // );

  const packageFooterGroup = data => {
    return (
      <React.Fragment>
        <td colSpan="3">Total</td>
        <td>11,000</td>
        <td>230.8</td>
        <td>104.9</td>
      </React.Fragment>
    );
  };
  // const printTypeCode = data => {
  //   return `${data?.print_type_name} (${data?.print_type_code})`;
  // };
  // const sizeTemplate = data => {
  //   return data?.gusset !== 0
  //     ? `W ${data?.width} × H ${data?.height} × G ${data?.gusset}`
  //     : `W ${data?.width} × H ${data?.height}`;
  // };

  const handleCheckboxTemplate = data => {
    let newList = data?.map(x => {
      const findObj = selectedProductData?.find(p => p._id === x?._id);
      if (findObj) {
        return findObj;
      } else {
        return {
          ...x,
          amount: 0,
          available_qty: 0,
          available_weight: 0,
          final_amount: 0,
          remark: '',
          hsn: '',
          pcs: '', // Quantity-pcs
          weight: '', // Quantity-kgs
          rate: '',
          charge: '',
          discount: '',
          tax_percentage: x?.gst_percentage,
          is_rate_per_kg: false,
          // image: x?.product_detail?.main_image,
          main_image: x?.product_detail?.main_image,
          // product_code: x?.product_detail?.product_code,
          // pcs_error: false,
          // kgs_error: false,
        };
      }
    });

    // let newList = data?.map((x, i) => {
    //   let warehouseOption = x?.warehouse?.map(d => {
    //     return {
    //       ...d,
    //       label: d?.name,
    //       value: d?._id,
    //     };
    //   });
    //   return {
    //     ...x,
    //     hsn: '',
    //     image: x?.main_image,
    //     product_code: x?.product_code,
    //     remark: '',
    //     is_rate_per_kg: false,
    //     qty: '',
    //     rate: '',
    //     charge: '',
    //     final_amount: '',
    //     discount: '',
    //     total_amount: '',
    //     tax_percentage: x?.material_gst ? x?.material_gst : '',
    //     weight: '',
    //     kg_rate: '',
    //     gst_amount: '',
    //     warehouse: warehouseOption,
    //     product_id: x._id,
    //     warehouse_id: '',
    //   };
    // });
    setProducts(newList);
  };

  const filteredBillingList = useMemo(() => {
    if (!billingList) {
      return [];
    }
    const filteredList =
      billingList.filter(
        obj => !values?.billing_address?.some(obj2 => obj._id === obj2._id),
      ) || [];

    const foundItem =
      billingList.find(
        x =>
          x._id === values?.billing_address?.[0]?.value ||
          x._id === values?.billing_address?.[0]?._id,
      ) || {};

    return Object.keys(foundItem)?.length > 0
      ? [...filteredList, { ...foundItem }]
      : [...filteredList];
  }, [billingList, values?.billing_address]);

  const filteredShippingList = useMemo(() => {
    if (!shippingList) {
      return [];
    }

    const filteredList =
      shippingList.filter(
        obj => !values?.shipping_address?.some(obj2 => obj?._id === obj2?._id),
      ) || [];

    const foundItem =
      shippingList?.find(
        x =>
          x?._id === values?.shipping_address?.[0]?.value ||
          x?._id === values?.shipping_address?.[0]?._id,
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

  const handleAddProduct = () => {
    if (id) {
      let res = products.map(item => {
        let qty_value = 0;
        let weight_value = 0;

        if (item?.warehouse?.length) {
          const warehouseData = item?.warehouse?.find(
            item => item?._id === values?.warehouse,
          );
          qty_value = warehouseData?.qty || 0;
          weight_value = warehouseData?.weight || 0;
        }
        const obj = selectedProductData.find(
          item2 => item2.product_id === item.product_id,
        );
        if (obj) {
          return obj;
        }
        return {
          ...item,
          available_qty: qty_value,
          available_weight: weight_value,
          product_code: item?.product_detail?.code,
        };
      });
      dispatch(setSelectedProductData(res));
    } else {
      const updatedData = products?.map(item => {
        let qty_value = 0;
        let weight_value = 0;

        if (item?.warehouse?.length) {
          const warehouseData = item?.warehouse?.find(
            item => item?._id === values?.warehouse,
          );
          qty_value = warehouseData?.qty || 0;
          weight_value = warehouseData?.weight || 0;
        }
        return {
          ...item,
          available_qty: qty_value,
          available_weight: weight_value,
          product_code: item?.product_detail?.code,
        };
      });

      dispatch(setSelectedProductData(updatedData));
    }
    setNewAttributeModal({ openModel: false, isViewData: true });
  };

  return (
    <div className="main_Wrapper">
      {(salesInvoiceLoading || partiesLoading || miscMasterLoading) && (
        <Loader />
      )}
      <div className="add_perfoma_invoice_wrap">
        <div className="border rounded-3 bg_white p-3 mb-3">
          {/* <div className="d-flex align-items-center justify-content-between">
            <h3>Sales Information</h3>
            <ul className="d-flex">
              <li className="me-2">
                <img src={PdfIcon} alt="PDFIcon"></img>
              </li>
              <li className="me-2">
                <img src={MailIcon} alt="MailIcon"></img>
              </li>
              <li>
                <img src={PrintIcon} alt="PrintIcon"></img>
              </li>
            </ul>
          </div> */}
          <Row>
            <Col xl={6}>
              <Row>
                <Col sm={values?.invoice_no ? '4' : '6'}>
                  <div className="form_group mb-3">
                    <label>
                      Party<span className="text-danger fs-4">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      value={values?.party_name || ''}
                      disabled={id || state?.isView}
                      options={allUserPartyList}
                      onChange={e => {
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

                <Col sm={values?.invoice_no ? '4' : '6'}>
                  <div className="form_group mb-3">
                    <label>
                      Warehouse<span className="text-danger fs-4">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      value={values?.warehouse || ''}
                      disabled={id || state?.isView}
                      options={activeWarehouseList}
                      onChange={e => {
                        setFieldValue('warehouse', e.value);
                      }}
                      onBlur={handleBlur}
                      placeholder="Warehouse"
                    />
                    {touched?.warehouse && errors?.warehouse && (
                      <p className="text-danger">{errors?.warehouse}</p>
                    )}
                  </div>
                </Col>

                {values?.invoice_no ? (
                  <Col sm={4}>
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
                        // options={filteredBillingList}
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
                      values?.billing_address?.[0].address ? (
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
                        //       x?._id === values?.shipping_address?.[0]?.value ||
                        //       x?._id === values?.shipping_address?.[0]?._id,
                        //   ),
                        // ]}
                        placeholder="Business"
                      />
                      {values?.shipping_address &&
                      values?.shipping_address?.[0].address ? (
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
                      name="invoice_date"
                      dateFormat="dd-mm-yy"
                      value={values?.invoice_date || ''}
                      disabled={id || state?.isView}
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
                      Present Advisor<span className="text-danger fs-4">*</span>
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
                      placeholder="tripta No"
                      name="tripta_no"
                      disabled={state?.isView}
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
                      onChange={handleChange}
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
                    <label htmlFor="GrossWeight ">Gross Weight </label>
                    <InputText
                      id="GrossWeight"
                      placeholder="Gross Weight"
                      name="gross_weight"
                      disabled={state?.isView}
                      value={values?.gross_weight || ''}
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
                    {/* <li className="search_input_wrap">
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                        />
                      </div>
                    </li> */}
                    {/* <li>
                      <Button
                        className="btn_primary"
                        onClick={() => setAddItemsPopup(true)}
                      >
                        <img src={PlusIcon} alt="" />
                        Add Item
                      </Button>
                    </li> */}
                    <li>
                      <Button
                        className="btn_primary"
                        disabled={
                          !values?.party_name ||
                          !values?.warehouse ||
                          state?.isView
                        }
                        onClick={e => {
                          if (selectedProductData?.length > 0) {
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
                      >
                        <img src={PlusIcon} alt="" />
                        {/* Add Product */}
                        From Job
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper auto_height cell_padding_small max_height">
            <DataTable
              value={
                id
                  ? selectedProductData
                  : newAttributeModal?.isViewData &&
                    selectedProductData?.length > 0
                  ? selectedProductData
                  : []
              }
              filterDisplay="menu"
              selectionMode="false"
              dataKey="_id"
              footerColumnGroup={footerGroup}
            >
              <Column
                field="image"
                header="Image"
                body={imageTemplate}
                sortable
              />
              <Column
                field="product_code"
                header="Product Code"
                className="product_code"
                sortable
                body={productCodeTemplate}
              />
              {/* <Column
                field="warehouse"
                header="Warehouse"
                sortable
                body={warehouseTemplate}
              /> */}
              <Column
                field="available_qty"
                header="Available Qty"
                sortable
                body={availableQty}
              />
              <Column
                field="available_weight"
                header="Available Weight"
                sortable
                body={availableWeight}
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
                field="is_rate_per_kg"
                body={ratePerKgTemplate}
                header="Rate/kg?"
                sortable
              />
              {/* <Column
                field="packages"
                header="Bundles"
                body={packageTemplate}
                sortable
              /> */}
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
                field="rate"
                // body={pcRateTemplate}
                body={rateTemplate}
                header="Rate"
                sortable
                // className="with_input_field column_group"
              />
              {/* <Column
                field="pcRate"
                body={pcRateTemplate}
                header="PC Rate"
                sortable
                className="with_input_field column_group"
              />
              <Column
                field="kgRate"
                body={kgRateTemplate}
                header="KG Rate"
                sortable
                className="with_input_field column_group with_before half_left rate border_right"
              /> */}
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
                header="Discount"
                sortable
                className="with_input_field"
              />
              <Column
                field="tax_percentage"
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
                value={values?.comment || ''}
                disabled={state?.isView}
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
                  !id
                    ? `${fixedTerm || ''}OTHER:${
                        values?.terms_and_condition || ''
                      }`
                    : values?.terms_and_condition || ''
                }
                onChange={e => {
                  if (!id) {
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
            {/* <div className="upload_file_custom mb-3">
              <InputText type="file" id="UploadFile" />
              <label htmlFor="UploadFile">
                <img src={UploadIcon} alt="" />
                <div className="upload_text">
                  Upload your images{' '}
                  <span className="text_primary">Choose files PNG, JPEG</span>
                </div>
              </label>
            </div> */}
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
                          id="Discount"
                          placeholder="₹00.00"
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
                              final_amount ? Math.round(final_amount) : 0,
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
                          id="Tax"
                          type="number"
                          placeholder="₹00.00"
                          // value={Math.round(values?.tax_amount)}
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
          <Link to="/sales-invoice" className="btn_border">
            Cancel
          </Link>
          <Button
            className="btn_primary ms-3"
            onClick={handleSubmit}
            disabled={state?.isView}
          >
            {id ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>
      <Dialog
        header="Add Product"
        visible={newAttributeModal?.openModel}
        draggable={false}
        className="modal_Wrapper model_extra_large"
        onHide={() => {
          setNewAttributeModal({ openModel: false, isViewData: true });
          if (id) {
            let newArray = selectedProductData?.map(item => {
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
            setProducts(selectedProductData);
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
                // value={productForProforma}
                value={orderJobByPartyList}
                filterDisplay="row"
                sortMode="single"
                selectionMode="checkbox"
                onSelectionChange={e => handleCheckboxTemplate(e.value)}
                selection={products}
                sortField="name"
                sortOrder={1}
                dataKey="_id"
                emptyMessage={productLoading ? <Skeleton count={10} /> : false}
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: '3rem' }}
                ></Column>
                <Column
                  field="job_no"
                  header="Job No"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="job_date"
                  header="Job Date"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="image"
                  header="Image"
                  sortable
                  body={jobImageTemplate}
                  filter={filterToggle}
                ></Column>
                <Column
                  field="product_code"
                  header="Product Code"
                  sortable
                  body={jobProductCodeTemplate}
                  filter={filterToggle}
                  className="product_code"
                ></Column>
                <Column
                  field="design_name"
                  header="Design Name"
                  sortable
                  body={designNameTemplate}
                  filter={filterToggle}
                ></Column>
                <Column
                  field="bag_type_name"
                  header="Bag Type"
                  sortable
                  body={bagTypeTemplate}
                  filter={filterToggle}
                ></Column>
                <Column
                  field="pc_rate"
                  header="Rate(Pc)"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="kg_rate"
                  header="Rate(Kg)"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="qty"
                  header="PCs"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="weight"
                  header="Weight(KG)"
                  sortable
                  filter={filterToggle}
                ></Column>

                {/* <Column
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
                  field="qty"
                  header="Qty"
                  sortable
                  filter={filterToggle}
                ></Column> */}
              </DataTable>
            </div>
          </div>
          <div className="button_group d-flex justify-content-end mt-3">
            <Button
              className="btn_border"
              onClick={() => {
                if (id) {
                  let newArray = selectedProductData?.map(item => {
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
                  setProducts(selectedProductData);
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
                handleAddProduct();
                // if (id) {
                //   let res = products.map(item => {
                //     const obj = selectedProductData.find(
                //       item2 => item2.product_id === item._id,
                //     );
                //     if (obj) {
                //       return obj;
                //     }
                //     return item;
                //   });
                //   dispatch(setSelectedProductData(res));
                // } else {
                //   const updatedData = products?.map(item => {
                //     return {
                //       ...item,
                //       amount: 0,
                //       final_amount: 0,
                //       remark: '',
                //       hsn: '',
                //       pcs: '',
                //       weight: '',
                //       rate: '',
                //       charge: '',
                //       discount: '',
                //       tax_percentage: item?.gst_percentage,
                //     };
                //   });
                //   dispatch(setSelectedProductData(updatedData));
                // }
                // setNewAttributeModal({ openModel: false, isViewData: true });
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        header="Add Item"
        visible={addItemsPopup}
        draggable={false}
        className="modal_Wrapper modal_large"
        onHide={() => setAddItemsPopup(false)}
      >
        <div className="add_product_content_wrap">
          <div className="table_main_Wrapper bg-white">
            <div className="top_filter_wrap">
              <Row className="align-items-center">
                <Col md={3}>
                  <div className="page_title">
                    <h3 className="m-0">Select Item</h3>
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
                            className="input_wrap small search_wrap"
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
                value={itemData}
                filterDisplay="row"
                sortMode="single"
                selectionMode="checkbox"
                onSelectionChange={e => setSelectedCustomers(e.value)}
                selection={selectedCustomers}
                sortField="name"
                sortOrder={1}
                dataKey="id"
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: '3rem' }}
                ></Column>
                <Column
                  field="items"
                  header="Items"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="designName"
                  header="Design Name"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="color"
                  header="Color"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="lamination"
                  header="Lamination"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="width"
                  header="Width"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="length"
                  header="Length"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="gsm"
                  header="GSM"
                  sortable
                  filter={filterToggle}
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
          <Button
            className="btn_primary ms-auto mt-3"
            onClick={() => setAddItemsPopup(false)}
          >
            Save
          </Button>
        </div>
      </Dialog>
      {/*  <Dialog
        header="Add Packages"
        visible={packageModal}
        draggable={false}
        className="modal_Wrapper modal_large"
        onHide={() => setPackageModal(false)}
      >
        <div className="add_product_content_wrap">
          <Row>
            <Col sm={4}>
              <div className="form_group mb-3">
                <label htmlFor="NoOfBundles">No. Of Bundles</label>
                <InputText
                  placeholder="10"
                  id="NoOfBundles"
                  className="w-100"
                />
              </div>
            </Col>
            <Col sm={4}>
              <div className="form_group mb-3">
                <label htmlFor="Wtofemptypack">Wt. of empty pack</label>
                <InputText
                  placeholder="0.5kg"
                  id="Wtofemptypack"
                  className="w-100"
                />
              </div>
            </Col>
          </Row>
          <div className="table_main_Wrapper bg-white">
            <div className="data_table_wrapper cell_padding_medium">
              <DataTable
                value={packageData}
                sortMode="single"
                sortField="name"
                sortOrder={1}
                dataKey="id"
                footerColumnGroup={packageFooterGroup}
              >
                <Column field="srNo" header="Sr No" sortable></Column>
                <Column field="cartonNo" header="Carton No" sortable></Column>
                <Column
                  field="description"
                  header="Description"
                  sortable
                ></Column>
                <Column
                  field="fabricColor"
                  header="Fabric Color"
                  sortable
                ></Column>
                <Column
                  field="pcs"
                  header="Pcs"
                  sortable
                  body={pcsTemplate}
                  className="with_input_field"
                ></Column>
                <Column
                  field="grossWeightKG"
                  header="Gross Weight KG"
                  body={grossWeightKGTemplate}
                  className="with_input_field"
                  sortable
                ></Column>
                <Column
                  field="nettWeight"
                  header="Nett Weight"
                  body={nettWeightTemplate}
                  className="with_input_field"
                  sortable
                ></Column>
                <Column
                  field="perBagWTGram"
                  header="PER BAG WT.GRM"
                  body={perBagWTGramTemplate}
                  className="with_input_field"
                  sortable
                ></Column>
              </DataTable>
            </div>
          </div>
          <Row className="mt-3 align-items-end">
            <Col sm={5}>
              <div className="form_group mb-3">
                <label htmlFor="Comment">Comment</label>
                <InputTextarea
                  id="Comment"
                  placeholder="Write Comment"
                  rows={4}
                />
              </div>
            </Col>
            <Col sm={7}>
              <Button
                className="btn_primary ms-auto mt-3"
                onClick={() => setPackageModal(false)}
              >
                Save
              </Button>
            </Col>
          </Row>
        </div>
      </Dialog> */}
      <Dialog
        header="Popular Industries"
        visible={popularIndustriesPopup}
        draggable={false}
        className="modal_Wrapper modal_large"
        onHide={() => setPopularIndustriesPopup(false)}
      >
        <div className="add_product_content_wrap">
          <div className="table_main_Wrapper bg-white">
            <div className="top_filter_wrap">
              <Row className="align-items-center">
                <Col sm={9}>
                  <Row>
                    <Col>
                      <h3>
                        Invoice No: <span className="invoice_no">0484</span>
                      </h3>
                      <p className="text_light m-0">
                        Bhatia Mobile Private Limited - Thane
                      </p>
                    </Col>
                    <Col>
                      <h4>
                        Date : <span className="d-block mt-2">14/04/2023 </span>
                      </h4>
                    </Col>
                  </Row>
                </Col>
                <Col sm={3}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li>
                        <Dropdown className="dropdown_common export_dropdown position-static">
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className="btn_border icon_btn"
                          >
                            <img src={ExportIcon} alt="" />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">PDF</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">XLS</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper cell_padding_large group_table_wrapper">
              <DataTable
                value={popularIndustriesData}
                sortMode="single"
                sortField="name"
                sortOrder={1}
                dataKey="id"
                rowGroupMode="subheader"
                groupRowsBy="group.product"
                footerColumnGroup={popularIndustriesGroup}
                rowGroupFooterTemplate={packageFooterGroup}
              >
                <Column field="srNo" header="Sr"></Column>
                <Column field="productCode" header="Product Code"></Column>
                <Column field="fabColor" header="Fab Color"></Column>
                <Column field="pcs" header="Pcs"></Column>
                <Column field="grossWeightKG" header="Gross Wt (KG)"></Column>
                <Column field="perBagWTGram" header="Per Bag Wt (Grm)"></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
