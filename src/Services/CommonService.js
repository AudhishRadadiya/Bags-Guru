import { roastError } from 'Helper/Common';
import { setSettingsCRUDLoading } from 'Store/Reducers/Settings/SettingSlice';
import axios from 'axios';

/**
 * @desc  Upload File
 */
export const uploadFile = file => async dispatch => {
  try {
    if (file) {
      dispatch(setSettingsCRUDLoading(true));

      let body = new FormData();
      body.append('file', file);
      const headers = { 'Content-Type': 'multipart/form-data' };

      const response = await axios.post(`/upload`, body, {
        headers: headers,
      });
      const { data } = response.data;
      if (data) return data?.file;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSettingsCRUDLoading(false));
  }
};

/**
 * @desc Whatsapp Upload File:
 */
export const whatsappUploadFile = file => async dispatch => {
  try {
    if (file) {
      dispatch(setSettingsCRUDLoading(true));

      let body = new FormData();
      body.append('file', file);
      const headers = { 'Content-Type': 'multipart/form-data' };

      const response = await axios.post(`/whatsappupload`, body, {
        headers: headers,
      });
      const { data } = response.data;
      if (data) return data?.file;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSettingsCRUDLoading(false));
  }
};
