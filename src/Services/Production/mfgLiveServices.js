import { getDMYDateFormat, roastError } from 'Helper/Common';
import {
  setMfgLiveLoading,
  setMfgLiveList,
  setMfgLiveDetail,
  setMfgLiveCount,
  setSuggestedProductList,
  setSuggestedRollList,
  setMfgLiveFilterList,
  setMfgProcessPrintingById,
  setUpdatedPrintStatus,
  setBagMadeData,
  setMfgLiveTotalQty,
  setMfgLivePrintingFilterList,
  setAllSuggestedRollList,
  setMfgLiveListLoading,
  setMfgSuggestedRollLoading,
  setMfgFilterListLoading,
  setMfgLiveAllData,
} from 'Store/Reducers/Production/mfgLiveSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setAllCommon } from 'Store/Reducers/Common';

/**
 * @desc get mfgLive list
 */

export const getmfgLiveList =
  (limit = 30, start = 1, query = '', filter = {}, dates, field_filter) =>
  async dispatch => {
    try {
      // dispatch(setMfgLiveLoading(true));
      dispatch(setMfgLiveListLoading(true));

      let obj = {};
      for (const key in filter) {
        if (
          (Array.isArray(filter[key]) && filter[key]?.length > 0) ||
          (typeof filter[key] === 'string' && filter[key] !== '')
        ) {
          obj[key] = filter[key];
        }
      }
      const response = await axios.post(`list/mfgProcess/${start}/${limit}`, {
        filter: filter,
        search: query,
        start_date: dates?.startDate ? getDMYDateFormat(dates?.startDate) : '',
        end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
        field_filter: field_filter,
      });

      const { data, msg, err } = response.data;
      let updated = data?.list?.map((x, i) => {
        return {
          ...x,
          srno: limit * (start - 1) + (i + 1),
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
      if (err === 0) {
        dispatch(setMfgLiveAllData(data));
        dispatch(setMfgLiveTotalQty(data?.total_qty || 0));
        dispatch(setMfgLiveList(updated || []));
        dispatch(setMfgLiveCount(data?.count || 0));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMfgLiveListLoading(false));
    }
  };

/**
 * @desc create mfgLive
 */

export const createMfgLive = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMfgLiveLoading(true));
      const response = await axios.post(`add/mfgProcess`, payload);

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
    dispatch(setMfgLiveLoading(false));
  }
};

/**
 * @desc update print Status
 */

export const updatePrintStatus = payload => async dispatch => {
  try {
    if (payload) {
      // dispatch(setMfgLiveLoading(true));
      dispatch(setMfgSuggestedRollLoading(true));
      const response = await axios.post(
        `/update/mfgProcess/printStatus`,
        payload,
      );

      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setUpdatedPrintStatus(data));
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
    // dispatch(setMfgLiveLoading(false));
    dispatch(setMfgSuggestedRollLoading(false));
  }
};

/**
 * @desc view mfg process by id
 */

export const viewMfgById = id => async dispatch => {
  try {
    if (id) {
      dispatch(setMfgLiveLoading(true));
      const response = await axios.get(`view/mfgProcess/${id}`);

      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setMfgLiveDetail(data || {}));
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
    dispatch(setMfgLiveLoading(false));
  }
};

/**
 * @desc view mfg process printing detailby id
 */

export const viewMfgProcessPrintingById =
  (print_technology_id, process_id) => async dispatch => {
    try {
      dispatch(setMfgSuggestedRollLoading(true));
      if (process_id && print_technology_id) {
        const response = await axios.post(`view/mfgProcess/printingDetail`, {
          print_technology_id: print_technology_id,
          process_id: process_id,
        });

        const { msg, err, data } = response.data;

        if (err === 0) {
          dispatch(setMfgProcessPrintingById(data || {}));
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
      // dispatch(setMfgLiveLoading(false));
      dispatch(setMfgSuggestedRollLoading(false));
    }
  };

/**
 * @desc update Factory Status
 */

export const updateFactoryStatus = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMfgLiveLoading(true));
      const response = await axios.post(
        `update/mfgProcess/factoryLocation`,
        payload,
      );

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
    dispatch(setMfgLiveLoading(false));
  }
};

/**
 * @desc list suggested product
 */

