import axios from 'axios';
import {
  setBrokerMarginAnalysisList,
  setBrokerMarginLoading,
  setBrokerOptionsList,
  setFinanceDataCount,
  setFinanceList,
  setFinanceLoading,
  setPendingBrokerMarginList,
} from './FinancialsSlice';
import { toast } from 'react-toastify';
import { roastError } from 'Helper/Common';

/**
 * @desc Get Show Mobile Product List
 */
export const getShowFinanceList =
  (limit = 30, start = 1, query = '', filter = {}) =>
  async dispatch => {
    try {
      dispatch(setFinanceLoading(true));
      const response = await axios.post(
        `list/profitAnalysis/${start}/${limit}`,
        {
          filter: filter,
          search: query,
        },
      );

      const { err, data } = response.data;

      if (err === 0) {
        const newData = data?.list?.map(item => {
          return {
            ...item,
            can_transfer_job: item?.finance_profit_data_saved ? true : false,
            main_image: item?.main_image,
            design: item?.design,
            size_GSM:
              (item?.width > 0 ? `W ${item?.width} ` : '') +
              (item?.height > 0 ? `X H ${item?.height} ` : '') +
              (item?.gusset > 0 ? `X G ${item?.gusset} ` : '') +
              `(${item?.gsm} GSM)`,
            bag_type: item?.bag_type,
            lamination_type: item?.lamination_type,
            roll_width: item?.roll_width
              ? item?.roll_width
              : item?.roll_width_mm
              ? `${item?.roll_width_mm}"`
              : '-',
            repeat_length: item?.repeat_length
              ? item?.repeat_length
              : item?.repeat_length_mm
              ? `${item?.repeat_length_mm}"`
              : '-',
          };
        });
        dispatch(setFinanceList(newData));
        dispatch(setFinanceDataCount(data?.count || 0));
        return true;
      } else {
      }
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setFinanceLoading(false));
    }
  };

export const financeDataExport = payload => async (dispatch, getStats) => {
  try {
    let response;
    response = await axios.post('/export/profitAnalysisData/excel', {
      profit_data: payload,
    });
    const { msg, err, data } = response.data;
    if (err === 0) {
      window.open(data, '_blank');
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
  }
};

export const saveProfitAnalysis = payload => async (dispatch, getStats) => {
  try {
    let response;
    response = await axios.post('save/profitAnalysisData', {
      profit_data: payload,
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
  }
};

// ** Listing of Brokers Options **//

export const getBrokerOptionsList = () => async dispatch => {
  try {
    dispatch(setBrokerMarginLoading(true));
    const response = await axios.post('list/broker');
    const { msg, err, data } = response?.data;

    if (err === 0) {
      dispatch(setBrokerOptionsList(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setBrokerMarginLoading(false));
  }
};

// ** Listing of broker margin analysis **//

export const getBrokerMarginAnalysisList =
  (start = 1, limit = 30, broker_id = '', filter = {}, query = '') =>
  async dispatch => {
    try {
      dispatch(setBrokerMarginLoading(true));
      const response = await axios.post(
        `/list/brokerMarginAnalysis/${start}/${limit}`,
        {
          broker_id,
          filter,
          search: query,
        },
      );
      const { msg, err, data } = response?.data;

      if (err === 0) {
        dispatch(setBrokerMarginAnalysisList(data));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setBrokerMarginLoading(false));
    }
  };

// ** Listing of broker margin analysis **//

export const getPendingBrokerMarginAnalysisList =
  (start = 1, limit = 30, broker_id = '', filter = {}, query = '') =>
  async dispatch => {
    try {
      // dispatch(setFinanceLoading(true));
      dispatch(setBrokerMarginLoading(true));

      const response = await axios.post(
        `/list/pending/brokerMarginAnalysis/${start}/${limit}`,
        {
          broker_id,
          filter,
          search: query,
        },
      );
      const { msg, err, data } = response?.data;

      if (err === 0) {
        dispatch(setPendingBrokerMarginList(data));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setBrokerMarginLoading(false));
    }
  };

// ** Save broker margin analysis data **//

export const saveBrokerMarginData = payload => async dispatch => {
  try {
    dispatch(setFinanceLoading(true));
    const response = await axios.post('/save/brokerMarginData', payload);
    const { msg, err } = response?.data;
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
    dispatch(setFinanceLoading(false));
  }
};

// ** Export broker margin analysis data in excel **//

export const exportBrokerMarginData =
  (broker_id = '') =>
  async dispatch => {
    try {
      dispatch(setFinanceLoading(true));
      const response = await axios.post('/export/brokerMarginData/excel', {
        broker_id,
      });
      const { msg, err, data } = response?.data;

      if (err === 0) {
        window.open(data, '_blank');
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setFinanceLoading(false));
    }
  };
