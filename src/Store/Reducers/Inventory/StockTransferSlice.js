import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  stockTransferLoading: false,
  stockTransferExportLoading: false,
  stockTransferList: [],
  stockTransferCount: 0,
  sortStockTransferField: null,
  sortStockTransferOrder: null,
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
    setSortStockTransferField: (state, action) => {
      state.sortStockTransferField = action.payload;
    },
    setSortStockTransferOrder: (state, action) => {
      state.sortStockTransferOrder = action.payload;
    },
  },
});

export const {
  setStockTransferLoading,
  setStockTransferExportLoading,
  setStockTransferList,
  setStockTransferCount,
  setSortStockTransferField,
  setSortStockTransferOrder,
} = StockTransferSlice.actions;

export default StockTransferSlice.reducer;
