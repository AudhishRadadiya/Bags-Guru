import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Skeleton from 'react-loading-skeleton';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import {
  exportRollRequirementExcel,
  exportRollRequirementPdf,
  exportStockWithoutOrderExcel,
  exportStockWithoutOrderPdf,
  getNlRollRequirement,
  getRollStockWithoutOrderList,
} from 'Services/Purchase/purchaseOrderService';
import Loader from 'Components/Common/Loader';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import FilterIcon from '../../Assets/Images/filter.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import FilterOverlay from 'Components/Common/FilterOverlay';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { getActiveFabricColorList } from 'Services/Settings/MiscMasterService';

const nlRequirementFilterDetail = [
  { label: 'Material', value: 'material', type: 'inputBox' },
  { label: 'Color', value: 'fabric_color', type: 'dropDown' },
  { label: 'Width', value: 'roll_width', type: 'inputBox' },
  { label: 'Length', value: 'gsm_length', type: 'inputBox' },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'In Stock', value: 'in_stock', type: 'inputBox' },
  { label: 'Pending Order', value: 'pending_order', type: 'inputBox' },
  {
    label: 'Used in Last Period',
    value: 'used_in_last_period',
    type: 'inputBox',
  },
  { label: 'Final Count', value: 'final_count', type: 'inputBox' },
];

const stockWithoutOrderFilterDetail = [
  { label: 'Material', value: 'material', type: 'inputBox' },
  { label: 'Color', value: 'fabric_color', type: 'dropDown' },
  { label: 'Width', value: 'roll_width', type: 'inputBox' },
  { label: 'Length', value: 'gsm_length', type: 'inputBox' },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'In Stock', value: 'in_stock', type: 'inputBox' },
  { label: 'Pending Order', value: 'pending_order', type: 'inputBox' },
  {
    label: 'Used in Last Period',
    value: 'used_in_last_period',
    type: 'inputBox',
  },
  { label: 'Final Count', value: 'final_count', type: 'inputBox' },
];

