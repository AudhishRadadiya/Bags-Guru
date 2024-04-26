import { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Loader from '../Common/Loader';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { emailVerification, forgotPassword } from 'Services/authService';
import { setAuthLoading } from 'Store/Reducers/Auth/auth.slice';

import Logo from '../../Assets/Images/logo.svg';
import LoginImg from '../../Assets/Images/login-img.png';
import moment from 'moment';

const inputRefs = [];
export default function EmailVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { email } = state || {};

  const { loading } = useSelector(({ auth }) => auth);

  const submitHandle = useCallback(
    async values => {
      const res = await dispatch(
        emailVerification({
          email_id: email,
          otp: Object.values(values).join(''),
        }),
      );
      if (res) navigate('/set-new-password', { state: { email: email } });
    },
    [dispatch, email, navigate],
  );

  const initialValues = [...Array(4)].map(() => '');

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues,
    onSubmit: submitHandle,
  });

  const handleKeyDown = useCallback(
    (event, index) => {
      if (event.key === 'Backspace' && values[index] === '') {
        const previousIndex = index - 1;
        if (inputRefs[previousIndex]) {
          inputRefs[previousIndex].focus();
        }
      }
    },
    [values],
  );

  const handleInputChange = useCallback(
    (event, index) => {
      const { value } = event.target;
      handleChange({ target: { value, name: index.toString() } });

      const nextIndex = index + 1;
      if (nextIndex < 4 && value !== '') {
        inputRefs[nextIndex].focus();
      }
    },
    [handleChange],
  );

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
                <h1>Email Verification</h1>
                <p>We sent a code to {email}</p>
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
                    <Button className="btn_primary w-100 mb-3">Continue</Button>
                  </div>
                  <div className="resend_code">
                    <p>
                      Don’t receive the email?{' '}
                      <span
                        onClick={() => {
                          dispatch(forgotPassword({ email: email }));
                        }}
                      >
                        Click to resend
                      </span>
                    </p>
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
