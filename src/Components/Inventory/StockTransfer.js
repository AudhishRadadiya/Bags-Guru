import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import FilterIcon from '../../Assets/Images/filter.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SearchIcon from '../../Assets/Images/search.svg';
import { useDispatch } from 'react-redux';
import {
  getExportStockTransferFile,
  getStockTransferList,
} from 'Services/Inventory/StockTransferService';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import _ from 'lodash';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import FilterOverlay from 'Components/Common/FilterOverlay';
import { getActiveWarehouseList } from 'Services/Settings/MiscMasterService';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { OverlayPanel } from 'primereact/overlaypanel';
import moment from 'moment';

const filterDetails = [
  { label: 'Item Name', value: 'item_name', type: 'inputBox' },
  { label: 'Id No', value: 'id_no', type: 'inputBox' },
  { label: 'Transfer Date', value: 'transfer_date', type: 'inputBox' },
  { label: 'Source Warehouse', value: 'source_warehouse', type: 'dropDown' },
  { label: 'Target Warehouse', value: 'target_warehouse', type: 'dropDown' },
  { label: 'Available Weight', value: 'available_weight', type: 'inputBox' },
  { label: 'Transfer Weight', value: 'transfer_weight', type: 'inputBox' },
];

export default function StockTransfer({ hasAccess }) {
  const op = useRef(null);
  const dateRef = useRef(null);
  const dispatch = useDispatch();
  const { is_export_access } = hasAccess;

  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [dateRangeHandle, setDateRangeHandle] = useState(false);
  const { listFilter } = useSelector(({ parties }) => parties);
  const {
    stockTransferLoading,
    stockTransferExportLoading,
    stockTransferList,
    stockTransferCount,
  } = useSelector(({ stockTransfer }) => stockTransfer);
  const { miscMasterLoading, activeWarehouseList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { filterToggle, searchQuery, stockTransferFilters } =
    allCommon?.stockTransfer;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex, dates } =
    allFilters?.stockTransfer;

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     dispatch(
  //       getStockTransferList(
  //         pageLimit,
  //         currentPage,
  //         searchQuery,
  //         applied,
  //         dates,
  //       ),
  //     );
  //   }, 700);
  //   return () => clearTimeout(getData);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentPage, pageLimit, applied]);

  const loadRequiredData = useCallback(() => {
    dispatch(
      getListFilter({
        module_name: 'stockTransfer',
      }),
    );
    dispatch(
      getStockTransferList(pageLimit, currentPage, searchQuery, applied, dates),
    );
    dispatch(getActiveWarehouseList());
  }, [applied, currentPage, dates, dispatch, pageLimit, searchQuery]);

  useEffect(() => {
    loadRequiredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = useCallback(
    (data, index, handleFilterEdit, handleFilterDelete) => {
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
    },
    [],
  );

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        getStockTransferList(pageLimit, pageIndex, searchQuery, applied, dates),
      );

      dispatch(
        setAllFilters({
          ...allFilters,
          stockTransfer: {
            ...allFilters?.stockTransfer,
            currentPage: pageIndex,
          },
        }),
      );
    },
    [currentPage, dispatch, pageLimit, searchQuery, applied, dates, allFilters],
  );

  const onPageRowsChange = useCallback(
    page => {
      const updatedCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        getStockTransferList(
          page,
          updatedCurrentPage,
          searchQuery,
          applied,
          dates,
        ),
      );

      dispatch(
        setAllFilters({
          ...allFilters,
          stockTransfer: {
            ...allFilters?.stockTransfer,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );
    },
    [allFilters, applied, dates, dispatch, searchQuery],
  );

  const filterOption = useMemo(() => {
    let flterOptionArray = [...filterDetails];
    if (filters?.length > 0) {
      flterOptionArray = flterOptionArray.map(item => {
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
      target_warehouse: activeWarehouseList,
      source_warehouse: activeWarehouseList,
    };
  }, [activeWarehouseList]);

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
          stockTransfer: {
            ...allFilters?.stockTransfer,
            filters: updatedFilters,
          },
        }),
      );
    },
    [filters, allFilters, dispatch],
  );

  const handleAddFilter = useCallback(() => {
    dispatch(
      setAllFilters({
        ...allFilters,
        stockTransfer: {
          ...allFilters?.stockTransfer,
          filters: [
            ...allFilters?.stockTransfer?.filters,
            { filter: '', value: '' },
          ],
        },
      }),
    );
  }, [allFilters, dispatch]);

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const updatedApplied =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.stockTransfer?.applied)?.length > 0;

      if (updatedApplied) {
        dispatch(
          getStockTransferList(pageLimit, currentPage, searchQuery, {}, dates),
        );
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          stockTransfer: {
            ...allFilters?.stockTransfer,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.stockTransfer?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.stockTransfer.selectedItemIndex !== ''
                ? ''
                : allFilters.stockTransfer.selectedItemIndex,
          },
        }),
      );

      if (updatedFilters?.length === 0 && isEdit === true) {
        setIsEdit(false);
        setNameFilter('');
      }
    },
    [
      allFilters,
      applied,
      currentPage,
      dates,
      dispatch,
      filters,
      isEdit,
      pageLimit,
      searchQuery,
    ],
  );

  const selectedFilters = useMemo(() => {
    let filter = filters?.map(filter => {
      let filterDetail = filterDetails?.find(
        detail => detail.value === filter.filter,
      );
      return filterDetail ? filterDetail : null;
    });
    return filter;
  }, [filters]);

  const handleFilterEdit = useCallback(
    (data, index) => {
      const updatedFilterData = {
        ...data,
        filter_list: data.filter_list.map(item => {
          const findObj = filterDetails.find(
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
          stockTransfer: {
            ...allFilters?.stockTransfer,
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
          module_name: 'stockTransfer',
        }),
      );
      if (res) {
        dispatch(getStockTransferList(pageLimit, 1, searchQuery, {}, dates));
        dispatch(
          setAllFilters({
            ...allFilters,
            stockTransfer: {
              ...allFilters?.stockTransfer,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          }),
        );
        dispatch(
          getListFilter({
            module_name: 'stockTransfer',
          }),
        );
      }
    },
    [dispatch, pageLimit, allFilters, dates, searchQuery],
  );

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
        filterObj = {
          ...filterObj,
          ...{
            [item.filter]: item.value,
          },
        };
      });

      dispatch(
        getStockTransferList(
          pageLimit,
          currentPage,
          searchQuery,
          filterObj,
          dates,
        ),
      );

      dispatch(
        setAllFilters({
          ...allFilters,
          stockTransfer: {
            ...allFilters?.stockTransfer,
            applied: filterObj,
          },
        }),
      );
    }
  }, [
    filters,
    dispatch,
    pageLimit,
    currentPage,
    searchQuery,
    dates,
    allFilters,
  ]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(
          getStockTransferList(pageLimit, currentPage, searchQuery, {}, dates),
        );

        dispatch(
          setAllFilters({
            ...allFilters,
            stockTransfer: {
              ...allFilters?.stockTransfer,
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
            stockTransfer: {
              ...allFilters?.stockTransfer,
              selectedItemIndex: '',
              filters: [],
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
      dispatch,
      pageLimit,
      currentPage,
      searchQuery,
      dates,
      isEdit,
      allFilters,
    ],
  );

  const handleSaveFilter = useCallback(async () => {
    let res;
    // let filterArray = [];
    // filters.forEach(item => {
    //   if (item.value) {
    //     filterArray.push(item);
    //   }
    // });

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
        module_name: 'stockTransfer',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'stockTransfer',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };

      res = await dispatch(addFilter(addPayload));
    }

    if (res) {
      setSaveFilterModal(false);

      // dispatch(getStockTransferList(pageLimit, 1, searchQuery, dates, applied));
      dispatch(
        getListFilter({
          module_name: 'stockTransfer',
        }),
      );
    }

    // dispatch(
    //   setAllFilters({
    //     ...allFilters,
    //     stockTransfer: { ...allFilters?.stockTransfer, currentPage: 1 },
    //   }),
    // );
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter]);

  const onExport = useCallback(
    async key => {
      await dispatch(getExportStockTransferFile(key));
    },
    [dispatch],
  );

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        stockTransfer: {
          ...allFilters?.stockTransfer,
          currentPage: 1,
        },
      }),
    );
    dispatch(
      getStockTransferList(pageLimit, 1, e.target.value, applied, dates),
    );
  };

  const debouncehandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const onChangeDate = (ranges, e) => {
    setDateRangeHandle(true);
  };

  const handleDateManage = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        stockTransfer: {
          ...allFilters?.stockTransfer,
          dates: e,
        },
      }),
    );

    dispatch(
      getStockTransferList(pageLimit, currentPage, searchQuery, applied, e),
    );
  };

  return (
    <>
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col lg={3}>
                <div className="page_title">
                  <h3 className="m-0">Stock Transfer</h3>
                </div>
              </Col>
              <Col lg={9}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li className="search_input_wrap">
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                          onChange={e => {
                            debouncehandleSearchInput(e);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                stockTransfer: {
                                  ...allCommon?.stockTransfer,
                                  searchQuery: e.target.value,
                                },
                              }),
                            );
                          }}
                          value={searchQuery}
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
                      <div
                        className="form_group date_range_wrapper"
                        // onBlur={() => setDateRangeHandle(false)}
                      >
                        {/* <Calendar
                          id=" ConsumptionDate"
                          value={dates}
                          dateFormat="dd-mm-yy"
                          placeholder="Select Date Range"
                          showIcon
                          showButtonBar
                          selectionMode="range"
                          readOnlyInput
                          onChange={e => {
                            dispatch(
                              setAllFilters({
                                ...allFilters,
                                stockTransfer: {
                                  ...allFilters?.stockTransfer,
                                  dates: e.value,
                                },
                              }),
                            );
                            if (e?.value && e.value[0] && e.value[1]) {
                              dispatch(
                                getStockTransferList(
                                  pageLimit,
                                  currentPage,
                                  searchQuery,
                                  applied,
                                  e.value,
                                ),
                              );
                            } else if (e.value === null) {
                              dispatch(
                                getStockTransferList(
                                  pageLimit,
                                  currentPage,
                                  searchQuery,
                                  applied,
                                  e.value,
                                ),
                              );
                            }
                          }}
                        /> */}

                        <div
                          className="date_range_select"
                          onClick={e => {
                            dateRef.current.toggle(e);
                          }}
                        >
                          {/* <span>02-12-2024</span> - <span>02-12-2023</span> */}
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
                                    stockTransfer: {
                                      ...allFilters?.stockTransfer,
                                      dates: {
                                        startDate: '',
                                        endDate: '',
                                        key: 'selection',
                                      },
                                    },
                                  }),
                                );
                                dispatch(
                                  getStockTransferList(
                                    pageLimit,
                                    currentPage,
                                    searchQuery,
                                    applied,
                                    {
                                      startDate: '',
                                      endDate: '',
                                      key: 'selection',
                                    },
                                  ),
                                );
                              }}
                            >
                              Clear
                            </Button>
                          </div>
                        </OverlayPanel>
                      </div>
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
                            disabled={!is_export_access}
                          >
                            <img src={ExportIcon} alt="" />
                          </Dropdown.Toggle>
                        </OverlayTrigger>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => onExport('pdf')}>
                            PDF
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => onExport('excel')}>
                            XLS
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
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
                    stockTransfer: {
                      ...allCommon?.stockTransfer,
                      filterToggle: !filterToggle,
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={stockTransferList}
              sortMode="single"
              sortField="name"
              filterDisplay="row"
              dataKey="_id"
              filters={stockTransferFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    stockTransfer: {
                      ...allCommon?.stockTransfer,
                      stockTransferFilters: event?.filters,
                    },
                  }),
                );
              }}
              sortOrder={1}
              emptyMessage={
                stockTransferLoading ? <Skeleton count={10} /> : false
              }
            >
              <Column
                field="item_name"
                header="Item Name"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="id_no"
                header="Id No."
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="transfer_date"
                header="Transfer Date"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="source_warehouse_name"
                header="Source Warehouse"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="target_warehouse_name"
                header="Target Warehouse"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="available_weight"
                header="Available Weight"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="transfer_weight"
                header="Transfer Weight"
                filter={filterToggle}
                sortable
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={stockTransferList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={stockTransferCount}
            />
          </div>
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
            value={nameFilter}
            onChange={e => setNameFilter(e.target.value)}
          />
        </div>
        <Button className="btn_primary" onClick={handleSaveFilter}>
          {isEdit ? 'Update Filter' : 'Save Filter'}
        </Button>
      </Dialog>
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
