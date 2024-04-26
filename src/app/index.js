import { Helmet } from 'react-helmet-async';
import Routes from 'routes/index';
import { BrowserRouter } from 'react-router-dom';
import '../Assets/scss/Style.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import { clearToken, setAuthToken } from 'Helper/AuthTokenHelper';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  getCurrentUserFromLocal,
  getMainModuleWithSubModule,
  getUserPermissionList,
  getUserRolesList,
} from 'Services/baseService';
import { getOwnProfile } from 'Services/authService';
import { setCurrentUser } from 'Store/Reducers/Auth/auth.slice';
import { REACT_APP_APIURL } from 'Helper/Environment';
import io from 'socket.io-client';
import PurchaseEntryProgress from 'Components/Common/PurchaseEntryProgress';
import { useSelector } from 'react-redux';
import { setPurchaseEntryList } from 'Store/Reducers/Purchase/PurchaseEntryProgressSlice';
import { socketDataSend } from 'Components/Common/Socket/SocketComponent';

export const socket = io.connect(process.env.REACT_APP_SOCKET_URL);

axios.defaults.baseURL = REACT_APP_APIURL;
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const { status } = error?.response?.data || {};
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
