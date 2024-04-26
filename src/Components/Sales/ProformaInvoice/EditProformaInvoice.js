import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  setIsGetInitialValuesProformaInvoice,
  setUpdateSelectedProformaInvoiceData,
} from 'Store/Reducers/Sales/ProformaInvoiceSlice';
import ProformaInvoiceDetail from './ProformaInvoiceDetail';
import { getProformaDetail } from 'Services/Sales/ProformaService';
import moment from 'moment';
import {
  getSingleListParties,
  getTransporterPartyList,
} from 'Services/partiesService';
import { convertIntoNumber } from 'Helper/Common';
import { getProductList } from 'Services/Products/ProductService';

export default function EditProformaInvoice() {
  const { proformaId } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});

  const {
    isGetInitialValuesProformaInvoice,
    updateSelectedProformaInvoiceData,
  } = useSelector(({ proformaInvoice }) => proformaInvoice);
  const { allFilters } = useSelector(({ common }) => common);
  const { productDataCurrentPage, productDataPageLimit } = allFilters?.proforma;

  const handlePartiesData = async salesdata => {
    let newBillingList = [];
    let newShippingList = [];
    let billingList = [];
    let shippingList = [];

    await dispatch(
      getProductList(productDataPageLimit, productDataCurrentPage),
    );

    if (salesdata?.party_name) {
      const parties_res = await dispatch(
        getSingleListParties(salesdata?.party_name),
      );

      billingList = parties_res?.party_address?.filter(
        x => x?.address_type_name === 'BILLING',
      );
      shippingList = parties_res?.party_address?.filter(
        x => x?.address_type_name !== 'BILLING',
      );

      if (
        Array.isArray(salesdata?.billing_address) &&
        salesdata?.billing_address?.every(item => typeof item !== 'string')
      ) {
        const upated = billingList?.filter(data => {
          return salesdata?.billing_address?.some(
            item => data?._id === item?._id,
          );
        });

        newBillingList = upated;
      } else {
        newBillingList = billingList?.filter(x =>
          salesdata?.billing_address.includes(x?._id),
        );
      }

      if (
        Array.isArray(salesdata?.shipping_address) &&
        salesdata?.shipping_address?.every(item => typeof item !== 'string')
      ) {
        const upated = shippingList?.filter(data => {
          return salesdata?.shipping_address?.some(
            item => data?._id === item?._id,
          );
        });
        newShippingList = upated;
      } else {
        newShippingList = shippingList?.filter(x =>
          salesdata?.shipping_address.includes(x?._id),
        );
      }
    }

    return {
      billing_addrees_list: billingList,
      shipping_addrees_list: shippingList,
      billing_address: newBillingList,
      shipping_address: newShippingList,
    };
  };

  const handleProformaInvoiceItemFirstPhase = async () => {
    let table_data = [];
    let selected_trasporter = {};
    // let partiesData = {};

    dispatch(
      setIsGetInitialValuesProformaInvoice({
        ...isGetInitialValuesProformaInvoice,
        update: true,
      }),
    );
    const transporter_res = await dispatch(getTransporterPartyList());
    const res = await dispatch(getProformaDetail(proformaId));
    const partiesData = await handlePartiesData(res);

    // if (parties_res) {
    //   const billingList = parties_res?.party_address?.filter(
    //     x => x?.address_type_name === 'BILLING',
    //   );
    //   const shippingList = parties_res?.party_address?.filter(
    //     x => x?.address_type_name !== 'BILLING',
    //   );
    //   const newBillingList = billingList?.filter(x =>
    //     res?.billing_address?.includes(x?._id),
    //   );

    //   const newShippingList = shippingList?.filter(x =>
    //     res?.shipping_address?.includes(x?._id),
    //   );

    //   partiesData = {
    //     billing_addrees_list: billingList,
    //     shipping_addrees_list: shippingList,
    //     billing_address: newBillingList,
    //     shipping_address: newShippingList,
    //   };
    // }
    if (res?.proforma_item) {
      table_data = res?.proforma_item?.map(i => {
        return {
          ...i,
          product_id: i?.product_id,
          remark: i?.remark,
          hsn: i?.hsn,
          is_rate_per_kg: i?.is_rate_per_kg,
          main_image: i?.product_image,
          pcs: convertIntoNumber(i?.qty),
          rate: i?.is_rate_per_kg ? '' : i?.rate,
          weight: i?.kg_qty,
          kg_rate: i?.is_rate_per_kg ? i?.rate : '',
          charge: convertIntoNumber(i?.charge),
          discount: convertIntoNumber(i?.discount),
          amount: i?.total_amount ? convertIntoNumber(i?.total_amount) : 0,
          tax_percentage: convertIntoNumber(i?.tax_percentage),
          final_amount: i?.final_amount
            ? convertIntoNumber(i?.final_amount)
            : 0,
          // final_amount: i?.total_amount
          //   ? convertIntoNumber(i?.total_amount) + convertIntoNumber(i?.charge)
          //   : 0,
          gst_amount:
            ((i?.total_amount ? convertIntoNumber(i?.total_amount) : 0) *
              convertIntoNumber(i?.tax_percentage)) /
            100,
        };
      });
    }

    if (res?.transporter) {
      const selectedTrasporter = transporter_res?.find(
        data => data?._id === res?.transporter,
      );

      selected_trasporter = selectedTrasporter;
    }

    const updated = {
      ...res,
      ...partiesData,
      invoice_date: new Date(moment(res?.invoice_date, 'DD-MM-YYYY').format()),
      streo_charge: res?.final_stereo_charge
        ? res?.final_stereo_charge?.toFixed(2)
        : '0.00',
      proforma_item: table_data,
      transporter_gst: selected_trasporter?.gst || '',
      transporter_phone_no: selected_trasporter?.personal_contact_no || '',
    };

    setInitialData(updated);
    dispatch(setUpdateSelectedProformaInvoiceData(updated));
  };

  const handleProformaInvoiceItemSecondPhase = async () => {
    const partiesData = await handlePartiesData(
      updateSelectedProformaInvoiceData,
    );
    const updatedObj = {
      ...updateSelectedProformaInvoiceData,
      ...partiesData,
    };

    setInitialData(updatedObj);
  };

  useEffect(() => {
    if (proformaId) {
      if (isGetInitialValuesProformaInvoice?.update === true) {
        handleProformaInvoiceItemSecondPhase();
      } else {
        handleProformaInvoiceItemFirstPhase();
      }
    }
  }, []);

  return <ProformaInvoiceDetail initialValues={initialData} />;
}
