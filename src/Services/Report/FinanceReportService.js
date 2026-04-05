import axios from 'axios';
import { toast } from 'react-toastify';
import { getDMYDateFormat, roastError } from 'Helper/Common';
import { setFinishedGoodsLoading } from 'Store/Reducers/Report/SalesTurnoverSlice';

/**
 * @desc Industry-Source-Report Excel Export:
 */
export const industrySourceReportExportExcel = dates => async dispatch => {
  try {
    dispatch(setFinishedGoodsLoading(true));

    const response = await axios.post(`/list/report/industrySourceReport`, {
      start_date: dates?.start_date ? getDMYDateFormat(dates?.start_date) : '',
      end_date: dates?.end_date ? getDMYDateFormat(dates?.end_date) : '',
    });
    const { msg, err, data } = response.data;

    if (err === 0) {
      window.open(data, '_self');
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
 * @desc Customer-Source-Report Excel Export:
 */
export const customerSourceReportExportExcel = dates => async dispatch => {
  try {
    dispatch(setFinishedGoodsLoading(true));

    const response = await axios.post(`/list/report/customerSourceReport`, {
      start_date: dates?.start_date ? getDMYDateFormat(dates?.start_date) : '',
      end_date: dates?.end_date ? getDMYDateFormat(dates?.end_date) : '',
    });
    const { msg, err, data } = response.data;

    if (err === 0) {
      window.open(data, '_self');
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
 * @desc Customer-Source-Detail-Report Excel Export:
 */
export const customerSourceDetailReportExportExcel =
  dates => async dispatch => {
    try {
      dispatch(setFinishedGoodsLoading(true));

      const response = await axios.post(
        `/list/report/customerSourceDetailReport`,
        {
          start_date: dates?.start_date
            ? getDMYDateFormat(dates?.start_date)
            : '',
          end_date: dates?.end_date ? getDMYDateFormat(dates?.end_date) : '',
        },
      );
      const { msg, err, data } = response.data;

      if (err === 0) {
        window.open(data, '_self');
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
 * @desc Industry-Source-With-Name-Report Excel Export:
 */
export const industrySourceWithNameReportExportExcel =
  dates => async dispatch => {
    try {
      dispatch(setFinishedGoodsLoading(true));

      const response = await axios.post(
        `/list/report/industrySourceWithNameReport`,
        {
          start_date: dates?.start_date
            ? getDMYDateFormat(dates?.start_date)
            : '',
          end_date: dates?.end_date ? getDMYDateFormat(dates?.end_date) : '',
        },
      );
      const { msg, err, data } = response.data;

      if (err === 0) {
        window.open(data, '_self');
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
 * @desc Customer-Source-With-Name-Report Excel Export:
 */
export const customerSourceWithNameReportExportExcel =
  dates => async dispatch => {
    try {
      dispatch(setFinishedGoodsLoading(true));

      const response = await axios.post(
        `/list/report/customerSourceWithNameReport`,
        {
          start_date: dates?.start_date
            ? getDMYDateFormat(dates?.start_date)
            : '',
          end_date: dates?.end_date ? getDMYDateFormat(dates?.end_date) : '',
        },
      );
      const { msg, err, data } = response.data;

      if (err === 0) {
        window.open(data, '_self');
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
 * @desc Customer-Source-Detail-With-Name-Report Excel Export:
 */
export const customerSourceDetailWithNameReportExportExcel =
  dates => async dispatch => {
    try {
      dispatch(setFinishedGoodsLoading(true));

      const response = await axios.post(
        `/list/report/customerSourceDetailWithNameReport`,
        {
          start_date: dates?.start_date
            ? getDMYDateFormat(dates?.start_date)
            : '',
          end_date: dates?.end_date ? getDMYDateFormat(dates?.end_date) : '',
        },
      );
      const { msg, err, data } = response.data;

      if (err === 0) {
        window.open(data, '_self');
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
