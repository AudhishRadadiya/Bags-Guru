import { getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setAddProformaPage,
  setProformaInvoiceCount,
  setProformaInvoiceDetail,
  setProformaInvoiceList,
  setProformaListLoading,
  setProformaLoading,
  setUpdateProformaPage,
} from 'Store/Reducers/Sales/ProformaInvoiceSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc create proforma invoice
 */

export const createProformaInvoice = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setProformaLoading(true));
      const response = await axios.post(`add/proformaInvoice`, payload);

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
    dispatch(setProformaLoading(false));
  }
};

/**
 * @desc get proforma invoice
 */

export const getProformaInvoice =
  (limit = 30, start = 1, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setProformaListLoading(true));
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
        `list/proformaInvoice/${start}/${limit}`,
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
        dispatch(setProformaInvoiceList(data?.list || []));
        dispatch(setProformaInvoiceCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setProformaListLoading(false));
    }
  };

/**
 * @desc delete proforma invoice
 */

export const deleteProformaInvoice = proforma_id => async dispatch => {
  try {
    if (proforma_id) {
      dispatch(setProformaLoading(true));
      const response = await axios.post(`delete/proformaInvoice`, {
        proforma_id,
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
    dispatch(setProformaLoading(false));
  }
};

/**
 * @desc add proforma to job
 */

export const addProformaToJob = proforma_id => async dispatch => {
  try {
    if (proforma_id) {
      dispatch(setProformaLoading(true));
      const response = await axios.post(`add/proformatojob`, {
        proforma_id,
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
    dispatch(setProformaLoading(false));
  }
};

/**
 * @desc update proforma Invoice
 */

export const updateProformaInvoice = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setProformaLoading(true));
      const response = await axios.post(`update/proformaInvoice`, payload);

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
    dispatch(setProformaLoading(false));
  }
};
/**
 * @desc get single proforma invoice
 */

export const getProformaDetail = proforma_id => async dispatch => {
  try {
    if (proforma_id) {
      dispatch(setProformaLoading(true));
      const response = await axios.get(`/view/proformaInvoice/${proforma_id}`);

      const { msg, err, data } = response.data;
      let updated = { ...data };

      updated = {
        ...data,
        total_amount: data?.total_amount ? data?.total_amount?.toFixed(2) : '',
        discount: data?.discount ? data?.discount?.toFixed(2) : '0.00',
        final_amount: data?.final_amount
          ? data?.final_amount?.toFixed(2)
          : '0.00',
        tax_amount: data?.tax_amount ? data?.tax_amount?.toFixed(2) : '0.00',
      };
      if (err === 0) {
        dispatch(setProformaInvoiceDetail(updated || {}));
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
    dispatch(setProformaLoading(false));
  }
};

/**
 * @desc Get Export Proforma Invoice File
 */

export const getProformaToPdf = proforma_id => async dispatch => {
  try {
    dispatch(setProformaLoading(true));
    let response;
    response = await axios.post(`export/proformatopdf`, {
      proforma_id: proforma_id,
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
    dispatch(setProformaLoading(false));
  }
};

/**
 * @desc Get Mail Proforma Invoice
 */

export const getMailProformaInvoice = proforma_id => async dispatch => {
  try {
    dispatch(setProformaLoading(true));
    let response;
    response = await axios.post(`mail/proforma`, {
      proforma_id: proforma_id,
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
    dispatch(setProformaLoading(false));
  }
};

export const proformaHandleChange =
  (locationPath, fieldName, fieldValue) => async (dispatch, getState) => {
    const state = getState();
    if (locationPath === 'update-proforma-invoice') {
      dispatch(
        setUpdateProformaPage({
          ...state.proformaInvoice.updateProformaPage,
          [fieldName]: fieldValue,
        }),
      );
    } else if (locationPath === 'add-proforma-invoice') {
      dispatch(
        setAddProformaPage({
          ...state.proformaInvoice.addProformaPage,
          [fieldName]: fieldValue,
        }),
      );
    }
  };
