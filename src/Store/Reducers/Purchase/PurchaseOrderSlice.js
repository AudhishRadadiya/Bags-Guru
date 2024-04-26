import { createSlice } from '@reduxjs/toolkit';

const intialPurchaseOrderData = {
  supplier: '',
  purchase_date: new Date(),
  due_date: new Date(),
  supplier_quote_no: '',
  warehouse: '',
  bill_to: '',
  bill_to_location: '',
  bill_to_address: '',
  ship_to: '',
  ship_to_location: '',
  ship_to_address: '',
  item_group: '',
  item: '',
  comment: '',
  machine: '',
  term_condition: '',
  sub_total: 0,
  discount: 0,
  additional_amount: 0,
  before_tax: 0,
  tax: 0,
  total: 0,
  purchase_file: '',
  item_name: '',

  // initial state
  company_address: [],
  billing_list: [],
  shipping_list: [],
  company_name: '',
  selected_item: '',

  itemData: [],
  gsmTable_viewList: [],
  prePrintedTable_viewList: [],
  prePrintedTable_headerList: {},
  selected_itemList: [],

  color_gsmList: [],
  dummyColor_gsmList: [],
  new_item_data: {},
  dummy_newItem_data: {},
  search_product: '',
  selected_job_list: [],
  filter_toggle: false,
  is_validate: false,
  job_for_POList: [],
  rawItem_optionList: [],
};

const intialReceivePurchaseOrderData = {
  item_name: '',
  itemName_options: [],
  receive_order_data: {},
  supplier_name: '',
  suplierName_options: [],
  company_details: {
    companyData: {},
    bill_to: {},
    ship_to: {},
  },
  billing: '',
  billing_options: [],
  shipping: '',
  shipping_options: [],
  item_group: '',
  itemGroup_options: [],
  warehouse_name: '',
  columns_name: [],
  item_columns_name: [],
  purchase_item_name: '',
  item_group_name: '',
  receive_purchase_data: [],
  receive_items_data: [],
  selected_receive_item: [],
  receive_date: new Date(),
  // receive_purchase_viewData : []
};

