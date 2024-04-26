import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import PurchaseOrderDetail from './PurchaseOrderDetail';
import {
  setAddSelectedPurchaseOrderData,
  setIsGetInitialValuesPurchaseOrder,
} from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import { getCompanyDetails } from 'Services/Settings/companyService';
import { getJobForPurchaseOrderList } from 'Services/Purchase/purchaseOrderService';

function AddPurchaseOrder() {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const {
    initialPurchaseOrder,
    addSelectedPurchaseOrderData,
    isGetInitialValuesPurchaseOrder,
  } = useSelector(({ purchaseOrder }) => purchaseOrder);

  const handleCompanyDetails = async () => {
    let addCompanyData = {};

    const from_job_res = await dispatch(getJobForPurchaseOrderList());
    const company_res = await dispatch(getCompanyDetails());

    if (company_res?.company_address?.length > 0) {
      const newAddress = company_res?.company_address?.map(x => {
        return {
          ...x,
          label: x?.location_name,
          value: x?._id,
        };
      });
      const billingList = newAddress?.filter(
        x => x?.address_type_name?.toLowerCase() === 'billing',
      );
      const shippingList = newAddress?.filter(
        x => x?.address_type_name?.toLowerCase() === 'shipping',
      );

      addCompanyData = {
        company_address: newAddress,
        billing_list: billingList,
        shipping_list: shippingList,
        company_name: company_res?.company_name,
        job_for_POList: from_job_res,
      };
    }

    return addCompanyData;
  };

  const handleAddPurchaseOrderFirstPhase = async () => {
    dispatch(
      setIsGetInitialValuesPurchaseOrder({
        ...isGetInitialValuesPurchaseOrder,
        add: true,
      }),
    );

    // ** Note:- handleCompanyDetails is using for getting updated company details
    const purchaseAddCompanyDetails = await handleCompanyDetails();
    const updatedData = {
      ...initialPurchaseOrder,
      ...purchaseAddCompanyDetails,
      ship_to_address: [{ ...purchaseAddCompanyDetails?.shipping_list?.[0] }],
      bill_to_address: [{ ...purchaseAddCompanyDetails?.billing_list?.[0] }],
      bill_to: purchaseAddCompanyDetails?.billing_list?.[0]?._id,
      ship_to: purchaseAddCompanyDetails?.shipping_list?.[0]?._id,
      bill_to_location:
        purchaseAddCompanyDetails?.billing_list?.[0]?.location_name,
      ship_to_location:
        purchaseAddCompanyDetails?.shipping_list?.[0]?.location_name,
      gsmTable_viewList: [],
      item_data: [],
      prePrintedTable_viewList: [],
      prePrintedTable_headerList: {},
      selected_itemList: [],
    };

    setInitialData(updatedData);
    dispatch(setAddSelectedPurchaseOrderData(updatedData));
  };

  const handleAddPurchaseOrderSecondPhase = async () => {
    // ** Note:- handleCompanyDetails is using for getting updated company details
    const purchaseAddCompanyDetails = await handleCompanyDetails();
    const updatedData = {
      ...addSelectedPurchaseOrderData,
      ...purchaseAddCompanyDetails,
    };
    setInitialData(updatedData);
  };

  useEffect(() => {
    if (isGetInitialValuesPurchaseOrder?.add === true) {
      handleAddPurchaseOrderSecondPhase();
    } else {
      handleAddPurchaseOrderFirstPhase();
    }
  }, []);

  return <PurchaseOrderDetail initialValues={initialData} />;
}

export default AddPurchaseOrder;
