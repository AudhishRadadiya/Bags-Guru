import axios from 'axios';
import { roastError } from 'Helper/Common';
import { toast } from 'react-toastify';
import {
  setTriptaAmountList,
  setTriptaAmountListCommonData,
  setTriptaAmountLoading,
  setTriptsUploadLoading,
} from 'Store/Reducers/TriptaAmount/TriptaAmountSlice';

/**
 * @desc  Upload Collection File
 */
export const uploadTriptaFile =
  ({ file, date }) =>
  async dispatch => {
    try {
      dispatch(setTriptsUploadLoading(true));
      if (file) {
        let body = new FormData();
        body.append('file', file);
        body.append('last_updated_date', date);
        const headers = { 'Content-Type': 'multipart/form-data' };

        const response = await axios.post(`/upload/tripta_collection`, body, {
          headers: headers,
        });
        const { data, err, msg } = response.data;

        if (err === 0) {
          toast.success(msg);
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
      dispatch(setTriptsUploadLoading(false));
    }
  };

/**
 * @desc Get Collection List
 */

export const getTriptaAmountList =
  (limit = 30, start = 1, query = '', field_filter) =>
  async dispatch => {
    try {
      dispatch(setTriptaAmountLoading(true));
      const response = await axios.post(
        `list/tripta_collection/${start}/${limit}`,
        {
          search: query,
          field_filter: field_filter,
        },
      );
      const { msg, err, data } = response.data;
      const { list, ...rest } = data;

      if (err === 0) {
        dispatch(setTriptaAmountList(data?.list));
        dispatch(setTriptaAmountListCommonData(rest));
        return data;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setTriptaAmountLoading(false));
    }
  };
