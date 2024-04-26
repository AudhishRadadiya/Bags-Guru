import { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import SearchIcon from '../../../../Assets/Images/search.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  createAddressType,
  getAddressTypeList,
  updateAddressType,
} from 'Services/Settings/MiscMasterService';
import { Tag } from 'primereact/tag';
import { useFormik } from 'formik';
import { addAddressTypeSchema } from 'Schemas/Settings/MiscMasterSchema';
import { setSelectedAddressType } from 'Store/Reducers/Settings/MiscMasterSlice';
import { getSeverity } from '../Warehouse';
import Skeleton from 'react-loading-skeleton';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';

export const statusBodyTemplate = data => {
  return (
    <Tag
      value={data?.status}
      severity={getSeverity(data?.is_active ? 'YesSuccess' : 'NoDanger')}
    />
  );
};

export default function AddressType() {
  const dispatch = useDispatch();

  const [saveFilterModal, setSaveFilterModal] = useState(false);

  const {
    miscMasterLoading,
    miscMasterCRUDLoading,
    addressTypeCount,
    addressTypeList,
    selectedAddressType,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { currentPage, pageLimit } = allFilters?.addressType;
  const { addressTypeFilters, filterToggle } = allCommon?.addressType;

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getAddressTypeList(pageLimit, currentPage));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (selectedAddressType?._id) {
        const payload = {
          ...values,
          addressType_id: selectedAddressType?._id,
        };
        result = await dispatch(updateAddressType(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createAddressType(payload));
      }
      if (result) {
        setSaveFilterModal(false);
        dispatch(setSelectedAddressType({ name: '', is_active: 1 }));
        dispatch(getAddressTypeList(pageLimit, 1));
      }
    },
    [dispatch, pageLimit, selectedAddressType?._id],
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
    initialValues: selectedAddressType,
    validationSchema: addAddressTypeSchema,
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
          addressType: {
            ...allFilters?.addressType,
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
          addressType: {
            ...allFilters?.addressType,
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
    dispatch(setSelectedAddressType({ name: '', is_active: 1 }));
    setSaveFilterModal(false);
  }, [dispatch]);

  return (
    <>
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap border-0">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Address Type</h3>
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
                  addressType: {
                    ...allCommon?.addressType,
                    filterToggle: !filterToggle,
                  },
                }),
              )
            }
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={addressTypeList}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={addressTypeFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  addressType: {
                    ...allCommon?.addressType,
                    addressTypeFilters: event?.filters,
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
              field="status"
              header="Active"
              sortable
              filter={filterToggle}
              body={statusBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={addressTypeList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={addressTypeCount}
          />
        </div>
        <Dialog
          header={`${selectedAddressType?._id ? 'Edit' : 'Add'} Address Type`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            resetForm();

            dispatch(setSelectedAddressType({ name: '', is_active: 1 }));
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
              {selectedAddressType?._id ? 'Update' : 'Save'}
            </Button>
          </div>
        </Dialog>
      </div>
    </>
  );
}
