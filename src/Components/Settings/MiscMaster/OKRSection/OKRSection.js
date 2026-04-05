import { InputText } from 'primereact/inputtext';
import _ from 'lodash';
import { useFormik } from 'formik';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import Skeleton from 'react-loading-skeleton';
import EditIcon from '../../../../Assets/Images/edit.svg';
import PlusIcon from '../../../../Assets/Images/plus.svg';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import ActionBtn from '../../../../Assets/Images/action.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { Dialog } from 'primereact/dialog';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import { Tag } from 'primereact/tag';
import { activeSeverity } from 'Helper/Common';
import { Checkbox } from 'primereact/checkbox';
import { OKRDetailsSchema } from 'Schemas/Settings/MiscMasterSchema';
import {
  createOKRDetails,
  deleteOKRDetails,
  getOKRDetailsList,
  updateOKRDetails,
} from 'Services/Settings/MiscMasterService';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import { Calendar } from 'primereact/calendar';
import { getUserList } from 'Services/Settings/userService';
import ReactQuillEditor from 'Components/Common/ReactQuill/ReactQuillEditor';

const initialOKRDetails = {
  date: '',
  user: '',
  objective: '',
  key_results: '',
  source: '',
  is_active: 1,
};

const OKRSection = ({ hasAccess }) => {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [deletePopup, setDeletePopup] = useState(false);
  const [OKRDetailsModal, setOKRDetailsModal] = useState(false);

  const { userList } = useSelector(({ user }) => user);
  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    OKRDetailsList,
    OKRDetailsCount,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { searchQuery, OKRFilters, filterToggle } = allCommon?.OKR;
  const { currentPage, pageLimit } = allFilters?.OKR;

  const loadList = useCallback(
    (limit = 30, current = 1, search = '') => {
      dispatch(getOKRDetailsList(limit, current, search));
    },
    [dispatch],
  );

  useEffect(() => {
    const payload = {
      limit: 0,
      start: 0,
    };

    loadList(pageLimit, currentPage, searchQuery);
    dispatch(getUserList(payload));
  }, []);

  const userOptions = useMemo(() => {
    return (
      userList.map(item => {
        return {
          label: item?.first_name,
          value: item?._id,
        };
      }) || []
    );
  }, [userList]);

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      let result;

      if (values?._id) {
        const payload = {
          ...values,
          okr_id: values?._id,
        };
        result = await dispatch(updateOKRDetails(payload));
      } else {
        result = await dispatch(createOKRDetails(values));
      }

      if (result) {
        resetForm();

        setOKRDetailsModal(false);

        loadList(pageLimit, 1, searchQuery);
      }
    },
    [dispatch, pageLimit, searchQuery, loadList],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    resetForm,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialOKRDetails,
    validationSchema: OKRDetailsSchema,
    onSubmit: submitHandle,
  });

  const handleDelete = useCallback(
    async id => {
      if (id) {
        const result = await dispatch(deleteOKRDetails(id));

        if (result) {
          setDeletePopup(false);
          resetForm();
          loadList(pageLimit, currentPage, searchQuery);
        }
      }
    },
    [dispatch, pageLimit, currentPage, searchQuery, resetForm, loadList],
  );

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          OKR: {
            ...allFilters?.OKR,
            currentPage: pageIndex,
          },
        }),
      );

      loadList(pageLimit, pageIndex, searchQuery);
    },
    [currentPage, allFilters, dispatch, loadList, pageLimit, searchQuery],
  );

  const onPageRowsChange = useCallback(
    page => {
      const updatedCurrentPage = page === 0 ? 0 : 1;
      dispatch(
        setAllFilters({
          ...allFilters,
          OKR: {
            ...allFilters?.OKR,
            pageLimit: page,
            currentPage: updatedCurrentPage,
          },
        }),
      );

      loadList(page, updatedCurrentPage, searchQuery);
    },
    [allFilters, dispatch, searchQuery, loadList],
  );

  const objectiveTemplate = data => {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: data?.objective,
        }}
        className="editor_text_wrapper editor_content"
      />
    );
  };

  const activeBodyTemplate = data => {
    return (
      <Tag
        value={data?.is_active === 1 ? 'Yes' : 'No'}
        severity={activeSeverity(data?.is_active)}
      />
    );
  };

  const dateBodyTemplate = row => {
    return row?.date ? moment(row?.date).format('DD/MM/YYYY') : '';
  };

  const handleEdit = useCallback(
    rowData => {
      const okrDetails = OKRDetailsList?.find(x => x?._id === rowData?._id);

      if (okrDetails) {
        const { date, ...restDetails } = okrDetails;

        setOKRDetailsModal(true);

        const updateData = {
          ...restDetails,
          date: new Date(date),
        };

        setValues(updateData);
      }
    },
    [setValues, OKRDetailsList],
  );

  const onCancel = useCallback(() => {
    resetForm();
    setOKRDetailsModal(false);
  }, [resetForm]);

  const itemAction = rowData => {
    const checkPermission = is_edit_access || is_delete_access;
    return (
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
              <Dropdown.Item onClick={() => handleEdit(rowData)}>
                <img src={EditIcon} alt="" /> Edit
              </Dropdown.Item>
            )}
            {is_delete_access && (
              <Dropdown.Item
                onClick={() => {
                  setDeletePopup(rowData?._id);
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
        OKR: {
          ...allFilters?.OKR,
          currentPage: 1,
        },
      }),
    );

    loadList(limit, 1, e.target.value);
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const onEditorChange = (e, name) => {
    setFieldValue(name, e);
  };

  return (
    <>
      {miscMasterCRUDLoading && <Loader />}
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap border-0">
          <Row className="align-items-center">
            <Col sm={3}>
              <div className="page_title">
                <h3 className="m-0">OKR</h3>
              </div>
            </Col>
            <Col sm={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        value={searchQuery}
                        className="input_wrap small search_wrap"
                        onChange={e => {
                          debounceHandleSearchInput(e, pageLimit);

                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              OKR: {
                                ...allCommon?.OKR,
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
                      onClick={() => {
                        if (is_create_access) {
                          setOKRDetailsModal(true);
                        }
                      }}
                      disabled={!is_create_access}
                    >
                      <img src={PlusIcon} alt="" /> Add OKR
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
                  OKR: {
                    ...allCommon?.OKR,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>

          <DataTable
            value={OKRDetailsList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={OKRFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  OKR: {
                    ...allCommon?.OKR,
                    OKRFilters: event?.filters,
                  },
                }),
              );
            }}
          >
            <Column
              field="date"
              header="Date"
              sortable
              body={dateBodyTemplate}
            ></Column>
            <Column
              field="user_name"
              header="User"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="objective"
              header="Objective"
              sortable
              filter={filterToggle}
              body={objectiveTemplate}
            ></Column>
            <Column
              field="is_active"
              header="Active"
              sortable
              body={activeBodyTemplate}
            ></Column>
            <Column field="action" header="Action" body={itemAction}></Column>
          </DataTable>
          <CustomPaginator
            dataList={OKRDetailsList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={OKRDetailsCount}
          />
        </div>

        <Dialog
          header={`${values?._id ? 'Edit' : 'Add'} OKR`}
          visible={OKRDetailsModal}
          draggable={false}
          className="modal_Wrapper modal_medium"
          onHide={() => {
            setOKRDetailsModal(false);
            resetForm();
          }}
        >
          <Row>
            <Col lg={6} md={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="Date">
                  Date <span className="text-danger fs-4">*</span>
                </label>
                <Calendar
                  id="Date"
                  placeholder="dd/mm/yyyy"
                  showIcon
                  showButtonBar
                  name="date"
                  dateFormat="dd-mm-yy"
                  value={values?.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched?.date && errors?.date && (
                  <p className="text-danger">{errors?.date}</p>
                )}
              </div>
            </Col>

            <Col lg={6} md={6}>
              <div className="form_group mb-3">
                <label htmlFor="User">
                  User <span className="text-danger fs-4">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  options={userOptions}
                  placeholder="Select User"
                  name="user_id"
                  value={values?.user_id}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.user_id && errors?.user_id && (
                  <p className="text-danger">{errors?.user_id}</p>
                )}
              </div>
            </Col>
          </Row>

          <div className="form_group mb-3">
            <label htmlFor="Objective">
              Objective <span className="text-danger fs-4">*</span>
            </label>

            <ReactQuillEditor
              name="objective"
              placeholder="Objective"
              value={values?.objective}
              onChange={e => onEditorChange(e, 'objective')}
              error={errors.objective}
              touched={touched.objective}
            />
          </div>

          <div className="form_group mb-3">
            <label htmlFor="Key Results">
              Key Results <span className="text-danger fs-4">*</span>
            </label>

            <ReactQuillEditor
              name="key_results"
              placeholder="Key Results"
              value={values?.key_results}
              onChange={e => onEditorChange(e, 'key_results')}
              error={errors.key_results}
              touched={touched.key_results}
            />
          </div>

          <div className="form_group mb-3">
            <label htmlFor="Source">
              Source <span className="text-danger fs-4">*</span>
            </label>

            <ReactQuillEditor
              name="source"
              placeholder="Source"
              value={values?.source}
              onChange={e => onEditorChange(e, 'source')}
              error={errors.source}
              touched={touched.source}
            />
          </div>

          <div className="d-flex">
            <div className="form_group checkbox_wrap with_input mt-0 me-3">
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
              onClick={() => handleSubmit(values)}
            >
              {values?._id ? 'Update' : 'Save'}
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

export default memo(OKRSection);
