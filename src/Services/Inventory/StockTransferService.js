import { getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setStockTransferCount,
  setStockTransferExportLoading,
  setStockTransferList,
  setStockTransferLoading,
} from 'Store/Reducers/Inventory/StockTransferSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc Get Export Stock Transfer File
 */
export const getExportStockTransferFile = key => async dispatch => {
  try {
    if (key) {
      dispatch(setStockTransferExportLoading(true));
      let response;
      if (key === 'pdf')
        response = await axios.post(`export/inventoryStockTransfer/pdf`);
      else response = await axios.post(`export/inventoryStockTransfer/excel`);
      const { msg, err, data } = response.data;

      if (err === 0) {
        window.open(data, '_blank');
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setStockTransferExportLoading(false));
  }
};

/**
 * @desc Get Stock Transfer List
 */
export const getStockTransferList =
  (limit = 30, start = 1, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setStockTransferLoading(true));
      let obj = {};
      for (const key in filter) {
        if (
          (typeof filter[key] === 'string' && filter[key] !== '') ||
          (typeof filter[key] === 'number' && !isNaN(filter[key])) ||
          Array.isArray(filter[key])
        ) {
          if (
            key === 'transfer_date' &&
            new Date(filter[key])?.toString() === 'Invalid Date'
          ) {
            obj.transfer_date = '';
          } else {
            obj[key] = filter[key];
          }
        }
      }
      const response = await axios.post(
        `/list/inventoryStockTransfer/${start}/${limit}`,
        {
          filter: obj,
          search: query,
          start_date: dates?.startDate
            ? getDMYDateFormat(dates?.startDate)
            : '',
          end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
        },
      );
      const { err, data, msg } = response.data;

      if (err === 0) {
        const updated = data?.list?.map(x => {
          return {
            ...x,
            transfer_date: x?.transfer_date?.split('T')?.[0],
          };
        });
        dispatch(setStockTransferList(updated || []));
        dispatch(setStockTransferCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setStockTransferLoading(false));
    }
  };
