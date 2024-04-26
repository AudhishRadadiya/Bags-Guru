import * as Yup from 'yup';

export const addRawItemSchema = Yup.object().shape({
  name: Yup.string().required('Raw Item Name is required'),
  code: Yup.string().required('Item code is required'),
  group: Yup.string().required('Group name is required'),
  primary_unit: Yup.string().required('Primary Unit is required'), //id
  secondary_unit: Yup.string().required('Secondary Unit is required'), //id
  GST_rate: Yup.number()
    .typeError('GST Rate must be a number')
    .min(1, 'GST Rate must be greater than 0')
    .max(100, 'GST Rate must be less than or equal to 100')
    .nullable(),
  comment: Yup.string().nullable(),
  used_as_bag_handle: Yup.boolean().oneOf([true, false], 'Invalid option'),
  is_active: Yup.boolean().oneOf([true, false], 'invalid option').nullable(),
});

export const addAttributeSchema = Yup.object().shape({
  name: Yup.string().required('Raw Item Name is required'),
  type: Yup.string().required('Type is required'),
  values: Yup.array().nullable(),
  is_mandatory: Yup.boolean().oneOf([true, false], 'Invalid option').nullable(),
});
