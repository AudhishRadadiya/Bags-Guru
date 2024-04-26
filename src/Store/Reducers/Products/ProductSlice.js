import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  productLoading: false,
  productCRUDLoading: false,
  productExportLoading: false,
  productList: [],
  allProductList: [],
  selectedProduct: {
    bag_tag: '',
    design_name: '',
    background_design: '',
    customer_group: '',
    no_of_colors: '',
    product_code: '',
    additional_weight: '',
    designer_name: '',
    industry: '',
    ink_weight: '',
    bag_weight: '',
    display_name: '',
    bag_rate: '',
    substrate_print: 1,
    bag_without_order: 1,
    product_show_mobile: 1,
    solid_patch_cylinder: '',
    fabric_color: '',
    bale_packing: 1,
    carton_packing: 0,
    width: '',
    length: '',
    height: '',
    packing_rate: '',
    comment: '',
    main_your_company_logo_image: '',
    bag_type_collection_id: [],
    main_image: '',
    real_image: '',
    pro_image: '',
    roll_image: '',
    old_bag_image: '',
    water_mark_main_image: '',
    water_mark_real_image: '',
    new_cylinder_width: '',
    new_white_patch_cylinder: 0,
    no_white_patch_cylinder: 1,
    old_white_patch_cylinder: 0,
    qty: 0,
    handle_material: '',
    handle_length: '',
    handle_color: '',
    no_of_cylinder: '',
  },
  initialProduct: {
    bag_tag: '',
    handle_allow: false,
    design_name: '',
    background_design: '',
    customer_group: '',
    no_of_colors: '',
    product_code: '',
    additional_weight: '',
    designer_name: '',
    industry: '',
    ink_weight: '',
    bag_weight: '',
    display_name: '',
    bag_rate: '',
    substrate_print: 0,
    bag_without_order: 0,
    product_show_mobile: 0,
    solid_patch_cylinder: '',
    fabric_color: '',
    bale_packing: 1,
    carton_packing: 0,
    width: '',
    length: '',
    height: '',
    packing_rate: '',
    comment: '',
    main_your_company_logo_image: '',
    bag_type_collection_id: [],
    main_image: '',
    real_image: '',
    pro_image: '',
    roll_image: '',
    old_bag_image: '',
    water_mark_main_image: '',
    water_mark_real_image: '',
    new_cylinder_width: '',
    new_white_patch_cylinder: 0,
    no_white_patch_cylinder: 1,
    old_white_patch_cylinder: 0,
    qty: 0,
    handle_material: '',
    handle_length: '',
    handle_color: '',
    no_of_cylinder: '',
    selected_bag_tag_data: {
      material: '',
      form: '',
      bag_type: '',
      bag_tag: '',
      is_laminated: 0,
      lamination_type: [],
      print_type: '',
      print_technology: [],
      is_mm: '',
      width: '',
      height: '',
      gusset: '',
      width_mm: '',
      height_mm: '',
      gusset_mm: '',
    },
  },
  selectedBagTagData: {
    material: '',
    form: '',
    bag_type: '',
    bag_tag: '',
    is_laminated: 0,
    lamination_type: [],
    print_type: '',
    print_technology: [],
    is_mm: '',
    width: '',
    height: '',
    gusset: '',
    width_mm: '',
    height_mm: '',
    gusset_mm: '',
  },
  productCount: 0,
  productTransferCount: 0,
  productRateCount: 0,
  mobileProductCount: 0,
  productTransferList: [],
  productRateList: [],
  productForProforma: [],
  selectedProductData: [],
  mobileProductList: [],
  // common: {
  //   filterToggle: false,
  //   tableFilters: [],
  //   searchQuery: '',
  //   showMobileChecked: false,
  // },
  viewProductDetailData: {},

  // TODO:
  isGetInitialValuesProduct: {
    add: false,
    update: false,
    view: false,
    duplicate: false,
  },
  addSelectedProductData: {
    handle_allow: false,
    substrate_print: 0,
    bag_without_order: 0,
    product_show_mobile: 0,
    bale_packing: 1,
    no_white_patch_cylinder: 1,
    primary_unit: 'Inch',
    is_first_render: true,
    short_listed_bag_tags: [],
    selected_bag_tag_data: {
      material: '',
      form: '',
      bag_type: '',
      bag_tag: '',
      is_laminated: 0,
      lamination_type: [],
      print_type: '',
      print_technology: [],
      is_mm: '',
      width: '',
      height: '',
      gusset: '',
      width_mm: '',
      height_mm: '',
      gusset_mm: '',
    },
  }, // Add Product:
  updateSelectedProductData: {
    handle_allow: false,
    primary_unit: 'Inch',
    is_first_render: false,
    short_listed_bag_tags: [],
  }, // Update Product:
  viewSelectedProductData: {}, // View Product:
  dupicateSelectedProductData: {}, // Duplicate Product:
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductLoading: (state, action) => {
      state.productLoading = action.payload;
    },
    setProductCRUDLoading: (state, action) => {
      state.productCRUDLoading = action.payload;
    },
    setProductExportLoading: (state, action) => {
      state.productExportLoading = action.payload;
    },
    setProductList: (state, action) => {
      state.productList = action.payload;
    },
    setAllProductList: (state, action) => {
      state.allProductList = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSelectedBagTagData: (state, action) => {
      state.selectedBagTagData = action.payload;
    },
    clearSelectedBagTagData: state => {
      state.selectedBagTagData = initialState.selectedBagTagData;
    },
    clearSelectedProduct: state => {
      state.selectedProduct = initialState.selectedProduct;
    },
    setProductCount: (state, action) => {
      state.productCount = action.payload;
    },
    setProductTransferList: (state, action) => {
      state.productTransferList = action.payload;
    },
    setProductRateList: (state, action) => {
      state.productRateList = action.payload;
    },
    setProductTransferCount: (state, action) => {
      state.productTransferCount = action.payload;
    },
    setProductRateCount: (state, action) => {
      state.productRateCount = action.payload;
    },
    setSelectedProductData: (state, action) => {
      state.selectedProductData = action.payload;
    },
    setProductForProforma: (state, action) => {
      state.productForProforma = action.payload;
    },
    setMobileProductCount: (state, action) => {
      state.mobileProductCount = action.payload;
    },
    setMobileProductList: (state, action) => {
      state.mobileProductList = action.payload;
    },
    setViewProductDetailData: (state, action) => {
      state.viewProductDetailData = action.payload;
    },
    // setCommon: (state, action) => {
    //   state.common = action.payload;
    // },
    // resetCommon: state => {
    //   state.common = initialState.common;
    // },

    setIsGetInitialValuesProduct: (state, action) => {
      state.isGetInitialValuesProduct = action.payload;
    },
    setAddSelectedProductData: (state, action) => {
      state.addSelectedProductData = action.payload;
    },
    clearAddSelectedProductData: state => {
      state.addSelectedProductData = initialState.initialProduct;
    },
    setUpdateSelectedProductData: (state, action) => {
      state.updateSelectedProductData = action.payload;
    },
    clearUpdateSelectedProductData: state => {
      state.updateSelectedProductData = initialState.initialProduct;
    },
    setViewSelectedProductData: (state, action) => {
      state.viewSelectedProductData = action.payload;
    },
    clearViewSelectedProductData: state => {
      state.viewSelectedProductData = initialState.initialProduct;
    },
    setDupicateSelectedProductData: (state, action) => {
      state.dupicateSelectedProductData = action.payload;
    },
    clearDuplicateSelectedProductData: state => {
      state.dupicateSelectedProductData = initialState.initialProduct;
    },
  },
});

export const {
  setProductLoading,
  setProductCRUDLoading,
  setProductExportLoading,
  setProductList,
  setAllProductList,
  setSelectedProduct,
  clearSelectedProduct,
  setProductCount,
  setSelectedBagTagData,
  clearSelectedBagTagData,
  setProductTransferCount,
  setProductTransferList,
  setProductRateList,
  setProductRateCount,
  setSelectedProductData,
  setProductForProforma,
  setMobileProductCount,
  setMobileProductList,
  setViewProductDetailData,
  // setCommon,
  // resetCommon,
  setIsGetInitialValuesProduct,
  setAddSelectedProductData,
  clearAddSelectedProductData,
  setUpdateSelectedProductData,
  clearUpdateSelectedProductData,
  setViewSelectedProductData,
  clearViewSelectedProductData,
  setDupicateSelectedProductData,
  clearDuplicateSelectedProductData,
} = productSlice.actions;

export default productSlice.reducer;
