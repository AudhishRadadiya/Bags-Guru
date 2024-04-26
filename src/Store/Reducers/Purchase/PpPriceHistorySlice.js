import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  ppPriceHistoryLoading: false,
  ppPriceHistoryListLoading: false,
  ppPriceHistoryList: [],
  ppPriceHistoryCount: 0,
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
  },
});

export const {
  setPpPriceHistoryLoading,
  setPpPriceHistoryListLoading,
  setPpPriceHistoryList,
  setPpPriceHistoryCount,
} = ppPriceHistorySlice.actions;

export default ppPriceHistorySlice.reducer;
