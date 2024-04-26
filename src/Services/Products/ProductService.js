import { convertIntoNumber, getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setAllProductList,
  setMobileProductCount,
  setMobileProductList,
  setProductCRUDLoading,
  setProductCount,
  setProductExportLoading,
  setProductForProforma,
  setProductList,
  setProductLoading,
  setProductRateCount,
  setProductRateList,
  setProductTransferCount,
  setProductTransferList,
  setSelectedProduct,
  setViewProductDetailData,
} from 'Store/Reducers/Products/ProductSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc Get Show Mobile Product List
 */
export const getShowMobileProductList =
  (limit = 30, start = 1, query = '', filter = {}) =>
  async dispatch => {
    try {
      dispatch(setProductLoading(true));

      const response = await axios.post(
        `/list/mobileAppProduct/${start}/${limit}`,
        {
          filter: filter,
          search: query,
        },
      );
      const { err, data, msg } = response.data;

      if (err === 0) {
        let updated = data?.list?.map((x, i) => {
          let { warehouse, ...dataWithoutWarehouse } = x;

          let updated = {
            ...dataWithoutWarehouse,
            isSelected: false,
            main_image_str: x?.main_image ? 'Yes' : 'No',
            real_image_str: x?.real_image ? 'Yes' : 'No',
            water_image_str: x?.water_image ? 'Yes' : 'No',
            lamination_types: x?.is_laminated
              ? `Laminated | ${x?.lamination_type_name
                  ?.map(x => x?.name)
                  .join(', ')}`
              : 'Non Laminated',
          };

          let newData = {
            key: `${i}`,
            data: updated, // and here will come warehouse id as _id
            children: x?.warehouse?.map((y, j) => ({
              key: `${i}-${j}`,
              data: {
                ...updated,
                ...y,
                isSelected: false,
                main_qty: x?.qty,
                warehouse_id: y?._id,
                kg_qty: y?.weight,
                _id: x?._id, // main id
              },
            })),
          };

          // If there's only one child, remove the children array
          if (newData.children?.length === 1) {
            newData.data = newData.children[0].data;
            delete newData.children;
          } else {
            let otherChild = newData.children?.slice(1);
            newData.data = newData.children[0].data;
            newData.children = otherChild;
          }
          return newData;
        });
        dispatch(setMobileProductList(updated || []));
        dispatch(setMobileProductCount(data?.count || 0));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setProductLoading(false));
    }
  };

/**
 * @desc Get Product List
 */
export const getProductList =
  (limit = 30, start = 1, query = '', filter = {}) =>
  async dispatch => {
    try {
      dispatch(setProductLoading(true));

      const response = await axios.post(`/list/product/${start}/${limit}`, {
        filter: filter,
        search: query,
      });
      const { err, data, msg } = response.data;

      if (err === 0) {
        let updated = data?.list?.map((x, i) => {
          let { warehouse, ...dataWithoutWarehouse } = x;

          let updated = {
            ...dataWithoutWarehouse,
            isSelected: false,
            main_image_str: x?.main_image ? 'Yes' : 'No',
            real_image_str: x?.real_image ? 'Yes' : 'No',
            water_image_str: x?.water_image ? 'Yes' : 'No',
            lamination_types: x?.is_laminated
              ? `Laminated | ${x?.lamination_type_name
                  ?.map(x => x?.name)
                  .join(', ')}`
              : 'Non Laminated',
          };

          let newData = {
            key: `${i}`,
            data: updated, // and here will come warehouse id as _id
            children: x?.warehouse?.map((y, j) => ({
              key: `${i}-${j}`,
              data: {
                ...updated,
                ...y,
                isSelected: false,
                main_qty: x?.qty,
                warehouse_id: y?._id,
                kg_qty: convertIntoNumber(y?.weight),
                _id: x?._id, // main id
              },
              isChild: true,
            })),
          };

          // If there's only one child, remove the children array
          if (newData.children?.length === 1) {
            newData.data = newData.children[0].data;
            delete newData.children;
          } else {
            let otherChild = newData.children?.slice(1);
            newData.data = newData.children[0].data;
            newData.children = otherChild;
          }
          return newData;
        });
        let newList = data?.list?.map((x, i) => {
          return { ...x, isSelected: false };
        });
        dispatch(setAllProductList(data?.list || []));
        dispatch(setProductList(updated || []));
        dispatch(setProductForProforma(newList || []));
        dispatch(setProductCount(data?.count || 0));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setProductLoading(false));
    }
  };

