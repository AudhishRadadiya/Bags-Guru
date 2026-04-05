import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import Loader from 'Components/Common/Loader';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import EditIcon from '../../../../Assets/Images/edit.svg';
import PlusIcon from '../../../../Assets/Images/plus.svg';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import ActionBtn from '../../../../Assets/Images/action.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import _ from 'lodash';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import { customerRevenueTierSchema } from 'Schemas/Settings/MiscMasterSchema';
import {
  createCustomerRevenueTier,
  deleteCustomerRevenueTier,
  getCustomerRevenueTierList,
  updateCustomerRevenueTier,
} from 'Services/Settings/MiscMasterService';
import moment from 'moment';
import { Tag } from 'primereact/tag';
import { activeSeverity, colorOptions } from 'Helper/Common';

const initialCustomerRevenueTier = {
  tier_name: '',
  min_revenue: 0,
  max_revenue: 0,
  BackgroundColorCode: '#000000',
  is_active: 1,
};

const CustomerRevenueTier = ({ hasAccess }) => {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [deletePopup, setDeletePopup] = useState(false);
  const [customerRevenueTierModal, setCustomerRevenueTierModal] =
    useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    customerRevenueTierList,
    customerRevenueTierCount,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { searchQuery, customerRevenueTierFilters, filterToggle } =
    allCommon?.customerRevenueTier;
  const { currentPage, pageLimit } = allFilters?.customerRevenueTier;

  const loadList = useCallback(
    (limit = 30, current = 1, search = '') => {
      dispatch(getCustomerRevenueTierList(limit, current, search));
    },
    [dispatch],
  );

  useEffect(() => {
    loadList(pageLimit, currentPage, searchQuery);
  }, []);

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      let result;
      if (values?._id) {
        const payload = {
          ...values,
          revenueTier_id: values?._id,
        };
        result = await dispatch(updateCustomerRevenueTier(payload));
      } else {
        result = await dispatch(createCustomerRevenueTier(values));
      }

      if (result) {
        resetForm();

        setCustomerRevenueTierModal(false);

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
    initialValues: initialCustomerRevenueTier,
    validationSchema: customerRevenueTierSchema,
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
          customerRevenueTier: {
            ...allFilters?.customerRevenueTier,
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
          customerRevenueTier: {
            ...allFilters?.customerRevenueTier,
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
    setCustomerRevenueTierModal(false);
  }, [resetForm]);

  const handleDelete = useCallback(
    async id => {
      if (id) {
        const result = await dispatch(deleteCustomerRevenueTier(id));

        if (result) {
          setDeletePopup(false);
          resetForm();
          loadList(pageLimit, currentPage, searchQuery);
        }
      }
    },
    [dispatch, pageLimit, currentPage, searchQuery, resetForm, loadList],
  );

  const handleSearchInput = (e, limit) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        customerRevenueTier: {
          ...allFilters?.customerRevenueTier,
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

  const createdAtBodyTemplate = row => {
    return row?.created_at ? moment(row?.created_at).format('DD/MM/YYYY') : '';
  };

  const ColorBodyTemplate = row => {
    return (
      <div className="d-flex align-items-center gap-2">
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            backgroundColor: row.BackgroundColorCode,
            border: '1px solid #ccc',
          }}
        ></div>
        <span>{row.BackgroundColorCode}</span>
      </div>
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

  const handleEdit = useCallback(
    rowData => {
      const customerRevenueTier = customerRevenueTierList?.find(
        x => x?._id === rowData?._id,
      );

      if (customerRevenueTier) {
        setCustomerRevenueTierModal(true);

        setValues(customerRevenueTier);
      }
    },
    [setValues, customerRevenueTierList],
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

  return (
    <>
      {miscMasterCRUDLoading && <Loader />}
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap border-0">
          <Row className="align-items-center">
            <Col sm={3}>
              <div className="page_title">
                <h3 className="m-0">Customer Revenue Tier</h3>
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
                              customerRevenueTier: {
                                ...allCommon?.customerRevenueTier,
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
                          setCustomerRevenueTierModal(true);
                          //   dispatch(getUnassignedAdvisorsList());
                          //   dispatch(setUnassignedAdvisorsList([]));
                        }
                      }}
                      disabled={!is_create_access}
                    >
                      <img src={PlusIcon} alt="" /> Add Customer Revenue Tier
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
                  customerRevenueTier: {
                    ...allCommon?.customerRevenueTier,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>

          <DataTable
            value={customerRevenueTierList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={customerRevenueTierFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  customerRevenueTier: {
                    ...allCommon?.customerRevenueTier,
                    customerRevenueTierFilters: event?.filters,
                  },
                }),
              );
            }}
          >
            <Column
              field="tier_name"
              header="Tier Name"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="BackgroundColorCode"
              header="Color Code"
              sortable
              filter={filterToggle}
              body={ColorBodyTemplate}
            ></Column>
            <Column
              field="min_revenue"
              header="Min Revenue"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="max_revenue"
              header="Max Revenue"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="created_at"
              header="Created At"
              sortable
              body={createdAtBodyTemplate}
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
            dataList={customerRevenueTierList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={customerRevenueTierCount}
          />
        </div>

        <Dialog
          header={`${values?._id ? 'Edit' : 'Add'} Customer Revenue Tier`}
          visible={customerRevenueTierModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setCustomerRevenueTierModal(false);
            resetForm();
          }}
        >
          <div className="form_group mb-3">
            <label htmlFor="Tier Name">
              Tier Name <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Tier Name"
              id="Tier Name"
              name="tier_name"
              value={values?.tier_name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.tier_name && errors?.tier_name && (
              <p className="text-danger">{errors?.tier_name}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="Min Revenue">
              Min Revenue <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              type="number"
              placeholder="Min Revenue"
              id="Min Revenue"
              name="min_revenue"
              value={values?.min_revenue}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.min_revenue && errors?.min_revenue && (
              <p className="text-danger">{errors?.min_revenue}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="max_revenue">
              Max Revenue <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              type="number"
              id="Max Revenue"
              placeholder="Max Revenue"
              name="max_revenue"
              value={values?.max_revenue}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.max_revenue && errors?.max_revenue && (
              <p className="text-danger">{errors?.max_revenue}</p>
            )}
          </div>
          {/* <div className="form_group mb-3">
            <label htmlFor="color-picker">Select Background Color</label>
            <div className="d-flex align-items-center bg_color_picker_wrap">
              <ColorPicker
                id="color-picker"
                name="BackgroundColorCode"
                value={values?.BackgroundColorCode}
                onChange={handleChange}
                defaultColor="#000000"
              />
              <p className="m-0">
                <b>#{values?.BackgroundColorCode}</b>
              </p>
            </div>
          </div> */}

          <div className="form_group mb-3">
            <label htmlFor="Size">
              Background Color Code <span className="text-danger fs-4">*</span>
            </label>
            <ReactSelectSingle
              filter
              options={colorOptions}
              placeholder="Select Background Color Code"
              name="BackgroundColorCode"
              value={values?.BackgroundColorCode}
              onBlur={handleBlur}
              onChange={handleChange}
              required
              itemTemplate={option => (
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      backgroundColor: option.value,
                      border: '1px solid #ccc',
                    }}
                  ></div>
                  <span>{option.label}</span>
                </div>
              )}
            />
            {touched?.BackgroundColorCode && errors?.BackgroundColorCode && (
              <p className="text-danger">{errors?.BackgroundColorCode}</p>
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
};

export default memo(CustomerRevenueTier);
