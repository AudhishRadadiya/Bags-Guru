import React, { useCallback, useEffect, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import { statusBodyTemplate } from './Warehouse';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setSelectedPrintTechnology } from 'Store/Reducers/Settings/MiscMasterSlice';
import { addPrintTechnologySchema } from 'Schemas/Settings/MiscMasterSchema';
import _ from 'lodash';
import {
  createPrintTechnology,
  deletePrintTechnology,
  getPrintTechnologyList,
  updatePrintTechnology,
} from 'Services/Settings/MiscMasterService';
import Skeleton from 'react-loading-skeleton';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import Loader from 'Components/Common/Loader';

export default function PrintTechnology({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    printTechnologyList,
    printTechnologyCount,
    selectedPrintTechnology,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, printingTechnologyFilters, filterToggle } =
    allCommon?.printingTechnology;
  const { currentPage, pageLimit } = allFilters?.printingTechnology;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getPrintTechnologyList(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedPrintTechnology?._id) {
        const payload = {
          ...values,
          printTechnology_id: selectedPrintTechnology?._id,
        };
        result = await dispatch(updatePrintTechnology(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createPrintTechnology(payload));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            printingTechnology: {
              ...allFilters?.printingTechnology,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(
          setSelectedPrintTechnology({
            name: '',
            code: '',
            is_active: 1,
            conversion_rate: '',
          }),
        );
        dispatch(getPrintTechnologyList(pageLimit, 1, searchQuery));
      }
    },
    [dispatch, pageLimit, searchQuery, selectedPrintTechnology?._id],
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
    initialValues: selectedPrintTechnology,
    validationSchema: addPrintTechnologySchema,
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
          printingTechnology: {
            ...allFilters?.printingTechnology,
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
          printingTechnology: {
            ...allFilters?.printingTechnology,
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
      setSelectedPrintTechnology({
        name: '',
        code: '',
        is_active: 1,
        conversion_rate: '',
      }),
    );
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    printTechnology_id => {
      const printTechnology = printTechnologyList?.find(
        x => x?._id === printTechnology_id,
      );
      if (printTechnology) {
        dispatch(setSelectedPrintTechnology(printTechnology));
        setSaveFilterModal(true);
      }
    },
    [dispatch, printTechnologyList],
  );

  const handleDelete = useCallback(
    async printTechnology_id => {
      if (printTechnology_id) {
        const result = await dispatch(
          deletePrintTechnology(printTechnology_id),
        );
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              printingTechnology: {
                ...allFilters?.printingTechnology,
                currentPage: 1,
              },
            }),
          );
          dispatch(getPrintTechnologyList(pageLimit, 1, ''));
        }
      }
    },
    [dispatch, pageLimit, allFilters],
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
        printingTechnology: {
          ...allFilters?.printingTechnology,
          currentPage: 1,
        },
      }),
    );
    dispatch(getPrintTechnologyList(pageLimit, currentPage, e.target.value));
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
            <Col md={4}>
              <div className="page_title">
                <h3 className="m-0">Printing Technology</h3>
              </div>
            </Col>
            <Col md={8}>
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
                              printingTechnology: {
                                ...allCommon?.printingTechnology,
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
                      <img src={PlusIcon} alt="" /> Add Printing Technology
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
                  printingTechnology: {
                    ...allCommon?.printingTechnology,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={printTechnologyList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={printingTechnologyFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  printingTechnology: {
                    ...allCommon?.printingTechnology,
                    printingTechnologyFilters: event?.filters,
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
              field="status"
              header="Active"
              sortable
              filter={filterToggle}
              body={statusBodyTemplate}
            ></Column>
            <Column field="action" header="Action" body={itemAction}></Column>
          </DataTable>
          <CustomPaginator
            dataList={printTechnologyList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={printTechnologyCount}
          />
        </div>
        <Dialog
          header={`${
            selectedPrintTechnology?._id ? 'Edit' : 'Add'
          } Printing Technology`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(
              setSelectedPrintTechnology({
                name: '',
                code: '',
                is_active: 1,
                conversion_rate: '',
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
              {selectedPrintTechnology?._id ? 'Update' : 'Save'}
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
