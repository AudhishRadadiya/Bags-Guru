import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  triptaAmountLoading: false,
  triptsUploadLoading: false,
  triptaAttachmentFile: {},
  triptaAttachmentFileName: '',
  triptaAmountList: [],
  triptaAmountListCommonData: {
    count: 0,
    last_updated_date: '',
    total_tripta_0_to_15_amount: '₹0',
    total_tripta_16_to_30_amount: '₹0',
    total_tripta_31_to_45_amount: '₹0',
    total_tripta_46_to_90_amount: '₹0',
    total_tripta_above_90_amount: '₹0',
    total_tripta_total_due: '₹0',
  },
  sortCollectionField: null,
  sortCollectionOrder: null,
};

const triptaAmountSlice = createSlice({
  name: 'triptaAmount',
  initialState,
  reducers: {
    setTriptaAmountLoading: (state, action) => {
      state.triptaAmountLoading = action.payload;
    },
    setTriptsUploadLoading: (state, action) => {
      state.triptsUploadLoading = action.payload;
    },
    setTriptaAttachmentFile: (state, action) => {
      state.triptaAttachmentFile = action.payload;
    },
    setTriptaAttachmentFileName: (state, action) => {
      state.triptaAttachmentFileName = action.payload;
    },
    setTriptaAmountList: (state, action) => {
      state.triptaAmountList = action.payload;
    },
    setTriptaAmountListCommonData: (state, action) => {
      state.triptaAmountListCommonData = action.payload;
    },
    setSortCollectionField: (state, action) => {
      state.sortCollectionField = action.payload;
    },
    setSortCollectionOrder: (state, action) => {
      state.sortCollectionOrder = action.payload;
    },
  },
});

export const {
  setSortCollectionField,
  setSortCollectionOrder,
  setTriptaAmountLoading,
  setTriptsUploadLoading,
  setTriptaAttachmentFile,
  setTriptaAttachmentFileName,
  setTriptaAmountList,
  setTriptaAmountListCommonData,
} = triptaAmountSlice.actions;

export default triptaAmountSlice.reducer;
