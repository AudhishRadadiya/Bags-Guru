import { roastError } from 'Helper/Common';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  setListParties,
  setPartiesActiveIndustry,
  setPartiesActiveMarket,
  setPartiesActivePartyTypes,
  setPartiesAddressType,
  setPartiesAdvisor,
  setPartiesCitiesWithoutState,
  setPartiesCity,
  setPartiesCountry,
  setPartiesStateWithoutCountry,
  setPartiesCustomerSource,
  setPartiesCustomerSourceDetail,
  setPartiesLoading,
  setPartiesState,
  setSingleListParties,
  setExportPartiesExcelData,
  setExportPartiesPdfData,
  setListFilter,
  setPartiesCRUDLoading,
  setPartiesDownloadLoading,
  setTransporterPartyList,
  setAllUserPartyList,
  setOnlyTransporterPartyList,
  setIsPartyDeleted,
  setPartyTypeListMenu,
  setPartiesListLoading,
  setCustomerRating,
  setPartiesCategoriesLoading,
} from 'Store/Reducers/Parties/parties.slice';

/**
 * @desc get parties active party types
 * @param payload (parties)
 */
export const getPartiesActivePartyTypes = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

    const response = await axios.get(`/list/active/partyType`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          value: x?._id,
          label: x?.name,
        };
      });
      const partyTypeList = data.map(item => ({
        label: item?.name,
        value: item?.name,
      }));
      dispatch(setPartyTypeListMenu(partyTypeList || []));
      dispatch(setPartiesActivePartyTypes(updated));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

export const getCustomerRating = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

    const response = await axios.get(`/list/active/customerRating`);
    const { msg, err, data } = response.data;
    if (err === 0) {
      const newData = data.map(x => {
        return {
          value: x?._id,
          label: x?.star_rating,
        };
      });
      dispatch(setCustomerRating(newData));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get parties advisor
 * @param payload (parties)
 */
export const getPartiesAdvisor = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

    const response = await axios.get(`/list/salesAdvisor`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          value: x?._id,
          label: `${x?.first_name}  ${x?.last_name}`,
        };
      });
      dispatch(setPartiesAdvisor(updated));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get parties active market
 * @param payload (parties)
 */
export const getPartiesActiveMarket = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

    const response = await axios.get(`/list/active/market`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setPartiesActiveMarket(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get parties active industry
 * @param payload (parties)
 */

export const getPartiesActiveIndustry = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

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
      dispatch(setPartiesActiveIndustry(updated));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get parties customer source
 * @param payload (parties)
 */

export const getPartiesCustomerSource = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

    const response = await axios.get(`/list/active/customerSource`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          value: x?._id,
          label: x?.name,
        };
      });
      dispatch(setPartiesCustomerSource(updated));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get parties customer source detail
 * @param payload (parties)
 */

export const getPartiesCustomerSourceDetail = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

    const response = await axios.get(`/list/active/customerSourceDetail`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setPartiesCustomerSourceDetail(data));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get parties address types
 */
export const getPartiesAddressTypes = () => async dispatch => {
  try {
    // dispatch(setPartiesLoading(true));
    dispatch(setPartiesCategoriesLoading(true));

    const response = await axios.get(`/list/active/addressType`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          value: x?._id,
          label: x?.name,
        };
      });
      dispatch(setPartiesAddressType(updated));
      return updated;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    // dispatch(setPartiesLoading(false));
    dispatch(setPartiesCategoriesLoading(false));
  }
};

/**
 * @desc get parties country
 * @param payload (parties)
 */

export const getPartiesCountry = () => async dispatch => {
  try {
    // dispatch(setPartiesLoading(true));
    dispatch(setPartiesCategoriesLoading(true));

    const response = await axios.get(`/country/listall`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          value: x?._id,
          label: x?.name,
        };
      });
      dispatch(setPartiesCountry(updated));
      return updated;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    // dispatch(setPartiesLoading(false));
    dispatch(setPartiesCategoriesLoading(false));
  }
};

/**
 * @desc get parties state
 * @param payload (country_code)
 */

