import React, { memo, useCallback } from 'react';
import { useFormik } from 'formik';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { changePassword } from 'Services/authService';
import { changePasswordSchema } from 'Schemas/AllSchemas';
import { setChangePassword } from 'Store/Reducers/Auth/auth.slice';

const ChangePasswordDialog = ({
  changePasswordModal,
  setChangePasswordModal,
}) => {
  const dispatch = useDispatch();

  const { changePasswordValues } = useSelector(({ auth }) => auth);

  const submitHandle = useCallback(
    async values => {
      let result;
      const payload = {
        ...values,
      };
      result = await dispatch(changePassword(payload));
      if (result) {
        dispatch(
          setChangePassword({
            new_password: '',
            password: '',
            old_password: '',
          }),
        );
        setChangePasswordModal(false);
      }
    },
    [dispatch],
  );

  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: changePasswordValues,
      validationSchema: changePasswordSchema,
      onSubmit: submitHandle,
    });

  return (
    <Dialog
      header="Change Password"
      visible={changePasswordModal}
      draggable={false}
      className="modal_Wrapper modal_small modal_no_padding"
      onHide={() => {
        setChangePasswordModal(false);
        dispatch(
          setChangePassword({
            new_password: '',
            password: '',
            old_password: '',
          }),
        );
      }}
    >
      <div className="stock_transfer_modal_wrapper">
        <div className="stock_transfer_top_wrap px-3">
          <div className="form_group mb-3">
            <label htmlFor="OldPassword">
              Old Password <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              type="password"
              placeholder="Old Password"
              name="old_password"
              value={values?.old_password || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.old_password && errors?.old_password && (
              <p className="text-danger">{errors?.old_password}</p>
            )}
          </div>

          <div className="form_group mb-3">
            <label htmlFor="NewPassword">
              New Password <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              type="password"
              placeholder="New Password"
              name="password"
              value={values?.password || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.password && errors?.password && (
              <p className="text-danger">{errors?.password}</p>
            )}
          </div>

          <div className="form_group mb-3">
            <label htmlFor="ConfirmPassword">
              Confirm Password <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              type="password"
              placeholder="Confirm Password*"
              name="new_password"
              value={values?.new_password || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.new_password && errors?.new_password && (
              <p className="text-danger">{errors?.new_password}</p>
            )}
          </div>
        </div>
      </div>

      <div className="button_group d-flex justify-content-end px-3">
        <Button
          className="btn_primary ms-3"
          onClick={() => handleSubmit(values)}
        >
          Change Password
        </Button>
      </div>
    </Dialog>
  );
};

export default memo(ChangePasswordDialog);
