import axios from 'axios';
import { toast } from 'react-toastify';
import { roastError } from 'Helper/Common';
import { setRawMaterialLoading } from 'Store/Reducers/Report/SalesTurnoverSlice';

/**
 * @desc Fabrick-Stock-GSM PDF Export:
 */
export const fabrickStockByGSMExportPDF =
  (material_name = '') =>
  async dispatch => {
    try {
      dispatch(setRawMaterialLoading(true));
      const response = await axios.post(`/list/report/fabrickStockByGSM/pdf`, {
        material: material_name,
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
      dispatch(setRawMaterialLoading(false));
    }
  };

/**
 * @desc Fabrick-Stock-GSM Excel Export:
 */
export const fabrickStockByGSMExportExcel =
  (material_name = '') =>
  async dispatch => {
    try {
      dispatch(setRawMaterialLoading(true));
      const response = await axios.post(
        `/list/report/fabrickStockByGSM/excel`,
        {
          material: material_name,
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
      dispatch(setRawMaterialLoading(false));
    }
  };

/**
 * @desc Fabrick-Stock-Color PDF Export:
 */
export const fabrickStockByColorExportPDF =
  (material_name = '') =>
  async dispatch => {
    try {
      dispatch(setRawMaterialLoading(true));
      const response = await axios.post(
        `/list/report/fabrickStockByColor/pdf`,
        {
          material: material_name,
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
      dispatch(setRawMaterialLoading(false));
    }
  };

/**
 * @desc Fabrick-Stock-Color Excel Export:
 */
export const fabrickStockByColorExportExcel =
  (material_name = '') =>
  async dispatch => {
    try {
      dispatch(setRawMaterialLoading(true));
      const response = await axios.post(
        `/list/report/fabrickStockByColor/excel`,
        {
          material: material_name,
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
      dispatch(setRawMaterialLoading(false));
    }
  };

/**
 * @desc Laminated-Roll-Stock Excel Export:
 */
export const laminatedRollStockExportExcel = payload => async dispatch => {
  try {
    dispatch(setRawMaterialLoading(true));
    const response = await axios.post(`/list/report/laminatedRollStock/excel`);
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
    dispatch(setRawMaterialLoading(false));
  }
};

/**
 * @desc Laminated-Roll-Stock PDF Export:
 */
export const laminatedRollStockExportPDF = payload => async dispatch => {
  try {
    dispatch(setRawMaterialLoading(true));
    const response = await axios.post(`/list/report/laminatedRollStock/pdf`);
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
    dispatch(setRawMaterialLoading(false));
  }
};

/**
 * @desc Laminated-Roll-Stock Excel Export:
 */
export const rollAgeingReportExportExcel = payload => async dispatch => {
  try {
    dispatch(setRawMaterialLoading(true));
    const response = await axios.get(`/list/report/rollAgeingReport`);
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
    dispatch(setRawMaterialLoading(false));
  }
};
