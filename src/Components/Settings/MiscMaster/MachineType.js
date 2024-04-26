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
  createMachineType,
  deleteMachineType,
  getActiveBagTypeList,
  getActivePrintTechnologyList,
  getMachineTypeList,
  updateMachineType,
} from 'Services/Settings/MiscMasterService';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { addMachineTypeSchema } from 'Schemas/Settings/MiscMasterSchema';
import { statusBodyTemplate } from './Warehouse';
import { setSelectedMachineType } from 'Store/Reducers/Settings/MiscMasterSlice';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import Skeleton from 'react-loading-skeleton';
import Loader from 'Components/Common/Loader';
import { MultiSelect } from 'primereact/multiselect';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';

export default function MachineType({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    machineTypeList,
    machineTypeCount,
    selectedMachineType,
    activeBagTypeList,
    activePrintTechnologyList,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { settingsCRUDLoading } = useSelector(({ settings }) => settings);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { currentPage, pageLimit } = allFilters?.machineType;
  const { searchQuery, machineTypeFilters, filterToggle } =
    allCommon?.machineType;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getMachineTypeList(pageLimit, currentPage, searchQuery));
      loadRequiredData();
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const loadRequiredData = useCallback(() => {
    dispatch(getActiveBagTypeList());
    dispatch(getActivePrintTechnologyList());
  }, [dispatch]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedMachineType?._id) {
        const payload = {
          ...values,
          machineType_id: selectedMachineType?._id,
        };
        result = await dispatch(updateMachineType(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createMachineType(payload));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            machineType: {
              ...allFilters?.machineType,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(
          setSelectedMachineType({
            name: '',
            code: '',
            is_active: 1,
            bag_type_id: [],
            printing_technology_id: [],
          }),
        );
        dispatch(getMachineTypeList(pageLimit, 1, searchQuery));
      }
    },
    [dispatch, pageLimit, searchQuery, selectedMachineType?._id],
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
    initialValues: selectedMachineType,
    validationSchema: addMachineTypeSchema,
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
          machineType: {
            ...allFilters?.machineType,
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
          machineType: {
            ...allFilters?.machineType,
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
      setSelectedMachineType({
        name: '',
        code: '',
        is_active: 1,
        bag_type_id: [],
        printing_technology_id: [],
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    machine_type_id => {
      const machineType = machineTypeList?.find(
        x => x?._id === machine_type_id,
      );
      if (machineType) {
        dispatch(setSelectedMachineType(machineType));
        setSaveFilterModal(true);
      }
    },
    [machineTypeList, dispatch],
  );

  const handleDelete = useCallback(
    async machineType_id => {
      if (machineType_id) {
        const result = await dispatch(deleteMachineType(machineType_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              machineType: {
                ...allFilters?.machineType,
                currentPage: 1,
              },
            }),
          );
          dispatch(getMachineTypeList(pageLimit, 1, searchQuery));
        }
      }
    },
    [dispatch, pageLimit, searchQuery, allFilters],
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
        machineType: {
          ...allFilters?.machineType,
          currentPage: 1,
        },
      }),
    );
    dispatch(getMachineTypeList(pageLimit, currentPage, e.target.value));
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
                <h3 className="m-0">Machine Type</h3>
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
                              machineType: {
                                ...allCommon?.machineType,
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
                      <img src={PlusIcon} alt="" /> Add Machine Type
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
                  machineType: {
                    ...allCommon?.machineType,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={machineTypeList}
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
            filters={machineTypeFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  machineType: {
                    ...allCommon?.machineType,
                    machineTypeFilters: event?.filters,
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
              field="bag_type_str"
              header="Bag Type"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="printing_technology_str"
              header="Printing Technology"
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
            dataList={machineTypeList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={machineTypeCount}
          />
        </div>
        <Dialog
          header={`${selectedMachineType?._id ? 'Edit' : 'Add'} Machine Type`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedMachineType({
                name: '',
                code: '',
                is_active: 1,
                bag_type_id: [],
                printing_technology_id: [],
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
              Bag Type <span className="text-danger fs-4">*</span>
            </label>
            {/* <InputText
              placeholder="Conversion Rate"
              id="conversion_rate"
              name="conversion_rate"
              value={values?.conversion_rate || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            /> */}
            <MultiSelect
              filter
              name="bag_type_id"
              value={values?.bag_type_id || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Show Bag Type"
              // disabled={locationPath?.[1] === 'product-details'}
              options={activeBagTypeList}
              optionLabel="name"
              className="w-100"
            />
            {touched?.bag_type_id && errors?.bag_type_id && (
              <p className="text-danger">{errors?.bag_type_id}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="handle_weight">
              Printing Technology <span className="text-danger fs-4">*</span>
            </label>
            {/* <InputText
              placeholder="Handle Weight"
              id="handle_weight"
              name="handle_weight"
              value={values?.handle_weight || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            /> */}
            <MultiSelect
              filter
              name="printing_technology_id"
              value={values?.printing_technology_id || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Show Printing Technology"
              // disabled={locationPath?.[1] === 'product-details'}
              options={activePrintTechnologyList}
              optionLabel="name"
              className="w-100"
            />
            {touched?.printing_technology_id &&
              errors?.printing_technology_id && (
                <p className="text-danger">{errors?.printing_technology_id}</p>
              )}
          </div>
          <div className="form_group checkbox_wrap with_input mt-0 d-flex justify-content-between">
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
              {selectedMachineType?._id ? 'Update' : 'Save'}
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
