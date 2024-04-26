import { roastError } from 'Helper/Common';
import {
  setActiveBagMachineList,
  setActiveFactoryLocationList,
  setActiveOperatorRoleList,
  setBusinessTypeList,
  setCompanyDetails,
  setSettingLoading,
  setSettingsCRUDLoading,
} from 'Store/Reducers/Settings/SettingSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc  Get Company Details
 */
export const getCompanyDetails = () => async (dispatch, getState) => {
  try {
    dispatch(setSettingLoading(true));

    const response = await axios.get(`details/company`);
    const { data, err, msg } = response.data;

    if (err === 0) {
      const updated = {
        ...data,
        company_address: data?.company_address?.map((item, index) => ({
          ...item,
          no: index + 1,
        })),
      };
      dispatch(setCompanyDetails(updated));
      return updated;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSettingLoading(false));
  }
};

/**
 * @desc  Get Business Type List
 */
export const getBusinessTypeList = () => async dispatch => {
  try {
    dispatch(setSettingLoading(true));

    const response = await axios.get(`/list/businessType`);
    const { data, err, msg } = response.data;
    if (err === 0) {
      const updatedList = data?.map(x => {
        return {
          ...x,
          value: x?._id,
          label: x?.name,
        };
      });
      dispatch(setBusinessTypeList(updatedList));
      return data;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setSettingLoading(false));
  }
};

/**
 * @desc  Delete Company
 * @param payload (Company_id)
 */
export const deleteCompany = company_id => async dispatch => {
  try {
    if (company_id) {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`/delete/company`, {
        company_id,
      });
      const { err, msg } = response.data;
      if (err === 0) {
        toast.success(msg);
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setSettingsCRUDLoading(false));
  }
};

/**
 * @desc  Create New Company
 * @param payload (new company)
 */
export const createNewCompany = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`/add/company`, payload);
      const { err, msg } = response.data;
      if (err === 0) {
        toast.success(msg);
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setSettingsCRUDLoading(false));
  }
};

/**
 * @desc  Update Company
 * @param payload (Company Details)
 */
export const updateCompany = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`/update/company`, payload);
      const { err, msg } = response.data;
      if (err === 0) {
        toast.success(msg);
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setSettingsCRUDLoading(false));
  }
};

/**
 * @desc  Get Active Factory Location List
 */
export const getActiveFactoryLocationList = () => async dispatch => {
  try {
    dispatch(setSettingLoading(true));

    const response = await axios.get(`/list/active/factoryLocation`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          label: x?.name,
          value: x?._id,
        };
      });
      dispatch(setActiveFactoryLocationList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setSettingLoading(false));
  }
};

/**
 * @desc  Get Active Operator Role List
 */
export const getActiveOperatorRoleList = () => async dispatch => {
  try {
    dispatch(setSettingLoading(true));

    const response = await axios.get(`/list/active/operatorRole`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          label: x?.name,
          value: x?._id,
        };
      });
      dispatch(setActiveOperatorRoleList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setSettingLoading(false));
  }
};

/**
 * @desc  Get Active Bag Machine List
 */
export const getActiveBagMachineList = () => async dispatch => {
  try {
    dispatch(setSettingLoading(true));

    const response = await axios.get(`/list/active/bagMachine`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          label: x?.name,
          value: x?._id,
        };
      });
      dispatch(setActiveBagMachineList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setSettingLoading(false));
  }
};
