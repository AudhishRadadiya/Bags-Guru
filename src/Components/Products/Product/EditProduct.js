import React, { useEffect, useState } from 'react';
import ProductDetail from './ProductDetail';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  setIsGetInitialValuesProduct,
  setUpdateSelectedProductData,
} from 'Store/Reducers/Products/ProductSlice';
import { useParams } from 'react-router-dom';
import { getProductItem } from 'Services/Products/ProductService';
import { getFullBagTagList } from 'Services/Products/BagService';

function EditProduct() {
  const dispatch = useDispatch();
  const { product_id } = useParams();
  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesProduct, updateSelectedProductData } = useSelector(
    ({ product }) => product,
  );

  const handleSalesProductsItem = async () => {
    dispatch(
      setIsGetInitialValuesProduct({
        ...isGetInitialValuesProduct,
        update: true,
      }),
    );

    const bagTagListRes = await dispatch(getFullBagTagList('', {}));
    const response = await dispatch(getProductItem(product_id));

    setInitialData(response);
    dispatch(setUpdateSelectedProductData(response));
  };

  useEffect(() => {
    if (isGetInitialValuesProduct?.update === true) {
      setInitialData(updateSelectedProductData);
    } else {
      handleSalesProductsItem();
    }
  }, []);

  return <ProductDetail initialValues={initialData} />;
}

export default EditProduct;
