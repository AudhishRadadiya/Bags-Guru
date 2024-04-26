import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import FilterIcon from '../../Assets/Images/filter.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SearchIcon from '../../Assets/Images/search.svg';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import {
  getExportStockConsumptionFile,
  getStockConsumptionList,
} from 'Services/Inventory/StockConsumptionService';
import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import Skeleton from 'react-loading-skeleton';
import FilterOverlay from 'Components/Common/FilterOverlay';
import { statusObj } from 'Helper/Common';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import moment from 'moment';
import { OverlayPanel } from 'primereact/overlaypanel';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { getActiveLaminationTypeList } from 'Services/Settings/MiscMasterService';

const filterDetails = [
  { label: 'Item Name', value: 'item_name', type: 'inputBox' },
  { label: 'Consumption Date', value: 'consumption_date', type: 'inputBox' },
  { label: 'Job No', value: 'job_no', type: 'inputBox' },
  { label: 'Design Name', value: 'design_name', type: 'inputBox' },
  { label: 'Lamination Type', value: 'lamination', type: 'dropDown' },
  { label: 'Id No', value: 'id_no', type: 'inputBox' },
  { label: 'Colour', value: 'color', type: 'inputBox' },
  { label: 'Width', value: 'width', type: 'inputBox' },
  { label: 'Width mm', value: 'width_mm', type: 'inputBox' },
  { label: 'Length', value: 'length', type: 'inputBox' },
  { label: 'Height', value: 'height', type: 'inputBox' },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'Used Weight', value: 'used_weight', type: 'inputBox' },
  { label: 'Reason', value: 'reason', type: 'inputBox' },
  { label: 'Comment', value: 'comment', type: 'inputBox' },
];