export default function NLRequirement({ hasAccess }) {
  const op = useRef(null);
  const dateRef = useRef(null);
  const dispatch = useDispatch();
  const { is_export_access } = hasAccess;

  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [requiredRollPopup, setRequiredRollPopup] = useState({
    requiredRollModal: false,
    requiredRollData: {},
  });

  const {
    rollRequirementLoading,
    rollRequirementListLoading,
    rollRequirementCount,
    rollRequirementList,
    rollStockWithoutOrderList,
  } = useSelector(({ purchaseOrder }) => purchaseOrder);
  const { listFilter } = useSelector(({ parties }) => parties);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { fabricColorListMenu } = useSelector(({ miscMaster }) => miscMaster);

  const {
    filterToggle,
    stockWithoutOrderFilterToggle,
    searchQuery,
    isStockWithoutOrder,
  } = allCommon?.nlRequirement;
  const {
    applied,
    filters,
    currentPage,
    pageLimit,
    isStockWithoutOrderPageLimit,
    isStockWithoutOrderCurrentPage,
    selectedItemIndex,
    dates,
  } = allFilters?.nlRequirement;

  const handleNLRequirementListing = useCallback(() => {
    if (isStockWithoutOrder) {
      dispatch(
        getRollStockWithoutOrderList(
          isStockWithoutOrderPageLimit,
          isStockWithoutOrderCurrentPage,
          searchQuery,
          applied,
          dates,
        ),
      );
    } else {
      dispatch(
        getNlRollRequirement(
          pageLimit,
          currentPage,
          searchQuery,
          applied,
          dates,
        ),
      );
    }
  }, [
    applied,
    dates,
    dispatch,
    pageLimit,
    currentPage,
    searchQuery,
    isStockWithoutOrder,
    isStockWithoutOrderCurrentPage,
    isStockWithoutOrderPageLimit,
  ]);

  const loadRequiredData = useCallback(() => {
    const today = new Date();
    const lastYear = today.getFullYear() - 1;

    // Set the first date of the current month of the previous year
    const firstDateOfLastYearMonth = new Date(lastYear, today.getMonth(), 1);

    // Set the last date of the current month of the previous year
    const lastDateOfLastYearMonth = new Date(lastYear, today.getMonth() + 1, 0);

    // dispatch(
    //   setAllFilters({
    //     ...allFilters,
    //     nlRequirement: {
    //       ...allFilters?.nlRequirement,
    //       dates: [firstDateOfLastYearMonth, lastDateOfLastYearMonth],
    //     },
    //   }),
    // );
    // dispatch(
    //   getNlRollRequirement(pageLimit, currentPage, searchQuery, applied, [
    //     firstDateOfLastYearMonth,
    //     lastDateOfLastYearMonth,
    //   ]),
    // );
    dispatch(
      getListFilter({
        module_name: 'nl_requirement',
      }),
    );
    handleNLRequirementListing();
    dispatch(getActiveFabricColorList());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
  }, [loadRequiredData]);

  const filterOption = useMemo(() => {
    let flterOptionArray = isStockWithoutOrder
      ? [...stockWithoutOrderFilterDetail]
      : [...nlRequirementFilterDetail];
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
      fabric_color: fabricColorListMenu,
    };
  }, [fabricColorListMenu]);

  const selectedFilters = filters?.map(filter => {
    let filterDetailView = isStockWithoutOrder
      ? stockWithoutOrderFilterDetail
      : nlRequirementFilterDetail;

    const filterDetail = filterDetailView?.find(
      detail => detail.value === filter.filter,
    );
    return filterDetail ? filterDetail : null;
  });

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
        nlRequirement: {
          ...allFilters?.nlRequirement,
          filters: updatedFilters,
        },
      }),
    );
  };

  const pendingTemplete = data => {
    return (
      <div
        onClick={() =>
          setRequiredRollPopup({
            requiredRollModal: true,
            requiredRollData: data,
          })
        }
      >
        {data?.required_roll}
      </div>
    );
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
        module_name: 'nl_requirement',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'nl_requirement',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'nl_requirement',
        }),
      );
      op.current?.hide();
    }
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  };

  const handleFilterDelete = async (e, data, index) => {
    const res = await dispatch(
      deleteFilter({
        filter_id: data?._id,
        module_name: 'nl_requirement',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          nlRequirement: {
            ...allFilters?.nlRequirement,
            currentPage: 1,
            filters: [],
            selectedItemIndex: '',
            applied: {},
          },
        }),
      );
      dispatch(
        getListFilter({
          module_name: 'nl_requirement',
        }),
      );

      if (isStockWithoutOrder) {
        dispatch(
          getRollStockWithoutOrderList(
            isStockWithoutOrderPageLimit,
            1,
            searchQuery,
            {},
            dates,
          ),
        );
      } else {
        dispatch(getNlRollRequirement(pageLimit, 1, searchQuery, {}, dates));
      }

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
        const check_key =
          item.filter === 'gsm' ||
          item.filter === 'gsm_length' ||
          item.filter === 'in_stock' ||
          item.filter === 'pending_order' ||
          item.filter === 'used_in_last_period';
        filterObj = {
          ...filterObj,
          [item.filter]: check_key ? Number(item.value) : item.value,
        };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          nlRequirement: { ...allFilters?.nlRequirement, applied: filterObj },
        }),
      );
      if (isStockWithoutOrder) {
        dispatch(
          getRollStockWithoutOrderList(
            isStockWithoutOrderPageLimit,
            isStockWithoutOrderCurrentPage,
            searchQuery,
            filterObj,
            dates,
          ),
        );
      } else {
        dispatch(
          getNlRollRequirement(
            pageLimit,
            currentPage,
            searchQuery,
            filterObj,
            dates,
          ),
        );
      }
    }
  }, [
    filters,
    dispatch,
    allFilters,
    searchQuery,
    dates,
    pageLimit,
    currentPage,
    isStockWithoutOrder,
    isStockWithoutOrderPageLimit,
    isStockWithoutOrderCurrentPage,
  ]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        if (isStockWithoutOrder) {
          dispatch(
            getRollStockWithoutOrderList(
              isStockWithoutOrderPageLimit,
              isStockWithoutOrderCurrentPage,
              searchQuery,
              {},
              dates,
            ),
          );
        } else {
          dispatch(
            getNlRollRequirement(
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
            nlRequirement: {
              ...allFilters?.nlRequirement,
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
            nlRequirement: {
              ...allFilters?.nlRequirement,
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
      isEdit,
      dispatch,
      allFilters,
      searchQuery,
      dates,
      pageLimit,
      currentPage,
      isStockWithoutOrder,
      isStockWithoutOrderPageLimit,
      isStockWithoutOrderCurrentPage,
    ],
  );

  const handleFilterEdit = (data, index) => {
    const sortingFiletr = [
      ...nlRequirementFilterDetail,
      ...stockWithoutOrderFilterDetail,
    ];

    const updatedFilterData = {
      ...data,
      filter_list: data.filter_list.map(item => {
        const findObj = sortingFiletr?.find(
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
        nlRequirement: {
          ...allFilters?.nlRequirement,
          filters: updatedFilterData?.filter_list,
          selectedItemIndex: index,
        },
      }),
    );
    setIsEdit(true);
    setNameFilter(data?.filter_name);
    setFilterId(data?._id);
  };

  const handleAddFilter = useCallback(() => {
    dispatch(
      setAllFilters({
        ...allFilters,
        nlRequirement: {
          ...allFilters?.nlRequirement,
          filters: [
            ...allFilters?.nlRequirement?.filters,
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

      const updateAppliedFilters =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.nlRequirement?.applied)?.length > 0;

      if (updateAppliedFilters) {
        if (isStockWithoutOrder) {
          dispatch(
            getRollStockWithoutOrderList(
              isStockWithoutOrderPageLimit,
              isStockWithoutOrderCurrentPage,
              searchQuery,
              {},
              dates,
            ),
          );
        } else {
          dispatch(
            getNlRollRequirement(
              pageLimit,
              currentPage,
              searchQuery,
              {},
              dates,
            ),
          );
        }
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          nlRequirement: {
            ...allFilters?.nlRequirement,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.nlRequirement?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.nlRequirement.selectedItemIndex !== ''
                ? ''
                : allFilters.nlRequirement.selectedItemIndex,
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
      isStockWithoutOrder,
      pageLimit,
      currentPage,
      searchQuery,
      dates,
    ],
  );

  const handleFilterUpdate = () => {
    dispatch(
      setAllCommon({
        ...allCommon,
        nlRequirement: {
          ...allCommon?.nlRequirement,
          filterToggle: !filterToggle,
        },
      }),
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
          nlRequirement: {
            ...allFilters?.nlRequirement,
            currentPage: pageIndex,
          },
        }),
      );

      dispatch(
        getNlRollRequirement(pageLimit, pageIndex, searchQuery, applied, dates),
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
          nlRequirement: {
            ...allFilters?.nlRequirement,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );
      dispatch(
        getNlRollRequirement(
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

  const isStockWithoutOrderOnPageChange = useCallback(
    page => {
      let pageIndex = isStockWithoutOrderCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(
        setAllFilters({
          ...allFilters,
          nlRequirement: {
            ...allFilters?.nlRequirement,
            isStockWithoutOrderCurrentPage: pageIndex,
          },
        }),
      );

      dispatch(
        getRollStockWithoutOrderList(
          isStockWithoutOrderPageLimit,
          pageIndex,
          searchQuery,
          applied,
          dates,
        ),
      );
    },
    [
      dispatch,
      allFilters,
      searchQuery,
      dates,
      applied,
      isStockWithoutOrderPageLimit,
      isStockWithoutOrderCurrentPage,
    ],
  );

  const isStockWithoutOrderOnPageRowsChange = useCallback(
    page => {
      const updateCurrentPage = page === 0 ? 0 : 1;
      dispatch(
        setAllFilters({
          ...allFilters,
          nlRequirement: {
            ...allFilters?.nlRequirement,
            isStockWithoutOrderCurrentPage: updateCurrentPage,
            isStockWithoutOrderPageLimit: page,
          },
        }),
      );

      dispatch(
        getRollStockWithoutOrderList(
          page,
          updateCurrentPage,
          searchQuery,
          applied,
          dates,
        ),
      );
    },
    [allFilters, dates, dispatch, searchQuery, applied],
  );

  const handleSearchInput = (e, isStockWithoutOrder) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        nlRequirement: {
          ...allFilters?.nlRequirement,
          ...(!isStockWithoutOrder && { currentPage: 1 }),
          ...(isStockWithoutOrder && { jobsCurrentPage: 1 }),
        },
      }),
    );

    if (isStockWithoutOrder) {
      dispatch(
        getRollStockWithoutOrderList(
          isStockWithoutOrderPageLimit,
          1,
          e.target.value,
          applied,
          dates,
        ),
      );
    } else {
      dispatch(
        getNlRollRequirement(pageLimit, 1, e.target.value, applied, dates),
      );
    }
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const onExportPdf = useCallback(
    async key => {
      if (isStockWithoutOrder) {
        await dispatch(exportStockWithoutOrderPdf());
      } else {
        await dispatch(exportRollRequirementPdf());
      }
    },
    [dispatch, isStockWithoutOrder],
  );

  const onExportExcel = useCallback(
    async key => {
      if (isStockWithoutOrder) {
        await dispatch(exportStockWithoutOrderExcel());
      } else {
        await dispatch(exportRollRequirementExcel());
      }
    },
    [dispatch, isStockWithoutOrder],
  );

  const handleDateManage = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        nlRequirement: {
          ...allFilters?.nlRequirement,
          dates: e,
        },
      }),
    );

    if (isStockWithoutOrder) {
      dispatch(
        getRollStockWithoutOrderList(
          isStockWithoutOrderPageLimit,
          isStockWithoutOrderCurrentPage,
          searchQuery,
          applied,
          e,
        ),
      );
    } else {
      dispatch(
        getNlRollRequirement(pageLimit, currentPage, searchQuery, applied, e),
      );
    }
  };

  const NlRollRequirementTable = useMemo(() => {
    return (
      <div className="data_table_wrapper cell_padding_large is_filter">
        <DataTable
          value={rollRequirementList}
          sortMode="single"
          sortField="name"
          filterDisplay="row"
          sortOrder={1}
          rows={10}
          dataKey="_id"
          emptyMessage={rollRequirementListLoading && <Skeleton count={10} />}
        >
          <Column field="material" header="Material" sortable></Column>
          <Column field="fabric_color" header="Color" sortable></Column>
          <Column field="roll_width" header="Width" sortable></Column>
          <Column field="gsm_length" header="Length" sortable></Column>
          <Column field="gsm" header="GSM" sortable></Column>
          <Column field="in_stock" header="In Stock" sortable></Column>
          <Column
            field="required_roll"
            header="Pending Order"
            body={pendingTemplete}
            className="view_detail"
            sortable
          ></Column>
          <Column
            field="used_in_last_period"
            header="Used in Last Period"
            sortable
          ></Column>
          <Column
            field="group_name"
            header="Item Name"
            sortable
            // className="product_code suggested_roll"
          ></Column>
        </DataTable>
        <CustomPaginator
          dataList={rollRequirementList}
          pageLimit={pageLimit}
          onPageChange={onPageChange}
          onPageRowsChange={onPageRowsChange}
          currentPage={currentPage}
          totalCount={rollRequirementCount}
        />
      </div>
    );
  }, [
    currentPage,
    filterToggle,
    pageLimit,
    rollRequirementCount,
    rollRequirementList,
    rollRequirementListLoading,
  ]);

  const rollStockWithoutOrderTable = useMemo(() => {
    return (
      <div className="data_table_wrapper cell_padding_large is_filter">
        <DataTable
          value={rollStockWithoutOrderList?.list}
          sortMode="single"
          sortField="name"
          filterDisplay="row"
          sortOrder={1}
          rows={10}
          dataKey="_id"
          emptyMessage={rollRequirementListLoading && <Skeleton count={10} />}
        >
          <Column field="material" header="Material" sortable></Column>
          <Column field="fabric_color" header="Color" sortable></Column>
          <Column field="roll_width" header="Width" sortable></Column>
          <Column field="gsm_length" header="Length" sortable></Column>
          <Column field="gsm" header="GSM" sortable></Column>
          <Column field="in_stock" header="In Stock" sortable></Column>
          <Column
            field="required_roll"
            header="Pending Order"
            sortable
          ></Column>
          <Column
            field="used_in_last_period"
            header="Used in Last Period"
            sortable
          ></Column>
          <Column
            field="group_name"
            header="Item Name"
            sortable
            // className="product_code suggested_roll"
          ></Column>
        </DataTable>
        <CustomPaginator
          dataList={rollStockWithoutOrderList?.list}
          pageLimit={isStockWithoutOrderPageLimit}
          onPageChange={isStockWithoutOrderOnPageChange}
          onPageRowsChange={isStockWithoutOrderOnPageRowsChange}
          currentPage={isStockWithoutOrderCurrentPage}
          totalCount={rollStockWithoutOrderList?.count}
        />
      </div>
    );
  }, [
    rollRequirementListLoading,
    stockWithoutOrderFilterToggle,
    isStockWithoutOrderCurrentPage,
    isStockWithoutOrderPageLimit,
    rollRequirementLoading,
    rollStockWithoutOrderList,
  ]);

  return (
    <div className="main_Wrapper">
      {rollRequirementLoading && (
        // miscMasterLoading
        <Loader />
      )}
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col xxl={6}>
              <div className="page_title">
                <h3 className="m-0">
                  Nonwoven Nonlaminated Rolls Requirement{' '}
                </h3>
              </div>
            </Col>
            <Col xxl={6}>
              <div className="right_filter_wrapper">
                <ul>
                  <li className="order_checkbox_wrap">
                    <div className="form_group checkbox_wrap">
                      <Checkbox
                        inputId="ShowTransportersonly"
                        name="ShowTransportersonly"
                        onChange={e => {
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              nlRequirement: {
                                ...allCommon?.nlRequirement,
                                isStockWithoutOrder: e.checked,
                                filterToggle: e.checked ? false : true,
                                searchQuery: '',
                              },
                            }),
                          );

                          if (e.checked) {
                            dispatch(
                              getRollStockWithoutOrderList(
                                isStockWithoutOrderPageLimit,
                                isStockWithoutOrderCurrentPage,
                                '',
                                applied,
                                dates,
                              ),
                            );
                          } else {
                            dispatch(
                              getNlRollRequirement(
                                pageLimit,
                                currentPage,
                                '',
                                applied,
                                dates,
                              ),
                            );
                          }
                        }}
                        checked={isStockWithoutOrder}
                      />
                      <label htmlFor="ShowTransportersonly" className="mb-0">
                        Stock Without Order
                      </label>
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
                          debounceHandleSearchInput(e, isStockWithoutOrder);
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              nlRequirement: {
                                ...allCommon?.nlRequirement,
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

                  {/* <li>
                    <div className="form_group date_select_wrapper">
                      <Calendar
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
                              nlRequirement: {
                                ...allFilters?.nlRequirement,
                                dates: e.value,
                              },
                            }),
                          );
                          if (e?.value && e.value[0] && e.value[1]) {
                            dispatch(
                              getNlRollRequirement(
                                pageLimit,
                                currentPage,
                                searchQuery,
                                applied,
                                e.value,
                              ),
                            );
                          } else if (e.value === null) {
                            dispatch(
                              getNlRollRequirement(
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
                    </div>
                  </li> */}
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
                                  nlRequirement: {
                                    ...allFilters?.nlRequirement,
                                    dates: {
                                      startDate: '',
                                      endDate: '',
                                      key: 'selection',
                                    },
                                  },
                                }),
                              );
                              dispatch(
                                getNlRollRequirement(
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
                        overlay={props => <Tooltip {...props}>Export</Tooltip>}
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
                        <Dropdown.Item onClick={() => onExportPdf()}>
                          PDF
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onExportExcel()}>
                          XLS
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  {/* <li>
                    <Button
                      className="btn_primary"
                      // onClick={is_edit_access && onSaveProductRate}
                      // disabled={
                      //   productCRUDLoading || (is_edit_access ? false : true)
                      // }
                    >
                      Save Final Count
                    </Button>
                  </li> */}
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        {isStockWithoutOrder && rollStockWithoutOrderTable}
        {!isStockWithoutOrder && NlRollRequirementTable}
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

      <Dialog
        header="Pending Order"
        visible={!!requiredRollPopup?.requiredRollModal}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() =>
          setRequiredRollPopup({
            ...requiredRollPopup,
            requiredRollModal: false,
            requiredRollData: {},
          })
        }
      >
        <div className="panding_orders_Wrapper">
          <ul>
            {requiredRollPopup?.requiredRollData?.design_wise_requirement?.map(
              (item, i) => {
                return <li key={i}>{item}</li>;
              },
            )}
          </ul>
        </div>
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
  );
}
