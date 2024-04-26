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
  createMachines,
  deleteMachines,
  getActiveMachineTypeList,
  getMachineList,
  updateMachines,
} from 'Services/Settings/MiscMasterService';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { addMachinesSchema } from 'Schemas/Settings/MiscMasterSchema';
import { statusBodyTemplate } from './Warehouse';
import { setSelectedMachines } from 'Store/Reducers/Settings/MiscMasterSlice';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import Skeleton from 'react-loading-skeleton';
import Loader from 'Components/Common/Loader';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { InputNumber } from 'primereact/inputnumber';
import { covertDMYIntoLocalFormat, getFormattedDate } from 'Helper/Common';

export default function Machines({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    machinesList,
    // machineTypeCount,
    machinesCount,
    selectedMachines,
    activeMachineTypeList,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { settingsCRUDLoading } = useSelector(({ settings }) => settings);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { currentPage, pageLimit } = allFilters?.machines;
  const { searchQuery, machinesFilters, filterToggle } = allCommon?.machines;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getMachineList(pageLimit, currentPage, searchQuery));
      loadRequiredData();
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const loadRequiredData = useCallback(() => {
    dispatch(getActiveMachineTypeList());
  }, [dispatch]);

  const submitHandle = useCallback(
    async values => {
      let result;
      const formattedPurchaseDate = getFormattedDate(
        new Date(values.purchase_date),
      );

      if (selectedMachines?._id) {
        // const payload = {
        //   ...values,
        //   machineType_id: selectedMachines?._id,
        // };
        const findedMachineNameCode = activeMachineTypeList.find(
          item => item._id === values.machine_type_id,
        );
        const Obj = {
          machines_id: selectedMachines?._id,
          code: findedMachineNameCode?.code,
          name: values?.name,
          machine_type_id: values?.machine_type_id,
          purchase_date: formattedPurchaseDate,
          speed: values.speed,
          is_active: 1,
        };
        result = await dispatch(updateMachines(Obj));
      } else {
        const payload = {
          ...values,
          purchase_date: formattedPurchaseDate,
        };
        result = await dispatch(createMachines(payload));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            machines: {
              ...allFilters?.machines,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(
          setSelectedMachines({
            name: '',
            code: '',
            is_active: 1,
            machine_type_id: '',
            speed: '',
            purchase_date: null,
          }),
        );
        dispatch(getMachineList(pageLimit, 1, searchQuery));
      }
    },
    [
      dispatch,
      pageLimit,
      searchQuery,
      selectedMachines?._id,
      activeMachineTypeList,
      allFilters,
    ],
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
    initialValues: selectedMachines,
    validationSchema: addMachinesSchema,
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
          machines: {
            ...allFilters?.machines,
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
          machines: {
            ...allFilters?.machines,
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
      setSelectedMachines({
        name: '',
        code: '',
        is_active: 1,
        machine_type_id: '',
        purchase_date: null,
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    machine_id => {
      const bagType = machinesList?.find(x => x?._id === machine_id);
      const edit_purchase_date = covertDMYIntoLocalFormat(
        bagType?.purchase_date,
      );
      const edited_bagType = {
        ...bagType,
        purchase_date: edit_purchase_date,
      };
      if (edited_bagType) {
        dispatch(setSelectedMachines(edited_bagType));
        setSaveFilterModal(true);
      }
    },
    [machinesList, dispatch],
  );

  const handleDelete = useCallback(
    async machine_id => {
      if (machine_id) {
        const result = await dispatch(deleteMachines(machine_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              machines: {
                ...allFilters?.machines,
                currentPage: 1,
              },
            }),
          );
          dispatch(getMachineList(pageLimit, 1, searchQuery));
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
        machines: {
          ...allFilters?.machines,
          currentPage: 1,
        },
      }),
    );
    dispatch(getMachineList(pageLimit, currentPage, e.target.value));
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
                <h3 className="m-0">Machines</h3>
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
                              machines: {
                                ...allCommon?.machines,
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
                      <img src={PlusIcon} alt="" /> Add Machines
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
                  machines: {
                    ...allCommon?.machines,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={machinesList}
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
            filters={machinesFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  machines: {
                    ...allCommon?.machines,
                    machinesFilters: event?.filters,
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
              field="machine_type_name"
              header="Machine Type"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="purchase_date"
              header="Purchase Date"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="speed"
              header="Speed (Per Day Bag)"
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
            dataList={machinesList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={machinesCount}
          />
        </div>
        <Dialog
          header={`${selectedMachines?._id ? 'Edit' : 'Add'} Machine`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedMachines({
                name: '',
                code: '',
                is_active: 1,
                machine_type_id: '',
                purchase_date: null,
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
              Machine Type <span className="text-danger fs-4">*</span>
            </label>
            <ReactSelectSingle
              filter
              name="machine_type_id"
              value={values?.machine_type_id || ''}
              options={activeMachineTypeList}
              onChange={e => {
                setFieldValue('machine_type_id', e.target.value);
              }}
              placeholder="Machine Type"
            />
            {/* <MultiSelect
              filter
              name="machine_type_id"
              value={values?.machine_type_id || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Show Machine Type"
              // disabled={locationPath?.[1] === 'product-details'}
              options={activeMachineTypeList}
              optionLabel="name"
              className="w-100"
            /> */}
            {touched?.machine_type_id && errors?.machine_type_id && (
              <p className="text-danger">{errors?.machine_type_id}</p>
            )}
          </div>

          <div className="form_group mb-3">
            <label htmlFor="name">
              Speed (Per Day Bag) <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              type="number"
              placeholder="Enter Speed "
              id="speed"
              name="speed"
              value={values?.speed || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.speed && errors?.speed && (
              <p className="text-danger">{errors?.speed}</p>
            )}
          </div>

          <div className="form_group date_select_wrapper mb-3">
            <label htmlFor="handle_weight">
              Purchase Date <span className="text-danger fs-4">*</span>
            </label>

            <Calendar
              id="purchase_date"
              placeholder="Purchase Date"
              showIcon
              selectionMode="single"
              readOnlyInput
              name="purchase_date"
              showButtonBar
              dateFormat="dd-mm-yy"
              value={values?.purchase_date}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {touched?.purchase_date && errors?.purchase_date && (
              <p className="text-danger">{errors?.purchase_date}</p>
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
              {selectedMachines?._id ? 'Update' : 'Save'}
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
