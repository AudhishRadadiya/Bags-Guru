import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import PlusIcon from '../../Assets/Images/plus.svg';
import FilterIcon from '../../Assets/Images/filter.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import BagIcon from '../../Assets/Images/bag-icon.svg';
import PdfIcon from '../../Assets/Images/pdf.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SearchIcon from '../../Assets/Images/search.svg';
import _ from 'lodash';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  getPartiesAdvisor,
  getTransporterPartyList,
  updateFilter,
} from 'Services/partiesService';
import {
  addProformaToJob,
  deleteProformaInvoice,
  getProformaInvoice,
  getProformaToPdf,
} from 'Services/Sales/ProformaService';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import FilterOverlay from 'Components/Common/FilterOverlay';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { checkModulePermission } from 'Helper/Common';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { OverlayPanel } from 'primereact/overlaypanel';
import moment from 'moment';
import {
  clearAddProformaInvoiceData,
  setIsGetInitialValuesProformaInvoice,
} from 'Store/Reducers/Sales/ProformaInvoiceSlice';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { setPreviousTransporter } from 'Store/Reducers/Sales/SalesOrderSlice';

const proformaFilterDetails = [
  { label: 'Invoice No', value: 'invoice_no', type: 'inputBox' },
  { label: 'Date', value: 'invoice_date', type: 'inputBox' },
  { label: 'Party Name', value: 'party_name_detail', type: 'inputBox' },
  { label: 'Present Advisor', value: 'present_advisor', type: 'dropDown' },
  { label: 'Transporter', value: 'transporter', type: 'dropDown' },
  { label: 'Qty Pc', value: 'pc_qty', type: 'inputBox' },
  { label: 'KG', value: 'kg_qty', type: 'inputBox' },
  { label: 'Total Amount', value: 'total_amount', type: 'inputBox' },
];
export default function ProformaInvoice({ hasAccess }) {
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
  const [approvedPopup, setApprovedPopup] = useState({ show: false, id: '' });

  const {
    proformaLoading,
    proformaListLoading,
    proformaInvoiceList,
    proformaInvoiceCount,
    isGetInitialValuesProformaInvoice,
  } = useSelector(({ proformaInvoice }) => proformaInvoice);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { userPermissionList } = useSelector(({ settings }) => settings);
  const { partiesAdvisor, listFilter, transporterPartyList, partiesLoading } =
    useSelector(({ parties }) => parties);

  const { filterToggle, proformaFilters, searchQuery } = allCommon?.proforma;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex, dates } =
    allFilters?.proforma;

  const checkSalesOrderPermission = checkModulePermission(
    userPermissionList,
    'Sales',
    'Orders',
    'create',
  );

  useEffect(() => {
    dispatch(
      getListFilter({
        module_name: 'proforma_invoice',
      }),
    );
    dispatch(
      getProformaInvoice(pageLimit, currentPage, searchQuery, applied, dates),
    );
    dispatch(getPartiesAdvisor());
    dispatch(getTransporterPartyList());
  }, [dispatch]);

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
            handleFilterDelete(data, index);
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
          proforma: { ...allFilters?.proforma, currentPage: pageIndex },
        }),
      );
      dispatch(
        getProformaInvoice(pageLimit, pageIndex, searchQuery, applied, dates),
      );
    },
    [currentPage, dispatch, allFilters, pageLimit, searchQuery, applied, dates],
  );

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
        module_name: 'proforma_invoice',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'proforma_invoice',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'proforma_invoice',
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
        proforma: { ...allFilters?.proforma, filters: updatedFilters },
      }),
    );
  };

  const handleAddFilter = () => {
    dispatch(
      setAllFilters({
        ...allFilters,
        proforma: {
          ...allFilters?.proforma,
          filters: [
            ...allFilters?.proforma?.filters,
            { filter: '', value: '' },
          ],
        },
      }),
    );
  };

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const updateAppliedFilter =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.proforma?.applied)?.length > 0;

      if (updateAppliedFilter) {
        dispatch(
          getProformaInvoice(pageLimit, currentPage, searchQuery, {}, dates),
        );
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          proforma: {
            ...allFilters?.proforma,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.proforma?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.proforma.selectedItemIndex !== ''
                ? ''
                : allFilters.proforma.selectedItemIndex,
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
    const filterDetail = proformaFilterDetails.find(
      detail => detail.value === filter.filter,
    );
    return filterDetail ? filterDetail : null;
  });

  const partieTemplate = val => {
    return (
      <span
        onClick={() => {
          // dispatch(
          //   setIsGetInitialValuesProformaInvoice({
          //     ...isGetInitialValuesProformaInvoice,
          //     view: false,
          //   }),
          // );
          navigate(`/proforma-details/${val?._id}`, {
            state: { isView: true },
          });
        }}
      >
        {val?.party_name_detail}
      </span>
    );
  };

  const pdfTemplate = ({ _id }) => {
    return (
      <span
        className="cursor-pointer"
        onClick={() => {
          dispatch(getProformaToPdf(_id));
        }}
      >
        <img src={PdfIcon} alt="" />
      </span>
    );
  };

  const onPageRowsChange = useCallback(
    page => {
      const updateCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setAllFilters({
          ...allFilters,
          proforma: {
            ...allFilters?.proforma,
            currentPage: updateCurrentPage,
            pageLimit: page,
          },
        }),
      );
      dispatch(
        getProformaInvoice(
          page,
          updateCurrentPage,
          searchQuery,
          applied,
          dates,
        ),
      );
    },
    [allFilters, applied, dates, dispatch, searchQuery],
  );

  const companyAction = ({
    _id,
    is_placed_from_app,
    is_job_created,
    ...rest
  }) => {
    const checkActionPermission =
      checkSalesOrderPermission ||
      is_edit_access ||
      is_delete_access ||
      is_print_access;
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
            {is_edit_access && !is_job_created && (
              <Dropdown.Item
                onClick={() => {
                  dispatch(
                    setIsGetInitialValuesProformaInvoice({
                      ...isGetInitialValuesProformaInvoice,
                      update: false,
                    }),
                  );
                  navigate(`/update-proforma-invoice/${_id}`, {
                    state: { isEdit: true },
                  });
                }}
              >
                <img src={EditIcon} alt="EditIcon" /> Edit
              </Dropdown.Item>
            )}
            {is_delete_access && !is_job_created && (
              <Dropdown.Item onClick={() => setDeletePopup(_id)}>
                <img src={TrashIcon} alt="TrashIcon" /> Delete
              </Dropdown.Item>
            )}
            {checkSalesOrderPermission &&
              // is_placed_from_app &&
              !is_job_created && (
                <Dropdown.Item
                  onClick={() => setApprovedPopup({ show: true, id: _id })}
                >
                  <img src={BagIcon} alt="BagIcon" /> Proforma To Job
                </Dropdown.Item>
              )}
            {is_print_access && (
              <>
                <Dropdown.Item
                  onClick={() => {
                    dispatch(getProformaToPdf(_id));
                  }}
                >
                  <img src={PdfIcon} alt="" /> Save as PDF
                </Dropdown.Item>
                {/* <Dropdown.Item
                  onClick={() => {
                    dispatch(getMailProformaInvoice(_id));
                  }}
                >
                  <img src={MailIcon} alt="" /> Email
                </Dropdown.Item> */}
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const loadTableData = selectedDate => {
    dispatch(
      getProformaInvoice(
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        selectedDate,
      ),
    );
  };

  const handleDelete = useCallback(
    async proforma_id => {
      if (proforma_id) {
        const result = await dispatch(deleteProformaInvoice(proforma_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            getProformaInvoice(pageLimit, 1, searchQuery, applied, dates),
          );
        }
      }
    },
    [dispatch, pageLimit, searchQuery, applied, dates],
  );

  const handleProformaToJob = useCallback(
    async proforma_id => {
      if (proforma_id) {
        const result = await dispatch(addProformaToJob(proforma_id));
        if (result) {
          dispatch(
            getProformaInvoice(pageLimit, 1, searchQuery, applied, dates),
          );
        }
      }
    },
    [dispatch, pageLimit, searchQuery, applied, dates],
  );

  const handleFilterEdit = (data, index) => {
    const updatedFilterData = {
      ...data,
      filter_list: data?.filter_list?.map(item => {
        const findObj = proformaFilterDetails?.find(
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
        proforma: {
          ...allFilters?.proforma,
          filters: updatedFilterData?.filter_list,
          selectedItemIndex: index,
        },
      }),
    );
    setIsEdit(true);
    setNameFilter(data?.filter_name);
    setFilterId(data?._id);
  };

  const filterOption = useMemo(() => {
    let flterOptionArray = [...proformaFilterDetails];
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

  const handleFilterDelete = async (data, index) => {
    const res = await dispatch(
      deleteFilter({
        filter_id: data?._id,
        module_name: 'proforma_invoice',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          proforma: {
            ...allFilters?.proforma,
            currentPage: 1,
            filters: [],
            selectedItemIndex: '',
            applied: {},
          },
        }),
      );
      dispatch(
        getListFilter({
          module_name: 'proforma_invoice',
        }),
      );
      dispatch(getProformaInvoice(pageLimit, 1, searchQuery, {}, dates));
      setNameFilter('');
      op.current?.hide();
    }
  };

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    filters.forEach(item => {
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
              item.filter === 'total_amount'
                ? Number(item.value)
                : item.value,
          },
        };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          proforma: { ...allFilters?.proforma, applied: filterObj },
        }),
      );
      dispatch(
        getProformaInvoice(
          pageLimit,
          currentPage,
          searchQuery,
          filterObj,
          dates,
        ),
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
          getProformaInvoice(pageLimit, currentPage, searchQuery, {}, dates),
        );

        dispatch(
          setAllFilters({
            ...allFilters,
            proforma: {
              ...allFilters?.proforma,
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
            proforma: {
              ...allFilters?.proforma,
              filters: [],
              selectedItemIndex: '',
            },
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

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        proforma: {
          ...allFilters?.proforma,
          currentPage: 1,
        },
      }),
    );
    dispatch(getProformaInvoice(pageLimit, 1, e.target.value, applied, dates));
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const handleDateManage = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        proforma: {
          ...allFilters?.proforma,
          dates: e,
        },
      }),
    );

    loadTableData(e);
  };

  return (
    <>
      {proformaLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white perfoma_main_wrapper">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col xl={2}>
                <div className="page_title">
                  <h3 className="m-0">Proforma Invoice</h3>
                </div>
              </Col>
              <Col xl={10}>
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
                                proforma: {
                                  ...allCommon?.proforma,
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
                          id="ConsumptionDate"
                          value={dates}
                          placeholder="Select Date Range"
                          showIcon
                          dateFormat="dd-mm-yy"
                          showButtonBar
                          selectionMode="range"
                          readOnlyInput
                          // onChange={e => setDates(e.value)}
                          onChange={e => {
                            dispatch(
                              setAllCommon({
                                ...allFilters,
                                proforma: {
                                  ...allFilters?.proforma,
                                  dates: e.value,
                                },
                              }),
                            );
                            if (e?.value && e.value[0] && e.value[1]) {
                              dispatch(
                                getProformaInvoice(
                                  pageLimit,
                                  currentPage,
                                  searchQuery,
                                  applied,
                                  e.value,
                                ),
                              );
                            } else if (e.value === null) {
                              dispatch(
                                getProformaInvoice(
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
                                    proforma: {
                                      ...allFilters?.proforma,
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
                            dispatch(setPreviousTransporter());
                            dispatch(
                              setIsGetInitialValuesProformaInvoice({
                                ...isGetInitialValuesProformaInvoice,
                                add: false,
                              }),
                            );
                            dispatch(clearAddProformaInvoiceData());
                            navigate('/add-proforma-invoice');
                          }
                        }}
                        disabled={is_create_access ? false : true}
                      >
                        <img src={PlusIcon} alt="" /> Add Proforma Invoice
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
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    proforma: {
                      ...allCommon?.proforma,
                      filterToggle: !filterToggle,
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={proformaInvoiceList}
              sortMode="single"
              sortField="name"
              filterDisplay="row"
              sortOrder={1}
              dataKey="_id"
              filters={proformaFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    proforma: {
                      ...allCommon?.proforma,
                      proformaFilters: event?.filters,
                    },
                  }),
                );
              }}
              emptyMessage={
                (proformaListLoading || partiesLoading) && (
                  <Skeleton count={10} />
                )
              }
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
                field="Pdf"
                header="PDF"
                body={pdfTemplate}
                filter={filterToggle}
              ></Column>
              <Column
                field="action"
                header="Action"
                body={companyAction}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={proformaInvoiceList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={proformaInvoiceCount}
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
        <Dialog
          header="Proforma To Job"
          visible={approvedPopup?.show}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => setApprovedPopup({ show: false, id: '' })}
        >
          <div className="approval_content_wrap">
            <p className="text-center mb-4">
              Are you sure you want to convert this proforma into a job?
            </p>
            <div className="button_group d-flex align-items-center justify-content-center">
              <Button
                className="btn_border"
                onClick={() => setApprovedPopup({ show: false, id: '' })}
              >
                Cancel
              </Button>
              <Button
                className="btn_primary ms-2"
                onClick={() => {
                  handleProformaToJob(approvedPopup?.id);
                  setApprovedPopup({ show: false, id: '' });
                }}
              >
                Save
              </Button>
            </div>
          </div>
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
        filterOption={filterOption}
        filterOptions={filterOptions}
        setNameFilter={setNameFilter}
        handleFilterChange={handleFilterChange}
        handleRemoveFilter={handleRemoveFilter}
        handleAddFilter={handleAddFilter}
        handleFilterEdit={handleFilterEdit}
        handleFilterDelete={handleFilterDelete}
        applyFilterHandler={applyFilterHandler}
        clearAppliedFilter={clearAppliedFilter}
        selectedFilters={selectedFilters}
        listFilter={listFilter}
        setSaveFilterModal={setSaveFilterModal}
        content={content}
        selectedItemIndex={selectedItemIndex}
      />
    </>
  );
}
