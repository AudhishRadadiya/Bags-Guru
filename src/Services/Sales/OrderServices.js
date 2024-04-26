import { getStatusText } from 'Components/Sales/Order';
import { getDMYDateFormat, roastError } from 'Helper/Common';
import { setAllCommon } from 'Store/Reducers/Common';
import {
  setPreviousTransporter,
  setProductFromBagSizeList,
  setProductSizeList,
  setSalesJobOrderDetail,
  setSalesOrderCRUDLoading,
  setSalesOrderCount,
  setSalesOrderExportLoading,
  setSalesOrderJobCRUDLoading,
  setSalesOrderJobsCount,
  setSalesOrderList,
  setSalesOrderListLoading,
  setSalesOrderLoading,
  setSalesOrderOnlyJobsList,
  setSelectedAddSalesIvoiceData,
  setSelectedOrder,
} from 'Store/Reducers/Sales/SalesOrderSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc Get Sales Orders List
 */
export const getSalesOrdersList =
  (limit = 30, start = 1, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setSalesOrderListLoading(true));

      let obj = {};
      for (const key in filter) {
        if (
          (Array.isArray(filter[key]) && filter[key]?.length > 0) ||
          (typeof filter[key] === 'string' && filter[key] !== '')
        ) {
          obj[key] = filter[key];
        }
      }

      const response = await axios.post(`/list/salesOrder/${start}/${limit}`, {
        filter: filter,
        search: query,
        start_date: dates?.startDate ? getDMYDateFormat(dates?.startDate) : '',
        end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
      });

      const { err, data, msg } = response.data;

      if (err === 0) {
        let updated = data?.list?.map((x, i) => {
          return {
            ...x,
            is_cc_attach_str: x?.is_cc_attach ? 'Yes' : 'No',
            multiple_billing_str: x?.multiple_billing ? 'Yes' : 'No',
            dispatch_on_invoice_str: x?.dispatch_on_invoice ? 'Yes' : 'No',
            status_str: getStatusText(x?.status ? x?.status : 0),
            dispatch_after_payment_str: x?.dispatch_after_payment
              ? 'Yes'
              : 'No',
            order_job: x?.order_job?.map(y => {
              return {
                ...y,
                size_gsm: `W ${y?.bag_detail?.width} × H ${y?.bag_detail?.height} × G ${y?.bag_detail?.gusset} (${y?.bag_detail?.gsm} GSM)`,
                status_str: getStatusText(y?.status ? y?.status : 0),
                kg_rate: y?.kg_rate ? y?.kg_rate : '',
                pc_rate: y?.pc_rate ? y?.pc_rate : '',
                rate: y?.rate ? y?.rate : '',
                qty: y?.qty ? y?.qty : '',
              };
            }),
          };
        });

        dispatch(setSalesOrderList(updated || []));
        dispatch(setSalesOrderCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setSalesOrderListLoading(false));
    }
  };

/**
 * @desc Get Sales Orders Jobs List
 */
export const getSalesOrderJobsList =
  (limit = 30, start = 1, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setSalesOrderListLoading(true));

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
        `/list/salesOrderJob/${start}/${limit}`,
        {
          filter: filter,
          search: query,
          start_date: dates?.[0] ? getDMYDateFormat(dates?.[0]) : '',
          end_date: dates?.[1] ? getDMYDateFormat(dates?.[1]) : '',
        },
      );
      const { err, data, msg } = response.data;

      if (err === 0) {
        let updated = data?.list?.map((x, i) => {
          return {
            ...x,
            size_gsm: `W ${x?.bag_detail?.width} × H ${x?.bag_detail?.height} × G ${x?.bag_detail?.gusset} (${x?.bag_detail?.gsm} GSM)`,
            status_str: getStatusText(x?.status),
            job_date: getDMYDateFormat(new Date(x?.job_date)),
            kg_rate: x?.kg_rate ? x?.kg_rate : '',
            pc_rate: x?.pc_rate ? x?.pc_rate : '',
            rate: x?.rate ? x?.rate : '',
            qty: x?.qty ? x?.qty : '',
          };
        });

        dispatch(setSalesOrderOnlyJobsList(updated || []));
        dispatch(setSalesOrderJobsCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setSalesOrderListLoading(false));
    }
  };

/**
 * @desc Get Export Sales Order File
 */

