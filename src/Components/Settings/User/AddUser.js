import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import UserDetail from './UserDetail';
import { setIsGetInitialValuesUser } from 'Store/Reducers/Settings/User.slice';

export default function AddUser() {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const { userInitialValues, isGetInitialValuesUser, addSelectedUserData } =
    useSelector(({ user }) => user);

  useEffect(() => {
    if (isGetInitialValuesUser?.add === true) {
      setInitialData(addSelectedUserData);
    } else {
      dispatch(
        setIsGetInitialValuesUser({
          ...isGetInitialValuesUser,
          add: true,
        }),
      );
      setInitialData(userInitialValues);
    }
  }, []);

  return <UserDetail initialValues={initialData} />;
}
