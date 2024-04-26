import { saveToken } from 'Helper/AuthTokenHelper';
import { setAuthLoading, setCurrentUser } from 'Store/Reducers/Auth/auth.slice';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { roastError } from 'Helper/Common';
import { getUserPermissionList } from './baseService';
import { REACT_APP_APIURL } from 'Helper/Environment';

export const setLoginData = user_data => async (dispatch, getState) => {
  saveToken(user_data);
};

export const setUserCookies = user => async (dispatch, getState) => {
  const encryptData = CryptoJS.AES.encrypt(user, 'UserSecrets').toString();
  if (JSON.parse(user)?.remember_me) Cookies.set('user', encryptData);
};

/**
 * @desc Verify Email
 * @param payload (user)
 */
export const login = user => async dispatch => {
  try {
    if (user) {
      dispatch(setAuthLoading(true));
      const payload = { email_id: user.email, password: user.password };
      axios.defaults.baseURL = REACT_APP_APIURL;
      const response = await axios.post(`/login`, payload);
      const { msg, err, data } = response.data;

      if (err === 0) {
        toast.success(msg);
        dispatch(setCurrentUser(data));
        dispatch(setLoginData(data));
        dispatch(setUserCookies(JSON.stringify(user)));
        dispatch(getUserPermissionList());
        return data;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc Verify Forgot Password
 * @param payload (user)
 */
export const forgotPassword = user => async dispatch => {
  try {
    if (user) {
      dispatch(setAuthLoading(true));
      const payload = { email_id: user.email };

      const response = await axios.post(`/getOtp`, payload);
      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc Verify Email Verification
 * @param payload (user)
 */
export const emailVerification = user => async dispatch => {
  try {
    if (user) {
      dispatch(setAuthLoading(true));
      const payload = { email_id: user.email_id, otp: user.otp };

      const response = await axios.post(`/verifyOtp`, payload);
      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc Verify set Password
 * @param payload (user)
 */
export const setPassword = user => async dispatch => {
  try {
    if (user) {
      dispatch(setAuthLoading(true));
      const payload = {
        email_id: user.email,
        password: user.password,
        new_password: user.newPassword,
      };

      const response = await axios.post(`/forgotPassword`, payload);
      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};
/**
 * @desc Change Password
 * @param payload (Password)
 */
export const changePassword = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setAuthLoading(true));

      const response = await axios.post(`/changePassword`, payload);
      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc Get Own Profile
 */
export const getOwnProfile = () => async (dispatch, getState) => {
  const state = getState();
  const permission = state?.auth?.currentUser?.permission;

  try {
    dispatch(setAuthLoading(true));

    const response = await axios.get(`/view/profile`);
    const { msg, err, data } = response.data;
    const updated = {
      ...data,
      permission,
      dob: new Date(data.dob),
    };

    if (err === 0) {
      dispatch(setCurrentUser(updated));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc Logout the user
 */
export const logout = () => async dispatch => {
  try {
    // dispatch(setAuthLoading(true));
    const response = await axios.post(`/logout`);
    const { msg, err } = response.data;
    if (err === 0) {
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    // dispatch(setAuthLoading(false));
  }
};
