import React, { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import ReactSelectSingle from '../../../Components/Common/ReactSelectSingle';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import TrashIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import SearchIcon from '../../../Assets/Images/search.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import {
  addOrUpdateState,
  deleteState,
  getStateList,
} from 'Services/Settings/MiscMasterService';
import { setSelectedState } from 'Store/Reducers/Settings/MiscMasterSlice';
import { useFormik } from 'formik';
import { addStateSchema } from 'Schemas/Settings/MiscMasterSchema';
import { statusBodyTemplate } from './Warehouse';
import { useDispatch } from 'react-redux';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { getPartiesCountry } from 'Services/partiesService';
import Skeleton from 'react-loading-skeleton';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import Loader from 'Components/Common/Loader';

export default function State({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [countryCode, setCountryCode] = useState({
    value: '62c7a4879e7f43d9cbf9027b',
    label: 'India',
    country_code: 'IN',
  });

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    stateList,
    stateCount,
    selectedState,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { partiesLoading, partiesCountry: countryList } = useSelector(
    ({ parties }) => parties,
  );
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, stateFilters, filterToggle } = allCommon?.state;
  const { currentPage, pageLimit } = allFilters?.state;

  useEffect(() => {
    dispatch(getPartiesCountry());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getStateList(pageLimit, currentPage, countryCode, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit, countryCode]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedState?._id) {
        const payload = {
          ...values,
          id: selectedState?._id,
          country_code: countryList?.find(x => x?._id === values?.country_code)
            ?.country_code,
        };
        result = await dispatch(addOrUpdateState(payload));
      } else {
        const payload = {
          name: values?.name,
          is_active: values?.is_active,
          country_code: countryList?.find(x => x?._id === values?.country_code)
            ?.country_code,
        };
        result = await dispatch(addOrUpdateState(payload));
      }
      if (result) {
        resetForm();
        setSaveFilterModal(false);
        dispatch(
          setSelectedState({
            name: '',
            country_code: '',
            is_active: 1,
          }),
        );
        dispatch(
          setAllFilters({
            ...allFilters,
            state: {
              ...allFilters?.state,
              currentPage: 1,
            },
          }),
        );
        dispatch(getStateList(pageLimit, 1, countryCode, searchQuery));
      }
    },
    [
      countryCode,
      countryList,
      allFilters,
      dispatch,
      pageLimit,
      searchQuery,
      selectedState?._id,
    ],
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
    initialValues: selectedState,
    validationSchema: addStateSchema,
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
          state: {
            ...allFilters?.state,
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
          state: {
            ...allFilters?.state,
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
      setSelectedState({
        name: '',
        country_code: '',
        is_active: 1,
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    state_id => {
      let state = { ...stateList?.find(x => x?._id === state_id) };
      if (state) {
        state.country_code = countryCode?.value;
        dispatch(setSelectedState(state));

        setSaveFilterModal(true);
      }
    },
    [countryCode?.value, dispatch, stateList],
  );

  const handleDelete = useCallback(
    async state_id => {
      if (state_id) {
        const result = await dispatch(deleteState(state_id));
        if (result) {
          setDeletePopup(false);
          dispatch(getStateList(pageLimit, 1, countryCode, searchQuery));
          dispatch(
            setAllFilters({
              ...allFilters,
              state: {
                ...allFilters?.state,
                currentPage: 1,
              },
            }),
          );
        }
      }
    },
    [allFilters, countryCode, dispatch, pageLimit, searchQuery],
  );

  const itemAction = ({ _id, is_default }) => {
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
              <Dropdown.Item onClick={() => setDeletePopup(_id)}>
                <img src={TrashIcon} alt="" /> Delete
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const handleCountryChange = val => {
    const country = countryList?.find(x => x?._id === val);
    if (country) setCountryCode(country);
  };

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        state: {
          ...allFilters?.state,
          currentPage: 1,
        },
      }),
    );
    dispatch(getStateList(pageLimit, currentPage, countryCode, e.target.value));
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
              <div className="tab_content_wrap d-flex align-content-center flex-wrap">
                <div className="page_title">
                  <h3 className="m-0">State</h3>
                </div>
                <div className="form_group ms-3">
                  <ReactSelectSingle
                    filter
                    name="countryCode"
                    value={countryCode?.value || ''}
                    options={countryList}
                    onChange={e => handleCountryChange(e.value)}
                    placeholder="Country"
                  />
                </div>
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
                              state: {
                                ...allCommon?.state,
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
                      onClick={e =>
                        is_create_access && setSaveFilterModal(true)
                      }
                      disabled={!is_create_access}
                    >
                      <img src={PlusIcon} alt="" /> Add State
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
                  state: {
                    ...allCommon?.state,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={stateList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={stateFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  state: {
                    ...allCommon?.state,
                    stateFilters: event?.filters,
                  },
                }),
              );
            }}
          >
            <Column
              field="name"
              header="State "
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="status"
              header="Active"
              sortable
              filter={filterToggle}
              body={statusBodyTemplate}
            ></Column>
            <Column field="action" header="Action" body={itemAction}></Column>
          </DataTable>
          <CustomPaginator
            dataList={stateList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={stateCount}
          />
        </div>
        <Dialog
          header={`${selectedState?._id ? 'Edit' : 'Add'} State`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedState({
                name: '',
                country_code: '',
                is_active: 1,
              }),
            );
          }}
        >
          <div className="form_group mb-3">
            <label htmlFor="State">
              Country <span className="text-danger fs-4">*</span>
            </label>
            <ReactSelectSingle
              filter
              name="country_code"
              value={values?.country_code || ''}
              options={countryList}
              onChange={e => {
                setFieldValue('country_code', e.target.value);
              }}
              placeholder="Country"
            />
          </div>
          <div className="form_group mb-3">
            <label htmlFor="name">
              State <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Enter State Name "
              id="name"
              name="name"
              value={values?.name || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.name && errors?.name && (
              <p className="text-danger">{errors?.name}</p>
            )}
          </div>
          <div className="form_group checkbox_wrap with_input mt-0">
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
              {selectedState?._id ? 'Update' : 'Save'}
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
}
