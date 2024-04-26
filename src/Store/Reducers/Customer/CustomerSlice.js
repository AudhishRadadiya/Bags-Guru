import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  customerLoading: false,
  typeSelect: 'all',
  customerList: [],
  customerDataCount: 0,
  customerFilterListOptions: {},
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerLoading: (state, action) => {
      state.customerLoading = action.payload;
    },
    setTypeSelect: (state, action) => {
      state.typeSelect = action.payload;
    },
    setCustomerList: (state, action) => {
      state.customerList = action.payload;
    },
    setCustomerDataCount: (state, action) => {
      state.customerDataCount = action.payload;
    },
    setCustomerFilterListOptions: (state, action) => {
      state.customerFilterListOptions = action.payload;
    },
  },
});

export const {
  setCustomerLoading,
  setTypeSelect,
  setCustomerList,
  setCustomerDataCount,
  setBrokerOptionsList,
  setBrokerMarginAnalysisList,
  setPendingBrokerMarginList,
  setCustomerFilterListOptions,
} = customerSlice.actions;

export default customerSlice.reducer;
