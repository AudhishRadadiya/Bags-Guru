import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { OverlayPanel } from 'primereact/overlaypanel';
import PdfIcon from '../../Assets/Images/pdf.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import MailIcon from '../../Assets/Images/mail.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import FilterIcon from '../../Assets/Images/filter.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  getPartiesAdvisor,
  getTransporterPartyList,
  updateFilter,
} from 'Services/partiesService';
import {
  deleteSalesInvoice,
  getMailSalesInvoice,
  getSalesInvoice,
  getSalesInvoicePdf,
} from 'Services/Sales/SalesInvoiceServices';
import {
  ClearAddSelectedSalesInvoiceData,
  setIsGetInitialValuesSalesInvoice,
} from 'Store/Reducers/Sales/SalesInvoiceSlice';
import { useDispatch, useSelector } from 'react-redux';
import FilterOverlay from 'Components/Common/FilterOverlay';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import DateRangeCalender from 'Components/Common/DateRangeCalender';

const salesInvoiceFilterDetails = [
  { label: 'Invoice No', value: 'invoice_no', type: 'inputBox' },
  { label: 'Date', value: 'invoice_date', type: 'inputBox' },
  { label: 'Party Name', value: 'party_name_detail', type: 'inputBox' },
  { label: 'Present Advisor', value: 'present_advisor', type: 'dropDown' },
  { label: 'TRIPTA Inv No', value: 'tripta_no', type: 'inputBox' },
  { label: 'Transporter', value: 'transporter', type: 'dropDown' },
  { label: 'Qty Pc', value: 'pc_qty', type: 'inputBox' },
  { label: 'KG', value: 'kg_qty', type: 'inputBox' },
  { label: 'Total Amount', value: 'total_amount', type: 'inputBox' },
  { label: 'Order No', value: 'invoice_no', type: 'inputBox' },
];

const getOrderSeverity = order => {
  switch (order.payment) {
    case 'Received':
      return 'success';

    case 'Pending':
      return 'warning';

    case 'Partial':
      return 'primary';

    default:
      return null;
  }
};

