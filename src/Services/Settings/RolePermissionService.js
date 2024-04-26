import { roastError } from 'Helper/Common';
import {
  permission,
  setSelectedRolePermissions,
  setSettingsCRUDLoading,
} from 'Store/Reducers/Settings/SettingSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc Create User Role With Permission
 */
export const createUserRoleWithPermission =
  payload => async (dispatch, getState) => {
    try {
      if (payload) {
        dispatch(setSettingsCRUDLoading(true));

        const response = await axios.post(
          `add/userRoleWithPermission`,
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
      dispatch(setSettingsCRUDLoading(false));
    }
  };

/**
 * @desc Update Module With Permission
 */
export const updateModulePermission = payload => async (dispatch, getState) => {
  try {
    if (payload) {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`update/modulePermission`, payload);
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
 * @desc Get Module With Permission
 * @param (role_id)
 */
export const getRoleWisePermission =
  (role_id, role) => async (dispatch, getState) => {
    try {
      if (role_id) {
        dispatch(setSettingsCRUDLoading(true));

        const response = await axios.post(`list/roleWisePermission`, {
          role_id,
        });
        const { err, msg, data } = response.data;

        if (err === 0) {
          const state = getState();
          const { userRoles } = state?.settings;
          const AllModulesPermission = { ...permission };
          const udpated = {
            name: userRoles?.find(x => x?._id === role_id)?.name,
            comment: userRoles?.find(x => x?._id === role_id)?.comment,
            is_active: userRoles?.find(x => x?._id === role_id)?.is_active
              ? 1
              : 0,
            permission: data?.map(x => {
              return {
                ...x,
                isSelectedAll: 0,
                main_module_id: x?._id,
                sub_module_permission:
                  x?.sub_module?.length > 0
                    ? x?.sub_module?.map((y, i) => {
                        return {
                          name: y?.name,
                          sub_module_id: y?._id,
                          create: y?.permission?.create ? 1 : 0,
                          view: y?.permission?.view ? 1 : 0,
                          import: y?.permission?.import ? 1 : 0,
                          delete: y?.permission?.delete ? 1 : 0,
                          edit: y?.permission?.edit ? 1 : 0,
                          export: y?.permission?.export ? 1 : 0,
                          print: y?.permission?.print ? 1 : 0,
                        };
                      })
                    : AllModulesPermission?.permission
                        ?.filter(y => {
                          if (y.name === x.name) {
                            return y?.sub_module_permission;
                          }
                        })?.[0]
                        ?.sub_module_permission?.map(z => {
                          return {
                            ...z,
                            sub_module_id: z?._id,
                          };
                        }),
              };
            }),
          };
          dispatch(setSelectedRolePermissions(udpated));
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
 * @desc delete  User Role Wise Permission
 */
export const deleteRoleWisePermission = role_id => async dispatch => {
  try {
    if (role_id) {
      dispatch(setSettingsCRUDLoading(true));

      const response = await axios.post(`delete/userRole`, {
        role_id: role_id,
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
    dispatch(setSettingsCRUDLoading(false));
  }
};
