import { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import PlusIcon from '../../../../Assets/Images/plus.svg';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import EditIcon from '../../../../Assets/Images/edit.svg';
import ActionBtn from '../../../../Assets/Images/action.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import {
  createHandleMaterial,
  deleteHandleMaterial,
  getHandleMaterialList,
  updateHandleMaterial,
} from 'Services/Settings/MiscMasterService';
import { Tag } from 'primereact/tag';
import { useFormik } from 'formik';
import { addHandleMaterialSchema } from 'Schemas/Settings/MiscMasterSchema';
import { setSelectedHandleMaterial } from 'Store/Reducers/Settings/MiscMasterSlice';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import { getSeverity } from '../Warehouse';
import Skeleton from 'react-loading-skeleton';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import Loader from 'Components/Common/Loader';

export const statusBodyTemplate = data => {
  return (
    <Tag
      value={data?.status}
      severity={getSeverity(data?.is_active ? 'YesSuccess' : 'NoDanger')}
    />
  );
};

export default function HandleMaterial({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    handleMaterialCount,
    handleMaterialList,
    selectedHandleMaterial,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, handleMaterialFilters, filterToggle } =
    allCommon?.handleMaterial;
  const { currentPage, pageLimit } = allFilters?.handleMaterial;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getHandleMaterialList(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedHandleMaterial?._id) {
        const payload = {
          ...values,
          handle_material_id: selectedHandleMaterial?._id,
        };
        result = await dispatch(updateHandleMaterial(payload));
      } else {
        const payload = {
          ...values,
          conversion_rate: Number(values?.conversion_rate),
        };
        result = await dispatch(createHandleMaterial(payload));
      }
      if (result) {
        setSaveFilterModal(false);
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            handleMaterial: {
              ...allFilters?.handleMaterial,
              currentPage: 1,
            },
          }),
        );
        dispatch(
          setSelectedHandleMaterial({
            name: '',
            conversion_rate: '',
            is_active: 1,
          }),
        );
        dispatch(getHandleMaterialList(pageLimit, 1, searchQuery));
      }
    },
    [dispatch, pageLimit, searchQuery, selectedHandleMaterial?._id, allFilters],
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
    initialValues: selectedHandleMaterial,
    validationSchema: addHandleMaterialSchema,
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
          handleMaterial: {
            ...allFilters?.handleMaterial,
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
          handleMaterial: {
            ...allFilters?.handleMaterial,
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
      setSelectedHandleMaterial({
        name: '',
        conversion_rate: '',
        is_active: 1,
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    handle_material_id => {
      const customerGroup = handleMaterialList?.find(
        x => x?._id === handle_material_id,
      );
      if (customerGroup) {
        dispatch(setSelectedHandleMaterial(customerGroup));
        setSaveFilterModal(true);
      }
    },
    [dispatch, handleMaterialList],
  );

  const handleDelete = useCallback(
    async handle_material_id => {
      if (handle_material_id) {
        const result = await dispatch(deleteHandleMaterial(handle_material_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              handleMaterial: {
                ...allFilters?.handleMaterial,
                currentPage: 1,
              },
            }),
          );
          dispatch(getHandleMaterialList(pageLimit, 1, searchQuery));
        }
      }
    },
    [dispatch, pageLimit, searchQuery, allFilters],
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
        handleMaterial: {
          ...allFilters?.handleMaterial,
          currentPage: 1,
        },
      }),
    );
    dispatch(getHandleMaterialList(pageLimit, currentPage, e.target.value));
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
                <h3 className="m-0">Handle Material</h3>
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
                              handleMaterial: {
                                ...allCommon?.handleMaterial,
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
                      <img src={PlusIcon} alt="" /> Add Handle Material
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
                  handleMaterial: {
                    ...allCommon?.handleMaterial,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={handleMaterialList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={handleMaterialFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  handleMaterial: {
                    ...allCommon?.handleMaterial,
                    handleMaterialFilters: event?.filters,
                  },
                }),
              );
            }}
          >
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
              field="status"
              header="Active"
              sortable
              filter={filterToggle}
              body={statusBodyTemplate}
            ></Column>
            <Column field="action" header="Action" body={itemAction}></Column>
          </DataTable>
          <CustomPaginator
            dataList={handleMaterialList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={handleMaterialCount}
          />
        </div>
        <Dialog
          header={`${
            selectedHandleMaterial?._id ? 'Edit' : 'Add'
          } Handle Material`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedHandleMaterial({
                name: '',
                conversion_rate: '',
                is_active: 1,
              }),
            );
          }}
        >
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
              {selectedHandleMaterial?._id ? 'Update' : 'Save'}
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
