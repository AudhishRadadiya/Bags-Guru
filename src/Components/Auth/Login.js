import { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import { Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { loginSchema } from '../../Schemas/AllSchemas';
import Logo from '../../Assets/Images/logo.svg';
import LoginImg from '../../Assets/Images/login-img.png';
import { login } from 'Services/authService';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { isOperator } from 'Components/Common/Header_new';
import Loader from 'Components/Common/Loader';
import moment from 'moment';

let loginData = {
  email: '',
  password: '',
  remember_me: false,
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector(({ auth }) => auth);

  const loadData = useCallback(() => {
    const user = Cookies.get('user');
    if (user) {
      const bytes = CryptoJS.AES.decrypt(user, 'UserSecrets');
      const decryptedData = JSON.parse(bytes?.toString(CryptoJS.enc.Utf8));
      if (decryptedData)
        loginData = {
          email: decryptedData?.email,
          password: decryptedData?.password,
          remember_me: decryptedData?.remember_me,
        };
    }
  }, []);

  useEffect(() => {
    // localStorage?.clear();
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandle = useCallback(
    async values => {
      const res = await dispatch(login(values));
      if (res) {
        if (res?.operator) {
          res?.flexo_print
            ? navigate('/order-operator')
            : navigate('/mfg-live-operator');
        } else if (res?.permission) {
          const findPermissionObj = res?.permission // find permission when allowing view permission to user data
            .map(x => x.sub_module.map(y => y))
            .flat()
            .find(k => k.permission.view === true);
          navigate(findPermissionObj?.path);
        } else {
          navigate('/parties');
        }
      }
    },
    [dispatch, navigate],
  );

  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: loginData,
      validationSchema: loginSchema,
      onSubmit: submitHandle,
    });

  return (
    <>
      {loading && <Loader />}
      <div className="login_wrapper">
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
                <h1>Sign In Your Account</h1>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form_group mb-3">
                    <label className="mb-3 fw_500" htmlFor="email">
                      Email Address
                    </label>
                    <InputText
                      id="email"
                      placeholder="Email Address"
                      type="email"
                      name="email"
                      className="input_wrap"
                      value={values?.email || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                    />
                    {touched?.email && errors?.email && (
                      <p className="text-danger">{errors?.email}</p>
                    )}
                  </div>
                  <div className="form_group mb-4">
                    <label className="mb-3 fw_500" htmlFor="Pass">
                      Password
                    </label>
                    <InputText
                      id="Pass"
                      placeholder="Password"
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
                  <Row className="align-items-center mb-3">
                    <Col xs={6}>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          value={values?.remember_me || false}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          checked={values?.remember_me}
                          required
                        />
                        <label htmlFor="Rememberme">Remember me?</label>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="forgot_wrap text-end">
                        <Link to="/forgot-password">Forgot Password?</Link>
                      </div>
                    </Col>
                  </Row>
                  <div className="submit_btn">
                    <Button
                      className="btn_primary w-100"
                      // loading={loading}
                      onClick={handleSubmit}
                    >
                      Login
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
      </div>
    </>
  );
}
