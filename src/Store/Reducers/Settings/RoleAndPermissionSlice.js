import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  roleAndPermissionLoading: false,
  roleAndPermissionCRUDLoading: false,
  roleAndPermissionList: [],
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
  },
});

export const {
  setRoleAndPermissionSliceLoading,
  setRoleAndPermissionSliceList,
  setRoleAndPermissionSliceCRUDLoading,
} = roleAndPermissionSlice.actions;

export default roleAndPermissionSlice.reducer;
