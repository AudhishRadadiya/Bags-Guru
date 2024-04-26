import axios from 'axios';
import { toast } from 'react-toastify';
import {
  convertThousandToNumeric,
  roastError,
  roundValueThousandSeparator,
} from 'Helper/Common';
import {
  setSalesTurnoverLoading,
  setSalesTurnoverPercentageList,
  setSalesTurnoverValuationList,
  setUpdatedSalesTurnoverPercentageList,
  setUpdatedSalesTurnoverValuationList,
} from 'Store/Reducers/Report/SalesTurnoverSlice';

/**
 * @desc List monthly Turnover Valuation List:
 */
export const getSalesTurnOverValuation = payload => async dispatch => {
  try {
    dispatch(setSalesTurnoverLoading(true));

    const response = await axios.get(`/list/report/salesTurnOver/valuation`);
    const { msg, err, data } = response.data;

    const updatedSalesValuation = data?.data?.map(({ month_name, amount }) => {
      const valuationObj = { month: month_name };
      data?.year?.forEach((year, index) => {
        valuationObj[year] = `₹${roundValueThousandSeparator(
          convertThousandToNumeric(amount[index]),
        )}`;
      });
      return valuationObj;
    });

    if (err === 0) {
      dispatch(setUpdatedSalesTurnoverValuationList(updatedSalesValuation));
      dispatch(setSalesTurnoverValuationList(data));
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSalesTurnoverLoading(false));
  }
};

/**
 * @desc List monthly Turnover Percentage List:
 */
export const getSalesTurnOverPercentage = payload => async dispatch => {
  try {
    dispatch(setSalesTurnoverLoading(true));
    const response = await axios.get(`/list/report/salesTurnOver/percentage`);
    const { msg, err, data } = response.data;

    const updatedSalesPercentage = data?.data?.map(({ month_name, amount }) => {
      const percentageObj = { month: month_name };
      data?.year?.forEach((year, index) => {
        percentageObj[year] = `${amount[index]}%`;
      });
      return percentageObj;
    });

    if (err === 0) {
      dispatch(setUpdatedSalesTurnoverPercentageList(updatedSalesPercentage));
      dispatch(setSalesTurnoverPercentageList(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSalesTurnoverLoading(false));
  }
};
