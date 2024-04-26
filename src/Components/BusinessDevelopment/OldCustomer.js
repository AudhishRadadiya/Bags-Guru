import { useCallback, useEffect, useRef, useMemo, useState, memo } from 'react';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import _ from 'lodash';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import FilterIcon from '../../Assets/Images/filter.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import WhatsAppIcon from '../../Assets/Images/whatsapp.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import SnoozeIcon from '../../Assets/Images/snooze.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import { useSelector } from 'react-redux';
import {
  customerDataExport,
  getCustomerFilterList,
  getShowCustomerList,
  saveCustomerFollowupData,
} from 'Store/Reducers/Customer/CustomerService';
import { useDispatch } from 'react-redux';
import {
  setCustomerList,
  setTypeSelect,
} from 'Store/Reducers/Customer/CustomerSlice';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import FilterOverlay from 'Components/Common/FilterOverlay';
import CustomerMultiSelect from './CustomerMultiSelect';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import CustomPaginator from 'Components/Common/CustomPaginator';
import WhatsAppShare from 'Components/Common/Whatsapp';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

export const getSeverity = val => {
  switch (val) {
    case true:
      return 'success';
    case false:
      return 'danger';
    default:
      return null;
  }
};

const customerFilterDetails = [
  { label: 'Customer Name', value: 'party_name', type: 'inputBox' },
  { label: 'Customer Group', value: 'customer_group', type: 'inputBox' },
  { label: 'Order No', value: 'order_no', type: 'inputBox' },
  { label: 'Last Order Date', value: 'order_date', type: 'inputBox' },
  { label: 'State', value: 'state', type: 'dropDown' },
  { label: 'City', value: 'city', type: 'dropDown' },
  { label: 'Mobile Number', value: 'mobile_no', type: 'inputBox' },
  { label: 'Present Advisor', value: 'present_advisor_name', type: 'dropDown' },
  { label: 'Snoozed On', value: 'snoozed_on', type: 'inputBox' },
  { label: 'Snoozed For', value: 'snooze_for', type: 'inputBox' },
  { label: 'Comment', value: 'comment', type: 'inputBox' },
];