export const getPartiesState = country_code => async dispatch => {
  try {
    if (country_code) {
      dispatch(setPartiesLoading(true));
      const response = await axios.get(`/allstate/${country_code.code}`);
      const { msg, err, data } = response.data;

      if (err === 0) {
        const updated = data?.map(x => {
          return {
            ...x,
            value: x?._id,
            label: x?.name,
          };
        });
        dispatch(setPartiesState(updated));
        return updated;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get parties city
 * @param payload (parties)
 */

export const getPartiesCity = parties => async dispatch => {
  try {
    if (parties) {
      dispatch(setPartiesLoading(true));

      const response = await axios.get(`/allcity/${parties.state_id}`);
      const { msg, err, data } = response.data;

      if (err === 0) {
        const updated = data?.map(x => {
          return {
            ...x,
            value: x?._id,
            label: x?.name,
          };
        });
        dispatch(setPartiesCity(updated));
        return updated;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    roastError();

    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc add parties
 * @param payload (parties)
 */
export const addParties = parties => async dispatch => {
  try {
    if (parties) {
      dispatch(setPartiesCRUDLoading(true));

      const response = await axios.post(`/add/party`, parties);

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
    roastError();
    return false;
  } finally {
    dispatch(setPartiesCRUDLoading(false));
  }
};

/* @desc get parties city
 * @param payload (parties)
 */
export const downloadSampleExcelFile = () => async dispatch => {
  try {
    dispatch(setPartiesDownloadLoading(true));

    const response = await axios.post(`/export/party/excel`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      return data;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesDownloadLoading(false));
  }
};

/**
 * @desc Add New Parties From Excel
 * @param payload (parties)
 */
export const addNewPartiesFromExcel = payload => async dispatch => {
  try {
    if (payload) {
      const isValidPartyName = payload?.partyList?.filter(x => !x?.party_name);
      const isValidPartyType = payload?.partyList?.filter(x => !x?.party_type);

      if (isValidPartyName?.length > 0) {
        toast.error('Please provide valid party name');
        return;
      }
      if (isValidPartyType?.length > 0) {
        toast.error('Please select valid party type');
        return;
      }

      dispatch(setPartiesCRUDLoading(true));

      const response = await axios.post(`/import/party`, payload);
      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      }
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesCRUDLoading(false));
  }
};

/**
 * @desc get List Parties
 * @param payload (parties)
 */
export const getPartiesList =
  (limit = 30, start = 1, query = '', filter = {}) =>
  async dispatch => {
    try {
      dispatch(setPartiesListLoading(true));
      const response = await axios.post(`/list/party/${start}/${limit}`, {
        filter: filter,
        search: query,
      });
      const { msg, err, data } = response.data;

      const updatedData = data?.list?.map(y => {
        return {
          ...y,
          active_status: y?.is_active === true ? 'Yes' : 'No',
          bag_rate_list_str: y.bag_rate_list
            ? `Rate List ${y.bag_rate_list}`
            : '',
          mobile_registered: y.is_mobile_app_registered ? 'Yes' : 'No',
        };
      });

      if (err === 0) {
        let updated = {
          ...data,
          list: updatedData,
        };
        dispatch(setListParties(updated));
        // dispatch(setPartiesListCount(data?.count));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      toast.error('Something goes wrong, please try again later');
      return false;
    } finally {
      dispatch(setPartiesListLoading(false));
    }
  };

/**
 * @desc Get Parties State Without Country
 */
export const getPartiesStateWithoutCountry = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

    const response = await axios.get(`/list/allstate`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          value: x?.name,
          label: x?.name,
        };
      });
      dispatch(setPartiesStateWithoutCountry(updated));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc Get Parties Cities Without State
 */
export const getPartiesCitiesWithoutState = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

    const response = await axios.get(`/list/allcity`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          value: x?.name,
          label: x?.name,
        };
      });
      dispatch(setPartiesCitiesWithoutState(updated));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get single list parties
 * @param payload (parties)
 */
export const getSingleListParties = partiesId => async dispatch => {
  try {
    if (partiesId) {
      dispatch(setPartiesLoading(true));
      // dispatch(setPartiesCRUDLoading(true));
      const response = await axios.get(`view/party/${partiesId}`);
      const { err, data } = response.data;

      if (err === 0) {
        const updated = {
          ...data,
          party_address: data?.party_address?.map(x => {
            return {
              ...x,
              label: x?.business_name,
              value: x?._id,
            };
          }),
        };
        dispatch(setSingleListParties(updated));
        return updated;
      } else {
      }
    }
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
    // dispatch(setPartiesCRUDLoading(false));
  }
};

/**
 * @desc update parties
 * @param payload (parties)
 */
export const updateParties = parties => async dispatch => {
  try {
    if (parties) {
      dispatch(setPartiesCRUDLoading(true));

      const response = await axios.post(`/update/party`, parties);

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
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesCRUDLoading(false));
  }
};

/**
 * @desc  parties delete
 * @param payload (parties)
 */
export const deletePartiesDetails = partiesId => async dispatch => {
  try {
    if (partiesId) {
      dispatch(setPartiesCRUDLoading(true));

      const response = await axios.post(`/delete/party`, {
        party_id: partiesId,
      });

      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
        dispatch(setIsPartyDeleted(true));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesCRUDLoading(false));
  }
};

/**
 * @desc get  export party excel
 * @param payload (parties)
 */

export const getExportPartiesExcel = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));
    const response = await axios.post(`export/party/excel`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setExportPartiesExcelData(data));
      window.open(data, '_blank');
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get  export Transporters party excel
 * @param payload (parties)
 */

export const getExportTransportersPartiesExcel = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));
    const response = await axios.post(`export/transporter/party/excel`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setExportPartiesExcelData(data));
      window.open(data, '_blank');
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get  export  party pdf
 * @param payload (parties)
 */
export const getExportPartiesPdf = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));
    const response = await axios.post(`export/party/pdf`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setExportPartiesPdfData(data));
      window.open(data, '_blank');
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get  export Transporters party pdf
 * @param payload (parties)
 */
