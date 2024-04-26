import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  salesOrderLoading: false,
  salesOrderListLoading: false,
  salesOrderCRUDLoading: false,
  salesOrderJobCRUDLoading: false,
  salesOrderExportLoading: false,
  salesOrderList: [],
  salesOrderOnlyJobsList: [],
  salesOrderCount: 0,
  selectedAddSalesIvoiceData: {},
  selectedOrder: {
    party_name: '',
    order_date: '',
    due_date: '',
    transporter: '',
    booking_station: '',
    present_advisor: '',
    original_advisor: '',
    present_advisor_id: '',
    original_advisor_id: '',
    advance_amount: 0,
    comment: '',
    billing_address: [],
    shipping_address: [],
    address_list: [''],
    attachment: [],
    is_cc_attach: 0,
    dispatch_after_payment: 0,
    multiple_billing: 0,
    dispatch_on_invoice: 0,
  },
  orderData: {
    is_editable: true,
    party_name: '',
    gst: '',
    order_date: new Date(),
    due_date: '',
    transporter: '',
    booking_station: '',
    present_advisor: '',
    original_advisor: '',
    present_advisor_name: '',
    original_advisor_name: '',
    advance_amount: 0,
    comment: '',
    billing_address: [],
    shipping_address: [],
    address_list: [''],
    billing_addrees_list: [],
    shipping_addrees_list: [],
    attachment: [],
    is_cc_attach: 0,
    dispatch_after_payment: 0,
    multiple_billing: 0,
    dispatch_on_invoice: 0,
  },
  jobInitialValues: {
    due_date: new Date(),
    product_id: '',
    salesOrder_id: '',
    old_stereo: 1,
    unit_pc: 1,
    qty: '',
    rate: '',
    amount: 0,
    broker_rate: 0,
    // broker_total: 0,
    text_to_print: '',
    comment: '',
    transporter_detail: [],
    notification_to_print: 0,
    freight_inclusive_rate: 0,
    discount: 0,
    stereo_charge: 0,
    additional_charge: 0,
    gst_amount: 0,
    gst_percentage: 0,
    final_amount: 0,
    qty_kg: '',
    rate_kg: '',
    amount_kg: 0,
    pcs_taxable_amount: 0,
    kgs_taxable_amount: 0,
    broker_rate_kg: 0,
    // broker_total_kg: 0,
    // selected_product: {},
    selected_product_detail: {},
  },
  uploadImage: [],
  salesJobOrderDetail: {
    product_id: '',
    salesOrder_id: '',
    unit_pc: 0,
    old_stereo: 0,
    qty: 0,
    rate: 0,
    amount: 0,
    broker_rate: 0,
    broker_total: 0,
    text_to_print: 0,
    comment: '',
    notification_to_print: 0,
    freight_inclusive_rate: 0,
    discount: 0,
    stereo_charge: 0,
    additional_charge: 0,
    gst_percentage: 0,
    gst_amount: 0,
    final_amount: 0,
  },
  productSizeList: [],
  productFromBagSizeList: [],
  salesOrderJobsCount: 0,
  previousTransporter: '',
  addSelectedOrderData: {
    order_date: new Date(),
    is_cc_attach: 0,
    dispatch_after_payment: 0,
    multiple_billing: 0,
    dispatch_on_invoice: 0,
    advance_amount: 0,
    is_editable: true,
  },
  updateSelectedOrderData: {
    is_editable: true,
  },
  isGetInitialValuesOrder: {
    add: false,
    update: false,
  },
  addSelectedJobData: {
    due_date: new Date(),
    old_stereo: 1,
    unit_pc: 1,
    final_amount: 0,
    amount: 0,
    amount_kg: 0,
    pcs_taxable_amount: 0,
    kgs_taxable_amount: 0,
    stereo_charge: 0,
    discount: 0,
    additional_charge: 0,
  }, // Add Job:
  updateSelectedJobData: {
    pcs_taxable_amount: 0,
    kgs_taxable_amount: 0,
    stereo_charge: 0,
    discount: 0,
    additional_charge: 0,
  }, // Update Job:
  viewSelectedJobData: {
    pcs_taxable_amount: 0,
    kgs_taxable_amount: 0,
    stereo_charge: 0,
    discount: 0,
    additional_charge: 0,
  }, // View Job:
  // TODO:
  isGetInitialValuesJob: {
    add: false,
    update: false,
    view: false,
  },
};

