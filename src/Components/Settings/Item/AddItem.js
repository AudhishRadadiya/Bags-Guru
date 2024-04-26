import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ItemDetail from './ItemDetail';
import { setIsGetInitialValuesItem } from 'Store/Reducers/Settings/RawItemSlice';

export default function AddItem() {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const { initialRawItemData, isGetInitialValuesItem, addSelectedItemData } =
    useSelector(({ rawitem }) => rawitem);

  useEffect(() => {
    if (isGetInitialValuesItem?.add === true) {
      setInitialData(addSelectedItemData);
    } else {
      dispatch(
        setIsGetInitialValuesItem({
          ...isGetInitialValuesItem,
          add: true,
        }),
      );
      setInitialData(initialRawItemData);
    }
  }, []);

  return <ItemDetail initialValues={initialData} />;
}
