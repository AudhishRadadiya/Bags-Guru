import { getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setStockConsumptionCount,
  setStockConsumptionExportLoading,
  setStockConsumptionList,
  setStockConsumptionLoading,
} from 'Store/Reducers/Inventory/StockConsumptionSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc Get Stock Consumption List
 */
export const getStockConsumptionList =
  (limit = 30, start = 1, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setStockConsumptionLoading(true));
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
        `/list/inventoryStockConsumption/${start}/${limit}`,
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
            consumption_date: x?.consumption_date?.split('T')?.[0],
          };
        });
        dispatch(setStockConsumptionList(updated || []));
        dispatch(setStockConsumptionCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setStockConsumptionLoading(false));
    }
  };

/**
 * @desc Get Export Ink Consumption File
 */

export const getExportStockConsumptionFile = key => async dispatch => {
  try {
    if (key) {
      dispatch(setStockConsumptionExportLoading(true));
      let response;
      if (key === 'pdf')
        response = await axios.post(`export/inventoryStockConsumption/pdf`);
      else
        response = await axios.post(`export/inventoryStockConsumption/excel`);
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
    dispatch(setStockConsumptionExportLoading(false));
  }
};
