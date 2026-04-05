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
  reviewComparisonDetail: [],
  advisorTeamReportData: {},
  advisorTeamComparisonReportData: {},
  advisorTeamAverageSalesReportData: {},
  OKRDashboardReportData: {},
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
    setReviewComparisonDetail: (state, action) => {
      state.reviewComparisonDetail = action.payload;
    },
    setAdvisorTeamReportData: (state, action) => {
      state.advisorTeamReportData = action.payload;
    },
    setAdvisorTeamComparisonReportData: (state, action) => {
      state.advisorTeamComparisonReportData = action.payload;
    },
    setAdvisorTeamAverageSalesReportData: (state, action) => {
      state.advisorTeamAverageSalesReportData = action.payload;
    },
    setOKRDashboardReportData: (state, action) => {
      state.OKRDashboardReportData = action.payload;
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
  setReviewComparisonDetail,
  setAdvisorTeamReportData,
  setAdvisorTeamComparisonReportData,
  setAdvisorTeamAverageSalesReportData,
  setOKRDashboardReportData,
} = SalesdashboardSlice.actions;

export default SalesdashboardSlice.reducer;
