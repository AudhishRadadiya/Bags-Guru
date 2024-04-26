import * as Yup from 'yup';

export const addWarehouseSchema = Yup.object().shape({
  name: Yup.string().required('Warehouse Name is required'),
  code: Yup.string().required('Warehouse code is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
  is_default: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addUnitSchema = Yup.object().shape({
  name: Yup.string().required('Unit Name is required'),
  code: Yup.string().required('Unit code is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addBankSchema = Yup.object().shape({
  name: Yup.string().required('Bank Name is required'),
  account_name: Yup.string().required('Account Name is required'),
  payment_Qrcode: Yup.string()
    .url('Invalid Payment Qrcode')
    .required('Payment Qrcode is required'),
  code: Yup.string().required('Bank code is required'),
  IFSC_code: Yup.string()
    .matches(/^([A-Z]{4}0[A-Z0-9]{6})$/, 'Invalid IFSC code')
    .required('IFSC code is required'),
  account_number: Yup.string()
    .matches(/^\d{9,18}$/, 'Invalid account number')
    .required('Account number is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
  is_default: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addBagTypeSchema = Yup.object().shape({
  name: Yup.string().required('Bag Type Name is required'),
  code: Yup.string().required('Bag Type code is required'),
  handle_weight: Yup.string().required('Handle Weight is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
  conversion_rate: Yup.number().required('Conversion Rate is required'),
  image: Yup.string().url('Invalid Image URL').required('Image is required'),
});

export const addMachineTypeSchema = Yup.object().shape({
  name: Yup.string().required('Machine Type Name is required'),
  code: Yup.string().required('Machine Type code is required'),
  bag_type_id: Yup.array()
    .min(1, 'Please select any one bag type')
    .required('Bag Type is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
  printing_technology_id: Yup.array()
    .min(1, 'Please select any one printing technology')
    .required('Printing Technology is required'),
});
export const addGsmLengthSchema = Yup.object().shape({
  gsm: Yup.string().required('GSM is required'),
  length: Yup.string().required('Length is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});
export const addMachinesSchema = Yup.object().shape({
  name: Yup.string().required('Machine Name is required'),
  machine_type_id: Yup.string().required('Machine is required'),
  speed: Yup.number().required('Speed is required').nullable(),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
  purchase_date: Yup.date().required('Purchase Date is required'),
});
export const addPrintTypeSchema = Yup.object().shape({
  name: Yup.string().required('Printing Type Name is required'),
  code: Yup.string().required('Printing Type code is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
  conversion_rate: Yup.number().required('Conversion Rate is required'),
});

export const addPrintTechnologySchema = Yup.object().shape({
  name: Yup.string().required('Printing Technology Name is required'),
  code: Yup.string().required('Printing Technology code is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
  conversion_rate: Yup.number().required('Conversion Rate is required'),
});

export const addCountrySchema = Yup.object().shape({
  name: Yup.string().required('Country Name is required'),
  country_code: Yup.string()
    .matches(/^[A-Z]{2}$/, 'Invalid country code')
    .required('Country code is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addStateSchema = Yup.object().shape({
  name: Yup.string().required('State Name is required'),
  country_code: Yup.string().required('Country code is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addCitySchema = Yup.object().shape({
  name: Yup.string().required('City Name is required'),
  country_id: Yup.string().required('Country is required'),
  state_id: Yup.string().required('State is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addFactoryLocationSchema = Yup.object().shape({
  name: Yup.string().required('Factory Location Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
  is_default: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addOperatorRoleSchema = Yup.object().shape({
  name: Yup.string().required('Operator Role Name is required'),
  comment: Yup.string().required('comment is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addBagMachineSchema = Yup.object().shape({
  name: Yup.string().required('Bag Machine Name is required'),
  code: Yup.string().required('Bag Machine code is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addLaminationTypeSchema = Yup.object().shape({
  name: Yup.string().required('Lamination Type Name is required'),
  code: Yup.string().required('Lamination Type code is required'),
  layer: Yup.number().required('Layer is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addBusinessTypeSchema = Yup.object().shape({
  name: Yup.string().required('Business Type Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addRawMaterialGroupSchema = Yup.object().shape({
  name: Yup.string().required('Raw Material Group Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addPartyTypeSchema = Yup.object().shape({
  name: Yup.string().required('Party Type Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addMarketSchema = Yup.object().shape({
  name: Yup.string().required('Market Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addIndustrySchema = Yup.object().shape({
  name: Yup.string().required('Industry Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addCustomerSourceSchema = Yup.object().shape({
  name: Yup.string().required('Customer Source Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addCustomerSourceDetailSchema = Yup.object().shape({
  name: Yup.string().required('Customer Source Detail Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addAddressTypeSchema = Yup.object().shape({
  name: Yup.string().required('Address Type Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addPatchCylinderSchema = Yup.object().shape({
  name: Yup.string().required('Patch Cylinder Name is required'),
  cylinder: Yup.string().nullable(),
  width: Yup.string().nullable(),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addCustomerGroupSchema = Yup.object().shape({
  name: Yup.string().required('Customer Group Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addBackgroundDesignSchema = Yup.object().shape({
  name: Yup.string().required('Background Design Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addHandleMaterialSchema = Yup.object().shape({
  name: Yup.string().required('Handle Material Name is required'),
  conversion_rate: Yup.number().required('Conversion Rate is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addBagCapacitySchema = Yup.object().shape({
  size: Yup.string().required('Size is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addFormSchema = Yup.object().shape({
  name: Yup.string().required('Form Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addMaterialSchema = Yup.object().shape({
  name: Yup.string().required('Material Name is required'),
  gst: Yup.string().required('GST is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addFabricColorSchema = Yup.object().shape({
  code: Yup.string().required('Color Code is required'),
  name: Yup.string().required('Fabric Color Name is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addBagTypeCollection = Yup.object().shape({
  name: Yup.string().required('Collection Name is required'),
  order_no: Yup.number().required('Sorting Order is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addVelcroSchema = Yup.object().shape({
  size: Yup.string().required('Size is required'),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addCustomerRatingSchema = Yup.object().shape({
  star_rating: Yup.string().required('Name is required'),
  percentage: Yup.string().required('Percentage is required'),
});