const OldCustomer = () => {
  const op = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [whatsappData, setWhatsappData] = useState({});
  const [whatsappPopup, setWhatsappPopup] = useState(false);
  const [saveFilterModal, setSaveFilterModal] = useState(false);

  const {
    customerLoading,
    typeSelect,
    customerList,
    customerDataCount,
    customerFilterListOptions,
  } = useSelector(({ customer }) => customer);

  const { listFilter } = useSelector(({ parties }) => parties);
  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { filterToggle, customerFilters, searchQuery, field_filter } =
    allCommon?.customer;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex } =
    allFilters?.customer;

  const loadRequiredData = useCallback(() => {
    dispatch(getCustomerFilterList());
    dispatch(
      getListFilter({
        module_name: 'customer',
      }),
    );
    dispatch(
      getShowCustomerList(
        typeSelect,
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        field_filter,
      ),
    );
  }, [
    applied,
    currentPage,
    dispatch,
    field_filter,
    pageLimit,
    searchQuery,
    typeSelect,
  ]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  // useEffect(() => {
  //   dispatch(
  //     getShowCustomerList(
  //       typeSelect,
  //       pageLimit,
  //       currentPage,
  //       searchQuery,
  //       applied,
  //       field_filter,
  //     ),
  //   );
  // }, [dispatch, currentPage, pageLimit, applied, typeSelect]);

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    filters.forEach(item => {
      if (item.value) {
        filterArray.push(item);
      }
    });
    if (filterArray?.length > 0) {
      let filterObj = {};
      filterArray.forEach(item => {
        filterObj = { ...filterObj, ...{ [item.filter]: item.value } };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          customer: {
            ...allFilters?.customer,
            applied: filterObj,
            currentPage: 1,
          },
        }),
      );
      dispatch(
        getShowCustomerList(
          typeSelect,
          pageLimit,
          1,
          searchQuery,
          filterObj,
          field_filter,
        ),
      );
    }
  }, [
    filters,
    dispatch,
    allFilters,
    typeSelect,
    pageLimit,
    searchQuery,
    field_filter,
  ]);

  const selectedFilters = filters?.map(filter => {
    const filterDetail = customerFilterDetails?.find(
      detail => detail.value === filter.filter,
    );
    return filterDetail ? filterDetail : null;
  });

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(
          getShowCustomerList(
            typeSelect,
            pageLimit,
            currentPage,
            searchQuery,
            {},
            field_filter,
          ),
        );

        dispatch(
          setAllFilters({
            ...allFilters,
            customer: {
              ...allFilters?.customer,
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
            customer: {
              ...allFilters?.customer,
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
      typeSelect,
      pageLimit,
      currentPage,
      searchQuery,
      field_filter,
      allFilters,
    ],
  );

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const checkAppliedFilters =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.customer?.applied)?.length > 0;

      if (checkAppliedFilters) {
        dispatch(
          getShowCustomerList(
            typeSelect,
            pageLimit,
            currentPage,
            searchQuery,
            {},
            field_filter,
          ),
        );
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          customer: {
            ...allFilters?.customer,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.customer?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.customer.selectedItemIndex !== ''
                ? ''
                : allFilters.customer.selectedItemIndex,
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
      typeSelect,
      pageLimit,
      currentPage,
      searchQuery,
      field_filter,
    ],
  );

  const handleFieldChange = (e, rowData) => {
    const value = e.target.value;
    const name = e.target.name;
    let updatedList = [...customerList];
    const index = updatedList?.findIndex(
      x => x?.unique_id === rowData?.unique_id,
    );
    if (index !== -1) {
      const oldObj = updatedList[index];
      const updatedObj = {
        ...oldObj,
        [name]: value,
      };
      updatedList[index] = updatedObj;
      dispatch(setCustomerList(updatedList));
    }
  };

  const inputTemplate = (data, row) => {
    const headerName = row?.column?.props?.header;
    const fieldName = row?.column?.props?.field;

    return (
      <div className="form_group">
        <InputText
          name={fieldName}
          value={data[fieldName]}
          placeholder={`Enter ${headerName}`}
          onChange={e => handleFieldChange(e, data)}
        />
      </div>
    );
  };

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        customer: {
          ...allFilters?.customer,
          currentPage: 1,
        },
      }),
    );

    dispatch(
      getShowCustomerList(typeSelect, pageLimit, 1, e.target.value, applied),
    );
  };

  const handleSnooze = useCallback(
    async (party, snooze) => {
      const payload = {
        customer_group_id: party?.customer_group_id,
        snooze_for: snooze,
        comment: party?.comment,
      };
      const res = await dispatch(saveCustomerFollowupData(payload));
      if (res) {
        dispatch(
          getShowCustomerList(
            typeSelect,
            pageLimit,
            currentPage,
            searchQuery,
            applied,
            field_filter,
          ),
        );
      }
    },
    [
      applied,
      currentPage,
      dispatch,
      field_filter,
      pageLimit,
      searchQuery,
      typeSelect,
    ],
  );

  const partiesAction = useCallback(party => {
    return (
      <div className="edit_row">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle id="dropdown-basic" className="ection_btn">
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={e => {
                setWhatsappPopup(true);
                setWhatsappData(party);
              }}
            >
              <img src={WhatsAppIcon} alt="" /> WhatsApp
            </Dropdown.Item>
            {!party?.snoozed && party?.customer_group && (
              <>
                <Dropdown.Item onClick={() => handleSnooze(party, 1)}>
                  <img src={SnoozeIcon} alt="" /> Snooze for 15 day
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSnooze(party, 2)}>
                  <img src={SnoozeIcon} alt="" /> Snooze for 30 day
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSnooze(party, 3)}>
                  <img src={SnoozeIcon} alt="" /> Snooze for 90 day
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }, []);

  const typeSelectHandleChange = e => {
    dispatch(setTypeSelect(e.value));

    dispatch(
      getShowCustomerList(
        e.value,
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        field_filter,
      ),
    );
  };

  const Type = [
    { label: 'All', value: 'all' },
    { label: 'Snoozed', value: 'snoozed' },
    { label: 'Unsnoozed', value: 'unsnoozed' },
  ];

  const filterOption = useMemo(() => {
    let filterOptionArray = [...customerFilterDetails];
    if (filters?.length > 0) {
      filterOptionArray = filterOptionArray?.map(item => {
        if (filters.find(item2 => item2.filter === item.value)) {
          return { ...item, disabled: true };
        }
        return item;
      });
    }
    return filterOptionArray;
  }, [filters]);

  const filterOptions = useMemo(() => {
    return {
      present_advisor_name: customerFilterListOptions?.advisorList,
      city: customerFilterListOptions?.cityList,
      state: customerFilterListOptions?.stateList,
    };
  }, [customerFilterListOptions]);

  const handleFilterChange = useCallback(
    (index, field, value) => {
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
          customer: { ...allFilters?.customer, filters: updatedFilters },
        }),
      );
    },
    [filters, allFilters, dispatch],
  );

  const handleAddFilter = () => {
    dispatch(
      setAllFilters({
        ...allFilters,
        customer: {
          ...allFilters?.customer,
          filters: [
            ...allFilters?.customer?.filters,
            { filter: '', value: '' },
          ],
        },
      }),
    );
  };

  const handleFilterEdit = useCallback(
    (data, index) => {
      const updatedFilterData = {
        ...data,
        filter_list: data.filter_list.map(item => {
          const findObj = customerFilterDetails?.find(
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
          customer: {
            ...allFilters?.customer,
            filters: updatedFilterData?.filter_list,
            selectedItemIndex: index,
          },
        }),
      );
      setIsEdit(true);
      setNameFilter(data?.filter_name);
      setFilterId(data?._id);
    },
    [allFilters, dispatch],
  );

  const handleFilterDelete = useCallback(
    async (e, data, index) => {
      const res = await dispatch(
        deleteFilter({
          filter_id: data?._id,
          module_name: 'customer',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            customer: {
              ...allFilters?.customer,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          }),
        );
        dispatch(
          getListFilter({
            module_name: 'customer',
          }),
        );
        dispatch(
          getShowCustomerList(
            typeSelect,
            pageLimit,
            1,
            searchQuery,
            {},
            field_filter,
          ),
        );
        setNameFilter('');
      }
    },
    [dispatch, allFilters, typeSelect, pageLimit, searchQuery, field_filter],
  );
  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(
        setAllFilters({
          ...allFilters,
          customer: { ...allFilters?.customer, currentPage: pageIndex },
        }),
      );
      dispatch(
        getShowCustomerList(
          typeSelect,
          pageLimit,
          pageIndex,
          searchQuery,
          applied,
          field_filter,
        ),
      );
    },
    [
      currentPage,
      dispatch,
      allFilters,
      typeSelect,
      pageLimit,
      searchQuery,
      applied,
      field_filter,
    ],
  );

  const onPageRowsChange = useCallback(
    page => {
      const updateCurrentPage = page === 0 ? 0 : 1;
      dispatch(
        setAllFilters({
          ...allFilters,
          customer: {
            ...allFilters?.customer,
            currentPage: updateCurrentPage,
            pageLimit: page,
          },
        }),
      );
      dispatch(
        getShowCustomerList(
          typeSelect,
          page,
          updateCurrentPage,
          searchQuery,
          applied,
          field_filter,
        ),
      );
    },
    [dispatch, allFilters, typeSelect, searchQuery, applied, field_filter],
  );

  const handleSaveFilter = useCallback(async () => {
    let res;

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
        module_name: 'customer',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'customer',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };

      res = await dispatch(addFilter(addPayload));
    }

    if (res) {
      setSaveFilterModal(false);
      // dispatch(getShowCustomerList(typeSelect, pageLimit, 1, ''));
      // dispatch(
      //   setAllFilters({
      //     ...allFilters,
      //     customer: { ...allFilters?.customer, currentPage: 1 },
      //   }),
      // );
      dispatch(
        getListFilter({
          module_name: 'customer',
        }),
      );
    }

    // dispatch(
    //   setAllFilters({
    //     ...allFilters,
    //     customer: { ...allFilters?.customer, filters: [] },
    //   }),
    // );
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter]);

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

  const orderNoTemplate = useCallback(
    val => {
      return (
        <span
          onClick={() =>
            navigate(`/order-details/${val?.salesOrder_id}`, {
              state: { isView: true },
            })
          }
        >
          {val?.order_no}
        </span>
      );
    },
    [navigate],
  );
  return (
    <>
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white old_customer_wrapper">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col md={5}>
                <div className="page_title">
                  <h3 className="m-0">Old Customer Follow Ups</h3>
                </div>
              </Col>
              <Col md={7}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li>
                      <div className="form_group">
                        <ReactSelectSingle
                          BrokerSelect
                          value={typeSelect}
                          options={Type}
                          onChange={e => {
                            typeSelectHandleChange(e);
                          }}
                          placeholder="All Type"
                        />
                      </div>
                    </li>
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
                                customer: {
                                  ...allCommon?.customer,
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
                      <Dropdown className="dropdown_common export_dropdown position-static">
                        <OverlayTrigger
                          overlay={props => (
                            <Tooltip {...props}>Export</Tooltip>
                          )}
                          placement="bottom"
                        >
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className="btn_border icon_btn"
                            onClick={() => dispatch(customerDataExport())}
                          >
                            <img src={ExportIcon} alt="" />
                          </Dropdown.Toggle>
                        </OverlayTrigger>
                      </Dropdown>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <CustomerMultiSelect
            customerFilterListOptions={customerFilterListOptions}
            field_filter={field_filter}
            setAllCommon={setAllCommon}
            allCommon={allCommon}
          />
          <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() =>
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    customer: {
                      ...allCommon?.customer,
                      filterToggle: !filterToggle,
                    },
                  }),
                )
              }
            >
              <img src={SearchIcon} alt="" />
            </button>

            <DataTable
              value={customerList}
              filterDisplay="row"
              sortMode="single"
              sortField="name"
              dataKey="unique_id"
              filters={customerFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    customer: {
                      ...allCommon?.customer,
                      customerFilters: event?.filters,
                    },
                  }),
                );
              }}
              sortOrder={1}
              scrollable={isMobile === true ? false : true}
              emptyMessage={customerLoading && <Skeleton count={10} />}
            >
              <Column
                field="party_name"
                header="Customer Name"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="customer_group"
                header="Customer Group"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                header="Order No"
                field="order_no"
                className="view_detail"
                sortable
                filter={filterToggle}
                body={orderNoTemplate}
              ></Column>
              <Column
                field="order_date"
                header="Last Order Date"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="days"
                header="Last Order Days"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="state"
                header="State"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="city"
                header="City"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="mobile_no"
                header="Mobile Number"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="present_advisor_name"
                header="Present Advisor"
                sortable
                filter={filterToggle}
              ></Column>
              {(typeSelect === 'snoozed' || typeSelect === 'all') && (
                <Column
                  field="snoozed_on"
                  header="Snoozed On"
                  sortable
                  filter={filterToggle}
                ></Column>
              )}
              {(typeSelect === 'snoozed' || typeSelect === 'all') && (
                <Column
                  field="snooze_for"
                  header="Snoozed For"
                  sortable
                  filter={filterToggle}
                ></Column>
              )}
              <Column
                field="comment"
                header="Comment"
                filter={filterToggle}
                body={inputTemplate}
              ></Column>
              <Column
                field="action"
                header="Action"
                body={partiesAction}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={customerList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={customerDataCount}
            />
          </div>
        </div>
        <Dialog
          header="Save Personal Filters"
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => setSaveFilterModal(false)}
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
        <WhatsAppShare
          whatsappPopup={whatsappPopup}
          setWhatsappPopup={setWhatsappPopup}
          data={whatsappData}
          isBagDetail={false}
        />
      </div>

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
};
export default memo(OldCustomer);
