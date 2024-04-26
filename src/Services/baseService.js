import { roastError } from 'Helper/Common';
import {
  setAllModules,
  setOperatorpermissionList,
  setSettingLoading,
  setUserRoles,
  setUserpermissionList,
} from 'Store/Reducers/Settings/SettingSlice';
import axios from 'axios';

export const getCurrentUserFromLocal = () => {
  const userPreferences = localStorage.getItem('UserPreferences');
  if (userPreferences) {
    return JSON.parse(localStorage.getItem('UserPreferences'));
  }
  return null;
};

/**
 * @desc  Get User Roles List
 */
export const getUserRolesList = () => async dispatch => {
  try {
    dispatch(setSettingLoading(true));

    const response = await axios.get(`/list/userRole`);
    const { err, data } = response.data;
    if (err === 0) {
      const updated = data?.map(x => {
        return {
          ...x,
          is_active: x?.is_active ? 1 : 0,
          status: x?.is_active ? 'Yes' : 'No',
          label: x?.name,
          value: x?._id,
        };
      });
      dispatch(setUserRoles(updated || []));
    }
    return true;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSettingLoading(false));
  }
};

/**
 * @desc  Get Main Module With Sub Module
 */
export const getMainModuleWithSubModule = () => async dispatch => {
  try {
    dispatch(setSettingLoading(true));

    const response = await axios.get(`/list/mainModuleWithSubModule`);
    const { data } = response.data;
    if (data) {
      dispatch(setAllModules(data));
      return true;
    }
  } catch (e) {
    roastError();
    return false;
  } finally {
    dispatch(setSettingLoading(false));
  }
};

/**
 * @desc  Get Main Module With Sub Module
 */
export const getUserPermissionList = () => async dispatch => {
  try {
    dispatch(setSettingLoading(true));
    const response = await axios.get(`/list/permission`);
    const { data } = response.data;

    if (data) {
      dispatch(setUserpermissionList(data));
      let user = JSON.parse(localStorage.getItem('UserPreferences'));

      if (user) {
        user.permission = data;

        if (user?.operator === true) {
          const purchases = data.find(item => item.name === 'Purchases');
          const sales = data.find(item => item.name === 'Sales');
          const production = data.find(item => item.name === 'Production');

          if (purchases || sales || production) {
            const purchasesSubModules = [
              {
                name: 'Purchase Order Operator',
                permission: {
                  create: true,
                  delete: true,
                  edit: true,
                  export: true,
                  import: true,
                  print: true,
                  view: true,
                },
              },
            ];

            const salesSubModules = [
              {
                name: 'Orders',
                permission: {
                  create: true,
                  delete: true,
                  edit: true,
                  export: true,
                  import: true,
                  print: true,
                  view: true,
                },
              },
              {
                name: 'Pro-forma Invoice',
                permission: {
                  create: true,
                  delete: true,
                  edit: true,
                  export: true,
                  import: true,
                  print: true,
                  view: true,
                },
              },
              {
                name: 'Tax Invoice',
                permission: {
                  create: false,
                  delete: true,
                  edit: true,
                  export: true,
                  import: true,
                  print: true,
                  view: true,
                },
              },
            ];

            const productionSubModule = [
              {
                name: 'MFG Live Operator',
                permission: {
                  create: true,
                  delete: true,
                  edit: true,
                  export: true,
                  import: true,
                  print: true,
                  view: true,
                },
              },
              {
                name: 'Machine Job Queue Operator',
                permission: {
                  create: true,
                  delete: true,
                  edit: true,
                  export: true,
                  import: true,
                  print: true,
                  view: true,
                },
              },
            ];

            const updatedPurchases = {
              ...purchases,
              sub_module: [...purchases.sub_module, ...purchasesSubModules],
            };

            const updatedSales = {
              ...sales,
              sub_module: [...sales.sub_module, ...salesSubModules],
            };

            const updatedProduction = {
              ...production,
              sub_module: [...production.sub_module, ...productionSubModule],
            };

            const newData = data.map(item => {
              if (item._id === updatedPurchases._id) {
                return updatedPurchases;
              } else if (item._id === updatedSales._id) {
                return updatedSales;
              } else if (item._id === updatedProduction._id) {
                return updatedProduction;
              } else {
                return item;
              }
            });

            user.operatorPermission = newData;
            dispatch(setOperatorpermissionList(newData));
          }
        }
        localStorage.setItem('UserPreferences', JSON.stringify(user));
        return true;
      }
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setSettingLoading(false));
  }
};

/**
 * @desc  Is user has the particular role access
 */
export const isRoleAccess = roleName => (dispatch, getState) => {
  const user = JSON.parse(localStorage.getItem('UserPreferences'));

  if (
    (user?.operator && roleName?.subModule === 'Order Operator') ||
    (user?.operator && roleName?.subModule === 'Stock(Raw Material)') ||
    (user?.operator && roleName?.subModule === 'MFG Live Operator') ||
    (user?.operator && roleName?.subModule === 'Pending Jobs') ||
    roleName?.subModule === 'Other'
  ) {
    return {
      is_create_access: true,
      is_edit_access: true,
      is_view_access: true,
      is_export_access: true,
      is_import_access: true,
      is_delete_access: true,
      is_print_access: true,
    };
  }

  const userPermission = JSON.parse(
    localStorage.getItem('UserPreferences'),
  )?.permission;

  const operatorPermission = JSON.parse(
    localStorage.getItem('UserPreferences'),
  )?.operatorPermission;

  if (userPermission?.length || operatorPermission?.length) {
    const permissions =
      user?.operator === true ? operatorPermission : userPermission;

    const isMainModule = permissions?.find(
      x => x?.name === roleName?.mainModule,
    );
    const access = isMainModule?.sub_module?.find(
      x => x?.name === roleName?.subModule,
    )?.permission;

    if (access)
      return {
        is_create_access: access?.create,
        is_edit_access: access?.edit,
        is_view_access: access?.view,
        is_export_access: access?.export,
        is_import_access: access?.import,
        is_delete_access: access?.delete,
        is_print_access: access?.print,
      };
  }
};
