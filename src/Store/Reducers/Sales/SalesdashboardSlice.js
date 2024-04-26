import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  salesTableData: {},
  laminationReportData: [],
  customerSourceReportData: [],
  customerSourceDetailData: [],
  industryReportData: [],
  partyTypeReportData: [],
  advisorReportData: {},
  newAndRepeatOrderReportData: {},
};

const SalesdashboardSlice = createSlice({
  name: 'salesDashBoard',
  initialState,
  reducers: {
    setSalesTableData: (state, action) => {
      state.salesTableData = action.payload;
    },
    setLaminationReportData: (state, action) => {
      state.laminationReportData = action.payload;
    },
    setCustomerSourceReportData: (state, action) => {
      state.customerSourceReportData = action.payload;
    },
    setCustomerSourceDetailData: (state, action) => {
      state.customerSourceDetailData = action.payload;
    },
    setIndustryReportData: (state, action) => {
      state.industryReportData = action.payload;
    },
    setPartyTypeReportData: (state, action) => {
      state.partyTypeReportData = action.payload;
    },
    setAdvisorReportData: (state, action) => {
      state.advisorReportData = action.payload;
    },
    setNewAndRepeatOrderReportData: (state, action) => {
      state.newAndRepeatOrderReportData = action.payload;
    },
  },
});
export const {
  setSalesTableData,
  setLaminationReportData,
  setCustomerSourceReportData,
  setCustomerSourceDetailData,
  setIndustryReportData,
  setPartyTypeReportData,
  setAdvisorReportData,
  setNewAndRepeatOrderReportData,
} = SalesdashboardSlice.actions;

export default SalesdashboardSlice.reducer;
