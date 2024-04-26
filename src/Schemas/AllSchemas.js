import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const changePasswordSchema = Yup.object().shape({
  // old_password: Yup.string()
  //   .matches(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //     'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  //   )
  //   .min(8, 'Old Password must be at least 8 characters')
  //   .required('Old Password is required'),

  old_password: Yup.string().required('Old Password is required'),
  password: Yup.string()
    .required('New Password is required')
    .min(8, 'New Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  new_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const forgetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export const setPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  newPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const addPartiesSchema = Yup.object().shape({
  party_type: Yup.string().required('Party Type is required'),
  party_name: Yup.string().required('Party Name is required'),
  // personal_email: Yup.string().email('Invalid Personal Email'),
  // personal_contact_no: Yup.string().matches(
  //   /^\d{10}$/,
  //   'Personal Contact Number must be a 10-digit number',
  // ),
  // website: Yup.string().url('Invalid Website URL'),
  pan_no: Yup.string().matches(
    /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
    'Invalid PAN Number',
  ),
  gst: Yup.string().matches(
    /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})?$/,
    'Invalid GST',
  ),
  // collection_person_whatsapp_no: Yup.string().matches(
  //   /^\d{10}$/,
  //   'Invalid WhatsApp Mobile Number',
  // ),
  // collection_person_other_mobile_no: Yup.string().matches(
  //   /^\d{10}$/,
  //   'Invalid Other Mobile Number',
  // ),
  gstin: Yup.string().matches(
    /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})?$/,
    'Invalid GSTIN',
  ),
  pincode: Yup.string().matches(/^\d{6}$/, 'Invalid PIN Code'),
  register_mobile_number: Yup.array().when('is_mobile_app_registered', data => {
    return data.includes(true)
      ? Yup.array()
          .min(1, 'Please enter minimum 1 number')
          .required('Register mobile no. is required')
      : Yup.array().notRequired();
  }),
});

export const addCompanySchema = Yup.object().shape({
  company_name: Yup.string().required('Company Name is required'),
  legal_name: Yup.string().required('Legal Name is required'),
  director_name: Yup.string().required('Director Name is required'),
  business_type: Yup.string().required('Business Type is required'),
  gst_no: Yup.string()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST Number',
    )
    .required('GST is required'),
  website: Yup.string()
    .url('Invalid Website URL')
    .required('Website is required'),
  mobile_no: Yup.string()
    .matches(/^\d{10}$/, 'Mobile Number must be a 10-digit number')
    .required('Mobile Number is required'),
  email_id: Yup.string().email('Invalid Email').required('Email is required'),
  pan_no: Yup.string()
    .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN Number')
    .required('PAN Number is required'),
  tan_no: Yup.string()
    .matches(/^[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}$/, 'Invalid TAN Number')
    .required('TAN Number is required'),
  company_logo: Yup.string()
    .url('Invalid Logo URL')
    .required('Company Logo is required'),
});

export const addCompanyAddressSchema = Yup.object().shape({
  location: Yup.string().required('Location is required'),
  address: Yup.string().required('Address is required'),
  address_type: Yup.string().required('Address Type is required'),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Invalid PIN Code')
    .required('Pincode is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
});

export const generalConfigurationSchema = Yup.object().shape({
  mobile_rate_list_count: Yup.string()
    .required('Mobile App Rate List Count is required')
    .matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      'not valid',
    ),
  email_id: Yup.string().email('Invalid  Email').required('Email is required'),
  mobile_no: Yup.string()
    .required('Mobile No is required')
    .matches(/^\d{10}$/, 'Mobile No must be a 10-digit number'),
  fb_link: Yup.string()
    .required('Facebook Link is required')
    .url('Invalid Facebook Link'),
  ig_link: Yup.string()
    .required('Instagram Link is required')
    .url('Invalid Instagram Link'),
  frieght_charge: Yup.string()
    .required('Local Freight Charge is required')
    .matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      'not valid',
    ),
  pdf_public_key: Yup.string().notRequired(),
  pdf_secret_key: Yup.string().notRequired(),
});
