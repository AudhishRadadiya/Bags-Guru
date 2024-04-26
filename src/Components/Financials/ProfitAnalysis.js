import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';
import { Tag } from 'primereact/tag';
import { Image } from 'primereact/image';
import { useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import Skeleton from 'react-loading-skeleton';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import EditIcon from '../../Assets/Images/edit.svg';
import { Col, Dropdown, Row } from 'react-bootstrap';
import TrashIcon from '../../Assets/Images/trash.svg';
import FilterIcon from '../../Assets/Images/filter.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import {
  financeDataExport,
  getShowFinanceList,
  saveProfitAnalysis,
} from 'Store/Reducers/Finance/FinancialsService';
import { useSelector } from 'react-redux';
import { isPositive } from 'Helper/Common';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  getPartiesActivePartyTypes,
  getPartiesAdvisor,
  updateFilter,
} from 'Services/partiesService';
import FilterOverlay from 'Components/Common/FilterOverlay';
import {
  getActiveBagTypeList,
  getActiveLaminationTypeList,
} from 'Services/Settings/MiscMasterService';
import { Checkbox } from 'primereact/checkbox';
import { setFinanceList } from 'Store/Reducers/Finance/FinancialsSlice';

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

export const getProfitSeverity = lamination => {
  switch (lamination) {
    case 'bopp':
      return 'bopp';
    case 'metalic':
      return 'metalic';
    case 'matt':
      return 'matt';
    case 'glitter':
      return 'glitter';
    case 'pp coated':
      return 'pp_coated';
    case 'glitter with metalic':
      return 'glitter_with_metalic';
    default:
      return 'primary';
  }
};

const profitFilterDetails = [
  { label: 'Design Name', value: 'design', type: 'inputBox' },
  { label: 'Bag Type', value: 'bag_type', type: 'dropDown' },
  { label: 'Lamination Type', value: 'lamination_type_name', type: 'dropDown' },
  { label: 'Customer Name', value: 'customer_name', type: 'inputBox' },
  { label: 'Customer Group', value: 'customer_group', type: 'inputBox' },
  {
    label: 'Customer Type',
    value: 'customer_type',
    type: 'dropDown',
  },
  { label: 'Advisor', value: 'present_advisor_name', type: 'dropDown' },
  { label: 'Factory Location', value: 'factory_name', type: 'inputBox' },
  {
    label: 'Printing Operator',
    value: 'printing_operator_name',
    type: 'inputBox',
  },
  {
    label: 'Machine Operator',
    value: 'bag_making_operator_name',
    type: 'inputBox',
  },
];

