import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  stockRawLoading: false,
  stockRawListingLoading: false,
  stockRawExportLoading: false,
  stockRawList: [],
  stockRawBaseDataList: [],
  exportInventoryStockPdfData: [],
  exportInventoryExcelData: [],
  stockSingleRowData: {},
  rollConsumptionList: [],
  inkConsumptionList: [],
  rollConsumptionCount: 0,
  inkConsumptionCount: 0,
  selectedStockTransferData: {
    list: [],
    disabled: true,
  },
  isStockTransfer: false,
};

const StockRowMaterial = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStockRawLoading: (state, action) => {
      state.stockRawLoading = action.payload;
    },
    setStockRawListingLoading: (state, action) => {
      state.stockRawListingLoading = action.payload;
    },
    setStockRawExportLoading: (state, action) => {
      state.stockRawExportLoading = action.payload;
    },
    setStockRawList: (state, action) => {
      state.stockRawList = action.payload;
    },
    setStockRawBaseDataList: (state, action) => {
      state.stockRawBaseDataList = action.payload;
    },
    setExportInventoryStockPdfData: (state, action) => {
      state.exportInventoryStockPdfData = action.payload;
    },
    setExportInventoryExcelData: (state, action) => {
      state.exportInventoryExcelData = action.payload;
    },
    setStockSingleRowData: (state, action) => {
      state.stockSingleRowData = action.payload;
    },
    setRollConsumptionList: (state, action) => {
      state.rollConsumptionList = action.payload;
    },
    setRollConsumptionCount: (state, action) => {
      state.rollConsumptionCount = action.payload;
    },
    setInkConsumptionList: (state, action) => {
      state.inkConsumptionList = action.payload;
    },
    setInkConsumptionCount: (state, action) => {
      state.inkConsumptionCount = action.payload;
    },
    setSelectedStockTransferData: (state, action) => {
      state.selectedStockTransferData = action.payload;
    },
    setIsStockTransfer: (state, action) => {
      state.isStockTransfer = action.payload;
    },
  },
});

export const {
  setStockRawLoading,
  setStockRawList,
  setStockRawBaseDataList,
  setExportInventoryStockPdfData,
  setExportInventoryExcelData,
  setStockSingleRowData,
  setRollConsumptionCount,
  setRollConsumptionList,
  setStockRawExportLoading,
  setInkConsumptionList,
  setInkConsumptionCount,
  setSelectedStockTransferData,
  setIsStockTransfer,
  setStockRawListingLoading,
} = StockRowMaterial.actions;

export default StockRowMaterial.reducer;
