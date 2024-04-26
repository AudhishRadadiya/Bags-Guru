import { createSlice } from '@reduxjs/toolkit';

const initialProformaInvoice = {
  invoice_date: new Date(),
  party_name: '',
  billing_address: '',
  shipping_address: '',
  transporter: '',
  transporter_phone_no: '',
  transporter_gst: '',
  booking_station: '',
  present_advisor: '',
  present_advisor_name: '',
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
  proforma_invoice_item: [],
  selected_product: [],
  proforma_item: [],
  billing_addrees_list: [],
  shipping_addrees_list: [],
};

let initialState = {
  proformaLoading: false,
  proformaListLoading: false,
  proformaInvoiceList: [],
  proformaInvoiceCount: 0,
  proformaInvoiceDetail: {
    invoice_date: '',
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
    freight: '',
    discount: '',
    total_amount: '',
    tax_amount: '',
    final_amount: '',
    streo_charge: '',
    proforma_invoice_item: [],
  },
  isPrint: false,
  isGetInitialValuesProformaInvoice: {
    add: false,
    update: false,
    view: false,
  },
  proformaInvoiceData: initialProformaInvoice,
  addSelectedProformaInvoiceData: {
    party_name: '',
    invoice_date: new Date(),
    present_advisor: '',
    transporter: '',
    total_amount: '',
    tax_amount: '',
    final_amount: '',
  },
  updateSelectedProformaInvoiceData: {},
  // viewSelectedProformaInvoiceData: {},
};

const ProformaInvoiceSlice = createSlice({
  name: 'proformaInvoice',
  initialState,
  reducers: {
    setIsGetInitialValuesProformaInvoice: (state, action) => {
      state.isGetInitialValuesProformaInvoice = action.payload;
    },
    setAddSelectedProformaInvoiceData: (state, action) => {
      state.addSelectedProformaInvoiceData = action.payload;
    },
    setUpdateSelectedProformaInvoiceData: (state, action) => {
      state.updateSelectedProformaInvoiceData = action.payload;
    },
    // setViewSelectedProformaInvoiceData: (state, action) => {
    //   state.viewSelectedProformaInvoiceData = action.payload;
    // },
    clearUpdateProformaInvoiceData: state => {
      state.updateSelectedProformaInvoiceData =
        initialState.proformaInvoiceData;
    },
    clearAddProformaInvoiceData: state => {
      state.addSelectedProformaInvoiceData = initialState.proformaInvoiceData;
    },
    // clearViewProformaInvoiceData: state => {
    //   state.viewSelectedProformaInvoiceData = initialState.proformaInvoiceData;
    // },

    setProformaLoading: (state, action) => {
      state.proformaLoading = action.payload;
    },
    setProformaListLoading: (state, action) => {
      state.proformaListLoading = action.payload;
    },
    setProformaInvoiceList: (state, action) => {
      state.proformaInvoiceList = action.payload;
    },
    setProformaInvoiceCount: (state, action) => {
      state.proformaInvoiceCount = action.payload;
    },
    setProformaInvoiceDetail: (state, action) => {
      state.proformaInvoiceDetail = action.payload;
    },
    clearProformaInvoiceDetail: (state, action) => {
      state.proformaInvoiceDetail = initialState.proformaInvoiceDetail;
    },
    setIsPrint: (state, action) => {
      state.isPrint = action.payload;
    },
    setAddProformaPage: (state, action) => {
      state.addProformaPage = action.payload;
    },
    setUpdateProformaPage: (state, action) => {
      state.updateProformaPage = action.payload;
    },
    setProformaDetailsPage: (state, action) => {
      state.proformaDetailsPage = action.payload;
    },
  },
});
export const {
  clearUpdateProformaInvoiceData,
  clearAddProformaInvoiceData,
  setAddSelectedProformaInvoiceData,
  setIsGetInitialValuesProformaInvoice,
  setUpdateSelectedProformaInvoiceData,
  // setViewSelectedProformaInvoiceData,
  setProformaLoading,
  setProformaListLoading,
  setProformaInvoiceList,
  setProformaInvoiceCount,
  setProformaInvoiceDetail,
  setIsPrint,
  clearProformaInvoiceDetail,
  setAddProformaPage,
  setUpdateProformaPage,
  setProformaDetailsPage,
} = ProformaInvoiceSlice.actions;

export default ProformaInvoiceSlice.reducer;
