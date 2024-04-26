import { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import PlusIcon from '../../../../Assets/Images/plus.svg';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import EditIcon from '../../../../Assets/Images/edit.svg';
import ActionBtn from '../../../../Assets/Images/action.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import {
  createFabricColor,
  deleteFabricColor,
  getFabricColorList,
  updateFabricColor,
} from 'Services/Settings/MiscMasterService';
import { Tag } from 'primereact/tag';
import { useFormik } from 'formik';
import { addFabricColorSchema } from 'Schemas/Settings/MiscMasterSchema';
import { setSelectedFabricColor } from 'Store/Reducers/Settings/MiscMasterSlice';
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

export default function FabricColor({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    fabricColorCount,
    fabricColorList,
    selectedFabricColor,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, fabricColorFilters, filterToggle } =
    allCommon?.fabricColor;
  const { currentPage, pageLimit } = allFilters?.fabricColor;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getFabricColorList(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit, searchQuery]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedFabricColor?._id) {
        const payload = {
          ...values,
          fabric_color_id: selectedFabricColor?._id,
        };
        result = await dispatch(updateFabricColor(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createFabricColor(payload));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            fabricColor: {
              ...allFilters?.fabricColor,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(setSelectedFabricColor({ name: '', code: '', is_active: 1 }));
        dispatch(getFabricColorList(pageLimit, 1, searchQuery));
      }
    },
    [dispatch, pageLimit, searchQuery, selectedFabricColor?._id, allFilters],
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
    initialValues: selectedFabricColor,
    validationSchema: addFabricColorSchema,
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
          fabricColor: {
            ...allFilters?.fabricColor,
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
          fabricColor: {
            ...allFilters?.fabricColor,
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
    dispatch(setSelectedFabricColor({ name: '', code: '', is_active: 1 }));
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    fabric_color_id => {
      const fabricColor = fabricColorList?.find(
        x => x?._id === fabric_color_id,
      );
      if (fabricColor) {
        dispatch(setSelectedFabricColor(fabricColor));
        setSaveFilterModal(true);
      }
    },
    [dispatch, fabricColorList],
  );

  const handleDelete = useCallback(
    async fabric_color_id => {
      if (fabric_color_id) {
        const result = await dispatch(deleteFabricColor(fabric_color_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              fabricColor: {
                ...allFilters?.fabricColor,
                currentPage: 1,
              },
            }),
          );
          dispatch(getFabricColorList(pageLimit, 1, searchQuery));
        }
      }
    },
    [dispatch, pageLimit, searchQuery, allFilters],
  );

  const itemAction = ({ _id, is_default }) => {
    const checkPermission = is_edit_access || is_delete_access;
    return is_default ? null : (
      <div className="edit_row">
        <Dropdown className="dropdown_common">
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
        fabricColor: {
          ...allFilters?.fabricColor,
          currentPage: 1,
        },
      }),
    );
    dispatch(getFabricColorList(pageLimit, currentPage, e.target.value));
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
                <h3 className="m-0">Fabric Color</h3>
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
                              fabricColor: {
                                ...allCommon?.fabricColor,
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
                      <img src={PlusIcon} alt="" /> Add Fabric Color
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
                  fabricColor: {
                    ...allCommon?.fabricColor,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={fabricColorList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={fabricColorFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  fabricColor: {
                    ...allCommon?.fabricColor,
                    fabricColorFilters: event?.filters,
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
              field="code"
              header="Color Code"
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
            dataList={fabricColorList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={fabricColorCount}
          />
        </div>
        <Dialog
          header={`${selectedFabricColor?._id ? 'Edit' : 'Add'} Fabric Color`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedFabricColor({ name: '', code: '', is_active: 1 }),
            );
          }}
        >
          <div className="form_group mb-3">
            <label htmlFor="Code">
              Color Code<span className="text-danger fs-4">*</span>
            </label>
            <input
              type="color"
              className="w-100 border-0 rounded"
              id="Code"
              name="code"
              value={values?.code || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <p className="text-center">
              {values?.code ? values?.code : `#0000`}
            </p>
            {touched?.code && errors?.code && (
              <p className="text-danger">{errors?.code}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="Name">
              Name <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Enter Name "
              id="Name"
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
              {selectedFabricColor?._id ? 'Update' : 'Save'}
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
