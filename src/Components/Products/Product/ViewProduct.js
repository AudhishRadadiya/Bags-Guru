import { getProductItem } from 'Services/Products/ProductService';
import {
  setIsGetInitialValuesProduct,
  setViewSelectedProductData,
} from 'Store/Reducers/Products/ProductSlice';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { getAllBagTagList } from 'Services/Products/BagService';

function ViewProduct() {
  const dispatch = useDispatch();
  const { product_id } = useParams();
  const [initialData, setInitialData] = useState({});

  // const { isGetInitialValuesProduct, viewSelectedProductData } = useSelector(
  //   ({ product }) => product,
  // );

  const handleSalesProductsItem = async () => {
    // dispatch(
    //   setIsGetInitialValuesProduct({
    //     ...isGetInitialValuesProduct,
    //     view: true,
    //   }),
    // );
    const res = await dispatch(getProductItem(product_id));
    const bagTagListRes = await dispatch(getAllBagTagList());
    setInitialData(res);
    dispatch(setViewSelectedProductData(res));
  };

  useEffect(() => {
    // if (isGetInitialValuesProduct?.view === true) {
    //   setInitialData(viewSelectedProductData);
    // } else {
    handleSalesProductsItem();
    // }
  }, []);

  return <ProductDetail initialValues={initialData} />;
}

export default ViewProduct;
