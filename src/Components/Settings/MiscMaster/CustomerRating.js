import { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
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
  createCustomerRating,
  deleteCustomerRating,
  getCustomerRating,
  updateCustomerRating,
} from 'Services/Settings/MiscMasterService';
import { Tag } from 'primereact/tag';
import { useFormik } from 'formik';
import { addCustomerRatingSchema } from 'Schemas/Settings/MiscMasterSchema';
import { setSelectedCustomerRating } from 'Store/Reducers/Settings/MiscMasterSlice';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import Skeleton from 'react-loading-skeleton';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import Loader from 'Components/Common/Loader';
import { Checkbox } from 'primereact/checkbox';

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

export default function CustomerRating({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    selectedCustomerRating,
    customerRatingList,
    customerRatingCount,
  } = useSelector(({ miscMaster }) => miscMaster);

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, customerRatingFilters, filterToggle } =
    allCommon?.customerRating;
  const { currentPage, pageLimit } = allFilters?.customerRating;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getCustomerRating(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
  }, [currentPage, pageLimit]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedCustomerRating?._id) {
        const payload = {
          ...values,
          customerRating_id: values?._id,
        };
        result = await dispatch(updateCustomerRating(payload));
      } else {
        result = await dispatch(createCustomerRating(values));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            customerRating: {
              ...allFilters?.customerRating,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(
          setSelectedCustomerRating({
            star_rating: '',
            percentage: '',
            is_active: 1,
          }),
        );
        resetForm();
        dispatch(getCustomerRating(pageLimit, 1, searchQuery));
      }
    },
    [dispatch, pageLimit, searchQuery, selectedCustomerRating?._id, allFilters],
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
    initialValues: selectedCustomerRating,
    validationSchema: addCustomerRatingSchema,
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
          customerRating: {
            ...allFilters?.customerRating,
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
          customerRating: {
            ...allFilters?.customerRating,
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
      setSelectedCustomerRating({
        star_rating: '',
        percentage: '',
        is_active: 1,
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    warehouse_id => {
      const velcro = customerRatingList?.find(x => x?._id === warehouse_id);
      if (velcro) {
        dispatch(setSelectedCustomerRating(velcro));
        setSaveFilterModal(true);
      }
    },
    [dispatch, customerRatingList],
  );

  const handleDelete = useCallback(
    async customerRating_id => {
      if (customerRating_id) {
        const result = await dispatch(deleteCustomerRating(customerRating_id));
        if (result) {
          setDeletePopup(false);
          resetForm();
          dispatch(
            setAllFilters({
              ...allFilters,
              customerRating: {
                ...allFilters?.customerRating,
                currentPage: 1,
              },
            }),
          );
          dispatch(getCustomerRating(pageLimit, 1, ''));
        }
      }
    },
    [dispatch, pageLimit, resetForm, allFilters],
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

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        customerRating: {
          ...allFilters?.customerRating,
          currentPage: 1,
        },
      }),
    );
    dispatch(getCustomerRating(pageLimit, currentPage, e.target.value));
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
                <h3 className="m-0">Customer Rating</h3>
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
                          debouncehandleSearchInput(e);
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              customerRating: {
                                ...allCommon?.customerRating,
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
                      <img src={PlusIcon} alt="" /> Add Rating
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
                  velcro: {
                    ...allCommon?.velcro,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={customerRatingList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={customerRatingFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  velcro: {
                    ...allCommon?.velcro,
                    customerRatingFilters: event?.filters,
                  },
                }),
              );
            }}
          >
            <Column
              field="star_rating"
              header="Name"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="percentage"
              header="Percentage"
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
            dataList={customerRatingList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={customerRatingCount}
          />
        </div>
        <Dialog
          header={`${selectedCustomerRating?._id ? 'Edit' : 'Add'} Rating`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedCustomerRating({
                star_rating: '',
                percentage: '',
                is_active: 1,
              }),
            );
          }}
        >
          <div className="form_group mb-3">
            <label htmlFor="Size1">
              Name <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Name"
              name="star_rating"
              value={values?.star_rating || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.star_rating && errors?.star_rating && (
              <p className="text-danger">{errors?.star_rating}</p>
            )}
          </div>

          <div className="form_group mb-3">
            <label htmlFor="Size">
              Percentage <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              type="number"
              placeholder="Percentage"
              name="percentage"
              value={values?.percentage || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.percentage && errors?.percentage && (
              <p className="text-danger">{errors?.percentage}</p>
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
              onClick={() => {
                handleSubmit(values);
              }}
            >
              {selectedCustomerRating?._id ? 'Update' : 'Save'}
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
