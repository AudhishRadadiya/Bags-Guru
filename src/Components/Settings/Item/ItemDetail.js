import { memo, useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import ReactSelectSingle from '../../../Components/Common/ReactSelectSingle';
import { Checkbox } from 'primereact/checkbox';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { RadioButton } from 'primereact/radiobutton';
import PlusIcon from '../../../Assets/Images/plus.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import TextIcon from '../../../Assets/Images/text-icon.svg';
import NumberIcon from '../../../Assets/Images/number-icon.svg';
import SelectIcon from '../../../Assets/Images/select-icon.svg';
import radioBtn from '../../../Assets/Images/radio-btn.svg';
import attachment from '../../../Assets/Images/attechment.svg';
import CheckIcon from '../../../Assets/Images/check.svg';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  addAttributeSchema,
  addRawItemSchema,
} from 'Schemas/Settings/RawItemSchema';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ReactComponent as ColorPicker } from '../../../Assets/Images/color-picker.svg';
import {
  addNewItemGroup,
  addNewUnit,
  createRawItem,
  getActiveItemGroupList,
  getActiveUnitList,
  getRawItemsFullList,
  updateRawItem,
} from 'Services/Settings/MiscMasterService';
import AddUnitDialog from 'Components/Common/AddUnitDialog';
import Loader from 'Components/Common/Loader';
import {
  attributes,
  clearAddSelectedItemData,
  clearSelectedAttribute,
  clearSelectedRawItem,
  clearUpdateSelectedItemData,
  setAddSelectedItemData,
  setIsGetInitialValuesItem,
  setSelectedRawItem,
  setUpdateSelectedItemData,
  setViewSelectedItemData,
} from 'Store/Reducers/Settings/RawItemSlice';
import AddItemGroupDialog from 'Components/Common/AddItemGroupDialog';
import AddColorDialog from 'Components/Common/AddColorDialog';
import {
  convertIntoNumber,
  getUniqItems,
  rawItemAttributeType,
} from 'Helper/Common';
import ConfirmDialog from 'Components/Common/ConfirmDialog';

const colorChipTemplate = (color_name, colorList) => {
  const icon = colorList?.values?.find(x => x?.value === color_name)?.icon;
  return (
    <div className="flex align-items-center gap-2">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2534_110248)">
          <path
            d="M18.6054 15.3512C19.212 16.2129 19.9995 17.2087 19.9995 17.9162C19.9995 18.4687 19.78 18.9986 19.3893 19.3893C18.9986 19.78 18.4687 19.9995 17.9162 19.9995C17.3637 19.9995 16.8338 19.78 16.4431 19.3893C16.0524 18.9986 15.8329 18.4687 15.8329 17.9162C15.8329 17.2704 16.6337 16.2429 17.2429 15.3587C17.3192 15.2491 17.4207 15.1594 17.5389 15.0973C17.6572 15.0351 17.7886 15.0023 17.9222 15.0015C18.0557 15.0008 18.1875 15.0322 18.3064 15.093C18.4253 15.1539 18.5278 15.2424 18.6054 15.3512ZM17.8745 11.5529L10.6479 18.7795C9.86581 19.5597 8.80626 19.9978 7.70161 19.9978C6.59696 19.9978 5.53741 19.5597 4.75536 18.7795L1.22036 15.2437C0.438976 14.4623 0 13.4025 0 12.2974C0 11.1924 0.438976 10.1326 1.22036 9.35119L5.97786 4.59286L3.59786 2.18453C3.44671 2.02655 3.3637 1.81549 3.36673 1.59687C3.36977 1.37825 3.4586 1.16958 3.61408 1.01585C3.76955 0.862123 3.97921 0.775658 4.19786 0.775099C4.4165 0.774539 4.6266 0.85993 4.78286 1.01286L7.15619 3.41619L8.44619 2.12453L7.74369 1.42203C7.5919 1.26486 7.5079 1.05436 7.5098 0.835858C7.5117 0.617361 7.59934 0.40835 7.75385 0.253843C7.90835 0.0993366 8.11736 0.0116958 8.33586 0.00979713C8.55436 0.00789844 8.76486 0.0918938 8.92203 0.243692L19.7554 11.077C19.835 11.1539 19.8984 11.2459 19.9421 11.3475C19.9858 11.4492 20.0088 11.5585 20.0097 11.6692C20.0107 11.7798 19.9896 11.8896 19.9477 11.992C19.9058 12.0944 19.8439 12.1874 19.7657 12.2657C19.6874 12.3439 19.5944 12.4058 19.492 12.4477C19.3896 12.4896 19.2798 12.5107 19.1692 12.5097C19.0585 12.5088 18.9492 12.4858 18.8475 12.4421C18.7459 12.3984 18.6539 12.335 18.577 12.2554L17.8745 11.5529ZM16.6962 10.3745L9.62453 3.30286L8.32703 4.60119L12.2587 8.58286C12.344 8.65865 12.4129 8.75116 12.461 8.85466C12.5091 8.95816 12.5354 9.07043 12.5384 9.18453C12.5413 9.29862 12.5208 9.41211 12.478 9.51794C12.4353 9.62377 12.3713 9.71969 12.29 9.79977C12.2086 9.87984 12.1117 9.94235 12.0052 9.98343C11.8988 10.0245 11.785 10.0433 11.6709 10.0386C11.5569 10.0338 11.445 10.0058 11.3423 9.95605C11.2396 9.90633 11.1481 9.83603 11.0737 9.74953L7.14953 5.77869L2.39953 10.5287C2.16734 10.7608 1.98315 11.0365 1.85749 11.3398C1.73182 11.6431 1.66714 11.9683 1.66714 12.2966C1.66714 12.625 1.73182 12.9501 1.85749 13.2534C1.98315 13.5568 2.16734 13.8324 2.39953 14.0645L5.93453 17.6004C6.40392 18.0683 7.03967 18.331 7.70244 18.331C8.36522 18.331 9.00097 18.0683 9.47036 17.6004L16.6962 10.3745Z"
            fill={icon || 'black'}
          />
        </g>
        <defs>
          <clipPath id="clip0_2534_110248">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>{' '}
      <span>{color_name || ''}</span>
    </div>
  );
};

