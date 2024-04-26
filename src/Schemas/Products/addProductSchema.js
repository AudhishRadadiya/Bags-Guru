import * as Yup from 'yup';

export const addProductSchema = Yup.object().shape({
  bag_tag: Yup.string().required('Bag Tag is required'),
  handle_allow: Yup.string().nullable(),
  design_name: Yup.string().required('Design Name is required'),
  // background_design: Yup.string().required('Background Design is required'),
  customer_group: Yup.string().required('Customer Group is required'),
  // customer_group: Yup.string().nullable(),
  no_of_colors: Yup.string().nullable(),
  product_code: Yup.string().required(''),
  designer_name: Yup.string().required('Designer Name is required'),
  // handle_material: Yup.string().required('Handle Material is required'),
  handle_material: Yup.string().when('handle_allow', value => {
    return value.includes('true')
      ? Yup.string().notRequired()
      : Yup.string().required('Handle Material is required');
  }),
  // handle_length: Yup.string().required('Handle Length is required'),
  handle_length: Yup.string().when('handle_allow', value => {
    return value.includes('true')
      ? Yup.string().notRequired()
      : Yup.string().required('Handle Length is required');
  }),
  // handle_color: Yup.string().required('Handle Color is required'),
  handle_color: Yup.string().when('handle_allow', value => {
    return value.includes('true')
      ? Yup.string().notRequired()
      : Yup.string().required('Handle Color is required');
  }),
  industry: Yup.string().required('Industry is required'),
  ink_weight: Yup.number().required('Ink Weight is required'),
  bag_weight: Yup.string().required('Bag Weight is required'),
  display_name: Yup.string().when(
    'product_show_mobile',
    product_show_mobile => {
      return product_show_mobile.includes(false)
        ? Yup.string().notRequired()
        : Yup.string().required('Display Name is required');
    },
  ),
  bag_rate: Yup.string().when('bag_without_order', bag_without_order => {
    return bag_without_order.includes(false)
      ? Yup.string().notRequired()
      : Yup.string().required('Product Rate is required');
  }),
  bag_type_collection_id: Yup.array().when(
    'product_show_mobile',
    product_show_mobile => {
      return product_show_mobile.includes(true)
        ? Yup.array()
            .min(1, 'Please select at least one Bag Collection')
            .required('Bag Collection is required')
        : Yup.array().nullable();
    },
  ),
  substrate_print: Yup.boolean().oneOf([true, false], 'Invalid option'),
  bag_without_order: Yup.boolean().oneOf([true, false], 'Invalid option'),
  product_show_mobile: Yup.boolean().oneOf(
    [true, false, null],
    'Invalid option',
  ),
  solid_patch_cylinder: Yup.string().when(
    'old_white_patch_cylinder',
    old_white_patch_cylinder => {
      return old_white_patch_cylinder.includes(false)
        ? Yup.string().notRequired()
        : Yup.string().required('White Patch Cylinder is required');
    },
  ),
  cylinder_widht: Yup.boolean().oneOf([true, false, null], 'Invalid option'),
  solid_cylinder: Yup.boolean().oneOf([true, false, null], 'Invalid option'),
  fabric_color: Yup.string().required('Fabric Color is required'),
  no_of_cylinder: Yup.number().nullable(),
  bale_packing: Yup.boolean().oneOf([true, false, null], 'Invalid option'),
  old_white_patch_cylinder: Yup.boolean().oneOf(
    [true, false, null],
    'Invalid option',
  ),
  carton_packing: Yup.boolean().oneOf([true, false, null], 'Invalid option'),
  width: Yup.number().positive('Width must be a positive number').nullable(),
  length: Yup.number().positive('Height must be a positive number').nullable(),
  height: Yup.number().positive('Height must be a positive number').nullable(),
  packing_rate: Yup.number()
    .positive('Packing Rate must be a positive number')
    .nullable(),
  comment: Yup.string(),
  main_image: Yup.string().url('Invalid Main Image URL').nullable(),
  main_your_company_logo_image: Yup.string()
    .url('Invalid Main Image (Your Company Logo) URL')
    .nullable(),
  real_image: Yup.string().url('Invalid Real Image URL').nullable(),
  pro_image: Yup.string().url('Invalid Pro Image URL'),
  roll_image: Yup.string().url('Invalid Roll Image URL'),
  old_bag_image: Yup.string().url('Invalid Old Bag Image URL'),
  water_mark_main_image: Yup.string()
    .url('Invalid Water Mark Main Image URL')
    .nullable(),
  water_mark_real_image: Yup.string()
    .url('Invalid Water Mark Real Image URL')
    .nullable(),
});
