import { roastError } from 'Helper/Common';
import {
  setSelectedUser,
  setUserCount,
  setUserList,
  setUserListFilter,
  setUserLoading,
  setUsersCRUDLoading,
  setUsersDownloadLoading,
} from 'Store/Reducers/Settings/User.slice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc  Get User(Employee) List
 */
export const getUserList =
  (limit = 30, start = 1, query = '', filter = {}) =>
  async (dispatch, getState) => {
    try {
      dispatch(setUserLoading(true));
      // let updated = {};

      // if (Object.keys(filter)?.length > 0) {
      //   for (let key in filter) {
      //     if (key === 'role_type' || key === 'designation') {
      //       if (
      //         !filter.hasOwnProperty('role_type') &&
      //         filter.hasOwnProperty('designation')
      //       ) {
      //         updated['operator_role'] = filter.designation;
      //       } else if (
      //         filter.hasOwnProperty('role_type') &&
      //         !filter.hasOwnProperty('designation')
      //       ) {
      //         if (filter.role_type === 'operator') {
      //           updated['operator_role'] = filter.designation;
      //         } else if (filter.role_type === 'office_staff') {
      //           updated['role'] = filter.designation;
      //         }
      //       }
      //     } else {
      //       updated[key] = filter[key];
      //     }
      //   }
      // }

      const response = await axios.post(`list/employee/${start}/${limit}`, {
        filter: filter || {},
        search: query,
      });
      const { data, err, msg } = response.data;

      if (err === 0) {
        const updated = data?.list?.map((x, i) => {
          return {
            ...x,
            emp_no: i + 1,
            dob: x?.dob,
            joining_date_formatted: x?.joining_date,
            role_name: x?.role_name || 'Operator',
            operator: x?.operator ? 1 : 0,
            office_staff: x?.office_staff ? 1 : 0,
            timing_based_login: x?.timing_based_login ? 1 : 0,
            type: x?.operator ? 'Operator' : 'Staff',
            designation: x?.operator_role_name
              ? x?.operator_role_name
              : x?.role_name
              ? x?.role_name
              : x?.operator
              ? 'Operator'
              : '',
            status: x?.is_active ? 'Yes' : 'No',
            is_active: x?.is_active ? 1 : 0,
          };
        });
        dispatch(setUserList(updated || []));
        dispatch(setUserCount(data?.count || 0));
        return true;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setUserLoading(false));
    }
  };

/**
 * @desc  Get Single User(Employee)
 */
export const getSingleUser = id => async (dispatch, getState) => {
  try {
    if (id) {
      dispatch(setUserLoading(true));

      const response = await axios.get(`view/user/${id}`);
      const { data, err, msg } = response.data;
      if (err === 0) {
        const updated = {
          ...data,
          dob: data?.dob ? new Date(data?.dob) : null,
          joining_date_formatted: data?.joining_date,
          joining_date: data?.joining_date
            ? new Date(data?.joining_date)
            : null,
          role_name: data?.role_name || 'Operator',
          operator: data?.operator ? 1 : 0,
          office_staff: data?.office_staff ? 1 : 0,
          timing_based_login: data?.timing_based_login ? 1 : 0,
          type: data?.operator ? 'Operator' : 'Staff',
          designation: data?.operator_role_name
            ? data?.operator_role_name
            : data?.role_name,
          ...(data?.operator === true && {
            machineType_printTechnology: [
              ...data?.machine_type,
              ...data?.print_technology,
            ],
          }),
          is_active: data?.is_active ? 1 : 0,
        };
        dispatch(setSelectedUser(updated));
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
    dispatch(setUserLoading(false));
  }
};

/**
 * @desc  Create New User
 * @param payload (new User)
 */
export const createNewUser = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setUsersCRUDLoading(true));

      const response = await axios.post(`/add/employee`, payload);
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
    dispatch(setUsersCRUDLoading(false));
  }
};

/**
 * @desc  Update User
 * @param payload (User Details)
 */
export const updateUser = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setUsersCRUDLoading(true));

      const response = await axios.post(`/update/employee`, payload);
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
    dispatch(setUsersCRUDLoading(false));
  }
};

/**
 * @desc  Download Id Card
 * @param payload (User ID)
 */
export const downloadIdCard = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setUsersDownloadLoading(true));

      const response = await axios.post(`/download/empid`, payload);
      const { err, msg, data } = response.data;
      if (err === 0) {
        window.open(data, '_blank');
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
    dispatch(setUsersDownloadLoading(false));
  }
};

/**
 * @desc  Download Own Id Card
 */
export const downloadOwnIdCard = () => async dispatch => {
  try {
    dispatch(setUsersDownloadLoading(true));

    const response = await axios.post(`/download/id`);
    const { err, msg, data } = response.data;
    if (err === 0) {
      toast.success(msg);
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
    dispatch(setUsersDownloadLoading(false));
  }
};

/**
 * @desc  Delete User
 * @param payload (user_id)
 */
export const deleteUser = user_id => async dispatch => {
  try {
    if (user_id) {
      dispatch(setUsersCRUDLoading(true));

      const response = await axios.post(`/delete/employee`, {
        user_id,
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
    dispatch(setUsersCRUDLoading(false));
  }
};

/**
 * @desc get  list Filter
 * @param payload (Users)
 */

export const getUserListFilter = users => async dispatch => {
  try {
    if (users) {
      dispatch(setUserLoading(true));
      const response = await axios.post(`/list/filter`, users);
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setUserListFilter(data));
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
    dispatch(setUserLoading(false));
  }
};

/**
 * @desc delete filter
 * @param payload (users)
 */
export const deleteUserFilter = parties => async dispatch => {
  try {
    if (parties) {
      dispatch(setUsersCRUDLoading(true));

      const response = await axios.post(`delete/filter`, parties);

      const { msg, err } = response.data;

      if (err === 0) {
        toast.success(msg);
        dispatch(
          getUserListFilter({
            module_name: 'users',
          }),
        );
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
    dispatch(setUsersCRUDLoading(false));
  }
};