export const getExportTransportersPartiesPdf = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));
    const response = await axios.post(`export/transporter/party/pdf`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      dispatch(setExportPartiesPdfData(data));
      window.open(data, '_blank');
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get  list only transporter party
 * @param payload (parties)
 */
export const getTransporterPartiesList =
  (limit = 30, start = 1, query = '', filter = {}) =>
  async dispatch => {
    try {
      dispatch(setPartiesLoading(true));
      const response = await axios.post(
        `/list/transporter/party/${start}/${limit}`,
        {
          filter: filter,
          search: query,
        },
      );
      const { msg, err, data } = response.data;

      const updatedData = data?.list?.map(y => {
        return {
          ...y,
          active_status: y?.is_active === true ? 'Yes' : 'No',
          bag_rate_list_str: y.bag_rate_list
            ? `Rate List ${y.bag_rate_list}`
            : '',
          mobile_registered: y.is_mobile_app_registered ? 'Yes' : 'No',
        };
      });

      if (err === 0) {
        let updated = {
          ...data,
          list: updatedData,
        };
        dispatch(setOnlyTransporterPartyList(updated));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      toast.error('Something goes wrong, please try again later');
      return false;
    } finally {
      dispatch(setPartiesLoading(false));
    }
  };

/**
 * @desc get  list Filter
 * @param payload (Module Name)
 */

export const getListFilter = parties => async dispatch => {
  try {
    if (parties) {
      dispatch(setPartiesLoading(true));
      const response = await axios.post(`/list/filter`, parties);
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setListFilter(data));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    }
  } catch (e) {
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc add filter
 * @param payload (parties)
 */
export const addFilter = parties => async dispatch => {
  try {
    if (parties) {
      dispatch(setPartiesCRUDLoading(true));

      const response = await axios.post(`/add/filter`, parties);

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
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesCRUDLoading(false));
  }
};

/**
 * @desc update filter
 * @param payload (parties)
 */
export const updateFilter = parties => async dispatch => {
  try {
    if (parties) {
      dispatch(setPartiesCRUDLoading(true));

      const response = await axios.post(`update/filter`, parties);

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
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesCRUDLoading(false));
  }
};

/**
 * @desc delete filter
 * @param payload (parties)
 */
export const deleteFilter = parties => async dispatch => {
  try {
    if (parties) {
      dispatch(setPartiesCRUDLoading(true));

      const response = await axios.post(`delete/filter`, parties);

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
    toast.error('Something goes wrong, please try again later');
    return false;
  } finally {
    dispatch(setPartiesCRUDLoading(false));
  }
};

/**
 * @desc get Transporter Party List
 * @param payload (parties)
 */
export const getTransporterPartyList = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

    const response = await axios.get(`/list/transporterParty`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          value: x?._id,
          label: x?.party_name,
        };
      });
      dispatch(setTransporterPartyList(updated));
      return updated;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};

/**
 * @desc get All User party List
 */
export const getAllUserPartyList = () => async dispatch => {
  try {
    dispatch(setPartiesLoading(true));

    const response = await axios.get(`/list/allPartyUser`);
    const { msg, err, data } = response.data;

    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          value: x?._id,
          label: x?.party_name,
        };
      });
      dispatch(setAllUserPartyList(updated));
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setPartiesLoading(false));
  }
};