export default function ProfitAnalysis() {
  const op = useRef(null);
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  // const [isMobile, setIsMobile] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [selectedFinanceData, setSelectedFinanceData] = useState(null);
  // const [vanueSelect, setVanueSelect] = useState([]);
  // const [filterSelect, setFilterSelect] = useState([]);
  // const [mfgAdminData, setMFGAdminData] = useState([]);
  // const [selectedProducts, setSelectedProducts] = useState(null);
  // const [filterForProfitAnalysisToggle, setFilterForProfitAnalysisToggle] =
  //   useState(false);

  const { financeLoading, financeList, financeDataCount } = useSelector(
    ({ finance }) => finance,
  );
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { filterToggle, financeFilters, searchQuery } = allCommon?.finance;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex } =
    allFilters?.finance;
  const { listFilter, partiesAdvisor, partyTypeListMenu } = useSelector(
    ({ parties }) => parties,
  );
  const { bagTypeListMenu, activeLaminationTypeList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );

  const loadRequiredData = useCallback(async () => {
    dispatch(
      getListFilter({
        module_name: 'financeProfit',
      }),
    );
    dispatch(getShowFinanceList(pageLimit, currentPage, searchQuery, applied));
    dispatch(getPartiesAdvisor());
    dispatch(getActiveBagTypeList());
    dispatch(getPartiesActivePartyTypes());
    dispatch(getActiveLaminationTypeList());
  }, [applied, currentPage, dispatch, pageLimit, searchQuery]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  // useEffect(() => {
  //   dispatch(getShowFinanceList(pageLimit, currentPage, searchQuery, applied));
  // }, [dispatch, currentPage, pageLimit, applied]);

  const laminationOptions = useMemo(() => {
    const updatedLaminationData = activeLaminationTypeList?.map(item => {
      return { label: item?.label, value: item.label };
    });
    return [
      ...updatedLaminationData,
      { label: 'Non Laminated', value: 'Non Laminated' },
    ];
  }, [activeLaminationTypeList]);

  const handleAdvisorOption = useMemo(() => {
    return partiesAdvisor?.map(item => {
      return { label: item?.label, value: item.label };
    });
  }, [partiesAdvisor]);

  const isMobile = useMemo(() => {
    if (window.innerWidth < 1500) {
      return true;
    } else {
      return false;
    }
  }, []);

  const imageTemplate = props => {
    return (
      <div className="image_zoom_Wrapper">
        <Image
          src={props?.main_image}
          zoomSrc={props?.main_image}
          alt="Image"
          preview
          downloadable
        />
      </div>
    );
  };

  const laminationTemplate = item => {
    const lamination = [...(item?.lamination_type || [])]?.sort();
    return (
      <div className="d-flex g-2">
        {lamination?.length > 0 ? (
          lamination?.map(value => {
            const lamination_name = value?.toLowerCase();
            return (
              <Tag
                value={value}
                severity={getProfitSeverity(lamination_name)}
                className="me-2"
              />
            );
          })
        ) : (
          <Tag
            value={'Non Laminated'}
            severity={getProfitSeverity('Non Laminated')}
            className="me-2"
          />
        )}
      </div>
    );
  };

  const rollWidthTemplate = rowItem => {
    return (
      <span className="d-block">
        {rowItem?.bag_detail?.is_mm === 1
          ? rowItem?.roll_width_mm
          : rowItem?.roll_width}
      </span>
    );
  };

  const repeatLengthTemplate = rowItem => {
    return (
      <span className="d-block">
        {rowItem?.bag_detail?.is_mm === 1
          ? rowItem?.repeat_length_mm
          : rowItem?.repeat_length}
      </span>
    );
  };

  const printingOperatorTemplate = useCallback(props => {
    return (
      <span className="d-block">
        {props?.printing_operator_name?.length > 0
          ? props?.printing_operator_name?.toString()
          : '-'}
      </span>
    );
  }, []);

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

  const filterOption = useMemo(() => {
    let flterOptionArray = [...profitFilterDetails];
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
      bag_type: bagTypeListMenu,
      customer_type: partyTypeListMenu,
      present_advisor_name: handleAdvisorOption,
      lamination_type_name: laminationOptions,
    };
  }, [
    bagTypeListMenu,
    handleAdvisorOption,
    partyTypeListMenu,
    laminationOptions,
  ]);

  const selectedFilters = filters?.map(filter => {
    const filterDetail = profitFilterDetails?.find(
      detail => detail.value === filter.filter,
    );
    return filterDetail ? filterDetail : null;
  });

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    filters?.forEach(item => {
      if (String(item?.value) !== '0') {
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
          finance: {
            ...allFilters?.finance,
            applied: filterObj,
            currentPage: 1,
          },
        }),
      );
      dispatch(getShowFinanceList(pageLimit, 1, searchQuery, filterObj));
    }
  }, [filters, dispatch, allFilters, pageLimit, searchQuery]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(getShowFinanceList(pageLimit, currentPage, searchQuery, {}));
        dispatch(
          setAllFilters({
            ...allFilters,
            finance: {
              ...allFilters?.finance,
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
            finance: {
              ...allFilters?.finance,
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
      allFilters,
    ],
  );

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
          finance: { ...allFilters?.finance, filters: updatedFilters },
        }),
      );
    },
    [filters, allFilters, dispatch],
  );

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const updateAppliedFilters =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.finance?.applied)?.length > 0;

      if (updateAppliedFilters) {
        dispatch(getShowFinanceList(pageLimit, currentPage, searchQuery, {}));
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          finance: {
            ...allFilters?.finance,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.finance?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.finance.selectedItemIndex !== ''
                ? ''
                : allFilters.finance.selectedItemIndex,
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
    ],
  );

  const handleAddFilter = () => {
    dispatch(
      setAllFilters({
        ...allFilters,
        finance: {
          ...allFilters?.finance,
          filters: [...allFilters?.finance?.filters, { filter: '', value: '' }],
        },
      }),
    );
  };

  const handleFilterEdit = useCallback(
    (data, index) => {
      const updatedFilterData = {
        ...data,
        filter_list: data?.filter_list?.map(item => {
          const findObj = profitFilterDetails?.find(
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
          finance: {
            ...allFilters?.finance,
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
          module_name: 'financeProfit',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            finance: {
              ...allFilters?.finance,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          }),
        );
        dispatch(
          getListFilter({
            module_name: 'financeProfit',
          }),
        );
        dispatch(getShowFinanceList(pageLimit, 1, searchQuery, {}));
        setNameFilter('');
      }
    },
    [dispatch, allFilters, pageLimit, searchQuery],
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
        module_name: 'financeProfit',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'financeProfit',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };

      res = await dispatch(addFilter(addPayload));
    }

    if (res) {
      setSaveFilterModal(false);
      // dispatch(
      //   setAllFilters({
      //     ...allFilters,
      //     finance: { ...allFilters?.finance, currentPage: 1 },
      //   }),
      // );
      dispatch(
        getListFilter({
          module_name: 'financeProfit',
        }),
      );
    }

    dispatch(
      setAllFilters({
        ...allFilters,
        finance: { ...allFilters?.finance, filters: [] },
      }),
    );
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter, allFilters]);

  const profiteAmountTemplate = useCallback(props => {
    return (
      <p className="m-0">
        <span
          className={
            isPositive(props?.profite_amount) ? 'text_success' : 'text-danger'
          }
        >
          {props?.profite_amount}
        </span>
      </p>
    );
  }, []);

  const profitPercentageTemplate = useCallback(props => {
    return (
      <p className="m-0">
        <span
          className={
            isPositive(props?.profit_percentage)
              ? 'text_success'
              : 'text-danger'
          }
        >
          {props?.profit_percentage}
        </span>
      </p>
    );
  }, []);

  const machineOperatorTemplate = useCallback(props => {
    return (
      <span className="d-block">
        {props?.bag_making_operator_name?.length > 0
          ? props?.bag_making_operator_name.toString()
          : '-'}
      </span>
    );
  }, []);

  const sizeGSMTemplate = useCallback(props => {
    return <span className="d-block">{props?.size_GSM}</span>;
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
          finance: { ...allFilters?.finance, currentPage: pageIndex },
        }),
      );
      dispatch(getShowFinanceList(pageLimit, pageIndex, searchQuery, applied));
    },
    [currentPage, dispatch, allFilters, pageLimit, searchQuery, applied],
  );

  const onPageRowsChange = useCallback(
    page => {
      const updateCurrentPage = page === 0 ? 0 : 1;
      dispatch(
        setAllFilters({
          ...allFilters,
          finance: {
            ...allFilters?.finance,
            currentPage: updateCurrentPage,
            pageLimit: page,
          },
        }),
      );
      dispatch(
        getShowFinanceList(page, updateCurrentPage, searchQuery, applied),
      );
    },
    [dispatch, allFilters, searchQuery, applied],
  );

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        finance: {
          ...allFilters?.finance,
          currentPage: 1,
        },
      }),
    );

    dispatch(getShowFinanceList(pageLimit, 1, e.target.value, applied));
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const handleSaveData = () => {
    // if (selectedFinanceData?.length) {
    //   const profitData = selectedFinanceData?.map(item => {
    //     return {
    //       job_id: item?.job_id,
    //       mfg_id: item?.mfg_id,
    //       printing_conversion_rate: item?.printing_conversion_rate || '',
    //       bag_conversion_rate: item?.bag_conversion_rate,
    //       handle_rate: item?.handle_conversion_rate,
    //       packing_rate: item?.packing_amount,
    //     };
    //   });
    //   dispatch(saveProfitAnalysis(profitData));
    // }

    const filterdSelectedData = financeList.filter(
      item => item?.can_transfer_job && !item?.finance_profit_data_saved,
    );

    if (filterdSelectedData?.length) {
      const profitData = filterdSelectedData?.map(item => {
        return {
          job_id: item?.job_id,
          mfg_id: item?.mfg_id,
          printing_conversion_rate: item?.printing_conversion_rate || '',
          bag_conversion_rate: item?.bag_conversion_rate,
          handle_rate: item?.handle_conversion_rate,
          packing_rate: item?.packing_amount,
        };
      });
      dispatch(saveProfitAnalysis(profitData));
    }
  };

  const getRowClassName = ({ finance_profit_data_saved }) => {
    if (finance_profit_data_saved) return 'cancelled-row';
    return '';
  };

  const checkboxTemplate = (data, row) => {
    const fieldName = row?.column?.props?.field;
    return (
      <Checkbox
        // value={data?.can_transfer_job}
        name={fieldName}
        onChange={e => {
          handleCheckboxTemplate(e, e.target.checked, data);
        }}
        checked={data[fieldName]}
        disabled={data?.finance_profit_data_saved}
      />
    );
  };

  const handleCheckboxTemplate = (e, eventValue, data) => {
    const value = eventValue;
    const name = e.target.name;

    let updatedList = [...financeList];
    const index = updatedList?.findIndex(x => x?._id === data?._id);

    if (index !== -1) {
      const oldObj = updatedList[index];
      const updatedObj = {
        ...oldObj,
        [name]: value,
      };
      updatedList[index] = updatedObj;
      dispatch(setFinanceList(updatedList));
    }
  };

  return (
    <>
      {/* {financeLoading && <Loader />} */}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col md={3}>
                <div className="page_title">
                  <h3 className="m-0">Profit Analysis</h3>
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
                          className="input_wrap small search_wrap"
                          value={searchQuery}
                          onChange={e => {
                            debounceHandleSearchInput(e);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                finance: {
                                  ...allCommon?.finance,
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
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          className="btn_border icon_btn"
                          onClick={() => dispatch(financeDataExport())}
                        >
                          <img src={ExportIcon} alt="" />
                        </Dropdown.Toggle>
                      </Dropdown>
                    </li>
                    <li>
                      <Button
                        className="btn_primary"
                        onClick={handleSaveData}
                        // disabled={!selectedFinanceData?.length}
                      >
                        Save
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper with_colspan_head cell_padding_small is_filter break_header">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() =>
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    finance: {
                      ...allCommon?.finance,
                      filterToggle: !filterToggle,
                    },
                  }),
                )
              }
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={financeList}
              filterDisplay="row"
              sortMode="single"
              sortField="name"
              dataKey="_id"
              selectionMode="checkbox"
              filters={financeFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    finance: {
                      ...allCommon?.finance,
                      financeFilters: event?.filters,
                    },
                  }),
                );
              }}
              // onSelectionChange={e => {
              //   setSelectedFinanceData(e.value);
              // }}
              // selection={selectedFinanceData}
              sortOrder={1}
              scrollable={isMobile === true ? false : true}
              rowClassName={getRowClassName}
              emptyMessage={financeLoading && <Skeleton count={11} />}
            >
              {/* <Column
                selectionMode="multiple"
                style={{ zIndex: '10' }}
                // hidden={isCheckboxDisabled}
                frozen
              /> */}

              <Column
                field="can_transfer_job"
                // selectionMode="multiple"
                // headerStyle={{ width: '3rem' }}
                style={{ zIndex: '10', minWidth: '82px' }}
                body={checkboxTemplate}
                frozen
              ></Column>

              <Column
                field="job_date"
                header="Date"
                sortable
                filter={filterToggle}
                style={{ zIndex: '10', minWidth: '99px' }}
                frozen
              ></Column>
              <Column
                field="job_no"
                header="Job No"
                sortable
                filter={filterToggle}
                style={{ zIndex: '10', minWidth: '62px' }}
                frozen
              ></Column>
              <Column
                field="main_image"
                header="Img"
                body={imageTemplate}
                style={{ zIndex: '10', minWidth: '60px' }}
                frozen
              ></Column>
              <Column
                field="design"
                header="Design Name"
                sortable
                filter={filterToggle}
                style={{ zIndex: '10', minWidth: '150px' }}
                className="width_130"
                frozen
              ></Column>
              <Column
                field="size_GSM"
                header="Size & GSM"
                sortable
                filter={filterToggle}
                body={sizeGSMTemplate}
                style={{ zIndex: '10', minWidth: '140px' }}
                className="width_120"
                frozen
              ></Column>
              <Column
                field="bag_type"
                header="Bag Type"
                sortable
                filter={filterToggle}
                style={{ zIndex: '10', minWidth: '140px' }}
                className="width_120"
                frozen
              ></Column>
              <Column
                field="lamination_type"
                header="Lamination"
                sortable
                filter={filterToggle}
                // style={{ zIndex: '10', minWidth: '120px' }}
                body={laminationTemplate}
                // className="width_130"
                // frozen
              ></Column>
              <Column
                field="roll_width"
                header="Roll Width"
                sortable
                body={rollWidthTemplate}
                filter={filterToggle}
              ></Column>
              <Column
                field="repeat_length"
                header="Repeat Length"
                sortable
                body={repeatLengthTemplate}
                filter={filterToggle}
              ></Column>
              <Column
                field="total_roll_weight_used"
                header="Total Roll Weight used"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="order_qty"
                header="Order Qty"
                sortable
                filter={filterToggle}
                className="column_group border_left"
              ></Column>
              <Column
                field="qty_made"
                header="Qty Made (pcs)"
                sortable
                filter={filterToggle}
                className="column_group with_before total_bag"
              ></Column>
              <Column
                field="qty_made_weight"
                header="Qty Made (Ntt Wt.)"
                sortable
                filter={filterToggle}
                className="column_group border_right"
              ></Column>
              <Column
                field="handle_weight_per_bag"
                header="Handle Wt (Per Bag)"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="wastage_kg"
                header="KG"
                sortable
                filter={filterToggle}
                className="column_group border_left"
              ></Column>
              <Column
                field="wastage_bags"
                header="Bags"
                sortable
                filter={filterToggle}
                className="column_group with_before wastage"
              ></Column>
              <Column
                field="wastage_percentage"
                header="%"
                sortable
                filter={filterToggle}
                className="column_group border_right"
              ></Column>
              <Column
                field="fabric_rate"
                header="Fabric"
                sortable
                filter={filterToggle}
                className="column_group"
              ></Column>
              <Column
                field="printing_conversion_rate_converted"
                header="Printing Conversion"
                sortable
                filter={filterToggle}
                className="column_group with_before rates"
              ></Column>
              <Column
                field="bag_conversion_rate_converted"
                header="Bag Conversion"
                sortable
                filter={filterToggle}
                className="column_group"
              ></Column>
              <Column
                field="handle_conversion_rate_converted"
                header="Handle"
                sortable
                filter={filterToggle}
                className="column_group border_right"
              ></Column>
              <Column
                field="fabric_amount"
                header="Fabric"
                sortable
                filter={filterToggle}
                className="column_group"
              ></Column>
              <Column
                field="printing_conversion_amount"
                header="Printing Conversion"
                sortable
                filter={filterToggle}
                className="column_group"
              ></Column>
              <Column
                field="bag_conversion_amount"
                header="Bag Conversion"
                sortable
                filter={filterToggle}
                className="column_group with_before amount"
              ></Column>
              <Column
                field="handle_amount"
                header="Handle"
                sortable
                filter={filterToggle}
                className="column_group"
              ></Column>
              <Column
                field="packing_amount_converted"
                header="Packing"
                sortable
                filter={filterToggle}
                className="column_group"
              ></Column>
              <Column
                field="total"
                header="Total"
                sortable
                filter={filterToggle}
                className="column_group border_right"
              ></Column>
              <Column
                field="per_pc_selling_price"
                header="Per Pc"
                sortable
                filter={filterToggle}
                className="column_group"
              ></Column>
              <Column
                field="per_kg_selling_price"
                header="Per Kg"
                sortable
                filter={filterToggle}
                className="column_group with_before selling_price"
              ></Column>
              <Column
                field="selling_price_amount"
                header="Amount"
                sortable
                filter={filterToggle}
                className="column_group border_right"
              ></Column>
              <Column
                field="profite_amount"
                header="Amount"
                sortable
                filter={filterToggle}
                body={profiteAmountTemplate}
                className="column_group with_before profit"
              ></Column>
              <Column
                field="profit_percentage"
                header="%"
                sortable
                filter={filterToggle}
                body={profitPercentageTemplate}
                className="column_group border_right"
              ></Column>
              <Column
                field="customer_name"
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
                field="customer_type"
                header="Customer Type"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="present_advisor_name"
                header="Advisor"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="factory_name"
                header="Factory Location"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="printing_operator_name"
                header="Printing Operator"
                sortable
                filter={filterToggle}
                body={printingOperatorTemplate}
              ></Column>
              <Column
                field="bag_making_operator_name"
                header="Machine Operator"
                sortable
                filter={filterToggle}
                body={machineOperatorTemplate}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={financeList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={financeDataCount}
            />
          </div>
        </div>

        <Dialog
          header="Personal Filters"
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
