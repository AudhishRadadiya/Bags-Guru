import axios from 'axios';
import { toast } from 'react-toastify';
import { roastError } from 'Helper/Common';
import { setFinishedGoodsLoading } from 'Store/Reducers/Report/SalesTurnoverSlice';

/**
 * @desc Finished-Goods-Print Excel Export:
 */
export const finishedGoodsPrintExportExcel =
  (form, warehouse) => async dispatch => {
    try {
      dispatch(setFinishedGoodsLoading(true));

      const response = await axios.post(
        `/list/report/commonPrintFinishedGood`,
        {
          form,
          warehouse,
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

/**
 * @desc Finished-Goods-printedPrint Excel Export:
 */
export const finishedGoodsPrintedPrintExportExcel =
  (form, warehouse) => async dispatch => {
    try {
      dispatch(setFinishedGoodsLoading(true));

      const response = await axios.post(
        `/list/report/printedPrintFinishedGood`,
        {
          form,
          warehouse,
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
