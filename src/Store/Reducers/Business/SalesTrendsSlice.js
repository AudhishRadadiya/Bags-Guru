import { createSlice } from '@reduxjs/toolkit';
import { pastYearGeneratedDate } from 'Helper/Common';

const { oneYearAgoDate, todayDate } = pastYearGeneratedDate();

let initialState = {
  customerSourceChartData: {},
  industrySalesChartData: {},
  stateWiseTurnoverChartData: {},
  pendingAndTotalSalesReportData: {},
  exhibitionTableReportData: {},
  exhibitionTableDate: {
    startDate: oneYearAgoDate,
    endDate: todayDate,
    key: 'selection',
  },
  averageTableReportData: {},
};

const SalesTrendsSlice = createSlice({
  name: 'salesTrends',
  initialState,
  reducers: {
    setCustomerSourceChartData: (state, action) => {
      state.customerSourceChartData = action.payload;
    },
    setIndustrySalesChartData: (state, action) => {
      state.industrySalesChartData = action.payload;
    },
    setStateWiseTurnoverChartData: (state, action) => {
      state.stateWiseTurnoverChartData = action.payload;
    },
    setPendingAndTotalSalesReportData: (state, action) => {
      state.pendingAndTotalSalesReportData = action.payload;
    },
    setExhibitionTableReportData: (state, action) => {
      state.exhibitionTableReportData = action.payload;
    },
    setExhibitionTableDate: (state, action) => {
      state.exhibitionTableDate = action.payload;
    },
    setAverageTableReportData: (state, action) => {
      state.averageTableReportData = action.payload;
    },
  },
});

export const {
  setCustomerSourceChartData,
  setIndustrySalesChartData,
  setStateWiseTurnoverChartData,
  setPendingAndTotalSalesReportData,
  setExhibitionTableReportData,
  setExhibitionTableDate,
  setAverageTableReportData,
} = SalesTrendsSlice.actions;

export default SalesTrendsSlice.reducer;
