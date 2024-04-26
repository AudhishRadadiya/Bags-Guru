import { createSlice } from '@reduxjs/toolkit';

export let attributes = [
  {
    name: 'Qty',
    type: 2, ///Number
    isSelected: false,
    isDefault: true,
    is_mandatory: 0,
    values: [],
    no: 1,
  },
  {
    name: 'Color',
    type: 3, // Select
    isSelected: false,
    isDefault: true,
    is_mandatory: 0,
    values: [],
    no: 2,
  },
  {
    name: 'Brand Name',
    type: 1,
    isSelected: false,
    isDefault: true,
    is_mandatory: 0,
    values: [],
    no: 3,
  },
  {
    name: 'Design Name',
    type: 1, // TExt
    isSelected: false,
    isDefault: true,
    is_mandatory: 0,
    values: [],
    no: 4,
  },
  {
    name: 'Lamination',
    type: 3,
    isSelected: false,
    isDefault: true,
    is_mandatory: 0,
    values: [],
    no: 5,
  },
  {
    name: 'Width',
    type: 2,
    isSelected: false,
    isDefault: true,
    is_mandatory: 0,
    values: [],
    no: 6,
  },
  {
    name: 'Length',
    type: 2,
    isSelected: false,
    isDefault: true,
    is_mandatory: 0,
    values: [],
    no: 7,
  },
  // {
  //   name: 'Height',
  //   type: 2,
  //   isSelected: false,
  //   isDefault: true,
  //   is_mandatory: 0,
  //   values: [],
  //   no: 8,
  // },
  // {
  //   name: 'Circum',
  //   type: 2,
  //   isSelected: false,
  //   isDefault: true,
  //   is_mandatory: 0,
  //   values: [],
  //   no: 9,
  // },
  // {
  //   name: 'Gusset',
  //   type: 2,
  //   isSelected: false,
  //   isDefault: true,
  //   is_mandatory: 0,
  //   values: [],
  //   no: 10,
  // },
  // {
  //   name: 'Base Fabric GSM',
  //   type: 2,
  //   isSelected: false,
  //   isDefault: true,
  //   is_mandatory: 0,
  //   values: [],
  //   no: 11,
  // },
  {
    name: 'GSM',
    type: 2,
    isSelected: false,
    is_mandatory: 0,
    isDefault: true,
    values: [],
    no: 12,
  },
  // {
  //   name: 'Net Weight',
  //   type: 2,
  //   isSelected: false,
  //   is_mandatory: 0,
  //   isDefault: true,
  //   values: [],
  //   no: 13,
  // },
];

let initialState = {
  rawItemLoading: false,
  rawItemCRUDLoading: false,
  rawItemsList: [],
  rawItemsFullList: [],
  rawItemsCount: 0,
  listFilter: [],
  selectedRawItem: {
    name: '',
    code: '',
    group: '',
    primary_unit: '', //id
    secondary_unit: '', //id
    // attachment: '', //image_url
    GST_rate: null, //%
    comment: '',
    used_as_bag_handle: 0,
    has_multiple_variant: 1,
    is_active: 1,
    item_attribute: attributes,
  },
  selectedAttribute: {
    isSelected: false,
    is_mandatory: 0,
    is_multiple_selection: 0,
    name: '',
    type: 1,
    values: [],
  },
  activeRawItemList: [],
  activeRawItemListByGroup: [],
  rawItemListById: [],

  initialRawItemData: {
    name: '',
    code: '',
    group: '',
    primary_unit: '', //id
    secondary_unit: '', //id
    // attachment: '', //image_url
    GST_rate: null, //%
    comment: '',
    used_as_bag_handle: 0,
    has_multiple_variant: 1,
    is_active: 1,
    item_attribute: attributes,
  },

  isGetInitialValuesItem: {
    add: false,
    update: false,
    view: false,
  },
  addSelectedItemData: {
    has_multiple_variant: 1,
    is_active: 1,
    item_attribute: attributes,
  },
  updateSelectedItemData: {
    has_multiple_variant: 1,
    is_active: 1,
    item_attribute: attributes,
  },
  // viewSelectedItemData: {},
};

const userSlice = createSlice({
  name: 'rawitem',
  initialState,
  reducers: {
    setItemLoading: (state, action) => {
      state.rawItemLoading = action.payload;
    },
    setRawItemCRUDLoading: (state, action) => {
      state.rawItemCRUDLoading = action.payload;
    },
    setRawItemListFilter: (state, action) => {
      state.listFilter = action.payload;
    },
    setRawItemsCount: (state, action) => {
      state.rawItemsCount = action.payload;
    },
    setRawItemsList: (state, action) => {
      state.rawItemsList = action.payload;
    },
    setRawItemsFullList: (state, action) => {
      state.rawItemsFullList = action.payload;
    },
    setActiveRawItemList: (state, action) => {
      state.activeRawItemList = action.payload;
    },
    setActiveRawItemListByGroup: (state, action) => {
      state.activeRawItemListByGroup = action.payload;
    },
    setRawItemListById: (state, action) => {
      state.rawItemListById = action.payload;
    },
    setSelectedRawItem: (state, action) => {
      state.selectedRawItem = action.payload;
    },
    clearSelectedRawItem: state => {
      state.selectedRawItem = initialState.selectedRawItem;
    },
    clearSelectedAttribute: state => {
      state.selectedAttribute = initialState.selectedAttribute;
    },

    setIsGetInitialValuesItem: (state, action) => {
      state.isGetInitialValuesItem = action.payload;
    },
    setAddSelectedItemData: (state, action) => {
      state.addSelectedItemData = action.payload;
    },
    clearAddSelectedItemData: state => {
      state.addSelectedItemData = initialState.initialRawItemData;
    },
    setUpdateSelectedItemData: (state, action) => {
      state.updateSelectedItemData = action.payload;
    },
    clearUpdateSelectedItemData: state => {
      state.updateSelectedItemData = initialState.initialRawItemData;
    },
    // setViewSelectedItemData: (state, action) => {
    //   state.viewSelectedItemData = action.payload;
    // },
    // clearViewSelectedItemData: state => {
    //   state.viewSelectedItemData = initialState.initialRawItemData;
    // },
  },
});

export const {
  setItemLoading,
  setRawItemCRUDLoading,
  setRawItemListFilter,
  setRawItemsCount,
  setRawItemsList,
  setRawItemsFullList,
  setActiveRawItemList,
  setSelectedRawItem,
  setRawItemListById,
  setActiveRawItemListByGroup,
  clearSelectedRawItem,
  clearSelectedAttribute,
  setIsGetInitialValuesItem,
  setAddSelectedItemData,
  clearAddSelectedItemData,
  setUpdateSelectedItemData,
  clearUpdateSelectedItemData,
  // setViewSelectedItemData,
  // clearViewSelectedItemData,
} = userSlice.actions;

export default userSlice.reducer;
