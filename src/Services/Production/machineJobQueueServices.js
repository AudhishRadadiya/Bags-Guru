import axios from 'axios';
import { roastError } from 'Helper/Common';
import { toast } from 'react-toastify';
import {
  setMachineByMachineTypeList,
  setMachineJobQueueListLoading,
  setMachineJobQueueLoading,
  setMachineQueueTypes,
  setMfgProcessByMachineList,
} from 'Store/Reducers/Production/machineJobQueueSlice';

export const getMachineQueueTypeList = id => async dispatch => {
  try {
    // dispatch(setMachineJobQueueLoading(true));
    const response = await axios.get(`/list/machineQueue/machineType`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setMachineQueueTypes(data || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    // dispatch(setMachineJobQueueLoading(false));
  }
};

export const getMachineByMachineTypeList = id => async dispatch => {
  try {
    dispatch(setMachineJobQueueLoading(true));
    const response = await axios.get(`/list/machinesbyType/${id}`);
    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setMachineByMachineTypeList(data || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMachineJobQueueLoading(false));
  }
};

export const mfgProcessByMachineTypeList = id => async dispatch => {
  try {
    dispatch(setMachineJobQueueListLoading(true));
    const response = await axios.post(`/list/machineQueue/process`, {
      machine_id: id,
    });
    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setMfgProcessByMachineList(data || {}));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMachineJobQueueListLoading(false));
  }
};

export const updateMachineQueueProcess = payload => async dispatch => {
  try {
    dispatch(setMachineJobQueueLoading(true));
    const response = await axios.post(`/update/machineQueue/process`, payload);
    const { msg, err } = response.data;
    if (err === 0) {
      toast.success(msg);
      dispatch(setMachineJobQueueLoading(false));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMachineJobQueueLoading(false));
  }
};

export const machineQueueBagMakingstatus = id => async dispatch => {
  try {
    // dispatch(setBagMakingstatusLoading(true));
    const response = await axios.post(
      `/update/operatormfgProcess/bagMakingstatus`,
      {
        process_id: id,
      },
    );
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
    // dispatch(setBagMakingstatusLoading(false));
  }
};