export const getSuggestedProductList = product_id => async dispatch => {
  try {
    // dispatch(setMfgLiveLoading(true));

    const response = await axios.post(`list/mfgProcess/suggestedProduct`, {
      product_id: product_id,
    });

    const { data, msg, err } = response.data;
    let updated = data?.map(x => {
      return {
        ...x,
        label: x?.product_code,
        value: x?._id,
      };
    });
    if (err === 0) {
      dispatch(setSuggestedProductList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    // dispatch(setMfgLiveLoading(false));
  }
};

/**
 * @desc list suggested roll
 */

export const getSuggestedRollList =
  (job_id, print_technology_id, print_field_filter) =>
  async (dispatch, getState) => {
    const reducerState = getState();
    const { common, mfgLive } = reducerState;

    // const mfgProcessPrintingData =
    //   mfgLive?.mfgProcessPrintingById?.roll_printed;

    const printFilterValues = common?.allCommon?.mfgLive?.print_field_filter;

    // Field_Filters are not empty:
    const hasNotEmptyArray = Object.values(printFilterValues).some(property => {
      return property.length > 0;
    });

    // If reset filter then this condition will be come :
    const hasEmptyObjKey = Object.keys(printFilterValues)?.length === 0;

    try {
      dispatch(setMfgSuggestedRollLoading(true));
      const response = await axios.post(`list/mfgProcess/suggestedRoll`, {
        job_id: job_id,
        print_technology_id: print_technology_id,
        // ...(hasNotEmptyArray && {
        //   field_filter: printFilterValues,
        // }),
        field_filter: print_field_filter,
      });

      const { data, filter, msg, err } = response.data;
      const filterData = { ...filter };

      const updated = data
        ?.map((item, index) => {
          const printTechnologyName = [];

          if (item?.flexo_print) {
            printTechnologyName.push('FLEXO PRINT');
          }
          if (item?.plain_print) {
            printTechnologyName.push('PLAIN PRINT');
          }
          if (item?.roto_print) {
            printTechnologyName.push('ROTO GRAVURE');
          }
          if (item?.rtor_print) {
            printTechnologyName.push('SCREEN PRINT (R 2 R)');
          }
          if (item?.semi_roto_print) {
            printTechnologyName.push('SEMI ROTO');
          }

          return {
            ...item,
            print_technology_name: printTechnologyName?.join(', '),
            // print_technology_name:
            //   mfgLive?.mfgProcessPrintingById?.print_technology,
            unique_id: index,
            is_cancelled: true,
            selected_date: '',
          };
        })
        ?.filter(data => data);

      const nonHiddenData = updated?.filter(data => {
        if (mfgLive?.assignedRollList?.length) {
          return mfgLive?.assignedRollList?.some(
            item => data?._id !== item?._id && !item?.is_hidden,
          );
        } else {
          return !data?.is_hidden;
        }
      });

      if (!hasNotEmptyArray && !hasEmptyObjKey) {
        Object.keys(mfgLive?.mfgLivePrintingFilterList).map(key => {
          filterData[key]?.forEach(value => {
            const keyValue =
              typeof value === 'string' ? value?.toLowerCase() : value;
            const findFilterData = mfgLive?.mfgLivePrintingFilterList[key]
              .filter(
                item =>
                  (typeof item.value === 'string'
                    ? item.value?.toLowerCase()
                    : item.value) === keyValue,
              )
              ?.map(itemValue => {
                return itemValue?.value;
              });

            filterData[key] = findFilterData;
          });

          // const checkFilter = mfgProcessPrintingData?.length > 0;

          // (mfgProcessPrintingData?.length > 0 && data?.length === 0)
          //   ? findFilterData && ['warehouse_name', 'material'].includes(key)
          //   : findFilterData;

          // filterData[key] = checkFilter ? [findFilterData?.value] : [];
        });
      }

      if (err === 0) {
        dispatch(setSuggestedRollList(nonHiddenData || []));
        dispatch(setAllSuggestedRollList(updated || []));
        if (!hasNotEmptyArray && !hasEmptyObjKey) {
          dispatch(
            setAllCommon({
              ...common?.allCommon,
              mfgLive: {
                ...common?.allCommon?.mfgLive,
                print_field_filter: filterData,
              },
            }),
          );
        }
        return response.data;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      // dispatch(setMfgLiveLoading(false));
      dispatch(setMfgSuggestedRollLoading(false));
    }
  };

/**
 * @desc view bag made detail
 */

export const viewBagMadeData = process_id => async dispatch => {
  try {
    dispatch(setMfgLiveLoading(true));

    const response = await axios.post(`view/mfgProcess/bagMadeDetail`, {
      process_id: process_id,
    });
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setBagMadeData(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMfgLiveLoading(false));
  }
};

/**
 * @desc add details for bag made
 */

export const addBagDetailForBagMade = payload => async dispatch => {
  try {
    // dispatch(setMfgLiveLoading(true));
    dispatch(setMfgSuggestedRollLoading(true));

    const response = await axios.post(
      `update/mfgProcess/bagMadeDetail`,
      payload,
    );

    const { data, msg, err } = response.data;

    if (err === 0) {
      dispatch(setSuggestedProductList(data?.list || []));
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
    // dispatch(setMfgLiveLoading(false));
    dispatch(setMfgSuggestedRollLoading(false));
  }
};
/**
 * @desc update handle Status
 */

export const updateHandleStatus = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMfgLiveLoading(true));
      const response = await axios.post(
        `update/mfgProcess/hndleStatus`,
        payload,
      );

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
    dispatch(setMfgLiveLoading(false));
  }
};

/**
 * @desc update str order Status
 */

export const updateStrOrderStatus = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMfgLiveLoading(true));
      const response = await axios.post(
        `update/mfgProcess/stereoOrder`,
        payload,
      );

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
    dispatch(setMfgLiveLoading(false));
  }
};

