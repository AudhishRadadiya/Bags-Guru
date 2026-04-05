import axios from 'axios';
import { getDMYDateFormat, roastError } from 'Helper/Common';
import { toast } from 'react-toastify';
import { setDesignerReportList } from 'Store/Reducers/Report/SalesTurnoverSlice';

const todayDate = new Date();
let oneMonthAgoDate = new Date(todayDate);
oneMonthAgoDate.setMonth(todayDate.getMonth() - 1);

/**
 * @desc Designer Report List:
 */
export const getDesignerReportData =
  (startDate = oneMonthAgoDate, endDate = todayDate) =>
  async dispatch => {
    try {
      const response = await axios.post(`/list/report/designerReport`, {
        start_date: getDMYDateFormat(startDate),
        end_date: getDMYDateFormat(endDate),
      });
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setDesignerReportList(data));
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
