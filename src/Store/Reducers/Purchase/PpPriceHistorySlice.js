import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  ppPriceHistoryLoading: false,
  ppPriceHistoryListLoading: false,
  ppPriceHistoryList: [],
  ppPriceHistoryCount: 0,
  sortPriceHistoryField: null,
  sortPriceHistoryOrder: null,
};

const ppPriceHistorySlice = createSlice({
  name: 'ppPriceHistory',
  initialState,
  reducers: {
    setPpPriceHistoryLoading: (state, action) => {
      state.ppPriceHistoryLoading = action.payload;
    },
    setPpPriceHistoryListLoading: (state, action) => {
      state.ppPriceHistoryListLoading = action.payload;
    },
    setPpPriceHistoryList: (state, action) => {
      state.ppPriceHistoryList = action.payload;
    },
    setPpPriceHistoryCount: (state, action) => {
      state.ppPriceHistoryCount = action.payload;
    },
    setSortPriceHistoryField: (state, action) => {
      state.sortPriceHistoryField = action.payload;
    },
    setSortPriceHistoryOrder: (state, action) => {
      state.sortPriceHistoryOrder = action.payload;
    },
  },
});

export const {
  setPpPriceHistoryLoading,
  setPpPriceHistoryListLoading,
  setPpPriceHistoryList,
  setPpPriceHistoryCount,
  setSortPriceHistoryField,
  setSortPriceHistoryOrder,
} = ppPriceHistorySlice.actions;

export default ppPriceHistorySlice.reducer;