let initialState = {
  purchaseOrderLoading: false,
  purchaseOrderListLoading: false,
  editPurchaseOrderLoading: false,
  purchaseOrderList: [],
  purchaseOrderCount: 0,
  POTotalAmount: 0,
  supplierList: [],
  purchaseOrderDetail: {
    supplier: '',
    purchase_date: new Date(),
    due_date: new Date(),
    supplier_quote_no: '',
    warehouse: '',
    bill_to: '',
    bill_to_location: '',
    bill_to_address: '',
    ship_to: '',
    ship_to_location: '',
    ship_to_address: '',
    item_group: '',
    item: '',
    comment: '',
    machine: '',
    term_condition: '',
    sub_total: 0,
    discount: 0,
    additional_amount: 0,
    before_tax: 0,
    tax: 0,
    total: 0,
    purchase_file: '',
    item_name: '',
  },
  purchaseOrderData: {},
  purchaseItemIdList: {},
  purchaseOrderReceivedList: [],
  purchaseOrderReceivedEntryList: [],
  purchaseOrderReceivedEntryCount: 0,
  rollRequirementLoading: false,
  rollRequirementListLoading: false,
  rollRequirementList: [],
  rollStockWithoutOrderList: {},
  rollRequirementCount: 0,
  importtedPurchaseReceive: [],
  importtedPurchaseReceiveExcelData: [],
  importedPurchaseReceiveData: [],
  jobForPOList: [],
  receivePurchaseData: [],
  receivePurchaseViewData: [],
  receiveItemsData: [],
  viewPurchaseOrderList: {},
  purchaseOrderListByItemGroup: [],
  purchaseOrderImportData: {
    purchaseOrderImportExcel: '',
    importItemGroupName: '',
    importPurchaseOrderList: [],
  },

  isGetInitialValuesPurchaseOrder: {
    add: false,
    view: false,
    update: false,
  },
  addSelectedPurchaseOrderData: {
    // initial state
    company_address: [],
    billing_list: [],
    shipping_list: [],
    company_name: '',
    selected_item: '',

    item_data: [],
    gsmTable_viewList: [],
    prePrintedTable_viewList: [],
    prePrintedTable_headerList: {},
    selected_itemList: [],

    color_gsmList: [],
    dummyColor_gsmList: [],
    new_item_data: {},
    dummy_newItem_data: {},
    search_product: '',
    selected_job_list: [],
    filter_toggle: false,
    is_validate: false,
    job_for_POList: [],
    rawItem_optionList: [],
  },
  updateSelectedPurchaseOrderData: {
    // new_item_data: {},
    // dummy_newItem_data: {},
    filter_toggle: false,
    is_validate: false,
  },
  // viewSelectedPurchaseOrderData: {},
  initialPurchaseOrder: intialPurchaseOrderData,

  setIsGetInitialValuesReceivePurchaseOrder: {
    add: false,
    update: false,
    view: false,
  },
  addSelectedReceivePurchaseOrderData: {},
  // viewSelectedReceivePurchaseOrderData: {},
  intialReceivePurchaseOrder: intialReceivePurchaseOrderData,
};

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {
    setPurchaseOrderLoading: (state, action) => {
      state.purchaseOrderLoading = action.payload;
    },
    setPurchaseOrderListLoading: (state, action) => {
      state.purchaseOrderListLoading = action.payload;
    },
    setEditPurchaseOrderLoading: (state, action) => {
      state.editPurchaseOrderLoading = action.payload;
    },
    setPurchaseOrderList: (state, action) => {
      state.purchaseOrderList = action.payload;
    },
    setPurchaseOrderCount: (state, action) => {
      state.purchaseOrderCount = action.payload;
    },
    setPOTotalAmount: (state, action) => {
      state.POTotalAmount = action.payload;
    },
    setSupplierList: (state, action) => {
      state.supplierList = action.payload;
    },
    setPurchaseOrderData: (state, action) => {
      state.purchaseOrderData = action.payload;
    },
    setPurchaseOrderDetail: (state, action) => {
      state.purchaseOrderDetail = action.payload;
    },
    clearPurchaseOrderDetail: (state, action) => {
      state.purchaseOrderDetail = initialState.purchaseOrderDetail;
    },
    setPurchaseItemIdList: (state, action) => {
      state.purchaseItemIdList = action.payload;
    },
    setPurchaseOrderReceivedList: (state, action) => {
      state.purchaseOrderReceivedList = action.payload;
    },
    setPurchaseOrderReceivedEntryList: (state, action) => {
      state.purchaseOrderReceivedEntryList = action.payload;
    },
    setPurchaseOrderReceivedEntryCount: (state, action) => {
      state.purchaseOrderReceivedEntryCount = action.payload;
    },
    setRollRequirementList: (state, action) => {
      state.rollRequirementList = action.payload;
    },
    setRollStockWithoutOrderList: (state, action) => {
      state.rollStockWithoutOrderList = action.payload;
    },
    setRollRequirementCount: (state, action) => {
      state.rollRequirementCount = action.payload;
    },
    setRollRequirementLoading: (state, action) => {
      state.rollRequirementLoading = action.payload;
    },
    setRollRequirementListLoading: (state, action) => {
      state.rollRequirementListLoading = action.payload;
    },
    setImporttedPurchaseReceive: (state, action) => {
      state.importtedPurchaseReceive = action.payload;
    },
    setImporttedPurchaseReceiveExcelData: (state, action) => {
      state.importtedPurchaseReceiveExcelData = action.payload;
    },
    setImportedPurchaseReceiveData: (state, action) => {
      state.importedPurchaseReceiveData = action.payload;
    },
    setJobForPOList: (state, action) => {
      state.jobForPOList = action.payload;
    },
    setReceivePurchaseData: (state, action) => {
      state.receivePurchaseData = action.payload;
    },
    setReceivePurchaseViewData: (state, action) => {
      state.receivePurchaseViewData = action.payload;
    },
    setReceiveItemsData: (state, action) => {
      state.receiveItemsData = action.payload;
    },
    setViewPurchaseOrderList: (state, action) => {
      state.viewPurchaseOrderList = action.payload;
    },
    setPurchaseOrderListByItemGroup: (state, action) => {
      state.purchaseOrderListByItemGroup = action.payload;
    },
    setPurchaseOrderImportData: (state, action) => {
      state.purchaseOrderImportData = action.payload;
    },

    setIsGetInitialValuesReceivePurchaseOrder: (state, action) => {
      state.isGetInitialValuesReceivePurchaseOrder = action.payload;
    },
    setAddSelectedReceivePurchaseOrderData: (state, action) => {
      state.addSelectedReceivePurchaseOrderData = action.payload;
    },
    clearAddSelectedReceivePurchaseOrderData: state => {
      state.addSelectedReceivePurchaseOrderData =
        initialState.intialReceivePurchaseOrder;
    },
    // setViewSelectedReceivePurchaseOrderData: (state, action) => {
    //   state.viewSelectedReceivePurchaseOrderData = action.payload;
    // },
    // clearViewSelectedReceivePurchaseOrderData: state => {
    //   state.viewSelectedReceivePurchaseOrderData =
    //     initialState.intialReceivePurchaseOrder;
    // },

    setIsGetInitialValuesPurchaseOrder: (state, action) => {
      state.isGetInitialValuesPurchaseOrder = action.payload;
    },
    setAddSelectedPurchaseOrderData: (state, action) => {
      state.addSelectedPurchaseOrderData = action.payload;
    },
    clearAddSelectedPurchaseOrderData: state => {
      state.addSelectedPurchaseOrderData = initialState.initialPurchaseOrder;
    },
    setUpdateSelectedPurchaseOrderData: (state, action) => {
      state.updateSelectedPurchaseOrderData = action.payload;
    },
    clearUpdateSelectedPurchaseOrderData: state => {
      state.updateSelectedPurchaseOrderData = initialState.initialPurchaseOrder;
    },
    // setViewSelectedPurchaseOrderData: (state, action) => {
    //   state.viewSelectedPurchaseOrderData = action.payload;
    // },
    // clearViewSelectedPurchaseOrderData: state => {
    //   state.viewSelectedPurchaseOrderData = initialState.initialPurchaseOrder;
    // },
  },
});

