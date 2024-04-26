import { getProductItem } from 'Services/Products/ProductService';
import {
  setDupicateSelectedProductData,
  setIsGetInitialValuesProduct,
} from 'Store/Reducers/Products/ProductSlice';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { getFullBagTagList } from 'Services/Products/BagService';

function DuplicateProduct() {
  const dispatch = useDispatch();
  const { product_id } = useParams();
  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesProduct, dupicateSelectedProductData } =
    useSelector(({ product }) => product);

  const handleSalesProductsItem = async () => {
    dispatch(
      setIsGetInitialValuesProduct({
        ...isGetInitialValuesProduct,
        duplicate: true,
      }),
    );
    dispatch(getFullBagTagList('', {}));
    const res = await dispatch(getProductItem(product_id, true));
    setInitialData(res);
    dispatch(setDupicateSelectedProductData(res));
  };

  useEffect(() => {
    if (isGetInitialValuesProduct?.duplicate === true) {
      setInitialData(dupicateSelectedProductData);
    } else {
      handleSalesProductsItem();
    }
  }, []);

  return <ProductDetail initialValues={initialData} />;
}

export default DuplicateProduct;
