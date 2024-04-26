import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  salesTurnoverLoading: false,
  pendingJobsLoading: false,
  finishedGoodsLoading: false,
  rawMaterialLoading: false,
  salesReportsLoading: false,
  salesTurnoverValuationList: {},
  updatedSalesTurnoverValuationList: [],
  salesTurnoverPercentageList: {},
  updatedSalesTurnoverPercentageList: [],
};

const SalesTurnoverSlice = createSlice({
  name: 'salesTurnover',
  initialState,
  reducers: {
    setSalesTurnoverLoading: (state, action) => {
      state.salesTurnoverLoading = action.payload;
    },
    setRawMaterialLoading: (state, action) => {
      state.rawMaterialLoading = action.payload;
    },
    setPendingJobsLoading: (state, action) => {
      state.pendingJobsLoading = action.payload;
    },
    setFinishedGoodsLoading: (state, action) => {
      state.finishedGoodsLoading = action.payload;
    },
    setSalesReportsLoading: (state, action) => {
      state.salesReportsLoading = action.payload;
    },
    setSalesTurnoverValuationList: (state, action) => {
      state.salesTurnoverValuationList = action.payload;
    },
    setUpdatedSalesTurnoverValuationList: (state, action) => {
      state.updatedSalesTurnoverValuationList = action.payload;
    },
    setSalesTurnoverPercentageList: (state, action) => {
      state.salesTurnoverPercentageList = action.payload;
    },
    setUpdatedSalesTurnoverPercentageList: (state, action) => {
      state.updatedSalesTurnoverPercentageList = action.payload;
    },
  },
});

export const {
  setSalesTurnoverLoading,
  setRawMaterialLoading,
  setPendingJobsLoading,
  setFinishedGoodsLoading,
  setSalesReportsLoading,
  setSalesTurnoverValuationList,
  setSalesTurnoverPercentageList,
  setUpdatedSalesTurnoverValuationList,
  setUpdatedSalesTurnoverPercentageList,
} = SalesTurnoverSlice.actions;

export default SalesTurnoverSlice.reducer;
