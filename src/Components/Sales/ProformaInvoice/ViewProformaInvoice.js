import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProformaInvoiceDetail from './ProformaInvoiceDetail';
import { getSingleListParties } from 'Services/partiesService';
import { getProformaDetail } from 'Services/Sales/ProformaService';

export default function ViewProformaInvoice() {
  const { proformaId } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});

  // const { isGetInitialValuesProformaInvoice, viewSelectedProformaInvoiceData } =
  //   useSelector(({ proformaInvoice }) => proformaInvoice);
  // const { allFilters } = useSelector(({ common }) => common);
  // const { productDataCurrentPage, productDataPageLimit } = allFilters?.proforma;

  const handlePartiesData = async salesdata => {
    let newBillingList = [];
    let newShippingList = [];
    let billingList = [];
    let shippingList = [];

    // await dispatch(
    //   getProductList(productDataPageLimit, productDataCurrentPage),
    // );

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
    // let partiesData = {};
    // dispatch(
    //   setIsGetInitialValuesProformaInvoice({
    //     ...isGetInitialValuesProformaInvoice,
    //     view: true,
    //   }),
    // );

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
    }

    const updated = {
      ...res,
      ...partiesData,
      invoice_date: new Date(moment(res?.invoice_date, 'DD-MM-YYYY').format()),
      streo_charge: res?.final_stereo_charge
        ? res?.final_stereo_charge?.toFixed(2)
        : '0.00',
      proforma_item: table_data,
    };
    setInitialData(updated);
    // dispatch(setViewSelectedProformaInvoiceData(updated));
  };

  // const handleProformaInvoiceItemSecondPhase = async () => {
  //   // ** // handlePartiesData is using for getting updated parties data:
  //   const partiesData = await handlePartiesData(
  //     viewSelectedProformaInvoiceData,
  //   );
  //   const updatedObj = {
  //     ...viewSelectedProformaInvoiceData,
  //     ...partiesData,
  //   };

  //   setInitialData(updatedObj);
  // };

  useEffect(() => {
    if (proformaId) {
      // if (isGetInitialValuesProformaInvoice?.view === true) {
      //   handleProformaInvoiceItemSecondPhase();
      // } else {
      handleProformaInvoiceItemFirstPhase();
      // }
    }
  }, []);

  return <ProformaInvoiceDetail initialValues={initialData} />;
}
