import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  customerDashboardGlobalFilters: {
    advisor: [],
    party: [],
    industry: [],
    customer_source: [],
  },
  customerDashboardLoading: false,
  customerDashboardListLoading: false,
  customerAveragesData: {},
  customerAnalyticsList: [],
  customerAnalyticsCount: 0,
  sortCustomerDashboardField: null,
  sortCustomerDashboardOrder: null,
  monthlySalesTrendsData: {},
};

const CustomerDashboardSlice = createSlice({
  name: 'customerDashboard',
  initialState,
  reducers: {
    setCustomerDashboardLoading: (state, action) => {
      state.customerDashboardLoading = action.payload;
    },
    setCustomerDashboardListLoading: (state, action) => {
      state.customerDashboardListLoading = action.payload;
    },
    setCustomerAveragesData: (state, action) => {
      state.customerAveragesData = action.payload;
    },
    setCustomerAnalyticsList: (state, action) => {
      state.customerAnalyticsList = action.payload;
    },
    setCustomerAnalyticsCount: (state, action) => {
      state.customerAnalyticsCount = action.payload;
    },
    setCustomerDashboardTableDate: (state, action) => {
      state.customerDashboardTableDate = action.payload;
    },
    setSortCustomerDashboardField: (state, action) => {
      state.sortCustomerDashboardField = action.payload;
    },
    setSortCustomerDashboardOrder: (state, action) => {
      state.sortCustomerDashboardOrder = action.payload;
    },
    setCustomerDashboardGlobalFilters: (state, action) => {
      state.customerDashboardGlobalFilters = action.payload;
    },
    setMonthlySalesTrendsData: (state, action) => {
      state.monthlySalesTrendsData = action.payload;
    },
  },
});

export const {
  setCustomerDashboardLoading,
  setCustomerDashboardListLoading,
  setCustomerAveragesData,
  setCustomerAnalyticsList,
  setCustomerAnalyticsCount,
  setCustomerDashboardTableDate,
  setSortCustomerDashboardOrder,
  setSortCustomerDashboardField,
  setMonthlySalesTrendsData,
  setCustomerDashboardGlobalFilters,
} = CustomerDashboardSlice.actions;

export default CustomerDashboardSlice.reducer;
