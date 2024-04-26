import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import Loader from 'Components/Common/Loader';
import {
  exportBrokerMarginData,
  getBrokerMarginAnalysisList,
  getBrokerOptionsList,
  getPendingBrokerMarginAnalysisList,
  saveBrokerMarginData,
} from 'Store/Reducers/Finance/FinancialsService';
import { getDMYDateFormat, statusObj } from 'Helper/Common';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import FilterIcon from '../../Assets/Images/filter.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import FilterOverlay from 'Components/Common/FilterOverlay';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import {
  getActiveBagTypeList,
  getActiveLaminationTypeList,
} from 'Services/Settings/MiscMasterService';
import {
  setBrokerMarginAnalysisList,
  setPendingBrokerMarginList,
} from 'Store/Reducers/Finance/FinancialsSlice';
import { Checkbox } from 'primereact/checkbox';
import moment from 'moment';
import CustomPaginator from 'Components/Common/CustomPaginator';
import Skeleton from 'react-loading-skeleton';
import { Tag } from 'primereact/tag';

const imageTemplate = data => {
  return (
    <div className="image_zoom_Wrapper">
      <Image
        // src={ProductImg}
        // zoomSrc={ProductImgBig}
        src={data?.product_detail?.main_image}
        zoomSrc={data?.product_detail?.main_image}
        alt="Image"
        preview
        downloadable
      />
    </div>
  );
};

const designNameTemplate = rowItem => {
  return <span className="d-block">{rowItem?.product_detail?.design}</span>;
};

const bagSizeAndGSMTemplate = rowItem => {
  const bagDetail = rowItem?.bag_detail;
  const value = `W${bagDetail?.width} X H${bagDetail?.height} X G${bagDetail?.gusset} (${bagDetail?.gsm}GSM)`;

  return <span className="d-block">{value}</span>;
};

