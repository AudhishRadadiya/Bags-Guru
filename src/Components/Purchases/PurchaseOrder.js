import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Tag } from 'primereact/tag';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Loader from 'Components/Common/Loader';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import {
  cancelPurchaseOrder,
  deletePurchaseOrder,
  generateCommonItemGroupPDF,
  generatePrePrintedRollPDF,
  getPurchaseOrderList,
} from 'Services/Purchase/purchaseOrderService';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import {
  setIsGetInitialValuesPurchaseOrder,
  setIsGetInitialValuesReceivePurchaseOrder,
} from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import PDFIcon from '../../Assets/Images/pdf.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import { checkModulePermission, customSortFunction } from 'Helper/Common';
import TrashIcon from '../../Assets/Images/trash.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import FilterIcon from '../../Assets/Images/filter.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import FilterOverlay from 'Components/Common/FilterOverlay';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CancelOrder from '../../Assets/Images/cancel-order.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';
import MarkAsReceive from '../../Assets/Images/markAsReceive.svg';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { getActiveWarehouseList } from 'Services/Settings/MiscMasterService';

const purchaseOrderFilterDetails = [
  { label: 'P.O. Number', value: 'po_number', type: 'inputBox' },
  { label: 'Warehouse', value: 'warehouse_name', type: 'dropDown' },
  { label: 'Item Name', value: 'item_name', type: 'inputBox' },
  { label: 'Supplier Name', value: 'supplier_name', type: 'inputBox' },
  { label: 'P.O. Date', value: 'purchase_date', type: 'inputBox' },
  { label: 'Due Date', value: 'due_date', type: 'inputBox' },
  { label: 'Days', value: 'days', type: 'inputBox' },
  { label: 'Total Amount', value: 'total', type: 'inputBox' },
  { label: 'Created By', value: 'created_by_name', type: 'inputBox' },
];

