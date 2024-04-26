import { setIsGetInitialValuesProduct } from 'Store/Reducers/Products/ProductSlice';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ProductDetail from './ProductDetail';
import { getFullBagTagList } from 'Services/Products/BagService';

function AddProduct() {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesProduct, initialProduct, addSelectedProductData } =
    useSelector(({ product }) => product);

  useEffect(() => {
    if (isGetInitialValuesProduct?.add === true) {
      setInitialData(addSelectedProductData);
    } else {
      dispatch(getFullBagTagList('', {}));
      dispatch(
        setIsGetInitialValuesProduct({
          ...isGetInitialValuesProduct,
          add: true,
        }),
      );
      setInitialData(initialProduct);
    }
  }, []);

  return <ProductDetail initialValues={initialData} />;
}

export default AddProduct;
