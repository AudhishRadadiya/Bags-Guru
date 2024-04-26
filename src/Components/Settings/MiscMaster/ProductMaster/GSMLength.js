import React, { useState, useCallback, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import PlusIcon from '../../../../Assets/Images/plus.svg';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import EditIcon from '../../../../Assets/Images/edit.svg';
import ActionBtn from '../../../../Assets/Images/action.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import { useDispatch } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { useFormik } from 'formik';
import _ from 'lodash';
import {
  createGsmLength,
  deleteGsmLength,
  // getActiveGsmList,
  getGsmList,
  updateGsmLength,
} from 'Services/Settings/MiscMasterService';
import Skeleton from 'react-loading-skeleton';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setSelectedGsmLength } from 'Store/Reducers/Settings/MiscMasterSlice';
import { statusBodyTemplate } from '../Warehouse';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import { addGsmLengthSchema } from 'Schemas/Settings/MiscMasterSchema';
import Loader from 'Components/Common/Loader';

const GsmLength = ({ hasAccess }) => {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    gsmLengthList,
    gsmLengthCount,
    selectedGsmLength,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { currentPage, pageLimit } = allFilters?.gsmLength;
  const { searchQuery, gsmLengthFilters, filterToggle } = allCommon?.gsmLength;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getGsmList(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
  }, [currentPage, pageLimit]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedGsmLength?._id) {
        const payload = {
          ...values,
          gsm_id: selectedGsmLength?._id,
        };
        result = await dispatch(updateGsmLength(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createGsmLength(payload));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            gsmLength: {
              ...allFilters?.gsmLength,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(
          setSelectedGsmLength({
            gsm: '',
            length: '',
            is_active: 1,
          }),
        );
        dispatch(getGsmList(pageLimit, 1, searchQuery));
      }
    },
    [dispatch, pageLimit, searchQuery, selectedGsmLength?._id, allFilters],
  );
  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: selectedGsmLength,
    validationSchema: addGsmLengthSchema,
    onSubmit: submitHandle,
  });
  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          gsmLength: {
            ...allFilters?.gsmLength,
            currentPage: pageIndex,
          },
        }),
      );
    },
    [currentPage, allFilters, dispatch],
  );
  const onPageRowsChange = useCallback(
    page => {
      dispatch(
        setAllFilters({
          ...allFilters,
          gsmLength: {
            ...allFilters?.gsmLength,
            pageLimit: page,
            currentPage: page === 0 ? 0 : 1,
          },
        }),
      );
    },
    [allFilters, dispatch],
  );
  const onCancel = useCallback(() => {
    resetForm();
    dispatch(
      setSelectedGsmLength({
        gsm: '',
        length: '',
        is_active: 1,
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch]);
  const handleEdit = useCallback(
    gsm_id => {
      const gsmLength = gsmLengthList?.find(x => x?._id === gsm_id);
      if (gsmLength) {
        dispatch(setSelectedGsmLength(gsmLength));
        setSaveFilterModal(true);
      }
    },
    [gsmLengthList, dispatch],
  );
  const handleDelete = useCallback(
    async gsm_id => {
      if (gsm_id) {
        const result = await dispatch(deleteGsmLength(gsm_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              gsmLength: {
                ...allFilters?.gsmLength,
                currentPage: 1,
              },
            }),
          );
          dispatch(getGsmList(pageLimit, 1, searchQuery));
        }
      }
    },
    [dispatch, pageLimit, searchQuery, allFilters],
  );
  const itemAction = useCallback(
    ({ _id, is_default }) => {
      const checkPermission = is_edit_access || is_delete_access;
      return is_default ? null : (
        <div className="edit_row">
          <Dropdown className="dropdown_common position-static">
            <Dropdown.Toggle
              id="dropdown-basic"
              className="ection_btn"
              disabled={!checkPermission}
            >
              <img src={ActionBtn} alt="" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {is_edit_access && (
                <Dropdown.Item onClick={() => handleEdit(_id)}>
                  <img src={EditIcon} alt="" /> Edit
                </Dropdown.Item>
              )}
              {is_delete_access && (
                <Dropdown.Item
                  onClick={() => {
                    setDeletePopup(_id);
                  }}
                >
                  <img src={TrashIcon} alt="" /> Delete
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    },
    [handleEdit],
  );
  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        gsmLength: {
          ...allFilters?.gsmLength,
          currentPage: 1,
        },
      }),
    );
    dispatch(getGsmList(pageLimit, currentPage, e.target.value));
  };
  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );
  return (
    <>
      {miscMasterCRUDLoading && <Loader />}
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap border-0">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">GSM and Length</h3>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li className="search_input_wrap">
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        value={searchQuery}
                        className="input_wrap small search_wrap"
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              gsmLength: {
                                ...allCommon?.gsmLength,
                                searchQuery: e.target.value,
                              },
                            }),
                          );
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <Button
                      className="btn_primary"
                      onClick={e => {
                        is_create_access && setSaveFilterModal(true);
                      }}
                      disabled={!is_create_access}
                    >
                      <img src={PlusIcon} alt="" /> Add GSM Length
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper misc_master_table_wrapper with_colspan_head cell_padding_large is_filter">
          <button
            type="button"
            className="table_filter_btn"
            onClick={() =>
              dispatch(
                setAllCommon({
                  ...allCommon,
                  gsmLength: {
                    ...allCommon?.gsmLength,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={gsmLengthList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={gsmLengthFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  gsmLength: {
                    ...allCommon?.gsmLength,
                    gsmLengthFilters: event?.filters,
                  },
                }),
              );
            }}
          >
            <Column
              field="gsm"
              header="GSM"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="length"
              header="Length "
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="status"
              header="Active"
              filter={filterToggle}
              sortable
              body={statusBodyTemplate}
            ></Column>
            <Column field="action" header="Action" body={itemAction}></Column>
          </DataTable>
          <CustomPaginator
            dataList={gsmLengthList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={gsmLengthCount}
          />
        </div>
        <Dialog
          header={`${selectedGsmLength?._id ? 'Edit' : 'Add'} GSM and Length`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedGsmLength({
                gsm: '',
                length: '',
                is_active: 1,
              }),
            );
          }}
        >
          <div className="form_group mb-3">
            <label htmlFor="name">
              GSM <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="GSM"
              id="gsm"
              name="gsm"
              value={values?.gsm || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.gsm && errors?.gsm && (
              <p className="text-danger">{errors?.gsm}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="name">
              Length <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Length"
              id="length"
              name="length"
              value={values?.length || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.length && errors?.length && (
              <p className="text-danger">{errors?.length}</p>
            )}
          </div>
          <div className="form_group checkbox_wrap with_input mt-0 d-flex justify-content-between">
            <div className="me-3">
              <Checkbox
                value={values?.is_active}
                inputId="is_active"
                name="is_active"
                checked={values?.is_active === 1}
                onChange={e =>
                  setFieldValue('is_active', e.target.checked ? 1 : 0)
                }
              />
              <label htmlFor="Create1">Active </label>
              {touched?.is_active && errors?.is_active && (
                <p className="text-danger"> {errors?.is_active}</p>
              )}
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-end pt-3">
            <Button
              type="button"
              className="btn_border btn btn-primary"
              onClick={onCancel}
              disabled={miscMasterCRUDLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="btn_primary ms-3 btn btn-primary"
              onClick={() => handleSubmit(values)}
            >
              {selectedGsmLength?._id ? 'Update' : 'Save'}
            </Button>
          </div>
        </Dialog>
      </div>
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </>
  );
};

export default GsmLength;
