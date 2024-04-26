import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserDetail from './UserDetail';
import { getSingleUser } from 'Services/Settings/userService';
import {
  setIsGetInitialValuesUser,
  setViewSelectedUsertData,
} from 'Store/Reducers/Settings/User.slice';

const ViewUser = () => {
  const { user_id } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});

  // const { isGetInitialValuesUser, viewSelectedUserData } = useSelector(
  //   ({ user }) => user,
  // );

  const handleUserData = async () => {
    // dispatch(
    //   setIsGetInitialValuesUser({
    //     ...isGetInitialValuesUser,
    //     view: true,
    //   }),
    // );

    const user_response = await dispatch(getSingleUser(user_id));
    setInitialData(user_response);
    // dispatch(setViewSelectedUsertData(user_response));
  };

  useEffect(() => {
    if (user_id) {
      // if (isGetInitialValuesUser?.view === true) {
      //   setInitialData(viewSelectedUserData);
      // } else {
      handleUserData();
      // }
    }
  }, []);

  return <UserDetail initialValues={initialData} />;
};

export default ViewUser;
