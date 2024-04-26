import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  mfgLiveLoading: false,
  mfgLiveListLoading: false,
  mfgSuggestedRollLoading: false,
  mfgFilterListLoading: false,
  mfgLiveList: [],
  mfgLiveAllData: {},
  mfgLiveCount: [],
  mfgLiveTotalQty: 0,
  mfgLiveDetail: {},
  suggestedProductList: [],
  suggestedRollList: [],
  assignedRollList: [],
  allSuggestedRollList: [],
  bagMadeData: {},
  printTechnologyList: [],
  mfgLiveFilterList: [],
  mfgLivePrintingFilterList: [],
  mfgProcessPrintingById: [],
  selectProductForPrinting: {},
  printingData: {
    print_technology_id: '',
    process_id: '',
    product_id: '',
    completed: 0,
    partial: 1,
    pending_bag: 0,
    // machine_id: '',
    // roll_printed: [],
  },
  bagToBagData: {
    pending_bag: 0,
    print_technology_id: '',
    process_id: '',
    product_id: '',
    in_stock: '',
    qty_used: '',
    wastage: '',
    bag_printed: '',
    suggested_product_id: '',
    warehouse: '',
    completed: 0,
    partial: 1,
  },
  hotStampingData: {
    pending_bag: 0,
    print_technology_id: '',
    process_id: '',
    product_id: '',
    in_stock: '',
    qty_used: '',
    wastage: '',
    bag_printed: '',
    suggested_product_id: '',
    warehouse: '',
    completed: 0,
    partial: 1,
  },
  updatedPrintStatus: [],
};

const mfgLiveSlice = createSlice({
  name: 'mfglive',
  initialState,
  reducers: {
    setMfgLiveLoading: (state, action) => {
      state.mfgLiveLoading = action.payload;
    },
    setMfgLiveListLoading: (state, action) => {
      state.mfgLiveListLoading = action.payload;
    },
    setMfgSuggestedRollLoading: (state, action) => {
      state.mfgSuggestedRollLoading = action.payload;
    },
    setMfgFilterListLoading: (state, action) => {
      state.mfgFilterListLoading = action.payload;
    },
    setMfgLiveList: (state, action) => {
      state.mfgLiveList = action.payload;
    },
    setMfgLiveAllData: (state, action) => {
      state.mfgLiveAllData = action.payload;
    },
    setMfgLiveCount: (state, action) => {
      state.mfgLiveCount = action.payload;
    },
    setMfgLiveDetail: (state, action) => {
      state.mfgLiveDetail = action.payload;
    },
    setSuggestedProductList: (state, action) => {
      state.suggestedProductList = action.payload;
    },
    setSuggestedRollList: (state, action) => {
      state.suggestedRollList = action.payload;
    },
    setAssignedRollList: (state, action) => {
      state.assignedRollList = action.payload;
    },
    setAllSuggestedRollList: (state, action) => {
      state.allSuggestedRollList = action.payload;
    },
    setBagMadeData: (state, action) => {
      state.bagMadeData = action.payload;
    },
    setPrintTechnologyList: (state, action) => {
      state.printTechnologyList = action.payload;
    },
    setMfgLiveFilterList: (state, action) => {
      state.mfgLiveFilterList = action.payload;
    },
    setMfgLivePrintingFilterList: (state, action) => {
      state.mfgLivePrintingFilterList = action.payload;
    },
    setMfgProcessPrintingById: (state, action) => {
      state.mfgProcessPrintingById = action.payload;
    },
    setSelectProductForPrinting: (state, action) => {
      state.selectProductForPrinting = action.payload;
    },
    setprintingData: (state, action) => {
      state.printingData = action.payload;
    },
    setClearPrintingData: (state, action) => {
      state.printingData = initialState.printingData;
    },
    setUpdatedPrintStatus: (state, action) => {
      state.updatedPrintStatus = action.payload;
    },
    setBagToBagData: (state, action) => {
      state.bagToBagData = action.payload;
    },
    setHotStampingData: (state, action) => {
      state.hotStampingData = action.payload;
    },
    setMfgLiveTotalQty: (state, action) => {
      state.mfgLiveTotalQty = action.payload;
    },
  },
});

export const {
  setMfgLiveLoading,
  setMfgLiveListLoading,
  setMfgSuggestedRollLoading,
  setMfgFilterListLoading,
  setMfgLiveList,
  setMfgLiveAllData,
  setMfgLiveDetail,
  setMfgLiveCount,
  setSuggestedProductList,
  setSuggestedRollList,
  setAssignedRollList,
  setAllSuggestedRollList,
  setBagMadeData,
  setPrintTechnologyList,
  setMfgLiveFilterList,
  setMfgLivePrintingFilterList,
  setMfgProcessPrintingById,
  setSelectProductForPrinting,
  setprintingData,
  setClearPrintingData,
  setUpdatedPrintStatus,
  setBagToBagData,
  setHotStampingData,
  setMfgLiveTotalQty,
} = mfgLiveSlice.actions;

export default mfgLiveSlice.reducer;
