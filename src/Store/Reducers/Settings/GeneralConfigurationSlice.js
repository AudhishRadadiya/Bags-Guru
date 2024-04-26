import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  gCLoading: false,
  singleListGC: [],
};

const generalConfigurationSlice = createSlice({
  name: 'gC',
  initialState,
  reducers: {
    setGCLoading: (state, action) => {
      state.gCLoading = action.payload;
    },
    setSingleListGC: (state, action) => {
      state.singleListGC = action.payload;
    },
  },
});

export const { setGCLoading, setSingleListGC } =
  generalConfigurationSlice.actions;

export default generalConfigurationSlice.reducer;
