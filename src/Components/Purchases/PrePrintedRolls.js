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
import { useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Skeleton from 'react-loading-skeleton';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { OverlayPanel } from 'primereact/overlaypanel';

import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import {
  setCompletedPrePrintedOrderList,
  setPrePrintedPurchaseOrderList,
  setSelectedRollsData,
} from 'Store/Reducers/Purchase/PrePrintedStatusSlice';
import {
  getCompletedPrePrintedOrderList,
  getPrePrintedPurchaseOrderList,
  savePrePrintedOrder,
} from 'Services/Purchase/PrePrintedStatusService';
import { getDMYDateFormat } from 'Helper/Common';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import FilterIcon from '../../Assets/Images/filter.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import FilterOverlay from 'Components/Common/FilterOverlay';
import CustomPaginator from 'Components/Common/CustomPaginator';
import CheckGreen from '../../Assets/Images/check-round-green.svg';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { getActiveLaminationTypeList } from 'Services/Settings/MiscMasterService';
import { toast } from 'react-toastify';
import Loader from 'Components/Common/Loader';

const moment = require('moment');
const imageTemplate = row => {
  return (
    <div className="image_zoom_Wrapper">
      <Image
        src={row?.image}
        zoomSrc={row?.image}
        alt="Image"
        preview
        downloadable
      />
    </div>
  );
};

const imageRollTemplate = row => {
  return (
    <div className="image_zoom_Wrapper">
      <Image
        src={row?.roll_direction_image}
        zoomSrc={row?.roll_direction_image}
        alt="Image"
        preview
        downloadable
      />
    </div>
  );
};

export const getMFGSeverity = lamination => {
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

const prePrintedFilterDetails = [
  { label: 'Design Name', value: 'design_name', type: 'inputBox' },
  { label: 'Base Fabric', value: 'base_fabric', type: 'inputBox' },
  { label: 'Job Number', value: 'job_no', type: 'inputBox' },
  { label: 'PO Number', value: 'po_number', type: 'inputBox' },
  { label: 'Supplier Name', value: 'supplier_name', type: 'inputBox' },
  { label: 'Lamination Type', value: 'lamination_type', type: 'dropDown' },
];

const completedFilterDetails = [
  { label: 'Design Name', value: 'design_name', type: 'inputBox' },
  { label: 'Base Fabric', value: 'base_fabric', type: 'inputBox' },
  { label: 'Job Number', value: 'job_no', type: 'inputBox' },
  { label: 'PO Number', value: 'po_number', type: 'inputBox' },
  { label: 'Supplier Name', value: 'supplier_name', type: 'inputBox' },
  { label: 'Lamination Type', value: 'lamination_type', type: 'dropDown' },
];

const laminationTemplate = item => {
  const laminationTypes = item?.lamination?.split(',');
  const lamination = [...(laminationTypes || [])].sort();

  return (
    <div>
      {lamination?.length > 0 ? (
        lamination?.map(value => {
          const lamination_name = value?.toLowerCase();
          return (
            <Tag
              value={value}
              severity={getMFGSeverity(lamination_name)}
              className="me-2"
            />
          );
        })
      ) : (
        <Tag
          value={'Non Laminated'}
          severity={getMFGSeverity('Non Laminated')}
        />
      )}
    </div>
  );
};

export default function PrePrintedRolls() {
  const op = useRef(null);
  const dateRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  // const [selectedRollsData, setSelectedRollsData] = useState([]);

  const handleResize = () => {
    if (window.innerWidth < 1200) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []);

  const {
    prePrintedStatusLoading,
    prePrintedStatusListLoading,
    prePrintedPurchaseOrderList,
    completedPrePrintedOrderList,
    selectedRollsData,
    savedPrePrintedOrder,
  } = useSelector(({ prePrintedStatus }) => prePrintedStatus);
  const { activeLaminationTypeList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );
  const { listFilter } = useSelector(({ parties }) => parties);
  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const {
    filterToggle,
    searchQuery,
    isCompleted,
    prePrintedFilter,
    completedPrePrintedFilters,
  } = allCommon?.prePrintedStatus;
  const {
    applied,
    filters,
    currentPage,
    pageLimit,
    selectedItemIndex,
    completedCurrentPage,
    completedPageLimit,
    dates,
  } = allFilters?.prePrintedStatus;

  const customFilter = (value, filter) => {
    const days = parseInt(filter.value);
    if (isNaN(days)) {
      return true; // If the filter value is not a number, don't apply the filter
    }
    const receivedDate = moment();
    const orderDate = value ? moment(value, 'DD-MM-YYYY') : null;
    const purchaseDate = value ? moment(value, 'DD-MM-YYYY') : null;
    const fieldDate = orderDate || purchaseDate;
    const daysDifference = fieldDate ? receivedDate.diff(fieldDate, 'days') : 0;
    return daysDifference === days;
  };

  const CustomFilterTemplate = (data, { filter, setFilter }) => {
    return (
      <div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filter?.value}
            onChange={e =>
              dispatch(
                setAllCommon({
                  ...allCommon,
                  prePrintedStatus: {
                    ...allCommon?.prePrintedStatus,
                    completedPrePrintedFilters: {
                      ...allCommon?.prePrintedStatus
                        ?.completedPrePrintedFilters,
                      order_date: e.target.value,
                    },
                  },
                }),
              )
            }
            placeholder="Search"
          />
        </span>
        <InputText
          value={filter?.value}
          onChange={e =>
            dispatch(
              setAllCommon({
                ...allCommon,
                prePrintedStatus: {
                  ...allCommon?.prePrintedStatus,
                  completedPrePrintedFilters: {
                    ...allCommon?.prePrintedStatus?.completedPrePrintedFilters,
                    order_date: e.target.value,
                  },
                },
              }),
            )
          }
          placeholder="Enter days"
          type="number"
          min="0"
        />
      </div>
    );
  };

  const loadTableData = selectedDate => {
    if (isCompleted) {
      dispatch(
        getCompletedPrePrintedOrderList(
          completedCurrentPage,
          completedPageLimit,
          searchQuery,
          applied,
          selectedDate,
        ),
      );
    } else {
      dispatch(
        getPrePrintedPurchaseOrderList(
          currentPage,
          pageLimit,
          searchQuery,
          applied,
          selectedDate,
        ),
      );
    }
  };

  const handlePrePrintedRollsList = () => {
    if (isCompleted) {
      dispatch(
        getCompletedPrePrintedOrderList(
          completedCurrentPage,
          completedPageLimit,
          searchQuery,
          applied,
          dates,
        ),
      );
    } else {
      dispatch(
        getPrePrintedPurchaseOrderList(
          currentPage,
          pageLimit,
          searchQuery,
          applied,
          dates,
        ),
      );
    }
  };

  const loadRequiredData = useCallback(async () => {
    dispatch(setPrePrintedPurchaseOrderList({}));
    dispatch(
      getListFilter({
        module_name: 'prePrintedPurchaseOrder',
      }),
    );
    handlePrePrintedRollsList();
    dispatch(getActiveLaminationTypeList());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  const laminationOptions = useMemo(() => {
    const updatedLaminationData = activeLaminationTypeList?.map(item => {
      return { label: item?.label, value: item.label };
    });
    return [
      ...updatedLaminationData,
      { label: 'Non Laminated', value: 'Non Laminated' },
    ];
  }, [activeLaminationTypeList]);

  const handlefieldChange = (e, eventValue, rowData) => {
    const value = eventValue;
    const name = e.target.name;
    const prePrintedOrderList = isCompleted
      ? completedPrePrintedOrderList?.list
      : prePrintedPurchaseOrderList?.list;
    let updatedList = [...prePrintedOrderList];

    const index = updatedList?.findIndex(
      x => x?.unique_id === rowData?.unique_id,
    );

    const manageSelection = data => {
      if (name === 'received_date') {
        return (
          !value &&
          !data?.proof_ok_date &&
          !data?.proof_rcv_date &&
          !data?.design_date
        );
      } else if (name === 'design_date') {
        return (
          !value &&
          !data?.proof_ok_date &&
          !data?.proof_rcv_date &&
          !data?.received_date
        );
      } else if (name === 'proof_rcv_date') {
        return (
          !value &&
          !data?.proof_ok_date &&
          !data?.design_date &&
          !data?.received_date
        );
      } else if (name === 'proof_ok_date') {
        return (
          !value &&
          !data?.proof_rcv_date &&
          !data?.design_date &&
          !data?.received_date
        );
      }
    };

    if (index !== -1) {
      const oldObj = updatedList[index];
      const checkEmptyDateField = manageSelection(oldObj);

      const updatedObj = {
        ...oldObj,
        [name]: getDMYDateFormat(value),
        select_preprinted_roll: !checkEmptyDateField,
      };
      updatedList[index] = updatedObj;

      // To filter data when selected Pre-Printed Roll :
      const filteredSelectedRolls =
        updatedList?.filter(item => item?.select_preprinted_roll) || [];
      dispatch(setSelectedRollsData(filteredSelectedRolls));

      if (isCompleted) {
        dispatch(
          setCompletedPrePrintedOrderList({
            ...completedPrePrintedOrderList,
            list: updatedList,
          }),
        );
      } else {
        dispatch(
          setPrePrintedPurchaseOrderList({
            ...prePrintedPurchaseOrderList,
            list: updatedList,
          }),
        );
      }
    }
  };

  const generateDaysDiff = (start_date, end_date) => {
    const startDate = moment(start_date, 'DD-MM-YYYY').startOf('day');
    // const endDate = moment(end_date, 'DD-MM-YYYY').startOf('day');
    const endDate = end_date;
    const daysDifference = endDate.diff(startDate, 'days');
    return daysDifference;
  };

  const dateTemplate = (data, row) => {
    const fieldName = row?.column?.props?.field;
    let fieldDate;

    const checkReceivedDate =
      fieldName === 'received_date'
        ? moment()
        : data['received_date']
        ? moment(data['received_date'], 'DD-MM-YYYY').startOf('day')
        : moment();

    const fieldValue = data[fieldName]
      ? data[fieldName]
      : getDMYDateFormat(new Date());

    const daysDifference = generateDaysDiff(fieldValue, checkReceivedDate);

    // render purchase_date if order_date is empty
    if (fieldName === 'order_date') {
      if (data['order_date']) {
        fieldDate = data[fieldName];
      } else {
        fieldDate = data['purchase_date'];
      }
    } else {
      fieldDate = data[fieldName];
    }

    return (
      <p className="m-0 ms-2">
        {fieldDate}
        <span className="d-block">
          {data[fieldName] ? daysDifference : '0'} Days
        </span>
      </p>
    );
  };

  const dateIconTemplate = (data, row) => {
    const headerName = row?.column?.props?.header;
    const fieldName = row?.column?.props?.field;
    let fieldEndDate;
    let fieldStartDate;

    // const fieldEndDate =
    //   fieldName === 'received_date'
    //     ? moment()
    //     : data['received_date']
    //     ? moment(data['received_date'], 'DD-MM-YYYY')
    //     : moment();

    if (fieldName === 'received_date') {
      if (isCompleted) {
        // fieldEndDate = moment(data['purchase_date'], 'DD-MM-YYYY');
        fieldEndDate = moment(data[fieldName], 'DD-MM-YYYY');
      } else {
        fieldEndDate = moment();
      }
    } else {
      if (data['received_date']) {
        fieldEndDate = moment(data['received_date'], 'DD-MM-YYYY');
      } else {
        fieldEndDate = moment();
      }
    }

    if (fieldName === 'received_date') {
      if (isCompleted) {
        fieldStartDate = moment(data['purchase_date'], 'DD-MM-YYYY');
      } else {
        fieldStartDate = data[fieldName]
          ? data[fieldName]
          : getDMYDateFormat(new Date());
      }
    } else {
      fieldStartDate = data[fieldName]
        ? data[fieldName]
        : getDMYDateFormat(new Date());
    }

    // const fieldStartDate = data[fieldName]
    //   ? data[fieldName]
    //   : getDMYDateFormat(new Date());

    const daysDifference = generateDaysDiff(fieldStartDate, fieldEndDate);

    return (
      <div className="date_icon_Wrap d-flex g-2 align-items-center">
        <div className="form_group date_select_wrapper">
          <Calendar
            name={fieldName}
            value={data[fieldName]}
            placeholder={`Enter ${headerName}`}
            showIcon
            dateFormat="dd-mm-yy"
            onChange={e => handlefieldChange(e, e.target.value, data)}
            showButtonBar
          />
        </div>
        <p className="m-0 ms-2">
          {data[fieldName]}
          <span className="d-block">{daysDifference} Days</span>
        </p>
      </div>
    );
  };

  const handleSearchInput = (e, isCompleted) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        prePrintedStatus: {
          ...allFilters?.prePrintedStatus,
          ...(!isCompleted && { currentPage: 1 }),
          ...(isCompleted && { completedCurrentPage: 1 }),
        },
      }),
    );
    if (isCompleted) {
      dispatch(
        getCompletedPrePrintedOrderList(
          1,
          completedPageLimit,
          e.target.value,
          applied,
          dates,
        ),
      );
    } else {
      dispatch(
        getPrePrintedPurchaseOrderList(
          1,
          pageLimit,
          e.target.value,
          applied,
          dates,
        ),
      );
    }
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const bagSizeTemplate = useCallback(rowItem => {
    if (rowItem?.bag_detail) {
      const { width, height, gusset } = rowItem?.bag_detail;
      return <span>{`W${width} x H ${height} x G ${gusset}`}</span>;
    }
  }, []);

  const bedgeBodyTemplate = rowItem => {
    return (
      <span className={`bedge_${getSeverity(rowItem?.old_str)}`}>
        {rowItem?.old_str === '' ? '-' : rowItem?.old_str ? 'YES' : 'NO'}
      </span>
    );
  };

  const representativesItemTemplate = option => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{option}</span>
      </div>
    );
  };

  const statusRowFilterTemplate = options => {
    const commonMenuOption = ['YES', 'NO'];

    return (
      <div className="form_group">
        <Dropdown
          value={options.value}
          options={commonMenuOption}
          itemTemplate={representativesItemTemplate}
          onChange={e => {
            options.filterApplyCallback(e.value);
          }}
          showClear={options.value}
          placeholder=""
          className="p-column-filter select_filter"
        />
      </div>
    );
  };

  // const handleVerifyRowItem = async rowData => {
  //   const Obj = {
  //     po_item: rowData?.po_item,
  //     job_id: rowData?.job_id || '',
  //     item_id: Number(rowData?.item_id),
  //     po_number: Number(rowData?.po_number),
  //     purchase_order: rowData?.purchase_order,
  //     design_date: rowData?.design_date
  //       ? moment(rowData?.design_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
  //       : '',
  //     proof_rcv_date: rowData?.proof_rcv_date
  //       ? moment(rowData?.proof_rcv_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
  //       : '',
  //     proof_ok_date: rowData?.proof_ok_date
  //       ? moment(rowData?.proof_ok_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
  //       : '',
  //     received_date: rowData?.received_date
  //       ? moment(rowData?.received_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
  //       : '',
  //   };
  //   dispatch(savePrePrintedOrder(Obj));
  // };

  // const innerVerify = useCallback(rowItem => {
  //   return (
  //     <>
  //       <div className="panding_action_wrap">
  //         <Button
  //           className="btn_transperant"
  //           onClick={() => handleVerifyRowItem(rowItem)}
  //           // disabled={is_edit_access ? false : true}
  //         >
  //           <img src={CheckGreen} alt="" />
  //         </Button>
  //       </div>
  //     </>
  //   );
  // }, []);

  const newWhiteCylinderTemplate = rowItem => {
    return <span>{rowItem?.new_white_cylinder ? 'Yes' : 'No'}</span>;
  };

  const POTemplete = data => {
    return (
      <span
        onClick={() =>
          navigate(`/purchase-order-details/${data?.purchase_order}`, {
            state: { isView: true },
          })
        }
      >
        {data?.po_number ? data?.po_number : '-'}
      </span>
    );
  };

  const jonNumberTemplete = data => {
    return (
      <span
        onClick={() =>
          data?.job_id &&
          navigate(`/job-details/${data?.job_id}`, {
            state: { isView: true },
          })
        }
      >
        {data?.job_no ? data?.job_no : '-'}
      </span>
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

  const filterOption = useMemo(() => {
    let filterArray = isCompleted
      ? completedFilterDetails
      : prePrintedFilterDetails;
    let flterOptionArray = [...filterArray];
    if (filters?.length > 0) {
      flterOptionArray = flterOptionArray?.map(item => {
        if (filters.find(item2 => item2.filter === item.value)) {
          return { ...item, disabled: true };
        }
        return item;
      });
    }
    return flterOptionArray;
  }, [filters, isCompleted]);

  const filterOptions = useMemo(() => {
    return {
      lamination_type: laminationOptions,
    };
  }, [laminationOptions]);

  const handleSaveFilter = useCallback(async () => {
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
        module_name: 'prePrintedPurchaseOrder',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'prePrintedPurchaseOrder',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'prePrintedPurchaseOrder',
        }),
      );
      op.current?.hide();
    }
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter]);

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
        prePrintedStatus: {
          ...allFilters?.prePrintedStatus,
          filters: updatedFilters,
        },
      }),
    );
  };

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const updateAppiedFilter =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.prePrintedStatus?.applied)?.length > 0;

      if (updateAppiedFilter) {
        if (isCompleted) {
          dispatch(
            getCompletedPrePrintedOrderList(
              completedCurrentPage,
              completedPageLimit,
              searchQuery,
              {},
              dates,
            ),
          );
        } else {
          dispatch(
            getPrePrintedPurchaseOrderList(
              currentPage,
              pageLimit,
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
          prePrintedStatus: {
            ...allFilters?.prePrintedStatus,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.prePrintedStatus?.applied)?.length >
                0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.prePrintedStatus.selectedItemIndex !== ''
                ? ''
                : allFilters.prePrintedStatus.selectedItemIndex,
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

  const handleAddFilter = () => {
    dispatch(
      setAllFilters({
        ...allFilters,
        prePrintedStatus: {
          ...allFilters?.prePrintedStatus,
          filters: [
            ...allFilters?.prePrintedStatus?.filters,
            { filter: '', value: '' },
          ],
        },
      }),
    );
  };

  const handleFilterEdit = (data, index) => {
    const sortingFiletr = [
      ...completedFilterDetails,
      ...prePrintedFilterDetails,
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
        prePrintedStatus: {
          ...allFilters?.prePrintedStatus,
          filters: updatedFilterData?.filter_list,
          selectedItemIndex: index,
        },
      }),
    );
    setIsEdit(true);
    setNameFilter(data?.filter_name);
    setFilterId(data?._id);
  };

  const handleFilterDelete = async (e, data, index) => {
    const res = await dispatch(
      deleteFilter({
        filter_id: data?._id,
        module_name: 'prePrintedPurchaseOrder',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          prePrintedStatus: {
            ...allFilters?.prePrintedStatus,
            ...(isCompleted && { completedCurrentPage: 1 }),
            ...(!isCompleted && { currentPage: 1 }),
            filters: [],
            selectedItemIndex: '',
            applied: {},
          },
        }),
      );
      dispatch(
        getListFilter({
          module_name: 'prePrintedPurchaseOrder',
        }),
      );

      if (isCompleted) {
        dispatch(
          getCompletedPrePrintedOrderList(
            completedCurrentPage,
            completedPageLimit,
            searchQuery,
            {},
            dates,
          ),
        );
      } else {
        dispatch(
          getPrePrintedPurchaseOrderList(
            currentPage,
            pageLimit,
            searchQuery,
            {},
            dates,
          ),
        );
      }
      setNameFilter('');
      op.current?.hide();
    }
  };

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    filters.forEach(item => {
      if (String(item.value) !== '0') {
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
          prePrintedStatus: {
            ...allFilters?.prePrintedStatus,
            applied: filterObj,
            ...(isCompleted && { completedCurrentPage: 1 }),
            ...(!isCompleted && { currentPage: 1 }),
          },
        }),
      );

      if (isCompleted) {
        dispatch(
          getCompletedPrePrintedOrderList(
            1,
            completedPageLimit,
            searchQuery,
            filterObj,
            dates,
          ),
        );
      } else {
        dispatch(
          getPrePrintedPurchaseOrderList(
            1,
            pageLimit,
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
    isCompleted,
    completedPageLimit,
    searchQuery,
    dates,
    pageLimit,
  ]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        if (isCompleted) {
          dispatch(
            getCompletedPrePrintedOrderList(
              1,
              completedPageLimit,
              searchQuery,
              {},
              dates,
            ),
          );
        } else {
          dispatch(
            getPrePrintedPurchaseOrderList(
              1,
              pageLimit,
              searchQuery,
              {},
              dates,
            ),
          );
        }

        dispatch(
          setAllFilters({
            ...allFilters,
            prePrintedStatus: {
              ...allFilters?.prePrintedStatus,
              applied: {},
              filters: [],
              selectedItemIndex: '',
              ...(isCompleted && { completedCurrentPage: 1 }),
              ...(!isCompleted && { currentPage: 1 }),
            },
          }),
        );
      } else {
        dispatch(
          setAllFilters({
            ...allFilters,
            prePrintedStatus: {
              ...allFilters?.prePrintedStatus,
              filters: [],
              selectedItemIndex: '',
              ...(isCompleted && { completedCurrentPage: 1 }),
              ...(!isCompleted && { currentPage: 1 }),
            },
          }),
        );
      }
      if (isEdit) {
        setIsEdit(false);
      }
      op.current?.hide();
    },
    [dispatch, isCompleted, allFilters, isEdit, applied],
  );

  const selectedFilters = filters?.map(filter => {
    let filterDetailView = isCompleted
      ? completedFilterDetails
      : prePrintedFilterDetails;
    const filterDetail = filterDetailView?.find(
      detail => detail.value === filter.filter,
    );
    return filterDetail ? filterDetail : null;
  });

  const onPageChange = useCallback(
    page => {
      let pageIndex = isCompleted ? completedCurrentPage : currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(
        setAllFilters({
          ...allFilters,
          prePrintedStatus: {
            ...allFilters?.prePrintedStatus,
            // currentPage: pageIndex,
            ...(isCompleted && { completedCurrentPage: pageIndex }),
            ...(!isCompleted && { currentPage: pageIndex }),
          },
        }),
      );

      if (isCompleted) {
        dispatch(
          getCompletedPrePrintedOrderList(
            pageIndex,
            completedPageLimit,
            searchQuery,
            applied,
            dates,
          ),
        );
      } else {
        dispatch(
          getPrePrintedPurchaseOrderList(
            pageIndex,
            pageLimit,
            searchQuery,
            applied,
            dates,
          ),
        );
      }
    },
    [
      isCompleted,
      completedCurrentPage,
      currentPage,
      dispatch,
      allFilters,
      completedPageLimit,
      searchQuery,
      applied,
      dates,
      pageLimit,
    ],
  );

  const onPageRowsChange = useCallback(
    page => {
      dispatch(
        setAllFilters({
          ...allFilters,
          prePrintedStatus: {
            ...allFilters?.prePrintedStatus,
            // currentPage: page === 0 ? 0 : 1,
            // pageLimit: page,
            ...(isCompleted && {
              completedCurrentPage: page === 0 ? 0 : 1,
              completedPageLimit: page,
            }),
            ...(!isCompleted && {
              currentPage: page === 0 ? 0 : 1,
              pageLimit: page,
            }),
          },
        }),
      );

      if (isCompleted) {
        dispatch(
          getCompletedPrePrintedOrderList(
            page === 0 ? 0 : 1,
            page,
            searchQuery,
            applied,
            dates,
          ),
        );
      } else {
        dispatch(
          getPrePrintedPurchaseOrderList(
            page === 0 ? 0 : 1,
            page,
            searchQuery,
            applied,
            dates,
          ),
        );
      }
    },
    [allFilters, applied, dates, dispatch, isCompleted, searchQuery],
  );

  const handleDateManage = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        prePrintedStatus: {
          ...allFilters?.prePrintedStatus,
          dates: e,
        },
      }),
    );

    loadTableData(e);
  };

  const customSortFunction = event => {
    const { data, field, order } = event;

    if (!data || !Array.isArray(data) || !field) {
      return data;
    }

    const updatedData = [...data];

    // Sort the data array based on the specified field and order
    updatedData.sort((a, b) => {
      const first_date = parseDate(a[field]);
      const second_date = parseDate(b[field]);

      // Check if either date is invalid
      if (!first_date || !second_date) {
        return 0; // Return 0 to maintain the current order if date values are invalid
      }

      // Compare the date values based on the sort order
      if (order === 1) {
        return first_date - second_date; // Ascending order
      } else {
        return second_date - first_date; // Descending order
      }
    });

    return updatedData;
  };

  const parseDate = dateString => {
    if (dateString) {
      const parts = dateString.split('-');
      if (parts?.length === 3) {
        const [day, month, year] = parts.map(part => parseInt(part, 10));
        return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
      }
    }
  };

  const checkboxTemplate = (data, row) => {
    const fieldName = row?.column?.props?.field;
    return (
      <Checkbox
        name={fieldName}
        onChange={e => {
          handlefieldChange(e, e.target.checked, data);
        }}
        checked={data[fieldName]}
        disabled
      />
    );
  };

  const handleSaveSelectedRoll = () => {
    const generateSelectedList = selectedRollsData?.map(item => {
      const payload = {
        po_item: item?.po_item,
        job_id: item?.job_id || '',
        item_id: Number(item?.item_id),
        po_number: Number(item?.po_number),
        purchase_order: item?.purchase_order,
        design_date: item?.design_date
          ? moment(item?.design_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
          : '',
        proof_rcv_date: item?.proof_rcv_date
          ? moment(item?.proof_rcv_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
          : '',
        proof_ok_date: item?.proof_ok_date
          ? moment(item?.proof_ok_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
          : '',
        received_date: item?.received_date
          ? moment(item?.received_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
          : '',
      };
      return payload;
    });

    if (!generateSelectedList?.length) {
      toast.error('Please select atleast one date');
      return;
    } else {
      dispatch(savePrePrintedOrder(generateSelectedList));
      loadTableData(dates);
    }
  };

  return (
    <>
      {prePrintedStatusLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col lg={2}>
                <div className="page_title">
                  <h3 className="m-0">Pre-Printed Rolls</h3>
                </div>
              </Col>
              <Col lg={10}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li className="order_checkbox_wrap">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="IsCompleted"
                          name="IsCompleted"
                          onChange={e => {
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                prePrintedStatus: {
                                  ...allCommon?.prePrintedStatus,
                                  isCompleted: e.checked,
                                  filterToggle: false,
                                  completedFilterToggle: false,
                                  searchQuery: '',
                                },
                              }),
                            );

                            if (e.checked) {
                              dispatch(
                                getCompletedPrePrintedOrderList(
                                  currentPage,
                                  pageLimit,
                                  '',
                                  applied,
                                  dates,
                                ),
                              );
                            } else {
                              dispatch(
                                getPrePrintedPurchaseOrderList(
                                  currentPage,
                                  pageLimit,
                                  '',
                                  applied,
                                  dates,
                                ),
                              );
                            }
                          }}
                          checked={isCompleted}
                        />
                        <label htmlFor="IsCompleted" className="mb-0">
                          Show Completed
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
                            debounceHandleSearchInput(e, isCompleted);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                prePrintedStatus: {
                                  ...allCommon?.prePrintedStatus,
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
                        onClick={e => op?.current?.toggle(e)}
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
                                prePrintedStatus: {
                                  ...allFilters?.prePrintedStatus,
                                  dates: e.value,
                                },
                              }),
                            );
                            if (e?.value && e.value[0] && e.value[1]) {
                              loadTableData(e.value);
                            } else if (e.value === null) {
                              loadTableData(e.value);
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
                                    prePrintedStatus: {
                                      ...allFilters?.prePrintedStatus,
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
                    {!isCompleted && (
                      <li>
                        <Button
                          className="btn_primary"
                          onClick={handleSaveSelectedRoll}
                        >
                          Save
                        </Button>
                      </li>
                    )}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper cell_padding_large with_colspan_head break_header is_filter">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    prePrintedStatus: {
                      ...allCommon?.prePrintedStatus,
                      filterToggle: !filterToggle,
                      // ...(isCompleted && {
                      //   completedFilterToggle: !completedFilterToggle,
                      // }),
                      // ...(!isCompleted && { filterToggle: !filterToggle }),
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={
                isCompleted
                  ? completedPrePrintedOrderList?.list
                  : prePrintedPurchaseOrderList?.list
              }
              sortMode="single"
              sortField="name"
              filterDisplay="row"
              dataKey="unique_id"
              // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              // onSelectionChange={e => handleCheckboxTemplate(e.value)}
              // selection={selected}
              filters={
                isCompleted ? completedPrePrintedFilters : prePrintedFilter
              }
              scrollable={isMobile === true ? false : true}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    prePrintedStatus: {
                      ...allCommon?.prePrintedStatus,
                      ...(isCompleted && {
                        completedPrePrintedFilters: event?.filters,
                      }),
                      ...(!isCompleted && { prePrintedFilter: event?.filters }),
                    },
                  }),
                );
              }}
              emptyMessage={
                prePrintedStatusListLoading && <Skeleton count={10} />
              }
              // onFiltersChange={e => {
              //   // setFilters(e.filters);
              //   dispatch(
              //     setAllCommon({
              //       ...allCommon,
              //       prePrintedStatus: {
              //         ...allCommon?.prePrintedStatus,
              //         completedPrePrintedFilters: {
              //           ...allCommon?.prePrintedStatus
              //             ?.completedPrePrintedFilters,
              //           [e.columnName]: e.filters,
              //         },
              //       },
              //     }),
              //   );
              // }}
            >
              {/* <Column
                selectionMode="multiple"
                headerStyle={{ width: '3rem' }}
              ></Column> */}

              {!isCompleted && (
                <Column
                  field="select_preprinted_roll"
                  style={{ zIndex: '10', minWidth: '82px' }}
                  body={checkboxTemplate}
                  frozen
                ></Column>
              )}
              <Column
                field="order_date"
                header="Order"
                filter={filterToggle}
                body={dateTemplate}
                style={{ zIndex: '10' }}
                // filterElement={<CustomFilterTemplate />}
                // filterFunction={customFilter}
                sortable
                frozen
                sortFunction={event => customSortFunction(event)}
              ></Column>
              <Column
                field="purchase_date"
                header="PO"
                filter={filterToggle}
                body={dateTemplate}
                sortFunction={event => customSortFunction(event)}
                style={{ zIndex: '10' }}
                sortable
                frozen
              ></Column>
              <Column
                field="design_date"
                header="Design"
                filter={filterToggle}
                body={dateIconTemplate}
                sortFunction={event => customSortFunction(event)}
                // style={{ zIndex: '10' }}
                // frozen
                style={{ zIndex: '10' }}
                sortable
                frozen
              ></Column>
              {/* <Column
                field="due_date"
                header="Date"
                sortable
                filter={filterToggle}
                className="column_group with_before specifications"
                body={dateIconTemplate}
                style={{ zIndex: '10' }}
                frozen
              ></Column> */}
              <Column
                field="proof_rcv_date"
                header="Proof Rcv"
                filter={filterToggle}
                body={dateIconTemplate}
                sortFunction={event => customSortFunction(event)}
                style={{ zIndex: '10' }}
                sortable
                frozen
              ></Column>
              <Column
                field="proof_ok_date"
                header="Proof Ok"
                filter={filterToggle}
                body={dateIconTemplate}
                sortFunction={event => customSortFunction(event)}
                style={{ zIndex: '10' }}
                sortable
                frozen
              ></Column>
              <Column
                field="received_date"
                header="Received"
                filter={filterToggle}
                body={dateIconTemplate}
                sortFunction={event => customSortFunction(event)}
                style={{ zIndex: '10' }}
                sortable
                frozen
              ></Column>
              {/* {!isCompleted && (
                <Column
                  field="verify"
                  header="Verify"
                  body={innerVerify}
                  style={{ zIndex: '10' }}
                  frozen
                />
              )} */}
              <Column
                field="image"
                header="Image"
                body={imageTemplate}
              ></Column>
              <Column
                field="roll_direction_image"
                header="Role Direction Image"
                body={imageRollTemplate}
              ></Column>
              <Column
                field="design_name"
                header="Design Name"
                sortable
                filter={filterToggle}
                // body={designName}
              ></Column>
              <Column
                field="base_fabric"
                header="Base Fabric"
                sortable
                filter={filterToggle}
                // body={baseFebric}
              ></Column>
              <Column
                field="lamination"
                header="Lamination Type"
                sortable
                filter={filterToggle}
                body={laminationTemplate}
              ></Column>
              <Column
                field="gsm"
                header="GSM"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="old_str"
                header="OLD STR"
                sortable
                showFilterMenu={false}
                filter={filterToggle}
                filterElement={e => statusRowFilterTemplate(e, 'old_str')}
                body={bedgeBodyTemplate}
                frozen
              ></Column>
              <Column
                field="kg_qty"
                header="Qty (kg)"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="qty"
                header="Qty (Bags)"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="rate"
                header="Rate"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="amount"
                header="Amount"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="bag_size"
                header="Bag Size"
                sortable
                filter={filterToggle}
                body={bagSizeTemplate}
              ></Column>
              <Column
                field="ne_white_cylinder"
                header="New White Cylinder"
                sortable
                filter={filterToggle}
                body={newWhiteCylinderTemplate}
              ></Column>
              {/* <Column
              field="noOfNewCylinder"
              header="No. of New Cylinder"
              sortable
              filter={filterToggle}
            ></Column> */}
              <Column
                field="new_white_cylinder_qty"
                header="Qty"
                sortable
                filter={filterToggle}
                className="column_group with_before new_white_cylinder border_left"
              ></Column>
              <Column
                field="new_white_cylinder_rate"
                header="PO Rate"
                sortable
                filter={filterToggle}
                className="column_group border_right"
              ></Column>
              <Column
                field="reengraved_cylinder_qty"
                header="Qty"
                sortable
                filter={filterToggle}
                className="column_group with_before re_engraved_cylinder"
              ></Column>
              <Column
                field="reengraved_cylinder_rate"
                header="PO Rate"
                sortable
                filter={filterToggle}
                className="column_group border_right"
              ></Column>
              <Column
                field="recieved_net_weight"
                header="Actual Qty Received"
                sortable
                filter={filterToggle}
                // body={inputTemplate}
              ></Column>
              <Column
                field="cylinder_charge_from_customer"
                header="Cylinder charges customer"
                sortable
                filter={filterToggle}
                // body={colorTextTemplate}
              ></Column>
              <Column
                field="cylinder_charge_from_po"
                header="Cylinder charges in PO"
                sortable
                filter={filterToggle}
                // body={colorTextTemplate}
              ></Column>
              <Column
                field="job_no"
                header="Job Number"
                className="view_detail"
                sortable
                body={jonNumberTemplete}
                filter={filterToggle}
                // body={colorTextTemplate}
              ></Column>
              <Column
                field="po_number"
                header="PONumber"
                className="view_detail"
                sortable
                body={POTemplete}
                filter={filterToggle}
              ></Column>
              <Column
                field="supplier_name"
                header="Supplier Name"
                sortable
                filter={filterToggle}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={
                isCompleted
                  ? completedPrePrintedOrderList?.list
                  : prePrintedPurchaseOrderList?.list
              }
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={
                isCompleted
                  ? completedPrePrintedOrderList?.count
                  : prePrintedPurchaseOrderList?.count
              }
            />
          </div>
        </div>
        <Dialog
          header={`${isEdit ? 'Update' : 'Save'}  Personal Filters`}
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