const bagTypeTemplate = rowItem => {
  return <span>{rowItem?.bag_detail?.bag_type}</span>;
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

export const getBrokerSeverity = lamination => {
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

const brokerMarginFilterDetails = [
  { label: 'Job Date', value: 'job_date', type: 'inputBox' },
  { label: 'Job Number', value: 'job_no', type: 'inputBox' },
  {
    label: 'Party Name',
    value: 'party_name',
    type: 'inputBox',
  },
  { label: 'Design Name', value: 'design', type: 'inputBox' },
  { label: 'Bag Type', value: 'bag_type', type: 'dropDown' },
  { label: 'Lamination Type', value: 'lamination_type_name', type: 'dropDown' },
  {
    label: 'Reward Transferred',
    value: 'reward_transferred',
    type: 'dropDown',
  },
];

const laminationTemplate = item => {
  const lamination = [...(item?.lamination_type_name || [])]?.sort();

  return (
    <div>
      {lamination?.length > 0 ? (
        lamination?.map(value => {
          const lamination_name = value?.toLowerCase();
          return (
            <Tag
              value={value}
              severity={getBrokerSeverity(lamination_name)}
              className="me-2"
            />
          );
        })
      ) : (
        <Tag
          value={'Non Laminated'}
          severity={getBrokerSeverity('Non Laminated')}
        />
      )}
    </div>
  );
};

export default function BrokerMargin() {
  const op = useRef(null);
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [brokerSelect, setBrokerSelect] = useState('');
  const [saveFilterModal, setSaveFilterModal] = useState(false);

  const { listFilter } = useSelector(({ parties }) => parties);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { bagTypeListMenu, activeLaminationTypeList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );
  const {
    financeLoading,
    brokerMarginLoading,
    brokerOptionsList,
    brokerMarginAnalysisList,
    pendingBrokerMarginList,
  } = useSelector(({ finance }) => finance);

  const {
    applied,
    filters,
    currentPage,
    pageLimit,
    selectedItemIndex,
    pendingBrokerCurrentPageLimit,
    pendingBrokerCurrentPage,
  } = allFilters?.brokerMargin;

  const { searchQuery, brokerMarginFilter, filterToggle, isPendingReward } =
    allCommon?.brokerMargin;

  const updatedBrokerOptions = useMemo(() => {
    const updatedData = brokerOptionsList?.map(item => {
      return { label: `${item.first_name} ${item.last_name}`, value: item._id };
    });
    setBrokerSelect(updatedData[0]?.value);
    return updatedData;
  }, [brokerOptionsList]);

  // Updated Broker Margin data:
  // const updatedBrokerMarginList = useMemo(() => {
  //   let updatedData = brokerMarginAnalysisList;
  //   if (brokerMarginAnalysisList?.length) {
  //     if (isPendingReward) {
  //       updatedData = brokerMarginAnalysisList?.filter(
  //         item => item.reward_transferred === false,
  //       );
  //     }
  //   }
  //   return updatedData;
  // }, [brokerMarginAnalysisList, isPendingReward]);

  const handleBrokerMarginListings = useCallback(() => {
    if (brokerSelect) {
      if (isPendingReward) {
        dispatch(
          getPendingBrokerMarginAnalysisList(
            pendingBrokerCurrentPage,
            pendingBrokerCurrentPageLimit,
            brokerSelect,
            applied,
            searchQuery,
          ),
        );
      } else {
        dispatch(
          getBrokerMarginAnalysisList(
            currentPage,
            pageLimit,
            brokerSelect,
            applied,
            searchQuery,
          ),
        );
      }
    }
  }, [
    dispatch,
    applied,
    brokerSelect,
    currentPage,
    pageLimit,
    searchQuery,
    isPendingReward,
    pendingBrokerCurrentPage,
    pendingBrokerCurrentPageLimit,
  ]);

  const loadRequiredData = () => {
    dispatch(
      getListFilter({
        module_name: 'brokerMarginAnalysis',
      }),
    );
    handleBrokerMarginListings();
    dispatch(getBrokerOptionsList());
    dispatch(getActiveBagTypeList());
    dispatch(getActiveLaminationTypeList());
  };

  useEffect(() => {
    loadRequiredData();
  }, []);

  // useEffect(() => {
  //   if (brokerSelect) {
  //     if (isPendingReward) {
  //       dispatch(
  //         getPendingBrokerMarginAnalysisList(
  //           pendingBrokerCurrentPage,
  //           pendingBrokerCurrentPageLimit,
  //           brokerSelect,
  //           applied,
  //           searchQuery,
  //         ),
  //       );
  //     } else {
  //       dispatch(
  //         getBrokerMarginAnalysisList(
  //           currentPage,
  //           pageLimit,
  //           brokerSelect,
  //           applied,
  //           searchQuery,
  //         ),
  //       );
  //     }
  //   }
  // }, [
  //   applied,
  //   brokerSelect,
  //   currentPage,
  //   dispatch,
  //   isPendingReward,
  //   pageLimit,
  //   pendingBrokerCurrentPage,
  //   pendingBrokerCurrentPageLimit,
  // ]);

  const laminationOptions = useMemo(() => {
    const updatedLaminationData = activeLaminationTypeList?.map(item => {
      return { label: item?.label, value: item.label };
    });
    return [
      ...updatedLaminationData,
      { label: 'Non Laminated', value: 'Non Laminated' },
    ];
  }, [activeLaminationTypeList]);

  const bedgeBodyTemplate = (data, row) => {
    const name = row?.field;
    const value = data?.reward_transferred ? 'Yes' : 'No';

    const handleBodyChange = (e, fieldValue) => {
      const brokerData = isPendingReward
        ? pendingBrokerMarginList?.list
        : brokerMarginAnalysisList?.list;

      let updatedList = [...brokerData];

      const index = updatedList?.findIndex(x => x?._id === fieldValue?._id);

      if (index !== -1) {
        const oldObj = updatedList[index];
        const updatedObj = {
          ...oldObj,
          [name]: !fieldValue?.reward_transferred,
        };
        updatedList[index] = updatedObj;
        if (isPendingReward) {
          dispatch(
            setPendingBrokerMarginList({
              ...pendingBrokerMarginList,
              list: updatedList,
            }),
          );
        } else {
          dispatch(
            setBrokerMarginAnalysisList({
              ...brokerMarginAnalysisList,
              list: updatedList,
            }),
          );
        }
      }
    };

    return (
      <button
        className={`bedge_${getSeverity(data?.reward_transferred)}`}
        onClick={e => {
          handleBodyChange(e, data);
        }}
      >
        {value}
      </button>
    );
  };

  const inputTemplate = (data, row) => {
    const headerName = row?.column?.props?.header;
    const fieldName = row?.column?.props?.field;
    const newUpdatedclass = fieldName === 'comment' ? 'max_280px' : 'max_100px';

    return (
      <div className="form_group">
        <InputText
          name={fieldName}
          value={data[fieldName]}
          placeholder={`Enter ${headerName}`}
          onChange={e => handlefieldChange(e, data)}
          className={newUpdatedclass}
        />
      </div>
    );
  };

  const profitTemplete = rowItem => {
    return <span>{rowItem?.profit}%</span>;
  };

  const invoiceDateTemplate = rowItem => {
    const invoiceDateIds = rowItem?.sales_invoice
      ?.map(item => item.invoice_dateId)
      ?.join(',');

    return (
      <span className="d-block">
        {rowItem?.sales_invoice?.length ? invoiceDateIds : '-'}
      </span>
    );
  };

  const daysCountTemplate = rowItem => {
    let diff = 0;
    if (rowItem.full_payment_received_date && rowItem.sales_invoice?.length) {
      const date1 = moment(
        rowItem.full_payment_received_date,
        'DD-MM-YYYY',
      ).startOf('day');
      const date2 = moment(rowItem.sales_invoice[0].invoice_date).startOf(
        'day',
      );
      diff = date2.diff(date1, 'days');
    }
    return <span className="d-block">{diff} Days</span>;
  };

  const isMobile = useMemo(() => {
    if (window.innerWidth < 1500) {
      return true;
    } else {
      return false;
    }
  }, []);

  const dateInputTemplate = (data, row) => {
    const headerName = row?.column?.props?.header;
    const fieldName = row?.column?.props?.field;

    return (
      <div className="date_icon_Wrap d-flex g-2 align-items-center">
        <div className="form_group date_select_wrapper">
          <Calendar
            name={fieldName}
            value={data[fieldName]}
            placeholder={`Enter ${headerName}`}
            showIcon
            dateFormat="dd-mm-yy"
            onChange={e => handlefieldChange(e, data)}
            showButtonBar
          />
        </div>
        <p className="m-0 ms-2">{data[fieldName]}</p>
      </div>
    );
  };

  const handlefieldChange = (e, rowData) => {
    const value = e.target.value;
    const name = e.target.name;
    const brokerData = isPendingReward
      ? pendingBrokerMarginList?.list
      : brokerMarginAnalysisList?.list;

    let updatedList = [...brokerData];
    const checkDateFiled = [
      'full_payment_received_date',
      'transfer_date',
    ].includes(name);

    const index = updatedList?.findIndex(x => x?._id === rowData?._id);

    if (index !== -1) {
      const oldObj = updatedList[index];
      const updatedObj = {
        ...oldObj,
        [name]: checkDateFiled ? getDMYDateFormat(value) : value,
      };
      updatedList[index] = updatedObj;
      if (isPendingReward) {
        dispatch(
          setPendingBrokerMarginList({
            ...pendingBrokerMarginList,
            list: updatedList,
          }),
        );
      } else {
        dispatch(
          setBrokerMarginAnalysisList({
            ...brokerMarginAnalysisList,
            list: updatedList,
          }),
        );
      }
    }
  };

  const filterOption = useMemo(() => {
    let flterOptionArray = [...brokerMarginFilterDetails];
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
      lamination_type_name: laminationOptions,
      reward_transferred: statusObj,
    };
  }, [bagTypeListMenu, laminationOptions]);

  const selectedFilters = filters?.map(filter => {
    const filterDetail = brokerMarginFilterDetails?.find(
      detail => detail.value === filter.filter,
    );
    return filterDetail ? filterDetail : null;
  });

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
        module_name: 'brokerMarginAnalysis',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'brokerMarginAnalysis',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'brokerMarginAnalysis',
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
        brokerMargin: {
          ...allFilters?.brokerMargin,
          filters: updatedFilters,
        },
      }),
    );
  };

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const updateAppliedValue =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.brokerMargin?.applied)?.length > 0;

      if (updateAppliedValue) {
        if (isPendingReward) {
          dispatch(
            getPendingBrokerMarginAnalysisList(
              pendingBrokerCurrentPage,
              pendingBrokerCurrentPageLimit,
              brokerSelect,
              {},
              searchQuery,
            ),
          );
        } else {
          dispatch(
            getBrokerMarginAnalysisList(
              currentPage,
              pageLimit,
              brokerSelect,
              applied,
              searchQuery,
            ),
          );
        }
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          brokerMargin: {
            ...allFilters?.brokerMargin,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.brokerMargin?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.brokerMargin.selectedItemIndex !== ''
                ? ''
                : allFilters.brokerMargin.selectedItemIndex,
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
      isPendingReward,
      pendingBrokerCurrentPage,
      pendingBrokerCurrentPageLimit,
      brokerSelect,
      searchQuery,
      currentPage,
      pageLimit,
      applied,
    ],
  );

  const handleAddFilter = () => {
    dispatch(
      setAllFilters({
        ...allFilters,
        brokerMargin: {
          ...allFilters?.brokerMargin,
          filters: [
            ...allFilters?.brokerMargin?.filters,
            { filter: '', value: '' },
          ],
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

  const handleFilterEdit = (data, index) => {
    const updatedFilterData = {
      ...data,
      filter_list: data?.filter_list?.map(item => {
        const findObj = brokerMarginFilterDetails?.find(
          obj => obj?.value === item?.filter && obj?.type === 'dropDown',
        );

        const checkDropDownList = ['reward_transferred']?.includes(
          findObj?.value,
        );

        if (findObj) {
          if (checkDropDownList) {
            const updatedValues = item?.value?.split(', ')?.map(value1 => {
              let values = value1;
              switch (value1) {
                case 'true':
                  values = true;
                  break;
                default:
                  values = false;
              }
              return values;
            });
            return { ...item, value: updatedValues };
          } else {
            return { ...item, value: item.value.split(', ') };
          }
        } else {
          return { ...item };
        }
      }),
    };

    dispatch(
      setAllFilters({
        ...allFilters,
        brokerMargin: {
          ...allFilters?.brokerMargin,
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
        module_name: 'brokerMarginAnalysis',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          brokerMargin: {
            ...allFilters?.brokerMargin,
            currentPage: 1,
            filters: [],
            applied: {},
            selectedItemIndex: '',
          },
        }),
      );
      dispatch(
        getListFilter({
          module_name: 'brokerMarginAnalysis',
        }),
      );

      if (isPendingReward) {
        dispatch(
          getPendingBrokerMarginAnalysisList(
            1,
            pendingBrokerCurrentPageLimit,
            brokerSelect,
            {},
            searchQuery,
          ),
        );
      } else {
        dispatch(
          getBrokerMarginAnalysisList(
            1,
            pageLimit,
            brokerSelect,
            {},
            searchQuery,
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
          brokerMargin: {
            ...allFilters?.brokerMargin,
            applied: filterObj,
            currentPage: 1,
          },
        }),
      );
      if (isPendingReward) {
        dispatch(
          getPendingBrokerMarginAnalysisList(
            1,
            pendingBrokerCurrentPageLimit,
            brokerSelect,
            filterObj,
            searchQuery,
          ),
        );
      } else {
        dispatch(
          getBrokerMarginAnalysisList(
            1,
            pageLimit,
            brokerSelect,
            filterObj,
            searchQuery,
          ),
        );
      }
    }
  }, [
    filters,
    dispatch,
    allFilters,
    isPendingReward,
    pendingBrokerCurrentPageLimit,
    brokerSelect,
    searchQuery,
    pageLimit,
  ]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        if (isPendingReward) {
          dispatch(
            getPendingBrokerMarginAnalysisList(
              1,
              pendingBrokerCurrentPageLimit,
              brokerSelect,
              {},
              searchQuery,
            ),
          );
        } else {
          dispatch(
            getBrokerMarginAnalysisList(
              1,
              pageLimit,
              brokerSelect,
              {},
              searchQuery,
            ),
          );
        }
        dispatch(
          setAllFilters({
            ...allFilters,
            brokerMargin: {
              ...allFilters?.brokerMargin,
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
            brokerMargin: {
              ...allFilters?.brokerMargin,
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
    [
      applied,
      isEdit,
      isPendingReward,
      dispatch,
      allFilters,
      pendingBrokerCurrentPageLimit,
      brokerSelect,
      searchQuery,
      pageLimit,
    ],
  );

  const handleSearchInput = (e, brokerSelectedId) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        brokerMargin: {
          ...allFilters?.brokerMargin,
          currentPage: 1,
        },
      }),
    );

    if (brokerSelectedId) {
      dispatch(
        getBrokerMarginAnalysisList(
          currentPage,
          pageLimit,
          brokerSelectedId,
          applied,
          e.target.value,
        ),
      );
    }
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const handleSaveData = () => {
    const brokerData = isPendingReward
      ? pendingBrokerMarginList?.list
      : brokerMarginAnalysisList?.list;

    const payloadData = brokerData?.map(item => {
      return {
        job_id: item?._id,
        ...(item?.mfg_id && { mfg_id: item?.mfg_id }),
        freight_charge: Number(item?.freight_charge),
        freight_charge_paid_by_customer: Number(
          item?.freight_charge_paid_by_customer,
        ),
        full_payment_received_date: item?.full_payment_received_date
          ? moment(item?.full_payment_received_date, 'DD-MM-YYYY').format(
              'YYYY-MM-DD',
            )
          : '',
        amount_deducted_by_cutomer: Number(item?.amount_deducted_by_cutomer),
        final_reward: Number(item?.final_reward),
        transfer_amount: Number(item?.transfer_amount),
        reward_transferred: item?.reward_transferred ? 1 : 0,
        transfer_date: item?.transfer_date
          ? moment(item?.transfer_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
          : '',
        comment: item?.comment,
      };
    });
    const data = {
      broker_margin_data: payloadData,
    };
    dispatch(saveBrokerMarginData(data));
  };

  const onPageChange = useCallback(
    page => {
      let pageIndex = isPendingReward ? pendingBrokerCurrentPage : currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(
        setAllFilters({
          ...allFilters,
          brokerMargin: {
            ...allFilters?.brokerMargin,
            ...(isPendingReward && { pendingBrokerCurrentPage: pageIndex }),
            ...(!isPendingReward && { currentPage: pageIndex }),
          },
        }),
      );

      if (isPendingReward) {
        dispatch(
          getPendingBrokerMarginAnalysisList(
            pageIndex,
            pendingBrokerCurrentPageLimit,
            brokerSelect,
            applied,
            searchQuery,
          ),
        );
      } else {
        dispatch(
          getBrokerMarginAnalysisList(
            pageIndex,
            pageLimit,
            brokerSelect,
            applied,
            searchQuery,
          ),
        );
      }
    },
    [
      isPendingReward,
      pendingBrokerCurrentPage,
      currentPage,
      dispatch,
      allFilters,
      pendingBrokerCurrentPageLimit,
      brokerSelect,
      applied,
      searchQuery,
      pageLimit,
    ],
  );

  const onPageRowsChange = useCallback(
    page => {
      const updateCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setAllFilters({
          ...allFilters,
          brokerMargin: {
            ...allFilters?.brokerMargin,
            ...(isPendingReward && {
              pendingBrokerCurrentPage: updateCurrentPage,
              pendingBrokerCurrentPageLimit: page,
            }),
            ...(!isPendingReward && {
              currentPage: updateCurrentPage,
              pageLimit: page,
            }),
          },
        }),
      );

      if (isPendingReward) {
        dispatch(
          getPendingBrokerMarginAnalysisList(
            updateCurrentPage,
            page,
            brokerSelect,
            applied,
            searchQuery,
          ),
        );
      } else {
        dispatch(
          getBrokerMarginAnalysisList(
            updateCurrentPage,
            page,
            brokerSelect,
            applied,
            searchQuery,
          ),
        );
      }
    },
    [allFilters, applied, brokerSelect, dispatch, isPendingReward, searchQuery],
  );

  return (
    <>
      {financeLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col lg={3}>
                <div className="page_title">
                  <h3 className="m-0">Broker Margin</h3>
                </div>
              </Col>
              <Col lg={9}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li className="order_checkbox_wrap">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="IsPendingReward"
                          name="IsPendingReward"
                          onChange={e => {
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                brokerMargin: {
                                  ...allCommon?.brokerMargin,
                                  isPendingReward: e.checked,
                                  filterToggle: false,
                                  searchQuery: '',
                                },
                              }),
                            );
                          }}
                          checked={isPendingReward}
                        />
                        <label htmlFor="IsPendingReward" className="mb-0">
                          Pending Reward
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
                            debounceHandleSearchInput(e, brokerSelect);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                brokerMargin: {
                                  ...allCommon?.brokerMargin,
                                  searchQuery: e.target.value,
                                },
                              }),
                            );
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <ReactSelectSingle
                        BrokerSelect
                        value={brokerSelect}
                        options={updatedBrokerOptions}
                        onChange={e => {
                          setBrokerSelect(e.value);
                          // handleBrokerMarginListing(e.value);
                        }}
                        placeholder="Select Broker"
                      />
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
                      <Dropdown className="dropdown_common export_dropdown position-static">
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          className="btn_border icon_btn"
                          onClick={() =>
                            dispatch(exportBrokerMarginData(brokerSelect))
                          }
                        >
                          <img src={ExportIcon} alt="" />
                        </Dropdown.Toggle>
                      </Dropdown>
                    </li>
                    <li>
                      <Button className="btn_primary" onClick={handleSaveData}>
                        Save
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper with_colspan_head is_filter break_header cell_padding_small">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    brokerMargin: {
                      ...allCommon?.brokerMargin,
                      filterToggle: !filterToggle,
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={
                isPendingReward
                  ? pendingBrokerMarginList?.list
                  : brokerMarginAnalysisList?.list
              }
              sortMode="single"
              sortField="name"
              filterDisplay="row"
              dataKey="_id"
              filters={brokerMarginFilter}
              scrollable={isMobile === true ? false : true}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    brokerMargin: {
                      ...allCommon?.brokerMargin,
                      brokerMarginFilter: event?.filters,
                    },
                  }),
                );
              }}
              emptyMessage={brokerMarginLoading && <Skeleton count={10} />}
            >
              <Column
                field="job_date"
                header="Date"
                sortable
                filter={filterToggle}
                style={{ zIndex: '10', minWidth: '139px' }}
                frozen
              ></Column>
              <Column
                field="job_no"
                header="Job No"
                sortable
                filter={filterToggle}
                style={{ zIndex: '10', minWidth: '85px' }}
                frozen
              ></Column>
              <Column
                field="job_value"
                header="Job Value"
                sortable
                filter={filterToggle}
                style={{ zIndex: '10', minWidth: '110px' }}
                frozen
              ></Column>
              <Column
                field="party_name"
                header="Party Name"
                sortable
                filter={filterToggle}
                style={{ zIndex: '10', minWidth: '120px' }}
                className="width_100"
                frozen
              ></Column>
              <Column
                field="image"
                header="Img"
                body={imageTemplate}
                style={{ zIndex: '10', minWidth: '85px' }}
                frozen
              ></Column>
              <Column
                field="design"
                header="Design Name"
                sortable
                filter={filterToggle}
                body={designNameTemplate}
                style={{ zIndex: '10', minWidth: '150px' }}
                className="width_130"
                frozen
              ></Column>
              <Column
                field="size_GSM"
                header="Size & GSM"
                sortable
                filter={filterToggle}
                style={{ zIndex: '10', minWidth: '140px' }}
                body={bagSizeAndGSMTemplate}
                className="width_120"
                frozen
              ></Column>
              <Column
                field="bag_type"
                header="Bag Type"
                sortable
                filter={filterToggle}
                body={bagTypeTemplate}
                style={{ zIndex: '10', minWidth: '140px' }}
                className="width_120"
                frozen
              ></Column>
              <Column
                field="lamination_type"
                header="Lamination"
                sortable
                filter={filterToggle}
                body={laminationTemplate}
                style={{ zIndex: '10', minWidth: '120px' }}
                className="width_100"
                frozen
              ></Column>
              <Column
                field="supplied_pcs"
                header="Pcs"
                sortable
                filter={filterToggle}
                className="column_group border_left"
              ></Column>
              <Column
                field="supplied_kg"
                header="Weight"
                sortable
                filter={filterToggle}
                className="column_group with_before bags_supplied"
              ></Column>
              <Column
                field="weight_per_bag"
                header="Weight per bag"
                sortable
                filter={filterToggle}
                className="column_group border_right"
              ></Column>
              <Column
                field="selling_price_per_pc"
                header="Selling Price Per bag"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="selling_price_per_kg"
                header="Selling Price KG Rate"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="base_rate"
                header="BaseRate"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="actual_block_charge"
                header="Actual Block Charges"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="block_charge_taken_from_customer"
                header="Block Charges Taken From Customer"
                sortable
                filter={filterToggle}
              ></Column>
              {/*  */}
              {/* <Column
                field="freightChargesPaidByUs"
                header="Freight Charges paid by us"
                sortable
                filter={filterToggle}
                body={bedgeBodyTemplate(true, 'Yes')}
              ></Column> */}
              <Column
                field="freight_charge"
                // header="Freight Charges"
                header="Freight Charges paid by us"
                sortable
                filter={filterToggle}
                body={inputTemplate}
              ></Column>
              <Column
                field="freight_charge_paid_by_customer"
                header="Freight Taken From Customer"
                sortable
                filter={filterToggle}
                body={inputTemplate}
              ></Column>
              <Column
                field="invoice_date"
                header="Invoice Date"
                sortable
                body={invoiceDateTemplate}
                filter={filterToggle}
              ></Column>
              {/* <Column
                field="paymentReceived"
                header="Payment Received"
                sortable
                filter={filterToggle}
                body={bedgeBodyTemplate(true, 'Yes')}
              ></Column> */}
              <Column
                field="full_payment_received_date"
                header="Full Payment Received Date"
                sortable
                filter={filterToggle}
                body={dateInputTemplate}
              ></Column>
              <Column
                field="days"
                header="Days"
                sortable
                body={daysCountTemplate}
                filter={filterToggle}
              ></Column>
              {/* <Column
                field="amount_deducted" // TODO: --------
                header="Amount Deducted"
                sortable
                filter={filterToggle}
                body={bedgeBodyTemplate(true, 'Yes')}
              ></Column> */}
              <Column
                field="amount_deducted_by_cutomer"
                header="Amount Deducted By Customer"
                sortable
                filter={filterToggle}
                body={inputTemplate}
              ></Column>
              <Column
                field="calculate_reward"
                header="Calculated Reward"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="profit"
                header="Profit %"
                sortable
                body={profitTemplete}
                filter={filterToggle}
              ></Column>
              <Column
                field="final_reward"
                header="Final Reward"
                sortable
                filter={filterToggle}
                body={inputTemplate}
              ></Column>
              <Column
                field="reward_transferred" // TODO:
                header="Reward Transferred"
                sortable
                filter={filterToggle}
                body={bedgeBodyTemplate}
              ></Column>
              <Column
                field="transfer_date" // Date InputField
                header="Transfer Date"
                sortable
                filter={filterToggle}
                // body={inputTemplate}
                body={dateInputTemplate}
              ></Column>
              <Column
                field="transfer_amount" // --------
                header="Transfer Amount"
                sortable
                filter={filterToggle}
                style={({ minWidth: '50px' }, { zIndex: '10' })}
                body={inputTemplate}
                frozen
              ></Column>
              <Column
                field="comment"
                header="Comment"
                sortable
                filter={filterToggle}
                body={inputTemplate}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={
                isPendingReward
                  ? pendingBrokerMarginList?.list
                  : brokerMarginAnalysisList?.list
              }
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={
                isPendingReward
                  ? pendingBrokerMarginList?.count
                  : brokerMarginAnalysisList?.count
              }
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
        listFilter={listFilter}
        filterOption={filterOption}
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        selectedItemIndex={selectedItemIndex}
        content={content}
        setNameFilter={setNameFilter}
        handleAddFilter={handleAddFilter}
        handleFilterEdit={handleFilterEdit}
        handleFilterChange={handleFilterChange}
        handleRemoveFilter={handleRemoveFilter}
        handleFilterDelete={handleFilterDelete}
        applyFilterHandler={applyFilterHandler}
        clearAppliedFilter={clearAppliedFilter}
        setSaveFilterModal={setSaveFilterModal}
      />
    </>
  );
}
