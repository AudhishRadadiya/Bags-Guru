import { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import ReactSelectSingle from '../../../Components/Common/ReactSelectSingle';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import TrashIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import SearchIcon from '../../../Assets/Images/search.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { statusBodyTemplate } from './Warehouse';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getPartiesCountry, getPartiesState } from 'Services/partiesService';
import _ from 'lodash';
import {
  addOrUpdateCity,
  deleteCity,
  getCityList,
} from 'Services/Settings/MiscMasterService';
import { setSelectedCity } from 'Store/Reducers/Settings/MiscMasterSlice';
import { addCitySchema } from 'Schemas/Settings/MiscMasterSchema';
import Skeleton from 'react-loading-skeleton';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import Loader from 'Components/Common/Loader';

export default function City({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [stateId, setStateId] = useState('62c7d116acd66cdaeb455b47');
  const [countryCode, setCountryCode] = useState('62c7a4879e7f43d9cbf9027b');

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    cityList,
    cityCount,
    selectedCity,
  } = useSelector(({ miscMaster }) => miscMaster);

  const {
    partiesLoading,
    partiesCountry: countryList,
    partiesState,
  } = useSelector(({ parties }) => parties);

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, cityFilters, filterToggle } = allCommon?.city;
  const { currentPage, pageLimit } = allFilters?.city;

  useEffect(() => {
    dispatch(getPartiesCountry());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = useCallback(async () => {
    const Code = countryList?.find(x => x?._id === countryCode)?.country_code;
    await dispatch(getPartiesState({ code: Code }));
  }, [countryCode, countryList, dispatch]);

  useEffect(() => {
    if (countryList?.length > 0) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryList?.length, countryCode]);

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getCityList(pageLimit, currentPage, stateId, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit, stateId]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedCity?._id) {
        const payload = {
          ...values,
          id: selectedCity?._id,
        };
        result = await dispatch(addOrUpdateCity(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(addOrUpdateCity(payload));
      }
      if (result) {
        setSaveFilterModal(false);
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            city: {
              ...allFilters?.city,
              currentPage: 1,
            },
          }),
        );
        dispatch(
          setSelectedCity({
            name: '',
            state_id: '',
            country_id: '62c7a4879e7f43d9cbf9027b',
            is_active: 1,
          }),
        );
        dispatch(getCityList(pageLimit, 1, stateId, searchQuery));
      }
    },
    [allFilters, dispatch, pageLimit, searchQuery, selectedCity?._id, stateId],
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
    initialValues: selectedCity,
    validationSchema: addCitySchema,
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
          city: {
            ...allFilters?.city,
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
          city: {
            ...allFilters?.city,
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
      setSelectedCity({
        name: '',
        state_id: '',
        country_id: '62c7a4879e7f43d9cbf9027b',
        is_active: 1,
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    city_id => {
      let city = { ...cityList?.find(x => x?._id === city_id) };
      if (city) {
        city.country_id = countryCode;
        dispatch(setSelectedCity(city));
        setSaveFilterModal(true);
      }
    },
    [cityList, countryCode, dispatch],
  );

  const handleDelete = useCallback(
    async city_id => {
      if (city_id) {
        const result = await dispatch(deleteCity(city_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              city: {
                ...allFilters?.city,
                currentPage: 1,
              },
            }),
          );
          dispatch(getCityList(pageLimit, 1, stateId, searchQuery));
        }
      }
    },
    [dispatch, pageLimit, searchQuery, stateId, allFilters],
  );

  const handleCountryChange = useCallback((key, val) => {
    if (key === 'country') setCountryCode(val);
    else if (key === 'state') setStateId(val);
  }, []);

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

  const handleSearchInput = (e, state) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        city: {
          ...allFilters?.city,
          currentPage: 1,
        },
      }),
    );
    dispatch(getCityList(pageLimit, currentPage, state, e.target.value));
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
          <Row className="align-items-center g-2">
            <Col lg={6}>
              <div className="tab_content_wrap d-flex align-content-center flex-lg-nowrap flex-wrap">
                <div className="page_title">
                  <h3 className="m-0">City</h3>
                </div>
                <div className="form_group ms-sm-3 w-sm-auto w-100 mb-2 mb-sm-0">
                  <ReactSelectSingle
                    filter
                    name="countryCode"
                    value={countryCode || ''}
                    options={countryList}
                    onChange={e => handleCountryChange('country', e.value)}
                    placeholder="Country"
                  />
                </div>
                <div className="form_group ms-sm-3 w-sm-auto w-100 mb-2 mb-sm-0">
                  <ReactSelectSingle
                    filter
                    name="stateCode"
                    value={stateId || ''}
                    options={partiesState}
                    onChange={e => handleCountryChange('state', e.value)}
                    placeholder="State"
                  />
                </div>
              </div>
            </Col>
            <Col lg={6}>
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
                          debounceHandleSearchInput(e, stateId);
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              city: {
                                ...allCommon?.city,
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
                      <img src={PlusIcon} alt="plusicon" /> Add City
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
                  city: {
                    ...allCommon?.city,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={cityList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={cityFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  city: {
                    ...allCommon?.city,
                    cityFilters: event?.filters,
                  },
                }),
              );
            }}
          >
            <Column
              field="name"
              header="City "
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
            dataList={cityList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={cityCount}
          />
        </div>
        <Dialog
          header={`${selectedCity?._id ? 'Edit' : 'Add'} City`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedCity({
                name: '',
                state_id: '',
                country_id: '62c7a4879e7f43d9cbf9027b',
                is_active: 1,
              }),
            );
          }}
        >
          <div className="form_group mb-3">
            <label htmlFor="State">
              Select Country <span className="text-danger fs-4">*</span>
            </label>
            <ReactSelectSingle
              filter
              name="country_id"
              value={values?.country_id || ''}
              options={countryList}
              onChange={e => {
                setFieldValue('country_id', e.target.value);
                setCountryCode(e.target.value);
              }}
              placeholder="Country"
            />
            {touched?.country_code && errors?.country_code && (
              <p className="text-danger">{errors?.country_code}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="State">
              Select State <span className="text-danger fs-4">*</span>
            </label>
            <ReactSelectSingle
              filter
              name="state_id"
              value={values?.state_id || ''}
              options={partiesState}
              onChange={e => {
                setFieldValue('state_id', e.target.value);
              }}
              placeholder="State"
            />
            {touched?.state_id && errors?.state_id && (
              <p className="text-danger">{errors?.state_id}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="name">
              City <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Enter City Name "
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
              {selectedCity?._id ? 'Update' : 'Save'}
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
