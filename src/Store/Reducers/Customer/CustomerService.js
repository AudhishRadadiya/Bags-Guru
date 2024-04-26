import { generateUniqueId, roastError } from 'Helper/Common';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  setCustomerDataCount,
  setCustomerFilterListOptions,
  setCustomerList,
  setCustomerLoading,
} from './CustomerSlice';

/**
 * @desc Get Show Mobile Product List
 */
export const getShowCustomerList =
  (
    type = 'all',
    limit = 30,
    start = 1,
    query = '',
    filter = {},
    field_filter = {},
  ) =>
  async dispatch => {
    try {
      dispatch(setCustomerLoading(true));
      const response = await axios.post(
        `list/${type}/customerFollowUp/${start}/${limit}`,
        {
          filter: filter,
          search: query,
          field_filter,
        },
      );

      const { err, data } = response.data;

      if (err === 0) {
        const newData = data?.list?.map(item => {
          return {
            ...item,
            unique_id: generateUniqueId(),
          };
        });
        if (newData) dispatch(setCustomerList(newData));
        dispatch(setCustomerDataCount(data?.count || 0));
        return true;
      } else {
      }
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setCustomerLoading(false));
    }
  };

export const getCustomerFilterList = payload => async dispatch => {
  try {
    // dispatch(setMfgLiveLoading(true));
    const response = await axios.post(`list/filter/customerFollowUp`, payload);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const newData = {
        advisorList: data?.advisorList?.map(d => {
          return {
            label: d?.name,
            value: d?.name,
          };
        }),

        cityList: data?.cityList?.map(d => {
          return {
            label: d?.name,
            value: d?.name,
          };
        }),

        customerGroupList: data?.customeGroupList?.map(d => {
          return {
            label: d?.party_name,
            value: d?.party_name,
          };
        }),

        partyList: data?.partyList?.map(d => {
          return {
            label: d?.party_name,
            value: d?.party_name,
          };
        }),

        stateList: data?.stateList?.map(d => {
          return {
            label: d?.name,
            value: d?.name,
          };
        }),

        partyTypeList: data?.partyTypeList?.map(d => {
          return {
            label: d?.name,
            value: d?.name,
          };
        }),
      };

      dispatch(setCustomerFilterListOptions(newData || {}));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    // dispatch(setMfgLiveLoading(false));
  }
};

export const customerDataExport = payload => async (dispatch, getStats) => {
  try {
    let response;
    response = await axios.post('export/customerFollowUp/excel', {
      profit_data: payload,
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
  }
};

export const SaveCustomerSnoozeDetailsDataExport =
  payload => async dispatch => {
    dispatch(setCustomerLoading(true));

    try {
      let response;
      response = await axios.post('save/snoozeDetails', {
        profit_data: payload,
      });
      const { msg, err } = response.data;
      if (err === 0) {
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setCustomerLoading(false));
    }
  };

export const saveCustomerFollowupData = payload => async dispatch => {
  try {
    let response;
    response = await axios.post('save/snoozeDetails', payload);
    const { msg, err } = response.data;
    if (err === 0) {
      toast.success(msg);
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
  }
};
