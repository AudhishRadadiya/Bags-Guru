import axios from 'axios';
import { toast } from 'react-toastify';
import { getDMYDateFormat, roastError } from 'Helper/Common';
import { setFinishedGoodsLoading } from 'Store/Reducers/Report/SalesTurnoverSlice';

/**
 * @desc Industry-Souce-Report Excel Export:
 */
export const industrySouceReportExportExcel = dates => async dispatch => {
  try {
    dispatch(setFinishedGoodsLoading(true));

    const response = await axios.post(`/list/report/industrySouceReport`, {
      start_date: dates?.start_date ? getDMYDateFormat(dates?.start_date) : '',
      end_date: dates?.end_date ? getDMYDateFormat(dates?.end_date) : '',
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
    dispatch(setFinishedGoodsLoading(false));
  }
};

/**
 * @desc Customer-Souce-Report Excel Export:
 */
export const customerSouceReportExportExcel = dates => async dispatch => {
  try {
    dispatch(setFinishedGoodsLoading(true));

    const response = await axios.post(`/list/report/customerSouceReport`, {
      start_date: dates?.start_date ? getDMYDateFormat(dates?.start_date) : '',
      end_date: dates?.end_date ? getDMYDateFormat(dates?.end_date) : '',
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
    dispatch(setFinishedGoodsLoading(false));
  }
};

/**
 * @desc Customer-Souce-Detail-Report Excel Export:
 */
export const customerSouceDetailReportExportExcel = dates => async dispatch => {
  try {
    dispatch(setFinishedGoodsLoading(true));

    const response = await axios.post(
      `/list/report/customerSouceDetailReport`,
      {
        start_date: dates?.start_date
          ? getDMYDateFormat(dates?.start_date)
          : '',
        end_date: dates?.end_date ? getDMYDateFormat(dates?.end_date) : '',
      },
    );
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
    dispatch(setFinishedGoodsLoading(false));
  }
};
