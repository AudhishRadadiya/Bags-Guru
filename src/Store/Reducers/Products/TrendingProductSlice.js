import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  trendingProductLoading: false,
  trendingProductCRUDLoading: false,
  trendingProductExportLoading: false,
  trendingProductList: [],
  trendingProductCount: 0,
  sortTrendingProductsField: '',
  sortTrendingProductsOrder: 1,
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
    setSortTrendingProductsField: (state, action) => {
      state.sortTrendingProductsField = action.payload;
    },
    setSortTrendingProductsOrder: (state, action) => {
      state.sortTrendingProductsOrder = action.payload;
    },
  },
});

export const {
  setTrendingProductLoading,
  setTrendingProductCRUDLoading,
  setTrendingProductList,
  setTrendingProductCount,
  setTrendingProductExportLoading,
  setSortTrendingProductsField,
  setSortTrendingProductsOrder,
} = TrendingProductSlice.actions;

export default TrendingProductSlice.reducer;
