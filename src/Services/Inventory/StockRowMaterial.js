import axios from 'axios';
import { roastError } from 'Helper/Common';
import { toast } from 'react-toastify';
import {
  setStockRawLoading,
  setStockRawList,
  setExportInventoryStockPdfData,
  setExportInventoryExcelData,
  setRollConsumptionList,
  setRollConsumptionCount,
  setStockRawExportLoading,
  setInkConsumptionList,
  setInkConsumptionCount,
  setIsStockTransfer,
  setStockRawListingLoading,
  setStockRawBaseDataList,
} from 'Store/Reducers/Inventory/StockRawMaterialSlice';
/**
 * @desc Get Raw material stock List
 */
export const getRawStockList =
  (limit = 30, start = 1, query = '', filter = {}) =>
  async dispatch => {
    try {
      dispatch(setStockRawListingLoading(true));

      const response = await axios.post(
        `/list/inventoryStock/${start}/${limit}`,
        {
          filter: filter,
          search: query,
        },
      );
      const { msg, err, data } = response.data;

      if (err === 0) {
        let newData = [];
        data?.list?.forEach(x => {
          x.data?.map(d => {
            let newObj = {
              ...d,
              d_name: x?.display_name,
              isSelected: false,
              weight: d?.net_weight?.split(' ')?.[0],
              transfer_weight: '',
              used_machine: '',
            };
            newData.push(newObj);
            return d;
          });
          return x;
        });
        dispatch(setStockRawList({ list: newData || [], count: data?.count }));
        dispatch(
          setStockRawBaseDataList({
            list: data?.list || [],
            count: data?.count,
          }),
        );
        return data;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setStockRawListingLoading(false));
    }
  };

/**
 * @desc get  export  inventory stock  pdf
 */
export const getExportInventoryStockPdf = () => async dispatch => {
  try {
    dispatch(setStockRawLoading(true));
    const response = await axios.post(`/export/inventoryStock/pdf`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setExportInventoryStockPdfData(data));
      window.open(data, '_blank');
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setStockRawLoading(false));
  }
};

/**
 * @desc get  export inventory stock excel
 */

export const getExportInventoryStockExcel = () => async dispatch => {
  try {
    dispatch(setStockRawLoading(true));
    const response = await axios.post(`/export/inventoryStock/excel`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setExportInventoryExcelData(data));
      window.open(data, '_blank');
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setStockRawLoading(false));
  }
};

/**
 * @desc split Roll
 * @param payload (inventory)
 */

export const splitRollData =
  ({ roll_id, split_by_width, split_by_length, partition, weight_partition }) =>
  async dispatch => {
    try {
      dispatch(setStockRawLoading(true));
      const response = await axios.post(`/inventoryStock/splitRoll`, {
        roll_id: roll_id,
        split_by_width: split_by_width,
        split_by_length: split_by_length,
        partition: partition,
        weight_partition: weight_partition,
      });
      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
        dispatch(setIsStockTransfer(true));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setStockRawLoading(false));
    }
  };

/**
 * @desc Get Roll Consumption List
 */

export const getRollConsumptionList =
  (limit = 30, start = 1) =>
  async dispatch => {
    try {
      dispatch(setStockRawLoading(true));

      const response = await axios.post(
        `/list/rollConsumption/${start}/${limit}`,
      );
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setRollConsumptionList(data?.list || []));
        dispatch(setRollConsumptionCount(data?.count));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setStockRawLoading(false));
    }
  };

/**
 * @desc Get Export Roll Consumption File
 */

export const getExportRollConsumptionFile = key => async dispatch => {
  try {
    if (key) {
      dispatch(setStockRawExportLoading(true));
      let response;
      if (key === 'pdf')
        response = await axios.post(`export/rollStockConsumption/pdf`);
      else response = await axios.post(`export/rollStockConsumption/excel`);
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
    dispatch(setStockRawExportLoading(false));
  }
};

/*
 * @desc  stock Transfer
 * @param payload (inventory)
 */

export const stockTransferData = data => async dispatch => {
  try {
    dispatch(setStockRawLoading(true));
    const response = await axios.post(`/inventoryStockTransfer/transfer`, data);
    const { msg, err } = response.data;

    if (err === 0) {
      toast.success(msg);
      dispatch(setIsStockTransfer(true));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setStockRawLoading(false));
  }
};

/**
 * @desc Get Export Ink Consumption File
 */

export const getExportInkConsumptionFile = key => async dispatch => {
  try {
    if (key) {
      dispatch(setStockRawExportLoading(true));
      let response;
      if (key === 'pdf')
        response = await axios.post(`export/inkStockConsumption/pdf`);
      else response = await axios.post(`export/inkStockConsumption/excel`);
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
    dispatch(setStockRawExportLoading(false));
  }
};

export const stockConsumptionData = data => async dispatch => {
  try {
    dispatch(setStockRawLoading(true));
    const response = await axios.post(
      `/inventoryStockConsumption/consumption`,
      data,
    );
    const { msg, err } = response.data;

    if (err === 0) {
      toast.success(msg);
      dispatch(setIsStockTransfer(true));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setStockRawLoading(false));
  }
};

/**
 * @desc Get Ink Consumption List
 */

export const getInkConsumptionList =
  (limit = 30, start = 1) =>
  async dispatch => {
    try {
      dispatch(setStockRawLoading(true));

      const response = await axios.post(
        `/list/inkConsumption/${start}/${limit}`,
      );
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setInkConsumptionList(data?.list || []));
        dispatch(setInkConsumptionCount(data?.count));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setStockRawLoading(false));
    }
  };
