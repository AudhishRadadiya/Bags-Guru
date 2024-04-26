import * as Yup from 'yup';

export const addRolePermissionSchema = Yup.object().shape({
  name: Yup.string().required('Role Name is required'),
  comment: Yup.string().nullable(),
  is_active: Yup.boolean().oneOf([true, false], 'Invalid option'),
});
