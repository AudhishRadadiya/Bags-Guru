import axios from 'axios';
import { toast } from 'react-toastify';
import {
  setGCLoading,
  setSingleListGC,
} from 'Store/Reducers/Settings/GeneralConfigurationSlice';

/**
 * @desc get single list general configuration
 * @param payload (general configuration)
 */
export const getSingleListGC = partiesId => async dispatch => {
  try {
    dispatch(setGCLoading(true));
    const response = await axios.get('configuration/view');
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setSingleListGC(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setGCLoading(false));
  }
};

/**
 * @desc update general configuration
 * @param payload (general configuration)
 */
export const updateGeneralConfiguration = data => async dispatch => {
  try {
    if (data) {
      dispatch(setGCLoading(true));

      const response = await axios.post(`configuration/save`, data);

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
    dispatch(setGCLoading(false));
  }
};
