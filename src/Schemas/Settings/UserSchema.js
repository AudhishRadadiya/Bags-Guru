import * as Yup from 'yup';

export const addUserSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobile_no: Yup.string()
    .matches(/^\d{10}$/, 'Mobile Number must be a 10-digit number')
    .required('Mobile Number is required'),
  dob: Yup.date().nullable(),
  gender: Yup.string().nullable(),
  blood_group: Yup.string().nullable(),
  marital_status: Yup.string().required('Marital status is required'),
  current_address: Yup.string().nullable(),
  permanent_address: Yup.string().nullable(),
  adhar_card_link: Yup.string().url('Invalid Aadhar Card URL').nullable(),
  pan_card_link: Yup.string().url('Invalid PAN Card URL').nullable(),
  profile_logo: Yup.string().url('Invalid Logo URL'),
  user_name: Yup.string().required('User Name is required'),
  user_email_id: Yup.string()
    .email('Invalid Email')
    .required('User Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  emp_no: Yup.string().required('EMP Number is required'),
  joining_date: Yup.date().nullable(),
  factory_location: Yup.string().required('Factory Location is required'),
  timing_based_login: Yup.boolean().when('operator', operator => {
    return operator.includes('0')
      ? Yup.boolean().notRequired()
      : Yup.boolean().oneOf([true, false], 'Timing Based Login');
  }),
  login_time: Yup.string().when(
    ['operator', 'timing_based_login'],
    operator => {
      const includesValues = operator.includes('1') && operator.includes(true);
      return includesValues
        ? Yup.string()
            .required('Login time is required')
            .test('valid-login-time', 'Invalid login time', value => {
              const timeRegex =
                /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)\sto\s(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/;
              return timeRegex.test(value);
            })
        : Yup.string().notRequired();
    },
  ),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
  operator: Yup.string().oneOf(['1', '0'], 'Invalid option'), //1- yes. 0- no
  office_staff: Yup.string().oneOf(['1', '0'], 'Invalid option'),
  // operator_role: Yup.string().when('operator', operator => {
  //   return operator.includes('0')
  //     ? Yup.string().notRequired()
  //     : Yup.string().required('Operator is required');
  // }),

  // bag_machine: Yup.array().when('operator', operator => {
  //   return operator.includes('1')
  //     ? Yup.array().when('print_technology', print_technology => {
  //         return print_technology[0]?.length === 0
  //           ? Yup.array()
  //               .min(
  //                 1,
  //                 'Please select at least one print technology or machine type',
  //               )
  //               .required(
  //                 'Please select at least one print technology or machine type',
  //               )
  //           : Yup.array().notRequired();
  //       })
  //     : Yup.array().notRequired();
  // }),
  // print_technology: Yup.array().when('operator', operator => {
  //   return operator.includes('1')
  //     ? Yup.array().when('bag_machine', bag_machine => {
  //         return bag_machine[0]?.length === 0
  //           ? Yup.array().min(1, '').required('')
  //           : Yup.array().notRequired();
  //       })
  //     : Yup.array().notRequired();
  // }),

  machineType_printTechnology: Yup.array().when('office_staff', data => {
    return data.includes('0')
      ? Yup.array().min(
          1,
          'Please select atleast one Machine Type Or Print Technology',
        )
      : Yup.array().notRequired();
  }),

  login_allowed: Yup.boolean().notRequired(),

  // machine_type: Yup.array().when('office_staff', data => {
  //   return data.includes('0')
  //     ? Yup.array().min(
  //         1,
  //         'Please select atleast one Machine Type Or Print Technology',
  //       )
  //     : // .required('Register mobile no. is required')
  //       Yup.array().notRequired();
  // }),

  // login_allowed: Yup.boolean().when('office_staff', data => {
  //   return data.includes('0')
  //     ? Yup.boolean().oneOf([true], 'Please select login permission')
  //     : Yup.boolean().notRequired();
  // }),

  role: Yup.string().when('office_staff', office_staff => {
    return office_staff.includes('1')
      ? Yup.string().required('Staff role is required')
      : Yup.string().notRequired();
  }),
});

export const currentUserSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobile_no: Yup.string()
    .matches(/^\d{10}$/, 'Mobile Number must be a 10-digit number')
    .required('Mobile Number is required'),
  dob: Yup.date().nullable(),
  gender: Yup.string().nullable(),
  blood_group: Yup.string().nullable(),
  marital_status: Yup.string().required('Marital status is required'),
  current_address: Yup.string().nullable(),
  permanent_address: Yup.string().nullable(),
  adhar_card_link: Yup.string().url('Invalid Aadhar Card URL').nullable(),
  pan_card_link: Yup.string().url('Invalid PAN Card URL').nullable(),
  profile_logo: Yup.string().url('Invalid Logo URL'),
  user_name: Yup.string().required('User Name is required'),
  user_email_id: Yup.string()
    .email('Invalid Email')
    .required('User Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  emp_no: Yup.string().required('EMP Number is required'),
  joining_date: Yup.date().nullable(),
  factory_location: Yup.string().required('Factory Location is required'),
  timing_based_login: Yup.boolean().when('operator', operator => {
    return operator.includes('0')
      ? Yup.boolean().notRequired()
      : Yup.boolean().oneOf([true, false], 'Timing Based Login').required();
  }),
  login_time: Yup.string().when(
    ['operator', 'timing_based_login'],
    operator => {
      const includesValues = operator.includes('1') && operator.includes(true);
      return includesValues
        ? Yup.string()
            .required('Login time is required')
            .test('valid-login-time', 'Invalid login time', value => {
              const timeRegex =
                /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)\sto\s(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/;

              return timeRegex.test(value);
            })
        : Yup.string().notRequired();
    },
  ),
  is_active: Yup.boolean().oneOf([true], 'Invalid option'),
  bag_machine: Yup.array().when('operator', operator => {
    return operator.includes('1')
      ? Yup.array().when('print_technology', print_technology => {
          return print_technology[0]?.length === 0
            ? Yup.array()
                .min(
                  1,
                  'Please select at least one printing technology or machine type',
                )
                .required(
                  'Please select at least one printing technology or machine type',
                )
            : Yup.array().notRequired();
        })
      : Yup.array().notRequired();
  }),
  print_technology: Yup.array().when('operator', operator => {
    return operator.includes('1')
      ? Yup.array().when('bag_machine', bag_machine => {
          return bag_machine[0]?.length === 0
            ? Yup.array().min(1, '').required('')
            : Yup.array().notRequired();
        })
      : Yup.array().notRequired();
  }),
  role: Yup.string().when('office_staff', office_staff => {
    return office_staff.includes('1')
      ? Yup.string().required('Staff role is required')
      : Yup.string().notRequired();
  }),
});
