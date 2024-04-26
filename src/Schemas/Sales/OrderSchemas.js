import * as Yup from 'yup';

export const salesOrderSchema = Yup.object().shape({
  order_no: Yup.string().nullable(),
  party_name: Yup.string().required('Party Name is required'),
  order_date: Yup.date().required('Order Date is required'),
  due_date: Yup.date().nullable(),
  transporter: Yup.string().required('Transporter is required'),
  booking_station: Yup.string().nullable(),
  present_advisor_name: Yup.string().nullable(),
  original_advisor_name: Yup.string().nullable(),
  comment: Yup.string().nullable(),
  billing_address: Yup.array()
    .min(1, 'Please select at least one Billing Address')
    .nullable(),
  shipping_address: Yup.array()
    .min(1, 'Please select at least one Shipping Address')
    .nullable(),
  // attachment: Yup.string().url('Invalid attachment URL').nullable(),
  is_cc_attach: Yup.boolean()
    .oneOf([true, false, null], 'Invalid option')
    .nullable(),
  dispatch_after_payment: Yup.boolean()
    .oneOf([true, false, null], 'Invalid option')
    .nullable(),
  multiple_billing: Yup.boolean()
    .oneOf([true, false, null], 'Invalid option')
    .nullable(),
  dispatch_on_invoice: Yup.boolean()
    .oneOf([true, false, null], 'Invalid option')
    .nullable(),
});
