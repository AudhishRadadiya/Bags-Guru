import { createSlice } from '@reduxjs/toolkit';
const initialSalesInvoice = {
  invoice_date: new Date(),
  warehouse: '',
  party_name: '',
  billing_address: '',
  shipping_address: '',
  transporter: '',
  transporter_phone_no: '',
  transporter_gst: '',
  booking_station: '',
  present_advisor: '',
  tripta_no: '',
  total_bundle: '',
  comment: '',
  terms_and_condition: '',
  attachment: '',
  attachment_name: '',
  freight: '',
  discount: '',
  total_amount: '',
  tax_amount: '',
  final_amount: '',
  streo_charge: '',
  selected_product: [],
  sales_item: [],
  sales_products_list: [],
  billing_addrees_list: [],
  shipping_addrees_list: [],
  total_available_qty: 0,
  total_available_weight: 0,
};

let initialState = {
  salesInvoiceLoading: false,
  salesInvoiceJobLoading: false,
  salesInvoiceList: [],
  salesInvoiceCount: 0,
  salesInvoiceDetail: {
    invoice_date: '',
    party_name: '',
    warehouse: '',
    billing_address: '',
    shipping_address: '',
    transporter: '',
    transporter_phone_no: '',
    transporter_gst: '',
    booking_station: '',
    present_advisor: '',
    tripta_no: '',
    total_bundle: 0,
    comment: '',
    terms_and_condition: '',
    attachment: '',
    freight: '',
    discount: '',
    total_amount: '',
    tax_amount: '',
    final_amount: '',
    streo_charge: '',
    gross_weight: '',
    total_pc: '',
    total_kg: '',
    total_charge: '',
    total_discount: '',
    sub_total_amount: '',
    sales_invoice_item: [],
  },
  isGetInitialValuesSalesInvoice: {
    add: false,
    update: false,
    view: false,
  },
  orderJobByPartyList: [],
  salesInvoiceData: initialSalesInvoice,
  addSelectedSalesInvoiceData: {
    party_name: '',
    invoice_date: new Date(),
    present_advisor: '',
    transporter: '',
    total_amount: '',
    tax_amount: '',
    final_amount: '',
    freight: '',
  },
  updateSelectedSalesInvoiceData: {},
  // viewSelectedSalesInvoiceData: {},
};

const SalesInvoiceSlice = createSlice({
  name: 'salesInvoice',
  initialState,
  reducers: {
    setSalesInvoiceLoading: (state, action) => {
      state.salesInvoiceLoading = action.payload;
    },
    setSalesInvoiceJobLoading: (state, action) => {
      state.salesInvoiceJobLoading = action.payload;
    },
    setIsGetInitialValuesSalesInvoice: (state, action) => {
      state.isGetInitialValuesSalesInvoice = action.payload;
    },
    setAddSelectedSalesInvoiceData: (state, action) => {
      state.addSelectedSalesInvoiceData = action.payload;
    },
    setUpdateSelectedSalesInvoiceData: (state, action) => {
      state.updateSelectedSalesInvoiceData = action.payload;
    },
    // setViewSelectedSalesInvoiceData: (state, action) => {
    //   state.viewSelectedSalesInvoiceData = action.payload;
    // },
    ClearUpdateSelectedSalesInvoiceData: state => {
      state.updateSelectedSalesInvoiceData = initialState.salesInvoiceData;
    },
    ClearAddSelectedSalesInvoiceData: state => {
      state.addSelectedSalesInvoiceData = initialState.salesInvoiceData;
    },
    // ClearViewSelectedSalesInvoiceData: state => {
    //   state.viewSelectedSalesInvoiceData = initialState.salesInvoiceData;
    // },
    setSalesInvoiceList: (state, action) => {
      state.salesInvoiceList = action.payload;
    },
    setSalesInvoiceCount: (state, action) => {
      state.salesInvoiceCount = action.payload;
    },
    setSalesInvoiceDetail: (state, action) => {
      state.salesInvoiceDetail = action.payload;
    },
    clearSalesInvoiceDetail: (state, action) => {
      state.salesInvoiceDetail = initialState.salesInvoiceDetail;
    },
    setOrderJobByPartyList: (state, action) => {
      state.orderJobByPartyList = action.payload;
    },
  },
});
export const {
  ClearUpdateSelectedSalesInvoiceData,
  ClearAddSelectedSalesInvoiceData,
  // ClearViewSelectedSalesInvoiceData,
  setAddSelectedSalesInvoiceData,
  setIsGetInitialValuesSalesInvoice,
  setUpdateSelectedSalesInvoiceData,
  // setViewSelectedSalesInvoiceData,
  setSalesInvoiceLoading,
  setSalesInvoiceJobLoading,
  setSalesInvoiceList,
  setSalesInvoiceCount,
  setSalesInvoiceDetail,
  clearSalesInvoiceDetail,
  setOrderJobByPartyList,
} = SalesInvoiceSlice.actions;

export default SalesInvoiceSlice.reducer;
