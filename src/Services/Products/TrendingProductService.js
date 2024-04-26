import { roastError } from 'Helper/Common';
import {
  setTrendingProductCRUDLoading,
  setTrendingProductCount,
  setTrendingProductExportLoading,
  setTrendingProductList,
  setTrendingProductLoading,
} from 'Store/Reducers/Products/TrendingProductSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc Get Trending Product List
 */
export const getTrendingProductList =
  (limit = 30, start = 1, query = '', filter = {}) =>
  async dispatch => {
    try {
      dispatch(setTrendingProductLoading(true));

      const response = await axios.post(
        `/list/trending/product/${start}/${limit}`,
        {
          filter: filter,
          search: query,
        },
      );
      const { msg, err, data } = response.data;

      if (err === 0) {
        const updated = data?.list?.map(x => {
          return {
            ...x,
            product_detail: {
              ...x?.product_detail,

              size_gsm:
                x?.product_detail.gusset !== 0
                  ? `W ${x?.product_detail?.width} × H ${x?.product_detail?.height} × G ${x?.product_detail?.gusset}`
                  : `W ${x?.product_detail?.width} × H ${x?.product_detail?.height}`,
            },
            lamination_type: x?.product_detail?.is_laminated
              ? `Laminated | ${x?.product_detail?.lamination_type_name
                  ?.map(x => x)
                  .join(', ')}`
              : 'Non Laminated',
          };
        });
        dispatch(setTrendingProductList(updated || []));
        dispatch(setTrendingProductCount(data?.count || 0));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setTrendingProductLoading(false));
    }
  };

/**
 * @desc Get Export Trending Product File
 */

export const getExportTrendingProductFile = key => async dispatch => {
  try {
    if (key) {
      dispatch(setTrendingProductExportLoading(true));
      let response;
      if (key === 'pdf')
        response = await axios.post(`export/trending/product/pdf`);
      else response = await axios.post(`export/trending/product/excel`);
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
    dispatch(setTrendingProductExportLoading(false));
  }
};

/**
 * @desc Delete Product
 */
export const deleteProduct = product_id => async dispatch => {
  try {
    if (product_id) {
      dispatch(setTrendingProductCRUDLoading(true));

      const response = await axios.post(`/delete/product`, { product_id });
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
    dispatch(setTrendingProductCRUDLoading(false));
  }
};
