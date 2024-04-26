import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  trendingProductLoading: false,
  trendingProductCRUDLoading: false,
  trendingProductExportLoading: false,
  trendingProductList: [],
  trendingProductCount: 0,
};

const TrendingProductSlice = createSlice({
  name: 'trendingProduct',
  initialState,
  reducers: {
    setTrendingProductLoading: (state, action) => {
      state.trendingProductLoading = action.payload;
    },
    setTrendingProductCRUDLoading: (state, action) => {
      state.trendingProductCRUDLoading = action.payload;
    },
    setTrendingProductList: (state, action) => {
      state.trendingProductList = action.payload;
    },
    setTrendingProductCount: (state, action) => {
      state.trendingProductCount = action.payload;
    },
    setTrendingProductExportLoading: (state, action) => {
      state.trendingProductExportLoading = action.payload;
    },
  },
});

export const {
  setTrendingProductLoading,
  setTrendingProductCRUDLoading,
  setTrendingProductList,
  setTrendingProductCount,
  setTrendingProductExportLoading,
} = TrendingProductSlice.actions;

export default TrendingProductSlice.reducer;
