import { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
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
import CustomPaginator from 'Components/Common/CustomPaginator';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import {
  createWarehouse,
  deleteWarehouse,
  getWarehouseList,
  updateWarehouse,
} from 'Services/Settings/MiscMasterService';
import { Tag } from 'primereact/tag';
import { useFormik } from 'formik';
import { addWarehouseSchema } from 'Schemas/Settings/MiscMasterSchema';
import { setSelectedWarehouse } from 'Store/Reducers/Settings/MiscMasterSlice';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import Skeleton from 'react-loading-skeleton';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import Loader from 'Components/Common/Loader';

export const getSeverity = status => {
  switch (status) {
    case 'YesWarning':
      return 'warning';
    case 'YesSuccess':
      return 'success';
    case 'NoDanger':
      return 'danger';
    default:
      return null;
  }
};

export const statusBodyTemplate = data => {
  return (
    <Tag
      value={data?.status}
      severity={getSeverity(data?.is_active ? 'YesSuccess' : 'NoDanger')}
    />
  );
};

export default function Warehouse({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    selectedWarehouse,
    warehouseList,
    warehouseCount,
  } = useSelector(({ miscMaster }) => miscMaster);

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, warehouseFilters, filterToggle } = allCommon?.warehouse;
  const { currentPage, pageLimit } = allFilters?.warehouse;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getWarehouseList(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedWarehouse?._id) {
        const payload = {
          ...values,
          warehouse_id: selectedWarehouse?._id,
        };
        result = await dispatch(updateWarehouse(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createWarehouse(payload));
      }
      if (result) {
        resetForm();
        setSaveFilterModal(false);
        dispatch(
          setSelectedWarehouse({
            name: '',
            code: '',
            is_default: 0,
            is_active: 1,
          }),
        );
        dispatch(getWarehouseList(pageLimit, 1, searchQuery));
      }
    },
    [dispatch, pageLimit, searchQuery, selectedWarehouse?._id],
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
  } = useFormik({
    enableReinitialize: true,
    initialValues: selectedWarehouse,
    validationSchema: addWarehouseSchema,
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
          warehouse: {
            ...allFilters?.warehouse,
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
          warehouse: {
            ...allFilters?.warehouse,
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
    dispatch(
      setSelectedWarehouse({
        name: '',
        code: '',
        is_default: 0,
        is_active: 1,
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    warehouse_id => {
      const warehouse = warehouseList?.find(x => x?._id === warehouse_id);
      if (warehouse) {
        dispatch(setSelectedWarehouse(warehouse));
        setSaveFilterModal(true);
      }
    },
    [dispatch, warehouseList],
  );

  const handleDelete = useCallback(
    async warehouse_id => {
      if (warehouse_id) {
        const result = await dispatch(deleteWarehouse(warehouse_id));
        if (result) {
          setDeletePopup(false);
          resetForm();
          dispatch(getWarehouseList(pageLimit, 1, ''));
        }
      }
    },
    [dispatch, pageLimit, resetForm],
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

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        warehouse: {
          ...allFilters?.warehouse,
          currentPage: 1,
        },
      }),
    );
    dispatch(getWarehouseList(pageLimit, currentPage, e.target.value));
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
                <h3 className="m-0">Warehouse</h3>
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
                          debouncehandleSearchInput(e);
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              warehouse: {
                                ...allCommon?.warehouse,
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
                      <img src={PlusIcon} alt="" /> Add Warehouse
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
                  warehouse: {
                    ...allCommon?.warehouse,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={warehouseList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={warehouseFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  warehouse: {
                    ...allCommon?.warehouse,
                    warehouseFilters: event?.filters,
                  },
                }),
              );
            }}
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
            dataList={warehouseList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={warehouseCount}
          />
        </div>
        <Dialog
          header={`${selectedWarehouse?._id ? 'Edit' : 'Add'} Warehouse`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedWarehouse({
                name: '',
                code: '',
                is_default: 0,
                is_active: 1,
              }),
            );
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
            {warehouseList?.filter(x => x?.is_default === 1)?.length ===
            1 ? null : (
              <div className="form_group checkbox_wrap with_input mt-0">
                <Checkbox
                  value={values?.is_default}
                  inputId="is_default"
                  name="is_default"
                  checked={values?.is_default === 1}
                  onChange={e =>
                    setFieldValue('is_default', e.target.checked ? 1 : 0)
                  }
                />
                <label htmlFor="is_default">Default </label>
                {touched?.is_default && errors?.is_default && (
                  <p className="text-danger"> {errors?.is_default}</p>
                )}
              </div>
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
              {selectedWarehouse?._id ? 'Update' : 'Save'}
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
