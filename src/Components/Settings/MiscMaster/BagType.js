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
  createBagType,
  deleteBagType,
  getBagTypeList,
  updateBagType,
} from 'Services/Settings/MiscMasterService';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { addBagTypeSchema } from 'Schemas/Settings/MiscMasterSchema';
import { statusBodyTemplate } from './Warehouse';
import { setSelectedBagType } from 'Store/Reducers/Settings/MiscMasterSlice';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { uploadFile } from 'Services/CommonService';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import Loader from 'Components/Common/Loader';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';

export default function BagType({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  // const [filterToggle, setFilterToggle] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    bagTypeList,
    bagTypeCount,
    selectedBagType,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { settingsCRUDLoading } = useSelector(({ settings }) => settings);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, bagTypeFilters, filterToggle } = allCommon?.bagType;
  const { currentPage, pageLimit } = allFilters?.bagType;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getBagTypeList(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedBagType?._id) {
        const payload = {
          ...values,
          bagType_id: selectedBagType?._id,
        };
        result = await dispatch(updateBagType(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createBagType(payload));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            bagType: {
              ...allFilters?.bagType,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(
          setSelectedBagType({
            name: '',
            handle_weight: '',
            code: '',
            is_active: 1,
            conversion_rate: '',
            image: '',
          }),
        );
        dispatch(getBagTypeList(pageLimit, 1, searchQuery));
      }
    },
    [dispatch, pageLimit, searchQuery, selectedBagType?._id, allFilters],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    setFieldValue,
    setValues,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: selectedBagType,
    validationSchema: addBagTypeSchema,
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
          bagType: {
            ...allFilters?.bagType,
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
          bagType: {
            ...allFilters?.bagType,
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
      setSelectedBagType({
        name: '',
        code: '',
        is_active: 1,
        handle_weight: '',
        conversion_rate: '',
        image: '',
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    bag_type_id => {
      const bagType = bagTypeList?.find(x => x?._id === bag_type_id);
      if (bagType) {
        dispatch(setSelectedBagType(bagType));
        setSaveFilterModal(true);
      }
    },
    [bagTypeList, dispatch],
  );

  const handleDelete = useCallback(
    async bag_type_id => {
      if (bag_type_id) {
        const result = await dispatch(deleteBagType(bag_type_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              bagType: {
                ...allFilters?.bagType,
                currentPage: 1,
              },
            }),
          );
          dispatch(getBagTypeList(pageLimit, 1, searchQuery));
        }
      }
    },
    [dispatch, pageLimit, searchQuery],
  );

  const fileHandler = useCallback(
    async (key, files) => {
      const uploadedFile = files[0];

      if (files[0]) {
        const fileSizeLimit = 1 * 1024 * 1024; // 10MB limit
        const nameLength = files[0].name.split('.');

        const extension = nameLength[nameLength?.length - 1]?.toLowerCase();
        if (
          (extension !== 'png' ||
            extension !== 'jpg' ||
            extension !== 'jpeg') &&
          extension === undefined
        ) {
          toast.error('file type not supported');
        } else if (uploadedFile?.size <= fileSizeLimit) {
          const result = await dispatch(uploadFile(uploadedFile));
          if (result) {
            setValues({ ...values, [key]: result });
          }
        } else {
          toast.error('Upload company logo must not be larger than 1mb.');
        }
      }
    },
    [dispatch, setValues, values],
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
    [handleEdit, is_edit_access, is_delete_access],
  );

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        bagType: {
          ...allFilters?.bagType,
          currentPage: 1,
        },
      }),
    );
    dispatch(getBagTypeList(pageLimit, currentPage, e.target.value));
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
                <h3 className="m-0">Bag Type</h3>
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
                              bagType: {
                                ...allCommon?.bagType,
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
                      <img src={PlusIcon} alt="" /> Add Bag Type
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
                  bagType: {
                    ...allCommon?.bagType,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={bagTypeList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={
              (settingsCRUDLoading || miscMasterLoading) && (
                <Skeleton count={10} />
              )
            }
            filterDisplay="row"
            dataKey="_id"
            filters={bagTypeFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  bagType: {
                    ...allCommon?.bagType,
                    bagTypeFilters: event?.filters,
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
              field="conversion_rate"
              header="Conversion Rate "
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="handle_weight"
              header="Handle Weight "
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
            dataList={bagTypeList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={bagTypeCount}
          />
        </div>
        <Dialog
          header={`${selectedBagType?._id ? 'Edit' : 'Add'} Bag Type`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedBagType({
                name: '',
                code: '',
                is_active: 1,
                handle_weight: '',
                conversion_rate: '',
                image: '',
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
          <div className="form_group mb-3">
            <label htmlFor="conversion_rate">
              Conversion Rate <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Conversion Rate"
              id="conversion_rate"
              name="conversion_rate"
              value={values?.conversion_rate || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.conversion_rate && errors?.conversion_rate && (
              <p className="text-danger">{errors?.conversion_rate}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="handle_weight">
              Handle Weight <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Handle Weight"
              id="handle_weight"
              name="handle_weight"
              value={values?.handle_weight || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.handle_weight && errors?.handle_weight && (
              <p className="text-danger">{errors?.handle_weight}</p>
            )}
          </div>
          <div className="form_group checkbox_wrap with_input mt-0 d-flex justify-content-between">
            <div>
              <InputText
                type="file"
                id="UploadFile"
                accept=".png, .jpg, .jpeg"
                value={''}
                placeholder="Attachment"
                style={{ visibility: 'hidden', opacity: 0, display: 'none' }}
                onChange={e => fileHandler('image', e.target.files)}
              />
              <label
                htmlFor="UploadFile"
                className="cursor-pointer btn_border attachment_btn_border"
              >
                {miscMasterCRUDLoading ? (
                  'Adding...'
                ) : values?.image ? (
                  <img
                    src={values?.image}
                    alt=""
                    className="img-fluid"
                    style={{ width: '8rem' }}
                  />
                ) : (
                  'Image'
                )}
              </label>
              {touched?.image && errors?.image && (
                <p className="text-danger me-3">{errors?.image}</p>
              )}
              <span className="text-danger fs-4">*</span>
            </div>
            <div className="me-3">
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
              {selectedBagType?._id ? 'Update' : 'Save'}
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
