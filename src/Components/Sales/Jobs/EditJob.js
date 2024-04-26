import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  setIsGetInitialValuesJob,
  setUpdateSelectedJobData,
} from 'Store/Reducers/Sales/SalesOrderSlice';
import JobDetail from './JobDetail';
import { getJobItem } from 'Services/Sales/OrderServices';
import { getProductList } from 'Services/Products/ProductService';
import { convertIntoNumber } from 'Helper/Common';

function EditJob() {
  const { job_id } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});
  const { isGetInitialValuesJob, updateSelectedJobData } = useSelector(
    ({ salesOrder }) => salesOrder,
  );
  const { allProductList } = useSelector(({ product }) => product);

  //   useEffect(() => {
  //     // if (
  //     //   job_id &&
  //     //   Object.keys(salesJobOrderDetail)?.length > 0 &&
  //     //   allProductList?.length > 0
  //     // ) {
  //     //   let product = allProductList?.filter(
  //     //     data => data?._id === salesJobOrderDetail?.product_id,
  //     //   );
  //     //   setSelectProduct(product[0]);
  //     //   setOrderId(salesJobOrderDetail?.salesOrder_id);
  //       setJobValue({
  //         ...salesJobOrderDetail,
  //         // product_id: salesJobOrderDetail?.product_id,
  //         // qty: salesJobOrderDetail.qty,
  //         rate:
  //           salesJobOrderDetail.unit_pc === 1 ? salesJobOrderDetail?.rate : '',
  //         amount:
  //           salesJobOrderDetail.unit_pc === 1 ? salesJobOrderDetail?.amount : 0,
  //         qty_kg: salesJobOrderDetail.kg_qty,
  //         rate_kg:
  //           salesJobOrderDetail.unit_pc === 0 ? salesJobOrderDetail?.rate : '',
  //         amount_kg:
  //           salesJobOrderDetail.unit_pc === 0 ? salesJobOrderDetail?.amount : 0,
  //         // final_amount: salesJobOrderDetail?.final_amount,
  //         due_date: salesJobOrderDetail?.due_date
  //           ? new Date(salesJobOrderDetail?.due_date)
  //           : '',
  //       });
  //     }
  //   }, [allProductList, job_id, salesJobOrderDetail]);

  const handleSalesJobsItem = async () => {
    dispatch(
      setIsGetInitialValuesJob({
        ...isGetInitialValuesJob,
        update: true,
      }),
    );
    dispatch(getProductList(0, 0));
    const response = await dispatch(getJobItem(job_id));

    let updated = { ...response };

    const pcsTaxableAmount =
      (response.unit_pc === 1 ? response?.amount : 0) -
      convertIntoNumber(response?.discount) +
      convertIntoNumber(response?.stereo_charge) +
      convertIntoNumber(response?.freight_inclusive_rate);

    const kgsTaxableAmount =
      (response.unit_pc === 0 ? response?.amount : 0) -
      convertIntoNumber(response?.discount) +
      convertIntoNumber(response?.stereo_charge) +
      convertIntoNumber(response?.freight_inclusive_rate);

    if (response) {
      updated = {
        ...response,
        rate: response.unit_pc === 1 ? response?.rate : '',
        amount: response.unit_pc === 1 ? response?.amount : 0,
        pcs_taxable_amount: pcsTaxableAmount,
        kgs_taxable_amount: kgsTaxableAmount,
        qty_kg: response.kg_qty,
        rate_kg: response.unit_pc === 0 ? response?.rate : '',
        amount_kg: response.unit_pc === 0 ? response?.amount : 0,
        due_date: response?.due_date
          ? new Date(response?.due_date)
          : new Date(),
        sales_order_id: response?.salesOrder_id,
        //   order_id: response?.salesOrder_id ? response?.salesOrder_id : '',
      };
    }

    setInitialData(updated);
    dispatch(setUpdateSelectedJobData(updated));
  };

  useEffect(() => {
    if (job_id) {
      if (isGetInitialValuesJob?.update === true) {
        setInitialData(updateSelectedJobData);
      } else {
        handleSalesJobsItem();
      }
    }
  }, [dispatch]);

  return <JobDetail initialValues={initialData} />;
}

export default EditJob;
