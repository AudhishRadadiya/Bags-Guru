import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  mfgLiveOperatorLoading: false,
  mfgRollConsumptionLoading: false,
  liveOperatorMachineTypes: [],
  cylinderSizeList: [],
  listMFGProcess: [],
  countMFGfProcess: 0,
  suggestedRollList: [],
  viewMfgProcessList: [],
  viewPrintingMachineCountList: [],
  listOperator: [],
  viewMachineDetailForBagMaking: [],
};

const mfgLiveOperatorSlice = createSlice({
  name: 'mfgliveoperator',
  initialState,
  reducers: {
    setMfgLiveOperatorLoading: (state, action) => {
      state.mfgLiveOperatorLoading = action.payload;
    },
    setMfgRollConsumptionLoading: (state, action) => {
      state.mfgRollConsumptionLoading = action.payload;
    },
    setLiveOperatorMachineTypes: (state, action) => {
      state.liveOperatorMachineTypes = action.payload;
    },
    setCylinderSizeList: (state, action) => {
      state.cylinderSizeList = action.payload;
    },
    setListMFGProcess: (state, action) => {
      state.listMFGProcess = action.payload;
    },
    setCountMFGfProcess: (state, action) => {
      state.countMFGfProcess = action.payload;
    },
    setSuggestedRollList: (state, action) => {
      state.suggestedRollList = action.payload;
    },
    setViewMfgProcessList: (state, action) => {
      state.viewMfgProcessList = action.payload;
    },
    setListOperator: (state, action) => {
      state.listOperator = action.payload;
    },
    setViewPrintingMachineCountList: (state, action) => {
      state.viewPrintingMachineCountList = action.payload;
    },
    setViewMachineDetailForBagMaking: (state, action) => {
      state.viewMachineDetailForBagMaking = action.payload;
    },
  },
});

export const {
  setMfgLiveOperatorLoading,
  setMfgRollConsumptionLoading,
  setLiveOperatorMachineTypes,
  setCylinderSizeList,
  setListMFGProcess,
  setCountMFGfProcess,
  setSuggestedRollList,
  setViewMfgProcessList,
  setListOperator,
  setViewPrintingMachineCountList,
  setViewMachineDetailForBagMaking,
} = mfgLiveOperatorSlice.actions;

export default mfgLiveOperatorSlice.reducer;
