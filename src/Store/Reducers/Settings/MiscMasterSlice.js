import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  miscMasterLoading: false,
  miscMasterCRUDLoading: false,
  miscMasterList: [],
  warehouseList: [],
  warehouseCount: 0,
  selectedWarehouse: { name: '', code: '', is_default: 0, is_active: 1 },
  unitList: [],
  unitCount: 0,
  selectedUnit: { name: '', code: '', is_active: 1 },
  bankList: [],
  bankCount: 0,
  selectedBank: {
    name: '',
    account_name: '',
    code: '',
    IFSC_code: '',
    account_number: '',
    is_active: 1,
    payment_Qrcode: '',
    is_default: 0,
  },
  bagTypeList: [],
  bagTypeCount: 0,
  selectedBagType: {
    name: '',
    code: '',
    handle_weight: '',
    is_active: 1,
    conversion_rate: '',
    image: '',
  },
  selectedMachineType: {
    name: '',
    code: '',
    is_active: 1,
    bag_type_id: [],
    printing_technology_id: [],
  },
  selectedGsmLength: {
    gsm: '',
    length: '',
    is_active: 1,
  },
  selectedMachines: {
    name: '',
    code: '',
    is_active: 1,
    machine_type_id: '',
    speed: '',
    purchase_date: null,
  },
  printTypeList: [],
  printTypeCount: 0,
  selectedPrintType: {
    name: '',
    code: '',
    is_active: 1,
    conversion_rate: '',
  },
  printTechnologyList: [],
  printTechnologyCount: 0,
  selectedPrintTechnology: {
    name: '',
    code: '',
    is_active: 1,
    conversion_rate: '',
  },
  countryList: [],
  countryCount: 0,
  selectedCountry: {
    name: '',
    country_code: '',
    is_active: 1,
  },
  stateList: [],
  stateCount: 0,
  selectedState: {
    name: '',
    country_code: '62c7a4879e7f43d9cbf9027b',
    is_active: 1,
  },
  cityList: [],
  cityCount: 0,
  selectedCity: {
    name: '',
    state_id: '',
    country_id: '62c7a4879e7f43d9cbf9027b',
    is_active: 1,
  },
  factoryLocationList: [],
  factoryLocationCount: 0,
  selectedFactoryLocation: {
    name: '',
    is_default: 0,
    is_active: 1,
  },
  operatorRoleList: [],
  operatorRoleCount: 0,
  selectedOperatorRole: {
    name: '',
    comment: '',
    is_active: 1,
  },
  bagMachineList: [],
  bagMachineCount: 0,
  selectedBagMachine: { name: '', code: '', is_active: 1 },
  laminationTypeList: [],
  laminationTypeCount: 0,
  selectedLaminationType: {
    name: '',
    code: '',
    layer: '',
    is_active: 1,
  },
  businessTypeList: [],
  businessTypeCount: 0,
  selectedBusinessType: { name: '', is_active: 1 },
  itemGroupList: [],
  itemGroupCount: 0,
  selectedItemGroup: { name: '', is_active: 1 },
  partyTypeList: [],
  partyTypeCount: 0,
  selectedPartyType: { name: '', is_active: 1 },
  marketList: [],
  marketCount: 0,
  selectedMarket: { name: '', is_active: 1 },
  industryList: [],
  industryCount: 0,
  selectedIndustry: { name: '', is_active: 1 },
  customerSourceList: [],
  customerSourceCount: 0,
  selectedCustomerSource: { name: '', is_active: 1 },
  customerSourceDetailList: [],
  customerSourceDetailCount: 0,
  selectedCustomerSourceDetail: { name: '', is_active: 1 },
  addressTypeList: [],
  addressTypeCount: 0,
  selectedAddressType: { name: '', is_active: 1 },
  patchCylinderList: [],
  patchCylinderCount: 0,
  selectedPatchCylinder: { name: '', is_active: 1, width: '', cylinder: '' },
  customerGroupList: [],
  customerGroupCount: 0,
  selectedCustomerGroup: { name: '', is_active: 1 },
  backgroundDesignList: [],
  backgroundDesignCount: 0,
  selectedBackgroundDesign: { name: '', is_active: 1 },
  handleMaterialList: [],
  handleMaterialCount: 0,
  selectedHandleMaterial: { name: '', conversion_rate: '', is_active: 1 },
  bagCapacityList: [],
  bagCapacityCount: 0,
  selectedBagCapacity: { size: '', is_active: 1 },
  formList: [],
  formCount: 0,
  selectedForm: { name: '', is_active: 1 },
  materialList: [],
  materialCount: 0,
  selectedMaterial: { name: '', is_active: 1, gst: '' },
  fabricColorList: [],
  fabricColorCount: 0,
  selectedFabricColor: { code: '', name: '', is_active: 1 },
  activeMaterialList: [],
  activeFormList: [],
  activeBagTypeList: [],
  bagTypeListMenu: [],
  activeLaminationTypeList: [],
  activePrintTypeList: [],
  activePrintTechnologyList: [],
  activeBagCapacityList: [],
  activeCustomerGroupList: [],
  activeFabricColorList: [],
  fabricColorListMenu: [],
  activeWarehouseList: [],
  activeIndustryList: [],
  activeHandleMaterialList: [],
  activeBackgroundDesignList: [],
  designerList: [],
  activePatchCylinderList: [],
  bagTypeCollectionCount: 0,
  bagTypeCollectionList: [],
  activeBagTypeCollectionList: [],
  selectedBagTypeCollection: { name: '', is_active: 1, order_no: '' },
  customerPartyList: [],
  machineTypeList: [],
  machineTypeCount: 0,
  activeMachineTypeList: [],
  activeGsmList: [],
  machinesList: [],
  machinesCount: 0,
  gsmLengthList: [],
  gsmLengthCount: 0,
  machineListByMachineType: [],
  velcroList: [],
  velcroCount: 0,
  activeVelcroList: [],
  customerRatingList: [],
  customerRatingCount: 0,
  activeCustomerRatingList: [],
  selectedVelcro: { size: '', is_active: 1 },
  selectedCustomerRating: { star_rating: '', percentage: '', is_active: 1 },
};

