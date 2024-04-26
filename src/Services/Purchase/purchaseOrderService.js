import { generateUniqueId, getDMYDateFormat, roastError } from 'Helper/Common';
import { setAddPurchaseEntryList } from 'Store/Reducers/Purchase/PurchaseEntryProgressSlice';
import {
  setEditPurchaseOrderLoading,
  setImportedPurchaseReceiveData,
  setJobForPOList,
  setPOTotalAmount,
  setPurchaseItemIdList,
  setPurchaseOrderCount,
  setPurchaseOrderDetail,
  setPurchaseOrderImportData,
  setPurchaseOrderList,
  setPurchaseOrderListByItemGroup,
  setPurchaseOrderListLoading,
  setPurchaseOrderLoading,
  setPurchaseOrderReceivedEntryCount,
  setPurchaseOrderReceivedEntryList,
  setPurchaseOrderReceivedList,
  setRollRequirementCount,
  setRollRequirementList,
  setRollRequirementListLoading,
  setRollRequirementLoading,
  setRollStockWithoutOrderList,
  setSupplierList,
  setViewPurchaseOrderList,
} from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc get purchase order list
 */

export const getPurchaseOrderList =
  (limit = 30, start = 1, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setPurchaseOrderListLoading(true));
      let obj = {};
      for (const key in filter) {
        if (
          (Array.isArray(filter[key]) && filter[key]?.length > 0) ||
          (typeof filter[key] === 'string' && filter[key] !== '')
        ) {
          obj[key] = filter[key];
        }
      }
      const response = await axios.post(
        `list/purchaseOrder/${start}/${limit}`,
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
      let updated = data?.list?.map(x => {
        return {
          ...x,
          roll_available_str:
            x?.roll_available === 2
              ? 'PART'
              : x?.roll_available === 1
              ? 'YES'
              : 'NO',
          hndl_str: x?.hndl ? 'YES' : 'NO',
          old_str_str: x?.old_str ? 'YES' : 'NO',
          str_ord_str:
            x?.str_ord === 2 ? 'SENT' : x?.str_ord === 1 ? 'YES' : 'NO',
          str_rcv_str: x?.str_rcv ? 'YES' : 'NO',
          print_str: x?.print ? 'YES' : 'NO',
          bag_made_str: x?.bag_made ? 'YES' : 'NO',
          bag_sent_str: x?.bag_sent ? 'YES' : 'NO',
          lr_sent_str: x?.lr_sent ? 'YES' : 'NO',
          is_laminated_str: x?.is_laminated ? 'LAMINATED' : 'NON LAMINATED',
          size_str:
            x?.gusset !== 0
              ? `W ${x?.width} × H ${x?.height}  × G ${x?.gusset}`
              : `W ${x?.width} × H ${x?.height}`,
        };
      });

      // const POTotalAmount = data?.list.reduce(
      //   (acc, curr) => acc + convertThousandToNumeric(curr?.total),
      //   0,
      // );

      if (err === 0) {
        dispatch(setPOTotalAmount(data?.total_amount));
        dispatch(setPurchaseOrderList(updated || []));
        dispatch(setPurchaseOrderCount(data?.count || 0));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setPurchaseOrderListLoading(false));
    }
  };

/**
 * @desc get supplier list
 */

export const getSupplierList =
  (limit = 30, start = 1, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setPurchaseOrderLoading(true));

      const response = await axios.get(`list/supplier`);

      const { data, msg, err } = response.data;
      let updated = data?.map(x => {
        return {
          ...x,
          label: x?.party_name,
          value: x?._id,
        };
      });
      if (err === 0) {
        dispatch(setSupplierList(updated || []));
        return updated;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setPurchaseOrderLoading(false));
    }
  };

/**
 * @desc Add Purchase Order
 */

export const addPurchaseOrder = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setPurchaseOrderLoading(true));
      const response = await axios.post(`add/purchaseOrder`, payload);

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
    dispatch(setPurchaseOrderLoading(false));
  }
};

/**
 * @desc Delete Purchase Order
 */

export const deletePurchaseOrder = purchase_id => async dispatch => {
  try {
    if (purchase_id) {
      dispatch(setPurchaseOrderLoading(true));
      const response = await axios.post(`delete/purchaseOrder`, {
        purchase_id,
      });

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
    dispatch(setPurchaseOrderLoading(false));
  }
};

export const getPurchaseItemIdList = id => async dispatch => {
  try {
    dispatch(setPurchaseOrderLoading(true));
    const response = await axios.get(`view/purchaseReceiveOrder/${id}`);
    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setPurchaseItemIdList(data || {}));
      return data;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setPurchaseOrderLoading(false));
  }
};

/**
 * @desc  view purchase order by id
 */
