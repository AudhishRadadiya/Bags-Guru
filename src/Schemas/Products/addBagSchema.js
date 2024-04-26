import * as Yup from 'yup';

export const addBagSchema = Yup.object().shape(
  {
    material: Yup.string().required('Material is required'),
    form: Yup.string().required('Form is required'),
    bag_type: Yup.string().required('Bag Type is required'),
    bag_tag: Yup.string().nullable(),
    is_laminated: Yup.boolean().oneOf([true, false, null], 'Invalid option'),
    lamination_type: Yup.string().when('is_laminated', is_laminated => {
      return is_laminated.includes(false)
        ? Yup.array().notRequired()
        : Yup.array()
            .min(1, 'Please select at least one Lamination Type')
            .required('Lamination Type is required');
    }),
    print_type: Yup.string().required('Printing Type is required'),
    print_technology: Yup.array()
      .min(1, 'Please select at least one Printing Technology')
      .required('Printing Technology is required'),
    is_mm: Yup.boolean()
      .nullable()
      .oneOf([true, false, null], 'Invalid option'),
    width: Yup.number()
      .required('Width (inches) is required')
      .positive('Width (inches) must be a positive number'),
    height: Yup.number()
      .required('Height (inches) is required')
      .positive('Height (inches) must be a positive number'),
    gusset: Yup.number().when(
      'selected_bag_type_name',
      selected_bag_type_name => {
        return [
          'boxbag',
          'cooler',
          'loophandlebagwithuf',
          'sidefold',
          'd-cutwithuf',
        ].includes(selected_bag_type_name?.[0])
          ? Yup.number()
              .required('Gusset (inches) is required')
              .moreThan(-1, 'Gusset (inches) must be a positive number or 0')
          : Yup.number().notRequired();
      },
    ),
    roll_width: Yup.number()
      .required('Roll Width is required')
      .positive('Roll Width must be a positive number'), // 29"
    repeat_length: Yup.number()
      .required('Repeat Length is required')
      .positive('Repeat Length must be a positive number'), // 16"
    cylinder: Yup.number()
      .required('Cylinder is required')
      .positive('Cylinder must be a positive number'),
    width_mm: Yup.string().when('is_mm', is_mm => {
      return is_mm.includes(false)
        ? Yup.number().notRequired()
        : Yup.number()
            .required('Width (MM) is required')
            .positive('Width (MM) must be a positive number');
    }),
    height_mm: Yup.string().when('is_mm', is_mm => {
      return is_mm.includes(false)
        ? Yup.number().notRequired()
        : Yup.number()
            .required('Height (MM) is required')
            .positive('Height (MM) must be a positive number');
    }),
    gusset_mm: Yup.number().when(
      ['selected_bag_type_name', 'is_mm'],
      values => {
        return values?.[1] === true &&
          [
            'boxbag',
            'cooler',
            'loophandlebagwithuf',
            'sidefold',
            'd-cutwithuf',
          ].includes(values?.[0])
          ? Yup.number()
              .required('Gusset (MM) is required')
              .moreThan(-1, 'Gusset (MM) must be a positive number or 0')
          : Yup.number().notRequired();
      },
    ),
    roll_width_mm: Yup.string().when('is_mm', is_mm => {
      return is_mm.includes(false)
        ? Yup.number().notRequired()
        : Yup.number()
            .required('Roll Width is required')
            .positive('Roll Width must be a positive number');
    }),
    repeat_length_mm: Yup.string().when('is_mm', is_mm => {
      return is_mm.includes(false)
        ? Yup.number().notRequired()
        : Yup.number()
            .required('Repeat Length is required')
            .positive('Repeat Length must be a positive number');
    }),
    cylinder_mm: Yup.string().when('is_mm', is_mm => {
      return is_mm.includes(false)
        ? Yup.number().notRequired()
        : Yup.number()
            .required('Cylinder is required')
            .positive('Cylinder must be a positive number');
    }),
    handle_weight_auto: Yup.string().when('handle_weight', handle_weight => {
      return handle_weight.includes('1')
        ? Yup.string().notRequired()
        : Yup.string().nullable();
    }),
    handle_weight_actual_text: Yup.string().when(
      'handle_weight',
      handle_weight => {
        return handle_weight.includes('1')
          ? Yup.string().notRequired()
          : Yup.string().nullable();
      },
    ),
    handle_weight: Yup.string().when(
      'handle_weight_auto',
      handle_weight_auto => {
        return handle_weight_auto.includes('1')
          ? Yup.string().notRequired()
          : Yup.string().nullable();
      },
    ),
    handle_weight_text: Yup.string().when(
      'handle_weight_auto',
      handle_weight_auto => {
        return handle_weight_auto.includes('1')
          ? Yup.string().notRequired()
          : Yup.string().nullable();
      },
    ),
    bag_capacity: Yup.string().notRequired(),
    bundle_size: Yup.string().notRequired(),
    gsm: Yup.string().required('GSM is required'),
    wastage: Yup.string().notRequired(), // with 20%
    bag_weight: Yup.string().required('Bag Weight is required'), // 60 gm
  },
  [
    ['handle_weight', 'handle_weight_auto'],
    ['selected_bag_type_name', 'is_mm'],
  ],
);
