import { Button } from 'primereact/button';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { OverlayPanel } from 'primereact/overlaypanel';
import FilterIcon from '../../Assets/Images/filter.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import {
  getExportProductTransfer,
  getProductTransferList,
} from 'Services/Products/ProductService';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import Skeleton from 'react-loading-skeleton';
import FilterOverlay from 'Components/Common/FilterOverlay';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { getActiveWarehouseList } from 'Services/Settings/MiscMasterService';

const filterDetails = [
  { label: 'Product Code', value: 'product_code', type: 'inputBox' },
  { label: 'Transfer Date', value: 'transfer_date', type: 'inputBox' },
  { label: 'Source Warehouse', value: 'source_warehouse', type: 'dropDown' },
  { label: 'Target Warehouse', value: 'target_warehouse', type: 'dropDown' },
  { label: 'Available Qty', value: 'available_qty', type: 'inputBox' },
  { label: 'Transfer Qty', value: 'transfer_qty', type: 'inputBox' },
];

export default function ProductTransfer({ hasAccess }) {
  const op = useRef(null);
  const dateRef = useRef(null);
  const dispatch = useDispatch();

  const { is_export_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');

  const { listFilter } = useSelector(({ parties }) => parties);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { activeWarehouseList } = useSelector(({ miscMaster }) => miscMaster);
  const { productLoading, productTransferList, productTransferCount } =
    useSelector(({ product }) => product);

  const { filterToggle, searchQuery, productTransferFilters } =
    allCommon?.productTransfer;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex, dates } =
    allFilters?.productTransfer;

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     dispatch(
  //       getProductTransferList(
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
        module_name: 'productTransfer',
      }),
    );
    dispatch(
      getProductTransferList(
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        dates,
      ),
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
    let statusObj = [];
    const products = JSON.parse(JSON.stringify(productTransferList || []));
    products?.forEach(item => {
      if (!statusObj?.includes(item?.is_active ? 'Active' : 'Inactive')) {
        statusObj?.push(item?.is_active ? 'Active' : 'Inactive');
      }
    });

    const warehouse = filters?.find(
      x => x?.filter === 'source_warehouse' || x?.filter === 'target_warehouse',
    );
    const notSelectedWarehouses = activeWarehouseList?.filter(
      x => x?._id !== warehouse?.value,
    );

    return {
      source_warehouse:
        warehouse?.filter === 'target_warehouse' && !!warehouse?.value
          ? notSelectedWarehouses
          : activeWarehouseList,
      target_warehouse:
        warehouse?.filter === 'source_warehouse' && !!warehouse?.value
          ? notSelectedWarehouses
          : activeWarehouseList,
    };
  }, [activeWarehouseList, filters, productTransferList]);

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
          productTransfer: {
            ...allFilters?.productTransfer,
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
        productTransfer: {
          ...allFilters?.productTransfer,
          filters: [
            ...allFilters?.productTransfer?.filters,
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

      const checkAppliedFilter =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.productTransfer?.applied)?.length > 0;

      if (checkAppliedFilter) {
        dispatch(
          getProductTransferList(
            pageLimit,
            currentPage,
            searchQuery,
            {},
            dates,
          ),
        );
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          productTransfer: {
            ...allFilters?.productTransfer,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.productTransfer?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.productTransfer.selectedItemIndex !== ''
                ? ''
                : allFilters.productTransfer.selectedItemIndex,
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
          const findObj = filterDetails?.find(
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
          productTransfer: {
            ...allFilters?.productTransfer,
            filters: updatedFilterData?.filter_list,
            selectedItemIndex: index,
          },
        }),
      );
      setIsEdit(true);
      setNameFilter(data?.filter_name);
      setFilterId(data?._id);
    },
    [dispatch, allFilters],
  );

  const handleFilterDelete = useCallback(
    async (e, data, index) => {
      const res = await dispatch(
        deleteFilter({
          filter_id: data?._id,
          module_name: 'productTransfer',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            productTransfer: {
              ...allFilters?.productTransfer,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          }),
        );

        dispatch(
          getListFilter({
            module_name: 'productTransfer',
          }),
        );
        dispatch(getProductTransferList(pageLimit, 1, searchQuery, {}, dates));
        setNameFilter('');
      }
    },
    [dispatch, pageLimit, searchQuery, allFilters, dates],
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
            [item.filter]:
              item.filter === 'available_qty' || item.filter === 'transfer_qty'
                ? Number(item.value)
                : item.value,
          },
        };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          productTransfer: {
            ...allFilters?.productTransfer,
            applied: filterObj,
          },
        }),
      );

      dispatch(
        getProductTransferList(
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

  const clearAppliedFilter = useCallback(() => {
    if (Object.keys(applied)?.length > 0) {
      dispatch(
        getProductTransferList(pageLimit, currentPage, searchQuery, {}, dates),
      );

      dispatch(
        setAllFilters({
          ...allFilters,
          productTransfer: {
            ...allFilters?.productTransfer,
            applied: {},
            filters: [],
          },
        }),
      );
    } else {
      dispatch(
        setAllFilters({
          ...allFilters,
          productTransfer: {
            ...allFilters?.productTransfer,
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
  }, [
    allFilters,
    applied,
    currentPage,
    dates,
    dispatch,
    isEdit,
    pageLimit,
    searchQuery,
  ]);

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

    let filterArray = [];
    filters.forEach(item => {
      if (item.value) {
        filterArray.push(item);
      }
    });

    if (isEdit) {
      let editPayload = {
        filter_id: filterId,
        module_name: 'productTransfer',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'productTransfer',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };

      res = await dispatch(addFilter(addPayload));
    }

    if (res) {
      setSaveFilterModal(false);
      dispatch(
        getListFilter({
          module_name: 'productTransfer',
        }),
      );
    }
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter]);

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          productTransfer: {
            ...allFilters?.productTransfer,
            currentPage: pageIndex,
          },
        }),
      );

      dispatch(
        getProductTransferList(
          pageLimit,
          pageIndex,
          searchQuery,
          applied,
          dates,
        ),
      );
    },
    [currentPage, dispatch, allFilters, pageLimit, searchQuery, applied, dates],
  );

  const onPageRowsChange = useCallback(
    page => {
      const updateCurrentPage = page === 0 ? 0 : 1;
      dispatch(
        setAllFilters({
          ...allFilters,
          productTransfer: {
            ...allFilters?.productTransfer,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );

      dispatch(
        getProductTransferList(
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

  const onExport = useCallback(
    async key => {
      await dispatch(getExportProductTransfer(key));
    },
    [dispatch],
  );

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        productTransfer: {
          ...allFilters?.productTransfer,
          currentPage: 1,
        },
      }),
    );
    dispatch(
      getProductTransferList(pageLimit, 1, e.target.value, applied, dates),
    );
  };

  const debouncehandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const handleDateManage = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        productTransfer: {
          ...allFilters?.productTransfer,
          dates: e,
        },
      }),
    );

    dispatch(
      getProductTransferList(pageLimit, currentPage, searchQuery, applied, e),
    );
  };

  return (
    <>
      {/* {(productExportLoading || productLoading) && <Loader />} */}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col lg={3}>
                <div className="page_title">
                  <h3 className="m-0">Product Transfer</h3>
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
                                productTransfer: {
                                  ...allCommon?.productTransfer,
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
                        onClick={e => op.current?.toggle(e)}
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
                          selectionMode="range"
                          dateFormat="dd-mm-yy"
                          readOnlyInput
                          showButtonBar
                          onChange={e => {
                            dispatch(
                              setAllFilters({
                                ...allFilters,
                                productTransfer: {
                                  ...allFilters?.productTransfer,
                                  dates: e.value,
                                },
                              }),
                            );
                            if (e?.value && e.value[0] && e.value[1]) {
                              dispatch(
                                getProductTransferList(
                                  pageLimit,
                                  currentPage,
                                  searchQuery,
                                  applied,
                                  e.value,
                                ),
                              );
                            } else if (e.value === null) {
                              dispatch(
                                getProductTransferList(
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
                                    productTransfer: {
                                      ...allFilters?.productTransfer,
                                      dates: {
                                        startDate: '',
                                        endDate: '',
                                        key: 'selection',
                                      },
                                    },
                                  }),
                                );

                                dispatch(
                                  getProductTransferList(
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
                            disabled={is_export_access ? false : true}
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
                    productTransfer: {
                      ...allCommon?.productTransfer,
                      filterToggle: !filterToggle,
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={productTransferList}
              sortMode="single"
              sortField="name"
              filterDisplay="row"
              sortOrder={1}
              filters={productTransferFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    productTransfer: {
                      ...allCommon?.productTransfer,
                      productTransferFilters: event?.filters,
                    },
                  }),
                );
              }}
              dataKey="_id"
              emptyMessage={productLoading && <Skeleton count={10} />}
            >
              <Column
                field="product_code"
                header="Product Code"
                sortable
                className="product_code"
                filter={filterToggle}
              ></Column>
              <Column
                field="transfer_date"
                header="Transfer Date"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="source_warehouse_name"
                header="Source Warehouse"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="target_warehouse_name"
                header="Target Warehouse"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="available_qty"
                header="Available Quantity"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="transfer_qty"
                header="Transfer Quantity"
                filter={filterToggle}
                sortable
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
              dataList={productTransferList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={productTransferCount}
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
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
            />
          </div>
          <Button className="btn_primary" onClick={handleSaveFilter}>
            {isEdit ? 'Update Filter' : 'Save Filter'}
          </Button>
        </Dialog>
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
}
