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
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import {
  createBank,
  deleteBank,
  getBankList,
  updateBank,
} from 'Services/Settings/MiscMasterService';
import { setSelectedBank } from 'Store/Reducers/Settings/MiscMasterSlice';
import { useFormik } from 'formik';
import { addBankSchema } from 'Schemas/Settings/MiscMasterSchema';
import { statusBodyTemplate } from './Warehouse';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import { uploadFile } from 'Services/CommonService';
import Loader from 'Components/Common/Loader';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';

export default function Bank({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_edit_access, is_delete_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    selectedBank,
    bankList,
    bankCount,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { settingsCRUDLoading } = useSelector(({ settings }) => settings);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, bankFilters, filterToggle } = allCommon?.bank;
  const { currentPage, pageLimit } = allFilters?.bank;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getBankList(pageLimit, currentPage, searchQuery));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedBank?._id) {
        const payload = {
          ...values,
          bank_id: selectedBank?._id,
        };
        result = await dispatch(updateBank(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createBank(payload));
      }
      if (result) {
        resetForm();
        dispatch(
          setAllFilters({
            ...allFilters,
            bank: {
              ...allFilters?.bank,
              currentPage: 1,
            },
          }),
        );
        setSaveFilterModal(false);
        dispatch(setSelectedBank({ name: '', code: '', is_active: 1 }));
        dispatch(getBankList(pageLimit, 1, searchQuery));
      }
    },
    [allFilters, dispatch, pageLimit, searchQuery, selectedBank?._id],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    setValues,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: selectedBank,
    validationSchema: addBankSchema,
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
          bank: {
            ...allFilters?.bank,
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
          bank: {
            ...allFilters?.bank,
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
    dispatch(setSelectedBank({ name: '', code: '', is_active: 1 }));
    setSaveFilterModal(false);
  }, [dispatch, resetForm]);

  const handleEdit = useCallback(
    bank_id => {
      const bank = bankList?.find(x => x?._id === bank_id);
      if (bank) {
        dispatch(setSelectedBank(bank));
        setSaveFilterModal(true);
      }
    },
    [bankList, dispatch],
  );

  const handleDelete = useCallback(
    async bank_id => {
      if (bank_id) {
        const result = await dispatch(deleteBank(bank_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            setAllFilters({
              ...allFilters,
              bank: {
                ...allFilters?.bank,
                currentPage: 1,
              },
            }),
          );
          dispatch(getBankList(pageLimit, 1, searchQuery));
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

  const fileHandler = useCallback(
    async (key, files) => {
      const uploadedFile = files[0];

      if (files[0]) {
        const fileSizeLimit = 1 * 1024 * 1024; // 1MB limit
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

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        bank: {
          ...allFilters?.bank,
          currentPage: 1,
        },
      }),
    );
    dispatch(getBankList(pageLimit, currentPage, e.target.value));
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
                <h3 className="m-0">Bank</h3>
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
                              bank: {
                                ...allCommon?.bank,
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
                      <img src={PlusIcon} alt="" /> Add Bank
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
                  bank: {
                    ...allCommon?.bank,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={bankList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            filterDisplay="row"
            dataKey="_id"
            filters={bankFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  bank: {
                    ...allCommon?.bank,
                    bankFilters: event?.filters,
                  },
                }),
              );
            }}
            emptyMessage={
              (settingsCRUDLoading || miscMasterLoading) && (
                <Skeleton count={10} />
              )
            }
          >
            <Column
              field="code"
              header="Code"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="name"
              header="Bank Name "
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="account_name"
              header="Account Name"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="account_number"
              header="Account Number"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="IFSC_code"
              header="IFSC Code"
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
            dataList={bankList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={bankCount}
          />
        </div>
        <Dialog
          header={`${selectedBank?._id ? 'Edit' : 'Add'} Bank`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();
            dispatch(setSelectedBank({ name: '', code: '', is_active: 1 }));
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
              Bank Name <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Enter Bank Name "
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
            <label htmlFor="accName">
              Account Name <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Enter Account Name "
              id="accName"
              name="account_name"
              value={values?.account_name || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.account_name && errors?.account_name && (
              <p className="text-danger">{errors?.account_name}</p>
            )}
          </div>

          <div className="form_group mb-3">
            <label htmlFor="acc">
              Account Number <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Enter Account Number "
              id="acc"
              name="account_number"
              value={values?.account_number || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.account_number && errors?.account_number && (
              <p className="text-danger">{errors?.account_number}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="IFSC_code">
              IFSC Code <span className="text-danger fs-4">*</span>
            </label>
            <InputText
              placeholder="Enter IFSC Code "
              id="IFSC_code"
              name="IFSC_code"
              value={values?.IFSC_code || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched?.IFSC_code && errors?.IFSC_code && (
              <p className="text-danger">{errors?.IFSC_code}</p>
            )}
          </div>
          <div className="form_group checkbox_wrap with_input mt-0 d-flex justify-content-between">
            <div>
              <InputText
                type="file"
                id="payment_Qrcode"
                accept=".png, .jpg, .jpeg"
                value={''}
                placeholder="Attachment"
                style={{ visibility: 'hidden', opacity: 0, display: 'none' }}
                onChange={e => fileHandler('payment_Qrcode', e.target.files)}
              />
              <label
                htmlFor="payment_Qrcode"
                className="cursor-pointer btn_border attachment_btn_border"
              >
                {miscMasterCRUDLoading ? (
                  'Adding...'
                ) : values?.payment_Qrcode ? (
                  <img
                    src={values?.payment_Qrcode}
                    alt=""
                    className="img-fluid bank-qrcode"
                    style={{ width: '8rem' }}
                  />
                ) : (
                  'Image'
                )}
              </label>
              <span className="text-danger fs-4">*</span>
              {touched?.payment_Qrcode && errors?.payment_Qrcode && (
                <p className="text-danger">{errors?.payment_Qrcode}</p>
              )}
            </div>
            <div className="me-2">
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
            {bankList?.filter(x => x?.is_default === true)?.length ===
            1 ? null : (
              <div className="me-2">
                <Checkbox
                  value={values?.is_default}
                  inputId="is_default"
                  name="is_default"
                  checked={values?.is_default === 1}
                  onChange={e =>
                    setFieldValue('is_default', e.target.checked ? 1 : 0)
                  }
                />
                <label htmlFor="Create1">Default </label>
                {touched?.is_default && errors?.is_default && (
                  <p className="text-danger"> {errors?.is_default}</p>
                )}
              </div>
            )}
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
              {selectedBank?._id ? 'Update' : 'Save'}
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
