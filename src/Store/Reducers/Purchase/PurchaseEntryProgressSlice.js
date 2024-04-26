import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  percentageUploadFile: 0,
  purchaseEntryList: [],
};

const PurchaseEntryProgressSlice = createSlice({
  name: 'PurchaseEntryProgress',
  initialState,
  reducers: {
    setPercentageUploadFile: (state, action) => {
      state.percentageUploadFile = action.payload;
    },
    setAddPurchaseEntryList: (state, action) => {
      let entryData = [...state.purchaseEntryList, action.payload];
      state.purchaseEntryList = entryData;
    },
    setPurchaseEntryList: (state, action) => {
      state.purchaseEntryList = action.payload;
    },
  },
});

export const {
  setPercentageUploadFile,
  setPurchaseEntryList,
  setAddPurchaseEntryList,
} = PurchaseEntryProgressSlice.actions;

export default PurchaseEntryProgressSlice.reducer;
