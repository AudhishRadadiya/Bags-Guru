import { useCallback, useEffect } from 'react';
import Loader from 'Components/Common/Loader';
import { generalConfigurationSchema } from 'Schemas/AllSchemas';
import {
  getSingleListGC,
  updateGeneralConfiguration,
} from 'Services/Settings/generalConfigurationService';
import { setSingleListGC } from 'Store/Reducers/Settings/GeneralConfigurationSlice';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const generalConfigurationData = {
  mobile_rate_list_count: '',
  email_id: '',
  mobile_no: '',
  fb_link: '',
  ig_link: '',
  frieght_charge: '',
  pdf_public_key: '',
  pdf_secret_key: '',
};
export default function GeneralConfiguration({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_edit_access } = hasAccess;

  const { gCLoading, singleListGC } = useSelector(
    ({ generalConfiguration }) => generalConfiguration,
  );

  const submitHandle = useCallback(
    async values => {
      await dispatch(updateGeneralConfiguration(values));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(getSingleListGC());

    return () => {
      dispatch(setSingleListGC(generalConfigurationData));
    };
  }, [dispatch]);

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues: generalConfigurationData,
    validationSchema: generalConfigurationSchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    setValues({
      mobile_rate_list_count: singleListGC?.mobile_rate_list_count
        ? singleListGC?.mobile_rate_list_count
        : 0,
      email_id: singleListGC?.email_id ? singleListGC?.email_id : '',
      mobile_no: singleListGC?.mobile_no ? singleListGC?.mobile_no : '',
      fb_link: singleListGC?.fb_link ? singleListGC?.fb_link : '',
      ig_link: singleListGC?.ig_link ? singleListGC?.ig_link : '',
      frieght_charge: singleListGC?.frieght_charge
        ? singleListGC?.frieght_charge
        : 0,
      pdf_public_key: singleListGC?.pdf_public_key
        ? singleListGC?.pdf_public_key
        : '',
      pdf_secret_key: singleListGC?.pdf_secret_key
        ? singleListGC?.pdf_secret_key
        : '',
    });
  }, [setValues, singleListGC]);

  return (
    <div className="main_Wrapper">
      {gCLoading && <Loader />}
      <div className="party_detail_wrap p-3 h-100">
        <h3 className="mb-3">General Configuration</h3>
        <Row>
          <Col xxl={4} lg={6} md={8}>
            <div className="form_group mb-3 d-sm-flex align-items-center error_absolute_wrap">
              <label
                htmlFor="mobile_rate_list_count"
                className="white_space_nowrap m-0 me-3 mb-sm-0 mb-2"
              >
                Mobile App Rate List Count
              </label>
              <div className="error_absolute w-100">
                <InputText
                  id="MobileAppRateListCount"
                  placeholder="Mobile Rate List Count"
                  name="mobile_rate_list_count"
                  value={values?.mobile_rate_list_count || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched?.mobile_rate_list_count &&
                  errors?.mobile_rate_list_count && (
                    <p className="text-danger">
                      {errors?.mobile_rate_list_count}
                    </p>
                  )}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={3} md={4} sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="email_id">Email</label>
              <InputText
                id="Email"
                placeholder="Email"
                name="email_id"
                value={values?.email_id || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.email_id && errors?.email_id && (
                <p className="text-danger">{errors?.email_id}</p>
              )}
            </div>
          </Col>
          <Col lg={3} md={4} sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="mobile_no">Mobile No</label>
              <InputText
                id="MobileNo"
                placeholder="Mobile No"
                name="mobile_no"
                value={values?.mobile_no || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.mobile_no && errors?.mobile_no && (
                <p className="text-danger">{errors?.mobile_no}</p>
              )}
            </div>
          </Col>
          <Col lg={3} md={4} sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="fb_link">Facebook Link</label>
              <InputText
                id="FacebookLink"
                placeholder="Facebook Link"
                name="fb_link"
                value={values?.fb_link || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.fb_link && errors?.fb_link && (
                <p className="text-danger">{errors?.fb_link}</p>
              )}
            </div>
          </Col>
          <Col lg={3} md={4} sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="ig_link">Instagram Link</label>
              <InputText
                id="InstagramLink"
                placeholder="Instagram Link"
                name="ig_link"
                value={values?.ig_link || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.ig_link && errors?.ig_link && (
                <p className="text-danger">{errors?.ig_link}</p>
              )}
            </div>
          </Col>
          <Col lg={3} md={4} sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="frieght_charge">Local Freight Charge</label>
              <InputText
                id="LocalFreightCharge"
                placeholder="Local Freight Charge"
                name="frieght_charge"
                value={values?.frieght_charge || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.frieght_charge && errors?.frieght_charge && (
                <p className="text-danger">{errors?.frieght_charge}</p>
              )}
            </div>
          </Col>
          <Col lg={3} md={4} sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="pdf_public_key">PDF Public Key</label>
              <InputText
                id="PDGPublicKey"
                placeholder="PDG Public Key"
                name="pdf_public_key"
                value={values?.pdf_public_key || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.pdf_public_key && errors?.pdf_public_key && (
                <p className="text-danger">{errors?.pdf_public_key}</p>
              )}
            </div>
          </Col>
          <Col lg={3} md={4} sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="pdf_secret_key">PDF Secret Key</label>
              <InputText
                id="PDGSecretKey"
                placeholder="PDG Secret Key"
                name="pdf_secret_key"
                value={values?.pdf_secret_key || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.pdf_secret_key && errors?.pdf_secret_key && (
                <p className="text-danger">{errors?.pdf_secret_key}</p>
              )}
            </div>
          </Col>
        </Row>
        <div className="button_group d-flex justify-content-end">
          <div className="d-inline-block">
            <Button
              className="btn_primary"
              onClick={() => is_edit_access && handleSubmit()}
              disabled={is_edit_access ? false : true}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
