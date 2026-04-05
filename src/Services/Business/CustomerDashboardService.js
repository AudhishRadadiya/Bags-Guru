import axios from 'axios';
import { generateUniqueId, getDMYDateFormat, roastError } from 'Helper/Common';
import { toast } from 'react-toastify';
import {
  setCustomerAnalyticsCount,
  setCustomerAnalyticsList,
  setCustomerAveragesData,
  setCustomerDashboardListLoading,
  setCustomerDashboardLoading,
  setMonthlySalesTrendsData,
} from 'Store/Reducers/Business/CustomerDashboardSlice';

export const getCustomerAveragesData = (dates, filter) => async dispatch => {
  try {
    dispatch(setCustomerDashboardLoading(true));

    const response = await axios.post(
      `/list/advisor/dashboard/customerAverages`,
      {
        start_date: dates?.startDate ? getDMYDateFormat(dates?.startDate) : '',
        end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
        ...filter,
      },
    );

    const { msg, err, data } = response?.data;
    if (err === 0) {
      dispatch(setCustomerAveragesData(data || {}));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setCustomerDashboardLoading(false));
  }
};

export const getCustomerAnalyticsData =
  (start = 0, limit = 30, dates, filter) =>
  async dispatch => {
    try {
      dispatch(setCustomerDashboardListLoading(true));

      const response = await axios.post(
        `/list/advisor/dashboard/customerAnalytics/${start}/${limit}`,
        {
          start_date: dates?.startDate
            ? getDMYDateFormat(dates?.startDate)
            : '',
          end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
          ...filter,
        },
      );

      const { msg, err, data } = response?.data;

      const updatedList = data?.list.map(item => ({
        ...item,
        unique_id: generateUniqueId(),
      }));

      if (err === 0) {
        dispatch(setCustomerAnalyticsList(updatedList || []));
        dispatch(setCustomerAnalyticsCount(data?.count || 0));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setCustomerDashboardListLoading(false));
    }
  };

export const getMonthlySalesTrendsData = (dates, filter) => async dispatch => {
  try {
    dispatch(setCustomerDashboardListLoading(true));

    const response = await axios.post(
      `/list/advisor/dashboard/monthlySalesTrends`,
      {
        start_date: dates?.startDate ? getDMYDateFormat(dates?.startDate) : '',
        end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
        ...filter,
      },
    );

    const { msg, err, data } = response?.data;

    if (err === 0) {
      dispatch(setMonthlySalesTrendsData(data || {}));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setCustomerDashboardListLoading(false));
  }
};