const chipTemplate = options => {
  return (
    <div className="flex align-items-center gap-2">
      <span>{options?.value ? options?.value : options}</span>
    </div>
  );
};

const ItemDetail = ({ initialValues }) => {
  // const { is_edit_access, is_delete_access } = hasAccess;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { item_id } = useParams();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const [newAttributeModal, setNewAttributeModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [colorCode, setColorCode] = useState('#000000');
  const [colorName, setColorName] = useState('');
  const [colorPickerModal, setColorPickerModal] = useState(false);
  const [defaultValues, setDefaultValues] = useState([]);
  const [addUnitShow, setAddUnitShow] = useState(false);
  const [addItemGroupShow, setAddItemGroupShow] = useState(false);
  const [unitName, setUnitName] = useState('');
  const [unitCode, setUnitCode] = useState('');
  const [isUnitActive, setIsUnitActive] = useState(0);
  const [isItemGroupActive, setIsItemGroupActive] = useState(0);
  const [itemGroupName, setItemGroupName] = useState('');

  const {
    rawItemLoading,
    rawItemCRUDLoading,
    selectedRawItem,
    selectedAttribute,
    rawItemsFullList,

    isGetInitialValuesItem,
    addSelectedItemData,
    updateSelectedItemData,
    // viewSelectedItemData,
  } = useSelector(({ rawitem }) => rawitem);

  const { loading: partiLoading } = useSelector(({ parties }) => parties);
  const {
    loading: settingLoading,
    settingsCRUDLoading,
    activeUnitList,
    activeItemGroupList,
  } = useSelector(({ settings }) => settings);

  const loadRequiredData = useCallback(() => {
    dispatch(getActiveUnitList());
    dispatch(getActiveItemGroupList());
    // dispatch(getRawItemsFullList());
  }, [dispatch]);

  //   const loadData = useCallback(() => {
  //     let selectedRawItem = {
  //       ...rawItemsFullList?.find(x => x?._id === item_id),
  //     };

  //     if (Object.keys(selectedRawItem)?.length > 0) {
  //       const updated = getUniqItems(selectedRawItem.item_attribute, attributes);
  //       let values = updated?.map((item, i) => {
  //         return {
  //           _id: item._id,
  //           no: i + 1,
  //           name: item.name,
  //           type: item.type,
  //           is_mandatory: item.is_mandatory ? 1 : 0,
  //           is_multiple_selection: item?.is_multiple_selection ? 1 : 0,
  //           values: item.attribute_value,
  //           isSelected: item.isSelected,
  //           isDefault: attributes?.find(x => x?.name === item?.name)?.isDefault
  //             ? true
  //             : false,
  //         };
  //       });

  //       const list = attributes?.map(item =>
  //         values?.find(obj => obj?.name === item?.name),
  //       );
  //       const uniqueResultTwo = values?.filter(
  //         obj => !attributes?.some(obj2 => obj?.name === obj2?.name),
  //       );
  //       values = [...list, ...uniqueResultTwo];
  //       selectedRawItem = { ...selectedRawItem, item_attribute: values };
  //     }
  //     if (selectedRawItem?.item_attribute?.length < 1)
  //       selectedRawItem.item_attribute = attributes;
  //     selectedRawItem.is_active = selectedRawItem.is_active ? 1 : 0;
  //     selectedRawItem.used_as_bag_handle = selectedRawItem.used_as_bag_handle
  //       ? 1
  //       : 0;
  //     selectedRawItem.has_multiple_variant = selectedRawItem?.has_multiple_variant
  //       ? 1
  //       : 0;

  //     dispatch(setSelectedRawItem(selectedRawItem));
  //   }, [rawItemsFullList, dispatch, item_id]);

  //   useEffect(() => {
  //     if (locationPath?.length < 3) dispatch(clearSelectedRawItem());
  //     else if (rawItemsFullList?.length > 0 && item_id) loadData();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [item_id, rawItemsFullList]);

  useEffect(() => {
    loadRequiredData();
    // return () => dispatch(clearSelectedRawItem());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (item_id) {
        const payload = {
          ...values,
          item_id,
          GST_rate: convertIntoNumber(values.GST_rate),
          has_multiple_variant: 1,
          item_attribute: values?.item_attribute
            ?.filter(x => x?.isSelected)
            ?.map(x => ({
              name: x?.name,
              type: x?.type,
              is_mandatory: x?.is_mandatory,
              is_multiple_selection: x?.is_multiple_selection
                ? x?.is_multiple_selection
                : 0,
              values: x?.values?.map(x => ({
                icon: x?.icon ? x?.icon : '',
                value: x?.value ? x?.value : x || '',
              })),
            })),
        };
        result = await dispatch(updateRawItem(payload));
        if (result) {
          dispatch(
            setIsGetInitialValuesItem({
              ...isGetInitialValuesItem,
              update: false,
            }),
          );
          dispatch(clearUpdateSelectedItemData());
        }
      } else {
        const payload = {
          ...values,
          GST_rate: convertIntoNumber(values.GST_rate),
          // item_attribute: values?.item_attribute?.filter(x => x?.isSelected),
          item_attribute: values?.item_attribute
            ?.filter(x => x?.isSelected)
            ?.map(x => ({
              name: x?.name,
              type: x?.type,
              is_mandatory: x?.is_mandatory,
              is_multiple_selection: x?.is_multiple_selection
                ? x?.is_multiple_selection
                : 0,
              values: x?.values?.map(x => ({
                icon: x?.icon ? x?.icon : '',
                value: x?.value ? x?.value : x || '',
              })),
            })),
        };
        result = await dispatch(createRawItem(payload));
        if (result) {
          dispatch(
            setIsGetInitialValuesItem({
              ...isGetInitialValuesItem,
              add: false,
            }),
          );
          dispatch(clearAddSelectedItemData());
        }
      }
      if (result) {
        dispatch(clearSelectedRawItem());
        navigate('/items');
      }
    },
    [item_id, dispatch, isGetInitialValuesItem, navigate],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    resetForm,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    // initialValues: selectedRawItem,
    initialValues: initialValues,
    validationSchema: addRawItemSchema,
    onSubmit: submitHandle,
  });

  const attributeFormik = useFormik({
    enableReinitialize: true,
    initialValues: selectedAttribute,
    validationSchema: addAttributeSchema,
    onSubmit: payload => {
      let updated = [...values?.item_attribute];

      if (payload?.no === undefined) {
        payload.no = Math.random() * 100000;
      }
      const index = updated?.findIndex(x => x?.no === payload?.no);
      if (index !== -1) {
        updated?.splice(index, 1, payload);
        updated[index].isSelected = true;
      } else {
        payload.isSelected = true;
        updated?.push(payload);
      }

      // setFieldValue('item_attribute', updated);
      commonUpdateFieldValue('item_attribute', updated);
      setNewAttributeModal(false);
      attributeFormik?.resetForm();
      dispatch(clearSelectedAttribute());
    },
  });

  const handleEdit = useCallback(
    attribute => {
      setNewAttributeModal(true);
      attributeFormik?.setValues(attribute);
    },
    [attributeFormik],
  );

  const handleDelete = useCallback(
    item => {
      if (item) {
        let data = JSON.parse(JSON.stringify({ ...values }));
        const selectedIndex = values?.item_attribute?.findIndex(
          x => x?.name === item?.name,
        );
        data?.item_attribute?.splice(selectedIndex, 1);
        // setValues(data);
        commonUpdateFieldValue('item_attribute', data);
        setDeletePopup(false);
      }
    },
    [setValues, values],
  );

  const handleUnitChange = useCallback((key, val) => {
    if (key === 'name') setUnitName(val);
    else if (key === 'code') setUnitCode(val);
    else if (key === 'is_active') setIsUnitActive(val);
  }, []);

  const handleItemGroupChange = useCallback((key, val) => {
    if (key === 'name') setItemGroupName(val);
    else if (key === 'is_active') setIsItemGroupActive(val);
  }, []);

  const userAction = user => {
    return (
      <div className="edit_row">
        <Dropdown className="dropdown_common">
          <Dropdown.Toggle id="dropdown-basic" className="ection_btn">
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleEdit(user)}>
              <img src={EditIcon} alt="" /> Edit
            </Dropdown.Item>
            {user?.isDefault ? null : (
              <Dropdown.Item onClick={() => setDeletePopup(user)}>
                <img src={TrashIcon} alt="" /> Delete
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const checkboxTemplate = options => {
    return (
      <div className="edit_row">
        <Checkbox
          inputId="isSelected"
          value={options?.isSelected}
          checked={options?.isSelected}
          onChange={e => handleAttributeChange(options?.name, e.target.checked)}
          disabled={state?.isView}
        />
      </div>
    );
  };

  const typeTemplate = options => {
    return (
      <div className="edit_row">{rawItemAttributeType(options?.type)}</div>
    );
  };

  const groupedItemTemplate = option => {
    return (
      <Button className="btn_transperant" onClick={() => setAddUnitShow(true)}>
        <img src={PlusIcon} alt="" />
      </Button>
    );
  };

  const itemGroupTemplate = option => {
    return (
      <Button
        className="btn_transperant"
        onClick={() => setAddItemGroupShow(true)}
      >
        <img src={PlusIcon} alt="" />
      </Button>
    );
  };

  const valueBodyTemplate = rowData => {
    return (
      <Chips
        value={
          rowData?.name === 'Color'
            ? rowData?.values?.map(x => x?.value)
            : rowData?.values
        }
        className="w-100 chips_primary chips-border-0"
        itemTemplate={e =>
          rowData?.name === 'Color'
            ? colorChipTemplate(e, rowData)
            : chipTemplate(e)
        }
        readOnly
      />
    );
  };

  const handleChangeColors = useCallback(
    (key, val) => {
      let changeFieldObj = {};

      if (key === 'color') {
        setColorCode(val);
        // changeFieldObj = {
        //   ...changeFieldObj,
        //   color_code: val,
        // };
      } else if (key === 'color_name') {
        setColorName(val);
        // changeFieldObj = {
        //   ...changeFieldObj,
        //   color_name: val,
        // };
      } else if (key === 'remove') {
        let colors = [...defaultValues];
        colors = colors?.filter(x => x?.label !== val?.[0]);
        setDefaultValues(colors);
        // changeFieldObj = {
        //   ...changeFieldObj,
        //   default_values: colors,
        // };
      }

      handleChangeFieldsdData(changeFieldObj);
    },
    [defaultValues],
  );

  const onCancel = useCallback(() => {
    resetForm();
    attributeFormik.resetForm();
    // dispatch(clearSelectedRawItem());
    dispatch(
      setIsGetInitialValuesItem({
        ...isGetInitialValuesItem,
        ...(item_id ? { update: false } : { add: false }),
      }),
    );
    navigate('/items');
  }, [
    attributeFormik,
    dispatch,
    isGetInitialValuesItem,
    item_id,
    navigate,
    resetForm,
  ]);

  const handleAttributeChange = useCallback(
    (key, val) => {
      let attribute = [...JSON.parse(JSON.stringify(values?.item_attribute))];
      const index = attribute?.findIndex(x => x?.name === key);
      if (index >= 0) {
        attribute[index].isSelected = val;
        // setFieldValue('item_attribute', attribute);
        commonUpdateFieldValue('item_attribute', attribute);
      }
    },
    [values],
  );

  const handleAddColors = useCallback(() => {
    const colorsObj = { value: colorName, icon: colorCode };
    const colors = [...attributeFormik?.values?.values];
    colors.push(colorsObj);

    attributeFormik?.setFieldValue('values', colors);
    setColorPickerModal(false);
    setColorCode('#000000');
    setColorName('');
  }, [attributeFormik, colorCode, colorName]);

  const onAddNewUnit = useCallback(async () => {
    const payload = {
      name: unitName,
      is_active: isUnitActive,
      code: unitCode,
    };
    const res = await dispatch(addNewUnit(payload));
    if (res) setAddUnitShow(false);
  }, [dispatch, isUnitActive, unitCode, unitName]);

  const onAddItemGroup = useCallback(async () => {
    const payload = {
      name: itemGroupName,
      is_active: isItemGroupActive,
    };
    const res = await dispatch(addNewItemGroup(payload));
    if (res) setAddItemGroupShow(false);
  }, [dispatch, isItemGroupActive, itemGroupName]);

  const onCloseAttributeModal = useCallback(async () => {
    setNewAttributeModal(false);
    attributeFormik?.resetForm();
  }, [attributeFormik]);

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (item_id) {
      if (locationPath[1] === 'update-item') {
        dispatch(
          setUpdateSelectedItemData({
            ...updateSelectedItemData,
            [fieldName]: fieldValue,
          }),
        );
      }
      // else {
      //   dispatch(
      //     setViewSelectedItemData({
      //       ...viewSelectedItemData,
      //       [fieldName]: fieldValue,
      //     }),
      //   );
      // }
    } else {
      dispatch(
        setAddSelectedItemData({
          ...addSelectedItemData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleChangeFieldsdData = (fieldObject = {}) => {
    if (item_id) {
      if (locationPath[1] === 'update-item') {
        dispatch(
          setUpdateSelectedItemData({
            ...updateSelectedItemData,
            ...fieldObject,
          }),
        );
      }
      // else {
      //   dispatch(
      //     setViewSelectedItemData({
      //       ...viewSelectedItemData,
      //       ...fieldObject,
      //     }),
      //   );
      // }
    } else {
      dispatch(
        setAddSelectedItemData({
          ...addSelectedItemData,
          ...fieldObject,
        }),
      );
    }

    // setFieldValue(fieldName, fieldValue);
    Object.keys(fieldObject)?.forEach(keys => {
      setFieldValue(keys, fieldObject[keys]);
    });
  };

  return (
    <>
      {(rawItemLoading ||
        settingLoading ||
        settingsCRUDLoading ||
        rawItemCRUDLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="add_items_wrap">
          <div className="add_items_top">
            <Row>
              <Col lg={3} md={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="ItemName">
                    Item Name <span className="text-danger fs-4">*</span>
                  </label>
                  <InputText
                    id="ItemName"
                    placeholder="Write item name here"
                    name="name"
                    value={values?.name}
                    // onChange={handleChange}
                    onChange={e => {
                      commonUpdateFieldValue('name', e.target.value);
                    }}
                    onBlur={handleBlur}
                    disabled={state?.isView}
                  />
                  {touched?.name && errors?.name && (
                    <p className="text-danger">{errors?.name}</p>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          <div className="add_items_ginfo border rounded-3 bg_white p-3 mb-3">
            <h3 className="mb-3">General Information</h3>
            <Row>
              <Col lg={3} md={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="ItemCode">
                    Item Code <span className="text-danger fs-4">*</span>
                  </label>
                  <InputText
                    id="ItemCode"
                    placeholder="Write item Code"
                    name="code"
                    value={values?.code || ''}
                    // onChange={handleChange}
                    onChange={e => {
                      commonUpdateFieldValue('code', e.target.value);
                    }}
                    onBlur={handleBlur}
                    disabled={state?.isView}
                  />
                  {touched?.code && errors?.code && (
                    <p className="text-danger">{errors?.code}</p>
                  )}
                </div>
              </Col>
              <Col lg={3} md={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="ItemGroup">
                    Item Group <span className="text-danger fs-4">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    id="ItemGroup"
                    name="group"
                    value={values?.group || ''}
                    options={activeItemGroupList}
                    // onChange={handleChange}
                    onChange={e => {
                      commonUpdateFieldValue('group', e.target.value);
                    }}
                    onBlur={handleBlur}
                    placeholder="Select a Item Group"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    optionGroupTemplate={itemGroupTemplate}
                    className="Select_with_plus"
                    disabled={state?.isView}
                  />
                  {touched?.group && errors?.group && (
                    <p className="text-danger">{errors?.group}</p>
                  )}
                </div>
              </Col>
              <Col lg={3} md={4} sm={6}>
                <div className="form_group mb-3">
                  <label>
                    Primary Unit Of Measure{' '}
                    <span className="text-danger fs-4">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    name="primary_unit"
                    value={values?.primary_unit}
                    options={activeUnitList}
                    // onChange={handleChange}
                    onChange={e => {
                      commonUpdateFieldValue('primary_unit', e.target.value);
                    }}
                    onBlur={handleBlur}
                    placeholder="Select Primary Unit of Measure"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    optionGroupTemplate={groupedItemTemplate}
                    className="Select_with_plus"
                    disabled={state?.isView}
                  />

                  {touched?.primary_unit && errors?.primary_unit && (
                    <p className="text-danger">{errors?.primary_unit}</p>
                  )}
                </div>
              </Col>
              <Col lg={3} md={4} sm={6}>
                <div className="form_group mb-3">
                  <label>
                    Secondary Unit Of Measure{' '}
                    <span className="text-danger fs-4">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    name="secondary_unit"
                    value={values?.secondary_unit || ''}
                    options={activeUnitList}
                    // onChange={handleChange}
                    onChange={e => {
                      commonUpdateFieldValue('secondary_unit', e.target.value);
                    }}
                    onBlur={handleBlur}
                    placeholder="Select Secondary Unit of Measure"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    optionGroupTemplate={groupedItemTemplate}
                    className="Select_with_plus"
                    disabled={state?.isView}
                  />
                  {touched?.secondary_unit && errors?.secondary_unit && (
                    <p className="text-danger">{errors?.secondary_unit}</p>
                  )}
                </div>
              </Col>
              <Col lg={3} md={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="GSTRate">GST Rate</label>
                  <InputText
                    id="GSTRate"
                    type="number"
                    placeholder="GST Rate"
                    name="GST_rate"
                    value={values?.GST_rate || ''}
                    // onChange={handleChange}
                    onChange={e => {
                      commonUpdateFieldValue('GST_rate', e.target.value);
                    }}
                    onBlur={handleBlur}
                    disabled={state?.isView}
                  />
                  {touched?.GST_rate && errors?.GST_rate && (
                    <p className="text-danger">{errors?.GST_rate}</p>
                  )}
                </div>
              </Col>
              <Col lg={6} md={8} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="Comment">Comment</label>
                  <InputTextarea
                    placeholder="Comment"
                    rows={1}
                    name="comment"
                    value={values?.comment || ''}
                    onChange={e => {
                      commonUpdateFieldValue('comment', e.target.value);
                    }}
                    onBlur={handleBlur}
                    disabled={state?.isView}
                  />
                  {touched?.comment && errors?.comment && (
                    <p className="text-danger">{errors?.comment}</p>
                  )}
                </div>
              </Col>
              <Col md={12}>
                <div className="form_group checkbox_wrap">
                  <Checkbox
                    inputId="Active"
                    name="is_active"
                    value={values?.is_active}
                    onBlur={handleBlur}
                    checked={values?.is_active === 1}
                    onChange={e => {
                      commonUpdateFieldValue(
                        'is_active',
                        e.target.checked ? 1 : 0,
                      );
                      // setFieldValue('is_active', e.target.checked ? 1 : 0)
                    }}
                    disabled={state?.isView}
                  />
                  <label htmlFor="Active">Active</label>
                  <Checkbox
                    inputId="RegularCustomer"
                    name="used_as_bag_handle"
                    className="ms-4"
                    value={values?.used_as_bag_handle}
                    onChange={e => {
                      commonUpdateFieldValue(
                        'used_as_bag_handle',
                        e.target.checked ? 1 : 0,
                      );
                      // setFieldValue(
                      //   'used_as_bag_handle',
                      //   e.target.checked ? 1 : 0,
                      // )
                    }}
                    onBlur={handleBlur}
                    checked={values?.used_as_bag_handle === 1}
                    disabled={state?.isView}
                  />
                  <label htmlFor="RegularCustomer">
                    Can be used as BAG HANDLE
                  </label>
                </div>
                {touched?.used_as_bag_handle && errors?.used_as_bag_handle && (
                  <p className="text-danger">{errors?.used_as_bag_handle}</p>
                )}
                {touched?.is_active && errors?.is_active && (
                  <p className="text-danger">{errors?.is_active}</p>
                )}
              </Col>
            </Row>
          </div>

          <div className="table_main_Wrapper bg-white">
            <div className="top_filter_wrap">
              <Row className="align-items-center">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Attributes</h3>
                  </div>
                </Col>
                <Col sm={9}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li>
                        <Button
                          className="btn_primary"
                          onClick={() => setNewAttributeModal(true)}
                          disabled={
                            state?.isView || locationPath[1] === 'item-details'
                          }
                        >
                          <img src={PlusIcon} alt="" />
                          Add Attribute
                        </Button>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper additem_table_wrapper">
              <DataTable
                value={values?.item_attribute || []}
                sortMode="multiple"
                sortField="name"
                sortOrder={1}
                dataKey="name"
              >
                <Column
                  field="is_mandatory"
                  header=""
                  body={checkboxTemplate}
                ></Column>
                <Column field="name" header="Attribute Name" sortable></Column>
                <Column
                  field="type"
                  header="Field Type"
                  sortable
                  body={typeTemplate}
                ></Column>
                <Column
                  field="value"
                  header="Value"
                  sortable
                  body={valueBodyTemplate}
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  hidden={state?.isView}
                  body={userAction}
                ></Column>
              </DataTable>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-end pt-3">
            <Button
              className="btn_border ms-3"
              onClick={onCancel}
              disabled={settingsCRUDLoading}
            >
              Cancel
            </Button>
            {locationPath && locationPath[1] === 'item-details' ? null : (
              <Button
                type="submit"
                onClick={() => handleSubmit(values)}
                className="btn_primary ms-3"
              >
                {item_id ? 'Update' : 'Save'}
              </Button>
            )}
          </div>
        </div>
        <Dialog
          header={
            attributeFormik?.values?._id
              ? 'Update Attribute'
              : 'Add New Attribute'
          }
          visible={!!newAttributeModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => onCloseAttributeModal()}
        >
          <div className="newattiribute_content_wrap">
            <div className="form_group mb-3">
              <label htmlFor="Name">
                Name <span className="text-danger fs-4">*</span>
              </label>
              <InputText
                placeholder="Name your Attribute"
                name="name"
                value={attributeFormik?.values?.name || ''}
                onChange={attributeFormik?.handleChange}
                disabled={attributeFormik?.values?.isDefault}
                required
              />
              {attributeFormik?.touched?.name &&
                attributeFormik?.errors?.name && (
                  <p className="text-danger">{attributeFormik?.errors?.name}</p>
                )}
            </div>
            <div className="form_group mb-3">
              <label htmlFor="">
                Select field type <span className="text-danger fs-4">*</span>
              </label>
              <div className="custom_radio_wrap">
                <Row className="g-2">
                  <Col sm={4}>
                    <RadioButton
                      inputId="Text"
                      name="type"
                      value={1}
                      onChange={attributeFormik?.handleChange}
                      checked={attributeFormik?.values?.type === 1}
                      disabled={attributeFormik?.values?.isDefault}
                    />
                    <label htmlFor="Text" className="radio_label">
                      <img src={TextIcon} alt="Text Icon" />
                      Text
                    </label>
                  </Col>
                  <Col sm={4}>
                    <RadioButton
                      inputId="Number"
                      name="type"
                      value={2}
                      onChange={attributeFormik?.handleChange}
                      checked={attributeFormik?.values?.type === 2}
                      disabled={attributeFormik?.values?.isDefault}
                    />
                    <label htmlFor="Number" className="radio_label">
                      <img src={NumberIcon} alt="Number Icon" />
                      Number
                    </label>
                  </Col>
                  <Col sm={4}>
                    <RadioButton
                      inputId="Select"
                      name="type"
                      value={3}
                      onChange={attributeFormik?.handleChange}
                      checked={attributeFormik?.values?.type === 3}
                      disabled={attributeFormik?.values?.isDefault}
                    />
                    <label htmlFor="Select" className="radio_label">
                      <img src={SelectIcon} alt="Select Icon" />
                      Select
                    </label>
                  </Col>
                  <Col sm={4}>
                    <RadioButton
                      inputId="radio"
                      name="type"
                      value={4}
                      onChange={attributeFormik?.handleChange}
                      checked={attributeFormik?.values?.type === 4}
                      disabled={attributeFormik?.values?.isDefault}
                    />
                    <label htmlFor="radio" className="radio_label">
                      <img src={radioBtn} alt="Select Icon" />
                      Radio
                    </label>
                  </Col>
                  <Col sm={4}>
                    <RadioButton
                      inputId="attachment"
                      name="type"
                      value={5}
                      onChange={attributeFormik?.handleChange}
                      checked={attributeFormik?.values?.type === 5}
                      disabled={attributeFormik?.values?.isDefault}
                    />
                    <label htmlFor="attachment" className="radio_label">
                      <img src={attachment} alt="Select Icon" />
                      Attachment
                    </label>
                  </Col>
                  <Col sm={4}>
                    <RadioButton
                      inputId="checkbox"
                      name="type"
                      value={6}
                      onChange={attributeFormik?.handleChange}
                      checked={attributeFormik?.values?.type === 6}
                      disabled={attributeFormik?.values?.isDefault}
                    />
                    <label htmlFor="checkbox" className="radio_label">
                      <span className="checkIcon_box">
                        <img src={CheckIcon} alt="Select Icon" />
                      </span>
                      Checkbox
                    </label>
                  </Col>
                </Row>
                {attributeFormik?.touched?.type &&
                  attributeFormik?.errors?.type && (
                    <p className="text-danger">
                      {attributeFormik?.errors?.type}
                    </p>
                  )}
              </div>
            </div>
            <div className="d-flex">
              <div className="form_group checkbox_wrap mb-3 me-3">
                <div className="d-flex align-items-center">
                  <Checkbox
                    inputId="mandatory"
                    name="is_mandatory"
                    value={attributeFormik?.values?.is_mandatory}
                    checked={attributeFormik?.values?.is_mandatory === 1}
                    onChange={e => {
                      attributeFormik?.setFieldValue(
                        'is_mandatory',
                        e.target.checked ? 1 : 0,
                      );
                    }}
                    disabled={attributeFormik?.values?.name === 'Qty'}
                    required
                  />
                  <label htmlFor="mandatory">Is mandatory?</label>
                </div>
                {/* {attributeFormik?.touched?.is_mandatory &&
                  attributeFormik?.errors?.is_mandatory && (
                    <p className="text-danger">
                      {attributeFormik?.errors?.is_mandatory}
                    </p>
                  )} */}
              </div>
              {attributeFormik?.values?.type === 3 && (
                <div className="form_group checkbox_wrap mb-3">
                  <div className="d-flex align-items-center">
                    <Checkbox
                      inputId="multipleSelection"
                      name="is_multiple_selection"
                      value={attributeFormik?.values?.is_multiple_selection}
                      checked={
                        attributeFormik?.values?.is_multiple_selection === 1
                      }
                      onChange={e => {
                        attributeFormik?.setFieldValue(
                          'is_multiple_selection',
                          e.target.checked ? 1 : 0,
                        );
                      }}
                    />
                    <label htmlFor="multipleSelection">
                      Allow Multiple Selection
                    </label>
                  </div>
                </div>
              )}
            </div>

            {attributeFormik?.values?.type === 3 ||
            attributeFormik?.values?.type === 4 ? (
              <div className="form_group mb-3">
                <div className="d-flex justify-content-between">
                  <label htmlFor="defaultValues" className="d-block mb-2">
                    Default Values{' '}
                  </label>
                  {attributeFormik?.values?.name === 'Color' ? (
                    <ColorPicker
                      className="mb-2 cursor-pointer"
                      onClick={() => setColorPickerModal(true)}
                    />
                  ) : null}
                </div>
                <Chips
                  placeholder="Enter attribute value, Seperate by enter"
                  name="values"
                  id="defaultValues"
                  value={
                    attributeFormik?.values?.name === 'Color'
                      ? attributeFormik?.values?.values?.map(x => x?.value)
                      : attributeFormik?.values?.values
                  }
                  onChange={e => {
                    const udpated = attributeFormik?.values?.values.filter(
                      obj => e?.value.some(obj1 => obj?.value === obj1),
                    );
                    if (attributeFormik?.values?.name === 'Color')
                      attributeFormik?.setFieldValue('values', udpated);
                    else attributeFormik?.handleChange(e);
                  }}
                  className="w-100 chips_primary"
                  itemTemplate={e =>
                    attributeFormik?.values?.name === 'Color'
                      ? colorChipTemplate(e, attributeFormik?.values)
                      : chipTemplate(e)
                  }
                />
              </div>
            ) : null}
            <div className="d-flex justify-content-end">
              <Button
                className="btn_border mx-3"
                onClick={() => {
                  attributeFormik.resetForm();
                  dispatch(clearSelectedAttribute());
                  setNewAttributeModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className="btn_primary"
                onClick={attributeFormik.handleSubmit}
              >
                {attributeFormik?.values?._id ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </Dialog>

        <AddColorDialog
          onSave={handleAddColors}
          setShow={() => {
            setColorPickerModal(!colorPickerModal);
            setColorCode('#000000');
            setColorName('');
          }}
          show={colorPickerModal}
          color={colorCode}
          colorName={colorName}
          handleChange={handleChangeColors}
        />
        <AddUnitDialog
          onSave={onAddNewUnit}
          setShow={() => setAddUnitShow(!addUnitShow)}
          show={addUnitShow}
          name={unitName}
          code={unitCode}
          is_active={isUnitActive}
          handleChange={handleUnitChange}
        />
        <AddItemGroupDialog
          onSave={onAddItemGroup}
          setShow={() => setAddItemGroupShow(!addItemGroupShow)}
          show={addItemGroupShow}
          name={itemGroupName}
          is_active={isItemGroupActive}
          handleChange={handleItemGroupChange}
        />
      </div>
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </>
  );
};
export default memo(ItemDetail);
