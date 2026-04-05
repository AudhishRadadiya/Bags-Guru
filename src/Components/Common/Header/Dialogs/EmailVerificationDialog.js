import React, { memo, useCallback } from 'react';
import { useFormik } from 'formik';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { emailVerification, forgotPassword } from 'Services/authService';
import { getCurrentUserFromLocal } from 'Services/baseService';
import { toast } from 'react-toastify';

const initialValues = [...Array(4)].map(() => '');
const EmailVerificationDialog = ({
  emailVerificationDialog,
  setEmailVerificationDialog,
  setChangePasswordModal,
}) => {
  const inputRefs = [];
  const dispatch = useDispatch();
  const UserPreferencesData = getCurrentUserFromLocal();

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      const isValidFilled = Object.values(values).every(value => value);

      if (isValidFilled) {
        const res = await dispatch(
          emailVerification({
            email_id: UserPreferencesData?.email,
            otp: Object.values(values).join(''),
          }),
        );

        if (res) {
          resetForm();
          setChangePasswordModal(true);
          setEmailVerificationDialog(false);
        }
      } else {
        toast.error('Please fill all OTP fields');
      }
    },
    [
      dispatch,
      UserPreferencesData,
      setChangePasswordModal,
      setEmailVerificationDialog,
    ],
  );

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues,
    onSubmit: submitHandle,
  });

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    handleChange({ target: { value, name: index.toString() } });

    const nextIndex = index + 1;
    if (nextIndex < 4 && value !== '') {
      inputRefs[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && values[index] === '') {
      const previousIndex = index - 1;
      if (inputRefs[previousIndex]) {
        inputRefs[previousIndex]?.focus();
      }
    }
  };

  return (
    <Dialog
      header="Email Verification"
      visible={emailVerificationDialog}
      draggable={false}
      className="modal_Wrapper modal_small modal_no_padding"
      onHide={() => {
        setEmailVerificationDialog(false);
      }}
    >
      <div className="stock_transfer_modal_wrapper">
        <div className="stock_transfer_top_wrap d-flex flex-column align-items-center text-center px-3">
          <p>
            Enter the verification code provided by the Bags Guru admin team to
            continue.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form_group mb-5">
              <label className="mb-3 fw_500" htmlFor="email">
                Write Code
              </label>

              <div className="otp_wrapper">
                {[...Array(4)].map((_, index) => (
                  <InputText
                    key={index}
                    type="text"
                    maxLength={1}
                    value={values[index]}
                    onChange={event => handleInputChange(event, index)}
                    onKeyDown={event => handleKeyDown(event, index)}
                    ref={ref => (inputRefs[index] = ref)}
                    className="input_wrap"
                  />
                ))}
              </div>
            </div>
            <div className="submit_btn">
              <Button className="btn_primary w-100 mb-3" type="submit">
                Continue
              </Button>
            </div>
            <div className="resend_code">
              <p>
                Don’t receive the email?{' '}
                <span
                  onClick={() => {
                    dispatch(
                      forgotPassword({ email: UserPreferencesData?.email }),
                    );
                  }}
                >
                  Click to resend
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default memo(EmailVerificationDialog);
