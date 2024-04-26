import { createSlice } from '@reduxjs/toolkit';

const addPartiesData = {
  party_type: '',
  party_name: '',
  person_name: '',
  personal_email: '',
  personal_contact_no: '',
  website: '',
  city: '',
  state: '',
  country: '',
  country_option: [],
  state_option: [],
  city_option: [],
  is_mobile_app_registered: false,
  bag_rate_list: 1,
  register_mobile_number: [],
  register_email: [],
  register_phone_index: [' '],
  register_email_index: [' '],
  pan_no: '',
  gst: '',
  original_advisor: '',
  present_advisor: '',
  market: '',
  industry: '',
  customer_source: '',
  customer_source_detail: '',
  customer_rating: '',
  collection_person_name: '',
  payment_terms: 30,
  collection_person_whatsapp_no: '',
  collection_person_other_mobile_no: '',
  repeat_order_days: 60,
  dnd_for_payment: false,
  company_logo: '',
  company_logo_name: '',
  comment: '',
  is_regular_customer: 0,
  is_active: true,
  party_address: [],
  address_type: '',
  business_name: '',
  gstin: '',
  tripta_code: '',
  address: '',
  pincode: '',
  city_address_details: '',
  state_address_details: '',
  country_address_details: '',
  address_details_countryOption: [],
  address_details_stateOption: [],
  address_details_cityOption: [],
  is_default: true,
  is_same_as_shipping: false,
};

let initialState = {
  partiesLoading: false,
  partiesCRUDLoading: false,
  partiesCategoriesLoading: false,
  partiesDownloadLoading: false,
  partiesActivePartyTypes: [],
  partyTypeListMenu: [],
  customerRating: [],
  partiesAdvisor: [],
  partiesActiveMarket: [],
  partiesActiveIndustry: [],
  partiesCustomerSource: [],
  partiesCustomerSourceDetail: [],
  partiesAddressType: [],
  partiesCountry: [],
  partiesStateWithoutCountry: [],
  partiesCitiesWithoutState: [],
  PartiesCompanyLogo: '',
  partiesState: [],
  partiesCity: [],
  importtedParties: [],
  importtedPartiesExcelData: [],
  listParties: { list: [], count: 0 },
  // listParties: [],
  partiesListCount: 0,
  singleListParties: [],
  exportPartiesExcelData: [],
  exportPartiesPdfData: [],
  listFilter: [],
  partiesApplicableRateList: [],
  transporterPartyList: [],
  allUserPartyList: [],
  onlyTransporterPartyList: [],
  isPartyDeleted: false,
  partiesInitialValues: {
    repeat_order_days: 60,
    payment_terms: 30,
    is_active: true,
  },
  // isGetInitialValues: false,
  addSelectedPartyData: {
    repeat_order_days: 60,
    payment_terms: 30,
    is_active: true,
    party_address: [],
    register_phone_index: [' '],
    register_email_index: [' '],
  },
  updateSelectedPartyData: {
    party_address: [],
    register_phone_index: [' '],
    register_email_index: [' '],
  },
  viewSelectedPartyData: {
    party_address: [],
    register_phone_index: [' '],
    register_email_index: [' '],
  },
  isGetInitialValuesParty: {
    add: false,
    update: false,
    view: false,
  },
  partiesData: addPartiesData,
  partiesAddressList: [],
  // registerPhoneIndex: [''], // new
  // registerEmailIndex: [''], // new
  partiesListLoading: false,
};