export const getPurchaseOrderById = purchase_id => async dispatch => {
  try {
    if (purchase_id) {
      dispatch(setEditPurchaseOrderLoading(true));

      const response = await axios.get(`view/purchaseOrder/${purchase_id}`);
      const { err, data, msg } = response.data;

      if (err === 0) {
        dispatch(setPurchaseOrderDetail(data || {}));
        return data;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setEditPurchaseOrderLoading(false));
  }
};

/**
 * @desc Update Purchase Order
 */

export const updatePurchaseOrder = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setPurchaseOrderLoading(true));
      const response = await axios.post(`update/purchaseOrder`, payload);

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
    dispatch(setPurchaseOrderLoading(false));
  }
};

/**
 * @desc Export Partition Pdf
 */

export const exportPartitionPdf = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setPurchaseOrderLoading(true));
      const response = await axios.post(`export/partition/pdf`, payload);

      const { msg, err, data } = response.data;

      if (err === 0) {
        window.open(data, '_blank');
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
    dispatch(setPurchaseOrderLoading(false));
  }
};

export const purchaseOrderReceived = payload => async dispatch => {
  try {
    dispatch(setPurchaseOrderLoading(true));
    const response = await axios.post('add/purchaseReceived', payload);
    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setPurchaseOrderReceivedList(data || []));
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
    dispatch(setPurchaseOrderLoading(false));
  }
};

export const getPurchaseReceivedOrderEntryList =
  (start = 1, limit = 30, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setPurchaseOrderLoading(true));
      const response = await axios.post(
        `list/purchaseOrderEntry/${start}/${limit}`,
        {
          filter: filter,
          search: query,
          start_date: dates?.startDate
            ? getDMYDateFormat(dates?.startDate)
            : '',
          end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
        },
      );
      const { msg, err, data } = response.data;
      const result = { ...data };

      const updatedData = result?.list?.map((item, i) => {
        return {
          ...item,
          data_id: generateUniqueId(),
        };
      });

      if (err === 0) {
        dispatch(setPurchaseOrderReceivedEntryList(updatedData || []));
        dispatch(setPurchaseOrderReceivedEntryCount(data?.count));
        return data;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setPurchaseOrderLoading(false));
    }
  };

// Api For NL Requirement

/**
 * @desc get list NL roll requirement
 */

export const getNlRollRequirement =
  (limit = 30, start = 1, query, filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setRollRequirementListLoading(true));
      let obj = {};
      for (const key in filter) {
        if (
          (Array.isArray(filter[key]) && filter[key]?.length > 0) ||
          (typeof filter[key] === 'string' && filter[key] !== '')
        ) {
          obj[key] = filter[key];
        }
      }
      const response = await axios.post(
        `list/rollRequirement/${start}/${limit}`,
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

      if (err === 0) {
        dispatch(setRollRequirementList(data?.list || []));
        dispatch(setRollRequirementCount(data?.count || 0));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setRollRequirementListLoading(false));
    }
  };

/**
 * @desc Roll Stock Without Order
 */

export const getRollStockWithoutOrderList =
  (limit = 30, start = 1, query, filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setRollRequirementListLoading(true));
      const response = await axios.post(
        `/list/rollStockWithoutOrder/${start}/${limit}`,
        {
          filter: filter,
          search: query,
          start_date: dates?.startDate
            ? getDMYDateFormat(dates?.startDate)
            : '',
          end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
        },
      );

      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setRollStockWithoutOrderList(data));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setRollRequirementListLoading(false));
    }
  };

/**
 * @desc Export roll requirement pdf
 */

