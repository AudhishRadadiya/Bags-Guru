import React, { memo, useEffect, useState } from 'react';
import OrderDetail from './OrderDetail';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setIsGetInitialValuesOrder } from 'Store/Reducers/Sales/SalesOrderSlice';

const AddOrder = () => {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const { orderData, isGetInitialValuesOrder, addSelectedOrderData } =
    useSelector(({ salesOrder }) => salesOrder);

  useEffect(() => {
    if (isGetInitialValuesOrder?.add === true) {
      setInitialData(addSelectedOrderData);
    } else {
      dispatch(
        setIsGetInitialValuesOrder({
          ...isGetInitialValuesOrder,
          add: true,
        }),
      );
      setInitialData({
        ...orderData,
        address_list: [''],
      });
    }
  }, []);

  return <OrderDetail initialValues={initialData} />;
};

export default memo(AddOrder);