const partiesSlice = createSlice({
  name: 'parties',
  initialState,
  reducers: {
    setPartiesLoading: (state, action) => {
      state.partiesLoading = action.payload;
    },
    setPartiesCategoriesLoading: (state, action) => {
      state.partiesCategoriesLoading = action.payload;
    },
    setPartiesListLoading: (state, action) => {
      state.partiesListLoading = action.payload;
    },
    setPartiesCRUDLoading: (state, action) => {
      state.partiesCRUDLoading = action.payload;
    },
    setPartiesDownloadLoading: (state, action) => {
      state.partiesDownloadLoading = action.payload;
    },
    setPartiesActivePartyTypes: (state, action) => {
      state.partiesActivePartyTypes = action.payload;
    },
    setPartyTypeListMenu: (state, action) => {
      state.partyTypeListMenu = action.payload;
    },
    setCustomerRating: (state, action) => {
      state.customerRating = action.payload;
    },
    setPartiesAdvisor: (state, action) => {
      state.partiesAdvisor = action.payload;
    },
    setPartiesActiveMarket: (state, action) => {
      state.partiesActiveMarket = action.payload;
    },
    setPartiesActiveIndustry: (state, action) => {
      state.partiesActiveIndustry = action.payload;
    },
    setPartiesCustomerSource: (state, action) => {
      state.partiesCustomerSource = action.payload;
    },
    setPartiesCustomerSourceDetail: (state, action) => {
      state.partiesCustomerSourceDetail = action.payload;
    },
    setPartiesAddressType: (state, action) => {
      state.partiesAddressType = action.payload;
    },
    setPartiesCountry: (state, action) => {
      state.partiesCountry = action.payload;
    },
    setPartiesCompanyLogo: (state, action) => {
      state.PartiesCompanyLogo = action.payload;
    },
    setPartiesState: (state, action) => {
      state.partiesState = action.payload;
    },
    setPartiesCity: (state, action) => {
      state.partiesCity = action.payload;
    },
    setImporttedParties: (state, action) => {
      state.importtedParties = action.payload;
    },
    setImporttedPartyExcelData: (state, action) => {
      state.importtedPartiesExcelData = action.payload;
    },
    setListParties: (state, action) => {
      state.listParties = action.payload;
    },
    setPartiesListCount: (state, action) => {
      state.partiesListCount = action.payload;
    },
    setPartiesStateWithoutCountry: (state, action) => {
      state.partiesStateWithoutCountry = action.payload;
    },
    setPartiesCitiesWithoutState: (state, action) => {
      state.partiesCitiesWithoutState = action.payload;
    },
    setSingleListParties: (state, action) => {
      state.singleListParties = action.payload;
    },
    setExportPartiesExcelData: (state, action) => {
      state.exportPartiesExcelData = action.payload;
    },
    setExportPartiesPdfData: (state, action) => {
      state.exportPartiesPdfData = action.payload;
    },
    setListFilter: (state, action) => {
      state.listFilter = action.payload;
    },
    setPartiesApplicableRateList: (state, action) => {
      state.partiesApplicableRateList = action.payload;
    },
    setTransporterPartyList: (state, action) => {
      state.transporterPartyList = action.payload;
    },
    setAllUserPartyList: (state, action) => {
      state.allUserPartyList = action.payload;
    },
    setOnlyTransporterPartyList: (state, action) => {
      state.onlyTransporterPartyList = action.payload;
    },
    setIsPartyDeleted: (state, action) => {
      state.isPartyDeleted = action.payload;
    },
    setPartiesInitialValues: (state, action) => {
      state.partiesInitialValues = action.payload;
    },
    clearPartiesInitialValues: (state, action) => {
      state.partiesInitialValues = initialState.partiesInitialValues;
    },
    setIsGetInitialValues: (state, action) => {
      state.isGetInitialValues = action.payload;
    },

    setAddSelectedPartyData: (state, action) => {
      state.addSelectedPartyData = action.payload;
    },
    setIsGetInitialValuesParty: (state, action) => {
      state.isGetInitialValuesParty = action.payload;
    },
    clearAddSelectedPartyData: state => {
      state.addSelectedPartyData = initialState.partiesData;
    },
    setUpdateSelectedPartyData: (state, action) => {
      state.updateSelectedPartyData = action.payload;
    },
    clearUpdateSelectedPartyData: state => {
      state.updateSelectedPartyData = initialState.partiesData;
    },
    setViewSelectedPartyData: (state, action) => {
      state.viewSelectedPartyData = action.payload;
    },
    clearViewSelectedPartyData: state => {
      state.viewSelectedPartyData = initialState.partiesData;
    },
    setPartiesAddressList: (state, action) => {
      state.partiesAddressList = action.payload;
    },
    setRegisterPhoneIndex: (state, action) => {
      state.registerPhoneIndex = action.payload;
    },
    setRegisterEmailIndex: (state, action) => {
      state.registerEmailIndex = action.payload;
    },
  },
});

export const {
  setPartiesLoading,
  setPartiesCategoriesLoading,
  setPartiesListLoading,
  setPartiesActivePartyTypes,
  setPartyTypeListMenu,
  setCustomerRating,
  setPartiesAdvisor,
  setPartiesActiveMarket,
  setPartiesActiveIndustry,
  setPartiesCustomerSource,
  setPartiesCustomerSourceDetail,
  setPartiesAddressType,
  setPartiesCountry,
  setPartiesCompanyLogo,
  setPartiesState,
  setPartiesCity,
  setImporttedParties,
  setImporttedPartyExcelData,
  setListParties,
  setPartiesListCount,
  setPartiesStateWithoutCountry,
  setPartiesCitiesWithoutState,
  setSingleListParties,
  setExportPartiesExcelData,
  setExportPartiesPdfData,
  setListFilter,
  setPartiesCRUDLoading,
  setPartiesDownloadLoading,
  setPartiesApplicableRateList,
  setTransporterPartyList,
  setAllUserPartyList,
  setOnlyTransporterPartyList,
  setIsPartyDeleted,
  setPartiesInitialValues,
  clearPartiesInitialValues,
  setIsGetInitialValues,
  setAddSelectedPartyData,
  setIsGetInitialValuesParty,
  clearAddSelectedPartyData,
  setUpdateSelectedPartyData,
  clearUpdateSelectedPartyData,
  setViewSelectedPartyData,
  clearViewSelectedPartyData,
  setPartiesAddressList,
  setRegisterPhoneIndex,
  setRegisterEmailIndex,
} = partiesSlice.actions;

export default partiesSlice.reducer;
