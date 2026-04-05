import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  roleAndPermissionLoading: false,
  roleAndPermissionCRUDLoading: false,
  roleAndPermissionList: [],
  sortRolesPermissionField: '',
  sortRolesPermissionOrder: 1,
};

const roleAndPermissionSlice = createSlice({
  name: 'roleAndPermission',
  initialState,
  reducers: {
    setRoleAndPermissionSliceLoading: (state, action) => {
      state.roleAndPermissionLoading = action.payload;
    },
    setRoleAndPermissionSliceList: (state, action) => {
      state.roleAndPermissionList = action.payload;
    },
    setRoleAndPermissionSliceCRUDLoading: (state, action) => {
      state.roleAndPermissionCRUDLoading = action.payload;
    },
    setSortRolesPermissionField: (state, action) => {
      state.sortRolesPermissionField = action.payload;
    },
    setSortRolesPermissionOrder: (state, action) => {
      state.sortRolesPermissionOrder = action.payload;
    },
  },
});

export const {
  setRoleAndPermissionSliceLoading,
  setRoleAndPermissionSliceList,
  setRoleAndPermissionSliceCRUDLoading,
  setSortRolesPermissionField,
  setSortRolesPermissionOrder,
} = roleAndPermissionSlice.actions;

export default roleAndPermissionSlice.reducer;
