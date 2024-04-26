import axios from 'axios';
import { toast } from 'react-toastify';
import { getDMYDateFormat, roastError } from 'Helper/Common';
import { setSalesReportsLoading } from 'Store/Reducers/Report/SalesTurnoverSlice';

/**
 * @desc Advisor-Monthly-Turnover PDF Export:
 */
export const generateAdvisorMonthlyTurnoverPDF = dates => async dispatch => {
  try {
    dispatch(setSalesReportsLoading(true));
    const response = await axios.post(
      `list/report/advisorMonthlyTurnover/pdf`,
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
    dispatch(setSalesReportsLoading(false));
  }
};

/**
 * @desc Advisor-Monthly-Turnover Excel Export:
 */
export const generateAdvisorMonthlyTurnoverExcel = dates => async dispatch => {
  try {
    dispatch(setSalesReportsLoading(true));
    const response = await axios.post(
      `list/report/advisorMonthlyTurnover/excel`,
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
    dispatch(setSalesReportsLoading(false));
  }
};
