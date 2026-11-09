import { forwardRef, memo, useImperativeHandle, useMemo, useRef } from 'react';
import { useFormik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { imageComparePromptSchema } from 'Schemas/Settings/MiscMasterSchema';

export const initialImageComparePrompt = {
  title: '',
  instructions: '',
  categories: '',
  provider: '',
  model_name: '',
};

export const getImageComparePromptInitialValues = (data = {}) => ({
  title: data?.title || '',
  instructions: data?.instructions || '',
  categories: data?.categories || '',
  provider: data?.provider || '',
  model_name: data?.model_name || '',
  ...(data?._id ? { _id: data._id } : {}),
});

const ImageComparePromptForm = forwardRef(
  (
    { initialValues = initialImageComparePrompt, availableProviders = [] },
    ref,
  ) => {
    const formik = useFormik({
      enableReinitialize: true,
      initialValues,
      validationSchema: imageComparePromptSchema,
      onSubmit: () => {},
    });

    const formikRef = useRef(formik);
    formikRef.current = formik;

    const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
      formik;

    const providerOptions = useMemo(
      () =>
        availableProviders.map(item => ({
          label: item?.name,
          value: item?.key,
        })),
      [availableProviders],
    );

    const modelOptions = useMemo(() => {
      const selectedProvider = availableProviders.find(
        item => item?.key === values?.provider,
      );

      return (
        selectedProvider?.models?.map(item => ({
          label: item?.name,
          value: item?.id,
        })) || []
      );
    }, [availableProviders, values?.provider]);

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        const { values, validateForm, setTouched } = formikRef.current;
        const errors = await validateForm();
        await setTouched(
          {
            title: true,
            instructions: true,
            categories: true,
            provider: true,
            model_name: true,
          },
          true,
        );

        if (Object.keys(errors).length) {
          return null;
        }

        return values;
      },
      resetForm: nextValues => formikRef.current.resetForm(nextValues),
      setFormValues: nextValues => formikRef.current.setValues(nextValues),
      getValues: () => formikRef.current.values,
    }));

    const onProviderChange = e => {
      handleChange(e);

      const selectedProvider = availableProviders.find(
        item => item?.key === e.value,
      );
      const hasSelectedModel = selectedProvider?.models?.some(
        item => item?.id === values?.model_name,
      );

      if (!hasSelectedModel) {
        setFieldValue('model_name', '');
      }
    };

    return (
      <>
        <div className="form_group mb-3">
          <label htmlFor="title">
            Title <span className="text-danger fs-4">*</span>
          </label>
          <InputText
            id="title"
            name="title"
            placeholder="Title"
            className="w-100"
            value={values?.title || ''}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {touched?.title && errors?.title && (
            <p className="text-danger">{errors?.title}</p>
          )}
        </div>

        <Row>
          <Col lg={6} md={6}>
            <div className="form_group mb-3">
              <label htmlFor="provider">
                Provider <span className="text-danger fs-4">*</span>
              </label>
              <ReactSelectSingle
                filter
                options={providerOptions}
                placeholder="Select Provider"
                name="provider"
                value={values?.provider}
                onBlur={handleBlur}
                onChange={onProviderChange}
              />
              {touched?.provider && errors?.provider && (
                <p className="text-danger">{errors?.provider}</p>
              )}
            </div>
          </Col>

          <Col lg={6} md={6}>
            <div className="form_group mb-3">
              <label htmlFor="model_name">
                Model <span className="text-danger fs-4">*</span>
              </label>
              <ReactSelectSingle
                filter
                options={modelOptions}
                placeholder="Select Model"
                name="model_name"
                value={values?.model_name}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={!values?.provider}
              />
              {touched?.model_name && errors?.model_name && (
                <p className="text-danger">{errors?.model_name}</p>
              )}
            </div>
          </Col>
        </Row>

        <div className="form_group mb-3">
          <label htmlFor="instructions">
            Prompt <span className="text-danger fs-4">*</span>
          </label>
          <InputTextarea
            id="instructions"
            name="instructions"
            placeholder="Enter Prompt"
            rows={6}
            autoResize
            className="w-100"
            value={values?.instructions || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched?.instructions && errors?.instructions && (
            <p className="text-danger">{errors?.instructions}</p>
          )}
        </div>

        <div className="form_group mb-3">
          <label htmlFor="categories">
            Categories <span className="text-danger fs-4">*</span>
          </label>
          <InputText
            id="categories"
            name="categories"
            placeholder="Enter Categories"
            className="w-100"
            value={values?.categories || ''}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {touched?.categories && errors?.categories && (
            <p className="text-danger">{errors?.categories}</p>
          )}
        </div>
      </>
    );
  },
);

ImageComparePromptForm.displayName = 'ImageComparePromptForm';

export default memo(ImageComparePromptForm);