/**
 * @desc update str receive Status
 */

export const updateStrReceiveStatus = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMfgLiveLoading(true));
      const response = await axios.post(
        `update/mfgProcess/stereoReceive`,
        payload,
      );

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
    dispatch(setMfgLiveLoading(false));
  }
};

/**
 * @desc update bag sent Status
 */

export const updateBagSentStatus = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMfgLiveLoading(true));
      const response = await axios.post(
        `update/mfgProcess/bagSentStatus`,
        payload,
      );

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
    dispatch(setMfgLiveLoading(false));
  }
};

/**
 * @desc update LR sent Status
 */

export const updateLrSentStatus = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMfgLiveLoading(true));
      const response = await axios.post(
        `update/mfgProcess/lrSentStatus`,
        payload,
      );

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
    dispatch(setMfgLiveLoading(false));
  }
};

/**
 * @desc list mfg process filter
 */

export const getMfgProcessFilterList = payload => async dispatch => {
  try {
    // dispatch(setMfgLiveLoading(true));
    dispatch(setMfgFilterListLoading(true));

    const response = await axios.post(`list/mfgProcessFilter`, payload);
    const { msg, err, data } = response.data;

    let updatedData = data?.map(x => {
      return {
        advisorList: x?.advisorList?.map(i => {
          return {
            ...i,
            label: `${i?.first_name} ${i?.last_name}`,
            value: `${i?.first_name} ${i?.last_name}`,
          };
        }),
        bagTypeList: x?.bagTypeList?.map(i => {
          return {
            ...i,
            label: i?.name,
            value: i?.name,
          };
        }),
        laminationTypeList: x?.laminationTypeList?.map(i => {
          return {
            ...i,
            label: i?.name,
            value: i?._id,
          };
        }),
        partyList: x?.partyList?.map(i => {
          return {
            ...i,
            label: i?.party_name,
            value: i?.party_name,
          };
        }),
        printTypeList: x?.printTypeList?.map(i => {
          return {
            ...i,
            label: i?.name,
            value: i?.name,
          };
        }),
        productDesignList: x?.productDesignList?.map(i => {
          return {
            ...i,
            label: i?.design_name,
            value: i?.design_name,
          };
        }),
        fabricColorList: x?.fabricColorList?.map(i => {
          return {
            ...i,
            label: i?.name,
            value: i?.name,
          };
        }),
        gsmList: x?.gsmList?.map(i => {
          return {
            ...i,
            label: i,
            value: i,
          };
        }),
        screenPrintList: x?.screenPrintList?.map(i => {
          return {
            ...i,
            label: i?.name,
            value: i?.name,
          };
        }),
      };
    });
    if (err === 0) {
      dispatch(setMfgLiveFilterList(updatedData[0] || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMfgFilterListLoading(false));
  }
};

/**
 * @desc Export list mfg process excel
 */

export const getExportMfgExcel =
  (query = '', filter = {}, dates, field_filter) =>
  async dispatch => {
    try {
      dispatch(setMfgLiveLoading(true));

      let obj = {};
      for (const key in filter) {
        if (
          (Array.isArray(filter[key]) && filter[key]?.length > 0) ||
          (typeof filter[key] === 'string' && filter[key] !== '')
        ) {
          obj[key] = filter[key];
        }
      }
      const response = await axios.post(`export/mfgProcess/excel`, {
        filter: filter,
        search: query,
        start_date: dates?.[0] ? getDMYDateFormat(dates?.[0]) : '',
        end_date: dates?.[1] ? getDMYDateFormat(dates?.[1]) : '',
        field_filter: field_filter,
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
      dispatch(setMfgLiveLoading(false));
    }
  };

export const getMfgLivePrintingFilterList = payload => async dispatch => {
  try {
    // dispatch(setMfgLiveLoading(true));

    const response = await axios.post(`list/inventoryStockFilter`);
    const { msg, err, data } = response.data;
    const updateFilterData = { ...data };

    for (let key in updateFilterData) {
      if (Array.isArray(updateFilterData[key])) {
        if (['width', 'gsm'].includes(key)) {
          updateFilterData[key] = updateFilterData[key].map(item => ({
            label: item,
            value: item,
          }));
        } else {
          updateFilterData[key] = updateFilterData[key].map(item => ({
            label: item,
            value: item,
          }));
        }
      }
    }

    if (err === 0) {
      dispatch(setMfgLivePrintingFilterList(updateFilterData));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    // dispatch(setMfgLiveLoading(false));
  }
};
