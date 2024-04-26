/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import BoxBag from '../../Assets/Images/box-bag.png';
import CopyIcon from '../../Assets/Images/copy.svg';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { addBagSchema } from 'Schemas/Products/addBagSchema';
import {
  getActiveBagCapacityList,
  getActiveBagTypeList,
  getActiveFormList,
  getActiveLaminationTypeList,
  getActiveMaterialList,
  getActivePrintTechnologyList,
  getActivePrintTypeList,
} from 'Services/Settings/MiscMasterService';
import Loader from 'Components/Common/Loader';
import { Button } from 'primereact/button';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { createBag, getBagItem } from 'Services/Products/BagService';
import {
  setIsGetInitialValuesForAddBag,
  setSelectedBagForAdd,
} from 'Store/Reducers/Products/BagsSlice';
import { toastCongig } from './AddProduct';
import {
  getBagWeightInGrams,
  getSelectedBagTypesRepeatLength,
  getSelectedBagTypesRollWidth,
  removeSpaceBetweenWords,
} from 'Helper/Common';

export const getBagSeverity = lamination => {
  switch (lamination) {
    case 'glossy':
      return 'glossy';
    case 'bopp':
      return 'bopp_laminated';
    case 'metalic':
      return 'metallic';
    case 'matt':
      return 'non_laminated';
    case 'glitter':
      return 'glitter';
    case 'pp coated':
      return 'pp_coated ';
    case 'glitter with metalic':
      return 'glitter_metallic';
    default:
      return 'primary';
  }
};

