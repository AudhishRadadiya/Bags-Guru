import { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import PlusIcon from '../../../../Assets/Images/plus.svg';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import EditIcon from '../../../../Assets/Images/edit.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import ActionBtn from '../../../../Assets/Images/action.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import {
  createPatchCylinder,
  deletePatchCylinder,
  getPatchCylinderList,
  updatePatchCylinder,
} from 'Services/Settings/MiscMasterService';
import { Tag } from 'primereact/tag';
import { useFormik } from 'formik';
import { addPatchCylinderSchema } from 'Schemas/Settings/MiscMasterSchema';
import { setSelectedPatchCylinder } from 'Store/Reducers/Settings/MiscMasterSlice';
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

export default function PatchCylinder({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    patchCylinderCount,
    patchCylinderList,
    selectedPatchCylinder,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, patchCylinderFilters, filterToggle } =
    allCommon?.patchCylinder;
  const { currentPage, pageLimit } = allFilters?.patchCylinder;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getPatchCylinderList(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedPatchCylinder?._id) {
        const payload = {
          ...values,
          patch_cylinder_id: selectedPatchCylinder?._id,
        };
        result = await dispatch(updatePatchCylinder(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createPatchCylinder(payload));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            patchCylinder: {
              ...allFilters?.patchCylinder,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(
          setSelectedPatchCylinder({
            name: '',
            is_active: 1,
            width: '',
            cylinder: '',
          }),
        );
        dispatch(getPatchCylinderList(pageLimit, 1, searchQuery));
      }
    },
    [dispatch, pageLimit, searchQuery, selectedPatchCylinder?._id, allFilters],
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
    initialValues: selectedPatchCylinder,
    validationSchema: addPatchCylinderSchema,
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
          patchCylinder: {
            ...allFilters?.patchCylinder,
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
          patchCylinder: {
            ...allFilters?.patchCylinder,
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
      setSelectedPatchCylinder({
        name: '',
        is_active: 1,
        width: '',
        cylinder: '',
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    patch_cylinder_id => {
      const patchCylinder = patchCylinderList?.find(
        x => x?._id === patch_cylinder_id,
      );
      if (patchCylinder) {
        dispatch(setSelectedPatchCylinder(patchCylinder));
        setSaveFilterModal(true);
      }
    },
    [dispatch, patchCylinderList],
  );

  const handleDelete = useCallback(
    async patch_cylinder_id => {
      if (patch_cylinder_id) {
        const result = await dispatch(deletePatchCylinder(patch_cylinder_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              patchCylinder: {
                ...allFilters?.patchCylinder,
                currentPage: 1,
              },
            }),
          );
          dispatch(getPatchCylinderList(pageLimit, 1, searchQuery));
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
        patchCylinder: {
          ...allFilters?.patchCylinder,
          currentPage: 1,
        },
      }),
    );
    dispatch(getPatchCylinderList(pageLimit, currentPage, e.target.value));
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
                <h3 className="m-0">Patch Cylinder</h3>
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
                              patchCylinder: {
                                ...allCommon?.patchCylinder,
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
                      <img src={PlusIcon} alt="" /> Add Patch Cylinder
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
                  patchCylinder: {
                    ...allCommon?.patchCylinder,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={patchCylinderList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={patchCylinderFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  patchCylinder: {
                    ...allCommon?.patchCylinder,
                    patchCylinderFilters: event?.filters,
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
              field="width"
              header="Cylinder Width(mm)"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="cylinder"
              header="Circum(mm)"
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
            dataList={patchCylinderList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={patchCylinderCount}
          />
        </div>
        <Dialog
          header={`${
            selectedPatchCylinder?._id ? 'Edit' : 'Add'
          } Patch Cylinder`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedPatchCylinder({
                name: '',
                is_active: 1,
                width: '',
                cylinder: '',
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
            <label htmlFor="width">Cylinder Width(mm)</label>
            <InputText
              placeholder="Enter Cylinder Width(mm)"
              id="width"
              name="width"
              value={values?.width || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.width && errors?.width && (
              <p className="text-danger">{errors?.width}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="Cylinder">Circum(mm)</label>
            <InputText
              placeholder="Enter Circum(mm)"
              id="Cylinder"
              name="cylinder"
              value={values?.cylinder || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.cylinder && errors?.cylinder && (
              <p className="text-danger">{errors?.cylinder}</p>
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
              {selectedPatchCylinder?._id ? 'Update' : 'Save'}
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