export const {
  setPurchaseOrderLoading,
  setPurchaseOrderListLoading,
  setEditPurchaseOrderLoading,
  setPurchaseOrderList,
  setPurchaseOrderCount,
  setPOTotalAmount,
  setSupplierList,
  setPurchaseOrderDetail,
  setPurchaseOrderData,
  clearPurchaseOrderDetail,
  setPurchaseItemIdList,
  setPurchaseOrderReceivedList,
  setPurchaseOrderReceivedEntryList,
  setPurchaseOrderReceivedEntryCount,
  setRollRequirementCount,
  setRollRequirementList,
  setRollStockWithoutOrderList,
  setRollRequirementLoading,
  setRollRequirementListLoading,
  setImporttedPurchaseReceive,
  setImporttedPurchaseReceiveExcelData,
  setImportedPurchaseReceiveData,
  setJobForPOList,
  setReceivePurchaseData,
  setReceivePurchaseViewData,
  setReceiveItemsData,
  setViewPurchaseOrderList,
  setPurchaseOrderListByItemGroup,
  setPurchaseOrderImportData,

  setIsGetInitialValuesPurchaseOrder,
  setAddSelectedPurchaseOrderData,
  clearAddSelectedPurchaseOrderData,
  setUpdateSelectedPurchaseOrderData,
  clearUpdateSelectedPurchaseOrderData,
  setViewSelectedPurchaseOrderData,
  // clearViewSelectedPurchaseOrderData,

  setIsGetInitialValuesReceivePurchaseOrder,
  setAddSelectedReceivePurchaseOrderData,
  clearAddSelectedReceivePurchaseOrderData,
  // setViewSelectedReceivePurchaseOrderData,
  // clearViewSelectedReceivePurchaseOrderData,
} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;