const miscMasterSlice = createSlice({
  name: 'miscMaster',
  initialState,
  reducers: {
    setMiscMasterLoading: (state, action) => {
      state.miscMasterLoading = action.payload;
    },
    setMiscMasterCRUDLoading: (state, action) => {
      state.miscMasterCRUDLoading = action.payload;
    },
    setMiscMasterList: (state, action) => {
      state.miscMasterList = action.payload;
    },
    setWarehouseList: (state, action) => {
      state.warehouseList = action.payload;
    },
    setActiveWarehouseList: (state, action) => {
      state.activeWarehouseList = action.payload;
    },
    setWarehouseCount: (state, action) => {
      state.warehouseCount = action.payload;
    },
    setSelectedWarehouse: (state, action) => {
      state.selectedWarehouse = action.payload;
    },
    setUnitList: (state, action) => {
      state.unitList = action.payload;
    },
    setUnitCount: (state, action) => {
      state.unitCount = action.payload;
    },
    setSelectedUnit: (state, action) => {
      state.selectedUnit = action.payload;
    },
    setBankList: (state, action) => {
      state.bankList = action.payload;
    },
    setBankCount: (state, action) => {
      state.bankCount = action.payload;
    },
    setSelectedBank: (state, action) => {
      state.selectedBank = action.payload;
    },
    setBagTypeList: (state, action) => {
      state.bagTypeList = action.payload;
    },
    setActiveBagTypeList: (state, action) => {
      state.activeBagTypeList = action.payload;
    },
    setBagTypeListMenu: (state, action) => {
      state.bagTypeListMenu = action.payload;
    },
    setBagTypeCount: (state, action) => {
      state.bagTypeCount = action.payload;
    },
    setSelectedBagType: (state, action) => {
      state.selectedBagType = action.payload;
    },
    setSelectedMachineType: (state, action) => {
      state.selectedMachineType = action.payload;
    },
    setSelectedMachines: (state, action) => {
      state.selectedMachines = action.payload;
    },
    setPrintTypeList: (state, action) => {
      state.printTypeList = action.payload;
    },
    setActivePrintTypeList: (state, action) => {
      state.activePrintTypeList = action.payload;
    },
    setPrintTypeCount: (state, action) => {
      state.printTypeCount = action.payload;
    },
    setSelectedPrintType: (state, action) => {
      state.selectedPrintType = action.payload;
    },
    setPrintTechnologyList: (state, action) => {
      state.printTechnologyList = action.payload;
    },
    setActivePrintTechnologyList: (state, action) => {
      state.activePrintTechnologyList = action.payload;
    },
    setPrintTechnologyCount: (state, action) => {
      state.printTechnologyCount = action.payload;
    },
    setSelectedPrintTechnology: (state, action) => {
      state.selectedPrintTechnology = action.payload;
    },
    setCountryList: (state, action) => {
      state.countryList = action.payload;
    },
    setCountryCount: (state, action) => {
      state.countryCount = action.payload;
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    setStateList: (state, action) => {
      state.stateList = action.payload;
    },
    setStateCount: (state, action) => {
      state.stateCount = action.payload;
    },
    setSelectedState: (state, action) => {
      state.selectedState = action.payload;
    },
    setCityList: (state, action) => {
      state.cityList = action.payload;
    },
    setCityCount: (state, action) => {
      state.cityCount = action.payload;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    setFactoryLocationList: (state, action) => {
      state.factoryLocationList = action.payload;
    },
    setFactoryLocationCount: (state, action) => {
      state.factoryLocationCount = action.payload;
    },
    setSelectedFactoryLocation: (state, action) => {
      state.selectedFactoryLocation = action.payload;
    },
    setOperatorRoleList: (state, action) => {
      state.operatorRoleList = action.payload;
    },
    setOperatorRoleCount: (state, action) => {
      state.operatorRoleCount = action.payload;
    },
    setSelectedOperatorRole: (state, action) => {
      state.selectedOperatorRole = action.payload;
    },
    setBagMachineList: (state, action) => {
      state.bagMachineList = action.payload;
    },
    setBagMachineCount: (state, action) => {
      state.bagMachineCount = action.payload;
    },
    setSelectedBagMachine: (state, action) => {
      state.selectedBagMachine = action.payload;
    },
    setLaminationTypeList: (state, action) => {
      state.laminationTypeList = action.payload;
    },
    setActiveLaminationTypeList: (state, action) => {
      state.activeLaminationTypeList = action.payload;
    },
    setLaminationTypeCount: (state, action) => {
      state.laminationTypeCount = action.payload;
    },
    setSelectedLaminationType: (state, action) => {
      state.selectedLaminationType = action.payload;
    },
    setBusinessTypeList: (state, action) => {
      state.businessTypeList = action.payload;
    },
    setBusinessTypeCount: (state, action) => {
      state.businessTypeCount = action.payload;
    },
    setSelectedBusinessType: (state, action) => {
      state.selectedBusinessType = action.payload;
    },
    setItemGroupList: (state, action) => {
      state.itemGroupList = action.payload;
    },
    setItemGroupCount: (state, action) => {
      state.itemGroupCount = action.payload;
    },
    setSelectedItemGroup: (state, action) => {
      state.selectedItemGroup = action.payload;
    },
    setPartyTypeList: (state, action) => {
      state.partyTypeList = action.payload;
    },
    setPartyTypeCount: (state, action) => {
      state.partyTypeCount = action.payload;
    },
    setSelectedPartyType: (state, action) => {
      state.selectedPartyType = action.payload;
    },
    setMarketList: (state, action) => {
      state.marketList = action.payload;
    },
    setMarketCount: (state, action) => {
      state.marketCount = action.payload;
    },
    setSelectedMarket: (state, action) => {
      state.selectedMarket = action.payload;
    },
    setIndustryList: (state, action) => {
      state.industryList = action.payload;
    },
    setActiveIndustryList: (state, action) => {
      state.activeIndustryList = action.payload;
    },
    setIndustryCount: (state, action) => {
      state.industryCount = action.payload;
    },
    setSelectedIndustry: (state, action) => {
      state.selectedIndustry = action.payload;
    },
    setCustomerSourceList: (state, action) => {
      state.customerSourceList = action.payload;
    },
    setCustomerSourceCount: (state, action) => {
      state.customerSourceCount = action.payload;
    },
    setSelectedCustomerSource: (state, action) => {
      state.selectedCustomerSource = action.payload;
    },
    setCustomerSourceDetailList: (state, action) => {
      state.customerSourceDetailList = action.payload;
    },
    setCustomerSourceDetailCount: (state, action) => {
      state.customerSourceDetailCount = action.payload;
    },
    setSelectedCustomerSourceDetail: (state, action) => {
      state.selectedCustomerSourceDetail = action.payload;
    },
    setAddressTypeList: (state, action) => {
      state.addressTypeList = action.payload;
    },
    setAddressTypeCount: (state, action) => {
      state.addressTypeCount = action.payload;
    },
    setSelectedAddressType: (state, action) => {
      state.selectedAddressType = action.payload;
    },
    setPatchCylinderList: (state, action) => {
      state.patchCylinderList = action.payload;
    },
    setActivePatchCylinderList: (state, action) => {
      state.activePatchCylinderList = action.payload;
    },
    setPatchCylinderCount: (state, action) => {
      state.patchCylinderCount = action.payload;
    },
    setSelectedPatchCylinder: (state, action) => {
      state.selectedPatchCylinder = action.payload;
    },
    setCustomerGroupList: (state, action) => {
      state.customerGroupList = action.payload;
    },
    setActiveCustomerGroupList: (state, action) => {
      state.activeCustomerGroupList = action.payload;
    },
    setCustomerGroupCount: (state, action) => {
      state.customerGroupCount = action.payload;
    },
    setSelectedCustomerGroup: (state, action) => {
      state.selectedCustomerGroup = action.payload;
    },
    setBackgroundDesignList: (state, action) => {
      state.backgroundDesignList = action.payload;
    },
    setActiveBackgroundDesignList: (state, action) => {
      state.activeBackgroundDesignList = action.payload;
    },
    setBackgroundDesignCount: (state, action) => {
      state.backgroundDesignCount = action.payload;
    },
    setSelectedBackgroundDesign: (state, action) => {
      state.selectedBackgroundDesign = action.payload;
    },
    setHandleMaterialList: (state, action) => {
      state.handleMaterialList = action.payload;
    },
    setHandleMaterialCount: (state, action) => {
      state.handleMaterialCount = action.payload;
    },
    setActiveHandleMaterialList: (state, action) => {
      state.activeHandleMaterialList = action.payload;
    },
    setSelectedHandleMaterial: (state, action) => {
      state.selectedHandleMaterial = action.payload;
    },
    setBagCapacityList: (state, action) => {
      state.bagCapacityList = action.payload;
    },
    setActiveBagCapacityList: (state, action) => {
      state.activeBagCapacityList = action.payload;
    },
    setBagCapacityCount: (state, action) => {
      state.bagCapacityCount = action.payload;
    },
    setSelectedBagCapacity: (state, action) => {
      state.selectedBagCapacity = action.payload;
    },
    setFormList: (state, action) => {
      state.formList = action.payload;
    },
    setActiveFormList: (state, action) => {
      state.activeFormList = action.payload;
    },
    setFormCount: (state, action) => {
      state.formCount = action.payload;
    },
    setSelectedForm: (state, action) => {
      state.selectedForm = action.payload;
    },
    setMaterialList: (state, action) => {
      state.materialList = action.payload;
    },
    setActiveMaterialList: (state, action) => {
      state.activeMaterialList = action.payload;
    },
    setMaterialCount: (state, action) => {
      state.materialCount = action.payload;
    },
    setSelectedMaterial: (state, action) => {
      state.selectedMaterial = action.payload;
    },
    setFabricColorList: (state, action) => {
      state.fabricColorList = action.payload;
    },
    setActiveFabricColorList: (state, action) => {
      state.activeFabricColorList = action.payload;
    },
    setFabricColorListMenu: (state, action) => {
      state.fabricColorListMenu = action.payload;
    },
    setFabricColorCount: (state, action) => {
      state.fabricColorCount = action.payload;
    },
    setSelectedFabricColor: (state, action) => {
      state.selectedFabricColor = action.payload;
    },
    setDesignerList: (state, action) => {
      state.designerList = action.payload;
    },
    setSelectedBagTypeCollection: (state, action) => {
      state.selectedBagTypeCollection = action.payload;
    },
    setBagTypeCollectionCount: (state, action) => {
      state.bagTypeCollectionCount = action.payload;
    },
    setBagTypeCollectionList: (state, action) => {
      state.bagTypeCollectionList = action.payload;
    },
    setActiveBagTypeCollectionList: (state, action) => {
      state.activeBagTypeCollectionList = action.payload;
    },
    setCustomerPartyList: (state, action) => {
      state.customerPartyList = action.payload;
    },

    setActiveMachineTypeList: (state, action) => {
      state.activeMachineTypeList = action.payload;
    },
    setMachineTypeList: (state, action) => {
      state.machineTypeList = action.payload;
    },
    setMachineTypeCount: (state, action) => {
      state.machineTypeCount = action.payload;
    },

    setActiveGsmList: (state, action) => {
      state.activeGsmList = action.payload;
    },
    setGsmLengthList: (state, action) => {
      state.gsmLengthList = action.payload;
    },
    setGsmLengthCount: (state, action) => {
      state.gsmLengthCount = action.payload;
    },
    setSelectedGsmLength: (state, action) => {
      state.selectedGsmLength = action.payload;
    },
    setMachinesList: (state, action) => {
      state.machinesList = action.payload;
    },
    setMachinesCount: (state, action) => {
      state.machinesCount = action.payload;
    },
    setMachineListByMachineType: (state, action) => {
      state.machineListByMachineType = action.payload;
    },
    setVelcroList: (state, action) => {
      state.velcroList = action.payload;
    },
    setVelcroCount: (state, action) => {
      state.velcroCount = action.payload;
    },
    setActiveVelcroList: (state, action) => {
      state.activeVelcroList = action.payload;
    },
    setCustomerRatingList: (state, action) => {
      state.customerRatingList = action.payload;
    },
    setCustomerRatingCount: (state, action) => {
      state.customerRatingCount = action.payload;
    },
    setActiveCustomerRatingList: (state, action) => {
      state.activeCustomerRatingList = action.payload;
    },
    setSelectedVelcro: (state, action) => {
      state.selectedVelcro = action.payload;
    },
    setSelectedCustomerRating: (state, action) => {
      state.selectedCustomerRating = action.payload;
    },
  },
});

export const {
  setActiveMaterialList,
  setMiscMasterList,
  setMiscMasterLoading,
  setMiscMasterCRUDLoading,
  setWarehouseList,
  setWarehouseCount,
  setSelectedWarehouse,
  setUnitCount,
  setUnitList,
  setSelectedUnit,
  setBankList,
  setBankCount,
  setSelectedBank,
  setBagTypeList,
  setActiveBagTypeList,
  setBagTypeListMenu,
  setBagTypeCount,
  setSelectedBagType,
  setPrintTypeList,
  setActivePrintTypeList,
  setPrintTypeCount,
  setSelectedPrintType,
  setPrintTechnologyList,
  setActivePrintTechnologyList,
  setPrintTechnologyCount,
  setSelectedPrintTechnology,
  setCountryList,
  setCountryCount,
  setSelectedCountry,
  setStateList,
  setStateCount,
  setSelectedState,
  setCityList,
  setCityCount,
  setSelectedCity,
  setSelectedFactoryLocation,
  setFactoryLocationCount,
  setFactoryLocationList,
  setSelectedOperatorRole,
  setOperatorRoleList,
  setOperatorRoleCount,
  setSelectedBagMachine,
  setBagMachineList,
  setBagMachineCount,
  setSelectedLaminationType,
  setLaminationTypeCount,
  setLaminationTypeList,
  setActiveLaminationTypeList,
  setSelectedBusinessType,
  setBusinessTypeCount,
  setBusinessTypeList,
  setItemGroupList,
  setItemGroupCount,
  setSelectedItemGroup,
  setPartyTypeList,
  setSelectedPartyType,
  setPartyTypeCount,
  setMarketList,
  setSelectedMarket,
  setMarketCount,
  setIndustryList,
  setIndustryCount,
  setSelectedIndustry,
  setCustomerSourceList,
  setCustomerSourceCount,
  setSelectedCustomerSource,
  setCustomerSourceDetailList,
  setCustomerSourceDetailCount,
  setSelectedCustomerSourceDetail,
  setAddressTypeList,
  setSelectedAddressType,
  setAddressTypeCount,
  setPatchCylinderList,
  setSelectedPatchCylinder,
  setPatchCylinderCount,
  setCustomerGroupList,
  setSelectedCustomerGroup,
  setCustomerGroupCount,
  setBackgroundDesignList,
  setSelectedBackgroundDesign,
  setActiveBackgroundDesignList,
  setBackgroundDesignCount,
  setHandleMaterialList,
  setActiveHandleMaterialList,
  setSelectedHandleMaterial,
  setHandleMaterialCount,
  setBagCapacityList,
  setActiveBagCapacityList,
  setSelectedBagCapacity,
  setBagCapacityCount,
  setFormList,
  setActiveFormList,
  setSelectedForm,
  setFormCount,
  setMaterialList,
  setSelectedMaterial,
  setMaterialCount,
  setFabricColorList,
  setSelectedFabricColor,
  setFabricColorCount,
  setActiveCustomerGroupList,
  setCustomerPartyList,
  setActiveFabricColorList,
  setFabricColorListMenu,
  setActiveWarehouseList,
  setActiveIndustryList,
  setDesignerList,
  setActivePatchCylinderList,
  setActiveBagTypeCollectionList,
  setBagTypeCollectionList,
  setBagTypeCollectionCount,
  setSelectedBagTypeCollection,
  setMachineTypeList,
  setMachineTypeCount,
  setSelectedMachineType,
  setActiveMachineTypeList,
  setSelectedMachines,
  setMachinesList,
  setMachinesCount,
  setGsmLengthList,
  setGsmLengthCount,
  setSelectedGsmLength,
  setActiveGsmList,
  setMachineListByMachineType,
  setVelcroList,
  setVelcroCount,
  setActiveVelcroList,
  setCustomerRatingList,
  setCustomerRatingCount,
  setActiveCustomerRatingList,
  setSelectedVelcro,
  setSelectedCustomerRating,
} = miscMasterSlice.actions;

export default miscMasterSlice.reducer;
