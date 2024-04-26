import React, { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import TrashIcon from '../../../Assets/Images/trash.svg';
import SearchIcon from '../../../Assets/Images/search.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useDispatch } from 'react-redux';
import { Tag } from 'primereact/tag';
import { getSeverity } from './Warehouse';
import { useSelector } from 'react-redux';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import _ from 'lodash';
import {
  createUnit,
  deleteUnit,
  getUnitList,
  updateUnit,
} from 'Services/Settings/MiscMasterService';
import { setSelectedUnit } from 'Store/Reducers/Settings/MiscMasterSlice';
import { useFormik } from 'formik';
import { addUnitSchema } from 'Schemas/Settings/MiscMasterSchema';
import Skeleton from 'react-loading-skeleton';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import Loader from 'Components/Common/Loader';

const statusBodyTemplate = data => {
  return (
    <Tag
      value={data?.status}
      severity={getSeverity(data?.is_active ? 'YesSuccess' : 'NoDanger')}
    />
  );
};

export default function Unit({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, unitFilters, filterToggle } = allCommon?.unit;
  const { currentPage, pageLimit } = allFilters?.unit;

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    unitList,
    unitCount,
    selectedUnit,
  } = useSelector(({ miscMaster }) => miscMaster);

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getUnitList(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit, searchQuery]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedUnit?._id) {
        const payload = {
          ...values,
          unit_id: selectedUnit?._id,
        };
        result = await dispatch(updateUnit(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createUnit(payload));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            unit: {
              ...allFilters?.unit,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(setSelectedUnit({ name: '', code: '', is_active: 1 }));
        dispatch(getUnitList(pageLimit, 1, searchQuery));
      }
    },
    [allFilters, dispatch, pageLimit, searchQuery, selectedUnit?._id],
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
    initialValues: selectedUnit,
    validationSchema: addUnitSchema,
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
          unit: {
            ...allFilters?.unit,
            currentPage: pageIndex,
          },
        }),
      );
      // setCurrentPage(pageIndex);
    },
    [currentPage, allFilters, dispatch],
  );

  const onPageRowsChange = useCallback(
    page => {
      dispatch(
        setAllFilters({
          ...allFilters,
          unit: {
            ...allFilters?.unit,
            pageLimit: page,
            currentPage: page === 0 ? 0 : 1,
          },
        }),
      );

      // setPageLimit(page);
      // setCurrentPage(page === 0 ? 0 : 1);
    },
    [allFilters, dispatch],
  );

  const onCancel = useCallback(() => {
    resetForm();
    dispatch(setSelectedUnit({ name: '', code: '', is_active: 1 }));
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    unit_id => {
      const unit = unitList?.find(x => x?._id === unit_id);
      if (unit) {
        dispatch(setSelectedUnit(unit));
        setSaveFilterModal(true);
      }
    },
    [dispatch, unitList],
  );

  const handleDelete = useCallback(
    async unit_id => {
      if (unit_id) {
        const result = await dispatch(deleteUnit(unit_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              unit: {
                ...allFilters?.unit,
                currentPage: 1,
              },
            }),
          );
          dispatch(getUnitList(pageLimit, 1, ''));
        }
      }
    },
    [dispatch, pageLimit, allFilters],
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

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        unit: {
          ...allFilters?.unit,
          currentPage: 1,
        },
      }),
    );
    dispatch(getUnitList(pageLimit, currentPage, e.target.value));
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
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Unit</h3>
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
                          debouncehandleSearchInput(e);
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              unit: {
                                ...allCommon?.unit,
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
                      <img src={PlusIcon} alt="" /> Add Unit
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
                  unit: {
                    ...allCommon?.unit,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={unitList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            filterDisplay="row"
            dataKey="_id"
            filters={unitFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  unit: {
                    ...allCommon?.unit,
                    unitFilters: event?.filters,
                  },
                }),
              );
            }}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
          >
            <Column
              field="code"
              header="Code"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="name"
              header="Name "
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
            dataList={unitList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={unitCount}
          />
        </div>
        <Dialog
          header={`${selectedUnit?._id ? 'Edit' : 'Add'} Unit`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(setSelectedUnit({ name: '', code: '', is_active: 1 }));
          }}
        >
          <div className="form_group mb-3">
            <label htmlFor="Code">
              Code <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Code"
              id="Code"
              name="code"
              value={values?.code || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.code && errors?.code && (
              <p className="text-danger">{errors?.code}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="name">
              Name <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Enter Name "
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
              {selectedUnit?._id ? 'Update' : 'Save'}
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
