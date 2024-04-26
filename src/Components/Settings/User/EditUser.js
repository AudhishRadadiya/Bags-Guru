import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserDetail from './UserDetail';
import { getSingleUser } from 'Services/Settings/userService';
import {
  setIsGetInitialValuesUser,
  setUpdateSelectedUserData,
} from 'Store/Reducers/Settings/User.slice';

const EditUser = () => {
  const { user_id } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesUser, updateSelectedUserData } = useSelector(
    ({ user }) => user,
  );

  const handleUserData = async () => {
    dispatch(
      setIsGetInitialValuesUser({
        ...isGetInitialValuesUser,
        update: true,
      }),
    );

    const user_response = await dispatch(getSingleUser(user_id));
    setInitialData(user_response);
    dispatch(setUpdateSelectedUserData(user_response));
  };

  useEffect(() => {
    if (user_id) {
      if (isGetInitialValuesUser?.update === true) {
        setInitialData(updateSelectedUserData);
      } else {
        handleUserData();
      }
    }
  }, []);

  return <UserDetail initialValues={initialData} />;
};

export default EditUser;
