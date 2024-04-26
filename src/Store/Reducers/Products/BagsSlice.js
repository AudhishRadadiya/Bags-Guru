import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  bagLoading: false,
  bagCRUDLoading: false,
  bagExportLoading: false,
  bagList: [],
  selectedBagForAdd: {},
  selectedBagForView: {},
  selectedBagForEdit: {},
  bagDetailForEdit: {},
  selectedBagForDuplicate: {},
  bagDetailForDuplicate: {},
  bagCount: 0,
  bagTagList: [],
  fullbagTagList: [],
  allBagTagList: [],
  isGetInitialValuesForEditBag: false,
  isGetInitialValuesForDuplicateBag: false,
  isGetInitialValuesForAddBag: false,
};

const BagSlice = createSlice({
  name: 'bag',
  initialState,
  reducers: {
    setBagLoading: (state, action) => {
      state.bagLoading = action.payload;
    },
    setBagCRUDLoading: (state, action) => {
      state.bagCRUDLoading = action.payload;
    },
    setBagExportLoading: (state, action) => {
      state.bagExportLoading = action.payload;
    },
    setBagList: (state, action) => {
      state.bagList = action.payload;
    },
    setbagTagList: (state, action) => {
      state.bagTagList = action.payload;
    },
    setFullbagTagList: (state, action) => {
      state.fullbagTagList = action.payload;
    },
    setSelectedBagForAdd: (state, action) => {
      state.selectedBagForAdd = action.payload;
    },
    setSelectedBagForEdit: (state, action) => {
      state.selectedBagForEdit = action.payload;
    },
    setBagDetailForEdit: (state, action) => {
      state.bagDetailForEdit = action.payload;
    },
    setSelectedBagForDuplicate: (state, action) => {
      state.selectedBagForDuplicate = action.payload;
    },
    setBagDetailForDuplicate: (state, action) => {
      state.bagDetailForDuplicate = action.payload;
    },
    setSelectedBagForView: (state, action) => {
      state.selectedBagForView = action.payload;
    },
    setBagCount: (state, action) => {
      state.bagCount = action.payload;
    },
    setAllBagTagList: (state, action) => {
      state.allBagTagList = action.payload;
    },
    setIsGetInitialValuesForEditBag: (state, action) => {
      state.isGetInitialValuesForEditBag = action.payload;
    },
    setIsGetInitialValuesForDuplicateBag: (state, action) => {
      state.isGetInitialValuesForDuplicateBag = action.payload;
    },
    setIsGetInitialValuesForAddBag: (state, action) => {
      state.isGetInitialValuesForAddBag = action.payload;
    },
  },
});

export const {
  setBagLoading,
  setBagCRUDLoading,
  setBagList,
  setBagExportLoading,
  setBagDetailForEdit,
  setSelectedBagForAdd,
  setSelectedBagForEdit,
  setSelectedBagForDuplicate,
  setBagDetailForDuplicate,
  setBagCount,
  setbagTagList,
  setFullbagTagList,
  setAllBagTagList,
  setIsGetInitialValuesForEditBag,
  setIsGetInitialValuesForDuplicateBag,
  setIsGetInitialValuesForAddBag,
  setSelectedBagForView,
} = BagSlice.actions;

export default BagSlice.reducer;
