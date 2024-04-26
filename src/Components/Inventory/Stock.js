import { useMemo } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import FilterIcon from '../../Assets/Images/filter.svg';
import StockTransfer from '../../Assets/Images/stock-transfer.svg';
import StockConsumption from '../../Assets/Images/consumptionIcon.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import SplitIcon from '../../Assets/Images/split.svg';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import EditIcon from '../../Assets/Images/edit.svg';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import SearchIcon from '../../Assets/Images/search.svg';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {
  getExportInventoryStockExcel,
  getExportInventoryStockPdf,
  getRawStockList,
  splitRollData,
  stockConsumptionData,
  stockTransferData,
} from 'Services/Inventory/StockRowMaterial';
import FilterOverlay from 'Components/Common/FilterOverlay';
import { useSelector } from 'react-redux';
import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  getActiveLaminationTypeList,
  getActiveWarehouseList,
} from 'Services/Settings/MiscMasterService';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import {
  setIsStockTransfer,
  setSelectedStockTransferData,
  setStockRawList,
  setStockSingleRowData,
} from 'Store/Reducers/Inventory/StockRawMaterialSlice';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton';
import { Checkbox } from 'primereact/checkbox';
import { getActiveBagMachineList } from 'Services/Settings/companyService';
import Loader from 'Components/Common/Loader';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { checkModulePermission, convertIntoNumber } from 'Helper/Common';
import { useNavigate } from 'react-router-dom';

const filterDetails = [
  { label: 'Warehouse', value: 'warehouse', type: 'dropDown' },
  { label: 'Design Name', value: 'design_name', type: 'inputBox' },
  { label: 'ID No', value: 'id_no', type: 'inputBox' },
  { label: 'Colour', value: 'color', type: 'inputBox' },
  // { label: 'Lamination Type', value: 'lamination', type: 'inputBox' },
  { label: 'Lamination Type', value: 'lamination', type: 'dropDown' },
  // { label: 'Lamination', value: 'is_laminated', type: 'dropDown' },
  { label: 'Texture', value: 'texture', type: 'inputBox' },
  { label: 'Width', value: 'width', type: 'inputBox' },
  { label: 'Width MM', value: 'width_mm', type: 'inputBox' },
  { label: 'Length', value: 'length', type: 'inputBox' },
  { label: 'Height', value: 'height', type: 'inputBox' },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'Net Weight', value: 'net_weight', type: 'inputBox' },
  // { label: 'P.O. Number', value: 'po_number', type: 'inputBox' },
  { label: 'Rate', value: 'rate', type: 'inputBox' },
  { label: 'Parent', value: 'parent_id', type: 'inputBox' },
];
const reasonSelectOption = [
  { label: 'Consumed', value: 'Consumed' },
  { label: 'Stock Correction', value: 'Stock Correction' },
  { label: 'Wastage', value: 'Wastage' },
  { label: 'Handle Rolls', value: 'Handle Rolls' },
];

