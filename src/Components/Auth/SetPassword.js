import React, { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Loader from '../Common/Loader';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { setPassword } from 'Services/authService';
import { setPasswordSchema } from 'Schemas/AllSchemas';
import { setAuthLoading } from 'Store/Reducers/Auth/auth.slice';

import Logo from '../../Assets/Images/logo.svg';
import LoginImg from '../../Assets/Images/login-img.png';
import moment from 'moment';

const setPasswordData = {
  password: '',
  newPassword: '',
};

export default function SetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { email } = state || {};
  const { loading } = useSelector(({ auth }) => auth);

  const submitHandle = useCallback(
    async values => {
      const res = await dispatch(
        setPassword({
          email: email,
          password: values.password,
          newPassword: values.newPassword,
        }),
      );
      if (res) navigate('/');
    },
    [dispatch, email, navigate],
  );

  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: setPasswordData,
      validationSchema: setPasswordSchema,
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
                <h1>Set New Password</h1>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form_group mb-3">
                    <label className="mb-3 fw_500" htmlFor="NewPassword">
                      New Password
                    </label>
                    <InputText
                      id="password"
                      placeholder="New Password"
                      type="password"
                      className="input_wrap"
                      name="password"
                      value={values?.password || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                    />
                    {touched?.password && errors?.password && (
                      <p className="text-danger">{errors?.password}</p>
                    )}
                  </div>
                  <div className="form_group mb-5">
                    <label className="mb-3 fw_500" htmlFor="ConfirmPassword">
                      Confirmed Password
                    </label>
                    <InputText
                      id="newPassword"
                      placeholder="Confirmed Password"
                      type="password"
                      className="input_wrap"
                      name="newPassword"
                      value={values?.newPassword || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                    />
                    {touched?.newPassword && errors?.newPassword && (
                      <p className="text-danger">{errors?.newPassword}</p>
                    )}
                  </div>
                  <div className="submit_btn">
                    <Button className="btn_primary w-100 mb-3">Reset</Button>
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
