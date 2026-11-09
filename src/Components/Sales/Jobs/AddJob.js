import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setIsGetInitialValuesJob } from 'Store/Reducers/Sales/SalesOrderSlice';
import JobDetail from './JobDetail';
import { getAllProductList } from 'Services/Products/ProductService';

export default function AddJob() {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const { jobInitialValues, isGetInitialValuesJob, addSelectedJobData } =
    useSelector(({ salesOrder }) => salesOrder);

  useEffect(() => {
    if (isGetInitialValuesJob?.add === true) {
      setInitialData(addSelectedJobData);
    } else {
      dispatch(getAllProductList(0, 0));
      dispatch(
        setIsGetInitialValuesJob({
          ...isGetInitialValuesJob,
          add: true,
        }),
      );
      setInitialData(jobInitialValues);
    }
  }, []);

  return <JobDetail initialValues={initialData} />;
}
