import axios from 'axios';
import {
  setCountMFGfProcess,
  setCylinderSizeList,
  setListMFGProcess,
  setListOperator,
  setLiveOperatorMachineTypes,
  setMfgLiveOperatorLoading,
  setMfgRollConsumptionLoading,
  setSuggestedRollList,
  setViewMachineDetailForBagMaking,
  setViewMfgProcessList,
  setViewPrintingMachineCountList,
} from 'Store/Reducers/Production/mfgLiveOperatorSlice';
import { getDMYDateFormat, roastError } from 'Helper/Common';
import { toast } from 'react-toastify';
import { setAllFilters } from 'Store/Reducers/Common';

export const getLiveOperatorMachineTypes = id => async (dispatch, getState) => {
  const reducerState = getState();
  const { common } = reducerState;
  const mfgLiveOperatorData = common?.allFilters?.mfgLiveFlexo;

  try {
    dispatch(setMfgLiveOperatorLoading(true));
    const response = await axios.get(`/list/printingMachineType`);
    const { msg, err, data } = response.data;
    if (err === 0) {
      dispatch(setLiveOperatorMachineTypes(data || []));
      return data;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMfgLiveOperatorLoading(false));
  }
};

export const getCylinderSizeLists = id => async dispatch => {
  try {
    // dispatch(setMfgLiveOperatorLoading(true));
    const response = await axios.post(`/list/cylinderSize`, {
      print_technology: id,
    });

    const { msg, err, data } = response.data;
    if (err === 0) {
      let array = [];
      // let updated = data?.map(d => {
      //   return {
      //     ...d,
      //     label: d?.first_name,
      //     value: d?._id,
      //   };
      // });
      array.push('All');
      data?.map(d => {
        array.push(d);
        return {
          ...d,
        };
      });

      dispatch(setCylinderSizeList(array || []));
      return array;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    // dispatch(setMfgLiveOperatorLoading(false));
  }
};

export const MFGfProcessLists =
  ({
    cylinder,
    factory = '',
    print_technology,
    print,
    machine,
    completed = 0,
    pageLimit = 30,
    currentPage = 1,
    dates = [],
    searchQuery = '',
    applied = {},
  }) =>
  async dispatch => {
    try {
      dispatch(setMfgLiveOperatorLoading(true));
      let obj = {};
      for (const key in applied) {
        if (
          (Array.isArray(applied[key]) && applied[key]?.length > 0) ||
          (typeof applied[key] === 'string' && applied[key] !== '')
        ) {
          obj[key] = applied[key];
        }
      }
      const response = await axios.post(
        `/list/operatormfgProcess/${currentPage}/${pageLimit}`,
        {
          cylinder,
          factory,
          print_technology,
          print,
          machine,
          completed,
          search: searchQuery,
          filter: applied,
          start_date: dates?.startDate
            ? getDMYDateFormat(dates?.startDate)
            : '',
          end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
        },
      );
      const { msg, err, data } = response.data;

      const updatedData = data?.list?.map((item, index) => {
        return {
          ...item,
          sr_no: index + 1,
        };
      });

      if (err === 0) {
        dispatch(setListMFGProcess(updatedData || []));
        dispatch(setCountMFGfProcess(data?.count || 0));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      toast.error('Something goes wrong, please try again later');
      return false;
    } finally {
      dispatch(setMfgLiveOperatorLoading(false));
    }
  };

export const getListSelectedRoll =
  (print_technology_id, process_id) => async dispatch => {
    try {
      // dispatch(setMfgLiveOperatorLoading(true));
      dispatch(setMfgRollConsumptionLoading(true));
      const response = await axios.post(
        `/list/operatormfgProcess/selectedRoll`,
        {
          print_technology_id: print_technology_id,
          process_id: process_id,
        },
      );
      const { msg, err, data } = response.data;
      if (err === 0) {
        dispatch(setSuggestedRollList(data || []));

        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      toast.error('Something goes wrong, please try again later');
      return false;
    } finally {
      dispatch(setMfgRollConsumptionLoading(false));
    }
  };

/**
 * @descadd roll consumption for bag making
 */

export const addBagDetailForPrinting = payload => async dispatch => {
  try {
    dispatch(setMfgLiveOperatorLoading(true));

    const response = await axios.post(
      `update/operatormfgProcess/addRollConsumption`,
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
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMfgLiveOperatorLoading(false));
  }
};

/**
 * @desc view roll consumption for bag making
 */

export const viewRollConsumption = process_id => async dispatch => {
  try {
    if (process_id) {
      // dispatch(setMfgLiveOperatorLoading(true));
      dispatch(setMfgRollConsumptionLoading(true));

      const response = await axios.post(
        `list/operatormfgProcess/viewRollConsumption`,
        {
          process_id: process_id,
        },
      );

      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setViewMfgProcessList(data || {}));
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
    dispatch(setMfgRollConsumptionLoading(false));
  }
};

/**
 * @desc export list mfg process Pdf and Excel
 */

export const getExportMfgProcess =
  (
    file_format,
    mfgListParam,
    searchQuery = '',
    print_technology = '',
    machine = 0,
    print = 1,
  ) =>
  async dispatch => {
    let { cylinder, factory, completed, dates } = mfgListParam;
    try {
      dispatch(setMfgLiveOperatorLoading(true));
      let response;
      if (file_format === 'excel')
        response = await axios.post(`export/operatormfgProcess/excel`, {
          cylinder,
          factory,
          print_technology,
          print,
          machine,
          completed,
          start_date: dates?.startDate
            ? getDMYDateFormat(dates?.startDate)
            : '',
          end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
          searchQuery,
        });
      else
        response = await axios.post(`export/operatormfgProcess/pdf`, {
          cylinder,
          factory,
          print_technology,
          print,
          machine,
          completed,
          start_date: dates?.startDate
            ? getDMYDateFormat(dates?.startDate)
            : '',
          end_date: dates?.endDate ? getDMYDateFormat(dates?.endDate) : '',
          searchQuery,
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
      dispatch(setMfgLiveOperatorLoading(false));
    }
  };

/**
 * @desc list Operator
 */

export const getListOperator = id => async dispatch => {
  try {
    dispatch(setMfgLiveOperatorLoading(true));
    const response = await axios.get(`list/operator`);
    const { msg, err, data } = response.data;
    if (err === 0) {
      let updated = data?.map(d => {
        return {
          ...d,
          label: d?.first_name,
          value: d?._id,
        };
      });
      dispatch(setListOperator(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMfgLiveOperatorLoading(false));
  }
};

/**
 * @descadd update printing machine count
 */

export const updateMachineCount = payload => async dispatch => {
  try {
    dispatch(setMfgLiveOperatorLoading(true));
    const response = await axios.post(
      `update/operatormfgProcess/printingmachineCountDetail`,
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
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMfgLiveOperatorLoading(false));
  }
};

/**
 * @desc view mfg process printing machine count detail by id
 */

export const viewPrintingMachineCount =
  (process_id, print_technology_id) => async dispatch => {
    try {
      if (process_id && print_technology_id) {
        dispatch(setMfgLiveOperatorLoading(true));
        const response = await axios.post(
          `list/operatormfgProcess/machineCountDetail`,
          {
            print_technology_id: print_technology_id,
            process_id: process_id,
          },
        );

        const { msg, err, data } = response.data;

        if (err === 0) {
          dispatch(setViewPrintingMachineCountList(data || {}));
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
      dispatch(setMfgLiveOperatorLoading(false));
    }
  };

/**
 * @desc view bag making machine detail by id
 */

export const viewBagMackingMachineDetail = process_id => async dispatch => {
  try {
    if (process_id) {
      dispatch(setMfgLiveOperatorLoading(true));
      const response = await axios.post(
        `list/operatormfgProcess/bagMakingMachineCountDetail`,
        {
          process_id: process_id,
        },
      );

      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setViewMachineDetailForBagMaking(data || {}));
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
    dispatch(setMfgLiveOperatorLoading(false));
  }
};

/**
 * @descadd update bag making machine count
 */

export const updateBagMakingMachineCount = payload => async dispatch => {
  try {
    dispatch(setMfgLiveOperatorLoading(true));
    const response = await axios.post(
      `update/operatormfgProcess/bagMakingMachineCountDetail`,
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
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMfgLiveOperatorLoading(false));
  }
};
