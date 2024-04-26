import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  machineJobQueueLoading: false,
  machineJobQueueListLoading: false,
  bagMakingstatusLoading: false,
  machineQueueTypes: [],
  machineByMachineTypeList: [],
  mfgProcessByMachineList: {},
  activeTabIndex: 0,
  activeTabData: {},
};

const machineJobQueueSlice = createSlice({
  name: 'machineJobQueue',
  initialState,
  reducers: {
    setMachineJobQueueLoading: (state, action) => {
      state.machineJobQueueLoading = action.payload;
    },
    setMachineJobQueueListLoading: (state, action) => {
      state.machineJobQueueListLoading = action.payload;
    },
    setBagMakingstatusLoading: (state, action) => {
      state.bagMakingstatusLoading = action.payload;
    },
    setMachineQueueTypes: (state, action) => {
      state.machineQueueTypes = action.payload;
    },
    setMachineByMachineTypeList: (state, action) => {
      state.machineByMachineTypeList = action.payload;
    },
    setMfgProcessByMachineList: (state, action) => {
      state.mfgProcessByMachineList = action.payload;
    },
    setActiveTabIndex: (state, action) => {
      state.activeTabIndex = action.payload;
    },
    setActiveTabData: (state, action) => {
      state.activeTabData = action.payload;
    },
  },
});

export const {
  setMachineJobQueueLoading,
  setMachineJobQueueListLoading,
  setBagMakingstatusLoading,
  setMachineQueueTypes,
  setMachineByMachineTypeList,
  setMfgProcessByMachineList,
  setActiveTabIndex,
  setActiveTabData,
} = machineJobQueueSlice.actions;

export default machineJobQueueSlice.reducer;
