import { roastError } from 'Helper/Common';
import { setAdvisorTargetMasterData } from 'Store/Reducers/Common';
import {
  setActiveBackgroundDesignList,
  setActiveBagCapacityList,
  setActiveBagTypeCollectionList,
  setActiveBagTypeList,
  setActiveCustomerGroupList,
  setActiveFabricColorList,
  setActiveFormList,
  setActiveHandleMaterialList,
  setActiveIndustryList,
  setActiveLaminationTypeList,
  setActiveMaterialList,
  setActivePatchCylinderList,
  setActivePrintTechnologyList,
  setActivePrintTypeList,
  setActiveWarehouseList,
  setAddressTypeCount,
  setAddressTypeList,
  setBackgroundDesignCount,
  setBackgroundDesignList,
  setBagCapacityCount,
  setBagCapacityList,
  setBagMachineCount,
  setBagMachineList,
  setBagTypeCollectionCount,
  setBagTypeCollectionList,
  setBagTypeCount,
  setBagTypeList,
  setBankCount,
  setBankList,
  setBusinessTypeCount,
  setBusinessTypeList,
  setCityCount,
  setCityList,
  setCountryCount,
  setCountryList,
  setCustomerGroupCount,
  setCustomerGroupList,
  setCustomerPartyList,
  setCustomerSourceCount,
  setCustomerSourceDetailCount,
  setCustomerSourceDetailList,
  setCustomerSourceList,
  setDesignerList,
  setFabricColorCount,
  setFabricColorList,
  setFactoryLocationCount,
  setFactoryLocationList,
  setFormCount,
  setFormList,
  setHandleMaterialCount,
  setHandleMaterialList,
  setIndustryCount,
  setIndustryList,
  setItemGroupCount,
  setItemGroupList,
  setLaminationTypeCount,
  setLaminationTypeList,
  setMarketCount,
  setMarketList,
  setMaterialCount,
  setMaterialList,
  setMiscMasterCRUDLoading,
  setMiscMasterLoading,
  setOperatorRoleCount,
  setOperatorRoleList,
  setPartyTypeCount,
  setPartyTypeList,
  setPatchCylinderCount,
  setPatchCylinderList,
  setPrintTechnologyCount,
  setPrintTechnologyList,
  setPrintTypeCount,
  setPrintTypeList,
  setStateCount,
  setStateList,
  setUnitCount,
  setUnitList,
  setWarehouseCount,
  setWarehouseList,
  setMachineTypeList,
  setMachineTypeCount,
  setActiveMachineTypeList,
  setMachinesCount,
  setMachinesList,
  setBagTypeListMenu,
  setFabricColorListMenu,
  setGsmLengthList,
  setGsmLengthCount,
  setActiveGsmList,
  setMachineListByMachineType,
  setVelcroList,
  setVelcroCount,
  setActiveVelcroList,
  setCustomerRatingList,
  setCustomerRatingCount,
} from 'Store/Reducers/Settings/MiscMasterSlice';
import {
  setActiveRawItemList,
  setActiveRawItemListByGroup,
  setItemLoading,
  setRawItemListById,
  setRawItemsCount,
  setRawItemsFullList,
  setRawItemsList,
} from 'Store/Reducers/Settings/RawItemSlice';
import {
  setActiveItemGroupList,
  setActiveUnitList,
  setSettingLoading,
  setSettingsCRUDLoading,
} from 'Store/Reducers/Settings/SettingSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc  Get Active Unit List
 */
export const getActiveUnitList = () => async dispatch => {
  try {
    dispatch(setSettingLoading(true));

    const response = await axios.get(`/list/active/unit`);
    const { err, data, msg } = response.data;
    if (err === 0) {
      const updated = [
        {
          label: 'Add Item Group',
          className: 'add_items_icon',
          data: data,
          items: data?.map(x => {
            return {
              label: `${x?.name} (${x?.code})`,
              value: x?._id,
            };
          }),
        },
      ];
      dispatch(setActiveUnitList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSettingLoading(false));
  }
};

/**
 * @desc Get Active Raw Material Group List
 */
export const getActiveItemGroupList = () => async dispatch => {
  try {
    dispatch(setSettingLoading(true));

    const response = await axios.get(`/list/active/itemGroup`);
    const { err, data, msg } = response.data;
    if (err === 0) {
      const updated = [
        {
          label: 'Add Items',
          className: 'add_items_icon',
          data: data,
          items: data?.map(x => {
            return {
              label: x?.name,
              value: x?._id,
            };
          }),
        },
      ];
      dispatch(setActiveItemGroupList(updated || []));
      return updated;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSettingLoading(false));
  }
};

/**
 * @desc  Add New Unit
 */
export const addNewUnit = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`/add/unit`, payload);
      const { err, msg } = response.data;
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
    dispatch(setSettingsCRUDLoading(false));
  }
};