export const getExportSalesOrder = (file_format, payload) => async dispatch => {
  try {
    dispatch(setSalesOrderExportLoading(true));
    let response;
    if (file_format === 'excel')
      response = await axios.post(`export/salesOrderWithJob/excel`, payload);
    else response = await axios.post(`export/salesOrderWithJob/pdf`);

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
    dispatch(setSalesOrderExportLoading(false));
  }
};
/**
 * @desc Get Export Sales Order Jobs File
 */

export const getExportSalesOrderJobs =
  (file_format, payload) => async dispatch => {
    try {
      dispatch(setSalesOrderExportLoading(true));
      let response;
      if (file_format === 'excel')
        response = await axios.post(`export/salesOrderJob/excel`, payload);
      else response = await axios.post(`export/salesOrderJob/pdf`);

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
      dispatch(setSalesOrderExportLoading(false));
    }
  };

/**
 * @desc Update Sales Order
 */

export const updateSalesOrder = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`update/salesOrder`, payload);
      const { msg, err, data } = response.data;
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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc Create Sales Order
 */

export const createSalesOrder = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`add/salesOrder`, payload);

      const { msg, err, data } = response.data;

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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc Repeat Sales Order
 */

export const repeatSalesOrder = order_id => async dispatch => {
  try {
    if (order_id) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`repeat/salesOrder`, {
        order_id,
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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc Cancel Sales Order
 */

export const cancelSalesOrder = order_id => async dispatch => {
  try {
    if (order_id) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`cancel/salesOrder`, {
        order_id,
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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc Update Status of Sales Order
 */

export const updateStatusSalesOrder = (order_id, status) => async dispatch => {
  try {
    if (order_id && status) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`update/status/salesOrder`, {
        order_id,
        status,
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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc Update Status of Sales Order Job
 */

export const updateStatusSalesOrderJob = (job_id, status) => async dispatch => {
  try {
    if (job_id && status) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`update/status/salesOrderJob`, {
        job_id,
        status,
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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc Get Sales Orders Item
 */
export const getSalesOrderDetail = id => async dispatch => {
  try {
    if (id) {
      dispatch(setSalesOrderCRUDLoading(true));

      const response = await axios.get(`/view/salesOrderDetail/${id}`);
      const { err, data, msg } = response.data;

      if (err === 0) {
        let updated = {
          ...data,
          order_date: data?.order_date ? new Date(data?.order_date) : '',
          due_date: data?.due_date ? new Date(data?.due_date) : '',
          dispatch_after_payment: data?.dispatch_after_payment ? 1 : 0,
          dispatch_on_invoice: data?.dispatch_on_invoice ? 1 : 0,
          multiple_billing: data?.multiple_billing ? 1 : 0,
          is_cancelled: data?.is_cancelled ? 1 : 0,
          is_cc_attach: data?.is_cc_attach ? 1 : 0,
          order_job: data?.order_job?.map(y => {
            return {
              ...y,
              kg_rate: y?.kg_rate ? y?.kg_rate : '',
              pc_rate: y?.pc_rate ? y?.pc_rate : '',
              rate: y?.rate ? y?.rate : '',
              qty: y?.qty ? y?.qty : '',
              stereo_charge: y?.stereo_charge ? y?.stereo_charge : '',
              roll: false,
              hndl: false,
              strOrd: false,
              strRcv: false,
              print: false,
              bagMade: false,
              bagSent: false,
              lrSent: false,
            };
          }),
        };
        dispatch(setSelectedAddSalesIvoiceData(updated || {}));
        return updated;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc Get Sales Orders Item
 */
export const getSalesOrdersItem = id => async dispatch => {
  try {
    if (id) {
      dispatch(setSalesOrderLoading(true));

      const response = await axios.get(`/view/salesOrder/${id}`);
      const { err, data, msg } = response.data;

      if (err === 0) {
        let updated = {
          ...data,
          order_date: data?.order_date ? new Date(data?.order_date) : '',
          due_date: data?.due_date ? new Date(data?.due_date) : '',
          dispatch_after_payment: data?.dispatch_after_payment ? 1 : 0,
          dispatch_on_invoice: data?.dispatch_on_invoice ? 1 : 0,
          multiple_billing: data?.multiple_billing ? 1 : 0,
          is_cancelled: data?.is_cancelled ? 1 : 0,
          is_cc_attach: data?.is_cc_attach ? 1 : 0,
          order_job: data?.order_job?.map(y => {
            return {
              ...y,
              kg_rate: y?.kg_rate ? y?.kg_rate : '',
              pc_rate: y?.pc_rate ? y?.pc_rate : '',
              rate: y?.rate ? y?.rate : '',
              qty: y?.qty ? y?.qty : '',
              stereo_charge: y?.stereo_charge ? y?.stereo_charge : '',
              roll: y?.mfgProcess?.roll_available
                ? y?.mfgProcess?.roll_available
                : 0,
              hndl: y?.mfgProcess?.hndl ? y?.mfgProcess?.hndl : false,
              oldStr: y?.mfgProcess?.old_str ? y?.mfgProcess?.old_str : false,
              strOrd: y?.mfgProcess?.str_ord ? y?.mfgProcess?.str_ord : 0,
              strRcv: y?.mfgProcess?.str_rcv ? y?.mfgProcess?.str_rcv : false,
              print: y?.mfgProcess?.print ? y?.mfgProcess?.print : false,
              bagMade: y?.mfgProcess?.bag_made
                ? y?.mfgProcess?.bag_made
                : false,
              bagSent: y?.mfgProcess?.bag_sent
                ? y?.mfgProcess?.bag_sent
                : false,
              lrSent: y?.mfgProcess?.lr_sent ? y?.mfgProcess?.lr_sent : false,
              roll_available_str:
                y?.mfgProcess?.roll_available === 2
                  ? 'PART'
                  : y?.mfgProcess?.roll_available === 1
                  ? 'YES'
                  : 'NO',
              hndl_str: y?.mfgProcess?.hndl ? 'YES' : 'NO',
              old_str_str: y?.mfgProcess?.old_str ? 'YES' : 'NO',
              str_ord_str:
                y?.mfgProcess?.str_ord === 2
                  ? 'SENT'
                  : y?.mfgProcess?.str_ord === 1
                  ? 'YES'
                  : 'NO',
              str_rcv_str: y?.mfgProcess?.str_rcv ? 'YES' : 'NO',
              print_str: y?.mfgProcess?.print ? 'YES' : 'NO',
              bag_made_str: y?.mfgProcess?.bag_made ? 'YES' : 'NO',
              bag_sent_str: y?.mfgProcess?.bag_sent ? 'YES' : 'NO',
              lr_sent_str: y?.mfgProcess?.lr_sent ? 'YES' : 'NO',
            };
          }),
        };
        dispatch(setSelectedOrder(updated || {}));
        return updated;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else if (err === 2) {
        // dispatch(isRoleAccess('url_is_not_access'));
        // navigate('/order');
        window.location.href = '/order';
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSalesOrderLoading(false));
  }
};

/**
 * @desc Delete Sales Order Job
 */

export const deleteSalesOrderJob = job_id => async dispatch => {
  try {
    if (job_id) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`delete/salesOrderJob`, { job_id });

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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc Create job
 */

export const createSalesOrderJob = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSalesOrderJobCRUDLoading(true));
      const response = await axios.post(`add/salesOrderJob`, payload);

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
    dispatch(setSalesOrderJobCRUDLoading(false));
  }
};

/**
 * @desc get single job
 */

export const getJobItem = job_id => async dispatch => {
  try {
    if (job_id) {
      dispatch(setSalesOrderJobCRUDLoading(true));
      const response = await axios.get(`/list/salesOrderJobByJobId/${job_id}`);

      const { msg, err, data } = response.data;

      if (err === 0) {
        let updated = {
          ...data,
          old_stereo: data?.old_stereo === true ? 1 : 0,
          unit_pc: data?.unit_pc === true ? 1 : 0,
          freight_inclusive_rate: data?.freight_inclusive_rate === true ? 1 : 0,
          notification_to_print: data?.notification_to_print === true ? 1 : 0,
        };
        dispatch(setSalesJobOrderDetail(updated || {}));
        return updated;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSalesOrderJobCRUDLoading(false));
  }
};

/**
 * @desc Update Sales Order Job
 */

export const updateSalesOrderJob = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`update/salesOrderJob`, payload);
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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc Delete Sales Order
 */

export const deleteSalesOrder = order_id => async dispatch => {
  try {
    if (order_id) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`delete/salesOrder`, { order_id });

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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc Get Product Size List
 */
export const getProductSizeList = () => async dispatch => {
  try {
    dispatch(setSalesOrderLoading(true));
    const response = await axios.get(`list/productsize`);

    const { err, data } = response.data;

    if (err === 0) {
      const updated = data?.map((x, i) => {
        return {
          ...x,
          str: `W${x?.width}” X H${x?.height}” X ${x?.gusset} (${x?.gsm}GSM)`,
        };
      });
      dispatch(setProductSizeList(updated));
      return updated;
    } else {
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSalesOrderLoading(false));
  }
};

/**
 * @desc Get Bag Size List
 * @param (width,height,gusset,gsm)
 */
export const getProductFromBagSizeList =
  (params, data) => async (dispatch, getState) => {
    const state = getState();
    const { salesOrder } = state;
    const productList = [...salesOrder?.productSizeList];

    const updated = productList?.reduce((acc, item) => {
      const isMatch = data?.some(abcItem => {
        return (
          abcItem.width === item.width &&
          abcItem.height === item.height &&
          abcItem.gusset === item.gusset &&
          abcItem.gsm === item.gsm
        );
      });

      if (isMatch) {
        acc.push({ ...item, isSelected: true });
      } else {
        acc.push({ ...item, isSelected: false });
      }
      return acc;
    }, []);
    dispatch(setProductSizeList(updated));

    try {
      if (params) {
        dispatch(setSalesOrderLoading(true));
        const response = await axios.post(`list/productFromBagSize`, params);

        const { msg, err, data } = response.data;
        if (err === 0) {
          const updated = data?.map(x => {
            return {
              ...x,
              isSelected: false,
              qty: '',
              rate: '',
              size_gsm: `W ${x?.width} × H ${x?.height} × G ${x?.gusset} (${x?.gsm} GSM)`,
            };
          });
          dispatch(setProductFromBagSizeList(updated));
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
      dispatch(setSalesOrderLoading(false));
    }
  };

/**
 * @desc Add Bag Order Job
 * @param (product_id,job_date,qty,rate)
 */
export const addBagOrderJob = payload => async dispatch => {
  try {
    if (payload) {
      if (!payload?.due_date) {
        toast.error('Please enter Delivery Date');
        return;
      } else if (!payload?.order_job?.filter(x => x?.qty)?.length) {
        toast.error('Please enter Valid Qty in selected product');
        return;
      }
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`add/bagOrderJob`, payload);

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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc get Previous Transporter
 */

export const getPreviousTransporter = party_name => async dispatch => {
  try {
    if (party_name) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`previous/transporter`, {
        party_name,
      });

      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setPreviousTransporter(data));
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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};

/**
 * @desc generate Sales invoice
 */

export const generateSalesInvoice = order_id => async dispatch => {
  try {
    if (order_id) {
      dispatch(setSalesOrderCRUDLoading(true));
      const response = await axios.post(`generate/salesInvoice`, {
        order_id,
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
    dispatch(setSalesOrderCRUDLoading(false));
  }
};
export const setOrderOperatorFilterAction =
  data => async (dispatch, getState) => {
    const { common } = getState();
    const { allCommon } = common;
    const orderOperatorState = allCommon?.orderOperator;

    dispatch(
      setAllCommon({
        ...allCommon,
        orderOperator: {
          ...orderOperatorState,
          orderOperatorFilter: {
            ...orderOperatorState?.orderOperatorFilter,
            filterCheckedData: [
              ...orderOperatorState?.orderOperatorFilter?.filterCheckedData,
              data,
            ],
            width: [
              ...orderOperatorState?.orderOperatorFilter?.width,
              data?.width,
            ],
            height: [
              ...orderOperatorState?.orderOperatorFilter?.height,
              data?.height,
            ],
            gusset: [
              ...orderOperatorState?.orderOperatorFilter?.gusset,
              data?.gusset,
            ],
            gsm: [...orderOperatorState?.orderOperatorFilter?.gsm, data?.gsm],
          },
        },
      }),
    );
  };

export const setFilteredListAction = data => async (dispatch, getState) => {
  const { common } = getState();
  const { allCommon } = common;
  const orderOperatorState = allCommon?.orderOperator;

  dispatch(
    setAllCommon({
      ...allCommon,
      orderOperator: {
        ...orderOperatorState,
        orderOperatorFilter: {
          ...orderOperatorState?.orderOperatorFilter,
          filteredList: data,
        },
      },
    }),
  );
};
