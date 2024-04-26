import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  adminDashboardLoading: false,
  rawMaterialChartData: [],
  productStockChartData: [],
  partyTypeChartData: [],
  laminationChartData: [],
  advisorReportData: {},
  pendingJobPrintTechnologyReportData: [],
  pendingJobBagTypeReportData: [],
  stateTurnoverReportData: [],
  advisorTurnoverReportData: {},
};

const AdminDashboardSlice = createSlice({
  name: 'adminDashBoard',
  initialState,
  reducers: {
    setAdminDashboardLoading: (state, action) => {
      state.adminDashboardLoading = action.payload;
    },
    setRawMaterialChartData: (state, action) => {
      state.rawMaterialChartData = action.payload;
    },
    setProductStockChartData: (state, action) => {
      state.productStockChartData = action.payload;
    },
    setPartyTypeChartData: (state, action) => {
      state.partyTypeChartData = action.payload;
    },
    setLaminationChartData: (state, action) => {
      state.laminationChartData = action.payload;
    },
    setAdvisorReportData: (state, action) => {
      state.advisorReportData = action.payload;
    },
    setPendingJobPrintTechnologyReportData: (state, action) => {
      state.pendingJobPrintTechnologyReportData = action.payload;
    },
    setPendingJobBagTypeReportData: (state, action) => {
      state.pendingJobBagTypeReportData = action.payload;
    },
    setStateTurnoverReportData: (state, action) => {
      state.stateTurnoverReportData = action.payload;
    },
    setAdvisorTurnoverReportData: (state, action) => {
      state.advisorTurnoverReportData = action.payload;
    },
  },
});

export const {
  setAdminDashboardLoading,
  setRawMaterialChartData,
  setProductStockChartData,
  setPartyTypeChartData,
  setLaminationChartData,
  setAdvisorReportData,
  setPendingJobPrintTechnologyReportData,
  setPendingJobBagTypeReportData,
  setStateTurnoverReportData,
  setAdvisorTurnoverReportData,
} = AdminDashboardSlice.actions;

export default AdminDashboardSlice.reducer;