/**
 * @desc  Add New Raw Material Group
 */
export const addNewItemGroup = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`/add/itemGroup`, payload);
      const { err, msg } = response.data;
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
    dispatch(setSettingsCRUDLoading(false));
  }
};

/**
 * @desc  Create Raw Item
 */
export const createRawItem = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`/add/rawItem`, payload);
      const { err, msg } = response.data;
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
    dispatch(setSettingsCRUDLoading(false));
  }
};

/**
 * @desc  Update Raw Item
 */
export const updateRawItem = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`/update/rawItem`, payload);
      const { err, msg } = response.data;
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
    dispatch(setSettingsCRUDLoading(false));
  }
};

/**
 * @desc  Delete Raw Item
 */
export const deleteRawItem = item_id => async dispatch => {
  try {
    if (item_id) {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`/delete/rawItem`, {
        item_id: item_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setSettingsCRUDLoading(false));
  }
};

/**
 * @desc  Get Raw Items Whole List
 */
export const getRawItemsFullList = () => async dispatch => {
  try {
    dispatch(setSettingsCRUDLoading(true));

    const response = await axios.get(`/list/rawItem`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(y => {
        return {
          ...y,
          item_attribute: y?.item_attribute?.map(x => ({
            ...x,
            isSelected: true,
          })),
        };
      });

      dispatch(setRawItemsFullList(updated || []));
      return updated;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSettingsCRUDLoading(false));
  }
};

/**
 * @desc  Get Active Raw Item List
 */
export const getActiveRawItemList = () => async dispatch => {
  try {
    dispatch(setItemLoading(true));

    const response = await axios.get(`/list/active/rawItem`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(y => {
        return {
          ...y,
          label: y?.name,
          value: y?._id,
        };
      });

      dispatch(setActiveRawItemList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setItemLoading(false));
  }
};

/**
 * @desc  Get Active Raw Item List By Group
 */
export const getActiveRawItemListByGroup = group_id => async dispatch => {
  try {
    dispatch(setItemLoading(true));

    const response = await axios.post(`list/rawItemByGroup`, {
      group_id: group_id,
    });
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(y => {
        return {
          ...y,
          label: y?.name,
          value: y?._id,
        };
      });

      dispatch(setActiveRawItemListByGroup(updated || []));
      return updated;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setItemLoading(false));
  }
};

/**
 * @desc  view raw item by id
 */
export const getRawItemListById = (group_id, item_id) => async dispatch => {
  try {
    dispatch(setItemLoading(true));

    const response = await axios.post(`view/rawItemAttribute`, {
      group_id: group_id,
      item_id: item_id,
    });
    const { err, msg, data } = response.data;
    if (err === 0) {
      // const updated = data?.map(y => {
      //   return {
      //     ...y,
      //     label: y?.name,
      //     value: y?._id,
      //   };
      // });

      dispatch(setRawItemListById(data || []));
      return data;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setItemLoading(false));
  }
};
/**
 * @desc  Get Raw Items List
 * @param (limit,start,query,filter)
 */
export const getRawItemsList =
  (limit = 30, start = 1, query = '', filter = {}) =>
  async dispatch => {
    try {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`/list/rawItem/${start}/${limit}`, {
        filter: filter || {},
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => {
          return {
            ...x,
            status: x?.is_active ? 'Yes' : 'No',
            item_attribute: x?.item_attribute?.map(y => {
              return {
                ...y,
                is_multiple_selection: y?.is_multiple_selection ? 1 : 0,
                values: y?.attribute_value?.map(z => {
                  return {
                    ...z,
                    label: z?.value,
                  };
                }),
              };
            }),
          };
        });
        dispatch(setRawItemsList(updated || []));
        dispatch(setRawItemsCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setSettingsCRUDLoading(false));
    }
  };

/**
 * @desc  Get Warehouse List
 * @param (limit, start, query)
 */
export const getWarehouseList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/warehouse/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
          is_default: x?.is_default ? 1 : 0,
        }));
        dispatch(setWarehouseList(updated || []));
        dispatch(setWarehouseCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc Get Active Warehouse List
 */
export const getActiveWarehouseList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/warehouse`);
    const { err, data, msg } = response.data;
    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          label: x?.name,
          value: x?._id,
        };
      });
      dispatch(setActiveWarehouseList(updated || []));
      return updated;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Warehouse
 */
export const createWarehouse = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/warehouse`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Warehouse
 */
export const updateWarehouse = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/warehouse`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Warehouse
 */
export const deleteWarehouse = warehouse_id => async dispatch => {
  try {
    if (warehouse_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/warehouse`, { warehouse_id });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Unit List
 * @param (limit, start, query)
 */
