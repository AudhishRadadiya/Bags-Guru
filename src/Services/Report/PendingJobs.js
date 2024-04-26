import axios from 'axios';
import { toast } from 'react-toastify';
import { roastError } from 'Helper/Common';
import { setPendingJobsLoading } from 'Store/Reducers/Report/SalesTurnoverSlice';

/**
 * @desc Printing-Jobs PDF Export:
 */
export const printingJobsExportPDF = payload => async dispatch => {
  try {
    dispatch(setPendingJobsLoading(true));
    const response = await axios.get(`/list/report/printingJobs/pdf`);
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
    dispatch(setPendingJobsLoading(false));
  }
};

/**
 * @desc Printing-Jobs Excel Export:
 */
export const printingJobsExportExcel = payload => async dispatch => {
  try {
    dispatch(setPendingJobsLoading(true));

    const response = await axios.get(`/list/report/printingJobs/excel`);
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
    dispatch(setPendingJobsLoading(false));
  }
};

/**
 * @desc Pending-Job-By-BagType Excel Export:
 */
export const pendingJobByBagTypeExportExcel = machine_id => async dispatch => {
  try {
    dispatch(setPendingJobsLoading(true));

    const response = await axios.post(`/list/report/pendingJobByBagType`, {
      machine_type_id: machine_id,
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
    dispatch(setPendingJobsLoading(false));
  }
};
