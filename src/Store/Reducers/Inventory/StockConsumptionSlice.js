import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  stockConsumptionLoading: false,
  stockConsumptionExportLoading: false,
  stockConsumptionList: [],
  stockConsumptionCount: 0,
  sortStockConsumptionField: null,
  sortStockConsumptionOrder: null,
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
    setSortStockConsumptionField: (state, action) => {
      state.sortStockConsumptionField = action.payload;
    },
    setSortStockConsumptionOrder: (state, action) => {
      state.sortStockConsumptionOrder = action.payload;
    },
  },
});

export const {
  setStockConsumptionCount,
  setStockConsumptionList,
  setStockConsumptionLoading,
  setStockConsumptionExportLoading,
  setSortStockConsumptionField,
  setSortStockConsumptionOrder,
} = StockConsumptionSlice.actions;

export default StockConsumptionSlice.reducer;