/**
 * @desc Delete Product
 */
export const deleteProduct = product_id => async dispatch => {
  try {
    if (product_id) {
      dispatch(setProductCRUDLoading(true));

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
    dispatch(setProductCRUDLoading(false));
  }
};

/**
 * @desc Get Export Product File
 */

export const getExportProductFile =
  (key, showMobileChecked) => async dispatch => {
    try {
      if (key) {
        dispatch(setProductExportLoading(true));
        let response;
        if (showMobileChecked) {
          if (key === 'pdf')
            response = await axios.post(`export/mobileAppProduct/pdf`);
          else response = await axios.post(`export/mobileAppProduct/excel`);
        } else {
          if (key === 'pdf') response = await axios.post(`export/product/pdf`);
          else response = await axios.post(`export/product/excel`);
        }
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
      dispatch(setProductExportLoading(false));
    }
  };

/**
 * @desc Get a Product
 */
export const getProductItem = (product_id, isDuplicated) => async dispatch => {
  try {
    if (product_id) {
      dispatch(setProductLoading(true));

      const response = await axios.get(`/view/product/${product_id}`);
      const { msg, err, data } = response.data;

      if (err === 0) {
        // if (isDuplicated) delete data['_id'];

        let updated = {
          is_duplicated: isDuplicated ? true : false,
          is_laminated: data?.is_laminated ? 1 : 0,
          notification_to_print: data?.notification_to_print ? 1 : 0,
          solid_patch_cylinder: data?.solid_patch_cylinder
            ? data?.solid_patch_cylinder
            : '',
          solid_patch_widht: data?.solid_patch_widht ? 1 : 0,
          substrate_print: data?.substrate_print ? 1 : 0,
          bag_without_order: data?.bag_without_order ? 1 : 0,
          product_show_mobile: data?.product_show_mobile ? 1 : 0,
          bale_packing: data?.bale_packing ? 1 : 0,
          carton_packing: data?.carton_packing ? 1 : 0,
          no_white_patch_cylinder: data?.no_white_patch_cylinder ? 1 : 0,
          new_white_patch_cylinder: data?.new_white_patch_cylinder ? 1 : 0,
          is_double_sided_tape: data?.is_double_sided_tape ? 1 : 0,
          old_white_patch_cylinder: data?.old_white_patch_cylinder ? 1 : 0,
          new_cylinder_width: data?.new_cylinder_width?.split(
            data?.design_name + '-',
          )?.[1],
        };

        if (isDuplicated) {
          let { _id, ...rest } = data;
          updated = { ...rest, ...updated };
        } else {
          updated = {
            ...data,
            ...updated,
          };
        }

        dispatch(setSelectedProduct(updated || []));
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
    dispatch(setProductLoading(false));
  }
};
/**
 * @desc view product detail by id
 */
export const getProductDetailById = product_id => async dispatch => {
  try {
    if (product_id) {
      // dispatch(setProductLoading(true));

      const response = await axios.get(`/viewDetail/product/${product_id}`);
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setViewProductDetailData(data || {}));
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
    // dispatch(setProductLoading(false));
  }
};
/**
 * @desc Selected Product Transfer to another warehouse
 * @param (payload)
 */
export const sendProductTransfer = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setProductCRUDLoading(true));

      const response = await axios.post(`/stock/transfer`, payload);
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
    dispatch(setProductCRUDLoading(false));
  }
};

/**
 * @desc Create Product
 */
export const createProduct = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setProductLoading(true));

      const response = await axios.post(`/add/product`, payload);
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
    dispatch(setProductLoading(false));
  }
};

/**
 * @desc Update Product
 */
export const updateProduct = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setProductLoading(true));

      const response = await axios.post(`/update/product`, payload);
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
    dispatch(setProductLoading(false));
  }
};

