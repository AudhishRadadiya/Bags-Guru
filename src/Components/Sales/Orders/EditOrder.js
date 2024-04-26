import React, { memo, useEffect, useState } from 'react';
import OrderDetail from './OrderDetail';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  setIsGetInitialValuesOrder,
  setUpdateSelectedOrderData,
} from 'Store/Reducers/Sales/SalesOrderSlice';
import { getSalesOrdersItem } from 'Services/Sales/OrderServices';
import { getSingleListParties } from 'Services/partiesService';

const EditOrder = () => {
  const { order_id } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});
  const { isGetInitialValuesOrder, updateSelectedOrderData } = useSelector(
    ({ salesOrder }) => salesOrder,
  );

  const handleSalesOrdersItem = async () => {
    let partiesData = {};

    dispatch(
      setIsGetInitialValuesOrder({
        ...isGetInitialValuesOrder,
        update: true,
      }),
    );
    const res = await dispatch(getSalesOrdersItem(order_id));
    const party_response = await dispatch(
      getSingleListParties(res?.party_name),
    );

    if (party_response) {
      const billingList = party_response?.party_address?.filter(
        x => x?.address_type_name === 'BILLING',
      );
      const shippingList = party_response?.party_address?.filter(
        x => x?.address_type_name !== 'BILLING',
      );

      const newBillingList = billingList?.filter(x =>
        res?.billing_address.includes(x?._id),
      );

      const newShippingList = shippingList?.filter(x =>
        res?.shipping_address.includes(x?._id),
      );

      // setAddressList(
      //   selectedOrder?.billing_address?.length >
      //     selectedOrder?.shipping_address?.length
      //     ? selectedOrder?.billing_address?.map(x => x)
      //     : selectedOrder?.shipping_address?.map(x => x),
      // );

      // setFieldValue('present_advisor', party_response.present_advisor);
      // setFieldValue('original_advisor', party_response.original_advisor);
      // setFieldValue(
      //   'present_advisor_name',
      //   party_response.present_advisor_name,
      // );
      // setFieldValue(
      //   'original_advisor_name',
      //   party_response.original_advisor_name,
      // );
      // setFieldValue('billing_address', newBillingList);
      // setFieldValue('shipping_address', newShippingList);

      partiesData = {
        billing_addrees_list: billingList,
        shipping_addrees_list: shippingList,
        billing_address: newBillingList,
        shipping_address: newShippingList,
        gst: party_response?.gst,
        present_advisor: party_response.present_advisor,
        original_advisor: party_response.original_advisor,
        present_advisor_name: party_response.present_advisor_name,
        original_advisor_name: party_response.original_advisor_name,
      };

      // dispatch(
      //   setUpdateSelectedOrderData({
      //     ...updateSelectedOrderData,
      //     [field_name]: field_value,
      //     shipping_address: newShippingList,
      //     billing_address: newBillingList,
      //     present_advisor: party_response.present_advisor,
      //     original_advisor: party_response.original_advisor,
      //     present_advisor_name: party_response.present_advisor_name,
      //     original_advisor_name: party_response.original_advisor_name,
      //   }),
      // );
    }
    // };

    let updated = { ...res };
    updated = {
      ...res,
      ...partiesData,
      address_list:
        res?.billing_address?.length > res?.shipping_address?.length
          ? res?.billing_address?.map(x => x)
          : res?.shipping_address?.map(x => x),
    };

    setInitialData(updated);
    dispatch(setUpdateSelectedOrderData(updated));
  };

  useEffect(() => {
    if (order_id) {
      if (isGetInitialValuesOrder?.update === true) {
        setInitialData(updateSelectedOrderData);
      } else {
        handleSalesOrdersItem();
      }
    }
  }, [dispatch]);

  return <OrderDetail initialValues={initialData} />;
};

export default memo(EditOrder);
