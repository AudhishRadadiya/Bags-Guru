import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  stockConsumptionLoading: false,
  stockConsumptionExportLoading: false,
  stockConsumptionList: [],
  stockConsumptionCount: 0,
};

const StockConsumptionSlice = createSlice({
  name: 'stockConsumption', // inventory stock consumption
  initialState,
  reducers: {
    setStockConsumptionLoading: (state, action) => {
      state.stockConsumptionLoading = action.payload;
    },
    setStockConsumptionExportLoading: (state, action) => {
      state.stockConsumptionExportLoading = action.payload;
    },
    setStockConsumptionList: (state, action) => {
      state.stockConsumptionList = action.payload;
    },
    setStockConsumptionCount: (state, action) => {
      state.stockConsumptionCount = action.payload;
    },
  },
});

export const {
  setStockConsumptionCount,
  setStockConsumptionList,
  setStockConsumptionLoading,
  setStockConsumptionExportLoading,
} = StockConsumptionSlice.actions;

export default StockConsumptionSlice.reducer;
