import { InputText } from 'primereact/inputtext';
import _ from 'lodash';
import { useFormik } from 'formik';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import PlusIcon from '../../../Assets/Images/plus.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import SearchIcon from '../../../Assets/Images/search.svg';
import { DataTable } from 'primereact/datatable';
import Skeleton from 'react-loading-skeleton';
import { Column } from 'primereact/column';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { Dialog } from 'primereact/dialog';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import { useDispatch } from 'react-redux';
import { MultiSelect } from 'primereact/multiselect';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { Calendar } from 'primereact/calendar';
import { useSelector } from 'react-redux';
import {
  setExhibitionData,
  setExhibitionList,
  setExhibitionListCount,
} from 'Store/Reducers/Settings/MiscMasterSlice';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { exhibitionSchema } from 'Schemas/Settings/MiscMasterSchema';
import {
  getPartiesAdvisor,
  getPartiesCustomerSourceDetail,
} from 'Services/partiesService';
import {
  addExhibitionData,
  deleteExhibitionData,
  getExhibitionList,
  updateExhibitionData,
} from 'Services/Settings/MiscMasterService';
import moment from 'moment';

const initialValues = {
  name: '',
  year: '',
  budget: '',
  leads_acquired: '',
  advisor_id: '',
  linked_customer_source_detail: '',
};