export const getUnitList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/unit/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setUnitList(updated || []));
        dispatch(setUnitCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Unit
 */
export const createUnit = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/unit`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Unit
 */
export const updateUnit = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/unit`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Unit
 */
export const deleteUnit = unit_id => async dispatch => {
  try {
    if (unit_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/unit`, { unit_id });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Bank List
 * @param (limit, start, query)
 */
export const getBankList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/bank/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setBankList(updated || []));
        dispatch(setBankCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Bank
 */
export const createBank = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/bank`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Bank
 */
export const updateBank = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/bank`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Bank
 */
export const deleteBank = bank_id => async dispatch => {
  try {
    if (bank_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/bank`, { bank_id });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Bag Type List
 * @param (limit, start, query)
 */
export const getBagTypeList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/bagType/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setBagTypeList(updated || []));
        dispatch(setBagTypeCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Form List
 */
export const getActiveBagTypeList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/bagType`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.name,
        value: x?._id,
      }));

      const bagTypeList = data.map(item => ({
        label: item?.name,
        value: item?.name,
      }));
      dispatch(setBagTypeListMenu(bagTypeList || []));
      dispatch(setActiveBagTypeList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Bag Type
 */
export const createBagType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/bagType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Bag Type
 */
export const updateBagType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/bagType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Bag Type
 */
export const deleteBagType = bagType_id => async dispatch => {
  try {
    if (bagType_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/bagType`, { bagType_id });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Printing Type List
 * @param (limit, start, query)
 */
export const getPrintTypeList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/printType/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setPrintTypeList(updated || []));
        dispatch(setPrintTypeCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Printing Type List
 */
export const getActivePrintTypeList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/printType`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.name,
        value: x?._id,
      }));
      dispatch(setActivePrintTypeList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Printing Type
 */
export const createPrintType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/printType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Printing Type
 */
export const updatePrintType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/printType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Printing Type
 */
export const deletePrintType = printType_id => async dispatch => {
  try {
    if (printType_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/printType`, { printType_id });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Printing Technology List
 * @param (limit, start, query)
 */
export const getPrintTechnologyList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/printTechnology/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setPrintTechnologyList(updated || []));
        dispatch(setPrintTechnologyCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Printing Technology List
 */
export const getActivePrintTechnologyList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/printTechnology`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.name,
        value: x?._id,
      }));
      dispatch(setActivePrintTechnologyList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Printing Technology
 */
export const createPrintTechnology = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/printTechnology`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Printing Technology
 */
export const updatePrintTechnology = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/printTechnology`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Printing Technology
 */
export const deletePrintTechnology = printTechnology_id => async dispatch => {
  try {
    if (printTechnology_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/printTechnology`, {
        printTechnology_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Country List
 * @param (limit, start, query)
 */
export const getCountryList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/country/list/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setCountryList(updated || []));
        dispatch(setCountryCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Add Or Update Country
 */
export const addOrUpdateCountry = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/country/save`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Country
 */
export const deleteCountry = country_id => async dispatch => {
  try {
    if (country_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/country/delete`, {
        id: country_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get State List
 * @param (limit, start, query)
 */
export const getStateList =
  (
    limit = 30,
    start = 1,
    code = {
      country_code: 'IN',
    },
    query = '',
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/state/list/${start}/${limit}/${code?.country_code}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setStateList(updated || []));
        dispatch(setStateCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Add Or Update State
 */
export const addOrUpdateState = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/state/save`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete State
 */
export const deleteState = state_id => async dispatch => {
  try {
    if (state_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/state/delete`, {
        id: state_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get City List
 * @param (limit, start, query)
 */
export const getCityList =
  (limit = 30, start = 1, state_id, query = '') =>
  async (dispatch, getState) => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/city/list/${start}/${limit}/${state_id}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setCityList(updated || []));
        dispatch(setCityCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Add Or Update City
 */
export const addOrUpdateCity = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/city/save`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete City
 */
export const deleteCity = state_id => async dispatch => {
  try {
    if (state_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/city/delete`, {
        id: state_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Factory Location List
 * @param (limit, start, query)
 */
export const getFactoryLocationList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/factoryLocation/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          is_default: x?.is_default ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
          label: x?.name,
          value: x?._id,
        }));
        dispatch(setFactoryLocationList(updated || []));
        dispatch(setFactoryLocationCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Factory Location
 */
export const createFactoryLocation = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/factoryLocation`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Factory Location
 */
export const updateFactoryLocation = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/factoryLocation`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Factory Location
 */
export const deleteFactoryLocation = factoryLocation_id => async dispatch => {
  try {
    if (factoryLocation_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/factoryLocation`, {
        factoryLocation_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Operator Role List
 * @param (limit, start, query)
 */
export const getOperatorRoleList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/operatorRole/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setOperatorRoleList(updated || []));
        dispatch(setOperatorRoleCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Operator Role
 */
export const createOperatorRole = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/operatorRole`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Operator Role
 */
export const updateOperatorRole = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/operatorRole`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Operator Role
 */
export const deleteOperatorRole = operatorRole_id => async dispatch => {
  try {
    if (operatorRole_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/operatorRole`, {
        operatorRole_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Bag Machine List
 * @param (limit, start, query)
 */
export const getBagMachineList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/bagMachine/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setBagMachineList(updated || []));
        dispatch(setBagMachineCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Bag Machine
 */
export const createBagMachine = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/bagMachine`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Bag Machine
 */
export const updateBagMachine = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/bagMachine`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Bag Machine
 */
export const deleteBagMachine = bagMachine_id => async dispatch => {
  try {
    if (bagMachine_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/bagMachine`, {
        bagMachine_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Lamination Type List
 * @param (limit, start, query)
 */
export const getLaminationTypeList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/laminationType/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setLaminationTypeList(updated || []));
        dispatch(setLaminationTypeCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Lamination Type List
 */
export const getActiveLaminationTypeList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/laminationType`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        is_default: x?.is_default ? 1 : 0,
        label: x?.name,
        value: x?._id,
      }));
      dispatch(setActiveLaminationTypeList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Lamination Type
 */
export const createLaminationType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/laminationType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Lamination Type
 */
export const updateLaminationType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/laminationType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Lamination Type
 */
export const deleteLaminationType = laminationType_id => async dispatch => {
  try {
    if (laminationType_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/laminationType`, {
        laminationType_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Business Type List
 * @param (limit, start, query)
 */
export const getBusinessTypeList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/businessType/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setBusinessTypeList(updated || []));
        dispatch(setBusinessTypeCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Business Type
 */
export const createBusinessType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/businessType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Business Type
 */
export const updateBusinessType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/businessType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Business Type
 */
export const deleteBusinessType = businessType_id => async dispatch => {
  try {
    if (businessType_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/businessType`, {
        businessType_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Raw Material Group List
 * @param (limit, start, query)
 */
export const getItemGroupList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/itemGroup/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setItemGroupList(updated || []));
        dispatch(setItemGroupCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Update Raw Material Group
 */
export const updateItemGroup = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/itemGroup`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Raw Material Group
 */
export const deleteItemGroup = item_group_id => async dispatch => {
  try {
    if (item_group_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/itemGroup`, {
        item_group_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Party Type List
 * @param (limit, start, query)
 */
export const getPartyTypeList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/partyType/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setPartyTypeList(updated || []));
        dispatch(setPartyTypeCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Party Type
 */
export const createPartyType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/partyType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Party Type
 */
export const updatePartyType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/partyType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Party Type
 */
export const deletePartyType = partyType_id => async dispatch => {
  try {
    if (partyType_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/partyType`, {
        partyType_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Market List
 * @param (limit, start, query)
 */
export const getMarketList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/market/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setMarketList(updated || []));
        dispatch(setMarketCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Market
 */
export const createMarket = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/market`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Market
 */
export const updateMarket = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/market`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Market
 */
export const deleteMarket = market_id => async dispatch => {
  try {
    if (market_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/market`, {
        market_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Industry List
 * @param (limit, start, query)
 */
export const getIndustryList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/industry/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setIndustryList(updated || []));
        dispatch(setIndustryCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc get active industry
 */

export const getActiveIndustryList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/industry`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          value: x?._id,
          label: x?.name,
        };
      });
      dispatch(setActiveIndustryList(updated));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Industry
 */
export const createIndustry = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/industry`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Industry
 */
export const updateIndustry = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/industry`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Industry
 */
export const deleteIndustry = industry_id => async dispatch => {
  try {
    if (industry_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/industry`, {
        industry_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Customer Source List
 * @param (limit, start, query)
 */
export const getCustomerSourceList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/customerSource/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setCustomerSourceList(updated || []));
        dispatch(setCustomerSourceCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Customer Source
 */
export const createCustomerSource = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/customerSource`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Customer Source
 */
export const updateCustomerSource = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/customerSource`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Customer Source
 */
export const deleteCustomerSource = customerSource_id => async dispatch => {
  try {
    if (customerSource_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/customerSource`, {
        customerSource_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Customer Source Detail List
 * @param (limit, start, query)
 */
export const getCustomerSourceDetailList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/customerSourceDetail/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setCustomerSourceDetailList(updated || []));
        dispatch(setCustomerSourceDetailCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Customer Source Detail
 */
export const createCustomerSourceDetail = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/customerSourceDetail`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Customer Source Detail
 */
export const updateCustomerSourceDetail = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(
        `/update/customerSourceDetail`,
        payload,
      );
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Customer Source Detail
 */
export const deleteCustomerSourceDetail =
  customerSourceDetail_id => async dispatch => {
    try {
      if (customerSourceDetail_id) {
        dispatch(setMiscMasterCRUDLoading(true));

        const response = await axios.post(`/delete/customerSourceDetail`, {
          customerSourceDetail_id,
        });
        const { err, msg } = response.data;
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
      dispatch(setMiscMasterCRUDLoading(false));
    }
  };

/**
 * @desc  Get Address Type List
 * @param (limit, start, query)
 */
export const getAddressTypeList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/addressType/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setAddressTypeList(updated || []));
        dispatch(setAddressTypeCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Address Type
 */
export const createAddressType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/addressType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Address Type
 */
export const updateAddressType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/addressType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Address Type
 */
export const deleteAddressType = addressType_id => async dispatch => {
  try {
    if (addressType_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/addressType`, {
        addressType_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Patch Cylinder List
 * @param (limit, start, query)
 */
export const getPatchCylinderList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/patchCylinder/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setPatchCylinderList(updated || []));
        dispatch(setPatchCylinderCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Patch Cylinder List
 */
export const getActivePatchCylinderList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/patchCylinder`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: `${x?.cylinder ? x?.cylinder : 0} mm Circum - ${x?.name} mm`,
        value: x?._id,
      }));

      dispatch(setActivePatchCylinderList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Patch Cylinder
 */
export const createPatchCylinder = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/patchCylinder`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Patch Cylinder
 */
export const updatePatchCylinder = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/patchCylinder`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Patch Cylinder
 */
export const deletePatchCylinder = patch_cylinder_id => async dispatch => {
  try {
    if (patch_cylinder_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/patchCylinder`, {
        patch_cylinder_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Customer Group List
 * @param (limit, start, query)
 */
export const getCustomerGroupList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/customerGroup/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setCustomerGroupList(updated || []));
        dispatch(setCustomerGroupCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Customer Party List
 */
export const getActiveCustomerPartyList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    // const response = await axios.get(`/list/active/customerGroup`);
    const response = await axios.get(`/list/customerParty`);

    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.party_name,
        value: x?._id,
      }));

      dispatch(setActiveCustomerGroupList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Get Customer Party List
 */
export const getCustomerPartyList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/customerParty`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        label: x?.party_name,
        value: x?._id,
      }));
      dispatch(setCustomerPartyList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Customer Group
 */
export const createCustomerGroup = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/customerGroup`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Customer Group
 */
export const updateCustomerGroup = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/customerGroup`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Customer Group
 */
export const deleteCustomerGroup = customer_group_id => async dispatch => {
  try {
    if (customer_group_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/customerGroup`, {
        customer_group_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Background Design List
 * @param (limit, start, query)
 */
export const getBackgroundDesignList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/backgroundDesign/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setBackgroundDesignList(updated || []));
        dispatch(setBackgroundDesignCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc Get Active Background Design List
 */
export const getActiveBackgroundDesignList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/backgroundDesign`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.name,
        value: x?._id,
      }));

      dispatch(setActiveBackgroundDesignList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Background Design
 */
export const createBackgroundDesign = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/backgroundDesign`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Background Design
 */
export const updateBackgroundDesign = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/backgroundDesign`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Background Design
 */
export const deleteBackgroundDesign =
  background_design_id => async dispatch => {
    try {
      if (background_design_id) {
        dispatch(setMiscMasterCRUDLoading(true));

        const response = await axios.post(`/delete/backgroundDesign`, {
          background_design_id,
        });
        const { err, msg } = response.data;
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
      dispatch(setMiscMasterCRUDLoading(false));
    }
  };

/**
 * @desc  Get Handle Material List
 * @param (limit, start, query)
 */
export const getHandleMaterialList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/handleMaterial/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setHandleMaterialList(updated || []));
        dispatch(setHandleMaterialCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Handle Material List
 */
export const getActiveHandleMaterialList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/handleMaterial`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.name,
        value: x?._id,
      }));
      dispatch(setActiveHandleMaterialList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Handle Material
 */
export const createHandleMaterial = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/handleMaterial`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Handle Material
 */
export const updateHandleMaterial = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/handleMaterial`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Handle Material
 */
export const deleteHandleMaterial = handle_material_id => async dispatch => {
  try {
    if (handle_material_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/handleMaterial`, {
        handle_material_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Bag Capacity List
 * @param (limit, start, query)
 */
export const getBagCapacityList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/bagCapacity/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setBagCapacityList(updated || []));
        dispatch(setBagCapacityCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Bag Capacity List
 */
export const getActiveBagCapacityList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/bagCapacity`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.size,
        value: x?._id,
      }));
      dispatch(setActiveBagCapacityList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Bag Capacity
 */
export const createBagCapacity = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/bagCapacity`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Bag Capacity
 */
export const updateBagCapacity = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/bagCapacity`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Bag Capacity
 */
export const deleteBagCapacity = bagCapacity_id => async dispatch => {
  try {
    if (bagCapacity_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/bagCapacity`, {
        bagCapacity_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Form List
 * @param (limit, start, query)
 */
export const getFormList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/form/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setFormList(updated || []));
        dispatch(setFormCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Form List
 */
export const getActiveFormList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/form`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.name,
        value: x?._id,
      }));
      dispatch(setActiveFormList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Form
 */
export const createForm = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/form`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Form
 */
export const updateForm = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/form`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Form
 */
export const deleteForm = form_id => async dispatch => {
  try {
    if (form_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/form`, {
        form_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Form List
 * @param (limit, start, query)
 */
export const getMaterialList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/material/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setMaterialList(updated || []));
        dispatch(setMaterialCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Material List
 */
export const getActiveMaterialList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/material`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.name,
        value: x?._id,
      }));

      dispatch(setActiveMaterialList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Material
 */
export const createMaterial = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/material`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Material
 */
export const updateMaterial = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/material`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Material
 */
export const deleteMaterial = material_id => async dispatch => {
  try {
    if (material_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/material`, {
        material_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Fabric Color List
 * @param (limit, start, query)
 */
export const getFabricColorList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/fabricColor/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setFabricColorList(updated || []));
        dispatch(setFabricColorCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Fabric Color List
 */
export const getActiveFabricColorList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/fabricColor`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.name,
        value: x?._id,
      }));

      const FabricColorListMenu = data.map(item => ({
        label: item?.name,
        value: item?.name,
      }));

      dispatch(setFabricColorListMenu(FabricColorListMenu));
      dispatch(setActiveFabricColorList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Fabric Color
 */
export const createFabricColor = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/fabricColor`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Fabric Color
 */
export const updateFabricColor = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/fabricColor`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Fabric Color
 */
export const deleteFabricColor = fabric_color_id => async dispatch => {
  try {
    if (fabric_color_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/fabricColor`, {
        fabric_color_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Designer List
 */
export const getDesignerList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/designer`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        label: x?.first_name + ' ' + x?.last_name,
        value: x?._id,
      }));
      dispatch(setDesignerList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Get Bag Type Collection List
 * @param (limit, start, query)
 */
export const getBagTypeCollectionList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(
        `/list/bagTypeCollection/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setBagTypeCollectionList(updated || []));
        dispatch(setBagTypeCollectionCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Active Bag Type Collection List
 */
export const getActiveBagTypeCollectionList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/bagTypeCollection`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => ({
        ...x,
        is_active: x?.is_active ? 1 : 0,
        label: x?.name,
        value: x?._id,
      }));
      dispatch(setActiveBagTypeCollectionList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};

/**
 * @desc  Create Bag Type Collection
 */
export const createBagTypeCollection = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/bagTypeCollection`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Bag Type Collection
 */
export const updateBagTypeCollection = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/bagTypeCollection`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Bag Type Collection
 */
export const deleteBagTypeCollection =
  bagTypeCollection_id => async dispatch => {
    try {
      if (bagTypeCollection_id) {
        dispatch(setMiscMasterCRUDLoading(true));

        const response = await axios.post(`/delete/bagTypeCollection`, {
          bagTypeCollection_id,
        });
        const { err, msg } = response.data;
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
      dispatch(setMiscMasterCRUDLoading(false));
    }
  };

/**
 * @desc  Get Machine Type List
 * @param (limit, start, query)
 */
export const getMachineTypeList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/machineType/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
          bag_type_str: x?.bag_type
            ? x?.bag_type
                ?.map(e => {
                  return e.name;
                })
                ?.join(',')
            : '',
          printing_technology_str: x?.printing_technology
            ? x?.printing_technology
                ?.map(e => {
                  return e.name;
                })
                ?.join(',')
            : '',
        }));
        dispatch(setMachineTypeList(updated || []));
        dispatch(setMachineTypeCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Get Machine Type List
 * @param (limit, start, query)
 */
export const getActiveMachineTypeList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/machineType`);
    const { err, msg, data } = response.data;
    const updated = data?.map(x => {
      return {
        ...x,
        value: x?._id,
        label: x?.name,
      };
    });
    if (err === 0) {
      dispatch(setActiveMachineTypeList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};
/**
 * @desc  Create Machine Type
 */
export const createMachineType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/machineType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Machine Type
 */
export const updateMachineType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/machineType`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Machine Type
 */
export const deleteMachineType = machineType_id => async dispatch => {
  try {
    if (machineType_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/machineType`, {
        machineType_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get GSM List
 * @param (limit, start, query)
 */
export const getGsmList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));
      const response = await axios.post(`/list/gsm/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setGsmLengthList(updated || []));
        dispatch(setGsmLengthCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      // roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };
/**
 * @desc  Get GsmLength List
 * @param (limit, start, query)
 */
export const getActiveGsmList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`/list/active/gsm`);
    const { err, msg, data } = response.data;
    const updated = data?.map(x => {
      return {
        ...x,
        value: x?.gsm,
        label: x?.gsm?.toString(),
      };
    });
    if (err === 0) {
      dispatch(setActiveGsmList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};
/**
 * @desc  Delete GsmLength
 */
export const deleteGsmLength = gsm_id => async dispatch => {
  try {
    if (gsm_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/gsm`, {
        gsm_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};
/**
 * @desc  Update GsmLength
 */
export const updateGsmLength = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/gsm`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};
/**
 * @desc  Create GsmLength
 */
export const createGsmLength = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/gsm`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Machine List
 * @param (limit, start, query)
 */
export const getMachineList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));

      const response = await axios.post(`/list/machines/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setMachinesList(updated || []));
        dispatch(setMachinesCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

/**
 * @desc  Create Machines
 */
export const createMachines = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/machines`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Update Machines
 */
export const updateMachines = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/machines`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Delete Machines
 */
export const deleteMachines = machines_id => async dispatch => {
  try {
    if (machines_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/machines`, {
        machines_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  list machine by machine type
 */
export const listMachineByMachineType = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`list/machineByMachineType`, {
        machine_type_id: payload,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        let updated = data?.map(d => {
          return {
            ...d,
            label: d?.name,
            value: d?._id,
          };
        });
        dispatch(setMachineListByMachineType(updated));
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/**
 * @desc  Get Velcro List With Pagination
 * @param (limit, start, query)
 */
export const getVelcroList =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));
      const response = await axios.post(`list/velcro/${start}/${limit}`, {
        search: query,
      });
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setVelcroList(updated || []));
        dispatch(setVelcroCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      // roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };
/**
 * @desc  Get Velcro List
 *
 */
export const getActiveVelcroList = () => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));

    const response = await axios.get(`list/active/velcro`);
    const { err, msg, data } = response.data;
    const updated = data?.map(x => {
      return {
        ...x,
        value: x?._id,
        label: x?.size,
      };
    });
    if (err === 0) {
      dispatch(setActiveVelcroList(updated || []));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};
/**
 * @desc  Delete velcro
 */
export const deleteVelcro = velcro_id => async dispatch => {
  try {
    if (velcro_id) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/delete/velcro`, {
        velcro_id,
      });
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};
/**
 * @desc  Update Velcro
 */
export const updateVelcro = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/velcro`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

/** @desc  Create Velcro
 */
export const createVelcro = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/velcro`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

export const updateCustomerRating = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/update/customerRating`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

export const createCustomerRating = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setMiscMasterCRUDLoading(true));

      const response = await axios.post(`/add/customerRating`, payload);
      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};

export const getCustomerRating =
  (limit = 30, start = 1, query = '') =>
  async dispatch => {
    try {
      dispatch(setMiscMasterLoading(true));
      const response = await axios.post(
        `list/customerRating/${start}/${limit}`,
        {
          search: query,
        },
      );
      const { err, msg, data } = response.data;
      if (err === 0) {
        const updated = data?.list?.map(x => ({
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
        }));
        dispatch(setCustomerRatingList(updated || []));
        dispatch(setCustomerRatingCount(data?.count || []));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      // roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

export const deleteCustomerRating = customerRating_id => async dispatch => {
  try {
    if (customerRating_id) {
      dispatch(setMiscMasterCRUDLoading(true));
      const response = await axios.post(`/delete/customerRating`, {
        customerRating_id,
      });

      const { err, msg } = response.data;
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
    dispatch(setMiscMasterCRUDLoading(false));
  }
};
export const getListAdvisorTaget =
  (advisorId, year) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch(setMiscMasterLoading(true));
      const payload = {
        advisor_id: advisorId,
        year: year,
      };
      const response = await axios.post('list/advisorTarget', payload);
      const { err, msg, data } = response.data;
      if (err === 0) {
        if (data.length > 0) {
          dispatch(
            setAdvisorTargetMasterData({
              ...state.common.advisorTargetMasterData,
              isUpdate: true,
              target_data: data,
            }),
          );
        } else {
          dispatch(
            setAdvisorTargetMasterData({
              ...state.common.advisorTargetMasterData,
              isUpdate: false,
              target_data: state.common.targetMasterInitialState.target_data,
            }),
          );
        }
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      // roastError(e);
      return false;
    } finally {
      dispatch(setMiscMasterLoading(false));
    }
  };

export const addAdvisorTaget = payload => async dispatch => {
  try {
    dispatch(setMiscMasterLoading(true));
    const response = await axios.post('/add/advisorTarget', payload);
    const { err, msg } = response.data;
    if (err === 0) {
      toast.success(msg);
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    // roastError(e);
    return false;
  } finally {
    dispatch(setMiscMasterLoading(false));
  }
};
