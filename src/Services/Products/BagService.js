import { roastError } from 'Helper/Common';
import {
  setAllBagTagList,
  setBagCount,
  setBagDetailForDuplicate,
  setBagDetailForEdit,
  setBagExportLoading,
  setBagList,
  setBagLoading,
  setFullbagTagList,
  setSelectedBagForView,
  setbagTagList,
} from 'Store/Reducers/Products/BagsSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc Get Bag List
 */
export const getBagList =
  (limit = 30, start = 1, query = '', filter = {}) =>
  async dispatch => {
    try {
      dispatch(setBagLoading(true));

      const response = await axios.post(`/list/bag/${start}/${limit}`, {
        filter: filter,
        search: query,
      });
      const { msg, err, data } = response.data;

      if (err === 0) {
        const updated = data?.list?.map(x => {
          return {
            ...x,
            is_laminated: x?.is_laminated ? 1 : 0,
            // is_active: x?.is_active ? 1 : 0,
            handle_weight_auto: x?.handle_weight_auto ? 1 : 0,
            handle_weight_auto_text: x?.handle_weight_auto
              ? x?.handle_weight
              : '',
            handle_weight: x?.handle_weight ? 1 : 0,
            handle_weight_text: x?.handle_weight ? x?.handle_weight : '',
            lamination_types: x?.is_laminated
              ? `Laminated | ${x?.lamination_type_name
                  ?.map(x => x?.name)
                  .join(', ')}`
              : 'Non Laminated',
            printing_techonogy_str:
              x?.print_technology_name?.length > 0
                ? x?.print_technology_name?.map(x => x.name).join(', ')
                : 'Not Printed',
          };
        });
        dispatch(setBagList(updated || []));
        dispatch(setBagCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setBagLoading(false));
    }
  };

/**
 * @desc Get a Bag
 */
export const getBagItem = (bag_id, actionType) => async dispatch => {
  try {
    if (bag_id) {
      dispatch(setBagLoading(true));

      const response = await axios.get(`/view/bag/${bag_id}`);
      const { msg, err, data } = response.data;

      if (err === 0) {
        if (actionType === 'isDuplicated') delete data['_id'];
        let updated = {
          ...data,
          isDuplicated: actionType === 'isDuplicated' ? true : false,
          is_laminated: data?.is_laminated ? 1 : 0,
          // is_active: data?.is_active ? 1 : 0,
          handle_weight_auto: data?.handle_weight_auto ? 1 : 0,
          handle_weight_actual_text: data?.handle_weight_auto
            ? data?.handle_weight
            : '',
          // handle_weight_actual_text: data?.handle_weight
          //   ? data?.handle_weight
          //   : '',
          handle_weight: data?.handle_weight_auto ? '' : data?.handle_weight,
          // handle_weight: data?.handle_weight ? data?.handle_weight : '',
        };
        if (actionType === 'isDuplicated') {
          dispatch(setBagDetailForDuplicate(updated || []));
        } else if (actionType === 'isEdit') {
          dispatch(setBagDetailForEdit(updated || []));
        } else {
          dispatch(setSelectedBagForView(updated || []));
        }
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
    dispatch(setBagLoading(false));
  }
};

/**
 * @desc Create New Bag
 */
export const createBag = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setBagLoading(true));

      const response = await axios.post(`/add/bag`, payload);
      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
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
    dispatch(setBagLoading(false));
  }
};

/**
 * @desc Update Bag
 */
export const updateBag = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setBagLoading(true));

      const response = await axios.post(`/update/bag`, payload);
      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
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
    dispatch(setBagLoading(false));
  }
};

/**
 * @desc Update Bag Status
 */
export const updateBagStatus = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setBagLoading(true));

      const response = await axios.post(`/update/bagStatus`, payload);
      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
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
    dispatch(setBagLoading(false));
  }
};

/**
 * @desc Delete Bag
 */
export const deleteBag = bag_id => async dispatch => {
  try {
    if (bag_id) {
      dispatch(setBagLoading(true));

      const response = await axios.post(`/delete/bag`, { bag_id });
      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
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
    dispatch(setBagLoading(false));
  }
};

/**
 * @desc Get Export Bag File
 */

export const getExportBagFile = key => async dispatch => {
  try {
    if (key) {
      dispatch(setBagExportLoading(true));
      let response;
      if (key === 'pdf') response = await axios.post(`export/bag/pdf`);
      else response = await axios.post(`export/bag/excel`);
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
    dispatch(setBagExportLoading(false));
  }
};

/**
 * @desc Get Bag Tag List
 */
export const getbagTagList =
  (query = '', filter = {}) =>
  async dispatch => {
    try {
      let obj = {};
      for (const key in filter) {
        if (
          (Array.isArray(filter[key]) && filter[key]?.length > 0) ||
          ((typeof filter[key] === 'string' ||
            typeof filter[key] === 'number') &&
            filter[key] !== '')
        ) {
          if (key === 'is_mm' || key === 'bag_tag') {
            continue;
          }
          if (
            (key === 'width' ||
              key === 'height' ||
              key === 'width_mm' ||
              key === 'height_mm') &&
            filter[key] === 0
          ) {
            continue;
          }
          obj[key] = filter[key];
        }
      }
      dispatch(setBagLoading(true));

      const response = await axios.post(`/list/bagtag`, {
        filter: obj,
        search: query,
      });
      const { msg, err, data } = response.data;

      if (err === 0) {
        const updated = data?.map(x => {
          return {
            ...x,
            label: x?.bag_tag,
            value: x?._id,
          };
        });
        dispatch(setbagTagList(updated || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setBagLoading(false));
    }
  };

/**
 * @desc Get Bag Tag ListFull
 */
export const getFullBagTagList = payload => async dispatch => {
  try {
    dispatch(setBagLoading(true));
    const response = await axios.post(`/list/bagtag`, {
      filter: {},
      search: '',
    });
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          label: x?.bag_tag,
          value: x?._id,
        };
      });
      dispatch(setFullbagTagList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setBagLoading(false));
  }
};

/**
 * @desc Get All Bag Tag List
 */
export const getAllBagTagList = () => async dispatch => {
  try {
    dispatch(setBagLoading(true));

    const response = await axios.post(`list/all/bagtag`, {
      filter: {},
      search: '',
    });
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          label: x?.bag_tag,
          value: x?._id,
        };
      });
      dispatch(setAllBagTagList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setBagLoading(false));
  }
};
