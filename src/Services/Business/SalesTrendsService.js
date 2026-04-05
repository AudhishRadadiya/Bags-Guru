import axios from 'axios';
import { getDMYDateFormat, roastError } from 'Helper/Common';
import { toast } from 'react-toastify';
import {
  setIndustrySalesChartData,
  setCustomerSourceChartData,
  setStateWiseTurnoverChartData,
  setPendingAndTotalSalesReportData,
  setExhibitionTableReportData,
  setAverageTableReportData,
} from 'Store/Reducers/Business/SalesTrendsSlice';

export const getCustomerSourceSalesMonthWiseChartList =
  payload => async dispatch => {
    let url = `/list/admin/dashboard/customerSourceSalesMonthWiseChart`;

    if (payload) {
      url = `/list/admin/dashboard/customerSourceSalesMonthWiseChart?partyType=${payload}`;
    }
    try {
      const response = await axios.get(url);

      const { msg, err, data } = response?.data;
      if (err === 0) {
        dispatch(setCustomerSourceChartData(data || {}));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    }
  };

export const getIndustrySalesMonthWiseChartList = payload => async dispatch => {
  let url = `/list/admin/dashboard/industrySalesMonthWiseChart`;

  if (payload) {
    url = `/list/admin/dashboard/industrySalesMonthWiseChart?partyType=${payload}`;
  }
  try {
    const response = await axios.get(url);

    const { msg, err, data } = response?.data;
    if (err === 0) {
      dispatch(setIndustrySalesChartData(data || {}));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  }
};

export const getStateWiseTurnoverChartList = payload => async dispatch => {
  let url = `/list/admin/dashboard/stateWiseTurnoverMonthWiseChart`;

  if (payload) {
    url = `/list/admin/dashboard/stateWiseTurnoverMonthWiseChart?partyType=${payload}`;
  }
  try {
    const response = await axios.get(url);

    const { msg, err, data } = response?.data;
    if (err === 0) {
      dispatch(setStateWiseTurnoverChartData(data || {}));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  }
};

export const getPendingAndTotalSalesRatioReportList = id => async dispatch => {
  try {
    const response = await axios.post(
      `/list/admin/dashboard/pendingAndTotalSalesMonthWiseRatioReport`,
      {
        present_advisor: id,
      },
    );

    const { msg, err, data } = response?.data;
    if (err === 0) {
      dispatch(setPendingAndTotalSalesReportData(data || {}));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  }
};

export const getExhibitionTableReportData =
  (startDate, endDate) => async dispatch => {
    try {
      const response = await axios.post(
        `/list/admin/dashboard/exhibitionTableReport`,
        {
          start_date: getDMYDateFormat(startDate),
          end_date: getDMYDateFormat(endDate),
        },
      );

      const { msg, err, data } = response?.data;
      if (err === 0) {
        dispatch(setExhibitionTableReportData(data || {}));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    }
  };

export const geAverageTableReportData = payload => async dispatch => {
  try {
    const response = await axios.get(
      `/list/admin/dashboard/advisorNewVsRepeatAverageReport`,
    );

    const { msg, err, data } = response?.data;
    if (err === 0) {
      dispatch(setAverageTableReportData(data || {}));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  }
};