const SalesOrderSlice = createSlice({
  name: 'salesOrder',
  initialState,
  reducers: {
    setSalesOrderLoading: (state, action) => {
      state.salesOrderLoading = action.payload;
    },
    setSalesOrderListLoading: (state, action) => {
      state.salesOrderListLoading = action.payload;
    },
    setSalesOrderCRUDLoading: (state, action) => {
      state.salesOrderCRUDLoading = action.payload;
    },
    setSalesOrderExportLoading: (state, action) => {
      state.salesOrderExportLoading = action.payload;
    },
    setSalesOrderList: (state, action) => {
      state.salesOrderList = action.payload;
    },
    setSalesOrderOnlyJobsList: (state, action) => {
      state.salesOrderOnlyJobsList = action.payload;
    },
    setSalesOrderCount: (state, action) => {
      state.salesOrderCount = action.payload;
    },
    setSalesOrderJobsCount: (state, action) => {
      state.salesOrderJobsCount = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setSelectedAddSalesIvoiceData: (state, action) => {
      state.selectedAddSalesIvoiceData = action.payload;
    },
    clearSelectedSalesOrder: state => {
      state.selectedOrder = initialState.selectedOrder;
    },
    setSalesJobOrderDetail: (state, action) => {
      state.salesJobOrderDetail = action.payload;
    },
    setSalesOrderJobCRUDLoading: (state, action) => {
      state.salesOrderJobCRUDLoading = action.payload;
    },
    setProductSizeList: (state, action) => {
      state.productSizeList = action.payload;
    },
    setProductFromBagSizeList: (state, action) => {
      state.productFromBagSizeList = action.payload;
    },
    setPreviousTransporter: (state, action) => {
      state.previousTransporter = action.payload;
    },
    setUploadImage: (state, action) => {
      state.uploadImage = action.payload;
    },
    setAddSelectedOrderData: (state, action) => {
      state.addSelectedOrderData = action.payload;
    },
    setIsGetInitialValuesOrder: (state, action) => {
      state.isGetInitialValuesOrder = action.payload;
    },
    clearAddSelectedOrderData: state => {
      state.addSelectedOrderData = initialState.orderData;
    },
    setUpdateSelectedOrderData: (state, action) => {
      state.updateSelectedOrderData = action.payload;
    },
    clearUpdateSelectedOrderData: state => {
      state.updateSelectedOrderData = initialState.orderData;
    },
    setIsGetInitialValuesJob: (state, action) => {
      state.isGetInitialValuesJob = action.payload;
    },
    setAddSelectedJobData: (state, action) => {
      state.addSelectedJobData = action.payload;
    },
    clearAddSelectedJobData: state => {
      state.addSelectedJobData = initialState.jobInitialValues;
    },
    setUpdateSelectedJobData: (state, action) => {
      state.updateSelectedJobData = action.payload;
    },
    clearUpdateSelectedJobData: state => {
      state.updateSelectedJobData = initialState.jobInitialValues;
    },
    setViewSelectedJobData: (state, action) => {
      state.viewSelectedJobData = action.payload;
    },
    clearViewSelectedJobData: state => {
      state.viewSelectedJobData = initialState.jobInitialValues;
    },
  },
});

export const {
  setSalesOrderLoading,
  setSalesOrderListLoading,
  setSalesOrderCRUDLoading,
  setSalesOrderExportLoading,
  setSalesOrderList,
  setSalesOrderOnlyJobsList,
  setSalesOrderJobsCount,
  setSalesOrderCount,
  setSelectedOrder,
  setSelectedAddSalesIvoiceData,
  clearSelectedSalesOrder,
  setSalesJobOrderDetail,
  setSalesOrderJobCRUDLoading,
  setProductSizeList,
  setProductFromBagSizeList,
  setPreviousTransporter,
  setUploadImage,
  setAddSelectedOrderData,
  setIsGetInitialValuesOrder,
  clearAddSelectedOrderData,
  setUpdateSelectedOrderData,
  clearUpdateSelectedOrderData,
  setIsGetInitialValuesJob,
  setAddSelectedJobData,
  clearAddSelectedJobData,
  setUpdateSelectedJobData,
  clearUpdateSelectedJobData,
  setViewSelectedJobData,
  clearViewSelectedJobData,
} = SalesOrderSlice.actions;

export default SalesOrderSlice.reducer;