export default function PurchaseOrder({ hasAccess }) {
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
  const [selectId, setSelectId] = useState('false');
  const [cancelOrder, setCancelOrder] = useState(false);
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [orderDeletePopup, setOrderDeletePopup] = useState(false);

  const {
    POTotalAmount,
    purchaseOrderList,
    purchaseOrderListLoading,
    purchaseOrderCount,
    purchaseOrderLoading,
    isGetInitialValuesPurchaseOrder,
    isGetInitialValuesReceivePurchaseOrder,
  } = useSelector(({ purchaseOrder }) => purchaseOrder);
  const { currentUser } = useSelector(({ auth }) => auth);
  const { listFilter } = useSelector(({ parties }) => parties);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { userPermissionList } = useSelector(({ settings }) => settings);
  const { activeWarehouseList } = useSelector(({ miscMaster }) => miscMaster);

  const { filterToggle, searchQuery, purchaseOrderFilters } =
    allCommon?.purchaseOrder;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex, dates } =
    allFilters?.purchaseOrder;

  const checkPurchaseReceivePermission = checkModulePermission(
    userPermissionList,
    'Purchases',
    'Purchase Entry',
    'create',
  );

  const loadRequiredData = useCallback(() => {
    dispatch(
      getListFilter({
        module_name: 'purchase_order',
      }),
    );
    dispatch(
      getPurchaseOrderList(pageLimit, currentPage, searchQuery, applied, dates),
    );
    dispatch(getActiveWarehouseList());
  }, [applied, currentPage, dates, dispatch, pageLimit, searchQuery]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  const warehouseOptions = useMemo(() => {
    const updatedWarehouseData = activeWarehouseList?.map(item => {
      return { label: item?.name, value: item?.name };
    });
    return updatedWarehouseData;
  }, [activeWarehouseList]);

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total" colSpan={8} />
        <Column footer={POTotalAmount} />
        <Column footer="" colSpan={3} />
      </Row>
    </ColumnGroup>
  );

  const filterOption = useMemo(() => {
    let flterOptionArray = [...purchaseOrderFilterDetails];
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
      warehouse_name: warehouseOptions,
    };
  }, [warehouseOptions]);

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(
        setAllFilters({
          ...allFilters,
          purchaseOrder: {
            ...allFilters?.purchaseOrder,
            currentPage: pageIndex,
          },
        }),
      );
      dispatch(
        getPurchaseOrderList(pageLimit, pageIndex, searchQuery, applied, dates),
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
          purchaseOrder: {
            ...allFilters?.purchaseOrder,
            currentPage: updateCurrentPage,
            pageLimit: page,
          },
        }),
      );
      dispatch(
        getPurchaseOrderList(
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

  const selectedFilters = filters?.map(filter => {
    const filterDetail = purchaseOrderFilterDetails?.find(
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
        purchaseOrder: {
          ...allFilters?.purchaseOrder,
          filters: updatedFilters,
        },
      }),
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
        module_name: 'purchase_order',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'purchase_order',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'purchase_order',
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
        module_name: 'purchase_order',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          purchaseOrder: {
            ...allFilters?.purchaseOrder,
            currentPage: 1,
            filters: [],
            selectedItemIndex: '',
            applied: {},
          },
        }),
      );
      dispatch(
        getListFilter({
          module_name: 'purchase_order',
        }),
      );
      dispatch(getPurchaseOrderList(pageLimit, 1, searchQuery, {}, dates));

      op.current?.hide();
    }
  };

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    const filter_fileds = [
      'days',
      'amount',
      'width',
      'height',
      'gusset',
      'gsm',
      'cylinder',
      'qty',
      'kg_qty',
      'rate',
      'kg_rate',
      'stereo_charge',
      'act_stereo_charge',
      'additional_charge',
      'wastage',
      'profit',
      'act_kg_rate',
      'theoretical_kg_rate',
      'job_no',
    ];

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
            [item.filter]: filter_fileds.includes(item?.filter)
              ? Number(item.value)
              : item.value,
          },
        };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          purchaseOrder: { ...allFilters?.purchaseOrder, applied: filterObj },
        }),
      );
      dispatch(
        getPurchaseOrderList(
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
          getPurchaseOrderList(pageLimit, currentPage, searchQuery, {}, dates),
        );
        dispatch(
          setAllFilters({
            ...allFilters,
            purchaseOrder: {
              ...allFilters?.purchaseOrder,
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
            purchaseOrder: {
              ...allFilters?.purchaseOrder,
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
      pageLimit,
      currentPage,
      searchQuery,
      dates,
      allFilters,
    ],
  );
  const handleFilterEdit = (data, index) => {
    const updatedFilterData = {
      ...data,
      filter_list: data.filter_list.map(item => {
        const findObj = purchaseOrderFilterDetails?.find(
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
        purchaseOrder: {
          ...allFilters?.purchaseOrder,
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
        purchaseOrder: {
          ...allFilters?.purchaseOrder,
          filters: [
            ...allFilters?.purchaseOrder?.filters,
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
        Object.keys(allFilters?.purchaseOrder?.applied)?.length > 0;

      if (checkAppliedFilter) {
        dispatch(
          getPurchaseOrderList(pageLimit, currentPage, searchQuery, {}, dates),
        );
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          purchaseOrder: {
            ...allFilters?.purchaseOrder,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.purchaseOrder?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.purchaseOrder.selectedItemIndex !== ''
                ? ''
                : allFilters.purchaseOrder.selectedItemIndex,
          },
        }),
      );

      if (updatedFilters?.length === 0 && isEdit === true) {
        setIsEdit(false);
        setNameFilter('');
      }
    },
    [filters, dispatch, allFilters, isEdit],
  );

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

  const getSeverity = status => {
    switch (status) {
      case 0:
        return 'warning';
      case 1:
        return 'primary';
      case 2:
        return 'success';
      default:
        return 'warning';
    }
  };

  const getRowClassName = rowData => {
    if (rowData?.is_cancelled) {
      return 'cancelled-row';
    }
    return '';
  };

  const statusBodyTemplate = rowData => {
    return (
      <Tag
        value={
          rowData?.is_cancelled
            ? 'Cancelled'
            : rowData?.status === 0
            ? 'Ordered'
            : rowData?.status === 1
            ? 'Partially Received'
            : 'Received'
        }
        severity={
          rowData?.is_cancelled ? 'danger' : getSeverity(rowData?.status)
        }
      />
    );
  };

  const itemNameTemplate = val => {
    return (
      <span
        onClick={() => {
          // dispatch(
          //   setIsGetInitialValuesPurchaseOrder({
          //     ...isGetInitialValuesPurchaseOrder,
          //     view: false,
          //   }),
          // );

          navigate(`/purchase-order-details/${val?._id}`, {
            state: { isView: true },
          });
        }}
      >
        {val?.item_name}
      </span>
    );
  };

  const designNameTemplate = data => {
    const desingName =
      data?.design_name?.length > 0
        ? data?.design_name?.map(item => item.replace(/\s*\/\s*/g, ', '))[0]
        : '';
    return <span>{desingName}</span>;
  };

  const handleDeletePurchaseOrder = useCallback(
    async purchase_id => {
      if (purchase_id) {
        const result = await dispatch(deletePurchaseOrder(purchase_id));
        if (result) {
          setOrderDeletePopup(false);
          dispatch(
            getPurchaseOrderList(
              pageLimit,
              currentPage,
              searchQuery,
              applied,
              dates,
            ),
          );
        }
      }
    },
    [dispatch, pageLimit, searchQuery, applied, dates, currentPage],
  );
  const companyAction = item => {
    const checkPermission =
      is_edit_access || is_delete_access || is_print_access;

    return (
      <div className="edit_row action_button_with_img d-flex align-items-center">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="ection_btn"
            disabled={!checkPermission}
          >
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {is_edit_access && !item?.is_cancelled && (
              <Dropdown.Item
                onClick={() => {
                  dispatch(
                    setIsGetInitialValuesPurchaseOrder({
                      ...isGetInitialValuesPurchaseOrder,
                      update: false,
                    }),
                  );

                  navigate(`/update-purchase-order/${item?._id}`, {
                    state: { isView: false },
                  });
                }}
              >
                <img src={EditIcon} alt="EditIcon" /> Edit
              </Dropdown.Item>
            )}
            {is_delete_access && item?.status !== 1 && item?.status !== 2 && (
              <Dropdown.Item
                onClick={() => {
                  setOrderDeletePopup(item?._id);
                }}
              >
                <img src={TrashIcon} alt="TrashIcon" /> Delete
              </Dropdown.Item>
            )}
            {!item?.is_cancelled &&
              item?.status !== 1 &&
              item?.status !== 2 && (
                <Dropdown.Item
                  onClick={() => {
                    setCancelOrder(true);
                    setSelectId(item?._id);
                  }}
                >
                  <img src={CancelOrder} alt="" />
                  Cancel P.O.
                </Dropdown.Item>
              )}
            {is_print_access && !item?.is_cancelled && (
              <Dropdown.Item onClick={() => handleSavePDF(item)}>
                <img src={PDFIcon} alt="PDFIcon" /> Save as PDF
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        {!item?.is_cancelled && (
          <OverlayTrigger
            overlay={props => <Tooltip {...props}>Receive PO</Tooltip>}
            placement="bottom"
          >
            {/* checkPurchaseReceivePermission */}
            {/* <Link to={`/receive-purchase-order/${_id}`}>
            <img src={MarkAsReceive} alt="EditIcon" />
          </Link> */}

            <Button
              onClick={() => {
                if (checkPurchaseReceivePermission) {
                  // dispatch(setPurchaseItemIdList({}));
                  // dispatch(setReceivePurchaseData([]));
                  // dispatch(setReceiveItemsData([]));
                  dispatch(
                    setIsGetInitialValuesReceivePurchaseOrder({
                      ...isGetInitialValuesReceivePurchaseOrder,
                      add: false,
                    }),
                  );
                  navigate(`/receive-purchase-order/${item?._id}`);
                }
              }}
              disabled={!checkPurchaseReceivePermission}
              className="btn_transperant"
            >
              <img src={MarkAsReceive} alt="" />
            </Button>
          </OverlayTrigger>
        )}
      </div>
    );
  };

  const handleSavePDF = item => {
    const itemGroup = item?.item_group_name?.toLowerCase() === 'roll';
    const itemName =
      item?.item_name?.toLowerCase() === 'nonwoven laminated pre-printed';

    if (itemName && itemGroup) {
      dispatch(generatePrePrintedRollPDF(item?._id));
    } else {
      dispatch(generateCommonItemGroupPDF(item?._id));
    }
  };

  const handleCancelOrder = useCallback(
    async order_id => {
      if (order_id) {
        const result = await dispatch(cancelPurchaseOrder(order_id));
        if (result) {
          dispatch(
            getPurchaseOrderList(pageLimit, 1, searchQuery, applied, dates),
          );
          setCancelOrder(false);
        }
      }
      setSelectId('');
    },
    [dispatch, pageLimit, searchQuery, applied, dates],
  );

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        purchaseOrder: {
          ...allFilters?.purchaseOrder,
          currentPage: 1,
        },
      }),
    );
    dispatch(
      getPurchaseOrderList(pageLimit, 1, e.target.value, applied, dates),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const handleDateManage = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        purchaseOrder: {
          ...allFilters?.purchaseOrder,
          dates: e,
        },
      }),
    );

    dispatch(
      getPurchaseOrderList(pageLimit, currentPage, searchQuery, applied, e),
    );
  };

  const isMobile = useMemo(() => {
    if (window.innerWidth < 1400) {
      return true;
    } else {
      return false;
    }
  }, []);

  return (
    <div className="main_Wrapper">
      {purchaseOrderLoading && <Loader />}
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col lg={2}>
              <div className="page_title">
                <h3 className="m-0">
                  Purchase Order {currentUser.operator && 'Operator'}{' '}
                </h3>
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
                              purchaseOrder: {
                                ...allCommon?.purchaseOrder,
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
                        onChange={e => {
                          dispatch(
                            setAllFilters({
                              ...allFilters,
                              purchaseOrder: {
                                ...allFilters?.purchaseOrder,
                                dates: e.value,
                              },
                            }),
                          );
                          if (e?.value && e.value[0] && e.value[1]) {
                            dispatch(
                              getPurchaseOrderList(
                                pageLimit,
                                currentPage,
                                searchQuery,
                                applied,
                                e.value,
                              ),
                            );
                          } else if (e.value === null) {
                            dispatch(
                              getPurchaseOrderList(
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
                          // if (window.innerWidth < 767) {
                          //   setIsMobile(true);
                          // }
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
                      <OverlayPanel
                        ref={dateRef}
                        className="date_range_overlay"
                      >
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
                                  purchaseOrder: {
                                    ...allFilters?.purchaseOrder,
                                    dates: {
                                      startDate: '',
                                      endDate: '',
                                      key: 'selection',
                                    },
                                  },
                                }),
                              );
                              dispatch(
                                getPurchaseOrderList(
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
                    <Button
                      className="btn_primary"
                      onClick={() => {
                        if (is_create_access) {
                          dispatch(
                            setIsGetInitialValuesPurchaseOrder({
                              ...isGetInitialValuesPurchaseOrder,
                              add: false,
                            }),
                          );
                          navigate('/add-purchase-order', {
                            state: { isView: false },
                          });
                        }
                      }}
                      disabled={!is_create_access}
                    >
                      <img src={PlusIcon} alt="" /> Add New P.O.
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter">
          {/* <div className="data_table_wrapper cell_padding_large is_filter"> */}
          <button
            type="button"
            className="table_filter_btn"
            onClick={() => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  purchaseOrder: {
                    ...allCommon.purchaseOrder,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={purchaseOrderList}
            sortMode="single"
            sortField="name"
            filterDisplay="row"
            sortOrder={1}
            rows={10}
            dataKey="_id"
            rowClassName={getRowClassName}
            filters={purchaseOrderFilters}
            footerColumnGroup={footerGroup}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  purchaseOrder: {
                    ...allCommon?.purchaseOrder,
                    purchaseOrderFilters: event?.filters,
                  },
                }),
              );
            }}
            scrollable={isMobile === true ? false : true}
            emptyMessage={
              purchaseOrderListLoading ? <Skeleton count={10} /> : false
            }
          >
            <Column
              field="po_number"
              header="P.O. Number"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="supplier_name"
              header="Supplier Name"
              // body={supplierTemplate}
              sortable
              // className="view_detail"
              filter={filterToggle}
            ></Column>
            <Column
              field="warehouse_name"
              header="Warehouse"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="item_name"
              header="Item Name"
              body={itemNameTemplate}
              sortable
              className="view_detail"
              filter={filterToggle}
            ></Column>
            <Column
              field="design_name"
              header="Design Name"
              body={designNameTemplate}
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="purchase_date"
              header="P.O. Date"
              sortable
              filter={filterToggle}
              sortFunction={event => customSortFunction(event)}
            ></Column>
            <Column
              field="due_date"
              header="Due Date"
              sortable
              filter={filterToggle}
              sortFunction={event => customSortFunction(event)}
            ></Column>
            <Column
              field="days"
              header="Days"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="total"
              header="Total Amount"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="status"
              header="Status"
              sortable
              filter={filterToggle}
              body={statusBodyTemplate}
            ></Column>
            <Column
              field="created_by_name"
              header="Created By"
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
            dataList={purchaseOrderList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={purchaseOrderCount}
          />
        </div>
      </div>
      <ConfirmDialog
        visible={orderDeletePopup}
        handleDelete={handleDeletePurchaseOrder}
        setDeletePopup={setOrderDeletePopup}
      />
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
        header="Cancel Confirmation"
        visible={cancelOrder}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setCancelOrder(false)}
      >
        <div className="delete_wrapper py-4">
          <p className="text-center">Are you sure you want to Cancel P.O.?</p>
        </div>
        <div className="d-flex justify-content-center">
          <Button className="btn_border" onClick={() => setCancelOrder(false)}>
            Cancel
          </Button>
          <Button
            className="btn_primary ms-3"
            onClick={() => {
              handleCancelOrder(selectId);
            }}
          >
            OK
          </Button>
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
