import { getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setOrderJobByPartyList,
  setSalesInvoiceCount,
  setSalesInvoiceDetail,
  setSalesInvoiceJobLoading,
  setSalesInvoiceList,
  setSalesInvoiceLoading,
} from 'Store/Reducers/Sales/SalesInvoiceSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc get sales invoice
 */

export const getSalesInvoice =
  (limit = 30, start = 1, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setSalesInvoiceLoading(true));
      let obj = {};
      for (const key in filter) {
        if (
          (Array.isArray(filter[key]) && filter[key]?.length > 0) ||
          (typeof filter[key] === 'string' && filter[key] !== '')
        ) {
          obj[key] = filter[key];
        }
      }
      const response = await axios.post(`list/salesInvoice/${start}/${limit}`, {
        filter: filter,
        search: query,
        start_date: dates?.startDate ? getDMYDateFormat(dates?.startDate) : '',
        end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
      });

      const { data, msg, err } = response.data;

      if (err === 0) {
        dispatch(setSalesInvoiceList(data?.list || []));
        dispatch(setSalesInvoiceCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setSalesInvoiceLoading(false));
    }
  };

/**
 * @desc delete sales invoice
 */

export const deleteSalesInvoice = sales_invoice_id => async dispatch => {
  try {
    if (sales_invoice_id) {
      dispatch(setSalesInvoiceLoading(true));
      const response = await axios.post(`delete/salesInvoice`, {
        sales_invoice_id,
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
    dispatch(setSalesInvoiceLoading(false));
  }
};

/**
 * @desc get single sales invoice
 */

export const getSalesInvoiceDetail = sales_invoice_id => async dispatch => {
  try {
    if (sales_invoice_id) {
      dispatch(setSalesInvoiceLoading(true));
      const response = await axios.get(
        `/view/salesInvoice/${sales_invoice_id}`,
      );

      const { msg, err, data } = response.data;

      if (err === 0) {
        let updatedList =
          {
            ...data,
            total_amount: data?.total_amount
              ? data?.total_amount?.toFixed(2)
              : '0.00',
            discount: data?.discount ? data?.discount?.toFixed(2) : '0.00',
            final_amount: data?.final_amount
              ? data?.final_amount?.toFixed(2)
              : '0.00',
            tax_amount: data?.tax_amount
              ? data?.tax_amount?.toFixed(2)
              : '0.00',
          } || {};
        dispatch(setSalesInvoiceDetail(updatedList));
        return updatedList;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSalesInvoiceLoading(false));
  }
};

/**
 * @desc Get Export Sales Invoice File
 */

export const getSalesInvoicePdf = sales_invoice_id => async dispatch => {
  try {
    dispatch(setSalesInvoiceLoading(true));
    let response;
    response = await axios.post(`export/salesInvoicetopdf`, {
      sales_invoice_id: sales_invoice_id,
    });
    const { msg, err, data } = response.data;

    if (err === 0) {
      window.open(data?.file, '_blank');
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSalesInvoiceLoading(false));
  }
};

/**
 * @desc Get Mail Sales Invoice
 */

export const getMailSalesInvoice = sales_invoice_id => async dispatch => {
  try {
    dispatch(setSalesInvoiceLoading(true));
    let response;
    response = await axios.post(`mail/salesInvoice`, {
      sales_invoice_id: sales_invoice_id,
    });
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
    dispatch(setSalesInvoiceLoading(false));
  }
};

/**
 * @desc update sales Invoice
 */

export const updateSalesInvoice = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSalesInvoiceLoading(true));
      const response = await axios.post(`update/salesInvoice`, payload);

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
    dispatch(setSalesInvoiceLoading(false));
  }
};

/**
 * @desc create sales invoice
 */

export const createSalesInvoice = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSalesInvoiceLoading(true));
      const response = await axios.post(`add/salesInvoice`, payload);

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
    dispatch(setSalesInvoiceLoading(false));
  }
};

export const salesOrderJobByParty = (party_name, search) => async dispatch => {
  try {
    dispatch(setSalesInvoiceJobLoading(true));
    const response = await axios.post(`/list/salesOrderJobByParty`, {
      party_name: party_name,
      search: search,
    });

    const { data, msg, err } = response.data;

    const updated = data?.map(item => {
      return {
        ...item,
        disabled: false,
      };
    });

    if (err === 0) {
      dispatch(setOrderJobByPartyList(updated || []));
      return updated;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSalesInvoiceJobLoading(false));
  }
};
