import { getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setPpPriceHistoryCount,
  setPpPriceHistoryList,
  setPpPriceHistoryListLoading,
  setPpPriceHistoryLoading,
} from 'Store/Reducers/Purchase/PpPriceHistorySlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc get pp Price History List
 */

export const getPpPriceHistoryList =
  (limit = 30, start = 1) =>
  async dispatch => {
    try {
      dispatch(setPpPriceHistoryListLoading(true));
      const response = await axios.post(
        `list/ppPriceHistory/${start}/${limit}`,
      );
      const { data, msg, err } = response.data;
      let updated = data?.list?.map(x => {
        return {
          ...x,
          date: getDMYDateFormat(new Date(x?.created_at)),
        };
      });
      if (err === 0) {
        dispatch(setPpPriceHistoryList(updated || []));
        dispatch(setPpPriceHistoryCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setPpPriceHistoryListLoading(false));
    }
  };

/**
 * @desc Get Export PP Price History File
 */

export const getExportPpPriceHistoryFile = key => async dispatch => {
  try {
    if (key) {
      dispatch(setPpPriceHistoryLoading(true));
      let response;
      if (key === 'pdf')
        response = await axios.post(`export/ppPriceHistory/pdf`);
      else response = await axios.post(`export/ppPriceHistory/excel`);
      const { msg, err, data } = response.data;

      if (err === 0) {
        window.open(data, '_blank');
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setPpPriceHistoryLoading(false));
  }
};

/**
 * @desc Add Price
 */

export const addPrice = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setPpPriceHistoryLoading(true));
      const response = await axios.post(`ppPriceHistory/save`, payload);

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
    roastError(e);
    return false;
  } finally {
    dispatch(setPpPriceHistoryLoading(false));
  }
};

/**
 * @desc Update Price History
 */

export const updatePriceHistory = payload => async dispatch => {
  try {
    dispatch(setPpPriceHistoryLoading(true));
    const response = await axios.post(`ppPriceHistory/update`, payload);

    const { msg, err } = response.data;

    if (err === 0) {
      toast.success(msg);
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setPpPriceHistoryLoading(false));
  }
};

/**
 * @desc Delete Price History
 */

export const deletePriceHistoryItem = id => async dispatch => {
  try {
    dispatch(setPpPriceHistoryLoading(true));
    const response = await axios.post(`ppPriceHistory/delete`, {
      ppPriceHistoryId: id,
    });

    const { msg, err } = response.data;

    if (err === 0) {
      toast.success(msg);
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setPpPriceHistoryLoading(false));
  }
};