const ExhibitionMaster = ({ hasAccess }) => {
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const dispatch = useDispatch();

  const [deletePopup, setDeletePopup] = useState(false);
  const [saveFilterModal, setSaveFilterModal] = useState(false);

  const {
    miscMasterLoading,
    exhibitionListCount,
    exhibitionList,
    exhibitionData,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { partiesAdvisor, partiesCustomerSourceDetail } = useSelector(
    ({ parties }) => parties,
  );
  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { searchQuery, exhibitionFilters, filterToggle } =
    allCommon?.exhibition;
  const { currentPage, pageLimit } = allFilters?.exhibition;

  const fetchRequiredData = useCallback(
    (limit = 30, page = 1, search = '') => {
      dispatch(getExhibitionList(limit, page, search));
    },
    [dispatch],
  );

  useEffect(() => {
    fetchRequiredData(pageLimit, currentPage, searchQuery);
    dispatch(getPartiesAdvisor());
    dispatch(getPartiesCustomerSourceDetail());
  }, [dispatch]);

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      let result;

      const modifiedPayload = {
        ...values,
        year: moment(values.year).year(),
      };

      if (exhibitionData?._id) {
        const payload = {
          ...modifiedPayload,
          exhibition_id: values?._id,
        };

        result = await dispatch(updateExhibitionData(payload));
      } else {
        result = await dispatch(addExhibitionData(modifiedPayload));
      }

      if (result) {
        dispatch(
          setAllFilters({
            ...allFilters,
            exhibition: {
              ...allFilters?.exhibition,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(setExhibitionData(initialValues));
        resetForm();
        dispatch(fetchRequiredData(pageLimit, 1, searchQuery));
      }
    },
    [
      dispatch,
      pageLimit,
      searchQuery,
      exhibitionData,
      allFilters,
      fetchRequiredData,
    ],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    resetForm,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: exhibitionData,
    validationSchema: exhibitionSchema,
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
          exhibition: {
            ...allFilters?.exhibition,
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
          exhibition: {
            ...allFilters?.exhibition,
            pageLimit: page,
            currentPage: page === 0 ? 0 : 1,
          },
        }),
      );
    },
    [allFilters, dispatch],
  );

  const handleDelete = useCallback(
    async exhibition_id => {
      if (exhibition_id) {
        const payload = {
          _id: exhibition_id,
        };

        const result = await dispatch(deleteExhibitionData(payload));

        if (result) {
          setDeletePopup(false);
          resetForm();
          dispatch(
            setAllFilters({
              ...allFilters,
              exhibition: {
                ...allFilters?.exhibition,
                currentPage: 1,
              },
            }),
          );
          dispatch(getExhibitionList(pageLimit, 1, ''));
        }
      }
    },
    [allFilters, dispatch, pageLimit, resetForm],
  );

  const onCancel = useCallback(() => {
    resetForm();
    dispatch(setExhibitionData(initialValues));
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    id => {
      let exhibition = exhibitionList?.find(x => x?._id === id);

      exhibition = {
        ...exhibition,
        year: moment(`${exhibition.year}-01-01`).toDate(),
      };

      if (exhibition) {
        dispatch(setExhibitionData(exhibition));
        setSaveFilterModal(true);
      }
    },
    [dispatch, exhibitionList],
  );

  const itemAction = ({ _id, is_default }) => {
    const checkPermission = is_edit_access || is_delete_access;
    return is_default ? null : (
      <div className="edit_row">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle className="ection_btn" disabled={!checkPermission}>
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
  };

  const handleSearchInput = (e, limit) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        customerRating: {
          ...allFilters?.customerRating,
          currentPage: 1,
        },
      }),
    );

    dispatch(setExhibitionList([]));
    dispatch(setExhibitionListCount(0));
    dispatch(getExhibitionList(limit, 1, e.target.value));
  };

  const debouncehandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap border-0">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Exhibition Master</h3>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li className="search_input_wrap">
                    <div className="form_group">
                      <InputText
                        placeholder="Search"
                        type="search"
                        value={searchQuery}
                        className="input_wrap small search_wrap"
                        onChange={e => {
                          debouncehandleSearchInput(e, pageLimit);
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              exhibition: {
                                ...allCommon?.exhibition,
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
                      onClick={() =>
                        is_create_access && setSaveFilterModal(true)
                      }
                      disabled={!is_create_access}
                    >
                      <img src={PlusIcon} alt="" /> Add Exhibition
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
            onClick={() => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  exhibition: {
                    ...allCommon?.exhibition,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={exhibitionList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading && <Skeleton count={10} />}
            filterDisplay="row"
            dataKey="_id"
            filters={exhibitionFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  exhibition: {
                    ...allCommon?.exhibition,
                    exhibitionFilters: event?.filters,
                  },
                }),
              );
            }}
          >
            <Column
              field="name"
              header="Exhibition Name"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="year"
              header="Year"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="budget"
              header="Budget"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="leads_acquired"
              header="Leads Acquired"
              sortable
              filter={filterToggle}
            ></Column>
            <Column field="action" header="Action" body={itemAction}></Column>
          </DataTable>
          <CustomPaginator
            dataList={exhibitionList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={exhibitionListCount}
          />
        </div>

        <Dialog
          header={`${exhibitionData?._id ? 'Edit' : 'Add'} Exhibition`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_medium "
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(setExhibitionData(initialValues));
          }}
        >
          <Row>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Size1">
                  Name <span className="text-danger fs-4">*</span>
                </label>
                <InputText
                  placeholder="Exhibition Name"
                  name="name"
                  value={values?.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched?.name && errors?.name && (
                  <p className="text-danger">{errors?.name}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Size">
                  Year <span className="text-danger fs-4">*</span>
                </label>
                <Calendar
                  name="year"
                  placeholder="select year"
                  value={values?.year}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  view="year"
                  dateFormat="yy"
                  className="w-100"
                />
                {touched?.year && errors?.year && (
                  <p className="text-danger">{errors?.year}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Size">
                  Budget <span className="text-danger fs-4">*</span>
                </label>
                <InputText
                  type="number"
                  placeholder="Enter budget"
                  name="budget"
                  value={values?.budget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched?.budget && errors?.budget && (
                  <p className="text-danger">{errors?.budget}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Size1">
                  Leads Acquired<span className="text-danger fs-4">*</span>
                </label>
                <InputText
                  type="number"
                  placeholder="Leads Acquired"
                  name="leads_acquired"
                  value={values?.leads_acquired}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched?.leads_acquired && errors?.leads_acquired && (
                  <p className="text-danger">{errors?.leads_acquired}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Size">
                  Advisor Names <span className="text-danger fs-4">*</span>
                </label>
                <MultiSelect
                  filter
                  options={partiesAdvisor}
                  name="advisor_id"
                  placeholder="Color Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.advisor_id}
                  className="w-100"
                  maxSelectedLabels={3}
                />
                {touched?.advisor_id && errors?.advisor_id && (
                  <p className="text-danger">{errors?.advisor_id}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Size">
                  Link to Customer Source Detail{' '}
                  <span className="text-danger fs-4">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  options={partiesCustomerSourceDetail}
                  placeholder="Select Link to Customer Source Detail"
                  name="linked_customer_source_detail"
                  value={values?.linked_customer_source_detail}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.linked_customer_source_detail &&
                  errors?.linked_customer_source_detail && (
                    <p className="text-danger">
                      {errors?.linked_customer_source_detail}
                    </p>
                  )}
              </div>
            </Col>
          </Row>
          <div className="button_group d-flex align-items-center justify-content-end pt-3">
            <button
              type="button"
              className="btn_border btn btn-primary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn_primary ms-3 btn btn-primary"
              onClick={() => {
                handleSubmit(values);
              }}
            >
              {exhibitionData?._id ? 'Update' : 'Save'}
            </button>
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

export default memo(ExhibitionMaster);