export default function Stock() {
  const op = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [nameFilter, setNameFilter] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [stockTransferModal, setStockTransferModal] = useState(false);
  const [stockConsumptionModal, setStockConsumptionModal] = useState(false);

  const [transferData, setTransferData] = useState({
    transfer_date: new Date(),
    source_warehouse: '',
    target_warehouse: '',
    transfer: [],
    targetWarehouseError: '',
  });
  const [consumptionData, setConsumptionData] = useState({
    consumption_date: new Date(),
    reason: '',
    comment: '',
    consumed: [],
    reasonError: '',
  });
  const [splitRollModal, setSplitRollModal] = useState(false);
  const [ingredient, setIngredient] = useState('Width');
  const [actualWeight, setActualWeight] = useState(0);
  const [orgList, setOrgList] = useState({ list: [], count: 0 });
  const [widthOrWidthMm, setWidthOrWidthMm] = useState(0);
  const [splitRoll, setSplitRoll] = useState({
    width: {
      width_1: 0,
      width_2: 0,
      width_3: 0,
      width_4: 0,
      total_width: 0,
    },
    length: {
      length_1: 0,
      length_2: 0,
      length_3: 0,
      length_4: 0,
      total_length: 0,
    },
  });
  const [totalWeight, setTotalWeight] = useState({
    width: {
      // widthWeight_1: 0,
      // widthWeight_2: 0,
      // widthWeight_3: 0,
      // widthWeight_4: 0,
    },
    length: {
      // lengthWeight_1: 0,
      // lengthWeight_2: 0,
      // lengthWeight_3: 0,
      // lengthWeight_4: 0,
    },
  });
  const [expandedRows, setExpandedRows] = useState([]);

  const {
    stockRawList,
    stockRawBaseDataList,
    stockRawLoading,
    selectedStockTransferData,
    isStockTransfer,
    stockSingleRowData,
    stockRawExportLoading,
    stockRawListingLoading,
  } = useSelector(({ stockRaw }) => stockRaw);
  const { listFilter } = useSelector(({ parties }) => parties);
  const { userPermissionList, activeBagMachineList } = useSelector(
    ({ settings }) => settings,
  );
  const { currentUser } = useSelector(({ auth }) => auth);
  const { activeWarehouseList, activeLaminationTypeList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );
  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { filterToggle, searchQuery, stockFilters } =
    allCommon?.stockRawMaterial;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex } =
    allFilters?.stockRawMaterial;

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
  //   const getData = setTimeout(async () => {
  //     const res = await dispatch(
  //       getRawStockList(pageLimit, currentPage, searchQuery, applied),
  //     );
  //     if (res) setOrgList(res);
  //   }, 700);
  //   return () => clearTimeout(getData);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentPage, pageLimit, searchQuery, applied]);

  const loadRequiredData = useCallback(() => {
    dispatch(
      getListFilter({
        module_name: 'inventory',
      }),
    );
    dispatch(getRawStockList(pageLimit, currentPage, searchQuery, applied));
    dispatch(getActiveLaminationTypeList());
    dispatch(getActiveWarehouseList());
    dispatch(getActiveBagMachineList());
  }, [applied, currentPage, dispatch, pageLimit, searchQuery]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  useEffect(() => {
    if (Object.keys(stockSingleRowData)?.length > 0) {
      setWidthOrWidthMm(
        stockSingleRowData?.is_mm === true
          ? stockSingleRowData?.width_mm
          : stockSingleRowData?.width,
      );
      setSplitRoll({
        width: {
          width_1:
            stockSingleRowData?.is_mm === true
              ? stockSingleRowData?.width_mm
              : stockSingleRowData?.width,
          width_2: 0,
          width_3: 0,
          width_4: 0,
          total_width:
            stockSingleRowData?.is_mm === true
              ? stockSingleRowData?.width_mm
              : stockSingleRowData?.width,
        },
        length: {
          length_1: stockSingleRowData?.length,
          length_2: 0,
          length_3: 0,
          length_4: 0,
          total_length: stockSingleRowData?.length,
        },
      });
      setActualWeight(
        parseFloat(stockSingleRowData?.net_weight?.split(' ')?.[0]),
      );

      setTotalWeight({
        ...totalWeight,
        width: {
          widthWeight_1: weightCal(
            stockSingleRowData?.is_mm === true
              ? stockSingleRowData?.width_mm
              : stockSingleRowData?.width,
            parseFloat(stockSingleRowData?.net_weight?.split(' ')?.[0]),
            stockSingleRowData?.is_mm === true
              ? stockSingleRowData?.width_mm
              : stockSingleRowData?.width,
          )?.toFixed(2),
          ...(totalWeight?.width?.widthWeight_2 && { widthWeight_2: 0 }),
          ...(totalWeight?.width?.widthWeight_3 && { widthWeight_3: 0 }),
          ...(totalWeight?.width?.widthWeight_4 && { widthWeight_4: 0 }),
          // widthWeight_2: 0,
          // widthWeight_3: 0,
          // widthWeight_4: 0,
        },
        length: {
          lengthWeight_1: weightCal(
            stockSingleRowData?.length,
            parseFloat(stockSingleRowData?.net_weight?.split(' ')?.[0]),
            stockSingleRowData?.length,
          )?.toFixed(2),
          ...(totalWeight?.length?.lengthWeight_2 && { lengthWeight_2: 0 }),
          ...(totalWeight?.length?.lengthWeight_3 && { lengthWeight_3: 0 }),
          ...(totalWeight?.length?.lengthWeight_4 && { lengthWeight_4: 0 }),
          // lengthWeight_2: 0,
          // lengthWeight_3: 0,
          // lengthWeight_4: 0,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockSingleRowData]);
  useEffect(() => {
    if (isStockTransfer) {
      dispatch(getRawStockList(pageLimit, currentPage, searchQuery, applied));
      dispatch(setIsStockTransfer(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStockTransfer]);
  useEffect(
    () => {
      if (selectedStockTransferData?.list.length > 0) {
        setTransferData({
          ...transferData,
          source_warehouse: selectedStockTransferData?.list[0]?.warehouse,
          source_name: selectedStockTransferData?.list[0]?.warehouse_name,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedStockTransferData],
  );
  useEffect(() => {
    if (stockRawList?.list?.length > 0) {
      let filteredData = stockRawList?.list.filter(
        data => data?.isSelected === true,
      );
      if (filteredData?.length === 0) {
        dispatch(
          setSelectedStockTransferData({
            list: [],
            disabled: true,
          }),
        );
      }
    }
  }, [stockRawList, dispatch]);

  const weightCal = (price, weight, width) => {
    return (price * weight) / width;
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
      warehouse: activeWarehouseList,
      lamination: laminationOptions,
      // is_laminated: commonOption,
    };
  }, [activeWarehouseList, laminationOptions]);

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
          stockRawMaterial: {
            ...allFilters?.stockRawMaterial,
            filters: updatedFilters,
          },
        }),
      );
    },
    [filters, dispatch, allFilters],
  );

  const handleAddFilter = useCallback(() => {
    dispatch(
      setAllFilters({
        ...allFilters,
        stockRawMaterial: {
          ...allFilters?.stockRawMaterial,
          filters: [
            ...allFilters?.stockRawMaterial?.filters,
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

      const updateFilter =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.stockRawMaterial?.applied)?.length > 0;

      if (updateFilter) {
        dispatch(getRawStockList(pageLimit, currentPage, searchQuery, {}));
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          stockRawMaterial: {
            ...allFilters?.stockRawMaterial,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.stockRawMaterial?.applied)?.length >
                0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.stockRawMaterial.selectedItemIndex !== ''
                ? ''
                : allFilters.stockRawMaterial.selectedItemIndex,
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
      pageLimit,
      currentPage,
      searchQuery,
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
          stockRawMaterial: {
            ...allFilters?.stockRawMaterial,
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
          module_name: 'inventory',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            stockRawMaterial: {
              ...allFilters?.stockRawMaterial,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          }),
        );
        dispatch(
          getListFilter({
            module_name: 'inventory',
          }),
        );
        dispatch(getRawStockList(pageLimit, 1, searchQuery, {}));
        setNameFilter('');
      }
    },
    [dispatch, pageLimit, allFilters, searchQuery],
  );

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    filters?.forEach(item => {
      if (String(item.value) !== '0') {
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
              item.filter === 'po_number' || item.filter === 'gsm'
                ? Number(item.value)
                : item.value,
          },
        };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          stockRawMaterial: {
            ...allFilters?.stockRawMaterial,
            applied: filterObj,
            currentPage: 1,
          },
        }),
      );

      dispatch(getRawStockList(pageLimit, 1, searchQuery, filterObj));
    }
  }, [filters, dispatch, allFilters, pageLimit, searchQuery]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(getRawStockList(pageLimit, 1, searchQuery, {}));

        dispatch(
          setAllFilters({
            ...allFilters,
            stockRawMaterial: {
              ...allFilters?.stockRawMaterial,
              applied: {},
              filters: [],
              selectedItemIndex: '',
              currentPage: 1,
            },
          }),
        );
      } else {
        dispatch(
          setAllFilters({
            ...allFilters,
            stockRawMaterial: {
              ...allFilters?.stockRawMaterial,
              filters: [],
              selectedItemIndex: '',
              currentPage: 1,
            },
          }),
        );
      }

      if (isEdit) {
        setIsEdit(false);
      }
      op.current?.hide();
    },
    [applied, isEdit, dispatch, pageLimit, searchQuery, allFilters],
  );

  const handleSaveFilter = async () => {
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
        module_name: 'inventory',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'inventory',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };

      res = await dispatch(addFilter(addPayload));
    }

    if (res) {
      setSaveFilterModal(false);

      dispatch(
        getListFilter({
          module_name: 'inventory',
        }),
      );
    }

    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
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

  const headerTemplate = data => {
    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {data.d_name}
        </span>
      </React.Fragment>
    );
  };

  const handleCheckboxTemplate = (e, data) => {
    let list = [...JSON.parse(JSON.stringify(stockRawList?.list))];
    const index = list?.findIndex(x => x?._id === data?._id);
    if (index >= 0) list[index].isSelected = e.checked;
    let filteredData = list?.filter(item => item?.isSelected === true);
    dispatch(
      setStockRawList({
        list: list || [],
        count: setStockRawList?.count,
      }),
    );
    if (filteredData?.length >= 1) {
      let checkedData = filteredData?.filter(
        item =>
          item?.warehouse_name === data?.warehouse_name &&
          item?.net_weight?.split(' ')?.[0] > 0,
      );
      if (checkedData?.length === filteredData?.length) {
        dispatch(
          setSelectedStockTransferData({
            list: filteredData || [],
            disabled: false,
          }),
        );
      } else if (checkedData.length === 0) {
        dispatch(
          setSelectedStockTransferData({
            list: filteredData || [],
            disabled: true,
          }),
        );
      } else {
        toast.error(
          'At a time only those items can be transferred who has same warehouse && weight is more than 0',
        );
        dispatch(
          setSelectedStockTransferData({
            list: filteredData || [],
            disabled: true,
          }),
        );
      }
    } else {
      dispatch(
        setSelectedStockTransferData({
          list: filteredData || [],
          disabled: true,
        }),
      );
    }
  };

  const checkboxTemplate = data => {
    return data?.can_transfer_consumed && !data?.assigned_to ? (
      <Checkbox
        value={data?.isSelected}
        onChange={e => {
          handleCheckboxTemplate(e, data);
        }}
        checked={data?.isSelected === true}
        disabled={!checkStockTransferPermission}
      />
    ) : null;
  };

  const handleChange = (e, option, key) => {
    let list = [...JSON.parse(JSON.stringify(selectedStockTransferData?.list))];
    const index = list?.findIndex(x => x?._id === option?._id);
    if (index >= 0) list[index][key] = e;
    dispatch(
      setSelectedStockTransferData({
        ...selectedStockTransferData,
        list: list,
      }),
    );
  };
  const handleOnClose = (e, option, key) => {
    let list = selectedStockTransferData?.list?.map(data => {
      return { ...data, transfer_weight: '', used_machine: '' };
    });

    dispatch(
      setSelectedStockTransferData({
        ...selectedStockTransferData,
        list: list,
      }),
    );
  };
  const transferWeightTemplate = option => {
    return (
      <div className="form_group">
        <InputText
          type="number"
          value={option?.transfer_weight}
          placeholder="0"
          onChange={e => {
            handleChange(Number(e.target.value), option, 'transfer_weight');
          }}
        />
        <span className="unit_text">{option?.net_weight?.split(' ')?.[1]}</span>
      </div>
    );
  };
  const netWeightTemplate = option => {
    let data = option?.net_weight?.split(' ')?.[1]
      ? option?.net_weight?.split(' ')?.[1]
      : '';
    return `${option?.weight} ${data}`;
  };
  const transferSizeTemplate = option => {
    return (
      <>{`${option.width ? 'W' + option.width : ''} ${
        option.height ? ' X H ' + option.height : ''
      } ${option.length ? ' X L ' + option.length : ''} 
      `}</>
    );
  };
  const usedMachineTemplate = option => {
    return option.machine_consumption ? (
      <div className="form_group">
        <ReactSelectSingle
          filter
          value={option.used_machine}
          options={activeBagMachineList}
          placeholder="Select Machine"
          onChange={e => {
            handleChange(e.target.value, option, 'used_machine');
          }}
        />
      </div>
    ) : (
      ''
    );
  };
  const StockActionTemplate = option => {
    return option?.can_split && !option?.assigned_to ? (
      <Button
        className="btn_transperant"
        onClick={() => {
          setSplitRollModal(true);
          dispatch(setStockSingleRowData(option));
          setSplitRoll({
            width: {
              width_1: 0,
              width_2: 0,
              width_3: 0,
              width_4: 0,
              total_width: 0,
            },
            length: {
              length_1: 0,
              length_2: 0,
              length_3: 0,
              length_4: 0,
              total_length: 0,
            },
          });
        }}
        disabled={!currentUser?.operator && !checkStockTransferPermission}
      >
        <img src={SplitIcon} alt="" />
      </Button>
    ) : (
      ''
    );
  };

  const JobNoTemplate = data => {
    return (
      <span
        onClick={() =>
          data?.job_no &&
          navigate(`/job-details/${data?.job_id}`, {
            state: { isView: true },
          })
        }
      >
        {data?.job_no ? data?.job_no : '-'}
      </span>
    );
  };

  const widthMMTemplate = option => {
    return option?.is_width_mm ? (
      <span className={option.is_mm ? 'text_success' : ''}>
        {option?.width_mm}
      </span>
    ) : (
      ''
    );
  };
  const widthTemplate = option => {
    return (
      <span className={!option.is_mm ? 'text_success' : ''}>
        {option?.width}
      </span>
    );
  };

  const rateTemplate = option => {
    return <span>{option?.rate && `₹${option?.rate}`}</span>;
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
          stockRawMaterial: {
            ...allFilters?.stockRawMaterial,
            currentPage: pageIndex,
          },
        }),
      );

      dispatch(getRawStockList(pageLimit, pageIndex, searchQuery, applied));
    },
    [currentPage, dispatch, allFilters, pageLimit, searchQuery, applied],
  );

  const onPageRowsChange = useCallback(
    page => {
      const updatedPage = page === 0 ? 0 : 1;
      dispatch(
        setAllFilters({
          ...allFilters,
          stockRawMaterial: {
            ...allFilters?.stockRawMaterial,
            currentPage: updatedPage,
            pageLimit: page,
          },
        }),
      );
      dispatch(getRawStockList(page, updatedPage, searchQuery, applied));
    },
    [allFilters, applied, dispatch, searchQuery],
  );

  const handleWidthOnChange = (e, key) => {
    let total = 0,
      remaining = 0,
      finalTotal = 0,
      target = e.target.value === '' ? 0 : convertIntoNumber(e.target.value);

    if (key === 'width_1') {
      total = target;
      remaining = widthOrWidthMm - total > 0 ? widthOrWidthMm - total : 0;
      finalTotal = total + remaining;

      setSplitRoll({
        ...splitRoll,
        width: {
          ...splitRoll.width,
          [key]: e.target.value,
          width_2: remaining > 0 ? remaining?.toFixed(2) : 0,
          width_3: 0,
          width_4: 0,
          total_width: finalTotal,
        },
      });

      setTotalWeight({
        ...totalWeight,
        width: {
          ...totalWeight.width,
          widthWeight_1: weightCal(
            target,
            actualWeight,
            widthOrWidthMm,
          )?.toFixed(2),
          widthWeight_2: weightCal(
            parseFloat(remaining),
            actualWeight,
            widthOrWidthMm,
          )?.toFixed(2),
          widthWeight_3: 0,
          widthWeight_4: 0,
          // ...(totalWeight?.width?.widthWeight_3 && { widthWeight_3: 0 }),
          // ...(totalWeight?.width?.widthWeight_4 && { widthWeight_4: 0 }),
        },
      });
    }
    if (key === 'width_2') {
      total = convertIntoNumber(splitRoll.width.width_1) + target;

      remaining = widthOrWidthMm - total > 0 ? widthOrWidthMm - total : 0;

      finalTotal = total + remaining;

      setSplitRoll({
        ...splitRoll,
        width: {
          ...splitRoll.width,
          [key]: e.target.value,
          width_3: remaining > 0 ? remaining?.toFixed(2) : 0,
          width_4: 0,
          total_width: finalTotal,
        },
      });
      setTotalWeight({
        ...totalWeight,
        width: {
          ...totalWeight.width,
          widthWeight_2: weightCal(
            target,
            actualWeight,
            widthOrWidthMm,
          )?.toFixed(2),
          widthWeight_3: weightCal(
            parseFloat(remaining),
            actualWeight,
            widthOrWidthMm,
          )?.toFixed(2),
          widthWeight_4: 0,
          // ...(totalWeight?.width?.widthWeight_4 && { widthWeight_4: 0 }),
        },
      });
    }
    if (key === 'width_3') {
      total =
        convertIntoNumber(splitRoll.width.width_1) +
        convertIntoNumber(splitRoll.width.width_2) +
        target;
      remaining = widthOrWidthMm - total > 0 ? widthOrWidthMm - total : 0;

      finalTotal = total + remaining;
      setSplitRoll({
        ...splitRoll,
        width: {
          ...splitRoll.width,
          [key]: e.target.value,
          width_4: remaining > 0 ? remaining?.toFixed(2) : 0,
          total_width: finalTotal,
        },
      });
      setTotalWeight({
        ...totalWeight,
        width: {
          ...totalWeight.width,
          widthWeight_3: weightCal(
            target,
            actualWeight,
            widthOrWidthMm,
          )?.toFixed(2),
          widthWeight_4: weightCal(
            parseFloat(remaining),
            actualWeight,
            widthOrWidthMm,
          )?.toFixed(2),
        },
      });
    }
    if (key === 'width_4') {
      total =
        convertIntoNumber(splitRoll.width.width_1) +
        convertIntoNumber(splitRoll.width.width_2) +
        convertIntoNumber(splitRoll.width.width_3) +
        target;
      remaining = widthOrWidthMm - total;
      finalTotal = total;

      setSplitRoll({
        ...splitRoll,
        width: {
          ...splitRoll.width,
          [key]: e.target.value,
          total_width: finalTotal,
        },
      });
      setTotalWeight({
        ...totalWeight,
        width: {
          ...totalWeight.width,
          widthWeight_4: weightCal(
            target,
            actualWeight,
            widthOrWidthMm,
          )?.toFixed(2),
        },
      });
    }
  };
  const handleLengthOnChange = (e, key) => {
    let total = 0,
      remaining = 0,
      finalTotal = 0,
      target = e.target.value === '' ? 0 : convertIntoNumber(e.target.value);

    if (key === 'length_1') {
      total = target;
      remaining =
        stockSingleRowData?.length - total > 0
          ? stockSingleRowData?.length - total
          : 0;
      finalTotal = total + remaining;
      setSplitRoll({
        ...splitRoll,
        length: {
          ...splitRoll.length,
          [key]: e.target.value,
          length_2: remaining > 0 ? remaining?.toFixed(2) : 0,
          length_3: 0,
          length_4: 0,
          total_length: finalTotal,
        },
      });

      setTotalWeight({
        ...totalWeight,
        length: {
          ...totalWeight.length,
          lengthWeight_1: weightCal(
            target,
            actualWeight,
            stockSingleRowData?.length,
          )?.toFixed(2),
          lengthWeight_2: weightCal(
            parseFloat(remaining),
            actualWeight,
            stockSingleRowData?.length,
          )?.toFixed(2),
          lengthWeight_3: 0,
          lengthWeight_4: 0,
          // ...(totalWeight?.length?.lengthWeight_3 && { lengthWeight_3: 0 }),
          // ...(totalWeight?.length?.lengthWeight_4 && { lengthWeight_4: 0 }),
        },
      });
    }
    if (key === 'length_2') {
      total = convertIntoNumber(splitRoll.length.length_1) + target;

      remaining =
        stockSingleRowData?.length - total > 0
          ? stockSingleRowData?.length - total
          : 0;

      finalTotal = total + remaining;

      setSplitRoll({
        ...splitRoll,
        length: {
          ...splitRoll.length,
          [key]: e.target.value,
          length_3: remaining > 0 ? remaining?.toFixed(2) : 0,
          length_4: 0,
          total_length: finalTotal,
        },
      });
      setTotalWeight({
        ...totalWeight,
        length: {
          ...totalWeight.length,
          lengthWeight_2: weightCal(
            target,
            actualWeight,
            stockSingleRowData?.length,
          )?.toFixed(2),
          lengthWeight_3: weightCal(
            parseFloat(remaining),
            actualWeight,
            stockSingleRowData?.length,
          )?.toFixed(2),
          lengthWeight_4: 0,
          // ...(totalWeight?.length?.lengthWeight_4 && { lengthWeight_4: 0 }),
        },
      });
    }
    if (key === 'length_3') {
      total =
        convertIntoNumber(splitRoll.length.length_1) +
        convertIntoNumber(splitRoll.length.length_2) +
        target;
      remaining =
        stockSingleRowData?.length - total > 0
          ? stockSingleRowData?.length - total
          : 0;

      finalTotal = total + remaining;
      setSplitRoll({
        ...splitRoll,
        length: {
          ...splitRoll.length,
          [key]: e.target.value,
          length_4: remaining > 0 ? remaining?.toFixed(2) : 0,
          total_length: finalTotal,
        },
      });
      setTotalWeight({
        ...totalWeight,
        length: {
          ...totalWeight.length,
          lengthWeight_3: weightCal(
            target,
            actualWeight,
            stockSingleRowData?.length,
          )?.toFixed(2),
          lengthWeight_4: weightCal(
            parseFloat(remaining),
            actualWeight,
            stockSingleRowData?.length,
          )?.toFixed(2),
        },
      });
    }
    if (key === 'length_4') {
      total =
        convertIntoNumber(splitRoll.length.length_1) +
        convertIntoNumber(splitRoll.length.length_2) +
        convertIntoNumber(splitRoll.length.length_3) +
        target;
      remaining = stockSingleRowData?.length - total;
      finalTotal = total;
      setSplitRoll({
        ...splitRoll,
        length: {
          ...splitRoll.length,
          [key]: e.target.value,
          total_length: finalTotal,
        },
      });
      setTotalWeight({
        ...totalWeight,
        length: {
          ...totalWeight.length,
          lengthWeight_4: weightCal(
            target,
            actualWeight,
            stockSingleRowData?.length,
          )?.toFixed(2),
        },
      });
    }
  };

  const handleSaveSplitRoll = () => {
    let obj = {
      split_by_width: ingredient === 'Width' ? true : false,
      split_by_length: ingredient === 'Length' ? true : false,
      roll_id: stockSingleRowData?._id,
      partition:
        ingredient === 'Width'
          ? [
              Number(splitRoll.width.width_1),
              Number(splitRoll.width.width_2),
              Number(splitRoll.width.width_3),
              Number(splitRoll.width.width_4),
            ]
          : [
              Number(splitRoll.length.length_1),
              Number(splitRoll.length.length_2),
              Number(splitRoll.length.length_3),
              Number(splitRoll.length.length_4),
            ],
      weight_partition:
        ingredient === 'Width'
          ? [
              Number(totalWeight.width.widthWeight_1),
              Number(totalWeight.width.widthWeight_2),
              Number(totalWeight.width.widthWeight_3),
              Number(totalWeight.width.widthWeight_4),
            ]
          : [
              Number(totalWeight.length.lengthWeight_1),
              Number(totalWeight.length.lengthWeight_2),
              Number(totalWeight.length.lengthWeight_3),
              Number(totalWeight.length.lengthWeight_4),
            ],
    };
    dispatch(splitRollData(obj));
  };
  const saveStockConsumption = useCallback(async () => {
    if (consumptionData?.reason === '') {
      setConsumptionData({
        ...consumptionData,
        reasonError: 'Please Select any Reason',
      });
    } else {
      let list = selectedStockTransferData?.list.map(data => {
        return {
          inventory_id: data?._id,
          used_weight: `${data?.transfer_weight} ${
            data?.net_weight?.split(' ')?.[1]
          }`,
          available_weight: data?.net_weight,
          machine_id: data?.used_machine,
        };
      });
      let res = await dispatch(
        stockConsumptionData({
          ...consumptionData,
          consumed: list,
        }),
      );
      if (res) setStockConsumptionModal(false);
    }
  }, [dispatch, selectedStockTransferData, consumptionData]);

  const saveStockTransfer = useCallback(async () => {
    if (transferData?.target_warehouse === '') {
      setTransferData({
        ...transferData,
        targetWarehouseError: 'Please Select Target Warehouse',
      });
    } else {
      let list = selectedStockTransferData?.list.map(data => {
        return {
          inventory_id: data?._id,
          transfer_weight: `${data?.transfer_weight} ${
            data?.net_weight?.split(' ')?.[1]
          }`,
          available_weight: data?.net_weight,
        };
      });
      let res = await dispatch(
        stockTransferData({
          ...transferData,
          transfer: list,
        }),
      );
      if (res) setStockTransferModal(false);
    }
  }, [dispatch, selectedStockTransferData, transferData]);

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        stockRawMaterial: {
          ...allFilters?.stockRawMaterial,
          currentPage: 1,
        },
      }),
    );
    dispatch(getRawStockList(pageLimit, 1, e.target.value, applied));
  };

  const debouncehandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const checkStockTransferPermission = checkModulePermission(
    userPermissionList,
    'Inventory',
    'Stock Transfer(Raw Material)',
    'create',
  );

  const checkStockConsumptionPermission = checkModulePermission(
    userPermissionList,
    'Inventory',
    'Stock Consumption(Raw Material)',
    'create',
  );

  const getRowClassName = ({ assigned_to }) => {
    if (assigned_to) return 'cancelled-row';
    return '';
  };

  return (
    <>
      {/* {(stockRawExportLoading || stockRawLoading) && <Loader />} */}
      {stockRawLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col lg={3}>
                <div className="page_title">
                  <h3 className="m-0">Stock(Raw Material)</h3>
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
                          value={searchQuery}
                          onChange={e => {
                            debouncehandleSearchInput(e);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                stockRawMaterial: {
                                  ...allCommon?.stockRawMaterial,
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
                        onClick={e => op.current?.toggle(e)}
                      >
                        <img src={FilterIcon} alt="" /> Filter
                      </Button>
                    </li>
                    {!currentUser?.operator && (
                      <>
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
                                disabled={!checkStockTransferPermission}
                              >
                                <img src={ExportIcon} alt="" />
                              </Dropdown.Toggle>
                            </OverlayTrigger>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => {
                                  dispatch(getExportInventoryStockPdf());
                                }}
                              >
                                PDF
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  dispatch(getExportInventoryStockExcel());
                                }}
                              >
                                XLS
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </li>
                        <li>
                          <Button
                            className="btn_primary"
                            onClick={() =>
                              checkStockTransferPermission &&
                              setStockTransferModal(true)
                            }
                            disabled={
                              checkStockTransferPermission
                                ? selectedStockTransferData.disabled
                                : !checkStockTransferPermission
                            }
                          >
                            <img src={StockTransfer} alt="" /> Stock Transfer
                          </Button>
                        </li>
                        <li>
                          <Button
                            className="btn_primary"
                            onClick={() =>
                              checkStockConsumptionPermission &&
                              setStockConsumptionModal(true)
                            }
                            disabled={
                              checkStockConsumptionPermission
                                ? selectedStockTransferData.disabled
                                : !checkStockConsumptionPermission
                            }
                          >
                            <img src={StockConsumption} alt="" /> Consumption
                          </Button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper data_table_collapsable is_filter without_all_select">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    stockRawMaterial: {
                      ...allCommon?.stockRawMaterial,
                      filterToggle: !filterToggle,
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              emptyMessage={
                stockRawListingLoading ? <Skeleton count={10} /> : false
              }
              value={stockRawList?.list}
              rowGroupMode="subheader"
              groupRowsBy="d_name"
              sortMode="multiple"
              sortField="d_name"
              sortOrder={1}
              expandableRowGroups
              expandedRows={expandedRows}
              onRowToggle={e => setExpandedRows(e.data)}
              rowGroupHeaderTemplate={headerTemplate}
              filterDisplay="row"
              dataKey="_id"
              filters={stockFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    stockRawMaterial: {
                      ...allCommon?.stockRawMaterial,
                      stockFilters: event?.filters,
                    },
                  }),
                );
              }}
              // selection={selectedlist}
              // onSelectionChange={e => setSelectedlist(e.value)}
              className="not_allow_all_select"
              selectionMode={
                stockRawList.list?.can_transfer_consumed ? 'checkbox' : null
              }
              rowClassName={getRowClassName}
            >
              {!currentUser?.operator && (
                <Column
                  selectionMode={
                    stockRawList.list?.can_transfer_consumed ? 'multiple' : null
                  }
                  headerStyle={{ width: '3rem' }}
                  field="can_transfer_consumed"
                  body={checkboxTemplate}
                ></Column>
              )}
              <Column
                field="item_detail.name"
                header="Item Name"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="warehouse_name"
                header="Warehouse"
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
                field="id_no"
                header="ID No"
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
                field="lamination"
                header="Lamination Type"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="texture"
                header="Texture"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="width"
                header="Width"
                sortable
                body={widthTemplate}
                filter={filterToggle}
              ></Column>
              <Column
                field="width_mm"
                header="Width (MM)"
                sortable
                body={widthMMTemplate}
                filter={filterToggle}
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
                field="net_weight"
                header="Net Weight"
                sortable
                filter={filterToggle}
              ></Column>
              {/* <Column
                field="po_number"
                header="P.O. Number"
                sortable
                filter={filterToggle}
              ></Column> */}
              <Column
                field="rate"
                header="Rate"
                sortable
                body={rateTemplate}
                filter={filterToggle}
              ></Column>
              <Column
                field="parent_id"
                header="Parent"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="job_no"
                header="Job No"
                className="view_detail"
                sortable
                filter={filterToggle}
                body={JobNoTemplate}
              ></Column>
              <Column
                field="action"
                header="Action"
                body={StockActionTemplate}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={stockRawBaseDataList?.list}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={stockRawList?.count}
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
          header="Stock Transfer"
          visible={stockTransferModal}
          draggable={false}
          className="modal_Wrapper modal_large modal_no_padding"
          onHide={() => {
            setStockTransferModal(false);
            handleOnClose();
          }}
        >
          <div className="stock_transfer_modal_wrapper">
            <div className="stock_transfer_top_wrap px-3">
              <Row>
                <Col md={6}>
                  <div className="form_group date_select_wrapper mb-3">
                    <label htmlFor="TransferDate">Transfer Date</label>
                    <Calendar
                      id="TransferDate"
                      placeholder="Transfer Date"
                      showIcon
                      selectionMode="single"
                      readOnlyInput
                      showButtonBar
                      dateFormat="dd-mm-yy"
                      maxDate={new Date()}
                      value={transferData?.transfer_date}
                      onChange={e => {
                        setTransferData({
                          ...transferData,
                          transfer_date: e.value,
                        });
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="SourceWarehouse">Source Warehouse</label>
                    <InputText
                      placeholder="Source Warehouse"
                      value={transferData?.source_name}
                      disabled
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="TargetWarehouse">Target Warehouse</label>
                    <ReactSelectSingle
                      filter
                      value={transferData?.target_warehouse}
                      options={activeWarehouseList?.filter(
                        x => x?.value !== transferData?.source_warehouse,
                      )}
                      onChange={e => {
                        setTransferData({
                          ...transferData,
                          target_warehouse: e.target.value,
                          targetWarehouseError: '',
                        });
                      }}
                      placeholder="Target Warehouse"
                    />
                    {transferData?.targetWarehouseError !== '' && (
                      <p className="text-danger">
                        {transferData?.targetWarehouseError}
                      </p>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="data_table_wrapper cell_padding_small mb-4 max_height">
            <DataTable
              value={selectedStockTransferData?.list}
              selectionMode="false"
            >
              <Column
                header="Item Name"
                className="width_130"
                sortable
                field="item_detail.name"
              />
              <Column header="Design Name" sortable field="design_name" />
              <Column header="Color" sortable field="color" />
              <Column
                header="Size"
                className="width_130"
                sortable
                field="width"
                body={transferSizeTemplate}
              />
              <Column header="GSM" sortable field="gsm" />
              <Column
                header="Net Available Weight"
                sortable
                field="weight"
                body={netWeightTemplate}
              />
              <Column
                header="Transfer Weight"
                sortable
                field="transfer_weight"
                className="with_input_field with_unit"
                body={transferWeightTemplate}
              />
            </DataTable>
          </div>
          <div className="button_group d-flex justify-content-end px-3">
            <Button
              className="btn_border"
              onClick={() => {
                setStockTransferModal(false);
                handleOnClose();
              }}
            >
              Cancel
            </Button>
            <Button
              className="btn_primary ms-3"
              onClick={() => {
                saveStockTransfer();
              }}
            >
              Save
            </Button>
          </div>
        </Dialog>
        <Dialog
          header="Stock Consumption"
          visible={stockConsumptionModal}
          draggable={false}
          className="modal_Wrapper modal_large modal_no_padding"
          onHide={() => {
            setStockConsumptionModal(false);
            handleOnClose();
          }}
        >
          <div className="stock_transfer_modal_wrapper">
            <div className="stock_transfer_top_wrap px-3">
              <Row>
                <Col md={6}>
                  <div className="form_group date_select_wrapper mb-3">
                    <label htmlFor=" ConsumptionDate">Consumption Date </label>
                    <Calendar
                      id=" ConsumptionDate"
                      placeholder="Consumption Date"
                      showIcon
                      selectionMode="single"
                      readOnlyInput
                      showButtonBar
                      dateFormat="dd-mm-yy"
                      maxDate={new Date()}
                      value={consumptionData?.consumption_date}
                      onChange={e => {
                        setConsumptionData({
                          ...consumptionData,
                          consumption_date: e.value,
                        });
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="reasonSelect">Reason</label>
                    <ReactSelectSingle
                      filter
                      value={consumptionData?.reason}
                      options={reasonSelectOption}
                      onChange={e => {
                        setConsumptionData({
                          ...consumptionData,
                          reason: e.target.value,
                          reasonError: '',
                        });
                      }}
                      placeholder="Select Reason"
                    />
                    {consumptionData?.reasonError !== '' && (
                      <p className="text-danger">
                        {consumptionData?.reasonError}
                      </p>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className="form_group mb-3">
                    <label htmlFor="Comment">Comment</label>
                    <InputTextarea
                      placeholder="Write Comment"
                      rows={1}
                      value={consumptionData?.comment}
                      onChange={e => {
                        setConsumptionData({
                          ...consumptionData,
                          comment: e.target.value,
                        });
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="data_table_wrapper cell_padding_small mb-4 max_height">
            <DataTable
              value={selectedStockTransferData?.list}
              selectionMode="false"
              editMode="cell"
            >
              <Column
                header="Item Name"
                sortable
                field="item_detail.name"
                className="width_130"
              />
              <Column header="Design Name" sortable field="design_name" />
              <Column header="Id No" sortable field="id_no" />
              <Column header="Color" sortable field="color" />
              <Column
                header="Size"
                sortable
                className="width_130"
                field="width"
                body={transferSizeTemplate}
              />
              <Column header="GSM" sortable field="gsm" />
              <Column
                header="Net Available Weight"
                sortable
                field="weight"
                body={netWeightTemplate}
              />
              <Column
                header="Used Weight"
                sortable
                field="transfer_weight"
                className="with_input_field with_unit"
                body={transferWeightTemplate}
              />
              {/* show used machine when type is ink */}
              <Column
                header="Used Machine"
                sortable
                field="usedmachine"
                className="with_input_field"
                body={usedMachineTemplate}
              />
            </DataTable>
          </div>
          <div className="button_group d-flex justify-content-end px-3">
            <Button
              className="btn_border"
              onClick={() => {
                setStockConsumptionModal(false);
                handleOnClose();
              }}
            >
              Cancel
            </Button>
            <Button
              className="btn_primary ms-3"
              onClick={() => {
                saveStockConsumption();
              }}
            >
              Save
            </Button>
          </div>
        </Dialog>

        <Dialog
          header="Split Roll"
          visible={splitRollModal}
          draggable={false}
          className="modal_Wrapper modal_large"
          onHide={() => {
            dispatch(setStockSingleRowData({}));
            setSplitRollModal(false);
            setIngredient('Width');
            setSplitRoll({
              width: {
                width_1: 0,
                width_2: 0,
                width_3: 0,
                width_4: 0,
                total_width: 0,
              },
              length: {
                length_1: 0,
                length_2: 0,
                length_3: 0,
                length_4: 0,
                total_length: 0,
              },
            });
          }}
        >
          <div className="split_roll_wrapper">
            <ul>
              <li>
                Item Name :<span>{stockSingleRowData?.item_detail?.name}</span>
              </li>
              <li>
                Lamination :<span>{stockSingleRowData?.lamination}</span>
              </li>
              <li>
                Color :<span>{stockSingleRowData?.color}</span>
              </li>
              <li>
                GSM :<span>{stockSingleRowData?.gsm}</span>
              </li>
              <li>
                ID No. :<span>{stockSingleRowData?.id_no}</span>
              </li>
              <li>
                Weight :<span>{stockSingleRowData?.net_weight}</span>
              </li>
              <li>
                Width :
                <span>
                  {stockSingleRowData?.is_mm === true
                    ? stockSingleRowData?.width_mm
                    : stockSingleRowData?.width}{' '}
                  {stockSingleRowData?.is_mm === true ? 'MM' : 'IN'}
                </span>
              </li>
              <li>
                Length :<span>{stockSingleRowData?.length} M</span>
              </li>
            </ul>
            <div className="width_length_Wrapper border rounded-3 p-3 mb-4">
              <div className="custom_radio_wrappper">
                <div className="d-flex align-items-lg-center align-items-start mb-3 flex-nowrap">
                  <RadioButton
                    inputId="Width"
                    name="width_height"
                    value="Width"
                    onChange={e => {
                      setIngredient(e.value);
                      setSplitRoll({
                        width: {
                          width_1: widthOrWidthMm,
                          width_2: 0,
                          width_3: 0,
                          width_4: 0,
                          total_width: widthOrWidthMm,
                        },
                        length: {
                          length_1: stockSingleRowData?.length,
                          length_2: 0,
                          length_3: 0,
                          length_4: 0,
                          total_length: stockSingleRowData?.length,
                        },
                      });
                      setTotalWeight({
                        width: {
                          widthWeight_1: weightCal(
                            widthOrWidthMm,
                            parseFloat(
                              stockSingleRowData?.net_weight?.split(' ')?.[0],
                            ),
                            widthOrWidthMm,
                          )?.toFixed(2),
                          widthWeight_2: 0,
                          widthWeight_3: 0,
                          widthWeight_4: 0,
                          // ...(totalWeight?.width?.widthWeight_2 && {
                          //   widthWeight_2: 0,
                          // }),
                          // ...(totalWeight?.width?.widthWeight_3 && {
                          //   widthWeight_3: 0,
                          // }),
                          // ...(totalWeight?.width?.widthWeight_4 && {
                          //   widthWeight_4: 0,
                          // }),
                        },
                        length: {
                          lengthWeight_1: weightCal(
                            stockSingleRowData?.length,
                            parseFloat(
                              stockSingleRowData?.net_weight?.split(' ')?.[0],
                            ),
                            stockSingleRowData?.length,
                          )?.toFixed(2),
                          lengthWeight_2: 0,
                          lengthWeight_3: 0,
                          lengthWeight_4: 0,
                          // ...(totalWeight?.length?.lengthWeight_2 && {
                          //   lengthWeight_2: 0,
                          // }),
                          // ...(totalWeight?.length?.lengthWeight_3 && {
                          //   lengthWeight_3: 0,
                          // }),
                          // ...(totalWeight?.length?.lengthWeight_4 && {
                          //   lengthWeight_4: 0,
                          // }),
                        },
                      });
                    }}
                    checked={ingredient === 'Width'}
                  />
                  <label className="ms-2">
                    <Row className="align-items-center gx-2">
                      <Col xs="auto" className="main_label me-3">
                        Width
                      </Col>
                      <Col xs="auto">
                        <div className="form_group">
                          <InputText
                            type="number"
                            value={splitRoll.width.width_1}
                            onChange={e => {
                              handleWidthOnChange(e, 'width_1');
                            }}
                          />
                        </div>
                      </Col>
                      <Col>+</Col>

                      <Col xs="auto">
                        <div className="form_group">
                          <InputText
                            disabled={
                              Number(parseFloat(widthOrWidthMm)?.toFixed(2)) <=
                              Number(
                                parseFloat(splitRoll.width.width_1)?.toFixed(2),
                              )
                            }
                            type="number"
                            value={splitRoll.width.width_2}
                            onChange={e => handleWidthOnChange(e, 'width_2')}
                          />
                        </div>
                      </Col>
                      <Col>+</Col>
                      <Col xs="auto">
                        <div className="form_group">
                          <InputText
                            type="number"
                            disabled={
                              Number(parseFloat(widthOrWidthMm)?.toFixed(2)) <=
                              Number(
                                parseFloat(splitRoll.width.width_1)?.toFixed(2),
                              ) +
                                Number(
                                  parseFloat(splitRoll.width.width_2)?.toFixed(
                                    2,
                                  ),
                                )
                            }
                            value={splitRoll.width.width_3}
                            onChange={e => handleWidthOnChange(e, 'width_3')}
                          />
                        </div>
                      </Col>
                      <Col>+</Col>
                      <Col xs="auto">
                        <div className="form_group">
                          <InputText
                            type="number"
                            disabled={
                              Number(parseFloat(widthOrWidthMm)?.toFixed(2)) <=
                              Number(
                                parseFloat(splitRoll.width.width_1)?.toFixed(2),
                              ) +
                                Number(
                                  parseFloat(splitRoll.width.width_2)?.toFixed(
                                    2,
                                  ),
                                ) +
                                Number(
                                  parseFloat(splitRoll.width.width_3)?.toFixed(
                                    2,
                                  ),
                                )
                            }
                            value={splitRoll.width.width_4}
                            onChange={e => handleWidthOnChange(e, 'width_4')}
                          />
                        </div>
                      </Col>
                      <Col>=</Col>

                      <Col xs="auto">
                        <div className="form_group">
                          <InputText
                            value={splitRoll.width.total_width}
                            disabled
                            className={
                              Number(splitRoll.width.total_width) !==
                              Number(widthOrWidthMm)
                                ? 'border_danger'
                                : 'border_success'
                            }
                          />
                        </div>
                      </Col>
                      <Col>Total</Col>
                    </Row>
                  </label>
                </div>
                <div className="d-flex align-items-lg-center align-items-start align-items-start flex-nowrap">
                  <RadioButton
                    inputId="Length"
                    name="width_height"
                    value="Length"
                    onChange={e => {
                      setIngredient(e.value);
                      setSplitRoll({
                        width: {
                          width_1: widthOrWidthMm,
                          width_2: 0,
                          width_3: 0,
                          width_4: 0,
                          total_width: widthOrWidthMm,
                        },
                        length: {
                          length_1: stockSingleRowData?.length,
                          length_2: 0,
                          length_3: 0,
                          length_4: 0,
                          total_length: stockSingleRowData?.length,
                        },
                      });
                      setTotalWeight({
                        width: {
                          widthWeight_1: weightCal(
                            widthOrWidthMm,
                            parseFloat(
                              stockSingleRowData?.net_weight?.split(' ')?.[0],
                            ),
                            widthOrWidthMm,
                          )?.toFixed(2),
                          // ...(totalWeight?.width?.widthWeight_2 && {
                          //   widthWeight_2: 0,
                          // }),
                          // ...(totalWeight?.width?.widthWeight_3 && {
                          //   widthWeight_3: 0,
                          // }),
                          // ...(totalWeight?.width?.widthWeight_4 && {
                          //   widthWeight_4: 0,
                          // }),
                          widthWeight_2: 0,
                          widthWeight_3: 0,
                          widthWeight_4: 0,
                        },
                        length: {
                          lengthWeight_1: weightCal(
                            stockSingleRowData?.length,
                            parseFloat(
                              stockSingleRowData?.net_weight?.split(' ')?.[0],
                            ),
                            stockSingleRowData?.length,
                          )?.toFixed(2),
                          // ...(totalWeight?.length?.lengthWeight_2 && {
                          //   lengthWeight_2: 0,
                          // }),
                          // ...(totalWeight?.length?.lengthWeight_3 && {
                          //   lengthWeight_3: 0,
                          // }),
                          // ...(totalWeight?.length?.lengthWeight_4 && {
                          //   lengthWeight_4: 0,
                          // }),
                          lengthWeight_2: 0,
                          lengthWeight_3: 0,
                          lengthWeight_4: 0,
                        },
                      });
                    }}
                    checked={ingredient === 'Length'}
                  />
                  <label className="ms-2">
                    <Row className="align-items-center gx-2">
                      <Col xs="auto" className="main_label me-3">
                        Length
                      </Col>
                      <Col xs="auto">
                        <div className="form_group">
                          <InputText
                            type="number"
                            value={splitRoll.length.length_1}
                            onChange={e => handleLengthOnChange(e, 'length_1')}
                          />
                        </div>
                      </Col>
                      <Col>+</Col>
                      <Col xs="auto">
                        <div className="form_group">
                          <InputText
                            disabled={
                              Number(
                                parseFloat(stockSingleRowData?.length)?.toFixed(
                                  2,
                                ),
                              ) <=
                              Number(
                                parseFloat(splitRoll.length.length_1)?.toFixed(
                                  2,
                                ),
                              )
                            }
                            type="number"
                            value={splitRoll.length.length_2}
                            onChange={e => handleLengthOnChange(e, 'length_2')}
                          />
                        </div>
                      </Col>
                      <Col>+</Col>
                      <Col xs="auto">
                        <div className="form_group">
                          <InputText
                            type="number"
                            disabled={
                              Number(
                                parseFloat(stockSingleRowData?.length)?.toFixed(
                                  2,
                                ),
                              ) <=
                              Number(
                                parseFloat(splitRoll.length.length_1)?.toFixed(
                                  2,
                                ),
                              ) +
                                Number(
                                  parseFloat(
                                    splitRoll.length.length_2,
                                  )?.toFixed(2),
                                )
                            }
                            value={splitRoll.length.length_3}
                            onChange={e => handleLengthOnChange(e, 'length_3')}
                          />
                        </div>
                      </Col>
                      <Col>+</Col>
                      <Col xs="auto">
                        <div className="form_group">
                          <InputText
                            type="number"
                            disabled={
                              Number(
                                parseFloat(stockSingleRowData?.length)?.toFixed(
                                  2,
                                ),
                              ) <=
                              Number(
                                parseFloat(splitRoll.length.length_1)?.toFixed(
                                  2,
                                ),
                              ) +
                                Number(
                                  parseFloat(
                                    splitRoll.length.length_2,
                                  )?.toFixed(2),
                                ) +
                                Number(
                                  parseFloat(
                                    splitRoll.length.length_3,
                                  )?.toFixed(2),
                                )
                            }
                            value={splitRoll.length.length_4}
                            onChange={e => handleLengthOnChange(e, 'length_4')}
                          />
                        </div>
                      </Col>
                      <Col>=</Col>
                      <Col xs="auto">
                        <div className="form_group">
                          <InputText
                            value={splitRoll.length.total_length}
                            disabled
                            className={
                              Number(splitRoll.length.total_length) !==
                              Number(stockSingleRowData?.length)
                                ? 'border_danger'
                                : 'border_success'
                            }
                          />
                        </div>
                      </Col>
                      <Col>Total</Col>
                    </Row>
                  </label>
                </div>
              </div>
              <div className="width_length_bottom_wrap">
                {ingredient === 'Width' && (
                  <>
                    <ul>
                      <li>Weight</li>
                      <li>
                        {totalWeight?.width?.widthWeight_1
                          ? totalWeight?.width?.widthWeight_1
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.width?.widthWeight_2
                          ? totalWeight?.width?.widthWeight_2
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.width?.widthWeight_3
                          ? totalWeight?.width?.widthWeight_3
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.width?.widthWeight_4
                          ? totalWeight?.width?.widthWeight_4
                          : ''}
                      </li>
                    </ul>
                    <ul>
                      <li>Roll No.</li>
                      <li>
                        {totalWeight?.width?.widthWeight_1
                          ? `${stockSingleRowData?.id_no}-A`
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.width?.widthWeight_2
                          ? `${stockSingleRowData?.id_no}-B`
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.width?.widthWeight_3
                          ? `${stockSingleRowData?.id_no}-C`
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.width?.widthWeight_4
                          ? `${stockSingleRowData?.id_no}-D`
                          : ''}
                      </li>
                    </ul>
                  </>
                )}
                {ingredient === 'Length' && (
                  <>
                    <ul>
                      <li>Weight</li>
                      <li>
                        {totalWeight?.length?.lengthWeight_1
                          ? totalWeight?.length?.lengthWeight_1
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.length?.lengthWeight_2
                          ? totalWeight?.length?.lengthWeight_2
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.length?.lengthWeight_3
                          ? totalWeight?.length?.lengthWeight_3
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.length?.lengthWeight_4
                          ? totalWeight?.length?.lengthWeight_4
                          : ''}
                      </li>
                    </ul>
                    <ul>
                      <li>Roll No.</li>
                      <li>
                        {totalWeight?.length?.lengthWeight_1
                          ? `${stockSingleRowData?.id_no}-A`
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.length?.lengthWeight_2
                          ? `${stockSingleRowData?.id_no}-B`
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.length?.lengthWeight_3
                          ? `${stockSingleRowData?.id_no}-C`
                          : ''}
                      </li>
                      <li>
                        {totalWeight?.length?.lengthWeight_4
                          ? `${stockSingleRowData?.id_no}-D`
                          : ''}
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="button_group d-flex justify-content-end">
            <Button
              className="btn_border"
              onClick={() => {
                dispatch(setStockSingleRowData({}));
                setSplitRollModal(false);
                setIngredient('Width');
                setSplitRoll({
                  width: {
                    width_1: 0,
                    width_2: 0,
                    width_3: 0,
                    width_4: 0,
                    total_width: 0,
                  },
                  length: {
                    length_1: 0,
                    length_2: 0,
                    length_3: 0,
                    length_4: 0,
                    total_length: 0,
                  },
                });
              }}
            >
              Cancel
            </Button>
            <Button
              className="btn_primary ms-3"
              onClick={() => {
                dispatch(setStockSingleRowData({}));
                handleSaveSplitRoll();
                setSplitRollModal(false);
                setIngredient('Width');
                setSplitRoll({
                  width: {
                    width_1: 0,
                    width_2: 0,
                    width_3: 0,
                    width_4: 0,
                    total_width: 0,
                  },
                  length: {
                    length_1: 0,
                    length_2: 0,
                    length_3: 0,
                    length_4: 0,
                    total_length: 0,
                  },
                });
              }}
            >
              Save
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
    </>
  );
}
