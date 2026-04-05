import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setIsGetInitialValuesProformaInvoice } from 'Store/Reducers/Sales/ProformaInvoiceSlice';
import ProformaInvoiceDetail from './ProformaInvoiceDetail';
import {
  getSingleListParties,
  getTransporterPartyList,
} from 'Services/partiesService';
import { getProductList } from 'Services/Products/ProductService';

export default function CreateProformaInvoice() {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const {
    proformaInvoiceData,
    addSelectedProformaInvoiceData,
    isGetInitialValuesProformaInvoice,
  } = useSelector(({ proformaInvoice }) => proformaInvoice);
  const { allFilters } = useSelector(({ common }) => common);
  const { productDataCurrentPage, productDataPageLimit } = allFilters?.proforma;

  const handlePartiesData = async salesdata => {
    let newBillingList = [];
    let newShippingList = [];
    let billingList = [];
    let shippingList = [];
    let presentAdvisor = '';
    let partiesData = {};

    if (salesdata?.party_name) {
      const parties_res = await dispatch(
        getSingleListParties(salesdata?.party_name),
      );

      partiesData = { ...parties_res };
      presentAdvisor = parties_res?.present_advisor;

      await dispatch(
        getProductList(productDataPageLimit, productDataCurrentPage),
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
      present_advisor: presentAdvisor,
      tripta_total_due: partiesData?.tripta_total_due,
      tripta_0_to_15_amount: partiesData?.tripta_0_to_15_amount,
      tripta_16_to_30_amount: partiesData?.tripta_16_to_30_amount,
      tripta_31_to_45_amount: partiesData?.tripta_31_to_45_amount,
      tripta_46_to_90_amount: partiesData?.tripta_46_to_90_amount,
      tripta_above_90_amount: partiesData?.tripta_above_90_amount,
      tripta_last_updated_date: partiesData?.tripta_last_updated_date,
    };
  };

  const handleProformaInvoiceItemFirstPhase = () => {
    dispatch(getProductList(productDataPageLimit, productDataCurrentPage));
    dispatch(getTransporterPartyList());
    dispatch(
      setIsGetInitialValuesProformaInvoice({
        ...isGetInitialValuesProformaInvoice,
        add: true,
      }),
    );
    setInitialData(proformaInvoiceData);
  };

  const handleProformaInvoiceItemSecondPhase = async () => {
    const partiesData = await handlePartiesData(addSelectedProformaInvoiceData);
    const updatedObj = {
      ...addSelectedProformaInvoiceData,
      ...partiesData,
    };
    setInitialData(updatedObj);
  };

  useEffect(() => {
    if (isGetInitialValuesProformaInvoice?.add === true) {
      handleProformaInvoiceItemSecondPhase();
    } else {
      handleProformaInvoiceItemFirstPhase();
    }
  }, []);

  return <ProformaInvoiceDetail initialValues={initialData} />;
}
