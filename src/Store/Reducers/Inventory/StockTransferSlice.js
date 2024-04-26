import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  stockTransferLoading: false,
  stockTransferExportLoading: false,
  stockTransferList: [],
  stockTransferCount: 0,
};

const StockTransferSlice = createSlice({
  name: 'stockTransfer', // inventory stock consumption
  initialState,
  reducers: {
    setStockTransferLoading: (state, action) => {
      state.stockTransferLoading = action.payload;
    },
    setStockTransferExportLoading: (state, action) => {
      state.stockTransferExportLoading = action.payload;
    },
    setStockTransferList: (state, action) => {
      state.stockTransferList = action.payload;
    },
    setStockTransferCount: (state, action) => {
      state.stockTransferCount = action.payload;
    },
  },
});

export const {
  setStockTransferLoading,
  setStockTransferExportLoading,
  setStockTransferList,
  setStockTransferCount,
} = StockTransferSlice.actions;

export default StockTransferSlice.reducer;
