import { useEffect } from 'react';
import axios from 'axios';
import Routes from 'routes/index';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import {
  clearToken,
  setAuthToken,
  setVerificationSessionData,
} from 'Helper/AuthTokenHelper';
import {
  getCurrentUserFromLocal,
  getMainModuleWithSubModule,
  getUserPermissionList,
  getUserRolesList,
} from 'Services/baseService';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { getOwnProfile } from 'Services/authService';
import { REACT_APP_APIURL } from 'Helper/Environment';
import { setCurrentUser } from 'Store/Reducers/Auth/auth.slice';
import { socketDataSend } from 'Components/Common/Socket/SocketComponent';
import PurchaseEntryProgress from 'Components/Common/PurchaseEntryProgress';
import { setPurchaseEntryList } from 'Store/Reducers/Purchase/PurchaseEntryProgressSlice';

import '../Assets/scss/Style.scss';
import 'react-quill/dist/quill.snow.css';
import 'react-loading-skeleton/dist/skeleton.css';

export const socket = io.connect(process.env.REACT_APP_SOCKET_URL);

axios.defaults.baseURL = REACT_APP_APIURL;
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const { status, data } = error?.response?.data || {};

    if (status === 401) {
      clearToken();
      window.location.href = '/';
      toast.error('Access Token is not valid or has expired');
    } else if (status === 406 || status === 404) {
      clearToken();
      window.location.href = '/';
      toast.error(
        'Your account is deactivated by admin. Please contact your admin.',
      );
    } else if (status === 403) {
      clearToken();

      const payload = {
        email: data?.email,
        code: data?.code,
      };

      setVerificationSessionData(payload);

      window.location.href = '/email-verification';
    }
    return Promise.reject(error);
  },
);

export function App() {
  const dispatch = useDispatch();

  const { purchaseEntryList } = useSelector(
    ({ PurchaseEntryProgress }) => PurchaseEntryProgress,
  );

  const UserPreferences = getCurrentUserFromLocal();
  if (UserPreferences) {
    setAuthToken(UserPreferences?.token);
  }

  // ** // This code use for dev tool open to prevent.
  // const handleKeyDown = useCallback(event => {
  //   if (event?.keyCode === 123) {
  //     event.preventDefault();
  //   } else if (event?.ctrlKey && event?.shiftKey && event?.keyCode === 73) {
  //     event.preventDefault();
  //   }
  // }, []);

  // document.addEventListener('keydown', handleKeyDown);

  useEffect(() => {
    const UserPreferencesData = getCurrentUserFromLocal();
    if (UserPreferencesData?.token) {
      // setAuthToken(UserPreferencesData?.token);
      dispatch(getUserPermissionList());
      dispatch(getUserRolesList());
      dispatch(getMainModuleWithSubModule());
      dispatch(setCurrentUser(UserPreferencesData));
      dispatch(getOwnProfile());
    }
  }, [dispatch]);

  useEffect(() => {
    if (UserPreferences?._id && socket.connected) {
      socketDataSend(UserPreferences?._id);
    }

    socket.on('connect', () => {
      socketDataSend(UserPreferences?._id);
    });

    socket.on('disconnect', () => {
      // console.log('socket disconnected');
    });
  }, [UserPreferences]);

  useEffect(() => {
    const handleUpdateStatus = data => {
      if (Object.keys(data).length > 0) {
        let updatedList = purchaseEntryList?.map(d => {
          if (d?.id === data?.upload_id) {
            return {
              ...d,
              count: (data?.count * 100) / d?.total,
            };
          } else {
            return d;
          }
        });
        dispatch(setPurchaseEntryList(updatedList));
      }
    };
    socket.on('updateStatus', handleUpdateStatus);
    return () => {
      socket.off('updateStatus', handleUpdateStatus);
    };
  }, [dispatch, purchaseEntryList]);

  useEffect(() => {
    const handleCompleteProcess = data => {
      let updatedList = purchaseEntryList?.filter(d => d.id !== data.id);
      dispatch(setPurchaseEntryList(updatedList));
      toast.success('Your Data has been uploaded successfully');
    };
    socket.on('completeProcess', handleCompleteProcess);
    return () => {
      socket.off('completeProcess', handleCompleteProcess);
    };
  }, [dispatch, purchaseEntryList]);

  return (
    <BrowserRouter>
      {/* <Suspense fallback={<Loader />}> */}
      <Helmet titleTemplate="%s - BagsGuru" defaultTitle="Bags Guru - ERP">
        <meta name="description" content="Bags Guru - ERP" />
      </Helmet>
      {purchaseEntryList?.length > 0 && UserPreferences && (
        <PurchaseEntryProgress />
      )}
      {/* <SocketComponent /> */}
      <Routes />
      {/* </Suspense> */}
    </BrowserRouter>
  );
}
