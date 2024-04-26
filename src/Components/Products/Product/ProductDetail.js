import { useCallback, useEffect, useMemo, useState } from 'react';
import { Panel } from 'primereact/panel';
import ToggleIcon from '../../../Assets/Images/toggle-bag-tag.svg';
import previewIcon from '../../../Assets/Images/eye.svg';
import { InputText } from 'primereact/inputtext';
import { Button, Col, Row } from 'react-bootstrap';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import CopyIcon from '../../../Assets/Images/copy.svg';
import { Tag } from 'primereact/tag';
import { InputTextarea } from 'primereact/inputtextarea';
import DropZone from 'Components/Common/DropZone';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  getActiveBackgroundDesignList,
  getActiveBagTypeCollectionList,
  getActiveBagTypeList,
  getActiveFabricColorList,
  getActiveFormList,
  getActiveHandleMaterialList,
  getActiveIndustryList,
  getActiveLaminationTypeList,
  getActiveMaterialList,
  getActivePatchCylinderList,
  getActivePrintTechnologyList,
  getActivePrintTypeList,
  getActiveVelcroList,
  getActiveWarehouseList,
  getCustomerPartyList,
  getDesignerList,
} from 'Services/Settings/MiscMasterService';
import {
  clearAddSelectedProductData,
  clearDuplicateSelectedProductData,
  clearSelectedBagTagData,
  clearSelectedProduct,
  clearUpdateSelectedProductData,
  clearViewSelectedProductData,
  setAddSelectedProductData,
  setDupicateSelectedProductData,
  setIsGetInitialValuesProduct,
  setSelectedBagTagData,
  setUpdateSelectedProductData,
  setViewSelectedProductData,
} from 'Store/Reducers/Products/ProductSlice';
import { useFormik } from 'formik';
import { addProductSchema } from 'Schemas/Products/addProductSchema';
import {
  createProduct,
  getProductItem,
  updateProduct,
} from 'Services/Products/ProductService';
import { useSelector } from 'react-redux';
import {
  getAllBagTagList,
  getFullBagTagList,
  getbagTagList,
} from 'Services/Products/BagService';
import { toast } from 'react-toastify';
import copy from 'copy-to-clipboard';
import Loader from 'Components/Common/Loader';
import { MultiSelect } from 'primereact/multiselect';
import { getExtensionFromName } from 'Helper/Common';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';

export const toastCongig = {
  position: toast.POSITION.TOP_CENTER,
  theme: 'light',
};