export default function SalesInvoice({ hasAccess }) {
  const op = useRef(null);
  const dateRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    is_create_access,
    is_edit_access,
    is_delete_access,
    is_print_access,
  } = hasAccess;

  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const [saveFilterModal, setSaveFilterModal] = useState(false);

  const { partiesAdvisor, listFilter, transporterPartyList } = useSelector(
    ({ parties }) => parties,
  );
  const {
    salesInvoiceLoading,
    salesInvoiceList,
    salesInvoiceCount,
    isGetInitialValuesSalesInvoice,
  } = useSelector(({ salesInvoice }) => salesInvoice);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { filterToggle, searchQuery, salesFilters } = allCommon?.sales;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex, dates } =
    allFilters?.sales;

  const loadRequiredData = useCallback(async () => {
    dispatch(
      getListFilter({
        module_name: 'sales_invoice',
      }),
    );
    await dispatch(
      getSalesInvoice(pageLimit, currentPage, searchQuery, applied, dates),
    );
    dispatch(getPartiesAdvisor());
    dispatch(getTransporterPartyList());
  }, [applied, currentPage, dates, dispatch, pageLimit, searchQuery]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  const companyAction = ({
    _id,
    is_placed_from_app,
    is_job_created,
    ...rest
  }) => {
    const checkActionPermission =
      is_edit_access || is_delete_access || is_print_access;
    return (
      <div className="edit_row">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="ection_btn"
            disabled={checkActionPermission ? false : true}
          >
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {is_edit_access && (
              <Dropdown.Item
                onClick={() => {
                  dispatch(
                    setIsGetInitialValuesSalesInvoice({
                      ...isGetInitialValuesSalesInvoice,
                      update: false,
                    }),
                  );
                  navigate(`/update-sales-invoice/${_id}`, {
                    state: { isEdit: true },
                  });
                }}
              >
                <img src={EditIcon} alt="EditIcon" /> Edit
              </Dropdown.Item>
            )}
            {is_delete_access && (
              <Dropdown.Item onClick={() => setDeletePopup(_id)}>
                <img src={TrashIcon} alt="TrashIcon" /> Delete
              </Dropdown.Item>
            )}
            {is_print_access && (
              <>
                <Dropdown.Item
                  onClick={() => {
                    dispatch(getSalesInvoicePdf(_id));
                  }}
                >
                  <img src={PdfIcon} alt="" /> Save as PDF
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    dispatch(getMailSalesInvoice(_id));
                  }}
                >
                  <img src={MailIcon} alt="" /> Email
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const content = (data, index, handleFilterEdit, handleFilterDelete) => {
    return (
      <>
        <span
          className="edit_icon"
          onClick={e => handleFilterEdit(data, index)}
        >
          <img src={EditIcon} alt="" />
        </span>
        <InputText
          value={data?.filter_name}
          readOnly
          onClick={e => handleFilterEdit(data, index)}
          style={{ cursor: 'pointer' }}
        />
        <Button
          className="btn_transperant"
          onClick={e => {
            handleFilterDelete(e, data, index);
          }}
        >
          <img src={TrashIcon} alt="" />
        </Button>
      </>
    );
  };

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          sales: { ...allFilters?.sales, currentPage: pageIndex },
        }),
      );

      dispatch(
        getSalesInvoice(pageLimit, pageIndex, searchQuery, applied, dates),
      );
    },
    [currentPage, dispatch, allFilters, pageLimit, searchQuery, applied, dates],
  );
  const onPageRowsChange = useCallback(
    page => {
      const updatedCurrentPage = page === 0 ? 0 : 1;
      dispatch(
        setAllFilters({
          ...allFilters,
          sales: {
            ...allFilters?.sales,
            currentPage: updatedCurrentPage,
            pageLimit: page,
          },
        }),
      );
      dispatch(
        getSalesInvoice(page, updatedCurrentPage, searchQuery, applied, dates),
      );
    },
    [allFilters, applied, dates, dispatch, searchQuery],
  );

  const loadTableData = selectedDate => {
    dispatch(
      getSalesInvoice(
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        selectedDate,
      ),
    );
  };

  const handleFilterEdit = (data, index) => {
    const updatedFilterData = {
      ...data,
      filter_list: data?.filter_list?.map(item => {
        const findObj = salesInvoiceFilterDetails?.find(
          obj => obj?.value === item?.filter && obj?.type === 'dropDown',
        );
        if (findObj) {
          return { ...item, value: item.value.split(', ') };
        } else {
          return { ...item };
        }
      }),
    };
    dispatch(
      setAllFilters({
        ...allFilters,
        sales: {
          ...allFilters?.sales,
          filters: updatedFilterData?.filter_list,
          selectedItemIndex: index,
        },
      }),
    );
    setIsEdit(true);
    setNameFilter(data?.filter_name);
    setFilterId(data?._id);
  };
  const handleSaveFilter = async () => {
    let res;
    setSaveFilterModal(false);

    const filterConvertToString = filters?.map(item => {
      if (Array.isArray(item?.value)) {
        let updated = item?.value?.join(', ');
        return { ...item, value: updated };
      } else {
        return item;
      }
    });

    if (isEdit) {
      let editPayload = {
        filter_id: filterId,
        module_name: 'sales_invoice',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'sales_invoice',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'sales_invoice',
        }),
      );
      op.current?.hide();
    }
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  };
  const handleFilterChange = (index, field, value) => {
    const updatedFilters = [...filters];

    if (field === 'filter' && updatedFilters[index]['value'] !== '') {
      updatedFilters[index] = {
        ...updatedFilters[index],
        [field]: value,
        value: '',
      };
    } else {
      updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    }

    dispatch(
      setAllFilters({
        ...allFilters,
        sales: { ...allFilters?.sales, filters: updatedFilters },
      }),
    );
  };
  const handleDelete = useCallback(
    async sales_id => {
      if (sales_id) {
        const result = await dispatch(deleteSalesInvoice(sales_id));
        if (result) {
          setDeletePopup(false);
          dispatch(getSalesInvoice(pageLimit, 1, searchQuery, applied, dates));
        }
      }
    },
    [dispatch, pageLimit, searchQuery, applied, dates],
  );
  const handleAddFilter = useCallback(() => {
    dispatch(
      setAllFilters({
        ...allFilters,
        sales: {
          ...allFilters?.sales,
          filters: [...allFilters?.sales?.filters, { filter: '', value: '' }],
        },
      }),
    );
  }, [allFilters, dispatch]);

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const updatedAppliedFilters =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.sales?.applied)?.length > 0;

      if (updatedAppliedFilters) {
        dispatch(
          getSalesInvoice(pageLimit, currentPage, searchQuery, {}, dates),
        );
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          sales: {
            ...allFilters?.sales,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.sales?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.sales.selectedItemIndex !== ''
                ? ''
                : allFilters.sales.selectedItemIndex,
          },
        }),
      );

      if (updatedFilters?.length === 0 && isEdit === true) {
        setIsEdit(false);
        setNameFilter('');
      }
    },
    [
      filters,
      allFilters,
      dispatch,
      isEdit,
      pageLimit,
      currentPage,
      searchQuery,
      dates,
    ],
  );

  const selectedFilters = filters?.map(filter => {
    const filterDetail = salesInvoiceFilterDetails?.find(
      detail => detail.value === filter.filter,
    );
    return filterDetail ? filterDetail : null;
  });

  const handleFilterUpdate = () => {
    dispatch(
      setAllCommon({
        ...allCommon,
        sales: { ...allCommon?.sales, filterToggle: !filterToggle },
      }),
    );
  };
  const filterOption = useMemo(() => {
    let flterOptionArray = [...salesInvoiceFilterDetails];
    if (filters?.length > 0) {
      flterOptionArray = flterOptionArray?.map(item => {
        if (filters.find(item2 => item2.filter === item.value)) {
          return { ...item, disabled: true };
        }
        return item;
      });
    }
    return flterOptionArray;
  }, [filters]);

  const filterOptions = useMemo(() => {
    return {
      present_advisor: partiesAdvisor,
      transporter: transporterPartyList,
    };
  }, [partiesAdvisor, transporterPartyList]);

  const handleFilterDelete = async (e, data, index) => {
    const res = await dispatch(
      deleteFilter({
        filter_id: data?._id,
        module_name: 'sales_invoice',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          sales: {
            ...allFilters?.sales,
            currentPage: 1,
            filters: [],
            selectedItemIndex: '',
            applied: {},
          },
        }),
      );
      dispatch(
        getListFilter({
          module_name: 'sales_invoice',
        }),
      );
      dispatch(getSalesInvoice(pageLimit, 1, searchQuery, {}, dates));

      op.current?.hide();
    }
  };
  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    filters?.forEach(item => {
      if (item.value === 0 ? !item.value : item.value) {
        filterArray.push(item);
      }
    });
    if (filterArray?.length > 0) {
      let filterObj = {};
      filterArray.forEach(item => {
        filterObj = {
          ...filterObj,
          ...{
            [item.filter]:
              item.filter === 'invoice_no' ||
              item.filter === 'pc_qty' ||
              item.filter === 'kg_qty' ||
              item.filter === 'total_bundle' ||
              item.filter === 'order_no'
                ? Number(item.value)
                : item.value,
          },
        };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          sales: { ...allFilters?.sales, applied: filterObj },
        }),
      );
      dispatch(
        getSalesInvoice(pageLimit, currentPage, searchQuery, filterObj, dates),
      );
    }
  }, [
    filters,
    dispatch,
    allFilters,
    pageLimit,
    currentPage,
    searchQuery,
    dates,
  ]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(
          getSalesInvoice(pageLimit, currentPage, searchQuery, {}, dates),
        );

        dispatch(
          setAllFilters({
            ...allFilters,
            sales: {
              ...allFilters?.sales,
              applied: {},
              filters: [],
              selectedItemIndex: '',
            },
          }),
        );
      } else {
        dispatch(
          setAllFilters({
            ...allFilters,
            sales: { ...allFilters?.sales, selectedItemIndex: '', filters: [] },
          }),
        );
      }
      if (isEdit) {
        setIsEdit(false);
      }
      op.current?.hide();
    },
    [
      applied,
      isEdit,
      dispatch,
      pageLimit,
      currentPage,
      searchQuery,
      dates,
      allFilters,
    ],
  );

  const partieTemplate = val => {
    return (
      <span
        onClick={() => {
          dispatch(
            setIsGetInitialValuesSalesInvoice({
              ...isGetInitialValuesSalesInvoice,
              view: false,
            }),
          );
          navigate(`/sales-invoice-details/${val?._id}`, {
            state: { isView: true },
          });
        }}
      >
        {val?.party_name_detail}
      </span>
    );
  };

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        sales: {
          ...allFilters?.sales,
          currentPage: 1,
        },
      }),
    );
    dispatch(getSalesInvoice(pageLimit, 1, e.target.value, applied, dates));
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const handleDateManage = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        sales: {
          ...allFilters?.sales,
          dates: e,
        },
      }),
    );

    loadTableData(e);
  };

  return (
    <>
      <div className="main_Wrapper">
        {/* {salesInvoiceLoading && <Loader />} */}
        <div className="table_main_Wrapper bg-white perfoma_main_wrapper">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col lg={2}>
                <div className="page_title">
                  <h3 className="m-0">Sales invoice</h3>
                </div>
              </Col>
              <Col lg={10}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li className="search_input_wrap">
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                          value={searchQuery}
                          onChange={e => {
                            debounceHandleSearchInput(e);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                sales: {
                                  ...allCommon?.sales,
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
                        className={
                          Object.keys(applied)?.length > 0
                            ? 'btn_border filter_btn applied'
                            : 'btn_border filter_btn'
                        }
                        onClick={e => op.current.toggle(e)}
                      >
                        <img src={FilterIcon} alt="" /> Filter
                      </Button>
                    </li>
                    <li>
                      {/* <div className="form_group date_select_wrapper">
                        <Calendar
                          id=" ConsumptionDate"
                          value={dates}
                          placeholder="Select Date Range"
                          showIcon
                          dateFormat="dd-mm-yy"
                          selectionMode="range"
                          readOnlyInput
                          showButtonBar
                          // onChange={e => setDates(e.value)}
                          onChange={e => {
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                sales: {
                                  ...allCommon?.sales,
                                  dates: e.value,
                                },
                              }),
                            );
                            if (e?.value && e.value[0] && e.value[1]) {
                              dispatch(
                                getSalesInvoice(
                                  pageLimit,
                                  currentPage,
                                  searchQuery,
                                  applied,
                                  e.value,
                                ),
                              );
                            } else if (e.value === null) {
                              dispatch(
                                getSalesInvoice(
                                  pageLimit,
                                  currentPage,
                                  searchQuery,
                                  applied,
                                  e.value,
                                ),
                              );
                            }
                          }}
                        />
                      </div> */}

                      <div className="form_group date_range_wrapper">
                        <div
                          className="date_range_select"
                          onClick={e => {
                            dateRef.current.toggle(e);
                          }}
                        >
                          <span>
                            {dates?.startDate
                              ? moment(dates.startDate).format('DD-MM-yyyy')
                              : ''}{' '}
                            {dates?.startDate && dates?.endDate && '-'}{' '}
                            {dates?.endDate
                              ? moment(dates.endDate).format('DD-MM-yyyy')
                              : 'Select Date Range'}
                          </span>
                        </div>
                        <OverlayPanel ref={dateRef}>
                          <div className="date_range_wrap">
                            <DateRangeCalender
                              ranges={[dates]}
                              onChange={e => handleDateManage(e)}
                            />
                            <Button
                              className="btn_transperant"
                              onClick={e => {
                                dateRef.current.toggle(e);
                                dispatch(
                                  setAllFilters({
                                    ...allFilters,
                                    sales: {
                                      ...allFilters?.sales,
                                      dates: {
                                        startDate: '',
                                        endDate: '',
                                        key: 'selection',
                                      },
                                    },
                                  }),
                                );

                                loadTableData({
                                  startDate: '',
                                  endDate: '',
                                  key: 'selection',
                                });
                              }}
                            >
                              Clear
                            </Button>
                          </div>
                        </OverlayPanel>
                      </div>
                    </li>
                    <li>
                      <Button
                        className="btn_primary"
                        onClick={() => {
                          if (is_create_access) {
                            dispatch(
                              setIsGetInitialValuesSalesInvoice({
                                ...isGetInitialValuesSalesInvoice,
                                add: false,
                              }),
                            );
                            dispatch(ClearAddSelectedSalesInvoiceData());
                            navigate('/add-sales-invoice');
                          }
                        }}
                        disabled={is_create_access ? false : true}
                      >
                        <img src={PlusIcon} alt="" /> Add Sales invoice
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper cell_padding_large is_filter">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() => {
                handleFilterUpdate();
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={salesInvoiceList}
              sortMode="single"
              sortField="name"
              filterDisplay="row"
              filters={salesFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    sales: {
                      ...allCommon?.sales,
                      salesFilters: event?.filters,
                    },
                  }),
                );
              }}
              sortOrder={1}
              rows={10}
              dataKey="_id"
              emptyMessage={salesInvoiceLoading && <Skeleton count={10} />}
            >
              <Column
                field="invoice_no"
                header="Invoice No"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="invoice_date"
                header="Date"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="party_name_detail"
                className="view_detail"
                header="Party"
                sortable
                filter={filterToggle}
                body={partieTemplate}
              ></Column>
              <Column
                field="transporter_name"
                header="Transporter"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="present_advisor_name"
                header="Present Advisor"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="tripta_no"
                header="TRIPTA Inv No."
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="pc_qty"
                header="Qty Pc"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="kg_qty"
                header="KG"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="final_amount"
                header="Total Amount"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="comment"
                header="Comment"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="action"
                header="Action"
                body={companyAction}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={salesInvoiceList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={salesInvoiceCount}
            />
          </div>
        </div>
        <Dialog
          header={`${isEdit ? 'Update' : 'Save'}  Personal Filters`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            setIsEdit(false);
          }}
        >
          <div className="form_group mb-3">
            <InputText
              placeholder="Name your filter"
              name="nameFilter"
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
            />
          </div>
          <Button className="btn_primary" onClick={handleSaveFilter}>
            {isEdit ? 'Update Filter' : 'Save Filter'}
          </Button>
        </Dialog>
      </div>
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <FilterOverlay
        op={op}
        filters={filters}
        listFilter={listFilter}
        filterOption={filterOption}
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        selectedItemIndex={selectedItemIndex}
        content={content}
        setNameFilter={setNameFilter}
        handleAddFilter={handleAddFilter}
        handleFilterEdit={handleFilterEdit}
        handleFilterChange={handleFilterChange}
        handleRemoveFilter={handleRemoveFilter}
        handleFilterDelete={handleFilterDelete}
        applyFilterHandler={applyFilterHandler}
        clearAppliedFilter={clearAppliedFilter}
        setSaveFilterModal={setSaveFilterModal}
      />
    </>
  );
}
