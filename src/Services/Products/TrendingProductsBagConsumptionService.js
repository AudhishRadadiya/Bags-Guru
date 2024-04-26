import { getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setBagProdConsumpLoading,
  setBagTypeChartDataOfBag,
  setIndustryChartDataOfBag,
  setLaminationTypeChartDataOfBag,
  setPrintTypeChartDataOfBag,
} from 'Store/Reducers/Products/BagAndProductConsumptionSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc Get Bag Type Chart Data Of Bag
 */
export const getBagTypeChartDataOfBag = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setBagProdConsumpLoading(true));
      // const updated = {
      //   start_date: getDMYDateFormat(payload[0]),
      //   end_date: getDMYDateFormat(payload[1]),
      // };
      const updated = {
        start_date: getDMYDateFormat(payload?.startDate),
        end_date: getDMYDateFormat(payload?.endDate),
      };

      if (!updated?.start_date && !updated?.end_date) {
        return;
      }

      const response = await axios.post(`/chart/bag/bagType`, updated);
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setBagTypeChartDataOfBag(data));
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
    dispatch(setBagProdConsumpLoading(false));
  }
};

/**
 * @desc Get Industry Chart Data Of Bag
 */
export const getIndustryChartDataOfBag = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setBagProdConsumpLoading(true));

      // const updated = {
      //   start_date: getDMYDateFormat(payload[0]),
      //   end_date: getDMYDateFormat(payload[1]),
      // };
      const updated = {
        start_date: getDMYDateFormat(payload?.startDate),
        end_date: getDMYDateFormat(payload?.endDate),
      };

      if (!updated?.start_date && !updated?.end_date) {
        return;
      }
      const response = await axios.post(`/chart/bag/industry`, updated);
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setIndustryChartDataOfBag(data));
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
    dispatch(setBagProdConsumpLoading(false));
  }
};

/**
 * @desc Get Bag Type Chart Data Of Bag
 */
export const getPrintTypeChartDataOfBag = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setBagProdConsumpLoading(true));
      // const updated = {
      //   start_date: getDMYDateFormat(payload[0]),
      //   end_date: getDMYDateFormat(payload[1]),
      // };
      const updated = {
        start_date: getDMYDateFormat(payload?.startDate),
        end_date: getDMYDateFormat(payload?.endDate),
      };

      if (!updated?.start_date && !updated?.end_date) {
        return;
      }

      const response = await axios.post(`/chart/bag/printType`, updated);
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setPrintTypeChartDataOfBag(data));
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
    dispatch(setBagProdConsumpLoading(false));
  }
};

/**
 * @desc Get Lamination Type Chart Data Of Bag
 */
export const getLaminationTypeChartDataOfBag = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setBagProdConsumpLoading(true));
      // const updated = {
      //   start_date: getDMYDateFormat(payload[0]),
      //   end_date: getDMYDateFormat(payload[1]),
      // };
      const updated = {
        start_date: getDMYDateFormat(payload?.startDate),
        end_date: getDMYDateFormat(payload?.endDate),
      };

      if (!updated?.start_date && !updated?.end_date) {
        return;
      }

      const response = await axios.post(`/chart/bag/laminated`, updated);
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setLaminationTypeChartDataOfBag(data));
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
    dispatch(setBagProdConsumpLoading(false));
  }
};