export default function ProductDetail({ initialValues }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product_id } = useParams();
  const { pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const [primaryUnit, setPrimaryUnit] = useState('Inch');
  const [shortlistedBagTags, setShortlistedBagTags] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const { bagTagList, fullbagTagList, allBagTagList } = useSelector(
    ({ bag }) => bag,
  );
  const { settingsCRUDLoading } = useSelector(({ settings }) => settings);
  const {
    productLoading,
    selectedProduct,
    productCRUDLoading,
    selectedBagTagData,

    addSelectedProductData,
    updateSelectedProductData,
    viewSelectedProductData,
    dupicateSelectedProductData,
    isGetInitialValuesProduct,
  } = useSelector(({ product }) => product);

  const {
    miscMasterLoading,
    activeMaterialList,
    activeFormList,
    activeBagTypeList,
    activeLaminationTypeList,
    activePrintTypeList,
    activeIndustryList,
    activePrintTechnologyList,
    designerList,
    activeHandleMaterialList,
    activeFabricColorList,
    activeBackgroundDesignList,
    customerPartyList,
    activePatchCylinderList,
    activeBagTypeCollectionList,
    activeVelcroList,
  } = useSelector(({ miscMaster }) => miscMaster);

  // const getDuplicateProduct = useCallback(
  //   async id => {
  //     await dispatch(getProductItem(id, true));
  //   },
  //   [dispatch],
  // );

  // useEffect(() => {
  //   if (locationPath?.length < 3) {
  //     dispatch(clearSelectedProduct());
  //     dispatch(clearSelectedBagTagData());
  //   }
  //   if (locationPath?.[1] === 'duplicate-product') {
  //     if (product_id) getDuplicateProduct(product_id);
  //   } else if (product_id) dispatch(getProductItem(product_id));
  //   return () => {
  //     dispatch(clearSelectedProduct());
  //     dispatch(clearSelectedBagTagData());
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [product_id]);

  const loadRequiredData = useCallback(() => {
    dispatch(getActiveMaterialList());
    dispatch(getActiveFormList());
    dispatch(getActiveBagTypeList());
    dispatch(getActiveBagTypeCollectionList());
    dispatch(getActiveLaminationTypeList());
    dispatch(getActivePrintTypeList());
    dispatch(getActiveWarehouseList());
    dispatch(getActiveIndustryList());
    dispatch(getActivePrintTechnologyList());
    dispatch(getDesignerList());
    dispatch(getActiveHandleMaterialList());
    dispatch(getActiveFabricColorList());
    dispatch(getActiveBackgroundDesignList());
    dispatch(getCustomerPartyList());
    dispatch(getActivePatchCylinderList());
    dispatch(getActiveVelcroList());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  const submitHandle = useCallback(
    async values => {
      let result;

      if (values?._id && !values?.is_duplicated) {
        const payload = {
          ...values,
          product_id: values?._id,
          new_cylinder_width:
            values?.design_name + '-' + values?.new_cylinder_width,
        };
        result = await dispatch(updateProduct(payload));

        if (result) {
          dispatch(
            setIsGetInitialValuesProduct({
              ...isGetInitialValuesProduct,
              update: false,
            }),
          );
          dispatch(clearUpdateSelectedProductData());
        }
      } else {
        const payload = {
          ...values,
          new_cylinder_width:
            values?.design_name + '-' + values?.new_cylinder_width,
        };

        result = await dispatch(createProduct(payload));

        if (result) {
          if (locationPath[1] === 'duplicate-product') {
            dispatch(
              setIsGetInitialValuesProduct({
                ...isGetInitialValuesProduct,
                duplicate: false,
              }),
            );
            dispatch(clearDuplicateSelectedProductData());
          } else {
            dispatch(
              setIsGetInitialValuesProduct({
                ...isGetInitialValuesProduct,
                add: false,
              }),
            );
            dispatch(clearAddSelectedProductData());
          }
        }
      }
      if (result) {
        dispatch(clearSelectedProduct());
        dispatch(clearSelectedBagTagData());
        navigate('/product');
      }
    },
    [dispatch, isGetInitialValuesProduct, locationPath, navigate],
  );

  const { handleBlur, errors, values, touched, handleSubmit, setFieldValue } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: addProductSchema,
      onSubmit: submitHandle,
    });

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (product_id) {
      if (locationPath[1] === 'update-product') {
        dispatch(
          setUpdateSelectedProductData({
            ...updateSelectedProductData,
            [fieldName]: fieldValue,
          }),
        );
      }
      // else if (locationPath[1] === 'product-details') {
      //   dispatch(
      //     setViewSelectedProductData({
      //       ...viewSelectedProductData,
      //       [fieldName]: fieldValue,
      //     }),
      //   );
      // }
      else {
        dispatch(
          setDupicateSelectedProductData({
            ...dupicateSelectedProductData,
            [fieldName]: fieldValue,
          }),
        );
      }
    } else {
      dispatch(
        setAddSelectedProductData({
          ...addSelectedProductData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleChangeFieldsdData = (fieldObject = {}) => {
    if (product_id) {
      if (locationPath[1] === 'update-product') {
        dispatch(
          setUpdateSelectedProductData({
            ...updateSelectedProductData,
            ...fieldObject,
          }),
        );
      }
      // else if (locationPath[1] === 'product-details') {
      //   dispatch(
      //     setViewSelectedProductData({
      //       ...viewSelectedProductData,
      //       ...fieldObject,
      //     }),
      //   );
      // }
      else {
        dispatch(
          setDupicateSelectedProductData({
            ...dupicateSelectedProductData,
            ...fieldObject,
          }),
        );
      }
    } else {
      dispatch(
        setAddSelectedProductData({
          ...addSelectedProductData,
          ...fieldObject,
        }),
      );
    }

    // setFieldValue(fieldName, fieldValue);
    Object.keys(fieldObject)?.forEach(keys => {
      setFieldValue(keys, fieldObject[keys]);
    });
  };

  useEffect(() => {
    dispatch(getbagTagList('', values?.selected_bag_tag_data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.selected_bag_tag_data]);

  const generateProductCode = useCallback(() => {
    const bag_tag_list =
      locationPath[1] === 'product-details' ? allBagTagList : fullbagTagList;

    const bag_tag =
      bag_tag_list?.find(x => x?._id === values?.bag_tag)?.bag_tag || '';

    const fbColor = activeFabricColorList?.find(
      x => x?._id === values?.fabric_color,
    );
    const fabric_color = fbColor?.name ? '-' + fbColor?.name : '';
    const design_name = values?.design_name ? '-' + values?.design_name : '';

    const string = `${bag_tag}${fabric_color}${design_name}`;

    if (string) {
      // setFieldValue('product_code', string);
      commonUpdateFieldValue('product_code', string);
    }
  }, [
    activeFabricColorList,
    fullbagTagList,
    values?.bag_tag,
    values?.design_name,
    values?.fabric_color,
    allBagTagList,
    locationPath,
  ]);

  useEffect(() => {
    if (values?.bag_tag || values?.design_name || values?.fabric_color) {
      generateProductCode();
    }
  }, [values?.bag_tag, values?.design_name, values?.fabric_color]);

  // const generateProductCode = (key, value) => {

  //   let bagTag = '';
  //   let fabricColor = '';
  //   let designName = '';

  //   if (key === 'bag_tag') {
  //     bagTag = fullbagTagList?.find(x => x?._id === value)?.bag_tag || '';
  //   } else if (key === 'fabric_color') {
  //     const fbColor = activeFabricColorList?.find(x => x?._id === value);
  //     fabricColor = fbColor?.name ? `-${fbColor?.name}` : '';
  //   } else if (key === 'design_name') {
  //     designName = value ? `-${value}` : '';
  //   }

  //   // const selectedBagTagId = values?.bag_tag;
  //   // const selectedFabricColorId = values?.fabric_color;
  //   // const designName = values?.design_name;

  //   // const bagTag =
  //   //   fullbagTagList?.find(x => x?._id === selectedBagTagId)?.bag_tag || '';

  //   // const fbColor = activeFabricColorList?.find(
  //   //   x => x?._id === selectedFabricColorId,
  //   // );
  //   // const fabricColor = fbColor?.name ? `-${fbColor?.name}` : '';
  //   // const designNamePart = designName ? `-${designName}` : '';

  //   const productCodeString = `${bagTag}${fabricColor}${designName}`;

  //   // let chanfeFieldObj = {
  //   //   ...filedValueObj,
  //   // };

  //   if (productCodeString) {
  //     // chanfeFieldObj = {
  //     //   ...chanfeFieldObj,
  //     //   product_code: productCodeString,
  //     // };
  //     commonUpdateFieldValue('product_code', productCodeString);
  //   }
  //   // handleChangeFieldsdData(chanfeFieldObj);
  // };
  // [
  //   activeFabricColorList,
  //   fullbagTagList,
  //   commonUpdateFieldValue,
  //   // handleChangeFieldsdData,
  //   values?.bag_tag,
  //   values?.design_name,
  //   values?.fabric_color,
  // ],

  // useEffect(() => {
  //   if (
  //     values?.selected_bag_tag_data?.material ||
  //     values?.selected_bag_tag_data?.form ||
  //     values?.selected_bag_tag_data?.bag_type ||
  //     values?.selected_bag_tag_data?.is_laminated ||
  //     values?.selected_bag_tag_data?.lamination_type?.length > 0 ||
  //     values?.selected_bag_tag_data?.print_type ||
  //     values?.selected_bag_tag_data?.print_technology?.length > 0 ||
  //     values?.selected_bag_tag_data?.width ||
  //     values?.selected_bag_tag_data?.height ||
  //     values?.selected_bag_tag_data?.gusset ||
  //     values?.selected_bag_tag_data?.gsm
  //   )
  //     // setIsFirstRender(false);
  //     commonUpdateFieldValue('is_first_render', false);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   values?.selected_bag_tag_data?.material,
  //   values?.selected_bag_tag_data?.form,
  //   values?.selected_bag_tag_data?.bag_type,
  //   values?.selected_bag_tag_data?.is_laminated,
  //   values?.selected_bag_tag_data?.lamination_type,
  //   values?.selected_bag_tag_data?.print_type,
  //   values?.selected_bag_tag_data?.print_technology,
  //   values?.selected_bag_tag_data?.width,
  //   values?.selected_bag_tag_data?.height,
  //   values?.selected_bag_tag_data?.gusset,
  //   values?.selected_bag_tag_data?.gsm,
  //   // values,
  // ]);

  useEffect(() => {
    if (values?.is_first_render === false) {
      // setShortlistedBagTags(bagTagList || [])
      commonUpdateFieldValue('short_listed_bag_tags', bagTagList || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.is_first_render, bagTagList]);

  useMemo(() => {
    if (values?.bag_tag) {
      const bagList =
        locationPath?.[1] === 'product-details'
          ? allBagTagList
          : fullbagTagList;
      const findObj = bagList.find(item => item?._id === values?.bag_tag);
      if (findObj?.label?.includes('DB') || findObj?.label?.includes('DUF')) {
        setFieldValue('handle_allow', true);
        return true;
      } else {
        setFieldValue('handle_allow', false);
        return false;
      }
    }
  }, [values?.bag_tag]);

  const template = useCallback(
    ({ togglerClassName, collapsed, onTogglerClick }) => {
      const toggleIconClass = collapsed ? 'toggle_down' : 'toggle_up';
      return (
        <>
          <label htmlFor="bagTag" className="mb-2 me-2 ">
            Bag Tag <span className="text-danger fs-4">*</span>
          </label>
          {values?.bag_tag ? (
            <Button
              className="btn_border px-2 py-1"
              onClick={() => navigate(`/bag-details/${values?.bag_tag}`)}
            >
              <img src={previewIcon} alt="preview" className="mx-0 my-0" />
            </Button>
          ) : null}
          {touched?.bag_tag && errors?.bag_tag && (
            <p className="text-danger">{errors?.bag_tag}</p>
          )}
          <div className="bag_tag_header mt-1">
            <div className="forn_group w-100 me-3">
              <ReactSelectSingle
                filter
                name="bag_tag"
                value={values?.bag_tag || ''}
                options={
                  locationPath?.[1] === 'product-details'
                    ? allBagTagList
                    : fullbagTagList
                }
                onChange={e => {
                  // setFieldValue('bag_tag', e.value);
                  // setFieldValue(
                  //   'bag_weight',
                  //   fullbagTagList?.find(x => x?._id === e.value)?.bag_weight,
                  // );

                  // generateProductCode('bag_tag', e.target.value);

                  const findBagTagObj = fullbagTagList?.find(
                    x => x?._id === e.target.value,
                  );
                  const changeFieldObj = {
                    bag_tag: e.target.value,
                    bag_weight: findBagTagObj?.bag_weight,
                  };
                  handleChangeFieldsdData(changeFieldObj);
                }}
                onBlur={handleBlur}
                placeholder="Select a Bag Tag"
                disabled={locationPath?.[1] === 'product-details'}
              />
            </div>
            <button className={togglerClassName} onClick={onTogglerClick}>
              <span className={toggleIconClass}>
                <img src={ToggleIcon} alt="" />
              </span>
            </button>
          </div>
        </>
      );
    },
    [
      values?.bag_tag,
      touched?.bag_tag,
      errors?.bag_tag,
      locationPath,
      allBagTagList,
      fullbagTagList,
      handleBlur,
      navigate,
    ],
  );

  const onCopyBagTag = useCallback(
    text => {
      if (!text || text === '') {
        if (!values?.bag_tag) {
          toast.error('Please select valid Bag Tag !', toastCongig);
        } else if (!values?.fabric_color)
          toast.error('Please select valid Fabric color !', toastCongig);
        else if (!values?.design_name)
          toast.error('Please enter valid Design name !', toastCongig);
        return;
      }
      const res = copy(text, {
        debug: false,
        message: 'Tap to copy',
      });
      // if (res) toast('Text copied to clipboard', toastCongig);
      // else toast.error('Failed to copy Text', toastCongig);
    },
    [values?.bag_tag, values?.design_name, values?.fabric_color],
  );

  // const onCustomChange = useCallback(
  //   (key, val) => {
  //     let data = { ...values?.selected_bag_tag_data };
  //     if (key === 'lamination_type' || key === 'print_technology') {
  //       const isIncludes = data[key]?.includes(val);
  //       if (isIncludes) {
  //         const index = data[key]?.findIndex(x => x === val);
  //         if (index !== -1) data[key].splice(index, 1);
  //       } else {
  //         data[key] = [...data[key], val];
  //       }
  //     } else {
  //       data[key] = val;
  //     }
  //     // dispatch(setSelectedBagTagData(data));
  //     commonUpdateFieldValue('selected_bag_tag_data', data);
  //   },
  //   [commonUpdateFieldValue, values?.selected_bag_tag_data],
  // );

  const onCustomChange = useCallback(
    (key, val) => {
      let data = { ...values?.selected_bag_tag_data };

      if (key === 'lamination_type' || key === 'print_technology') {
        data[key] = data[key] || [];

        const isIncludes = data[key]?.includes(val);
        if (isIncludes) {
          data[key] = data[key].filter(x => x !== val);
        } else {
          data[key] = [...data[key], val];
        }
      } else {
        data[key] = val;
      }

      let changeFieldObj = {
        selected_bag_tag_data: data,
      };

      if (!['gusset_mm', 'height_mm', 'width_mm'].includes(key)) {
        changeFieldObj = {
          ...changeFieldObj,
          is_first_render: false,
        };
      }

      handleChangeFieldsdData(changeFieldObj);
      // commonUpdateFieldValue('selected_bag_tag_data', data);
    },
    [values?.selected_bag_tag_data],
  );

  const onCancel = useCallback(() => {
    dispatch(clearSelectedProduct());
    dispatch(clearSelectedBagTagData());

    if (product_id) {
      if (locationPath[1] === 'update-product') {
        dispatch(
          setIsGetInitialValuesProduct({
            ...isGetInitialValuesProduct,
            update: false,
          }),
        );
        dispatch(clearUpdateSelectedProductData());
      }
      // else if (locationPath[1] === 'product-details') {
      //   dispatch(
      //     setIsGetInitialValuesProduct({
      //       ...isGetInitialValuesProduct,
      //       view: false,
      //     }),
      //   );
      //   dispatch(clearViewSelectedProductData());
      // }
      else {
        dispatch(
          setIsGetInitialValuesProduct({
            ...isGetInitialValuesProduct,
            duplicate: false,
          }),
        );
        dispatch(clearDuplicateSelectedProductData());
      }
    } else {
      dispatch(
        setIsGetInitialValuesProduct({
          ...isGetInitialValuesProduct,
          add: false,
        }),
      );
      dispatch(clearAddSelectedProductData());
    }
    // resetForm();
    navigate('/product');
  }, [dispatch, navigate, isGetInitialValuesProduct, locationPath, product_id]);

  const calculateBagWeight = useCallback(
    (fieldName, additionalWeight) => {
      const findBagTagObj = fullbagTagList?.find(
        x => x?._id === values?.bag_tag,
      );

      let fieldChangeValue = {
        additional_weight: additionalWeight,
      };

      if (additionalWeight) {
        const bagWeightData =
          Number(additionalWeight) + parseFloat(findBagTagObj?.bag_weight);
        // setFieldValue(
        //   'bag_weight',
        //   bagWeightData.toFixed(2).toString() + ' gm',
        // );

        // setFieldValue('additional_weight', e.target.value);
        // commonUpdateFieldValue('additional_weight', e.target.value);

        if (bagWeightData) {
          fieldChangeValue = {
            ...fieldChangeValue,
            bag_weight: bagWeightData.toFixed(2).toString() + ' gm',
          };

          // fixed issue :-
          // setFieldValue('additional_weight', additionalWeight);
          // setFieldValue(
          //   'bag_weight',
          //   bagWeightData.toFixed(2).toString() + ' gm',
          // );
          // dispatch(
          //   setAddSelectedProductData({
          //     ...addSelectedProductData,
          //     additional_weight: additionalWeight,
          //     bag_weight: bagWeightData.toFixed(2).toString() + ' gm',
          //   }),
          // );
          handleChangeFieldsdData(fieldChangeValue);
        }
      } else {
        fieldChangeValue = {
          ...fieldChangeValue,
          bag_weight: findBagTagObj?.bag_weight,
        };

        // setFieldValue(
        //   'bag_weight',
        //   fullbagTagList?.find(x => x?._id === values?.bag_tag)?.bag_weight,
        // );

        // fixed issue :-
        // setFieldValue('additional_weight', additionalWeight);
        // setFieldValue('bag_weight', findBagTagObj?.bag_weight);
        // dispatch(
        //   setAddSelectedProductData({
        //     ...addSelectedProductData,
        //     additional_weight: additionalWeight,
        //     bag_weight: findBagTagObj?.bag_weight,
        //   }),
        // );

        handleChangeFieldsdData(fieldChangeValue);

        // commonUpdateFieldValue('bag_weight', findBagTagObj?.bag_weight);
      }
    },
    [
      dispatch,
      // setFieldValue,
      fullbagTagList,
      addSelectedProductData,
      values?.bag_tag,
    ],
  );

  return (
    <>
      {(productLoading || miscMasterLoading || settingsCRUDLoading) && (
        <Loader />
      )}
      <div className="main_Wrapper">
        <div className="add_prodict_detail_wrap p-3 bg_white rounded-3 border mb-3">
          <h3 className="mb-3">Product Details</h3>
          <Panel
            headerTemplate={template}
            toggleable
            collapsed
            className="mb-3"
          >
            <div className="add_bag_top_wrap">
              <div className="max_50">
                <Row>
                  <Col md={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="Material">Material</label>
                      <ReactSelectSingle
                        filter
                        value={values?.selected_bag_tag_data?.material || ''}
                        options={activeMaterialList}
                        onChange={e =>
                          onCustomChange('material', e.target.value)
                        }
                        placeholder="Select Material"
                        disabled={locationPath?.[1] === 'product-details'}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="Form">Form</label>
                      <ReactSelectSingle
                        filter
                        value={values?.selected_bag_tag_data?.form || ''}
                        options={activeFormList}
                        onChange={e => onCustomChange('form', e.target.value)}
                        placeholder="Form"
                        disabled={locationPath?.[1] === 'product-details'}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="bag_type_wrapper product_bag mb-3">
                <h5 className="mb-3">Bag Type</h5>
                <div className="bag_type_overflow">
                  <ul>
                    {activeBagTypeList?.map((x, i) => {
                      return (
                        <li key={i}>
                          <div className="bag_type_box">
                            <div className="bag_img">
                              <img src={x?.image} alt="" />
                            </div>
                            <div className="bag_title_wrap">
                              <h5 className="m-0">{x?.name}</h5>
                              <div className="form_group checkbox_wrap">
                                <Checkbox
                                  inputId="boxBag"
                                  value={x?.value || ''}
                                  onChange={e =>
                                    onCustomChange('bag_type', e.target.value)
                                  }
                                  checked={
                                    values?.selected_bag_tag_data?.bag_type ===
                                    x?.value
                                  }
                                  disabled={
                                    locationPath?.[1] === 'product-details'
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="lamination_type_product">
                <Row className="g-3">
                  <Col xxl={4} lg={6}>
                    <div className="p-3 rounded-3 border bg-white h-100">
                      <div className="lamination_type mb-2">
                        <div className="d-flex flex-wrap gap-3 custom_radio_wrappper align-items-center mb-3">
                          <label>Lamination Type</label>
                          <div className="d-flex align-items-center">
                            <RadioButton
                              inputId="Laminated"
                              value={1}
                              onChange={e =>
                                onCustomChange('is_laminated', e.target.value)
                              }
                              checked={
                                values?.selected_bag_tag_data?.is_laminated ===
                                1
                              }
                              disabled={locationPath?.[1] === 'product-details'}
                            />
                            <label htmlFor="Laminated" className="ms-2">
                              Laminated
                            </label>
                          </div>
                          <div className="d-flex align-items-center ms-2">
                            <RadioButton
                              inputId="Nonlaminated"
                              value={0}
                              onChange={e =>
                                onCustomChange('is_laminated', e.target.value)
                              }
                              checked={
                                values?.selected_bag_tag_data?.is_laminated ===
                                0
                              }
                              disabled={locationPath?.[1] === 'product-details'}
                            />
                            <label htmlFor="Nonlaminated" className="ms-2">
                              Non laminated
                            </label>
                          </div>
                        </div>
                        <div className="custom_color_checkbox_wrapper">
                          <ul>
                            {activeLaminationTypeList?.map((x, i) => {
                              return (
                                <li key={i} className="pb-2">
                                  <div className="form_group">
                                    <input
                                      type="checkbox"
                                      id={x?.name}
                                      value={x?.value || ''}
                                      onChange={e =>
                                        onCustomChange(
                                          'lamination_type',
                                          e.target.value,
                                        )
                                      }
                                      checked={values?.selected_bag_tag_data?.lamination_type?.includes(
                                        x?._id,
                                      )}
                                      disabled={
                                        locationPath?.[1] ===
                                          'product-details' ||
                                        values?.selected_bag_tag_data
                                          ?.is_laminated === 0
                                      }
                                    />
                                    <label
                                      htmlFor={x?.name}
                                      className="check_1"
                                    >
                                      {x?.name} ({x?.code})
                                    </label>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="printing_type mb-2">
                        <h5 className="mb-3">Printing Type</h5>
                        <div className="custom_color_checkbox_wrapper">
                          <ul>
                            {activePrintTypeList?.map((x, i) => {
                              return (
                                <li key={i} className="pb-2">
                                  <div className="form_group">
                                    <input
                                      type="radio"
                                      id={x?.name}
                                      value={x?.value || ''}
                                      onChange={e =>
                                        onCustomChange(
                                          'print_type',
                                          e.target.value,
                                        )
                                      }
                                      checked={
                                        values?.selected_bag_tag_data
                                          ?.print_type === x?.value
                                      }
                                      disabled={
                                        locationPath?.[1] === 'product-details'
                                      }
                                    />
                                    <label htmlFor={x?.name}>
                                      {x?.name} ({x?.code})
                                    </label>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="printing_technology mb-3">
                        <h5 className="mb-3">Printing Technology</h5>
                        {touched?.print_technology &&
                          errors?.print_technology && (
                            <p className="text-danger">
                              {errors?.print_technology}
                            </p>
                          )}
                        <div className="custom_color_checkbox_wrapper">
                          <ul>
                            {activePrintTechnologyList?.map((x, i) => {
                              return (
                                <li key={i} className="pb-2">
                                  <div className="form_group">
                                    <input
                                      type="checkbox"
                                      id={x?.name}
                                      name={'print_technology'}
                                      value={x?.value || ''}
                                      onChange={e =>
                                        onCustomChange(
                                          'print_technology',
                                          e.target.value,
                                        )
                                      }
                                      checked={values?.print_technology?.includes(
                                        x?._id,
                                      )}
                                      disabled={
                                        locationPath?.[1] === 'product-details'
                                      }
                                    />
                                    <label
                                      htmlFor={x?.name}
                                      className="check_1"
                                    >
                                      {x?.name} ({x?.code})
                                    </label>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xxl={4} lg={6}>
                    <div className="p-3 rounded-3 border bg-white mb-2 h-100">
                      <h5 className="mb-3">Dimension</h5>
                      <div className="custom_radio_wrappper">
                        <div className="d-flex align-items-center mb-3">
                          <div className="d-flex align-items-center">
                            <label htmlFor="Inch" className="ms-2 ps-3">
                              Inch
                            </label>
                          </div>
                          <label className="ms-2 d-flex align-items-center">
                            <Row className="gx-2">
                              <Col md={4}>
                                <div className="form_group">
                                  <label htmlFor="width">Width (inches)</label>
                                  <InputText
                                    type="number"
                                    id="width"
                                    min={0}
                                    placeholder="Width"
                                    value={
                                      values?.selected_bag_tag_data?.width || ''
                                    }
                                    onChange={e =>
                                      onCustomChange(
                                        'width',
                                        e.target.value === ''
                                          ? ''
                                          : Number(e.target.value),
                                      )
                                    }
                                    disabled={
                                      locationPath?.[1] === 'product-details'
                                    }
                                  />
                                </div>
                              </Col>
                              <Col md={4}>
                                <div className="form_group">
                                  <label htmlFor="height">
                                    Height (inches)
                                  </label>
                                  <InputText
                                    min={0}
                                    placeholder="Height"
                                    type="number"
                                    id="height"
                                    value={
                                      values?.selected_bag_tag_data?.height ||
                                      ''
                                    }
                                    onChange={e =>
                                      onCustomChange(
                                        'height',
                                        e.target.value === ''
                                          ? ''
                                          : Number(e.target.value),
                                      )
                                    }
                                    disabled={
                                      locationPath?.[1] === 'product-details'
                                    }
                                  />
                                </div>
                              </Col>
                              <Col md={4}>
                                <div className="form_group">
                                  <label htmlFor="gusset">
                                    Gusset (inches)
                                  </label>
                                  <InputText
                                    placeholder="Gusset"
                                    type="number"
                                    min={0}
                                    id="gusset"
                                    name={'gusset'}
                                    value={
                                      values?.selected_bag_tag_data?.gusset ||
                                      ''
                                    }
                                    onChange={e =>
                                      onCustomChange(
                                        'gusset',
                                        e.target.value === ''
                                          ? ''
                                          : Number(e.target.value),
                                      )
                                    }
                                    disabled={
                                      locationPath?.[1] === 'product-details'
                                    }
                                  />
                                </div>
                              </Col>
                            </Row>
                          </label>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <RadioButton
                            inputId="mm"
                            // name="PrimaryUnit"
                            name="primary_unit"
                            value="mm"
                            onChange={e => {
                              // setPrimaryUnit(e.value)
                              commonUpdateFieldValue('primary_unit', e.value);
                            }}
                            checked={values?.primary_unit === 'mm'}
                          />
                          <label htmlFor="mm" className="ms-2">
                            mm
                          </label>
                          <label className="ms-2 d-flex align-items-center">
                            <Row className="gx-2">
                              <Col md={4}>
                                <div className="form_group">
                                  <label htmlFor="width_mm">Width (mm)</label>
                                  <InputText
                                    placeholder="Width"
                                    type="number"
                                    min={0}
                                    id="width_mm"
                                    value={
                                      values?.selected_bag_tag_data?.width_mm ||
                                      ''
                                    }
                                    onChange={e =>
                                      onCustomChange(
                                        'width_mm',
                                        e.target.value === ''
                                          ? ''
                                          : Number(e.target.value),
                                      )
                                    }
                                    disabled={
                                      locationPath?.[1] === 'product-details'
                                    }
                                  />
                                </div>
                              </Col>
                              <Col md={4}>
                                <div className="form_group">
                                  <label htmlFor="height_mm">Height (mm)</label>
                                  <InputText
                                    placeholder="Height"
                                    id="height_mm"
                                    min={0}
                                    type="number"
                                    name={'height_mm'}
                                    value={
                                      values?.selected_bag_tag_data
                                        ?.height_mm || ''
                                    }
                                    onChange={e =>
                                      onCustomChange(
                                        'height_mm',
                                        e.target.value === ''
                                          ? ''
                                          : Number(e.target.value),
                                      )
                                    }
                                    disabled={
                                      locationPath?.[1] === 'product-details'
                                    }
                                  />
                                </div>
                              </Col>
                              <Col md={4}>
                                <div className="form_group">
                                  <label htmlFor="gusset_mm">Gusset (mm)</label>
                                  <InputText
                                    placeholder="Gusset"
                                    id="gusset_mm"
                                    type="number"
                                    name={'gusset_mm'}
                                    value={
                                      values?.selected_bag_tag_data
                                        ?.gusset_mm || ''
                                    }
                                    onChange={e => {
                                      onCustomChange(
                                        'gusset_mm',
                                        e.target.value === ''
                                          ? ''
                                          : Number(e.target.value),
                                      );
                                    }}
                                    disabled={
                                      locationPath?.[1] === 'product-details'
                                    }
                                  />
                                </div>
                              </Col>
                            </Row>
                          </label>
                        </div>
                      </div>
                      <div className="max_50">
                        <div className="form_group">
                          <label htmlFor="GSM">GSM</label>
                          <InputText
                            placeholder="GSM"
                            id="GSM"
                            name={'gsm'}
                            min={0}
                            type="number"
                            value={values?.selected_bag_tag_data?.gsm || ''}
                            onChange={e =>
                              onCustomChange(
                                'gsm',
                                e.target.value === ''
                                  ? ''
                                  : Number(e.target.value),
                              )
                            }
                            disabled={locationPath?.[1] === 'product-details'}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xxl={4} lg={6}>
                    <div className="shortlisted_bag_tags_wrap bg_white border rounded-3 overflow-hidden h-100">
                      <h5 className="m-0 p-3">Shortlisted Bag Tags</h5>
                      <ul>
                        {values?.short_listed_bag_tags?.map((x, i) => {
                          return (
                            <li
                              key={i}
                              onClick={() => {
                                // if (locationPath?.[1] === 'product-details')
                                //   return false;
                                // else setFieldValue('bag_tag', x?._id);
                                // setFieldValue(
                                //   'bag_weight',
                                //   fullbagTagList?.find(y => y?._id === x?.value)
                                //     ?.bag_weight,
                                // );
                                if (locationPath?.[1] !== 'product-details') {
                                  const findObj = fullbagTagList?.find(
                                    y => y?._id === x?.value,
                                  );
                                  const changeFieldObj = {
                                    bag_tag: x?._id,
                                    bag_weight: findObj?.bag_weight,
                                  };
                                  handleChangeFieldsdData(changeFieldObj);
                                }
                              }}
                              style={{
                                backgroundColor:
                                  values?.bag_tag === x?._id
                                    ? '#ebe9ff'
                                    : 'white',
                              }}
                              className="cursor-pointer"
                            >
                              <p className="m-0">{x?.bag_tag}</p>
                              <div className="tag_wrapper bagLamTag">
                                {x?.lamination_type_name?.length > 0 ? (
                                  x?.lamination_type_name?.map((y, j) => {
                                    return (
                                      <Tag
                                        key={j}
                                        value={y}
                                        className={`p-tag-${2} bagLamTag me-1`}
                                      />
                                    );
                                  })
                                ) : (
                                  <Tag
                                    value={'NL'}
                                    className={`p-tag-2 bagLamTag me-1`}
                                  />
                                )}
                                {x?.print_technology_name?.length ? (
                                  x?.print_technology_name?.map((y, j) => {
                                    return (
                                      <Tag
                                        key={j}
                                        value={y}
                                        className={`p-tag-${2} bagLamTag me-1`}
                                      />
                                    );
                                  })
                                ) : (
                                  <Tag
                                    value={'NL'}
                                    className={`p-tag-2 bagLamTag me-1`}
                                  />
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Panel>
          <Row>
            <Col xl={3} md={4} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="FabricColor">
                  Fabric Color <span className="text-danger fs-4">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  value={values?.fabric_color || ''}
                  options={activeFabricColorList}
                  name="fabric_color"
                  onChange={e => {
                    // const changeFieldObj = {
                    //   fabric_color: e.target.value,
                    // };

                    // generateProductCode('fabric_color', e.target.value);
                    commonUpdateFieldValue('fabric_color', e.target.value);
                  }}
                  onBlur={handleBlur}
                  placeholder="Select Fabric Color"
                  disabled={locationPath?.[1] === 'product-details'}
                />
                {touched?.fabric_color && errors?.fabric_color && (
                  <p className="text-danger">{errors?.fabric_color}</p>
                )}
              </div>
            </Col>
            <Col xxl={3} xl={2} md={4} sm={6}>
              <div className="form_group mb-3">
                <label>
                  Design Name <span className="text-danger fs-4">*</span>
                </label>
                <InputText
                  placeholder="Design Name"
                  name="design_name"
                  value={values?.design_name || ''}
                  onChange={e => {
                    // const changeFieldObj = {
                    //   design_name: e.target.value,
                    // };
                    // generateProductCode('design_name', e.target.value);
                    commonUpdateFieldValue('design_name', e.target.value);
                  }}
                  onBlur={handleBlur}
                  disabled={locationPath?.[1] === 'product-details'}
                />
                {touched?.design_name && errors?.design_name && (
                  <p className="text-danger">{errors?.design_name}</p>
                )}
              </div>
            </Col>
            <Col xl={3} md={4} sm={6}>
              <div className="form_group mb-3">
                {/* <label htmlFor="BackgroundDesign">
                  Background Design <span className="text-danger fs-4">*</span>
                </label> */}
                <label htmlFor="BackgroundDesign">Background Design</label>
                <ReactSelectSingle
                  filter
                  disabled={locationPath?.[1] === 'product-details'}
                  name="background_design"
                  onChange={e => {
                    commonUpdateFieldValue('background_design', e.target.value);
                  }}
                  onBlur={handleBlur}
                  value={values?.background_design || ''}
                  options={activeBackgroundDesignList}
                  placeholder="Select Background Design"
                />
                {/* {touched?.background_design && errors?.background_design && (
                  <p className="text-danger">{errors?.background_design}</p>
                )} */}
              </div>
            </Col>

            <Col xxl={1} xl={2} md={4} sm={6}>
              <div className="form_group mb-3">
                <label>No. of Colors</label>
                <InputText
                  type="number"
                  placeholder="No. of Colors"
                  name="no_of_colors"
                  value={values?.no_of_colors || ''}
                  onChange={e => {
                    commonUpdateFieldValue('no_of_colors', e.target.value);
                  }}
                  onBlur={handleBlur}
                  disabled={locationPath?.[1] === 'product-details'}
                />
                {touched?.no_of_colors && errors?.no_of_colors && (
                  <p className="text-danger">{errors?.no_of_colors}</p>
                )}
              </div>
            </Col>
            <Col xl={2} md={4} sm={6}>
              <div className="form_group mb-3">
                {/* <label htmlFor="CustomerGroup">Customer Group</label> */}
                <label htmlFor="CustomerGroup">
                  Customer Group <span className="text-danger fs-4">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  disabled={locationPath?.[1] === 'product-details'}
                  name="customer_group"
                  onChange={e => {
                    commonUpdateFieldValue('customer_group', e.target.value);
                  }}
                  onBlur={handleBlur}
                  placeholder="Select Customer Group"
                  value={values?.customer_group || ''}
                  options={customerPartyList}
                />
                {touched?.customer_group && errors?.customer_group && (
                  <p className="text-danger">{errors?.customer_group}</p>
                )}
              </div>
            </Col>
          </Row>
          <div className="form_group copy_input mb-1 bag_tag_input">
            <label htmlFor="BagTag">Product Code</label>
            {touched?.product_code && errors?.product_code && (
              <p className="text-danger">{errors?.product_code}</p>
            )}
            <InputText
              name="product_code"
              value={values?.product_code || ''}
              onChange={e => {
                commonUpdateFieldValue('product_code', e.target.value);
              }}
              onBlur={handleBlur}
              id="BagTag"
              className="cursor-pointer"
              disabled={true}
            />
            <Button
              className="btn_transperant"
              onClick={() => onCopyBagTag(values?.product_code)}
            >
              <img src={CopyIcon} alt="" />
            </Button>
          </div>
        </div>
        <Row>
          <Col xxl={8}>
            <div className="p-3 bg_white rounded-3 border mb-3">
              <Row>
                <Col xxl={9}>
                  <Row>
                    <Col lg={3} md={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="DesignerName">
                          Designer Name{' '}
                          <span className="text-danger fs-4">*</span>
                        </label>
                        <ReactSelectSingle
                          filter
                          name="designer_name"
                          value={values?.designer_name || ''}
                          options={designerList}
                          disabled={locationPath?.[1] === 'product-details'}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'designer_name',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          placeholder="Select Designer Name"
                        />
                        {touched?.designer_name && errors?.designer_name && (
                          <p className="text-danger">{errors?.designer_name}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="HandelMaterial">
                          Handle Material{' '}
                          <span className="text-danger fs-4">
                            {values?.handle_allow === false ? '*' : ''}
                          </span>
                        </label>
                        <ReactSelectSingle
                          filter
                          name="handle_material"
                          value={values?.handle_material || ''}
                          options={activeHandleMaterialList}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'handle_material',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          placeholder="Select Handle Material"
                          disabled={locationPath?.[1] === 'product-details'}
                        />
                        {touched?.handle_material &&
                          errors?.handle_material && (
                            <p className="text-danger">
                              {errors?.handle_material}
                            </p>
                          )}
                      </div>
                    </Col>
                    <Col lg={3} md={4} sm={6}>
                      <div className="form_group mb-3">
                        <label>
                          Handle Length (inches){' '}
                          <span className="text-danger fs-4">
                            {values?.handle_allow === false ? '*' : ''}
                          </span>
                        </label>
                        <InputText
                          type="number"
                          placeholder="Handle Length (inches)"
                          name="handle_length"
                          value={values?.handle_length || ''}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'handle_length',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled={locationPath?.[1] === 'product-details'}
                        />
                        {touched?.handle_length && errors?.handle_length && (
                          <p className="text-danger">{errors?.handle_length}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={4} sm={6}>
                      <div className="form_group mb-3">
                        <label>
                          Handle Color{' '}
                          <span className="text-danger fs-4">
                            {values?.handle_allow === false ? '*' : ''}
                          </span>
                        </label>
                        <InputText
                          placeholder="Handle Color"
                          name="handle_color"
                          value={values?.handle_color || ''}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'handle_color',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled={locationPath?.[1] === 'product-details'}
                        />
                        {touched?.handle_color && errors?.handle_color && (
                          <p className="text-danger">{errors?.handle_color}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="Industry">
                          Industry <span className="text-danger fs-4">*</span>
                        </label>
                        <ReactSelectSingle
                          filter
                          id={'Industry'}
                          value={values?.industry || ''}
                          name={'industry'}
                          options={activeIndustryList}
                          onChange={e => {
                            commonUpdateFieldValue('industry', e.target.value);
                          }}
                          onBlur={handleBlur}
                          placeholder="Select Industry"
                          disabled={locationPath?.[1] === 'product-details'}
                        />
                        {touched?.industry && errors?.industry && (
                          <p className="text-danger">{errors?.industry}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={4} sm={6}>
                      <div className="form_group mb-3">
                        <label>
                          Ink Weight <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          type="number"
                          placeholder="Ink Weight"
                          name="ink_weight"
                          value={values?.ink_weight || ''}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'ink_weight',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled={locationPath?.[1] === 'product-details'}
                        />
                        {touched?.ink_weight && errors?.ink_weight && (
                          <p className="text-danger">{errors?.ink_weight}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={4} sm={6}>
                      <div className="form_group mb-3">
                        <label>Additional Weight</label>
                        <InputText
                          type="number"
                          placeholder="Additional Weight"
                          name="additional_weight"
                          value={values?.additional_weight || ''}
                          onChange={e => {
                            calculateBagWeight(
                              'additional_weight',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled={locationPath?.[1] === 'product-details'}
                        />
                      </div>
                    </Col>
                    <Col lg={3} md={4} sm={6}>
                      <div className="form_group mb-3">
                        <label>
                          Theoretical Bag Weight{' '}
                          <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          type="text"
                          name="bag_weight"
                          value={values?.bag_weight || ''}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'bag_weight',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled
                          placeholder="Bag Weight"
                        />
                        {touched?.bag_weight && errors?.bag_weight && (
                          <p className="text-danger">{errors?.bag_weight}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={4} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="insideBag">
                          Text to Print Inside Bag
                        </label>
                        <InputText
                          id="insideBag"
                          placeholder="Text to Print Inside Bag"
                          name="text_to_print"
                          value={values?.text_to_print || ''}
                          disabled={locationPath?.[1] === 'product-details'}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'text_to_print',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                        />
                      </div>
                    </Col>
                    {values?.bag_without_order === 1 && (
                      <Col lg={3} md={4} sm={6}>
                        <div className="form_group mb-3">
                          <label>
                            Product Rate{' '}
                            {values?.bag_without_order === 1 ? (
                              <span className="text-danger fs-4">*</span>
                            ) : null}
                          </label>
                          <InputText
                            name="bag_rate"
                            type="number"
                            value={values?.bag_rate || ''}
                            // onChange={handleChange}
                            onChange={e => {
                              commonUpdateFieldValue(
                                'bag_rate',
                                e.target.value,
                              );
                            }}
                            onBlur={handleBlur}
                            placeholder="Product Rate"
                            disabled={locationPath?.[1] === 'product-details'}
                          />
                          {touched?.bag_rate && errors?.bag_rate && (
                            <p className="text-danger">{errors?.bag_rate}</p>
                          )}
                        </div>
                      </Col>
                    )}
                    {values?.product_show_mobile === 1 && (
                      <Col lg={3} md={4} sm={6}>
                        <div className="form_group mb-3">
                          <label>
                            Display Name{' '}
                            {values?.product_show_mobile === 1 ? (
                              <span className="text-danger fs-4">*</span>
                            ) : null}
                          </label>
                          <InputText
                            name="display_name"
                            value={values?.display_name || ''}
                            // onChange={handleChange}
                            onChange={e => {
                              commonUpdateFieldValue(
                                'display_name',
                                e.target.value,
                              );
                            }}
                            onBlur={handleBlur}
                            placeholder="Display Name"
                            disabled={locationPath?.[1] === 'product-details'}
                          />
                          {touched?.display_name && errors?.display_name && (
                            <p className="text-danger">
                              {errors?.display_name}
                            </p>
                          )}
                        </div>
                      </Col>
                    )}
                    {values?.product_show_mobile === 1 && (
                      <Col lg={3} md={4} sm={6}>
                        <div className="form_group mb-3">
                          <label>
                            Show Collection{' '}
                            {values?.product_show_mobile === 1 ? (
                              <span className="text-danger fs-4">*</span>
                            ) : null}
                          </label>
                          <MultiSelect
                            filter
                            name="bag_type_collection_id"
                            value={values?.bag_type_collection_id || ''}
                            // onChange={handleChange}
                            onChange={e => {
                              commonUpdateFieldValue(
                                'bag_type_collection_id',
                                e.target.value,
                              );
                            }}
                            onBlur={handleBlur}
                            placeholder="Show Collection"
                            disabled={locationPath?.[1] === 'product-details'}
                            options={activeBagTypeCollectionList}
                            optionLabel="name"
                            className="w-100"
                          />
                          {touched?.bag_type_collection_id &&
                            errors?.bag_type_collection_id && (
                              <p className="text-danger">
                                {errors?.bag_type_collection_id}
                              </p>
                            )}
                        </div>
                      </Col>
                    )}
                    <Col lg={3} md={4} sm={6}>
                      <div className="form_group mb-3">
                        <label>
                          Velcro{' '}
                          {values?.product_show_mobile === 1 ? (
                            <span className="text-danger fs-4">*</span>
                          ) : null}
                        </label>

                        <ReactSelectSingle
                          filter
                          id="Velcro"
                          name="velcro"
                          options={activeVelcroList}
                          value={values?.velcro || ''}
                          // onChange={handleChange}
                          onChange={e => {
                            commonUpdateFieldValue('velcro', e.target.value);
                          }}
                          onBlur={handleBlur}
                          placeholder="Velcro"
                          disabled={locationPath?.[1] === 'product-details'}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xxl={3}>
                  <div className="form_group checkbox_wrap mb10">
                    <Checkbox
                      inputId="SubstratePrint-InHouse"
                      name="substrate_print"
                      value={values?.substrate_print || ''}
                      onChange={e => {
                        // setFieldValue(
                        //   'substrate_print',
                        //   e.target.checked ? 1 : 0,
                        // )
                        commonUpdateFieldValue(
                          'substrate_print',
                          e.target.checked ? 1 : 0,
                        );
                      }}
                      checked={values?.substrate_print === 1}
                      disabled={locationPath?.[1] === 'product-details'}
                    />
                    <label htmlFor="SubstratePrint-InHouse">
                      Substrate Print-In House
                    </label>{' '}
                    {touched?.substrate_print && errors?.substrate_print && (
                      <p className="text-danger">{errors?.substrate_print}</p>
                    )}
                  </div>
                  <div className="form_group checkbox_wrap mb10">
                    <Checkbox
                      inputId="BagStockedwithoutorder"
                      name="bag_without_order"
                      value={values?.bag_without_order || ''}
                      onChange={e =>
                        // setFieldValue(
                        //   'bag_without_order',
                        //   e.target.checked ? 1 : 0,
                        // )
                        commonUpdateFieldValue(
                          'bag_without_order',
                          e.target.checked ? 1 : 0,
                        )
                      }
                      checked={values?.bag_without_order === 1}
                      disabled={locationPath?.[1] === 'product-details'}
                    />
                    <label htmlFor="BagStockedwithoutorder">
                      Bag Stocked without order
                    </label>{' '}
                    {touched?.bag_without_order &&
                      errors?.bag_without_order && (
                        <p className="text-danger">
                          {errors?.bag_without_order}
                        </p>
                      )}
                  </div>
                  <div className="form_group checkbox_wrap mb10">
                    <Checkbox
                      inputId="NotificationtoPrint"
                      name="notification_to_print"
                      value={values?.notification_to_print || ''}
                      disabled={locationPath?.[1] === 'product-details'}
                      onChange={e =>
                        // setFieldValue(
                        //   'notification_to_print',
                        //   e.target.checked ? 1 : 0,
                        // )
                        commonUpdateFieldValue(
                          'notification_to_print',
                          e.target.checked ? 1 : 0,
                        )
                      }
                      checked={values?.notification_to_print === 1}
                    />
                    <label htmlFor="NotificationtoPrint">
                      Notification to Print
                    </label>
                  </div>
                  <div className="form_group checkbox_wrap mb10">
                    <Checkbox
                      inputId="NotificationtoPrint"
                      name="is_double_sided_tape"
                      value={values?.is_double_sided_tape || ''}
                      disabled={locationPath?.[1] === 'product-details'}
                      onChange={e =>
                        // setFieldValue(
                        //   'is_double_sided_tape',
                        //   e.target.checked ? 1 : 0,
                        // )
                        commonUpdateFieldValue(
                          'is_double_sided_tape',
                          e.target.checked ? 1 : 0,
                        )
                      }
                      checked={values?.is_double_sided_tape === 1}
                    />
                    <label htmlFor="NotificationtoPrint">
                      Is Double Sided Tape
                    </label>
                  </div>
                  <div className="form_group checkbox_wrap">
                    <Checkbox
                      inputId="ShowProductInMobileApp"
                      name="ShowProductInMobileApp"
                      value={values?.product_show_mobile || ''}
                      onChange={e =>
                        // setFieldValue(
                        //   'product_show_mobile',
                        //   e.target.checked ? 1 : 0,
                        // )
                        commonUpdateFieldValue(
                          'product_show_mobile',
                          e.target.checked ? 1 : 0,
                        )
                      }
                      checked={values?.product_show_mobile === 1}
                      disabled={locationPath?.[1] === 'product-details'}
                    />
                    <label htmlFor="ShowProductInMobileApp">
                      Show Product In Mobile App
                    </label>{' '}
                    {touched?.product_show_mobile &&
                      errors?.product_show_mobile && (
                        <p className="text-danger">
                          {errors?.product_show_mobile}
                        </p>
                      )}
                  </div>
                </Col>
              </Row>
            </div>
            <div className="p-3 bg_white rounded-3 border mb-3">
              <h5 className="mb-3">Packing Instruction</h5>
              <Row>
                <Col lg={8}>
                  <Row>
                    <Col md={5}>
                      <div className="d-flex flex-wrap gap-3 custom_radio_wrappper align-items-center mb-3">
                        <div className="d-flex align-items-center me-2">
                          <RadioButton
                            inputId="BalePacking"
                            name="bale_packing"
                            value={values?.bale_packing || ''}
                            onChange={e => {
                              // setFieldValue(
                              //   'bale_packing',
                              //   e.target.checked ? 1 : 0,
                              // );
                              // setFieldValue(
                              //   'carton_packing',
                              //   e.target.checked ? 0 : 1,
                              // );
                              const changeFieldObj = {
                                bale_packing: e.target.checked ? 1 : 0,
                                carton_packing: e.target.checked ? 0 : 1,
                              };
                              handleChangeFieldsdData(changeFieldObj);
                            }}
                            checked={values?.bale_packing === 1}
                            disabled={locationPath?.[1] === 'product-details'}
                          />
                          <label htmlFor="BalePacking" className="ms-2">
                            Bale Packing
                          </label>
                        </div>
                        <div className="d-flex align-items-center">
                          <RadioButton
                            inputId="CartonPacking"
                            name="carton_packing"
                            value={values?.carton_packing || ''}
                            onChange={e => {
                              // setFieldValue(
                              //   'carton_packing',
                              //   e.target.checked ? 1 : 0,
                              // );
                              // setFieldValue(
                              //   'bale_packing',
                              //   e.target.checked ? 0 : 1,
                              // );
                              const changeFieldObj = {
                                carton_packing: e.target.checked ? 1 : 0,
                                bale_packing: e.target.checked ? 0 : 1,
                              };
                              handleChangeFieldsdData(changeFieldObj);
                            }}
                            disabled={locationPath?.[1] === 'product-details'}
                            checked={values?.carton_packing === 1}
                          />
                          <label htmlFor="CartonPacking" className="ms-2">
                            Carton Packing
                          </label>
                        </div>
                      </div>
                    </Col>
                    <Col md={7}>
                      <Row>
                        <Col sm={4}>
                          <div className="form_group mb-3">
                            <label>Width</label>

                            <InputText
                              type="number"
                              id="width"
                              placeholder="width"
                              name={'width'}
                              value={values?.width || ''}
                              // onChange={handleChange}
                              onChange={e => {
                                commonUpdateFieldValue('width', e.target.value);
                              }}
                              onBlur={handleBlur}
                              disabled={locationPath?.[1] === 'product-details'}
                            />
                            {touched?.width && errors?.width && (
                              <p className="text-danger">{errors?.width}</p>
                            )}
                          </div>
                        </Col>
                        <Col sm={4}>
                          <div className="form_group mb-3">
                            <label>Length</label>
                            <InputText
                              type="number"
                              id="Length"
                              placeholder="Length"
                              name={'length'}
                              value={values?.length || ''}
                              // onChange={handleChange}
                              onChange={e => {
                                commonUpdateFieldValue(
                                  'length',
                                  e.target.value,
                                );
                              }}
                              onBlur={handleBlur}
                              disabled={locationPath?.[1] === 'product-details'}
                            />
                            {touched?.length && errors?.length && (
                              <p className="text-danger">{errors?.length}</p>
                            )}
                          </div>
                        </Col>
                        <Col sm={4}>
                          <div className="form_group mb-3">
                            <label>Height</label>
                            <InputText
                              id="height"
                              name="height"
                              type="number"
                              placeholder="Height"
                              value={values?.height || ''}
                              // onChange={handleChange}
                              onChange={e => {
                                commonUpdateFieldValue(
                                  'height',
                                  e.target.value,
                                );
                              }}
                              onBlur={handleBlur}
                              disabled={locationPath?.[1] === 'product-details'}
                            />
                            {touched?.height && errors?.height && (
                              <p className="text-danger">{errors?.height}</p>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col md={2} sm={3}>
                  <div className="form_group mb-3">
                    <label>Packing Rate</label>
                    <InputText
                      type="number"
                      id="packing_rate"
                      name="packing_rate"
                      placeholder="Packing Rate"
                      value={values?.packing_rate || ''}
                      // onChange={handleChange}
                      onChange={e => {
                        commonUpdateFieldValue('packing_rate', e.target.value);
                      }}
                      onBlur={handleBlur}
                      disabled={locationPath?.[1] === 'product-details'}
                    />
                    {touched?.packing_rate && errors?.packing_rate && (
                      <p className="text-danger">{errors?.packing_rate}</p>
                    )}
                  </div>
                </Col>
                <Col lg={2}>
                  <div className="form_group">
                    <label htmlFor="Comment">Comment</label>
                    <InputTextarea
                      placeholder="Write Comment"
                      rows={1}
                      name="comment"
                      value={values?.comment || ''}
                      // onChange={handleChange}
                      onChange={e => {
                        commonUpdateFieldValue('comment', e.target.value);
                      }}
                      onBlur={handleBlur}
                      disabled={locationPath?.[1] === 'product-details'}
                    />
                    {touched?.comment && errors?.comment && (
                      <p className="text-danger">{errors?.comment}</p>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xxl={4} className="mb-3">
            <div className="p-3 bg_white rounded-3 border h-100">
              <h5 className="mb-3">White Solid Patch</h5>
              <div className="custom_radio_wrappper mb-3">
                <Row className="g-2">
                  <Col xxl={6} md={6}>
                    <RadioButton
                      inputId="NoWhiteSolidPatchWidth"
                      name="no_white_patch_cylinder"
                      type="number"
                      value={values?.no_white_patch_cylinder || ''}
                      onChange={e => {
                        // setFieldValue(
                        //   'no_white_patch_cylinder',
                        //   e.target.checked ? 1 : 0,
                        // );
                        // setFieldValue(
                        //   'old_white_patch_cylinder',
                        //   e.target.checked ? 0 : 1,
                        // );
                        // setFieldValue(
                        //   'new_white_patch_cylinder',
                        //   e.target.checked ? 0 : 1,
                        // );
                        const changeFieldObj = {
                          no_white_patch_cylinder: e.target.checked ? 1 : 0,
                          old_white_patch_cylinder: e.target.checked ? 0 : 1,
                          new_white_patch_cylinder: e.target.checked ? 0 : 1,
                        };
                        handleChangeFieldsdData(changeFieldObj);
                      }}
                      onBlur={handleBlur}
                      checked={values?.no_white_patch_cylinder === 1}
                      disabled={locationPath?.[1] === 'product-details'}
                    />
                    <label htmlFor="NoWhiteSolidPatchWidth" className="ms-2">
                      No White Solid Patch Width
                    </label>
                  </Col>
                  <Col xxl={6} md={6}>
                    <div className="d-flex align-items-center mb-2">
                      <RadioButton
                        inputId="Whitesolidpatchcylinder"
                        name="old_white_patch_cylinder "
                        value={values?.old_white_patch_cylinder || ''}
                        onChange={e => {
                          // setFieldValue(
                          //   'old_white_patch_cylinder',
                          //   e.target.checked ? 1 : 0,
                          // );
                          // setFieldValue(
                          //   'no_white_patch_cylinder',
                          //   e.target.checked ? 0 : 1,
                          // );
                          // setFieldValue(
                          //   'new_white_patch_cylinder',
                          //   e.target.checked ? 0 : 1,
                          // );
                          const changeFieldObj = {
                            old_white_patch_cylinder: e.target.checked ? 1 : 0,
                            no_white_patch_cylinder: e.target.checked ? 0 : 1,
                            new_white_patch_cylinder: e.target.checked ? 0 : 1,
                          };
                          handleChangeFieldsdData(changeFieldObj);
                        }}
                        checked={values?.old_white_patch_cylinder === 1}
                        onBlur={handleBlur}
                        disabled={locationPath?.[1] === 'product-details'}
                      />
                      <label htmlFor="Whitesolidpatchcylinder" className="ms-2">
                        White solid patch cylinder
                      </label>
                    </div>
                    {touched?.solid_patch_cylinder &&
                      errors?.solid_patch_cylinder && (
                        <p className="text-danger">
                          {errors?.solid_patch_cylinder}
                        </p>
                      )}
                    <div className="form_group mb-3">
                      <ReactSelectSingle
                        filter
                        name="solid_patch_cylinder"
                        value={values?.solid_patch_cylinder || ''}
                        options={activePatchCylinderList}
                        // onChange={handleChange}
                        onChange={e => {
                          commonUpdateFieldValue(
                            'solid_patch_cylinder',
                            e.target.value,
                          );
                        }}
                        onBlur={handleBlur}
                        placeholder="White solid patch cylinder"
                        disabled={
                          locationPath?.[1] === 'product-details' ||
                          values?.old_white_patch_cylinder === 0
                        }
                      />
                    </div>
                  </Col>{' '}
                  <Col xxl={6} md={6}>
                    <div className="d-flex align-items-center mb-2">
                      <RadioButton
                        inputId="NewWhiteSolidPatchWidth"
                        name="new_white_patch_cylinder"
                        type="number"
                        value={values?.new_white_patch_cylinder || ''}
                        onChange={e => {
                          // setFieldValue(
                          //   'old_white_patch_cylinder',
                          //   e.target.checked ? 0 : 1,
                          // );
                          // setFieldValue(
                          //   'no_white_patch_cylinder',
                          //   e.target.checked ? 0 : 1,
                          // );
                          // setFieldValue(
                          //   'new_white_patch_cylinder',
                          //   e.target.checked ? 1 : 0,
                          // );
                          const changeFieldObj = {
                            old_white_patch_cylinder: e.target.checked ? 0 : 1,
                            no_white_patch_cylinder: e.target.checked ? 0 : 1,
                            new_white_patch_cylinder: e.target.checked ? 1 : 0,
                          };
                          handleChangeFieldsdData(changeFieldObj);
                        }}
                        checked={values?.new_white_patch_cylinder === 1}
                        onBlur={handleBlur}
                        disabled={locationPath?.[1] === 'product-details'}
                      />
                      <label htmlFor="NewWhiteSolidPatchWidth" className="ms-2">
                        New White Solid Patch
                      </label>
                    </div>
                    <div className="form_group mb-3">
                      <InputText
                        name="new_cylinder_width"
                        type="text"
                        value={`${values?.design_name || ''}-${
                          values?.new_cylinder_width || ''
                        }`}
                        onChange={e => {
                          // setFieldValue(
                          //   'new_cylinder_width',
                          //   e.target.value?.split(
                          //     values?.design_name + '-',
                          //   )?.[1],
                          // )
                          commonUpdateFieldValue(
                            'new_cylinder_width',
                            e.target.value?.split(
                              values?.design_name + '-',
                            )?.[1],
                          );
                        }}
                        onBlur={handleBlur}
                        placeholder="Cylinder Width"
                        disabled={
                          locationPath?.[1] === 'product-details' ||
                          values?.new_white_patch_cylinder === 0
                        }
                      />
                    </div>
                  </Col>
                  <Col xxl={12} md={6}>
                    <div className="form_group">
                      <label>
                        No. of new cylinders made (Other than white solid patch)
                      </label>
                      <InputText
                        type="number"
                        placeholder="No. of cylinder"
                        className="max_50 add_product_max_50"
                        name="no_of_cylinder"
                        value={values?.no_of_cylinder || ''}
                        // onChange={handleChange}
                        onChange={e => {
                          commonUpdateFieldValue(
                            'no_of_cylinder',
                            e.target.value,
                          );
                        }}
                        onBlur={handleBlur}
                        disabled={locationPath?.[1] === 'product-details'}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
        <div className="image_upload_Wrapper">
          <Row>
            <Col>
              <div className="form_group mb-3">
                <label htmlFor="MainImage">Main Image</label>
                {/* <DropZone
                  module="product"
                  value={values?.main_image || ''}
                  setFieldValue={setFieldValue}
                  fieldName={'main_image'}
                  disabled={locationPath?.[1] === 'product-details'}
                  fileName={`${
                    values?.product_code
                  }_main_image.${getExtensionFromName(values?.main_image)}`}
                /> */}
                {/* initialAddImgValue={addSelectedProductData}
                initialUpdateImgValue={updateSelectedProductData}
                initialDuplicateImgValue={dupicateSelectedProductData}
                setAddInitialImgValue={setAddSelectedProductData}
                setUpdateInitialImgValue={setUpdateSelectedProductData}
                setDupicateSelectedProductData={setDupicateSelectedProductData} */}

                <DropZone
                  module="product"
                  value={values?.main_image}
                  setFieldValue={setFieldValue}
                  // handleChangeFieldsdData={handleChangeFieldsdData}
                  // initialAddImgValue={addSelectedProductData}
                  // initialUpdateImgValue={updateSelectedProductData}
                  // initialDuplicateImgValue={dupicateSelectedProductData}
                  // setAddInitialImgValue={setAddSelectedProductData}
                  // setUpdateInitialImgValue={setUpdateSelectedProductData}
                  // setDuplicateInitialImgValue={setDupicateSelectedProductData}
                  // values={values}
                  fieldName="main_image"
                  fieldImgName="main_image_name"
                  fieldImgValue={values?.main_image_name}
                  fileName={`${
                    values?.product_code
                  }_main_image.${getExtensionFromName(values?.main_image)}`}
                  disabled={locationPath?.[1] === 'product-details'}
                />
                {touched?.main_image && errors?.main_image && (
                  <p className="text-danger">{errors?.main_image}</p>
                )}
              </div>
            </Col>
            <Col>
              <div className="form_group mb-3">
                <label htmlFor="RealLifeImage">Real Life Image </label>
                {/* <DropZone
                  module="product"
                  value={values?.real_image || ''}
                  setFieldValue={setFieldValue}
                  fieldName={'real_image'}
                  disabled={locationPath?.[1] === 'product-details'}
                  fileName={`${
                    values?.product_code
                  }_real_image.${getExtensionFromName(values?.real_image)}`}
                /> */}

                <DropZone
                  module="product"
                  value={values?.real_image}
                  setFieldValue={setFieldValue}
                  // handleChangeFieldsdData={handleChangeFieldsdData}
                  // initialAddImgValue={addSelectedProductData}
                  // initialUpdateImgValue={updateSelectedProductData}
                  // initialDuplicateImgValue={dupicateSelectedProductData}
                  // setAddInitialImgValue={setAddSelectedProductData}
                  // setUpdateInitialImgValue={setUpdateSelectedProductData}
                  // setDuplicateInitialImgValue={setDupicateSelectedProductData}
                  // values={values}
                  fieldName="real_image"
                  fieldImgName="real_image_name"
                  fieldImgValue={values?.real_image_name}
                  fileName={`${
                    values?.product_code
                  }_real_image.${getExtensionFromName(values?.real_image)}`}
                  disabled={locationPath?.[1] === 'product-details'}
                />

                {touched?.real_image && errors?.real_image && (
                  <p className="text-danger">{errors?.real_image}</p>
                )}
              </div>
            </Col>
            <Col>
              <div className="form_group mb-3">
                <label htmlFor="ForPO">For PO </label>
                {/* <DropZone
                  module="product"
                  value={values?.pro_image || ''}
                  setFieldValue={setFieldValue}
                  fieldName={'pro_image'}
                  disabled={locationPath?.[1] === 'product-details'}
                  fileName={`${
                    values?.product_code
                  }_pro_image.${getExtensionFromName(values?.pro_image)}`}
                /> */}

                <DropZone
                  module="product"
                  value={values?.pro_image}
                  setFieldValue={setFieldValue}
                  // handleChangeFieldsdData={handleChangeFieldsdData}
                  // initialAddImgValue={addSelectedProductData}
                  // initialUpdateImgValue={updateSelectedProductData}
                  // initialDuplicateImgValue={dupicateSelectedProductData}
                  // setAddInitialImgValue={setAddSelectedProductData}
                  // setUpdateInitialImgValue={setUpdateSelectedProductData}
                  // setDuplicateInitialImgValue={setDupicateSelectedProductData}
                  // values={values}
                  fieldName="pro_image"
                  fieldImgName="pro_image_name"
                  fieldImgValue={values?.pro_image_name}
                  fileName={`${
                    values?.product_code
                  }_pro_image.${getExtensionFromName(values?.pro_image)}`}
                  disabled={locationPath?.[1] === 'product-details'}
                />
              </div>
            </Col>
            <Col>
              <div className="form_group mb-3">
                <label htmlFor="RollDirection">Roll Direction </label>
                {/* <DropZone
                  module="product"
                  value={values?.roll_image || ''}
                  setFieldValue={setFieldValue}
                  fieldName={'roll_image'}
                  fileName={`${
                    values?.product_code
                  }_roll_images.${getExtensionFromName(values?.roll_image)}`}
                /> */}

                <DropZone
                  module="product"
                  value={values?.roll_image}
                  setFieldValue={setFieldValue}
                  // handleChangeFieldsdData={handleChangeFieldsdData}
                  // initialAddImgValue={addSelectedProductData}
                  // initialUpdateImgValue={updateSelectedProductData}
                  // initialDuplicateImgValue={dupicateSelectedProductData}
                  // setAddInitialImgValue={setAddSelectedProductData}
                  // setUpdateInitialImgValue={setUpdateSelectedProductData}
                  // setDuplicateInitialImgValue={setDupicateSelectedProductData}
                  // values={values}
                  fieldName="roll_image"
                  fieldImgName="roll_image_name"
                  fieldImgValue={values?.roll_image_name}
                  fileName={`${
                    values?.product_code
                  }_roll_images.${getExtensionFromName(values?.roll_image)}`}
                  disabled={locationPath?.[1] === 'product-details'}
                />
              </div>
            </Col>
            <Col>
              <div className="form_group mb-3">
                <label htmlFor="OldBagFromCustomer">
                  Old Bag From Customer{' '}
                </label>
                {/* <DropZone
                  module="product"
                  value={values?.old_bag_image || ''}
                  setFieldValue={setFieldValue}
                  fieldName={'old_bag_image'}
                  disabled={locationPath?.[1] === 'product-details'}
                  fileName={`${
                    values?.product_code
                  }_old_bag_image.${getExtensionFromName(
                    values?.old_bag_image,
                  )}`}
                /> */}

                <DropZone
                  module="product"
                  value={values?.old_bag_image}
                  setFieldValue={setFieldValue}
                  // handleChangeFieldsdData={handleChangeFieldsdData}
                  // initialAddImgValue={addSelectedProductData}
                  // initialUpdateImgValue={updateSelectedProductData}
                  // initialDuplicateImgValue={dupicateSelectedProductData}
                  // setAddInitialImgValue={setAddSelectedProductData}
                  // setUpdateInitialImgValue={setUpdateSelectedProductData}
                  // setDuplicateInitialImgValue={setDupicateSelectedProductData}
                  // values={values}
                  fieldName="old_bag_image"
                  fieldImgName="old_bag_image_name"
                  fieldImgValue={values?.old_bag_image_name}
                  fileName={`${
                    values?.product_code
                  }_old_bag_image.${getExtensionFromName(
                    values?.old_bag_image,
                  )}`}
                  disabled={locationPath?.[1] === 'product-details'}
                />
              </div>
            </Col>
            <Col>
              <div className="form_group mb-3">
                <label htmlFor="WaterMarked-Main">
                  Water Marked- Main (Auto-generated){' '}
                </label>
                {/* <DropZone
                  module="product"
                  value={values?.water_mark_main_image || ''}
                  setFieldValue={setFieldValue}
                  fieldName={'water_mark_main_image'}
                  disabled={true}
                  fileName={`${
                    values?.product_code
                  }_water_mark_main_image.${getExtensionFromName(
                    values?.water_mark_main_image,
                  )}`}
                /> */}

                <DropZone
                  module="product"
                  value={values?.water_mark_main_image}
                  setFieldValue={setFieldValue}
                  // handleChangeFieldsdData={handleChangeFieldsdData}
                  // initialAddImgValue={addSelectedProductData}
                  // initialUpdateImgValue={updateSelectedProductData}
                  // initialDuplicateImgValue={dupicateSelectedProductData}
                  // setAddInitialImgValue={setAddSelectedProductData}
                  // setUpdateInitialImgValue={setUpdateSelectedProductData}
                  // setDuplicateInitialImgValue={setDupicateSelectedProductData}
                  // values={values}
                  fieldName="water_mark_main_image"
                  fieldImgName="water_mark_main_image_name"
                  fieldImgValue={values?.water_mark_main_image_name}
                  fileName={`${
                    values?.product_code
                  }_water_mark_main_image.${getExtensionFromName(
                    values?.water_mark_main_image,
                  )}`}
                  disabled={locationPath?.[1] === 'product-details'}
                />

                {touched?.water_mark_main_image &&
                  errors?.water_mark_main_image && (
                    <p className="text-danger">
                      {errors?.water_mark_main_image}
                    </p>
                  )}
              </div>
            </Col>
            <Col>
              <div className="form_group mb-3">
                <label htmlFor="WaterMarkedRealLife">
                  Water Marked- Real Life (Auto-generated){' '}
                </label>
                {/* <DropZone
                  module="product"
                  value={values?.water_mark_real_image || ''}
                  setFieldValue={setFieldValue}
                  fieldName={'water_mark_real_image'}
                  disabled={true}
                  fileName={`${
                    values?.product_code
                  }_water_mark_real_image.${getExtensionFromName(
                    values?.water_mark_real_image,
                  )}`}
                /> */}

                <DropZone
                  module="product"
                  value={values?.water_mark_real_image}
                  setFieldValue={setFieldValue}
                  // handleChangeFieldsdData={handleChangeFieldsdData}
                  // initialAddImgValue={addSelectedProductData}
                  // initialUpdateImgValue={updateSelectedProductData}
                  // initialDuplicateImgValue={dupicateSelectedProductData}
                  // setAddInitialImgValue={setAddSelectedProductData}
                  // setUpdateInitialImgValue={setUpdateSelectedProductData}
                  // setDuplicateInitialImgValue={setDupicateSelectedProductData}
                  // values={values}
                  fieldName="water_mark_real_image"
                  fieldImgName="water_mark_real_image_name"
                  fieldImgValue={values?.water_mark_real_image_name}
                  fileName={`${
                    values?.product_code
                  }_water_mark_real_image.${getExtensionFromName(
                    values?.water_mark_real_image,
                  )}`}
                  disabled={locationPath?.[1] === 'product-details'}
                />

                {touched?.water_mark_real_image &&
                  errors?.water_mark_real_image && (
                    <p className="text-danger">
                      {errors?.water_mark_real_image}
                    </p>
                  )}
              </div>
            </Col>
            <Col>
              <div className="form_group mb-3">
                <label htmlFor="MainImage">
                  Main Image (Your Company Logo)
                </label>
                {/* <DropZone
                  module="product"
                  value={values?.main_your_company_logo_image || ''}
                  setFieldValue={setFieldValue}
                  fieldName={'main_your_company_logo_image'}
                  disabled={locationPath?.[1] === 'product-details'}
                  fileName={`${
                    values?.product_code
                  }_main_your_company_logo_image.${getExtensionFromName(
                    values?.main_your_company_logo_image,
                  )}`}
                /> */}

                <DropZone
                  module="product"
                  value={values?.main_your_company_logo_image}
                  setFieldValue={setFieldValue}
                  // handleChangeFieldsdData={handleChangeFieldsdData}
                  // initialAddImgValue={addSelectedProductData}
                  // initialUpdateImgValue={updateSelectedProductData}
                  // initialDuplicateImgValue={dupicateSelectedProductData}
                  // setAddInitialImgValue={setAddSelectedProductData}
                  // setUpdateInitialImgValue={setUpdateSelectedProductData}
                  // setDuplicateInitialImgValue={setDupicateSelectedProductData}
                  // values={values}
                  fieldName="main_your_company_logo_image"
                  fieldImgName="main_your_company_logo_name"
                  fieldImgValue={values?.main_your_company_logo_name}
                  fileName={`${
                    values?.product_code
                  }_main_your_company_logo_image.${getExtensionFromName(
                    values?.main_your_company_logo_image,
                  )}`}
                  disabled={locationPath?.[1] === 'product-details'}
                />

                {touched?.main_your_company_logo_image &&
                  errors?.main_your_company_logo_image && (
                    <p className="text-danger">
                      {errors?.main_your_company_logo_image}
                    </p>
                  )}
              </div>
            </Col>
          </Row>
        </div>
        <div className="button_group d-flex justify-content-end">
          <Button
            className="btn_border"
            onClick={onCancel}
            disabled={productCRUDLoading}
          >
            Cancel
          </Button>
          {locationPath?.[1] === 'product-details' ? null : (
            <Button className="btn_primary ms-3" onClick={handleSubmit}>
              {values?._id ? 'Update' : 'Save'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