export const exportRollRequirementPdf = () => async dispatch => {
  try {
    dispatch(setRollRequirementLoading(true));
    const response = await axios.post(`export/rollRequirement/pdf`);

    const { msg, err, data } = response.data;

    if (err === 0) {
      window.open(data, '_blank');
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
    dispatch(setRollRequirementLoading(false));
  }
};

/**
 * @desc Export Stock Without Order pdf
 */

export const exportStockWithoutOrderPdf = () => async dispatch => {
  try {
    dispatch(setRollRequirementLoading(true));
    const response = await axios.post(`export/stockWithoutOrder/pdf`);

    const { msg, err, data } = response.data;

    if (err === 0) {
      window.open(data, '_blank');
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
    dispatch(setRollRequirementLoading(false));
  }
};

/**
 * @desc Export Stock Without Order excel
 */

export const exportStockWithoutOrderExcel = () => async dispatch => {
  try {
    dispatch(setRollRequirementLoading(true));
    const response = await axios.post(`export/stockWithoutOrder/excel`);

    const { msg, err, data } = response.data;

    if (err === 0) {
      window.open(data, '_blank');
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
    dispatch(setRollRequirementLoading(false));
  }
};

/**
 * @desc Export roll requirement excel
 */

export const exportRollRequirementExcel = () => async dispatch => {
  try {
    dispatch(setRollRequirementLoading(true));
    const response = await axios.post(`export/rollRequirement/excel`);

    const { msg, err, data } = response.data;

    if (err === 0) {
      window.open(data, '_blank');
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
    dispatch(setRollRequirementLoading(false));
  }
};

export const importPurchaseOrderReceived = payload => async dispatch => {
  try {
    dispatch(setPurchaseOrderLoading(true));
    const response = await axios.post('import/purchaseReceivedEntry', payload);
    const { msg, err, data } = response.data;
    if (err === 0) {
      const updatedObj = { id: data?.random_id, total: data?.total, count: 0 };
      dispatch(setImportedPurchaseReceiveData(data));
      dispatch(setAddPurchaseEntryList(updatedObj));
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
    dispatch(setPurchaseOrderLoading(false));
  }
};

export const cancelPurchaseOrder = id => async dispatch => {
  try {
    dispatch(setPurchaseOrderLoading(true));
    const response = await axios.post('cancel/purchaseOrder', {
      purchase_id: id,
    });
    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setImportedPurchaseReceiveData(data || []));
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
    dispatch(setPurchaseOrderLoading(false));
  }
};

/**
 * @desc job list for purchase order
 */

export const getJobForPurchaseOrderList =
  (query = '') =>
  async dispatch => {
    try {
      dispatch(setPurchaseOrderListLoading(true));
      const response = await axios.post(`list/jobForPurchaseOrder`, {
        search: query,
      });

      const { data, msg, err } = response.data;
      let updated = data?.map(x => {
        return {
          ...x,
          is_enabled: false,
          size_str:
            x?.gusset !== 0
              ? `W ${x?.width} × H ${x?.height}  × G ${x?.gusset}`
              : `W ${x?.width} × H ${x?.height}`,
        };
      });
      if (err === 0) {
        dispatch(setJobForPOList(updated || []));
        return updated;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setPurchaseOrderListLoading(false));
    }
  };

/**
 * @desc  get detail view purchase order by id
 */
export const getDetailViewPurchaseOrderById = purchase_id => async dispatch => {
  try {
    if (purchase_id) {
      // dispatch(setPurchaseOrderLoading(true));
      dispatch(setEditPurchaseOrderLoading(true));

      const response = await axios.get(
        `view/purchaseOrderDetailView/${purchase_id}`,
      );
      const { err, data, msg } = response.data;

      if (err === 0) {
        dispatch(setViewPurchaseOrderList(data || {}));
        return data;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    // dispatch(setPurchaseOrderLoading(false));
    dispatch(setEditPurchaseOrderLoading(false));
  }
};

/**
 * @desc update mark as receive status
 */
export const updateMarkAsReceiveStatus = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setPurchaseOrderLoading(true));
      const response = await axios.post(
        `update/purchaseOrderReceiveStatus`,
        payload,
      );
      const { err, data, msg } = response.data;

      if (err === 0) {
        toast.success(msg);
        return data;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setPurchaseOrderLoading(false));
  }
};

/**
 * @desc Get Purchase Order List By Item Group
 */
export const getPurchaseOrderByItemGroup = id => async dispatch => {
  try {
    if (id) {
      dispatch(setPurchaseOrderLoading(true));

      const response = await axios.post(`/list/purchaseOrderByItemGroup`, {
        item_group: id,
      });
      const { err, data, msg } = response.data;

      const updatedList = data.map(item => {
        return {
          label: item?.po_number,
          value: item?._id,
        };
      });

      if (err === 0) {
        dispatch(setPurchaseOrderListByItemGroup(updatedList || []));
        return data;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setPurchaseOrderLoading(false));
  }
};

/**
 * @desc Get Import Excel File
 */
export const getImportExcelFile = payload => async (dispatch, getState) => {
  const reducerState = getState();
  const { purchaseOrder } = reducerState;
  try {
    dispatch(setPurchaseOrderLoading(true));

    const response = await axios.post(`/import/createExcel`, payload);
    const { err, data, msg } = response.data;

    if (err === 0) {
      dispatch(
        setPurchaseOrderImportData({
          ...purchaseOrder.purchaseOrderImportData,
          purchaseOrderImportExcel: data,
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
    dispatch(setPurchaseOrderLoading(false));
  }
};

/**
 * @desc  Generate Pre-Printed Roll PDF
 */
export const generatePrePrintedRollPDF = id => async dispatch => {
  try {
    dispatch(setPurchaseOrderLoading(true));
    const response = await axios.post('pdf/prePrintedRoll', {
      purchase_id: id,
    });
    const { err, data, msg } = response.data;
    if (err === 0) {
      window.open(data?.file, '_blank');
      return data;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setPurchaseOrderLoading(false));
  }
};

/**
 * @desc  Generate Common Item Group PDF
 */
export const generateCommonItemGroupPDF = id => async dispatch => {
  try {
    dispatch(setPurchaseOrderLoading(true));
    const response = await axios.post('pdf/common', {
      purchase_id: id,
    });
    const { err, data, msg } = response.data;
    if (err === 0) {
      window.open(data?.file, '_blank');
      return data;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setPurchaseOrderLoading(false));
  }
};
