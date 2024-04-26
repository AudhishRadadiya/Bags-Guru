import axios from 'axios';
import { toast } from 'react-toastify';
import { getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setAdvisorReportData,
  setAdvisorTurnoverReportData,
  setLaminationChartData,
  setPartyTypeChartData,
  setPendingJobBagTypeReportData,
  setPendingJobPrintTechnologyReportData,
  setProductStockChartData,
  setRawMaterialChartData,
  setStateTurnoverReportData,
} from 'Store/Reducers/Business/AdminDashboardSlice';

const todayDate = new Date();
let oneMonthAgoDate = new Date(todayDate);
oneMonthAgoDate.setMonth(todayDate.getMonth() - 1);

export const getRawMaterialReportList =
  (id = '') =>
  async dispatch => {
    try {
      // dispatch(setAdminDashboardLoading(true));
      const response = await axios.post(
        `/list/admin/dashboard/rawMaterialReport`,
        {
          warehouse: id,
        },
      );

      const { msg, err, data } = response?.data;
      if (err === 0) {
        dispatch(setRawMaterialChartData(data || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      //  dispatch(setAdminDashboardLoading(false));
    }
  };

export const getProductStockReportList =
  (id = '') =>
  async dispatch => {
    try {
      // dispatch(setAdminDashboardLoading(true));
      const response = await axios.post(
        `/list/admin/dashboard/productStockReport`,
        {
          warehouse: id,
        },
      );

      const { msg, err, data } = response?.data;
      if (err === 0) {
        dispatch(setProductStockChartData(data || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      //  dispatch(setAdminDashboardLoading(false));
    }
  };

export const getPartyTypeReportList =
  (startDate = oneMonthAgoDate, endDate = todayDate) =>
  async dispatch => {
    try {
      // dispatch(setAdminDashboardLoading(true));
      const response = await axios.post(
        `/list/admin/dashboard/partyTypeReport`,
        {
          start_date: getDMYDateFormat(startDate),
          end_date: getDMYDateFormat(endDate),
        },
      );

      const { msg, err, data } = response?.data;
      if (err === 0) {
        dispatch(setPartyTypeChartData(data || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      //  dispatch(setAdminDashboardLoading(false));
    }
  };

export const getLaminationReportList =
  (startDate = oneMonthAgoDate, endDate = todayDate) =>
  async dispatch => {
    try {
      // dispatch(setAdminDashboardLoading(true));
      const response = await axios.post(
        `/list/admin/dashboard/laminationReport`,
        {
          start_date: getDMYDateFormat(startDate),
          end_date: getDMYDateFormat(endDate),
        },
      );

      const { msg, err, data } = response?.data;
      if (err === 0) {
        dispatch(setLaminationChartData(data || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      //  dispatch(setAdminDashboardLoading(false));
    }
  };

export const getAdvisorReportList = payload => async dispatch => {
  try {
    // dispatch(setAdminDashboardLoading(true));
    const response = await axios.get(`/list/advisor/dashboard/advisorReport`);

    const { msg, err, data } = response?.data;
    if (err === 0) {
      dispatch(setAdvisorReportData(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    //  dispatch(setAdminDashboardLoading(false));
  }
};

export const getPendingJobPrintTechnologyReportList =
  (startDate = oneMonthAgoDate, endDate = todayDate) =>
  async dispatch => {
    try {
      // dispatch(setAdminDashboardLoading(true));
      const response = await axios.post(
        `/list/admin/dashboard/pendingJobPrintTechnologyReport`,
        {
          start_date: getDMYDateFormat(startDate),
          end_date: getDMYDateFormat(endDate),
        },
      );

      const { msg, err, data } = response?.data;
      if (err === 0) {
        dispatch(setPendingJobPrintTechnologyReportData(data || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      //  dispatch(setAdminDashboardLoading(false));
    }
  };

export const getPendingJobBagTypeReportList =
  (startDate = oneMonthAgoDate, endDate = todayDate) =>
  async dispatch => {
    try {
      // dispatch(setAdminDashboardLoading(true));
      const response = await axios.post(
        `/list/admin/dashboard/pendingJobBagTypeReport`,
        {
          start_date: getDMYDateFormat(startDate),
          end_date: getDMYDateFormat(endDate),
        },
      );

      const { msg, err, data } = response?.data;
      if (err === 0) {
        dispatch(setPendingJobBagTypeReportData(data || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      //  dispatch(setAdminDashboardLoading(false));
    }
  };

export const getStateTurnoverReportList =
  (startDate = oneMonthAgoDate, endDate = todayDate) =>
  async dispatch => {
    try {
      // dispatch(setAdminDashboardLoading(true));
      const response = await axios.post(
        `/list/admin/dashboard/stateTurnoverReport`,
        {
          start_date: getDMYDateFormat(startDate),
          end_date: getDMYDateFormat(endDate),
        },
      );

      const { msg, err, data } = response?.data;
      if (err === 0) {
        dispatch(setStateTurnoverReportData(data || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      //  dispatch(setAdminDashboardLoading(false));
    }
  };

export const getAdvisorTurnoverReportList = payload => async dispatch => {
  try {
    // dispatch(setAdminDashboardLoading(true));
    const response = await axios.get(
      `/list/admin/dashboard/advisorTurnoverReport`,
    );

    const { msg, err, data } = response?.data;
    if (err === 0) {
      dispatch(setAdvisorTurnoverReportData(data || {}));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    //  dispatch(setAdminDashboardLoading(false));
  }
};