const StockConsumption = ({ hasAccess }) => {
  const op = useRef(null);
  const dateRef = useRef(null);

  const dispatch = useDispatch();
  const { is_export_access } = hasAccess;

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');

  const { listFilter } = useSelector(({ parties }) => parties);
  const {
    stockConsumptionLoading,
    stockConsumptionExportLoading,
    stockConsumptionCount,
    stockConsumptionList,
  } = useSelector(({ stockConsumption }) => stockConsumption);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { activeLaminationTypeList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );
  const { filterToggle, searchQuery, stockConsumptionFilters } =
    allCommon?.stockConsumption;
  const { applied, filters, currentPage, pageLimit, dates, selectedItemIndex } =
    allFilters?.stockConsumption;

  const laminationOptions = useMemo(() => {
    const updatedLaminationData = activeLaminationTypeList?.map(item => {
      return { label: item?.label, value: item.label };
    });
    return [
      ...updatedLaminationData,
      { label: 'Non Laminated', value: 'Non Laminated' },
    ];
  }, [activeLaminationTypeList]);

  // useEffect(() => {
  //   // const getData = setTimeout(() => {
  //   dispatch(
  //     getStockConsumptionList(
  //       pageLimit,
  //       currentPage,
  //       searchQuery,
  //       applied,
  //       dates,
  //     ),
  //   );
  //   // }, 700);
  //   // return () => clearTimeout(getData);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentPage, pageLimit, applied]);

  const loadRequiredData = useCallback(() => {
    dispatch(
      getListFilter({
        module_name: 'inventoryStockConsumption',
      }),
    );
    dispatch(
      getStockConsumptionList(
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        dates,
      ),
    );
    dispatch(getActiveLaminationTypeList());
  }, [applied, currentPage, dates, dispatch, pageLimit, searchQuery]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(
        setAllFilters({
          ...allFilters,
          stockConsumption: {
            ...allFilters?.stockConsumption,
            currentPage: pageIndex,
          },
        }),
      );

      dispatch(
        getStockConsumptionList(
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
      const updatedCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setAllFilters({
          ...allFilters,
          stockConsumption: {
            ...allFilters?.stockConsumption,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );

      dispatch(
        getStockConsumptionList(
          page,
          updatedCurrentPage,
          searchQuery,
          applied,
          dates,
        ),
      );
    },
    [allFilters, applied, dates, dispatch, searchQuery],
  );

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
            onClick={e => handleFilterDelete(e, data, index)}
          >
            <img src={TrashIcon} alt="" />
          </Button>
        </>
      );
    },
    [],
  );

  const onExport = useCallback(
    async key => {
      await dispatch(getExportStockConsumptionFile(key));
    },
    [dispatch],
  );

  const widthMMTemplate = option => {
    return (
      <span className={option.is_mm ? 'text_success' : ''}>
        {option?.width_mm}
      </span>
    );
  };

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
      status: statusObj,
      lamination: laminationOptions,
    };
  }, [laminationOptions]);

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
          stockConsumption: {
            ...allFilters?.stockConsumption,
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
        stockConsumption: {
          ...allFilters?.stockConsumption,
          filters: [
            ...allFilters?.stockConsumption?.filters,
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

      const updatedFilter =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.stockConsumption?.applied)?.length > 0;

      if (updatedFilter) {
        dispatch(
          getStockConsumptionList(
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
          stockConsumption: {
            ...allFilters?.stockConsumption,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.stockConsumption?.applied)?.length >
                0 && { applied: {} }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.stockConsumption.selectedItemIndex !== ''
                ? ''
                : allFilters.stockConsumption.selectedItemIndex,
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
      dispatch,
      allFilters,
      applied,
      pageLimit,
      currentPage,
      searchQuery,
      dates,
      isEdit,
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
      const updatedData = {
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
          stockConsumption: {
            ...allFilters?.stockConsumption,
            filters: updatedData?.filter_list,
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
          module_name: 'inventoryStockConsumption',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            stockConsumption: {
              ...allFilters?.stockConsumption,
              currentPage: 1,
              selectedItemIndex: '',
              filters: [],
              applied: {},
            },
          }),
        );

        dispatch(getStockConsumptionList(pageLimit, 1, searchQuery, {}, dates));
        dispatch(
          getListFilter({
            module_name: 'inventoryStockConsumption',
          }),
        );
      }
    },
    [dispatch, pageLimit, allFilters, searchQuery, dates],
  );

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    filters?.forEach(item => {
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
              item.filter === 'gsm' ? Number(item.value) : item.value,
          },
        };
      });

      dispatch(
        setAllFilters({
          ...allFilters,
          stockConsumption: {
            ...allFilters?.stockConsumption,
            applied: filterObj,
          },
        }),
      );

      dispatch(
        getStockConsumptionList(
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
        getStockConsumptionList(pageLimit, currentPage, searchQuery, {}, dates),
      );

      dispatch(
        setAllFilters({
          ...allFilters,
          stockConsumption: {
            ...allFilters?.stockConsumption,
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
          stockConsumption: {
            ...allFilters?.stockConsumption,
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
  }, [dispatch, allFilters, applied, isEdit]);

  const handleSaveFilter = useCallback(async () => {
    let res;
    // let filterArray = [];
    // filters?.forEach(item => {
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
        module_name: 'inventoryStockConsumption',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'inventoryStockConsumption',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };

      res = await dispatch(addFilter(addPayload));
    }

    if (res) {
      setSaveFilterModal(false);

      // dispatch(
      //   getStockConsumptionList(pageLimit, 1, searchQuery, applied, dates),
      // );
      dispatch(
        getListFilter({
          module_name: 'inventoryStockConsumption',
        }),
      );
    }

    // dispatch(
    //   setAllFilters({
    //     ...allFilters,
    //     stockConsumption: { ...allFilters?.stockConsumption, currentPage: 1 },
    //   }),
    // );
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [
    dispatch,
    filterId,
    filters,
    isEdit,
    nameFilter,
    pageLimit,
    allFilters,
    searchQuery,
    applied,
    dates,
  ]);

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        stockConsumption: {
          ...allFilters?.stockConsumption,
          currentPage: 1,
        },
      }),
    );
    dispatch(
      getStockConsumptionList(pageLimit, 1, e.target.value, applied, dates),
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
        stockConsumption: {
          ...allFilters?.stockConsumption,
          dates: e,
        },
      }),
    );

    dispatch(
      getStockConsumptionList(pageLimit, currentPage, searchQuery, applied, e),
    );
  };

  return (
    <>
      {/* {(stockConsumptionExportLoading || stockConsumptionLoading) && <Loader />} */}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col lg={3}>
                <div className="page_title">
                  <h3 className="m-0">Stock Consumption</h3>
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
                                stockConsumption: {
                                  ...allCommon?.stockConsumption,
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
                          id="ConsumptionDate"
                          value={dates}
                          placeholder="Select Date Range"
                          showIcon
                          dateFormat="dd-mm-yy"
                          showButtonBar
                          selectionMode="range"
                          readOnlyInput
                          onChange={e => {
                            dispatch(
                              setAllFilters({
                                ...allFilters,
                                stockConsumption: {
                                  ...allFilters?.stockConsumption,
                                  dates: e.value,
                                },
                              }),
                            );
                            if (e?.value && e.value[0] && e.value[1]) {
                              dispatch(
                                getStockConsumptionList(
                                  pageLimit,
                                  currentPage,
                                  searchQuery,
                                  applied,
                                  e.value,
                                ),
                              );
                            } else if (e.value === null) {
                              dispatch(
                                getStockConsumptionList(
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
                                    stockConsumption: {
                                      ...allFilters?.stockConsumption,
                                      dates: {
                                        startDate: '',
                                        endDate: '',
                                        key: 'selection',
                                      },
                                    },
                                  }),
                                );
                                dispatch(
                                  getStockConsumptionList(
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
                    stockConsumption: {
                      ...allCommon?.stockConsumption,
                      filterToggle: !filterToggle,
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={stockConsumptionList}
              sortMode="single"
              sortField="name"
              filters={stockConsumptionFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    stockConsumption: {
                      ...allCommon?.stockConsumption,
                      stockConsumptionFilters: event?.filters,
                    },
                  }),
                );
              }}
              filterDisplay="row"
              dataKey="_id"
              sortOrder={1}
              emptyMessage={stockConsumptionLoading && <Skeleton count={10} />}
            >
              <Column
                field="item_name"
                header="Item Name"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="consumption_date"
                header="Consumption Date"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="job_no"
                header="Job No"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="design_name"
                header="Design Name"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="lamination"
                header="Lamination Type"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="id_no"
                header="ID No."
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="color"
                header="Colour"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="width"
                header="Width"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="width_mm"
                header="Width(MM)"
                sortable
                filter={filterToggle}
                body={widthMMTemplate}
              ></Column>
              <Column
                field="length"
                header="Length"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="height"
                header="Height"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="gsm"
                header="GSM"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="used_weight"
                header="Used Weight"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="reason"
                header="Reason"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="comment"
                header="Comment"
                sortable
                filter={filterToggle}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={stockConsumptionList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={stockConsumptionCount}
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
      </div>
    </>
  );
};
export default StockConsumption;
