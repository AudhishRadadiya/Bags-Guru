import React, { memo, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Dialog } from 'primereact/dialog';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { Col, Row } from 'react-bootstrap';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import {
  setAssignedRollList,
  setClearPrintingData,
  setSuggestedRollList,
  setprintingData,
} from 'Store/Reducers/Production/mfgLiveSlice';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { getFormattedDate } from 'Helper/Common';
import { setAllCommon } from 'Store/Reducers/Common';
import MFGLivePrintingFilter from '../MFGLivePrintingFilter';
import { setViewProductDetailData } from 'Store/Reducers/Products/ProductSlice';

import PlusIcon from '../../../../Assets/Images/plus.svg';
import MinusIcon from '../../../../Assets/Images/minus.svg';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import CheckRed from '../../../../Assets/Images/check-round-red.svg';
import CheckGreen from '../../../../Assets/Images/check-round-green.svg';
import { updatePrintStatus } from 'Services/Production/mfgLiveServices';

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

const PrintingDialog = ({
  jobId,
  assignedRoll,
  setAssignedRoll,
  printingTableModal,
  setPrintingTableModal,
  setCheckedAssignedRoll,
  printTechnologyId,
  checkedAssignedRoll,
  changeRollDate,
  setChangeRollDate,
}) => {
  const dispatch = useDispatch();

  const { allCommon } = useSelector(({ common }) => common);
  const { viewProductDetailData } = useSelector(({ product }) => product);
  const {
    printingData,
    suggestedRollList,
    allSuggestedRollList,
    mfgLivePrintingFilterList,
    mfgProcessPrintingById,
  } = useSelector(({ mfgLive }) => mfgLive);

  const {
    print_field_filter,
    assignedFilterToggle,
    suggestedFilterToggle,
    mfgLivePrintingFilter,
    blank_print_field_filter,
  } = allCommon?.mfgLive;

  const submitHandle = async (values, { resetForm }) => {
    // if (!assignedRoll?.length) {
    //   toast.error('Select at-least one roll to save the details!');
    // } else {
    let rollId = [];
    let rollPrintedDateData = [];
    let updatedPrintedRoll = [];

    if (assignedRoll?.length > 0) {
      updatedPrintedRoll = assignedRoll?.filter(x => x?.is_cancelled);
    }

    // if (updatedPrintedRoll?.length > 0) {
    //** store all assigned printed roll IDs: **//
    // updatedPrintedRoll?.forEach(x => rollId.push(x?._id));

    // updatedPrintedRoll?.forEach(x => {
    //   let dateFormateRolldata = {
    //     date: x?.selected_date,
    //     roll: [],
    //   };

    //   if (rollData?.roll?.length > 0) {
    //     const abc = rollData.find(
    //       roll =>
    //         moment(roll.date).format('YYYY-MM-DD') ===
    //         moment(x.date).format('YYYY-MM-DD'),
    //     );
    //     if (abc) {
    //       let updatedList = [...rollData];
    //       const index = updatedList?.findIndex(
    //         x =>
    //           moment(x.date).format('YYYY-MM-DD') ===
    //           moment(abc.selected_date).format('YYYY-MM-DD'),
    //       );

    //       if (index !== -1) {
    //         const oldObj = updatedList[index];
    //         const updatedObj = {
    //           ...oldObj,
    //           roll: [...oldObj.roll, x._id],
    //         };
    //         updatedList[index] = updatedObj;
    //         rollData = updatedList;
    //       }
    //     } else {
    //       dateFormateRolldata?.roll?.push(x._id);
    //       rollData.push(dateFormateRolldata);
    //     }
    //   } else {
    //     dateFormateRolldata?.roll?.push(x._id);
    //     rollData.push(dateFormateRolldata);
    //   }
    // });

    if (updatedPrintedRoll?.length > 0) {
      updatedPrintedRoll?.forEach(x => {
        rollId.push(x?._id);

        const dateIndex = rollPrintedDateData?.findIndex(
          roll => roll?.date === x?.selected_date,
        );

        if (dateIndex !== -1) {
          rollPrintedDateData[dateIndex].roll.push(x._id);
        } else {
          rollPrintedDateData.push({
            date: x.selected_date,
            roll: [x._id],
          });
        }
      });
    }

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

    const newObj = {
      ...printingData,
      pending_bag: Number(printingData?.pending_bag),
      roll_printed: rollId,
      roll_printed_date: rollPrintedDateData,
      partials: partialsData,
    };

    const response = dispatch(updatePrintStatus(newObj));
    if (response) {
      resetForm();
      setPrintingTableModal(false);
      dispatch(
        setAllCommon({
          ...allCommon,
          mfgLive: {
            ...allCommon?.mfgLive,
            print_field_filter: blank_print_field_filter,
            suggestedFilterToggle: false,
            assignedFilterToggle: false,
          },
        }),
      );
      dispatch(setViewProductDetailData({}));
      setAssignedRoll([]);
      dispatch(setAssignedRollList([]));
      setCheckedAssignedRoll([]);
      dispatch(setSuggestedRollList([]));
      dispatch(setClearPrintingData());
    }
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

  const footerContentR2R = (
    <div className="mt-2 d-flex justify-content-end">
      <Button
        className="btn_border me-2"
        onClick={() => {
          resetForm();
          dispatch(
            setAllCommon({
              ...allCommon,
              mfgLive: {
                ...allCommon?.mfgLive,
                suggestedFilterToggle: false,
                assignedFilterToggle: false,
                print_field_filter: blank_print_field_filter,
              },
            }),
          );
          dispatch(setViewProductDetailData({}));
          setAssignedRoll([]);
          dispatch(setAssignedRollList([]));
          setCheckedAssignedRoll([]);
          dispatch(setSuggestedRollList([]));
          setPrintingTableModal(false);
          dispatch(setClearPrintingData());
        }}
      >
        Cancel
      </Button>
      <Button type="submit" className="btn_primary" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );

  const updatedPartialsData = useMemo(() => {
    if (mfgProcessPrintingById?.partials?.length > 0) {
      return mfgProcessPrintingById?.partials.reduce((acc, partial) => {
        acc.push({
          attempt_no: partial.attempt_no,
          print_date: new Date(partial.print_date) ?? '',
          used_rolls: partial.used_rolls ?? 0,
        });

        return acc;
      }, []);
    }

    return formInitialValues;
  }, [mfgProcessPrintingById?.partials]);

  useEffect(() => {
    if (!!printingTableModal && updatedPartialsData) {
      setFieldValue('partials', updatedPartialsData);
    }
  }, [updatedPartialsData]);

  const handleDeletePrintedRoll = item => {
    const filteredAssignedData = assignedRoll?.filter(
      assign => assign?.is_cancelled === true && assign?._id !== item?._id,
    );

    const isCancelledData = assignedRoll?.filter(i => !i?.is_cancelled);

    const indexToInsert = allSuggestedRollList?.findIndex(
      suggest => suggest?._id === item._id,
    );

    // If the index is found, insert the removable object from suggestedRollList at that position
    if (indexToInsert !== -1) {
      const newArray = [...suggestedRollList];
      newArray?.splice(indexToInsert, 0, item);
      dispatch(setSuggestedRollList(newArray));
    }
    setAssignedRoll([...isCancelledData, ...filteredAssignedData]);
    dispatch(
      setAssignedRollList([...isCancelledData, ...filteredAssignedData]),
    );
  };

  const handleAddRolls = e => {
    const selectedDate = getFormattedDate(new Date(changeRollDate));

    // ** add selected_date field to checked (assignedRoll) data **//
    const modifyCheckedData = checkedAssignedRoll?.map(checked => {
      return {
        ...checked,
        selected_date: selectedDate,
        // print_technology_name: mfgProcessPrintingById?.print_technology,
      };
    });

    // ** remove suggested roll data when add data in printed roll **//
    const removeSuggestedRoll = suggestedRollList?.filter(suggested => {
      return !checkedAssignedRoll?.some(
        checked => checked?._id === suggested?._id,
      );
    });

    dispatch(setSuggestedRollList(removeSuggestedRoll));
    setAssignedRoll([...assignedRoll, ...modifyCheckedData]);
    dispatch(setAssignedRollList([...assignedRoll, ...modifyCheckedData]));
    setCheckedAssignedRoll();
  };

  const onAddPartyAddress = () => {
    let list = [...values?.partials];
    list?.push({ print_date: '', used_rolls: '' });

    setFieldValue('partials', list);
  };

  const onRemovePartyAddress = index => {
    let list = [...values?.partials];
    list?.splice(index, 1);

    setFieldValue('partials', list);
  };

  const customNoColumn = (data, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
  };

  const printTechnology = (data, index) => {
    return <p>{data?.print_technology_name}</p>;
  };

  const slitTemplate = data => {
    return data?.is_slit === true ? (
      <img src={CheckGreen} alt="CheckIocn" />
    ) : (
      <img src={CheckRed} alt="CheckIocn" />
    );
  };

  const sizeTemplate = option => {
    return (
      <>
        <span className="d-block">{`${
          option?.width ? 'W ' + option.width : ''
        }`}</span>
        <span className="d-block">{`${
          option?.length ? 'X L ' + option.length : ''
        }`}</span>
      </>
    );
  };

  const assignActionTemplate = rowItem => {
    return rowItem?.is_cancelled ? (
      <Button className="btn_transperant">
        <img
          src={TrashIcon}
          alt=""
          onClick={() => handleDeletePrintedRoll(rowItem)}
        />
      </Button>
    ) : (
      ''
    );
  };

  return (
    <Dialog
      header="Printing"
      visible={printingTableModal}
      draggable={false}
      className="modal_Wrapper model_extra_large"
      onHide={() => {
        resetForm();
        setAssignedRoll([]);
        setPrintingTableModal(false);
        dispatch(setClearPrintingData());
        dispatch(setAssignedRollList([]));
        dispatch(setViewProductDetailData({}));
        dispatch(
          setAllCommon({
            ...allCommon,
            mfgLive: {
              ...allCommon?.mfgLive,
              suggestedFilterToggle: false,
              assignedFilterToggle: false,
              print_field_filter: blank_print_field_filter,
            },
          }),
        );
      }}
      footer={footerContentR2R}
    >
      <div className="printing_content_wrap">
        <MFGLivePrintingFilter
          jobId={jobId}
          allCommon={allCommon}
          setAllCommon={setAllCommon}
          printTechnologyId={printTechnologyId}
          print_field_filter={print_field_filter}
          mfgLivePrintingFilterList={mfgLivePrintingFilterList}
        />
        <div className="printing_content_middle">
          <Row className="g-2">
            <Col lg={3} className="order-1 order-lg-1">
              <div className="product_details_left border rounded-3 bg_white p-3 mb-3">
                <div className="product_detail_wrap">
                  <h3 className="mb-2">Product Details</h3>
                  <img
                    src={viewProductDetailData?.main_image}
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
            <Col lg={9} className="order-4 order-lg-2">
              <div className="table_main_Wrapper bg-white mb-3">
                <div className="top_filter_wrap">
                  <h3>Suggested Rolls</h3>
                </div>
                <div className="data_table_wrapper cell_padding_small is_filter custom_suggested_mfg break_header">
                  <button
                    type="button"
                    className="table_filter_btn"
                    onClick={() => {
                      dispatch(
                        setAllCommon({
                          ...allCommon,
                          mfgLive: {
                            ...allCommon?.mfgLive,
                            suggestedFilterToggle: !suggestedFilterToggle,
                          },
                        }),
                      );
                    }}
                  >
                    <img src={SearchIcon} alt="" />
                  </button>
                  <DataTable
                    value={suggestedRollList}
                    sortMode="single"
                    sortField="name"
                    sortOrder={1}
                    rows={10}
                    dataKey="_id"
                    filterDisplay="row"
                    selectionMode="checkbox"
                    // onSelectionChange={e => handleCheckboxTemplate(e.value)}
                    // selection={assignedRoll}
                    onSelectionChange={e => {
                      // handleCheckboxTemplate(e.value)
                      setCheckedAssignedRoll(e.value);
                    }}
                    selection={checkedAssignedRoll}
                    // onSelectionChange={e => setSelectedProducts(e.value)}
                    filters={mfgLivePrintingFilter}
                    onFilter={event => {
                      dispatch(
                        setAllCommon({
                          ...allCommon,
                          mfgLive: {
                            ...allCommon?.mfgLive,
                            mfgLivePrintingFilter: event?.filters,
                          },
                        }),
                      );
                    }}
                  >
                    <Column
                      selectionMode="multiple"
                      headerStyle={{ width: '2rem' }}
                    ></Column>
                    {/* <Column
                          selectionMode="multiple"
                          headerStyle={{ width: '3rem' }}
                          field="can_transfer_consumed"
                          body={checkboxTemplate}
                        ></Column> */}
                    <Column
                      field=""
                      header="No"
                      sortable
                      body={customNoColumn}
                    ></Column>
                    <Column
                      field="id_no"
                      header="ID No."
                      sortable
                      filter={suggestedFilterToggle}
                    ></Column>
                    <Column
                      field="color"
                      header="Color"
                      sortable
                      filter={suggestedFilterToggle}
                    ></Column>
                    <Column
                      field="gsm"
                      header="GSM"
                      sortable
                      filter={suggestedFilterToggle}
                    ></Column>
                    <Column
                      field="size"
                      header="Size"
                      sortable
                      body={sizeTemplate}
                      filter={suggestedFilterToggle}
                    ></Column>
                    <Column
                      field="net_weight"
                      header="Net Weight"
                      sortable
                      filter={suggestedFilterToggle}
                    ></Column>
                    <Column
                      field="item_name"
                      header="Item Name"
                      className="product_code suggested_roll"
                      sortable
                      filter={suggestedFilterToggle}
                    ></Column>
                    <Column
                      field="print_technology_name"
                      header="Print Technology"
                      className="product_code suggested_roll"
                      sortable
                      filter={suggestedFilterToggle}
                      body={printTechnology}
                    ></Column>
                    <Column
                      field="lamination"
                      header="Lamination"
                      sortable
                      filter={suggestedFilterToggle}
                    ></Column>
                    <Column
                      field="design_name"
                      header="Design Name"
                      sortable
                      filter={suggestedFilterToggle}
                    ></Column>
                    <Column
                      field="is_slit"
                      header="Split"
                      sortable
                      filter={suggestedFilterToggle}
                      body={slitTemplate}
                    ></Column>
                    <Column
                      field="parent_id"
                      header="Parent"
                      sortable
                      filter={suggestedFilterToggle}
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </Col>
            <Col lg={3} className="order-2 order-lg-3">
              <div className="d-flex flex-wrap gap-3">
                <div className="d-flex align-items-center">
                  <Checkbox
                    inputId="ingredient1"
                    name="complete"
                    value={printingData?.completed}
                    onChange={e => {
                      dispatch(
                        setprintingData({
                          ...printingData,
                          completed: e.target.checked ? 1 : 0,
                          partial: e.target.checked ? 0 : 1,
                        }),
                      );

                      const partialInitialData =
                        mfgProcessPrintingById?.partials?.length > 0
                          ? updatedPartialsData
                          : [{ print_date: '', used_rolls: 0 }];

                      setFieldValue('partials', partialInitialData);
                    }}
                    checked={printingData?.completed === 1}
                  />
                  <label htmlFor="ingredient1" className="mx-2">
                    Complete
                  </label>
                </div>
                <div className="d-flex align-items-center">
                  <Checkbox
                    inputId="ingredient2"
                    name="partial"
                    value={printingData?.partial}
                    onChange={e => {
                      dispatch(
                        setprintingData({
                          ...printingData,
                          partial: e.target.checked ? 1 : 0,
                          completed: e.target.checked ? 0 : 1,
                        }),
                      );
                    }}
                    checked={printingData?.partial === 1}
                  />
                  <label htmlFor="ingredient2" className="mx-2">
                    Partial
                  </label>
                </div>
              </div>
            </Col>
            <Col lg={9} className="order-3 order-lg-4">
              <ul className="d-flex align-items-center justify-content-start justify-content-lg-end gap-2 flex-wrap">
                <li>
                  <div className="me-4">
                    <span>
                      Total Used Rolls:{' '}
                      <span className="fw-bold">
                        {printingData?.total_used_rolls ?? 0}
                      </span>
                    </span>
                  </div>
                </li>
                <li>
                  <ul className="pending_bags panding_bags_details">
                    <li>
                      Pending qty of bags to print
                      <div className="form_group">
                        <InputText
                          placeholder="Bags Qty"
                          value={printingData?.pending_bag}
                          onChange={e => {
                            dispatch(
                              setprintingData({
                                ...printingData,
                                pending_bag: e.target.value,
                              }),
                            );
                          }}
                        />
                        <span>Bags</span>
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="form_group date_select_wrapper">
                    <Calendar
                      id=" ConsumptionDate"
                      value={changeRollDate}
                      placeholder="Select Date Range"
                      showIcon
                      showButtonBar
                      dateFormat="dd-mm-yy"
                      selectionMode="single"
                      readOnlyInput
                      onChange={e => setChangeRollDate(e.value)}
                    />
                  </div>
                </li>
                <li>
                  <div className="text-end">
                    <Button
                      className="btn_primary"
                      onClick={e => handleAddRolls(e)}
                    >
                      Add Rolls
                    </Button>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="final_print_table mt-3">
          <Row>
            <Col lg={4}>
              {values?.partials?.map((item, i) => {
                return (
                  <div key={i} className="d-flex align-items-end gap-2">
                    {/* <div className="plus_address_wrap d-flex align-items-center mb-3"></div> */}

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
                              !!printingData?.completed
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
                            disabled={!!printingData?.completed}
                            onChange={e => {
                              const utcDate = new Date(e.value);

                              setFieldValue(
                                `partials[${i}].print_date`,
                                utcDate,
                              );
                            }}
                            onClearButtonClick={e => {
                              setFieldValue(`partials[${i}].print_date`, '');
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
                              setFieldValue(`partials[${i}].used_rolls`, '');
                              return;
                            }

                            if (numericValue > 0) {
                              setFieldValue(
                                `partials[${i}].used_rolls`,
                                numericValue,
                              );
                            }
                          }}
                          disabled={!!printingData?.completed}
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
            </Col>

            <Col lg={8}>
              <div className="table_main_Wrapper bg-white">
                <div className="top_filter_wrap">
                  <h3>Printed Rolls</h3>
                </div>
                <div className="data_table_wrapper with_colspan_head cell_padding_small is_filter custom_suggested_mfg">
                  <button
                    type="button"
                    className="table_filter_btn"
                    onClick={() => {
                      dispatch(
                        setAllCommon({
                          ...allCommon,
                          mfgLive: {
                            ...allCommon?.mfgLive,
                            assignedFilterToggle: !assignedFilterToggle,
                          },
                        }),
                      );
                    }}
                  >
                    <img src={SearchIcon} alt="" />
                  </button>
                  <DataTable
                    value={assignedRoll}
                    sortMode="multiple"
                    sortField="name"
                    sortOrder={1}
                    filterDisplay="row"
                    dataKey="_id"
                    filters={mfgLivePrintingFilter}
                    onFilter={event => {
                      dispatch(
                        setAllCommon({
                          ...allCommon,
                          mfgLive: {
                            ...allCommon?.mfgLive,
                            mfgLivePrintingFilter: event?.filters,
                          },
                        }),
                      );
                    }}
                  >
                    <Column
                      field=""
                      header="No"
                      sortable
                      body={customNoColumn}
                    ></Column>
                    <Column
                      field="id_no"
                      header="ID No."
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="color"
                      header="Color"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="gsm"
                      header="GSM"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="size"
                      header="Size"
                      sortable
                      body={sizeTemplate}
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="net_weight"
                      header="Net Weight"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="item_name"
                      header="Item Name"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="print_technology_name"
                      header="Print Technology"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="lamination"
                      header="Lamination"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="design_name"
                      header="Design Name"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="is_slit"
                      header="Split"
                      sortable
                      filter={assignedFilterToggle}
                      body={slitTemplate}
                    ></Column>
                    <Column
                      field="parent_id"
                      header="Parent"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="action"
                      body={assignActionTemplate}
                      header="Action"
                    />
                  </DataTable>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Dialog>
  );
};

export default memo(PrintingDialog);