export default function Addbag() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bag_id } = useParams();
  const { pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const [suggestedRW, setSuggestedRW] = useState(0);
  const [suggestedRL, setSuggestedRL] = useState(0);
  const [suggestedRWInMM, setSuggestedRWInMM] = useState(0);
  const [suggestedRLInMM, setSuggestedRLInMM] = useState(0);

  const {
    bagLoading,
    bagCRUDLoading,
    selectedBagForAdd,
    selectedBagForView,
    isGetInitialValuesForAddBag,
  } = useSelector(({ bag }) => bag);
  const {
    miscMasterLoading,
    activeMaterialList,
    activeFormList,
    activeBagTypeList,
    activeLaminationTypeList,
    activePrintTypeList,
    activePrintTechnologyList,
    activeBagCapacityList,
  } = useSelector(({ miscMaster }) => miscMaster);
  const addBagInitialValues = {
    selected_bag_type_name: '',
    material: '',
    form: '',
    bag_type: '',
    bag_tag: '',
    is_laminated: 0,
    lamination_type: [],
    print_type: '',
    print_technology: [],
    is_mm: 0,
    width: '',
    height: '',
    gusset: '',
    roll_width: '', // 29"
    repeat_length: '', // 16"
    cylinder: '',
    width_mm: '',
    height_mm: '',
    gusset_mm: '',
    roll_width_mm: '', // 29"
    repeat_length_mm: '', // 16"
    cylinder_mm: '',
    handle_weight_auto: 0,
    handle_weight: '', // 25 gm
    handle_weight_actual_text: '',
    bag_capacity: '',
    bundle_size: '',
    gsm: '',
    wastage: '', // with 20%
    bag_weight: '', // 60 gm
    is_active: true,
  };
  const [initialValuesForAddBag, setInitialValuesForAddBag] = useState({});
  const loadRequiredData = useCallback(() => {
    dispatch(getActiveMaterialList());
    dispatch(getActiveFormList());
    dispatch(getActiveBagTypeList());
    dispatch(getActiveLaminationTypeList());
    dispatch(getActivePrintTypeList());
    dispatch(getActivePrintTechnologyList());
    dispatch(getActiveBagCapacityList());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  useEffect(() => {
    if (bag_id) dispatch(getBagItem(bag_id));
  }, [dispatch, bag_id]);

  useEffect(() => {
    if (!bag_id) {
      if (isGetInitialValuesForAddBag) {
        if (Object.keys(selectedBagForAdd)?.length > 0) {
          setInitialValuesForAddBag(selectedBagForAdd);
        } else {
          setInitialValuesForAddBag(addBagInitialValues);
        }
      } else {
        setInitialValuesForAddBag(addBagInitialValues);
        dispatch(setSelectedBagForAdd(addBagInitialValues));
        dispatch(setIsGetInitialValuesForAddBag(true));
      }
    }
  }, []);

  const submitHandle = useCallback(
    async values => {
      let result;
      const payload = {
        ...values,
        handle_weight:
          values?.handle_weight_auto === 1
            ? values?.handle_weight_actual_text
            : values?.handle_weight,
        is_active: values?.is_active ? 1 : 0,
      };
      result = await dispatch(createBag(payload));
      if (result) {
        navigate('/bags');
        setInitialValuesForAddBag(addBagInitialValues);
        dispatch(setSelectedBagForAdd({}));
        dispatch(setIsGetInitialValuesForAddBag(false));
      }
    },
    [dispatch, navigate],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    setValues,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesForAddBag,
    validationSchema: addBagSchema,
    onSubmit: submitHandle,
  });

  const commonUpdateFiledValue = useCallback(
    (fieldName, fieldValue) => {
      dispatch(
        setSelectedBagForAdd({
          ...selectedBagForAdd,
          [fieldName]: fieldValue,
        }),
      );
      handleChange(fieldName)(fieldValue);
    },
    [dispatch, handleChange, selectedBagForAdd],
  );
  const commonUpdateFiledSetValues = useCallback(
    (fieldName, fieldValue) => {
      dispatch(
        setSelectedBagForAdd({
          ...selectedBagForAdd,
          [fieldName]: fieldValue,
        }),
      );
      setFieldValue(fieldName, fieldValue);
    },
    [dispatch, setFieldValue, selectedBagForAdd],
  );

  const onCopyBagTag = useCallback(text => {
    const res = copy(text, {
      debug: false,
      message: 'Tap to copy',
    });
    // if (res) toast('Text copied to clipboard', toastCongig);
    // else toast.error('Failed to copy Text', toastCongig);
  }, []);

  useMemo(() => {
    if (!bag_id && Object.keys(initialValuesForAddBag)?.length > 0) {
      const material =
        activeMaterialList?.find(x => x?._id === values?.material)?.name || '';
      const formItem = activeFormList?.find(x => x?._id === values?.form);
      const form = formItem?.name ? `-${formItem?.name}` : '';
      const bagItem = activeBagTypeList?.find(x => x?._id === values?.bag_type);
      const bagType = bagItem?.code ? `-${bagItem?.code}` : '';
      const laminationType = values?.is_laminated ? '-LM' : '-NL';
      const printTypeItem = activePrintTypeList?.find(
        x => x?._id === values?.print_type,
      );
      const printType = printTypeItem?.code ? `-${printTypeItem?.code}` : '';

      const w = values?.width ? `W ${values?.width}` : '';
      const h = values?.height ? `x H ${values?.height}` : '';
      const g = values?.gusset > 0 ? `x G ${values?.gusset}` : '';
      const gsm = values?.gsm ? `(${values?.gsm} GSM)` : '';
      const size =
        values?.gsm && values?.gusset >= 0 && values?.height && values?.width
          ? `-${w} ${h} ${g} ${gsm}`
          : '';

      const string = `${material}${form}${bagType}${laminationType}${printType}${size}`;
      commonUpdateFiledSetValues('bag_tag', string);
    }
  }, [
    bag_id,
    activeBagTypeList,
    activeFormList,
    activeMaterialList,
    activePrintTypeList,
    values?.bag_type,
    values?.form,
    values?.gsm,
    values?.gusset,
    values?.height,
    values?.is_laminated,
    values?.material,
    values?.print_type,
    values?.width,
  ]);

  useMemo(() => {
    if (Object.keys(initialValuesForAddBag)?.length > 0) {
      const bagType =
        activeBagTypeList?.find(x => values?.bag_type === x?._id)?.name || '';
      const height = !!values?.height_mm
        ? values?.height_mm
        : Math.round(values?.height * 25.4);
      const width = !!values?.width_mm
        ? values?.width_mm
        : Math.round(values?.width * 25.4);
      const gusset = !!values?.gusset_mm
        ? values?.gusset_mm
        : Math.round(values?.gusset * 25.4);

      const rwMM = getSelectedBagTypesRollWidth(
        removeSpaceBetweenWords(bagType),
        'mm',
        height,
        gusset,
        width,
      );
      const rlMM = getSelectedBagTypesRepeatLength(
        removeSpaceBetweenWords(bagType),
        'mm',
        height,
        gusset,
        width,
      );
      setSuggestedRWInMM(rwMM);
      setSuggestedRLInMM(rlMM);

      const val = getSelectedBagTypesRollWidth(
        removeSpaceBetweenWords(bagType),
        'inch',
        values?.height,
        values?.gusset,
        values?.width,
      );
      const val2 = getSelectedBagTypesRepeatLength(
        removeSpaceBetweenWords(bagType),
        'inch',
        values?.height,
        values?.gusset,
        values?.width,
      );
      setSuggestedRW(val);
      setSuggestedRL(val2);
    }
  }, [
    activeBagTypeList,
    values?.bag_type,
    values?.gusset,
    values?.gusset_mm,
    values?.height,
    values?.height_mm,
    values?.width,
    values?.width_mm,
  ]);

  useMemo(() => {
    if (!bag_id && Object.keys(initialValuesForAddBag)?.length > 0) {
      const unit = values?.is_mm === 1 ? 'mm' : 'inch';
      const rw =
        values?.is_mm === 1
          ? !!values?.roll_width_mm
            ? values?.roll_width_mm
            : suggestedRWInMM
          : !!values?.roll_width
          ? values?.roll_width
          : suggestedRW;
      const rl =
        values?.is_mm === 1
          ? !!values?.repeat_length_mm
            ? values?.repeat_length_mm
            : suggestedRLInMM
          : !!values?.repeat_length
          ? values?.repeat_length
          : suggestedRL;

      const val = getBagWeightInGrams(
        unit,
        rw,
        rl,
        values?.gsm,
        values?.handle_weight_auto === 1
          ? values?.handle_weight_actual_text
          : values?.handle_weight?.match(/\d/g)?.join(''),
      );
      commonUpdateFiledSetValues(
        'bag_weight',
        `${val ? val?.toFixed(2) : 0} gm`,
      );
    }
  }, [
    bag_id,
    suggestedRL,
    suggestedRLInMM,
    suggestedRW,
    suggestedRWInMM,
    values?.gsm,
    values?.handle_weight,
    values?.handle_weight_auto,
    values?.handle_weight_actual_text,
    values?.is_mm,
    values?.repeat_length,
    values?.repeat_length_mm,
    values?.roll_width,
    values?.roll_width_mm,
  ]);

  useEffect(() => {
    if (bag_id) {
      setValues({
        selected_bag_type_name: selectedBagForView?.selected_bag_type_name
          ? selectedBagForView.selected_bag_type_name
          : '',
        material: selectedBagForView?.material
          ? selectedBagForView.material
          : '',
        form: selectedBagForView?.form ? selectedBagForView.form : '',
        bag_type: selectedBagForView?.bag_type
          ? selectedBagForView.bag_type
          : '',
        bag_tag: selectedBagForView?.bag_tag ? selectedBagForView.bag_tag : '',
        print_type: selectedBagForView?.print_type
          ? selectedBagForView.print_type
          : '',
        height: selectedBagForView?.height ? selectedBagForView.height : '',
        gusset: selectedBagForView?.gusset ? selectedBagForView.gusset : '',
        roll_width: selectedBagForView?.roll_width
          ? selectedBagForView.roll_width
          : '', // 29"
        repeat_length: selectedBagForView?.repeat_length
          ? selectedBagForView.repeat_length
          : '', // 16"
        cylinder: selectedBagForView?.cylinder
          ? selectedBagForView.cylinder
          : '',
        width_mm: selectedBagForView?.width_mm
          ? selectedBagForView.width_mm
          : '',
        height_mm: selectedBagForView?.height_mm
          ? selectedBagForView.height_mm
          : '',
        gusset_mm: selectedBagForView?.gusset_mm
          ? selectedBagForView.gusset_mm
          : '',
        roll_width_mm: selectedBagForView?.roll_width_mm
          ? selectedBagForView.roll_width_mm
          : '', // 29"
        repeat_length_mm: selectedBagForView?.repeat_length_mm
          ? selectedBagForView.repeat_length_mm
          : '', // 16"
        cylinder_mm: selectedBagForView?.cylinder_mm
          ? selectedBagForView.cylinder_mm
          : '',
        width: selectedBagForView?.width ? selectedBagForView.width : '',
        handle_weight: selectedBagForView?.handle_weight
          ? selectedBagForView.handle_weight
          : '', // 25 gm
        handle_weight_actual_text: selectedBagForView?.handle_weight_actual_text
          ? selectedBagForView.handle_weight_actual_text
          : '',
        bag_capacity: selectedBagForView?.bag_capacity
          ? selectedBagForView.bag_capacity
          : '',
        bundle_size: selectedBagForView?.bundle_size
          ? selectedBagForView.bundle_size
          : '',
        gsm: selectedBagForView?.gsm ? selectedBagForView.gsm : '',
        wastage: selectedBagForView?.wastage ? selectedBagForView.wastage : '', // with 20%
        bag_weight: selectedBagForView?.bag_weight
          ? selectedBagForView.bag_weight
          : '', // 60 gm
        is_active: selectedBagForView?.is_active
          ? selectedBagForView.is_active
          : false,
        lamination_type: selectedBagForView?.lamination_type
          ? selectedBagForView.lamination_type
          : [],
        print_technology: selectedBagForView?.print_technology
          ? selectedBagForView.print_technology
          : [],
        is_mm: selectedBagForView?.is_mm ? selectedBagForView.is_mm : 0,
        is_laminated: selectedBagForView?.is_laminated
          ? selectedBagForView.is_laminated
          : 0,
        handle_weight_auto: selectedBagForView?.handle_weight_auto
          ? selectedBagForView.handle_weight_auto
          : 0,
      });
      const bagType =
        activeBagTypeList?.find(x => selectedBagForView?.bag_type === x?._id)
          ?.name || '';
      const height = !!selectedBagForView?.height_mm
        ? selectedBagForView?.height_mm
        : Math.round(selectedBagForView?.height * 25.4);
      const width = !!selectedBagForView?.width_mm
        ? selectedBagForView?.width_mm
        : Math.round(selectedBagForView?.width * 25.4);
      const gusset = !!selectedBagForView?.gusset_mm
        ? selectedBagForView?.gusset_mm
        : Math.round(selectedBagForView?.gusset * 25.4);

      const rwMM = getSelectedBagTypesRollWidth(
        removeSpaceBetweenWords(bagType),
        'mm',
        height,
        gusset,
        width,
      );
      const rlMM = getSelectedBagTypesRepeatLength(
        removeSpaceBetweenWords(bagType),
        'mm',
        height,
        gusset,
        width,
      );
      setSuggestedRWInMM(rwMM);
      setSuggestedRLInMM(rlMM);

      const val = getSelectedBagTypesRollWidth(
        removeSpaceBetweenWords(bagType),
        'inch',
        selectedBagForView?.height,
        selectedBagForView?.gusset,
        selectedBagForView?.width,
      );
      const val2 = getSelectedBagTypesRepeatLength(
        removeSpaceBetweenWords(bagType),
        'inch',
        selectedBagForView?.height,
        selectedBagForView?.gusset,
        selectedBagForView?.width,
      );
      setSuggestedRW(val);
      setSuggestedRL(val2);

      // !selectedBagForView?.handle_weight &&
      //   commonUpdateFiledSetValues(
      //     'handle_weight',
      //     activeBagTypeList?.find(x => x?._id === selectedBagForView?.bag_type)
      //       ?.handle_weight,
      //   );
    } else if (isGetInitialValuesForAddBag) {
      setValues(selectedBagForAdd);
    }
  }, [bag_id, selectedBagForView]);

  const onCancel = useCallback(() => {
    resetForm();
    navigate('/bags');
    setInitialValuesForAddBag(addBagInitialValues);
    dispatch(setSelectedBagForAdd({}));
    dispatch(setIsGetInitialValuesForAddBag(false));
  }, [dispatch, navigate, resetForm]);

  return (
    <>
      {(miscMasterLoading || bagLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="add_bag_main_wrapper">
          <div className="add_bag_top_wrap">
            <div className="max_50">
              <Row>
                <Col md={5} xs={12}>
                  <div className="form_group mb-3">
                    <label htmlFor="Material">
                      Material <span className="text-danger fs-4">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      name="material"
                      value={values?.material || ''}
                      options={activeMaterialList}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFiledValue('material', e.value);
                      }}
                      placeholder="Select Material"
                      disabled={locationPath?.[1] === 'bag-details'}
                    />
                    {touched?.material &&
                      errors?.material &&
                      !values?.material && (
                        <p className="text-danger">{errors?.material}</p>
                      )}
                  </div>
                </Col>
                <Col md={5}>
                  <div className="form_group mb-3">
                    <label htmlFor="Form">
                      Form <span className="text-danger fs-4">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      name="form"
                      value={values?.form}
                      options={activeFormList}
                      onChange={e => {
                        commonUpdateFiledSetValues('form', e.target.value);
                      }}
                      onBlur={handleBlur}
                      placeholder="Select Form"
                      disabled={locationPath?.[1] === 'bag-details'}
                    />
                    {touched?.form && errors?.form && !values?.form && (
                      <p className="text-danger">{errors?.form}</p>
                    )}
                  </div>
                </Col>
                <Col md={2}>
                  <div className="form_group checkbox_wrap with_input mb-3">
                    <Checkbox
                      inputId="is_active"
                      name="is_active"
                      checked={values?.is_active}
                      onChange={e => {
                        commonUpdateFiledSetValues(
                          'is_active',
                          e.target.checked,
                        );
                      }}
                      disabled={locationPath?.[1] === 'bag-details'}
                    />
                    <label htmlFor="is_active">Active</label>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="bag_type_wrapper p-3 mb-3 rounded-3 border bg-white">
            <h5 className="mb-2">
              Bag Type <span className="text-danger fs-4">*</span>
            </h5>
            {touched?.bag_type && errors?.bag_type && (
              <p className="text-danger">{errors?.bag_type}</p>
            )}
            <div className="bag_type_overflow">
              <ul>
                {activeBagTypeList?.map((x, i) => {
                  return (
                    <li key={i}>
                      <div className="bag_type_box">
                        <div className="bag_img">
                          <img src={x?.image || BoxBag} alt="" loading="lazy" />
                        </div>
                        <div className="bag_title_wrap">
                          <h5 className="m-0">{x?.name}</h5>
                          <div className="form_group checkbox_wrap">
                            <Checkbox
                              inputId="boxBag"
                              name={x?.name}
                              value={x?.value || ''}
                              onChange={e => {
                                setFieldValue('bag_type', e.value);
                                setFieldValue(
                                  'handle_weight',
                                  activeBagTypeList?.find(
                                    x => x?._id === e.value,
                                  )?.handle_weight,
                                );
                                const bagType = activeBagTypeList?.find(
                                  x => x?._id === e.value,
                                );

                                if (bagType)
                                  setFieldValue(
                                    'selected_bag_type_name',
                                    removeSpaceBetweenWords(bagType?.name) ||
                                      '',
                                  );
                                bagType
                                  ? dispatch(
                                      setSelectedBagForAdd({
                                        ...selectedBagForAdd,
                                        bag_type: e.value,
                                        handle_weight: activeBagTypeList?.find(
                                          x => x?._id === e.value,
                                        )?.handle_weight,
                                      }),
                                    )
                                  : dispatch(
                                      setSelectedBagForAdd({
                                        ...selectedBagForAdd,
                                        bag_type: e.value,
                                        handle_weight: activeBagTypeList?.find(
                                          x => x?._id === e.value,
                                        )?.handle_weight,
                                        selected_bag_type_name:
                                          removeSpaceBetweenWords(
                                            bagType?.name,
                                          ) || '',
                                      }),
                                    );
                              }}
                              onBlur={handleBlur}
                              checked={values?.bag_type === x?.value}
                              disabled={locationPath?.[1] === 'bag-details'}
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
          <div className="bag_tag_bottom_wrapper">
            <ul>
              <li className="lamination_type">
                <div className="p-2 pb-0 mb-2 rounded-3 border bg-white">
                  <div className="d-flex flex-wrap gap-3 custom_radio_wrappper align-items-center mb-2">
                    <label>
                      Lamination Type{' '}
                      {values?.is_laminated === 1 ? (
                        <span className="text-danger fs-4">*</span>
                      ) : null}
                    </label>
                    <div className="d-flex">
                      <div className="d-flex align-items-center">
                        <RadioButton
                          inputId="Laminated"
                          name="is_laminated"
                          value={1}
                          onChange={e =>
                            commonUpdateFiledSetValues('is_laminated', e.value)
                          }
                          checked={values?.is_laminated === 1}
                          disabled={locationPath?.[1] === 'bag-details'}
                        />
                        <label htmlFor="Laminated" className="ms-2">
                          Laminated
                        </label>
                      </div>
                      <div className="d-flex align-items-center ms-2">
                        <RadioButton
                          inputId="Nonlaminated"
                          name="is_laminated"
                          value={0}
                          onChange={e => {
                            setFieldValue('is_laminated', e.value);
                            setFieldValue('lamination_type', []);
                            dispatch(
                              setSelectedBagForAdd({
                                ...selectedBagForAdd,
                                is_laminated: e.value,
                                lamination_type: [],
                              }),
                            );
                          }}
                          checked={values?.is_laminated === 0}
                          disabled={locationPath?.[1] === 'bag-details'}
                        />
                        <label htmlFor="Nonlaminated" className="ms-2">
                          Non laminated
                        </label>
                      </div>
                    </div>
                  </div>
                  {touched?.lamination_type && errors?.lamination_type && (
                    <p className="text-danger">{errors?.lamination_type}</p>
                  )}
                  <div className="custom_color_checkbox_wrapper">
                    <Row>
                      {activeLaminationTypeList?.map((x, i) => {
                        return (
                          <Col lg={4} md={6} key={i}>
                            <div className="form_group">
                              <input
                                type="checkbox"
                                id={x?.name}
                                name={'lamination_type'}
                                value={x?.value || ''}
                                onChange={e => {
                                  let isLaminationTypeValues =
                                    values?.lamination_type?.includes(
                                      e.target.value,
                                    );
                                  if (isLaminationTypeValues) {
                                    let newLaminationTypeValues =
                                      values?.lamination_type?.filter(
                                        item => item !== e.target.value,
                                      );
                                    commonUpdateFiledSetValues(
                                      'lamination_type',
                                      newLaminationTypeValues,
                                    );
                                  } else {
                                    let newLaminationTypeValues = [
                                      ...values?.lamination_type,
                                      e.target.value,
                                    ];
                                    commonUpdateFiledSetValues(
                                      'lamination_type',
                                      newLaminationTypeValues,
                                    );
                                  }
                                }}
                                checked={values?.lamination_type?.includes(
                                  x?._id,
                                )}
                                disabled={
                                  locationPath?.[1] === 'bag-details' ||
                                  values?.is_laminated === 0
                                }
                              />
                              <label
                                htmlFor={x?.name}
                                className={getBagSeverity(
                                  x?.name?.toLowerCase(),
                                )}
                              >
                                {x?.name} ({x?.code})
                              </label>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </div>
              </li>
              <li className="printing_type">
                <div className="p-2 pb-0 mb-2 rounded-3 border bg-white">
                  <h5 className="mb-2">
                    Printing Type <span className="text-danger fs-4">*</span>
                  </h5>
                  {touched?.print_type && errors?.print_type && (
                    <p className="text-danger">{errors?.print_type}</p>
                  )}
                  <div className="custom_color_checkbox_wrapper">
                    <Row>
                      {activePrintTypeList?.map((x, i) => {
                        return (
                          <Col lg={6} key={i}>
                            <div className="form_group">
                              <input
                                type="radio"
                                id={x?.name}
                                name="print_type"
                                value={x?.value || ''}
                                onChange={e =>
                                  commonUpdateFiledValue(
                                    'print_type',
                                    e.target.value,
                                  )
                                }
                                checked={values?.print_type === x?.value}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              <label htmlFor={x?.name}>
                                {x?.name} ({x?.code})
                              </label>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </div>
              </li>
              <li className="printing_technology">
                <div className="p-2 pb-0 mb-2 rounded-3 border bg-white">
                  <h5 className="mb-2">
                    Printing Technology{' '}
                    <span className="text-danger fs-4">*</span>
                  </h5>
                  {touched?.print_technology && errors?.print_technology && (
                    <p className="text-danger">{errors?.print_technology}</p>
                  )}
                  <div className="custom_color_checkbox_wrapper_p">
                    <Row>
                      {activePrintTechnologyList?.map((x, i) => {
                        return (
                          <Col sm={4} key={i}>
                            <div className="form_group">
                              <input
                                type="checkbox"
                                id={x?.name}
                                name={'print_technology'}
                                value={x?.value || ''}
                                onChange={e => {
                                  let isPrintTechnologyValues =
                                    values?.print_technology?.includes(
                                      e.target.value,
                                    );
                                  if (isPrintTechnologyValues) {
                                    let newPrintTechnologyValues =
                                      values?.print_technology?.filter(
                                        item => item !== e.target.value,
                                      );
                                    commonUpdateFiledSetValues(
                                      'print_technology',
                                      newPrintTechnologyValues,
                                    );
                                  } else {
                                    let newPrintTechnologyValues = [
                                      ...values?.print_technology,
                                      e.target.value,
                                    ];
                                    commonUpdateFiledSetValues(
                                      'print_technology',
                                      newPrintTechnologyValues,
                                    );
                                  }
                                }}
                                checked={values?.print_technology?.includes(
                                  x?._id,
                                )}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              <label htmlFor={x?.name}>
                                {x?.name} ({x?.code})
                              </label>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="diamension_Wrapper">
            <Row>
              <Col xl={6} className="dimention_custom_col">
                <div className="p-2 rounded-3 border bg-white h-100 mb-3">
                  <h5 className="mb-2">Dimension</h5>
                  <div className="custom_radio_wrappper">
                    <div className="d-flex align-items-center mb-2">
                      <p className="me-3"></p>
                      <label className="ms-2 d-flex align-items-center">
                        <h5 className="m-0 me-3">Inch</h5>
                        <Row className="gx-2">
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="width">
                                Width (inches){' '}
                                <span className="text-danger fs-4">*</span>
                              </label>
                              <InputText
                                type="number"
                                id="width"
                                placeholder="Width"
                                name={'width'}
                                value={values?.width || ''}
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'width',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                            </div>
                            {touched?.width && errors?.width && (
                              <p className="text-danger">{errors?.width}</p>
                            )}
                          </Col>
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="height">
                                Height (inches){' '}
                                <span className="text-danger fs-4">*</span>
                              </label>
                              <InputText
                                placeholder="Height"
                                type="number"
                                id="height"
                                name={'height'}
                                value={values?.height || ''}
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'height',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                            </div>
                            {touched?.height && errors?.height && (
                              <p className="text-danger">{errors?.height}</p>
                            )}
                          </Col>
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="gusset">
                                Gusset (inches){' '}
                                {(values?.selected_bag_type_name === 'boxbag' ||
                                  values?.selected_bag_type_name === 'cooler' ||
                                  values?.selected_bag_type_name ===
                                    'loophandlebagwithuf' ||
                                  values?.selected_bag_type_name ===
                                    'sidefold' ||
                                  values?.selected_bag_type_name ===
                                    'd-cutwithuf') && (
                                  <span className="text-danger fs-4">*</span>
                                )}
                              </label>
                              <InputText
                                placeholder="Gusset"
                                type="number"
                                id="gusset"
                                min={0}
                                name={'gusset'}
                                value={
                                  values?.gusset === 0
                                    ? 0
                                    : values?.gusset || ''
                                }
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'gusset',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                            </div>
                            {touched?.gusset && errors?.gusset && (
                              <p className="text-danger">{errors?.gusset}</p>
                            )}
                          </Col>
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="roll_width">
                                Roll Width{' '}
                                <span className="text-danger fs-4">*</span>
                              </label>
                              <InputText
                                placeholder="Width"
                                type="number"
                                id="roll_width"
                                name={'roll_width'}
                                value={values?.roll_width || ''}
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'roll_width',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              {touched?.roll_width && errors?.roll_width && (
                                <p className="text-danger">
                                  {errors?.roll_width}
                                </p>
                              )}
                              <small className="text_success mt-1 d-inline-block">
                                {`${suggestedRW ? suggestedRW : '0'}”`}
                              </small>
                            </div>
                          </Col>
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="repeat_length">
                                Repeat Length{' '}
                                <span className="text-danger fs-4">*</span>
                              </label>
                              <InputText
                                placeholder="Repeat Length"
                                id="repeat_length"
                                type="number"
                                name={'repeat_length'}
                                value={values?.repeat_length || ''}
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'repeat_length',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              {touched?.repeat_length &&
                                errors?.repeat_length && (
                                  <p className="text-danger">
                                    {errors?.repeat_length}
                                  </p>
                                )}
                              <small className="text_success mt-1 d-inline-block">
                                {`${suggestedRL}”`}
                              </small>
                            </div>
                          </Col>
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="cylinder">
                                Cylinder{' '}
                                <span className="text-danger fs-4">*</span>
                              </label>
                              <InputText
                                placeholder="Cylinder"
                                id="cylinder"
                                type="number"
                                name="cylinder"
                                value={values?.cylinder || ''}
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'cylinder',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              {touched?.cylinder && errors?.cylinder && (
                                <p className="text-danger">
                                  {errors?.cylinder}
                                </p>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="is_mm"
                        name="is_mm"
                        value={values?.is_mm || ''}
                        onChange={e =>
                          commonUpdateFiledSetValues(
                            'is_mm',
                            e.target.checked ? 1 : 0,
                          )
                        }
                        onBlur={handleBlur}
                        checked={values?.is_mm === 1}
                        disabled={locationPath?.[1] === 'bag-details'}
                      />
                      <label className="ms-2 d-flex align-items-center">
                        <h5 className="m-0 me-3" htmlFor={'is_mm'}>
                          mm{' '}
                        </h5>
                        <Row className="gx-2">
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="width_mm">
                                Width (mm){' '}
                                {values?.is_mm ? (
                                  <span className="text-danger fs-4">*</span>
                                ) : null}
                              </label>
                              <InputText
                                placeholder="Width"
                                type="number"
                                id="width_mm"
                                name={'width_mm'}
                                value={values?.width_mm || ''}
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'width_mm',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              {touched?.width_mm && errors?.width_mm && (
                                <p className="text-danger">
                                  {errors?.width_mm}
                                </p>
                              )}
                            </div>
                            <small className="text_success mt-1 d-inline-block">
                              {`${
                                values?.width
                                  ? Math.round(values?.width * 25.4)
                                  : 0
                              } mm`}
                            </small>
                          </Col>
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="height_mm">
                                Height (mm){' '}
                                {values?.is_mm ? (
                                  <span className="text-danger fs-4">*</span>
                                ) : null}
                              </label>
                              <InputText
                                placeholder="Height"
                                id="height_mm"
                                type="number"
                                name={'height_mm'}
                                value={values?.height_mm || ''}
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'height_mm',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              {touched?.height_mm && errors?.height_mm && (
                                <p className="text-danger">
                                  {errors?.height_mm}
                                </p>
                              )}
                            </div>
                            <small className="text_success mt-1 d-inline-block">
                              {`${
                                values?.height
                                  ? Math.round(values?.height * 25.4)
                                  : 0
                              } mm`}
                            </small>
                          </Col>
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="gusset_mm">
                                Gusset (mm){' '}
                                {(values?.selected_bag_type_name === 'boxbag' ||
                                  values?.selected_bag_type_name === 'cooler' ||
                                  values?.selected_bag_type_name ===
                                    'loophandlebagwithuf' ||
                                  values?.selected_bag_type_name ===
                                    'sidefold' ||
                                  values?.selected_bag_type_name ===
                                    'd-cutwithuf') &&
                                values?.is_mm ? (
                                  <span className="text-danger fs-4">*</span>
                                ) : null}
                              </label>
                              <InputText
                                placeholder="Gusset"
                                id="gusset_mm"
                                type="number"
                                min={0}
                                name={'gusset_mm'}
                                value={
                                  values?.gusset_mm === 0
                                    ? 0
                                    : values?.gusset_mm || ''
                                }
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'gusset_mm',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              {touched?.gusset_mm && errors?.gusset_mm && (
                                <p className="text-danger">
                                  {errors?.gusset_mm}
                                </p>
                              )}
                            </div>
                            <small className="text_success mt-1 d-inline-block">
                              {`${
                                values?.gusset
                                  ? Math.round(values?.gusset * 25.4)
                                  : 0
                              } mm`}
                            </small>
                          </Col>
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="roll_width_mm">
                                Roll Width{' '}
                                {values?.is_mm ? (
                                  <span className="text-danger fs-4">*</span>
                                ) : null}
                              </label>
                              <InputText
                                placeholder="Roll Width"
                                id="roll_width_mm"
                                type="number"
                                name={'roll_width_mm'}
                                value={values?.roll_width_mm || ''}
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'roll_width_mm',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              {touched?.roll_width_mm &&
                                errors?.roll_width_mm && (
                                  <p className="text-danger">
                                    {errors?.roll_width_mm}
                                  </p>
                                )}
                              <small className="text_success mt-1 d-inline-block">
                                {`${suggestedRWInMM} mm`}
                              </small>
                            </div>
                          </Col>
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="repeat_length_mm">
                                Repeat Length{' '}
                                {values?.is_mm ? (
                                  <span className="text-danger fs-4">*</span>
                                ) : null}
                              </label>
                              <InputText
                                placeholder="Repeat Length"
                                id="repeat_length_mm"
                                type="number"
                                name={'repeat_length_mm'}
                                value={values?.repeat_length_mm || ''}
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'repeat_length_mm',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              {touched?.repeat_length_mm &&
                                errors?.repeat_length_mm && (
                                  <p className="text-danger">
                                    {errors?.repeat_length_mm}
                                  </p>
                                )}
                              <small className="text_success mt-1 d-inline-block">
                                {`${suggestedRLInMM} mm`}
                              </small>
                            </div>
                          </Col>
                          <Col lg={2} sm={4}>
                            <div className="form_group mb-lg-0 mb-3">
                              <label htmlFor="cylinder_mm">
                                Cylinder{' '}
                                {values?.is_mm ? (
                                  <span className="text-danger fs-4">*</span>
                                ) : null}
                              </label>
                              <InputText
                                placeholder="Cylinder"
                                id="cylinder_mm"
                                name={'cylinder_mm'}
                                type="number"
                                value={values?.cylinder_mm || ''}
                                onChange={e => {
                                  commonUpdateFiledValue(
                                    'cylinder_mm',
                                    e.target.value,
                                  );
                                }}
                                onBlur={handleBlur}
                                disabled={locationPath?.[1] === 'bag-details'}
                              />
                              {touched?.cylinder_mm && errors?.cylinder_mm && (
                                <p className="text-danger">
                                  {errors?.cylinder_mm}
                                </p>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </label>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={2} className="handle_custom_col">
                <div className="p-2 rounded-3 border bg-white h-100 mb-3">
                  <h5 className="mb-2">Weight of Handle</h5>
                  <div className="custom_radio_wrappper">
                    <div className="d-flex align-items-center mb-3 ms-4">
                      <label className="ms-2">
                        <div className="form_group">
                          <label htmlFor="Weight (Auto)">Weight (Auto)</label>
                          <InputText
                            placeholder="Weight"
                            id="Weight (Auto)"
                            name={'handle_weight'}
                            value={values?.handle_weight || ''}
                            onChange={e => {
                              commonUpdateFiledValue(
                                'handle_weight',
                                e.target.value,
                              );
                            }}
                            disabled
                            onBlur={handleBlur}
                          />
                          {touched?.handle_weight && errors?.handle_weight && (
                            <p className="text-danger">
                              {errors?.handle_weight}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="Length"
                        name="handle_weight_auto"
                        className="mt-4"
                        value={values?.handle_weight_auto}
                        disabled={locationPath?.[1] === 'bag-details'}
                        onChange={e => {
                          setFieldValue(
                            'handle_weight_auto',
                            e.checked ? 1 : 0,
                          );
                          setFieldValue(
                            'handle_weight_actual_text',
                            e.checked ? values?.handle_weight_actual_text : '',
                          );
                          setFieldValue(
                            'handle_weight',
                            !e.checked
                              ? activeBagTypeList?.find(
                                  x => x?._id === values?.bag_type,
                                )?.handle_weight
                              : '',
                          );
                          dispatch(
                            setSelectedBagForAdd({
                              ...selectedBagForAdd,
                              handle_weight_auto: e.checked ? 1 : 0,
                              handle_weight_actual_text: e.checked
                                ? values?.handle_weight_actual_text
                                : '',
                              handle_weight: activeBagTypeList?.find(
                                x => x?._id === values?.bag_type,
                              )?.handle_weight,
                            }),
                          );
                        }}
                        onBlur={handleBlur}
                        checked={values?.handle_weight_auto === 1}
                      />
                      <label className="ms-2">
                        <div className="form_group">
                          <label htmlFor="(Actual)">Weight (Actual)</label>
                          <InputText
                            placeholder="Weight"
                            id="(Actual)"
                            type="number"
                            name={'handle_weight_actual_text'}
                            value={values?.handle_weight_actual_text || ''}
                            onChange={e => {
                              commonUpdateFiledValue(
                                'handle_weight_actual_text',
                                e.target.value,
                              );
                            }}
                            disabled={
                              locationPath?.[1] === 'bag-details' ||
                              values?.handle_weight_auto === 0
                            }
                            onBlur={handleBlur}
                          />
                          {touched?.handle_weight_actual_text &&
                            errors?.handle_weight_actual_text && (
                              <p className="text-danger">
                                {errors?.handle_weight_actual_text}
                              </p>
                            )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} className="capicity_custom_col">
                <div className="capacity_Wrapper mb-3 p-2 rounded-3 border bg-white h-100">
                  <Row>
                    <Col sm={8}>
                      <div className="form_group mb-3">
                        <label htmlFor="Capacity">Capacity</label>
                        <ReactSelectSingle
                          filter
                          name="bag_capacity"
                          type="number"
                          value={values?.bag_capacity || ''}
                          options={activeBagCapacityList}
                          onChange={e => {
                            commonUpdateFiledValue(
                              'bag_capacity',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          placeholder="Select Capacity"
                          className="Select_with_plus"
                          disabled={locationPath?.[1] === 'bag-details'}
                        />
                        {touched?.bag_capacity && errors?.bag_capacity && (
                          <p className="text-danger">{errors?.bag_capacity}</p>
                        )}
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="form_group mb-3">
                        <label htmlFor="BundleSize">Bundle Size </label>
                        <InputText
                          placeholder="Bundle Size"
                          id="BundleSize"
                          type="number"
                          name={'bundle_size'}
                          value={values?.bundle_size || ''}
                          onChange={e => {
                            commonUpdateFiledValue(
                              'bundle_size',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          disabled={locationPath?.[1] === 'bag-details'}
                        />
                        {touched?.bundle_size && errors?.bundle_size && (
                          <p className="text-danger">{errors?.bundle_size}</p>
                        )}
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="form_group mb-3">
                        <label htmlFor="GSM">
                          GSM <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          placeholder="GSM"
                          id="GSM"
                          name={'gsm'}
                          type="number"
                          value={values?.gsm || ''}
                          onChange={e => {
                            commonUpdateFiledValue('gsm', e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled={locationPath?.[1] === 'bag-details'}
                        />
                        {touched?.gsm && errors?.gsm && (
                          <p className="text-danger">{errors?.gsm}</p>
                        )}
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="form_group mb-3">
                        <label htmlFor="Wastage">Wastage %</label>
                        <InputText
                          placeholder="Wastage %"
                          id="Wastage"
                          type="number"
                          name={'wastage'}
                          value={values?.wastage || ''}
                          onChange={e => {
                            commonUpdateFiledValue('wastage', e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled={locationPath?.[1] === 'bag-details'}
                        />
                        {touched?.wastage && errors?.wastage && (
                          <p className="text-danger">{errors?.wastage}</p>
                        )}
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="form_group mb-3">
                        <label htmlFor="BagWeight">
                          Bag Weight <span className="text-danger fs-4">*</span>
                        </label>
                        <InputText
                          placeholder="Bag Weight"
                          id="BagWeight"
                          name={'bag_weight'}
                          value={values?.bag_weight || ''}
                          onChange={e =>
                            commonUpdateFiledSetValues(
                              'bag_weight',
                              e.target.value ? e.target.value : '0',
                            )
                          }
                          onBlur={handleBlur}
                          disabled={true}
                        />
                        {touched?.bag_weight && errors?.bag_weight && (
                          <p className="text-danger">{errors?.bag_weight}</p>
                        )}
                      </div>
                    </Col>
                    <Col sm={12}>
                      <div className="form_group copy_input mb-1">
                        <label htmlFor="BagTag">Bag Tag</label>
                        <InputText
                          id="BagTag"
                          name={'bag_tag'}
                          value={values?.bag_tag || ''}
                          onChange={e => {
                            commonUpdateFiledValue('bag_tag', e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled
                        />
                        <Button
                          className="btn_transperant"
                          onClick={() => onCopyBagTag(values?.bag_tag)}
                        >
                          <img src={CopyIcon} alt="" />
                        </Button>
                      </div>
                      <div className="tag_wrapper">
                        {values?.lamination_type?.map((x, i) => {
                          const activeLamination =
                            activeLaminationTypeList?.find(y => y?._id === x);
                          return (
                            <Tag
                              key={i}
                              value={activeLamination?.code}
                              className={`${getBagSeverity(
                                activeLamination?.name?.toLowerCase(),
                              )} bagLamTag me-1 mb-1`}
                            />
                          );
                        })}
                        {values?.print_technology?.map((x, i) => {
                          return (
                            <Tag
                              key={i}
                              value={
                                [...activePrintTechnologyList]?.find(
                                  y => y?._id === x,
                                )?.code
                              }
                              className={`p-tag-${2} bagLamTag me-1 mb-1`}
                            />
                          );
                        })}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <div className="button_group d-flex justify-content-end mt-3">
            <Button
              className="btn_border"
              onClick={onCancel}
              disabled={bagCRUDLoading}
            >
              Cancel
            </Button>
            {locationPath?.[1] === 'bag-details' ? null : (
              <Button className="btn_primary ms-3" onClick={handleSubmit}>
                {values?._id ? 'Update' : 'Save'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
