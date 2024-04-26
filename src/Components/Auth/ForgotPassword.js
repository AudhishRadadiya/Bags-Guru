import React, { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../Common/Loader';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { forgotPassword } from 'Services/authService';
import { setAuthLoading } from 'Store/Reducers/Auth/auth.slice';
import { forgetPasswordSchema } from '../../Schemas/AllSchemas';

import Logo from '../../Assets/Images/logo.svg';
import LoginImg from '../../Assets/Images/login-img.png';
import moment from 'moment';

const forgetPasswordData = {
  email: '',
};
export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector(({ auth }) => auth);

  const submitHandle = useCallback(
    async values => {
      const res = await dispatch(forgotPassword(values));
      if (res)
        navigate('/email-verification', { state: { email: values.email } });
    },
    [dispatch, navigate],
  );

  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: forgetPasswordData,
      validationSchema: forgetPasswordSchema,
      onSubmit: submitHandle,
    });

  useEffect(() => {
    setTimeout(() => {
      dispatch(setAuthLoading(false));
    }, 2000);
  }, [dispatch]);

  return (
    <div className="login_wrapper">
      {loading ? (
        <Loader />
      ) : (
        <div className="login_box">
          <div className="login_img">
            <img src={LoginImg} alt="" />
          </div>
          <div className="login_form">
            <div className="d-flex flex-column h-100">
              <div className="login_form_inner mb-3">
                <div className="login_logo">
                  <img src={Logo} alt="" />
                </div>
                <h1>Forgot Password</h1>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form_group mb-5">
                    <label className="mb-3 fw_500" htmlFor="email">
                      Email Address
                    </label>
                    <InputText
                      id="email"
                      placeholder="Email Address"
                      type="email"
                      className="input_wrap"
                      name="email"
                      value={values?.email || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                    />
                    {touched?.email && errors?.email && (
                      <p className="text-danger">{errors?.email}</p>
                    )}
                  </div>
                  <div className="submit_btn">
                    <Button className="btn_primary w-100 mb-3">
                      Reset Password
                    </Button>
                    <Button
                      className="btn_border w-100"
                      onClick={() => navigate('/')}
                    >
                      Back
                    </Button>
                  </div>
                </form>
              </div>
              <div className="copyright text-center mt-auto">
                <p className="m-0">{`@Copyright ${moment().year()} bagsguru.in`}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
