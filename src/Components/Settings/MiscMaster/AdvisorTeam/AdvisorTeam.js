import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import Loader from 'Components/Common/Loader';
import _ from 'lodash';
import { useFormik } from 'formik';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import EditIcon from '../../../../Assets/Images/edit.svg';
import PlusIcon from '../../../../Assets/Images/plus.svg';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import ActionBtn from '../../../../Assets/Images/action.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { advisorTeamSchema } from 'Schemas/Settings/MiscMasterSchema';
import {
  createAdvisorTeam,
  deleteAdvisorTeam,
  getAdvisorTeamList,
  getUnassignedAdvisorsList,
  updateAdvisorTeam,
} from 'Services/Settings/MiscMasterService';
import { Tag } from 'primereact/tag';
import { getDateWithTime } from 'Helper/Common';
import { MultiSelect } from 'primereact/multiselect';
import { getPartiesAdvisor } from 'Services/partiesService';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { setUnassignedAdvisorsList } from 'Store/Reducers/Settings/MiscMasterSlice';

const initialAdvisorTeamData = {
  team_name: '',
  manager: '',
  members: [],
  is_active: 1,
};

const getSeverity = status => {
  switch (status) {
    case 1:
      return 'success';
    case 0:
      return 'danger';
    default:
      return null;
  }
};

export const activeBodyTemplate = data => {
  return (
    <Tag
      value={data?.is_active === 1 ? 'Yes' : 'No'}
      severity={getSeverity(data?.is_active)}
    />
  );
};

export const createdAtBodyTemplate = data => {
  return data?.created_at ? getDateWithTime(data?.created_at) : '';
};

export default function AdvisorTeam({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const { partiesAdvisor } = useSelector(({ parties }) => parties);

  const [deletePopup, setDeletePopup] = useState(false);
  const [advisorTeamModal, setAdvisorTeamModal] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    advisorTeamList,
    advisorTeamCount,
    unassignedAdvisorsList,
  } = useSelector(({ miscMaster }) => miscMaster);

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, advisorTeamFilters, filterToggle } =
    allCommon?.advisorTeam;
  const { currentPage, pageLimit } = allFilters?.advisorTeam;

  const loadList = useCallback(
    (limit = 30, current = 1, search = '') => {
      dispatch(getAdvisorTeamList(limit, current, search));
    },
    [dispatch],
  );

  useEffect(() => {
    loadList(pageLimit, currentPage, searchQuery);
    dispatch(getPartiesAdvisor());
  }, []);

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      let result;
      if (values?._id) {
        const payload = {
          ...values,
          advisor_team_id: values?._id,
        };
        result = await dispatch(updateAdvisorTeam(payload));
      } else {
        result = await dispatch(createAdvisorTeam(values));
      }

      if (result) {
        resetForm();
        setAdvisorTeamModal(false);
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
    initialValues: initialAdvisorTeamData,
    validationSchema: advisorTeamSchema,
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
          advisorTeam: {
            ...allFilters?.advisorTeam,
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
          advisorTeam: {
            ...allFilters?.advisorTeam,
            pageLimit: page,
            currentPage: updatedCurrentPage,
          },
        }),
      );

      loadList(page, updatedCurrentPage, searchQuery);
    },
    [allFilters, dispatch, searchQuery, loadList],
  );

  const onCancel = useCallback(() => {
    resetForm();
    setAdvisorTeamModal(false);
  }, [resetForm]);

  const handleEdit = useCallback(
    rowData => {
      const advisorTeam = advisorTeamList?.find(x => x?._id === rowData?._id);

      if (advisorTeam) {
        setAdvisorTeamModal(true);

        setValues(rowData);

        dispatch(getUnassignedAdvisorsList({ team_id: rowData?._id }));

        dispatch(setUnassignedAdvisorsList([]));
      }
    },
    [advisorTeamList, dispatch, setValues],
  );

  const handleDelete = useCallback(
    async advisor_team_id => {
      if (advisor_team_id) {
        const result = await dispatch(deleteAdvisorTeam(advisor_team_id));
        if (result) {
          setDeletePopup(false);
          resetForm();
          loadList(pageLimit, currentPage, searchQuery);
        }
      }
    },
    [dispatch, pageLimit, currentPage, searchQuery, resetForm, loadList],
  );

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
        advisorTeam: {
          ...allFilters?.advisorTeam,
          currentPage: 1,
        },
      }),
    );

    loadList(limit, 1, e.target.value);
  };

  const debouncehandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {miscMasterCRUDLoading && <Loader />}
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap border-0">
          <Row className="align-items-center">
            <Col sm={3}>
              <div className="page_title">
                <h3 className="m-0">Advisor Team</h3>
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
                          debouncehandleSearchInput(e, pageLimit);

                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              advisorTeam: {
                                ...allCommon?.advisorTeam,
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
                          setAdvisorTeamModal(true);
                          dispatch(getUnassignedAdvisorsList());
                          dispatch(setUnassignedAdvisorsList([]));
                        }
                      }}
                      disabled={!is_create_access}
                    >
                      <img src={PlusIcon} alt="" /> Add Advisor Team
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
                  advisorTeam: {
                    ...allCommon?.advisorTeam,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={advisorTeamList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={advisorTeamFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  advisorTeam: {
                    ...allCommon?.advisorTeam,
                    advisorTeamFilters: event?.filters,
                  },
                }),
              );
            }}
          >
            <Column
              field="team_name"
              header="Team Name"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="created_at"
              header="Created At"
              sortable
              filter={filterToggle}
              body={createdAtBodyTemplate}
            ></Column>
            <Column
              field="is_active"
              header="Active"
              sortable
              filter={filterToggle}
              body={activeBodyTemplate}
            ></Column>
            <Column field="action" header="Action" body={itemAction}></Column>
          </DataTable>
          <CustomPaginator
            dataList={advisorTeamList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={advisorTeamCount}
          />
        </div>
        <Dialog
          header={`${values?._id ? 'Edit' : 'Add'} Advisor Team`}
          visible={advisorTeamModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setAdvisorTeamModal(false);
            resetForm();
          }}
        >
          <div className="form_group mb-3">
            <label htmlFor="Code">
              Team Name <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Team Name"
              id="Team Name"
              name="team_name"
              value={values?.team_name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.team_name && errors?.team_name && (
              <p className="text-danger">{errors?.team_name}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="Size">
              Manager <span className="text-danger fs-4">*</span>
            </label>
            <ReactSelectSingle
              filter
              options={partiesAdvisor}
              placeholder="Select Manager"
              name="manager"
              value={values?.manager}
              onBlur={handleBlur}
              onChange={handleChange}
              required
            />
            {touched?.manager && errors?.manager && (
              <p className="text-danger">{errors?.manager}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="Size">
              Members <span className="text-danger fs-4">*</span>
            </label>
            <MultiSelect
              filter
              options={unassignedAdvisorsList}
              name="members"
              placeholder="Members"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values?.members}
              className="w-100"
              maxSelectedLabels={3}
            />
            {touched?.members && errors?.members && (
              <p className="text-danger">{errors?.members}</p>
            )}
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
}
