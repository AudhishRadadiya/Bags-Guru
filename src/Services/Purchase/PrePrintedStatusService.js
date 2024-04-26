import { generateUniqueId, getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setCompletedPrePrintedOrderList,
  setPrePrintedPurchaseOrderList,
  setPrePrintedStatusListLoading,
  setPrePrintedStatusLoading,
  setSavedPrePrintedOrder,
} from 'Store/Reducers/Purchase/PrePrintedStatusSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc get pre_printed_status list
 */

export const getPrePrintedPurchaseOrderList =
  (start = 1, limit = 30, query = '', filter = {}, dates) =>
  async (dispatch, getState) => {
    const { prePrintedStatus } = getState();

    try {
      dispatch(setPrePrintedStatusListLoading(true));

      const response = await axios.post(
        `/list/prePrintedPurchseOrder/${start}/${limit}`,
        {
          filter: filter,
          search: query,
          start_date: dates?.startDate
            ? getDMYDateFormat(dates?.startDate)
            : '',
          end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
        },
      );
      const { data, msg, err } = response.data;
      const updatedData = { ...data };

      Object.keys(updatedData).forEach(key => {
        if (key === 'list') {
          if (prePrintedStatus?.selectedRollsData?.length > 0) {
            updatedData[key] = updatedData[key]?.map(item => {
              const obj = prePrintedStatus?.selectedRollsData?.find(
                item2 => item2?._id === item?._id,
              );
              if (obj) {
                return {
                  ...item,
                  select_preprinted_roll: obj?.select_preprinted_roll,
                  design_date: obj?.design_date,
                  proof_ok_date: obj?.proof_ok_date,
                  proof_rcv_date: obj?.proof_rcv_date,
                  received_date: obj?.received_date,
                  unique_id: generateUniqueId(),
                };
              }

              return {
                ...item,
                select_preprinted_roll: false,
                unique_id: generateUniqueId(),
              };
            });
          } else {
            updatedData[key] = updatedData[key].map(value => {
              return {
                ...value,
                select_preprinted_roll: false,
                unique_id: generateUniqueId(),
              };
            });
          }
        }
      });

      if (err === 0) {
        dispatch(setPrePrintedPurchaseOrderList(updatedData || {}));
        return updatedData;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setPrePrintedStatusListLoading(false));
    }
  };

export const getCompletedPrePrintedOrderList =
  (start = 1, limit = 30, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setPrePrintedStatusListLoading(true));

      const response = await axios.post(
        `/list/completedprePrintedPurchseOrder/${start}/${limit}`,
        {
          filter: filter,
          search: query,
          start_date: dates?.startDate
            ? getDMYDateFormat(dates?.startDate)
            : '',
          end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
        },
      );
      const { data, msg, err } = response.data;
      const updatedData = { ...data };

      Object.keys(updatedData).forEach(key => {
        if (key === 'list') {
          updatedData[key] = updatedData[key].map(value => {
            return {
              ...value,
              unique_id: generateUniqueId(),
            };
          });
        }
      });

      if (err === 0) {
        dispatch(setCompletedPrePrintedOrderList(updatedData || {}));
        return updatedData;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setPrePrintedStatusListLoading(false));
    }
  };

export const savePrePrintedOrder = payload => async dispatch => {
  try {
    dispatch(setPrePrintedStatusLoading(true));

    const response = await axios.post(
      // '/list/prePrintedPurchseOrder/saveProof'
      '/save/prePrintedPurchseOrder/saveProof',
      {
        purchase_order_list: payload,
      },
    );
    const { data, msg, err } = response.data;

    if (err === 0) {
      // dispatch(setCompletedPrePrintedOrderList(updatedData || {}));
      dispatch(setSavedPrePrintedOrder(data || {}));
      toast.success(msg);
      return data;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setPrePrintedStatusLoading(false));
  }
};
