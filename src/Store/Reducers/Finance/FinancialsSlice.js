import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  financeLoading: false,
  brokerMarginLoading: false,
  financeList: [],
  financeDataCount: 0,
  brokerOptionsList: [],
  brokerMarginAnalysisList: {},
  pendingBrokerMarginList: {},
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setFinanceLoading: (state, action) => {
      state.financeLoading = action.payload;
    },
    setBrokerMarginLoading: (state, action) => {
      state.brokerMarginLoading = action.payload;
    },
    setFinanceList: (state, action) => {
      state.financeList = action.payload;
    },
    setFinanceDataCount: (state, action) => {
      state.financeDataCount = action.payload;
    },
    setBrokerOptionsList: (state, action) => {
      state.brokerOptionsList = action.payload;
    },
    setBrokerMarginAnalysisList: (state, action) => {
      state.brokerMarginAnalysisList = action.payload;
    },
    setPendingBrokerMarginList: (state, action) => {
      state.pendingBrokerMarginList = action.payload;
    },
  },
});

export const {
  setFinanceLoading,
  setBrokerMarginLoading,
  setFinanceList,
  setFinanceDataCount,
  setBrokerOptionsList,
  setBrokerMarginAnalysisList,
  setPendingBrokerMarginList,
} = financeSlice.actions;

export default financeSlice.reducer;
