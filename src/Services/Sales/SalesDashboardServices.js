import { getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setAdvisorReportData,
  setCustomerSourceDetailData,
  setCustomerSourceReportData,
  setIndustryReportData,
  setLaminationReportData,
  setNewAndRepeatOrderReportData,
  setPartyTypeReportData,
  setSalesTableData,
} from 'Store/Reducers/Sales/SalesdashboardSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

export const getSalesTargetList = payload => async dispatch => {
  try {
    // dispatch(setSalesOrderLoading(true));
    const response = await axios.post(
      `/list/advisor/dashboard/salesTarget`,
      // payload,
      {
        start_date: getDMYDateFormat(payload?.startDate),
        end_date: getDMYDateFormat(payload?.endDate),
      },
    );

    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setSalesTableData(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    //   dispatch(setSalesOrderLoading(false));
  }
};

export const getLaminationReport = payload => async dispatch => {
  try {
    // dispatch(setSalesOrderLoading(true));
    const response = await axios.post(
      `/list/advisor/dashboard/laminationReport`,
      {
        start_date: getDMYDateFormat(payload?.startDate),
        end_date: getDMYDateFormat(payload?.endDate),
      },
    );

    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setLaminationReportData(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    //   dispatch(setSalesOrderLoading(false));
  }
};

export const getCustomerSourceReport = payload => async dispatch => {
  try {
    // dispatch(setSalesOrderLoading(true));
    const response = await axios.post(
      `/list/advisor/dashboard/customerSorceReport`,
      {
        start_date: getDMYDateFormat(payload?.startDate),
        end_date: getDMYDateFormat(payload?.endDate),
      },
    );

    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setCustomerSourceReportData(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    //   dispatch(setSalesOrderLoading(false));
  }
};

export const getCustomerSorceDetailReport = payload => async dispatch => {
  try {
    // dispatch(setSalesOrderLoading(true));
    const response = await axios.post(
      `/list/advisor/dashboard/customerSorceDetailReport`,
      {
        start_date: getDMYDateFormat(payload?.startDate),
        end_date: getDMYDateFormat(payload?.endDate),
      },
    );

    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setCustomerSourceDetailData(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    //   dispatch(setSalesOrderLoading(false));
  }
};

export const getIndustryReport = payload => async dispatch => {
  try {
    // dispatch(setSalesOrderLoading(true));
    const response = await axios.post(
      `/list/advisor/dashboard/industryReport`,
      {
        start_date: getDMYDateFormat(payload?.startDate),
        end_date: getDMYDateFormat(payload?.endDate),
      },
    );

    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setIndustryReportData(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    //   dispatch(setSalesOrderLoading(false));
  }
};

export const getPartyTypeReport = payload => async dispatch => {
  try {
    // dispatch(setSalesOrderLoading(true));
    const response = await axios.post(
      `/list/advisor/dashboard/partyTypeReport`,
      {
        start_date: getDMYDateFormat(payload?.startDate),
        end_date: getDMYDateFormat(payload?.endDate),
      },
    );

    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setPartyTypeReportData(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    //   dispatch(setSalesOrderLoading(false));
  }
};

export const getAdvisorReport = payload => async dispatch => {
  try {
    // dispatch(setSalesOrderLoading(true));
    const response = await axios.get(`/list/advisor/dashboard/advisorReport`);

    const { msg, err, data } = response.data;
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
    //   dispatch(setSalesOrderLoading(false));
  }
};

export const getNewAndRepeatOrderReport = payload => async dispatch => {
  try {
    // dispatch(setSalesOrderLoading(true));
    const response = await axios.get(
      `/list/advisor/dashboard/newAndRepeatOrderReport`,
    );

    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setNewAndRepeatOrderReportData(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    //   dispatch(setSalesOrderLoading(false));
  }
};
