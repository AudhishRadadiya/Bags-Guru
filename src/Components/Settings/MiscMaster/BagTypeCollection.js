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
import _ from 'lodash';
import {
  createBagTypeCollection,
  deleteBagTypeCollection,
  getActiveBagTypeList,
  getBagTypeCollectionList,
  updateBagTypeCollection,
} from 'Services/Settings/MiscMasterService';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { addBagTypeCollection } from 'Schemas/Settings/MiscMasterSchema';
import { statusBodyTemplate } from './Warehouse';
import { setSelectedBagTypeCollection } from 'Store/Reducers/Settings/MiscMasterSlice';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import Skeleton from 'react-loading-skeleton';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import Loader from 'Components/Common/Loader';

const bagTypeTemplate = ({ order_no }) => {
  return <span>{order_no}</span>;
};

export default function BagTypeCollection({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    bagTypeCollectionList,
    bagTypeCollectionCount,
    selectedBagTypeCollection,
    activeBagTypeList,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { currentPage, pageLimit } = allFilters?.bagCollection;
  const { searchQuery, bagCollectionFilters, filterToggle } =
    allCommon?.bagCollection;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getBagTypeCollectionList(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  useEffect(() => {
    dispatch(getActiveBagTypeList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedBagTypeCollection?._id) {
        const payload = {
          ...values,
          bagTypeCollection_id: selectedBagTypeCollection?._id,
        };
        result = await dispatch(updateBagTypeCollection(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createBagTypeCollection(payload));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            bagCollection: {
              ...allFilters?.bagCollection,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(
          setSelectedBagTypeCollection({
            name: '',
            is_active: 1,
            order_no: '',
          }),
        );
        dispatch(getBagTypeCollectionList(pageLimit, 1, ''));
      }
    },
    [dispatch, pageLimit, selectedBagTypeCollection?._id],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: selectedBagTypeCollection,
    validationSchema: addBagTypeCollection,
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
          bagCollection: {
            ...allFilters?.bagCollection,
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
          bagCollection: {
            ...allFilters?.bagCollection,
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
      setSelectedBagTypeCollection({
        name: '',
        is_active: 1,
        order_no: '',
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    order_no => {
      const bagType = bagTypeCollectionList?.find(x => x?._id === order_no);
      if (bagType) {
        dispatch(setSelectedBagTypeCollection(bagType));
        setSaveFilterModal(true);
      }
    },
    [bagTypeCollectionList, dispatch],
  );

  const handleDelete = useCallback(
    async bagTypeCollection_id => {
      if (bagTypeCollection_id) {
        const result = await dispatch(
          deleteBagTypeCollection(bagTypeCollection_id),
        );
        if (result) {
          setDeletePopup(false);
          resetForm();
          dispatch(
            setAllFilters({
              ...allFilters,
              bagCollection: {
                ...allFilters?.bagCollection,
                currentPage: 1,
              },
            }),
          );
          dispatch(getBagTypeCollectionList(pageLimit, 1, ''));
        }
      }
    },
    [dispatch, pageLimit, resetForm, allFilters],
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
        bagCollection: {
          ...allFilters?.bagCollection,
          currentPage: 1,
        },
      }),
    );
    dispatch(getBagTypeCollectionList(pageLimit, currentPage, e.target.value));
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
                <h3 className="m-0">Bag Collection</h3>
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
                              bagCollection: {
                                ...allCommon?.bagCollection,
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
                      <img src={PlusIcon} alt="" /> Add Bag Collection
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
                  bagCollection: {
                    ...allCommon?.bagCollection,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={bagTypeCollectionList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={bagCollectionFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  bagCollection: {
                    ...allCommon?.bagCollection,
                    bagCollectionFilters: event?.filters,
                  },
                }),
              );
            }}
          >
            <Column
              field="order_no"
              header="Sorting Order"
              sortable
              filter={filterToggle}
              body={bagTypeTemplate}
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
            dataList={bagTypeCollectionList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={bagTypeCollectionCount}
          />
        </div>
        <Dialog
          header={`${
            selectedBagTypeCollection?._id ? 'Edit' : 'Add'
          } Bag Collection`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedBagTypeCollection({
                name: '',
                is_active: 1,
                order_no: '',
              }),
            );
          }}
        >
          <div className="form_group mb-3">
            <label htmlFor="order_no">
              Sorting Order <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              name="order_no"
              type="number"
              min={0}
              value={values?.order_no || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Sorting Order "
              className="w-100"
            />
            {touched?.order_no && errors?.order_no && (
              <p className="text-danger">{errors?.order_no}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="name">
              Collection Name <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Enter Collection Name "
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
          <div className="me-3">
            <Checkbox
              className="me-2"
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
              {selectedBagTypeCollection?._id ? 'Update' : 'Save'}
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
