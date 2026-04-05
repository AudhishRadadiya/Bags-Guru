import React, { memo, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import DummyImage from '../../../../Assets/Images/gusset-bag.png';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { updatePrintStatus } from 'Services/Production/mfgLiveServices';
import { setBagToBagData } from 'Store/Reducers/Production/mfgLiveSlice';

import PlusIcon from '../../../../Assets/Images/plus.svg';
import MinusIcon from '../../../../Assets/Images/minus.svg';

const initialScreeningBagData = {
  print_technology_id: '',
  process_id: '',
  product_id: '',
  in_stock: '',
  qty_used: '',
  wastage: '',
  bag_printed: '',
  suggested_product_id: '',
  warehouse: '',
  completed: 0,
  partial: 1,
};

const printingDialogSchema = Yup.object({
  partials: Yup.array().of(
    Yup.object({
      attempt_no: Yup.string().nullable(),

      print_date: Yup.date()
        .nullable()
        .transform((value, originalValue) =>
          originalValue === '' ? null : value,
        ),

      used_rolls: Yup.number().nullable(),
    }).test('dependency', function (value) {
      const { print_date, used_rolls } = value || {};

      if (print_date && !used_rolls) {
        return this.createError({
          path: `${this.path}.used_rolls`,
          message: 'Used rolls is required',
        });
      }

      if (!print_date && used_rolls) {
        return this.createError({
          path: `${this.path}.print_date`,
          message: 'Print Date is required',
        });
      }

      return true;
    }),
  ),
});

const formInitialValues = [
  { attempt_no: '', print_date: '', used_rolls: null },
];

const ScreenPrintingBagDialog = ({
  screenTableModal,
  setScreenTableModal,
  selectedProductFromSuggested,
  setSelectedProductFromSuggested,
}) => {
  const dispatch = useDispatch();

  const { bagToBagData, suggestedProductList, mfgProcessPrintingById } =
    useSelector(({ mfgLive }) => mfgLive);
  const { viewProductDetailData } = useSelector(({ product }) => product);

  const submitHandle = async (values, { resetForm }) => {
    // const hasInvalidPartial = values.partials.some(
    //   partial => !partial.print_date || !partial.used_rolls,
    // );

    // if (hasInvalidPartial) {
    //   toast.error('Please fill in all required role details properly');
    //   return;
    // }

    const partialsData = values.partials.reduce((acc, partial) => {
      if (
        partial.print_date &&
        partial.used_rolls !== null &&
        partial.used_rolls !== ''
      ) {
        acc.push({
          attempt_no: acc.length + 1,
          print_date: moment(partial.print_date).format('YYYY-MM-DD'),
          used_rolls: partial.used_rolls,
        });
      }
      return acc;
    }, []);

    const payload = {
      ...bagToBagData,
      pending_bag: Number(bagToBagData?.pending_bag),
      qty_used: Number(bagToBagData?.qty_used),
      wastage: Number(bagToBagData?.wastage),
      bag_printed: Number(bagToBagData?.bag_printed),
      partials: partialsData,
    };

    setScreenTableModal(false);
    resetForm();
    dispatch(updatePrintStatus(payload));
    dispatch(setBagToBagData(initialScreeningBagData));
  };

  const {
    touched,
    errors,
    values,
    handleBlur,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      partials: formInitialValues,
    },
    validationSchema: printingDialogSchema,
    onSubmit: submitHandle,
  });

  const updatedPartialsData = useMemo(() => {
    if (mfgProcessPrintingById?.partials?.length > 0) {
      return mfgProcessPrintingById?.partials.reduce((acc, partial) => {
        acc.push({
          attempt_no: partial.attempt_no,
          print_date: new Date(partial.print_date) ?? '',
          used_rolls: partial.used_rolls ?? null,
        });

        return acc;
      }, []);
    }

    return formInitialValues;
  }, [mfgProcessPrintingById?.partials]);

  useEffect(() => {
    if (!!screenTableModal && updatedPartialsData) {
      setFieldValue('partials', updatedPartialsData);
    }
  }, [updatedPartialsData]);

  const onAddPartyAddress = () => {
    let list = [...values?.partials];
    list?.push(...formInitialValues);

    setFieldValue('partials', list);
  };

  const onRemovePartyAddress = index => {
    let list = [...values?.partials];
    list?.splice(index, 1);

    setFieldValue('partials', list);
  };

  return (
    <Dialog
      header="SCREEN PRINTING (BAG TO BAG)"
      visible={screenTableModal}
      draggable={false}
      className="modal_Wrapper modal_medium"
      onHide={() => {
        setScreenTableModal(false);
        resetForm();
        setSelectedProductFromSuggested({});
        dispatch(setBagToBagData(initialScreeningBagData));
      }}
    >
      <div className="printing_content_wrap">
        <div className="printing_content_top">
          <Row className="align-items-center">
            <Col lg={3} md={4}>
              <h5 className="mb-3">Is Printed?</h5>
              <div className="d-flex flex-wrap gap-3 mb-3">
                <div className="d-flex align-items-center">
                  <Checkbox
                    inputId="ingredient1"
                    name="complete"
                    value={bagToBagData?.completed}
                    onChange={e => {
                      dispatch(
                        setBagToBagData({
                          ...bagToBagData,
                          completed: e.target.checked ? 1 : 0,
                          partial: e.target.checked ? 0 : 1,
                        }),
                      );

                      const partialInitialData =
                        mfgProcessPrintingById?.partials?.length > 0
                          ? updatedPartialsData
                          : formInitialValues;

                      setFieldValue('partials', partialInitialData);
                    }}
                    checked={bagToBagData?.completed === 1}
                  />
                  <label htmlFor="ingredient1" className="mx-2">
                    Complete
                  </label>
                </div>
                <div className="d-flex align-items-center">
                  <Checkbox
                    inputId="ingredient2"
                    name="partial"
                    value={bagToBagData?.partial}
                    onChange={e => {
                      dispatch(
                        setBagToBagData({
                          ...bagToBagData,
                          partial: e.target.checked ? 1 : 0,
                          completed: e.target.checked ? 0 : 1,
                        }),
                      );
                    }}
                    checked={bagToBagData?.partial === 1}
                  />
                  <label htmlFor="ingredient2" className="mx-2">
                    Partial
                  </label>
                </div>
              </div>
            </Col>
            <Col lg={9} md={8}>
              <div className="form_group mb-3">
                <ReactSelectSingle
                  filter
                  name="suggested_product_id"
                  value={bagToBagData?.suggested_product_id || ''}
                  options={suggestedProductList}
                  onChange={e => {
                    dispatch(
                      setBagToBagData({
                        ...bagToBagData,
                        suggested_product_id: e.target.value,
                        warehouse: '',
                        in_stock: '',
                      }),
                    );
                    let data = suggestedProductList?.filter(
                      d => d?._id === e.target.value,
                    );
                    let updatedData = data?.map(i => {
                      return {
                        ...i,
                        warehouse: i?.warehouse?.map(d => {
                          return {
                            ...d,
                            label: d?.name,
                            value: d?._id,
                          };
                        }),
                      };
                    });
                    setSelectedProductFromSuggested(updatedData[0]);
                  }}
                  placeholder="Select Product"
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="printing_content_middle">
          <Row>
            <Col md={5}>
              <div className="product_details_left border rounded-3 bg_white p-3 h-100 mb-3">
                <div className="product_detail_wrap">
                  <h3 className="mb-2">Product Details</h3>
                  <img
                    src={
                      viewProductDetailData?.main_image
                        ? viewProductDetailData?.main_image
                        : DummyImage
                    }
                    alt="ProductImg"
                    className="w-100"
                  />
                  <h4>Bag Size</h4>
                  <h5>{viewProductDetailData?.product_code}</h5>
                  <ul className="rounded_ul">
                    <li>Bag Type: {viewProductDetailData?.bag_type_name}</li>
                    <li>
                      Bag Printing: {viewProductDetailData.print_type_name}
                    </li>
                    <li>Design Name: {viewProductDetailData?.design_name}</li>
                    <li>Bag Weight: {viewProductDetailData?.bag_weight} </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col md={7}>
              <div className="screen_printing_right">
                <div className="bag_box_wrap">
                  <div className="bag_type_box">
                    <div className="bag_img">
                      <img
                        src={
                          selectedProductFromSuggested?.main_image
                            ? selectedProductFromSuggested?.main_image
                            : DummyImage
                        }
                        alt="BagIcon"
                      ></img>
                    </div>
                    <div className="bag_title_wrap">
                      <h5 className="m-0">
                        {selectedProductFromSuggested?.design_name
                          ? selectedProductFromSuggested?.design_name
                          : 'Selected Product Image'}
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="stock_list_Wrap">
                  <ul>
                    <li>
                      <label>Warehouse</label>
                      <ReactSelectSingle
                        filter
                        name="suggested_product_id"
                        value={bagToBagData?.warehouse || ''}
                        options={selectedProductFromSuggested?.warehouse}
                        onChange={e => {
                          let data =
                            selectedProductFromSuggested?.warehouse?.filter(
                              d => d?._id === e.target.value,
                            );
                          dispatch(
                            setBagToBagData({
                              ...bagToBagData,
                              warehouse: e.target.value,
                              in_stock: data[0]?.qty,
                            }),
                          );
                        }}
                        placeholder="Select Warehouse"
                      />
                    </li>
                    <li>
                      <label>In Stock</label>
                      <div className="input_wrap">
                        <InputText
                          placeholder="In Stock"
                          value={bagToBagData?.in_stock}
                          disabled
                        />
                      </div>
                    </li>
                    <li>
                      <label>Qty used for this job</label>
                      <div className="input_wrap">
                        <InputText
                          placeholder="Qty used for this job"
                          type="number"
                          name="bagToBagData.qty_used"
                          value={bagToBagData.qty_used}
                          onChange={e => {
                            dispatch(
                              setBagToBagData({
                                ...bagToBagData,
                                qty_used: e.target.value,
                              }),
                            );
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <label>Wastage</label>
                      <div className="input_wrap">
                        <InputText
                          placeholder="Wastage"
                          type="number"
                          value={bagToBagData.wastage}
                          onChange={e => {
                            dispatch(
                              setBagToBagData({
                                ...bagToBagData,
                                wastage: e.target.value,
                              }),
                            );
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <label>Qty of bags printed</label>
                      <div className="input_wrap">
                        <InputText
                          placeholder="Qty of bags printed"
                          type="number"
                          value={bagToBagData.bag_printed}
                          onChange={e => {
                            dispatch(
                              setBagToBagData({
                                ...bagToBagData,
                                bag_printed: e.target.value,
                              }),
                            );
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <label>Pending qty of bags to print</label>
                      <div className="input_wrap">
                        <InputText
                          placeholder="Pending qty of bags"
                          type="number"
                          value={bagToBagData.pending_bag}
                          onChange={e => {
                            dispatch(
                              setBagToBagData({
                                ...bagToBagData,
                                pending_bag: e.target.value,
                              }),
                            );
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <div className="form_group mb-4">
                        <span>
                          Total Used Rolls:{' '}
                          <span className="fw-bold">
                            {bagToBagData?.total_used_rolls ?? 0}
                          </span>
                        </span>
                      </div>
                    </li>
                  </ul>

                  <div>
                    {values?.partials?.map((item, i) => {
                      return (
                        <div key={i} className="d-flex align-items-end gap-2 ">
                          <div className="plus_address_wrap d-flex gap-2 position-relative">
                            <div className="position-absolute end-0 top-0">
                              {i === 0 ? (
                                <Button
                                  className="bg-transparent btn_transparent border-0 p-0 ms-2"
                                  onClick={() => {
                                    if (values?.partials?.length <= 3) {
                                      onAddPartyAddress();
                                    }
                                  }}
                                  disabled={
                                    values?.partials?.length >= 3 ||
                                    !!bagToBagData?.completed
                                  }
                                >
                                  <img
                                    src={PlusIcon}
                                    alt="Plus Icon"
                                    className="plus_btn m-0"
                                  />
                                </Button>
                              ) : (
                                <Button
                                  className="bg-transparent btn_transparent border-0 p-0 ms-2"
                                  onClick={() => onRemovePartyAddress(i)}
                                >
                                  <img
                                    src={MinusIcon}
                                    alt="Minus Icon"
                                    className="plus_btn m-0"
                                  />
                                </Button>
                              )}
                            </div>

                            <div className="form_group mb-3">
                              <label>Print Date</label>
                              <div className="form_group date_select_wrapper">
                                <Calendar
                                  name={`partials[${i}].print_date`}
                                  value={item?.print_date}
                                  placeholder="Select Date Range"
                                  showIcon
                                  showButtonBar
                                  maxDate={new Date()}
                                  dateFormat="dd-mm-yy"
                                  readOnlyInput
                                  disabled={!!bagToBagData?.completed}
                                  onChange={e => {
                                    const utcDate = new Date(e.value);

                                    setFieldValue(
                                      `partials[${i}].print_date`,
                                      utcDate,
                                    );
                                  }}
                                  onClearButtonClick={e => {
                                    setFieldValue(
                                      `partials[${i}].print_date`,
                                      '',
                                    );
                                  }}
                                />
                              </div>
                              {touched?.partials &&
                                errors?.partials &&
                                touched?.partials[i]?.print_date &&
                                errors?.partials[i]?.print_date && (
                                  <p className="text-danger">
                                    {errors?.partials[i].print_date}
                                  </p>
                                )}
                            </div>

                            <div className="form_group mb-3">
                              <label>Used Rolls</label>
                              <InputText
                                type="number"
                                min={1}
                                name={`partials[${i}].used_rolls`}
                                placeholder="Used Rolls"
                                value={item?.used_rolls ?? ''}
                                onBlur={handleBlur}
                                onChange={e => {
                                  const value = e.target.value;

                                  const numericValue = Number(value);

                                  // Allow empty (for backspace)
                                  if (value === '' || numericValue <= 0) {
                                    setFieldValue(
                                      `partials[${i}].used_rolls`,
                                      '',
                                    );
                                    return;
                                  }

                                  if (numericValue > 0) {
                                    setFieldValue(
                                      `partials[${i}].used_rolls`,
                                      numericValue,
                                    );
                                  }
                                }}
                                disabled={!!bagToBagData?.completed}
                              />
                              {touched?.partials &&
                                errors?.partials &&
                                touched?.partials[i]?.used_rolls &&
                                errors?.partials[i]?.used_rolls && (
                                  <p className="text-danger">
                                    {errors?.partials[i].used_rolls}
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <Button
            className="btn_border me-2"
            onClick={() => {
              setScreenTableModal(false);
              resetForm();
              dispatch(setBagToBagData(initialScreeningBagData));
            }}
          >
            Cancel
          </Button>
          <Button type="submit" className="btn_primary" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default memo(ScreenPrintingBagDialog);