/**
 * @desc Add Water Mark To Image
 * @param (image url)
 */
export const addWaterMarkToImage = image => async dispatch => {
  try {
    if (image) {
      dispatch(setProductLoading(true));

      const response = await axios.post(`/product/addwatermark`, { image });
      const { msg, err, data } = response.data;

      if (err === 0) {
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
    dispatch(setProductLoading(false));
  }
};

/**
 * @desc Get Product Transfer List
 */
export const getProductTransferList =
  (limit = 30, start = 1, query = '', filter = {}, dates) =>
  async dispatch => {
    try {
      dispatch(setProductLoading(true));
      let obj = {};
      for (const key in filter) {
        if (
          (typeof filter[key] === 'string' && filter[key] !== '') ||
          (typeof filter[key] === 'number' && !isNaN(filter[key])) ||
          Array.isArray(filter[key])
        ) {
          if (
            key === 'transfer_date' &&
            new Date(filter[key])?.toString() === 'Invalid Date'
          ) {
            obj.transfer_date = '';
          } else {
            obj[key] = filter[key];
          }
        }
      }
      const response = await axios.post(`/list/transfer/${start}/${limit}`, {
        filter: obj,
        search: query,
        start_date: dates?.startDate ? getDMYDateFormat(dates?.startDate) : '',
        end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
      });
      const { err, data } = response.data;

      if (err === 0) {
        const updated = data?.list?.map(x => {
          return {
            ...x,
            transfer_date: x?.transfer_date?.split('T')?.[0],
          };
        });
        dispatch(setProductTransferList(updated || []));
        dispatch(setProductTransferCount(data?.count || []));
        return true;
      } else {
      }
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setProductLoading(false));
    }
  };

/**
 * @desc Delete Product Transfer
 */
export const deleteProductTransfer = product_id => async dispatch => {
  try {
    if (product_id) {
      dispatch(setProductCRUDLoading(true));

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
    dispatch(setProductCRUDLoading(false));
  }
};

/**
 * @desc Get Export Product Pdf
 */

export const getExportProductTransfer = key => async dispatch => {
  try {
    dispatch(setProductExportLoading(true));
    let response;
    if (key === 'pdf') response = await axios.post(`export/transfer/pdf`);
    else response = await axios.post(`export/transfer/excel`);
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
    dispatch(setProductExportLoading(false));
  }
};

/**
 * @desc Get Product Rate List
 */
export const getProductRateList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setProductLoading(true));

      const response = await axios.post(`/list/productRate/${start}/${limit}`, {
        search: query,
      });
      const { err, data, msg } = response.data;

      if (err === 0) {
        const updated = data?.list?.map(x => {
          return {
            ...x,
            main_image_str: x?.main_image ? 'Yes' : 'No',
            out_of_stock: x?.out_of_stock ? 1 : 0,
            sort_order: x?.sort_order >= 0 ? x?.sort_order : 0,
            size:
              x?.gusset !== 0
                ? `W ${x?.width} × H ${x?.height}  × G ${x?.gusset}`
                : `W ${x?.width} × H ${x?.height}`,
            lamination_types: x?.is_laminated
              ? `Laminated | ${x?.lamination_type_name
                  ?.map(x => x?.name)
                  .join(', ')}`
              : 'Non Laminated',
          };
        });
        dispatch(setProductRateList(updated || []));
        dispatch(setProductRateCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setProductLoading(false));
    }
  };

/**
 * @desc Get Export Product Files
 */

export const getExportProductRate = key => async dispatch => {
  try {
    dispatch(setProductExportLoading(true));
    let response;
    if (key === 'pdf') response = await axios.post(`export/productRate/pdf`);
    else response = await axios.post(`export/productRate/excel`);
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
    dispatch(setProductExportLoading(false));
  }
};

/**
 * @desc Save Product Rate
 */

export const saveProductRate = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setProductCRUDLoading(true));
      const response = await axios.post(`productRate/save`, {
        rate_list: payload,
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
    dispatch(setProductCRUDLoading(false));
  }
};
