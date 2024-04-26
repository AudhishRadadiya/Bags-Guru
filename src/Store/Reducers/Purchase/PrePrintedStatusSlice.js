import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  prePrintedStatusLoading: false,
  prePrintedStatusListLoading: false,
  prePrintedPurchaseOrderList: {},
  completedPrePrintedOrderList: {},
  savedPrePrintedOrder: {},
  selectedRollsData: [],
};

const prePrintedStatusSlice = createSlice({
  name: 'prePrintedStatus',
  initialState,
  reducers: {
    setPrePrintedStatusListLoading: (state, action) => {
      state.prePrintedStatusListLoading = action.payload;
    },
    setPrePrintedStatusLoading: (state, action) => {
      state.prePrintedStatusLoading = action.payload;
    },
    setPrePrintedPurchaseOrderList: (state, action) => {
      state.prePrintedPurchaseOrderList = action.payload;
    },
    setCompletedPrePrintedOrderList: (state, action) => {
      state.completedPrePrintedOrderList = action.payload;
    },
    setSavedPrePrintedOrder: (state, action) => {
      state.savedPrePrintedOrder = action.payload;
    },
    setSelectedRollsData: (state, action) => {
      state.selectedRollsData = action.payload;
    },
  },
});

export const {
  setPrePrintedStatusLoading,
  setPrePrintedStatusListLoading,
  setPrePrintedPurchaseOrderList,
  setCompletedPrePrintedOrderList,
  setSavedPrePrintedOrder,
  setSelectedRollsData,
} = prePrintedStatusSlice.actions;
export default prePrintedStatusSlice.reducer;
