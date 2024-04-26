import { convertIntoNumber } from 'Helper/Common';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import SalesInvoiceDetail from './SalesInvoiceDetail';
import {
  setIsGetInitialValuesSalesInvoice,
  setViewSelectedSalesInvoiceData,
} from 'Store/Reducers/Sales/SalesInvoiceSlice';
import {
  getSingleListParties,
  getTransporterPartyList,
} from 'Services/partiesService';
import {
  getSalesInvoiceDetail,
  salesOrderJobByParty,
} from 'Services/Sales/SalesInvoiceServices';

export default function EditSalesInvoice() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});

  // const { isGetInitialValuesSalesInvoice, viewSelectedSalesInvoiceData } =
  //   useSelector(({ salesInvoice }) => salesInvoice);

  const handlePartiesData = async salesdata => {
    let newBillingList = [];
    let newShippingList = [];
    let billingList = [];
    let shippingList = [];

    if (salesdata?.party_name) {
      const parties_res = await dispatch(
        getSingleListParties(salesdata?.party_name),
      );
      await dispatch(salesOrderJobByParty(salesdata?.party_name, ''));

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

  const handleSalesInvoiceItemFirstPhase = async () => {
    let table_data = [];
    let selected_trasporter = {};
    // let selected_jobOrder_data = [];
    // let partiesData = {};

    // dispatch(
    //   setIsGetInitialValuesSalesInvoice({
    //     ...isGetInitialValuesSalesInvoice,
    //     view: true,
    //   }),
    // );

    const transporter_res = await dispatch(getTransporterPartyList());
    const res = await dispatch(getSalesInvoiceDetail(id));
    // const parties_res = await dispatch(getSingleListParties(res?.party_name));
    const partiesData = await handlePartiesData(res);

    // const orderJobByParty_res = await dispatch(
    //   salesOrderJobByParty(res?.party_name, ''),
    // );

    // if (parties_res) {
    //   const billingList = parties_res?.party_address?.filter(
    //     x => x?.address_type_name === 'BILLING',
    //   );
    //   const shippingList = parties_res?.party_address?.filter(
    //     x => x?.address_type_name !== 'BILLING',
    //   );
    //   const newBillingList = billingList?.filter(x =>
    //     res?.billing_address.includes(x?._id),
    //   );

    //   const newShippingList = shippingList?.filter(x =>
    //     res?.shipping_address.includes(x?._id),
    //   );
    //   partiesData = {
    //     billing_addrees_list: billingList,
    //     shipping_addrees_list: shippingList,
    //     billing_address: newBillingList,
    //     shipping_address: newShippingList,
    //   };
    // }

    if (res?.sales_invoice_item) {
      table_data = res?.sales_invoice_item?.map(i => {
        let qty_value = 0;
        let weight_value = 0;

        if (i?.warehouse?.length) {
          const warehouseData = i?.warehouse?.find(
            i => i?._id === res?.warehouse_id,
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
          pcs: convertIntoNumber(i?.qty),
          weight: i?.kg_qty,
          charge: convertIntoNumber(i?.charge),
          discount: convertIntoNumber(i?.discount),
          amount: i?.total_amount ? convertIntoNumber(i?.total_amount) : 0,
          tax_percentage: i?.tax_percentage,
          final_amount: i?.final_amount ? Math.round(i?.final_amount) : 0,
          available_qty: qty_value,
          available_weight: weight_value,
          product_code: i?.product_code,
          // warehouse_id: i?.warehouse_id,
          // warehouse: warehouseOption,
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
      sales_item: table_data,
      transporter_gst: selected_trasporter?.gst || '',
      transporter_phone_no: selected_trasporter?.personal_contact_no || '',
      warehouse: res?.warehouse_id,
    };
    setInitialData(updated);
    // dispatch(setViewSelectedSalesInvoiceData(updated));
  };

  // const handleSalesInvoiceItemSecondPhase = async () => {
  //   // ** // handlePartiesData is using for getting updated parties data:
  //   const partiesData = await handlePartiesData(viewSelectedSalesInvoiceData);
  //   const updatedObj = {
  //     ...viewSelectedSalesInvoiceData,
  //     ...partiesData,
  //   };
  //   setInitialData(updatedObj);
  // };

  useEffect(() => {
    if (id) {
      // if (isGetInitialValuesSalesInvoice?.view === true) {
      //   handleSalesInvoiceItemSecondPhase();
      // } else {
      handleSalesInvoiceItemFirstPhase();
      // }
    }
  }, []);

  return <SalesInvoiceDetail initialValues={initialData} />;
}
