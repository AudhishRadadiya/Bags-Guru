import { createSlice } from '@reduxjs/toolkit';

const todayDate = new Date();
let oneMonthAgoDate = new Date(todayDate);
oneMonthAgoDate.setMonth(todayDate.getMonth() - 1);

let initialState = {
  bagProdConsumpLoading: false,
  bagProdConsumpCRUDLoading: false,
  bagTypeChartDataOfBag: [],
  industryChartDataOfBag: [],
  printChartDataOfBag: [],
  laminationTypeChartDataOfBag: [],
  dates: {
    startDate: oneMonthAgoDate,
    endDate: todayDate,
    key: 'selection',
  },
  industryWiseDates: {
    startDate: oneMonthAgoDate,
    endDate: todayDate,
    key: 'selection',
  },
  laminationDates: {
    startDate: oneMonthAgoDate,
    endDate: todayDate,
    key: 'selection',
  },
  printDates: {
    startDate: oneMonthAgoDate,
    endDate: todayDate,
    key: 'selection',
  },
};

const BagAndProductConsumptionSlice = createSlice({
  name: 'bagProdConsump',
  initialState,
  reducers: {
    setDates: (state, action) => {
      state.dates = action.payload;
    },
    setIndustryWiseDates: (state, action) => {
      state.industryWiseDates = action.payload;
    },
    setLaminationDates: (state, action) => {
      state.laminationDates = action.payload;
    },
    setPrintDates: (state, action) => {
      state.printDates = action.payload;
    },

    setBagProdConsumpLoading: (state, action) => {
      state.bagProdConsumpLoading = action.payload;
    },
    setBagProdConsumpCRUDLoading: (state, action) => {
      state.bagProdConsumpCRUDLoading = action.payload;
    },
    setBagTypeChartDataOfBag: (state, action) => {
      state.bagTypeChartDataOfBag = action.payload;
    },
    setIndustryChartDataOfBag: (state, action) => {
      state.industryChartDataOfBag = action.payload;
    },
    setPrintTypeChartDataOfBag: (state, action) => {
      state.printChartDataOfBag = action.payload;
    },
    setLaminationTypeChartDataOfBag: (state, action) => {
      state.laminationTypeChartDataOfBag = action.payload;
    },
  },
});

export const {
  setBagProdConsumpLoading,
  setBagProdConsumpCRUDLoading,
  setBagTypeChartDataOfBag,
  setIndustryChartDataOfBag,
  setPrintTypeChartDataOfBag,
  setLaminationTypeChartDataOfBag,
  setDates,
  setIndustryWiseDates,
  setPrintDates,
  setLaminationDates,
} = BagAndProductConsumptionSlice.actions;

export default BagAndProductConsumptionSlice.reducer;
