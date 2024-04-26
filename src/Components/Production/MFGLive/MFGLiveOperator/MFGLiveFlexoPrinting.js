import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import EditIcon from '../../../../Assets/Images/edit.svg';
import PlusIcon from '../../../../Assets/Images/plus.svg';
import Camera from '../../../../Assets/Images/camera.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import CheckGreen from '../../../../Assets/Images/check-round-green.svg';
import DummyImage from '../../../../Assets/Images/gusset-bag.png';
import { Image } from 'primereact/image';
import { Checkbox } from 'primereact/checkbox';
import Cylinder from './Cylinder';
import CommonHeader from './CommonHeader';
import FilterOverlay from 'Components/Common/FilterOverlay';
import { useSelector } from 'react-redux';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { useDispatch } from 'react-redux';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import {
  getActiveBagTypeList,
  getActiveMachineTypeList,
  getFactoryLocationList,
} from 'Services/Settings/MiscMasterService';
import {
  MFGfProcessLists,
  getCylinderSizeLists,
  getListOperator,
  updateMachineCount,
  viewPrintingMachineCount,
} from 'Services/Production/mfgLiveOperatorServices';
import { getProductDetailById } from 'Services/Products/ProductService';
import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  getMfgLivePrintingFilterList,
  getSuggestedRollList,
  updatePrintStatus,
  viewMfgProcessPrintingById,
} from 'Services/Production/mfgLiveServices';
import {
  setAssignedRollList,
  setClearPrintingData,
  setprintingData,
  setSuggestedRollList,
} from 'Store/Reducers/Production/mfgLiveSlice';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { Calendar } from 'primereact/calendar';
import _ from 'lodash';
import { toast } from 'react-toastify';
import MFGOperatorPrintingFilter from './MFGOperatorPrintingFilter';
import { getFormattedDate, isMobileDevice, statusObj } from 'Helper/Common';
import Skeleton from 'react-loading-skeleton';
import { InputNumber } from 'primereact/inputnumber';
import { setViewProductDetailData } from 'Store/Reducers/Products/ProductSlice';
import { Dropdown } from 'primereact/dropdown';
import ImageCapture from 'Components/Common/ImageCapture/ImageCapture';
import Loader from 'Components/Common/Loader';

const MFGLiveFlexoFilterDetails = [
  { label: 'Job Date', value: 'job_date', type: 'inputBox' },
  { label: 'Day', value: 'days', type: 'inputBox' },
  { label: 'Design Name', value: 'design', type: 'inputBox' },
  { label: 'Width', value: 'width', type: 'inputBox' },
  { label: 'Height', value: 'height', type: 'inputBox' },
  { label: 'Gusset', value: 'gusset', type: 'inputBox' },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'Bag Type', value: 'bag_type_id', type: 'dropDown' },
  { label: 'Fabric Color', value: 'fabric_color', type: 'inputBox' },
  { label: 'Handle Color', value: 'handle_color', type: 'inputBox' },
  { label: 'Quantity', value: 'qty', type: 'inputBox' },
  { label: 'Roll', value: 'roll_available', type: 'dropDown' },
  { label: 'Stereo', value: 'old_stereo', type: 'dropDown' },
  { label: 'STR RCV', value: 'str_rcv', type: 'dropDown' },
  {
    label: 'Notification To Print',
    value: 'notification_to_print',
    type: 'inputBox',
  },
  { label: 'Print Phone No.', value: 'text_to_print', type: 'inputBox' },
  { label: 'Comment', value: 'comment', type: 'inputBox' },
];

const commonStatusObj = [
  { label: 'Old', value: true },
  { label: 'New', value: false },
];

const rollOption = [
  { label: 'YES', value: 1 },
  { label: 'PART', value: 2 },
  { label: 'NO', value: 0 },
];

const blockBodyTemplate = val => {
  return (
    <span className={`bedge_${getSeverity(val)}`}>
      {val === true ? 'OLD' : 'NEW'}
    </span>
  );
};
const strRcvTemplate = val => {
  return (
    <span className={`bedge_${getSeverity(val)}`}>
      {val === true ? 'YES' : 'NO'}
    </span>
  );
};
const notificationBodyTemplate = val => {
  return (
    <span className={`bedge_${getSeverity(val)}`}>
      {val === true ? 'YES' : 'NO'}
    </span>
  );
};

const rollBodyTemplate = val => {
  return (
    <span className={`bedge_${getRollSeverity(val)}`}>
      {val === 1 ? 'YES' : val === 2 ? 'PART' : 'NO'}
    </span>
  );
};

export const getRollSeverity = val => {
  switch (val) {
    case 2:
      return 'warning';
    case 1:
      return 'success';
    case 0:
      return 'danger';
    default:
      return null;
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

const imageTemplate = data => {
  return (
    <div className="image_zoom_Wrapper">
      <Image
        src={data?.main_image}
        zoomSrc={data?.main_image}
        alt="Image"
        preview
        downloadable
      />
    </div>
  );
};
const mainTableSizeTemplate = x => {
  return x?.gusset !== 0
    ? `W ${x?.width} × H ${x?.height} × G ${x?.gusset}`
    : `W ${x?.width} × H ${x?.height} `;
};
const sizeTemplate = rowData => {
  return (
    <>
      <span className="d-block">{`${
        rowData?.width ? 'W ' + rowData.width : ''
      }`}</span>
      {/* <span className="d-block">{`${
        rowData?.height ? '× H ' + rowData.height : ''
      }`}</span> */}
      <span className="d-block">{`${
        rowData?.length ? '× L ' + rowData.length : ''
      }`}</span>
    </>
  );
};

const mainTableRollWidthTemplate = rowData => {
  return <span>{rowData?.roll_width ? `${rowData?.roll_width}”` : ''}</span>;
};

const bagTypeTemplate = data => {
  return <span className="m-0 text-wrap">{data?.bag_type}</span>;
};

const slitTemplate = () => {
  return <img src={CheckGreen} alt="CheckIocn" />;
};

const bg_bolor = data => {
  return {
    bg_yellow: data.color === 1,
    bg_green: data.color === 2,
  };
};

export default function MFGLiveFlexoPrinting(props) {
  const op = useRef(null);
  const { printTechnologyData } = props;

  const dispatch = useDispatch();
  const [jobId, setJobId] = useState('');
  const [checkedAssignedRoll, setCheckedAssignedRoll] = useState();
  const [changeRollDate, setChangeRollDate] = useState(new Date());
  const [storePrintedRoll, setStorePrintedRoll] = useState([]);
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);
  const [printingTableModal, setPrintingTableModal] = useState(false);
  const [machineCounterModal, setMachineCounterModal] = useState({
    isView: false,
    id: '',
  });
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [whatsappData, setWhatsappData] = useState({});

  // const [rollFilterToggle, setRollFilterToggle] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [assignedRoll, setAssignedRoll] = useState([]);
  const [batchEntryList, setBatchEntryList] = useState([]);
  const [imgCaptureModal, setImgCaptureModal] = useState(false);
  const batchEntryData = {
    print_by: '',
    batch_no: '',
    qty: 0,
    date: '',
  };
  const { listFilter } = useSelector(({ parties }) => parties);
  const { factoryLocationList, activeMachineTypeList, activeBagTypeList } =
    useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { viewProductDetailData } = useSelector(({ product }) => product);
  const { settingsCRUDLoading } = useSelector(({ settings }) => settings);

  const { print_field_filter, blank_print_field_filter } = allCommon?.mfgLive;

  const { mfgListFlexoParam, print_technology, machine, print } =
    allFilters?.mfgLiveFlexo;
  const { mfgFlexoPrint } = allCommon?.mfgLiveFlexo;
  const {
    mfgFlexoPrintFilter,
    mfgFlexoPrintPrintingFilter,
    suggestedFilterToggle,
    tabelFilterToggle,
    assignedFilterToggle,
  } = mfgFlexoPrint;

  const {
    cylinderActiveTabIndex,
    dates,
    factory,
    completed,
    currentPage,
    pageLimit,
    searchQuery,
    applied,
    filters,
    selectedItemIndex,
  } = mfgListFlexoParam;
  const {
    listMFGProcess,
    // mfgProcessPrintingById,
    countMFGfProcess,
    listOperator,
    viewPrintingMachineCountList,
    mfgLiveOperatorLoading,
  } = useSelector(({ mfgliveOperator }) => mfgliveOperator);

  const {
    mfgLiveLoading,
    suggestedRollList,
    allSuggestedRollList,
    printingData,
    mfgProcessPrintingById,
  } = useSelector(({ mfgLive }) => mfgLive);

  const tableRef = useRef();

  // const checkPrintFilterValues = Object.values(print_field_filter).every(
  //   arr => Array.isArray(arr) && arr.length > 0,
  // );

  const loadRequiredData = useCallback(() => {
    dispatch(getCylinderSizeLists(printTechnologyData?._id));
    dispatch(getFactoryLocationList());
    dispatch(getMfgLivePrintingFilterList());
    dispatch(
      getListFilter({
        module_name: 'mfg_operator_flexo',
      }),
    );
    dispatch(getActiveBagTypeList());
  }, [dispatch, printTechnologyData]);

  useEffect(() => {
    loadRequiredData();
  }, [loadRequiredData]);

  const handleCylinderChange = (index, value) => {
    let val = value === 'All' ? 0 : value;
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListFlexoParam: {
            ...allFilters?.mfgLiveFlexo.mfgListFlexoParam,
            cylinderActiveTabIndex: index,
            cylinder: val,
          },
        },
      }),
    );

    dispatch(
      MFGfProcessLists({
        ...mfgListFlexoParam,
        print_technology: print_technology,
        print: print,
        machine: machine,
        cylinder: val,
      }),
    );
  };

  // useEffect(() => {
  //   if (
  //     Object.entries(mfgProcessPrintingById).length > 0 &&
  //     suggestedRollList?.length > 0
  //   ) {
  //     let filteredData = suggestedRollList?.filter(x =>
  //       mfgProcessPrintingById?.roll_printed?.includes(x?._id),
  //     );
  //     dispatch(
  //       setprintingData({
  //         ...printingData,
  //         completed: mfgProcessPrintingById?.completed === true ? 1 : 0,
  //         partial: mfgProcessPrintingById?.partial === true ? 1 : 0,
  //         pending_bag: mfgProcessPrintingById?.pending_bag,
  //         print_technology_id: mfgProcessPrintingById?.print_technology_id,
  //         product_id: mfgProcessPrintingById?.product_id,
  //         machine_id: mfgProcessPrintingById?.machine_id,
  //       }),
  //     );
  //     setAssignedRoll(filteredData);
  //     setCheckedAssignedRoll(filteredData);
  //     setStorePrintedRoll(mfgProcessPrintingById?.roll_printed_date);
  //   }
  // }, [mfgProcessPrintingById, suggestedRollList, dispatch]);

  useEffect(() => {
    if (
      Object.entries(mfgProcessPrintingById).length > 0 &&
      allSuggestedRollList?.length > 0
    ) {
      // ** updated assigne Printed Rolls **//
      const rollPrintedData = allSuggestedRollList
        ?.filter(x => mfgProcessPrintingById?.roll_printed?.includes(x?._id))
        ?.map(x => {
          const dateObject = mfgProcessPrintingById?.roll_printed_date?.find(
            item => item?.roll?.includes(x?._id),
          );

          return {
            ...x,
            selected_date: dateObject?.date || '',
            print_technology_name: mfgProcessPrintingById?.print_technology,
          };
        });

      const otherRollData = allSuggestedRollList
        ?.filter(suggestedRoll => {
          const res = mfgProcessPrintingById?.other_roll?.some(otherRoll =>
            otherRoll?.roll_printed?.includes(suggestedRoll?._id),
          );
          if (res) {
            return res;
          }
        })
        .map(item => {
          const otherRollObject = mfgProcessPrintingById?.other_roll?.find(
            item1 => item1?.roll_printed?.includes(item?._id),
          );

          return {
            ...item,
            is_cancelled: false,
            print_technology_name: otherRollObject?.print_technology,
          };
        });

      const combinedPrintedRollsData = [...rollPrintedData, ...otherRollData];

      dispatch(
        setprintingData({
          ...printingData,
          // completed: mfgProcessPrintingById?.completed === true ? 1 : 0,
          // partial: mfgProcessPrintingById?.partial === true ? 1 : 0,
          ...(mfgProcessPrintingById?.hasOwnProperty('completed') && {
            completed: mfgProcessPrintingById?.completed === true ? 1 : 0,
          }),
          ...(mfgProcessPrintingById?.hasOwnProperty('partial') && {
            partial: mfgProcessPrintingById?.partial === true ? 1 : 0,
          }),
          // pending_bag: mfgProcessPrintingById?.pending_bag,
          print_technology_id: mfgProcessPrintingById?.print_technology_id,
          product_id: mfgProcessPrintingById?.product_id,
          // machine_id: mfgProcessPrintingById?.machine_id,
        }),
      );

      let assignData = [...combinedPrintedRollsData];
      if (assignedRoll?.length > 0) {
        assignData = [...assignedRoll];
      }

      // setCheckedAssignedRoll(rollPrintedData);
      // setSuggestedRollData(updatedSuggestedData);
      // setStorePrintedRoll(mfgProcessPrintingById?.roll_printed_date);
      setAssignedRoll(assignData);
      dispatch(setAssignedRollList(assignData));
    }
  }, [mfgProcessPrintingById, allSuggestedRollList, dispatch]);

  useEffect(() => {
    if (viewPrintingMachineCountList?.length > 0) {
      let list = viewPrintingMachineCountList?.map(d => {
        return {
          print_by: d?.print_by,
          batch_no: d?.batch_no,
          qty: d?.qty,
          date: new Date(d?.date),
          id: Math.floor(Math.random() * 100),
        };
      });
      setBatchEntryList(list);
    }
  }, [viewPrintingMachineCountList]);

  const representativesItemTemplate = option => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{option}</span>
      </div>
    );
  };

  const statusRowFilterTemplate = options => {
    return (
      <div className="form_group">
        <Dropdown
          value={options.value}
          options={['YES', 'NO', 'PART']}
          itemTemplate={representativesItemTemplate}
          onChange={e => {
            options.filterApplyCallback(e.value);
          }}
          showClear={options.value}
          placeholder=""
          className="p-column-filter select_filter mfg-operator-droopdown-none"
        />
      </div>
    );
  };

  const footerContentR2R = (
    <>
      <div className="mt-2 d-flex justify-content-end">
        <Button
          className="btn_border me-2"
          onClick={() => {
            dispatch(
              setAllCommon({
                ...allCommon,
                mfgLive: {
                  ...allCommon?.mfgLive,
                  print_field_filter: blank_print_field_filter,
                },
                mfgLiveFlexo: {
                  ...allCommon?.mfgLiveFlexo,
                  mfgFlexoPrint: {
                    ...allCommon?.mfgLiveFlexo?.mfgFlexoPrint,
                    assignedFilterToggle: false,
                    suggestedFilterToggle: false,
                  },
                },
              }),
            );
            dispatch(setViewProductDetailData({}));
            setAssignedRoll([]);
            dispatch(setAssignedRollList([]));
            setStorePrintedRoll([]);
            setCheckedAssignedRoll([]);
            dispatch(setSuggestedRollList([]));
            setPrintingTableModal(false);
            dispatch(setClearPrintingData());
          }}
        >
          Cancel
        </Button>
        <Button
          className="btn_primary"
          onClick={() => {
            // if (!assignedRoll?.length) {
            //   toast.error('Select at-least one roll to save the details!');
            // } else {

            let rollId = [];
            let rollPrintedDateData = [];
            let updatedPrintedRoll = [];

            if (assignedRoll?.length > 0) {
              updatedPrintedRoll = assignedRoll?.filter(x => x?.is_cancelled);
            }

            if (updatedPrintedRoll?.length > 0) {
              //** store all assigned printed roll IDs: **//
              // updatedPrintedRoll?.forEach(x => rollId.push(x?._id));

              updatedPrintedRoll?.forEach(x => {
                rollId.push(x?._id);
                const dateIndex = rollPrintedDateData?.findIndex(
                  roll => roll?.date === x?.selected_date,
                );

                if (dateIndex !== -1) {
                  rollPrintedDateData[dateIndex].roll.push(x._id);
                } else {
                  rollPrintedDateData.push({
                    date: x.selected_date,
                    roll: [x._id],
                  });
                }
              });
            }

            const newObj = {
              ...printingData,
              pending_bag: Number(printingData?.pending_bag),
              roll_printed: rollId,
              roll_printed_date: rollPrintedDateData,
            };

            const response = dispatch(updatePrintStatus(newObj));
            if (response) {
              setPrintingTableModal(false);
              dispatch(
                setAllCommon({
                  ...allCommon,
                  mfgLive: {
                    ...allCommon?.mfgLive,
                    print_field_filter: blank_print_field_filter,
                  },
                  mfgLiveFlexo: {
                    ...allCommon?.mfgLiveFlexo,
                    mfgFlexoPrint: {
                      ...allCommon?.mfgLiveFlexo?.mfgFlexoPrint,
                      assignedFilterToggle: false,
                      suggestedFilterToggle: false,
                    },
                  },
                }),
              );
              dispatch(setViewProductDetailData({}));
              setAssignedRoll([]);
              dispatch(setAssignedRollList([]));
              setStorePrintedRoll([]);
              setCheckedAssignedRoll([]);
              // setSuggestedRollData([]);
              dispatch(setSuggestedRollList([]));
              dispatch(setClearPrintingData());

              dispatch(
                MFGfProcessLists({
                  ...mfgListFlexoParam,
                  print_technology: print_technology,
                  print: print,
                  machine: machine,
                }),
              );
            }
            //   }
            // }
          }}
        >
          Save
        </Button>
      </div>
    </>
  );

  const handleChangeTableData = (e, option, key) => {
    let list = [...batchEntryList];
    const index = list?.findIndex(x => x?.id === option?.id);
    const oldObj = list[index];
    const updatedObj = {
      ...oldObj,
      [key]: e,
    };
    if (index >= 0) list[index] = updatedObj;
    setBatchEntryList(list);
  };

  const handleDelete = useCallback(
    data => {
      if (data) {
        const list = batchEntryList?.filter(i => i?.id !== data?.id);
        setBatchEntryList(list);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, batchEntryList],
  );

  const actionDeleteTemplate = data => {
    return (
      <ul className="d-flex">
        <li>
          <Button className="btn_transperant">
            <img src={TrashIcon} alt="" onClick={() => handleDelete(data)} />
          </Button>
        </li>
      </ul>
    );
  };

  const customNoColumn = (data, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
  };

  const printTechnology = (data, index) => {
    return <p>{data?.print_technology_name}</p>;
  };

  // const customBatchNo = (data, index) => {
  //   // let batchNo = index?.rowIndex + 1 ? `B-0${index?.rowIndex + 1}` : '-';
  //   // return (
  //   //   <span>{index?.rowIndex + 1 ? `B-0${index?.rowIndex + 1}` : '-'}</span>
  //   // );
  //   return (
  //     <InputText
  //       placeholder="0"
  //       type="number"
  //       name="batch_no"
  //       value={data?.batch_no}
  //       onChange={e => {
  //         handleChangeTableData(e.target.value, data, 'batch_no');
  //       }}
  //     />
  //   );
  // };

  const dateTemplate = data => {
    return (
      <div className="form_group date_select_wrapper custom_calender">
        <Calendar
          id="ConsumptionDate"
          name="date"
          value={data?.date}
          placeholder="Select Date Range"
          showIcon
          showButtonBar
          maxDate={new Date()}
          dateFormat="dd-mm-yy"
          readOnlyInput
          onChange={e => {
            const utcDate = new Date(e.value);
            handleChangeTableData(utcDate, data, 'date');
          }}
        />
      </div>
    );
  };

  const qtyTemplate = data => {
    return (
      <InputNumber
        placeholder=""
        value={data?.qty}
        name="qty"
        useGrouping={false}
        onChange={e => {
          handleChangeTableData(e.value, data, 'qty');
        }}
      />
    );
  };

  const handleDeletePrintedRoll = item => {
    const filteredAssignedData = assignedRoll?.filter(
      assign => assign?.is_cancelled === true && assign?._id !== item?._id,
    );

    const isCancelledData = assignedRoll?.filter(i => !i?.is_cancelled);

    const indexToInsert = allSuggestedRollList?.findIndex(
      suggest => suggest?._id === item._id,
    );

    // If the index is found, insert the removable object from suggestedRollList at that position
    if (indexToInsert !== -1) {
      const newArray = [...suggestedRollList];
      newArray?.splice(indexToInsert, 0, item);
      dispatch(setSuggestedRollList(newArray));
    }
    setAssignedRoll([...isCancelledData, ...filteredAssignedData]);
    dispatch(
      setAssignedRollList([...isCancelledData, ...filteredAssignedData]),
    );
  };

  const assignActionTemplate = rowItem => {
    return rowItem?.is_cancelled ? (
      <Button className="btn_transperant">
        <img
          src={TrashIcon}
          alt=""
          onClick={() => handleDeletePrintedRoll(rowItem)}
        />
      </Button>
    ) : (
      ''
    );
  };

  const handleCheckboxTemplate = data => {
    setCheckedAssignedRoll(data);
  };

  // const handleAddRolls = e => {
  //   const selectedDate = getFormattedDate(new Date(changeRollDate));
  //   const updatedStorePrintedRoll = [...storePrintedRoll];
  //   let dateFormateRolldata = {
  //     date: selectedDate,
  //     roll: [],
  //   };

  //   const diffCheckAndAssignData = checkedAssignedRoll.filter(
  //     itemB => !assignedRoll?.some(itemA => itemA._id === itemB._id),
  //   );

  //   const selectedButDateChangeData =
  //     diffCheckAndAssignData?.length === 0 &&
  //     !storePrintedRoll?.some(itemA => itemA.date === selectedDate);

  //   const checkAssigneAndSuggested = checkedAssignedRoll.filter(itemA =>
  //     assignedRoll.some(itemB => itemB._id === itemA._id),
  //   );

  //   if (
  //     checkAssigneAndSuggested?.length === 0 &&
  //     diffCheckAndAssignData?.length > 0
  //   ) {
  //     checkedAssignedRoll.forEach(item => {
  //       dateFormateRolldata.roll.push(item._id);
  //     });
  //     setStorePrintedRoll([dateFormateRolldata]);
  //   }

  //   if (
  //     diffCheckAndAssignData?.length > 0 &&
  //     checkAssigneAndSuggested?.length > 0
  //   ) {
  //     diffCheckAndAssignData.forEach(data => {
  //       let found = false;
  //       updatedStorePrintedRoll.forEach((item, index) => {
  //         if (item?.date === selectedDate) {
  //           const updatedItem = { ...item, roll: [...item.roll, data._id] };
  //           updatedStorePrintedRoll[index] = updatedItem;
  //           // item?.roll?.push(data._id);
  //           // storePrintedRoll[index] = i;
  //           found = true;
  //         }
  //       });
  //       if (!found) {
  //         dateFormateRolldata.roll.push(data._id);
  //       }
  //     });

  //     if (dateFormateRolldata.roll.length > 0) {
  //       setStorePrintedRoll([...updatedStorePrintedRoll, dateFormateRolldata]);
  //     } else {
  //       setStorePrintedRoll([...updatedStorePrintedRoll]);
  //     }
  //   } else if (selectedButDateChangeData) {
  //     checkedAssignedRoll.forEach(item => {
  //       dateFormateRolldata.roll.push(item._id);
  //     });
  //     if (dateFormateRolldata.roll?.length > 0) {
  //       setStorePrintedRoll([dateFormateRolldata]);
  //     } else {
  //       setStorePrintedRoll([]);
  //     }
  //   }
  //   setAssignedRoll(checkedAssignedRoll);
  // };

  const handleAddRolls = e => {
    const selectedDate = getFormattedDate(new Date(changeRollDate));

    // ** add selected_date field to checked (assignedRoll) data **//
    const modifyCheckedData = checkedAssignedRoll?.map(checked => {
      return {
        ...checked,
        selected_date: selectedDate,
      };
    });

    // ** remove suggested roll data when add data in printed roll **//
    const removeSuggestedRoll = suggestedRollList?.filter(suggested => {
      return !checkedAssignedRoll?.some(
        checked => checked?._id === suggested?._id,
      );
    });

    dispatch(setSuggestedRollList(removeSuggestedRoll));
    setAssignedRoll([...assignedRoll, ...modifyCheckedData]);
    dispatch(setAssignedRollList([...assignedRoll, ...modifyCheckedData]));
    setCheckedAssignedRoll();
  };

  const FactoryLocationHandleChange = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListFlexoParam: {
            ...allFilters?.mfgLiveFlexo.mfgListFlexoParam,
            factory: e.target.value,
          },
        },
      }),
    );
    dispatch(
      MFGfProcessLists({
        ...mfgListFlexoParam,
        factory: e.target.value,
        print_technology: print_technology,
        print: print,
        machine: machine,
      }),
    );
  };
  const handleCompletedChange = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListFlexoParam: {
            ...allFilters?.mfgLiveFlexo.mfgListFlexoParam,
            completed: e === true ? 1 : 0,
          },
        },
      }),
    );
    dispatch(
      MFGfProcessLists({
        ...mfgListFlexoParam,
        completed: e === true ? 1 : 0,
        print_technology: print_technology,
        print: print,
        machine: machine,
      }),
    );
  };

  const loadTableData = selectedDate => {
    dispatch(
      MFGfProcessLists({
        ...mfgListFlexoParam,
        dates: selectedDate,
        print_technology: print_technology,
        print: print,
        machine: machine,
      }),
    );
  };

  const dateHandleChange = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListFlexoParam: {
            ...allFilters?.mfgLiveFlexo.mfgListFlexoParam,
            dates: e,
          },
        },
      }),
    );

    // dispatch(
    //   MFGfProcessLists({
    //     ...mfgListFlexoParam,
    //     dates: e.value,
    //     print_technology: print_technology,
    //     print: print,
    //     machine: machine,
    //   }),
    // );
    loadTableData(e);
  };

  // const machineSelectHandleChange = e => {
  //   dispatch(
  //     setprintingData({
  //       ...printingData,
  //       machine_id: e,
  //     }),
  //   );
  // };

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListFlexoParam: {
              ...mfgListFlexoParam,
              currentPage: pageIndex,
            },
          },
        }),
      );

      dispatch(
        MFGfProcessLists({
          ...mfgListFlexoParam,
          print_technology: print_technology,
          print: print,
          machine: machine,
          currentPage: pageIndex,
        }),
      );
    },
    [
      currentPage,
      dispatch,
      allFilters,
      mfgListFlexoParam,
      print_technology,
      print,
      machine,
    ],
  );
  const onPageRowsChange = useCallback(
    page => {
      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListFlexoParam: {
              ...mfgListFlexoParam,
              currentPage: page === 0 ? 0 : 1,
              pageLimit: page,
            },
          },
        }),
      );

      dispatch(
        MFGfProcessLists({
          ...mfgListFlexoParam,
          print_technology: print_technology,
          print: print,
          machine: machine,
          currentPage: page === 0 ? 0 : 1,
          pageLimit: page,
        }),
      );
    },
    [allFilters, dispatch, machine, mfgListFlexoParam, print, print_technology],
  );

  const rollTemplate = data => {
    return (
      <>
        <div className="add_package_wrap">
          <span
            className="icon"
            onClick={async e => {
              setPrintingTableModal(true);
              setJobId(data);
              setAssignedRoll([]);
              dispatch(setAssignedRollList([]));
              setStorePrintedRoll([]);
              setChangeRollDate(new Date());

              dispatch(getProductDetailById(data?.product_id));

              const printing_res = await dispatch(
                viewMfgProcessPrintingById(print_technology, data?._id),
              );
              dispatch(
                setprintingData({
                  ...printingData,
                  print_technology_id: print_technology,
                  process_id: data?._id,
                  product_id: data?.product_id,
                  pending_bag: printing_res.hasOwnProperty('pending_bag')
                    ? printing_res?.pending_bag
                    : data?.quantity,
                }),
              );

              const hasNotEmptyArray = Object.values(print_field_filter).some(
                property => {
                  return property.length > 0;
                },
              );

              dispatch(
                getSuggestedRollList(
                  data?.job_id,
                  print_technology,
                  ...(hasNotEmptyArray ? [print_field_filter] : []),
                ),
              );

              // if (
              //   response?.roll_printed?.length > 0 ||
              //   (res?.data?.length === 0 && response?.roll_printed?.length > 0)
              // ) {
              //   dispatch(getSuggestedRollList(data?.job_id, print_technology));
              // }

              // setViewProductDetailData
              dispatch(getActiveMachineTypeList());
            }}
          >
            <img src={PlusIcon} alt="" />
          </span>
          <span>
            {data?.print_detail?.roll_printed?.length
              ? data?.print_detail?.roll_printed?.length
              : '0'}
          </span>
        </div>
      </>
    );
  };

  const counterTemplate = data => {
    return (
      <div className="add_package_wrap">
        <span
          className="icon"
          onClick={e => {
            setMachineCounterModal({
              isView: true,
              id: data?._id,
            });
            setBatchEntryList([]);
            dispatch(getListOperator());
            dispatch(viewPrintingMachineCount(data?._id, print_technology));
          }}
        >
          <img src={PlusIcon} alt="" />
        </span>
        <span>{data?.printing_batch_machine_count}</span>
      </div>
    );
  };

  // ** // For Photo Capture:
  const captureTemplate = rowItem => {
    return (
      <Button
        className="btn_transperant"
        onClick={() => {
          setWhatsappData(rowItem);
          setImgCaptureModal(true);
        }}
      >
        <img src={Camera} alt="" />
      </Button>
    );
  };

  const footerContent = (
    <>
      <div className="mt-2 d-flex justify-content-end">
        <Button
          className="btn_border me-2"
          onClick={() => {
            setMachineCounterModal({
              isView: false,
              id: '',
            });
            setBatchEntryList([]);
          }}
        >
          Cancel
        </Button>
        <Button
          className="btn_primary"
          onClick={async e => {
            const isEmptyValuePresent = batchEntryList.some(
              obj => obj.print_by === '' || obj.batch_no === '' || obj.qty <= 0,
            );

            if (!isEmptyValuePresent) {
              let newObj = {
                mfg_printing_batch: batchEntryList,
                process_id: machineCounterModal?.id,
                print_technology_id: print_technology,
              };
              let res = await dispatch(updateMachineCount(newObj));
              if (res) {
                dispatch(
                  MFGfProcessLists({
                    ...mfgListFlexoParam,
                    print_technology: print_technology,
                    print: print,
                    machine: machine,
                  }),
                );
                setMachineCounterModal({
                  isView: false,
                  id: '',
                });
                setBatchEntryList([]);
              }
            } else {
              toast.error('Please complete all required fields with data.');
            }
          }}
        >
          Save
        </Button>
      </div>
    </>
  );

  const printedTemplate = data => {
    return (
      <ReactSelectSingle
        TakeAction
        value={data?.print_by}
        options={listOperator}
        onChange={e => {
          handleChangeTableData(e.target.value, data, 'print_by');
        }}
        placeholder="Select"
      />
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
        module_name: 'mfg_operator_flexo',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'mfg_operator_flexo',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'mfg_operator_flexo',
        }),
      );
      op.current?.hide();
    }

    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              mfgListFlexoParam: {
                ...mfgListFlexoParam,
                applied: {},
                filters: [],
                selectedItemIndex: '',
                currentPage: 1,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListFlexoParam,
            searchQuery,
            applied: {},
            filters: [],
            print_technology: print_technology,
            print: print,
            machine: machine,
          }),
        );
      } else {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              mfgListFlexoParam: {
                ...mfgListFlexoParam,
                filters: [],
                selectedItemIndex: '',
                currentPage: 1,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListFlexoParam,
            currentPage: 1,
            print_technology: print_technology,
            print: print,
            machine: machine,
          }),
        );
      }

      if (isEdit) {
        setIsEdit(false);
      }
      op.current?.hide();
    },
    [allFilters, dispatch, isEdit, applied, print, print_technology, machine],
  );

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
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListFlexoParam: {
            ...mfgListFlexoParam,
            filters: updatedFilters,
          },
        },
      }),
    );
  };

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListFlexoParam: {
              ...mfgListFlexoParam,
              ...(updatedFilters?.length === 0 &&
                Object.keys(allFilters.mfgLiveFlexo?.mfgListFlexoParam?.applied)
                  ?.length !== 0 && {
                  applied: {},
                }),
              filters: [...updatedFilters],
              selectedItemIndex:
                updatedFilters?.length === 0 &&
                allFilters.mfgLiveFlexo?.mfgListFlexoParam
                  ?.selectedItemIndex !== ''
                  ? ''
                  : allFilters.mfgLiveFlexo?.mfgListFlexoParam
                      ?.selectedItemIndex,
            },
          },
        }),
      );

      if (
        updatedFilters?.length === 0 &&
        Object.keys(allFilters.mfgLiveFlexo?.mfgListFlexoParam?.applied)
          ?.length > 0
      ) {
        dispatch(
          MFGfProcessLists({
            ...mfgListFlexoParam,
            searchQuery,
            currentPage: 1,
            applied: {},
            print_technology: print_technology,
            print: print,
            machine: machine,
          }),
        );
      }

      if (updatedFilters?.length === 0 && isEdit === true) {
        setIsEdit(false);
        setNameFilter('');
      }

      // dispatch(
      //   MFGfProcessLists({
      //     ...mfgListFlexoParam,
      //     print_technology: print_technology,
      //     print: print,
      //     machine: machine,
      //     cylinder: cylinder,
      //     filter: {},
      //   }),
      // );
    },
    [filters, dispatch, allFilters, isEdit],
  );

  const handleAddFilter = () => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListFlexoParam: {
            ...mfgListFlexoParam,
            filters: [
              ...allFilters?.mfgLiveFlexo?.mfgListFlexoParam?.filters,
              { filter: '', value: '' },
            ],
          },
        },
      }),
    );
  };

  const handleFilterEdit = (data, index) => {
    const updatedFilterData = {
      ...data,
      filter_list: data?.filter_list?.map(item => {
        const findObj = MFGLiveFlexoFilterDetails?.find(
          obj => obj?.value === item?.filter && obj?.type === 'dropDown',
        );

        const checkDropDownList = ['str_rcv', 'old_stereo']?.includes(
          findObj?.value,
        );

        if (findObj) {
          if (findObj?.value === 'roll_available') {
            const updatedValues = item?.value?.split(', ')?.map(value1 => {
              let values = value1;
              switch (value1) {
                case '1':
                  values = 1;
                  break;
                case '2':
                  values = 2;
                  break;
                default:
                  values = 0;
              }
              return values;
            });
            return { ...item, value: updatedValues };
          } else if (checkDropDownList) {
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
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListFlexoParam: {
            ...mfgListFlexoParam,
            filters: updatedFilterData?.filter_list,
            selectedItemIndex: index,
          },
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
        module_name: 'mfg_operator_flexo',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListFlexoParam: {
              ...mfgListFlexoParam,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          },
        }),
      );
      dispatch(
        getListFilter({
          module_name: 'mfg_operator_flexo',
        }),
      );

      setNameFilter('');
      op.current?.hide();
      // }
    }
  };

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
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListFlexoParam: {
              ...mfgListFlexoParam,
              applied: filterObj,
              currentPage: 1,
            },
          },
        }),
        dispatch(
          MFGfProcessLists({
            ...mfgListFlexoParam,
            currentPage: 1,
            applied: filterObj,
            print_technology: print_technology,
            print: print,
            machine: machine,
          }),
        ),
      );
    }
  }, [filters, dispatch, allFilters, mfgListFlexoParam, searchQuery]);

  const selectedFilters = filters?.map(filter => {
    const filterDetail = MFGLiveFlexoFilterDetails?.find(
      detail => detail.value === filter.filter,
    );
    return filterDetail ? filterDetail : null;
  });

  const filterOption = useMemo(() => {
    let flterOptionArray = [...MFGLiveFlexoFilterDetails];

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
      bag_type_id: activeBagTypeList,
      roll_available: rollOption,
      old_stereo: commonStatusObj,
      str_rcv: statusObj,
    };
  }, [activeBagTypeList]);

  const handleSearchInput = (
    e,
    mfgListFlexoParam,
    print_technology,
    machine,
    print,
  ) => {
    dispatch(
      MFGfProcessLists({
        ...mfgListFlexoParam,
        searchQuery: e.target.value,
        currentPage: 1,
        print_technology: print_technology,
        print: print,
        machine: machine,
      }),
    );
  };

  const debouncehandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {/* {mfgLiveLoading && <Loader />} */}
      {settingsCRUDLoading && <Loader />}
      <div className="flexo_printing_wrap screen_printing mb-3">
        <Cylinder
          // setAllFilters={setAllFilters}
          cylinderActiveTabIndex={cylinderActiveTabIndex}
          handleCylinderChange={handleCylinderChange}
        />
        <div className="table_main_Wrapper bg-white">
          <CommonHeader
            headerName="MFG Live"
            searchSateName="mfgLiveFlexo"
            searchInnerSateName="mfgListFlexoParam"
            op={op}
            dates={dates}
            searchQuery={searchQuery}
            factory={factory}
            factoryLocationList={factoryLocationList}
            dateHandleChange={dateHandleChange}
            loadTableData={loadTableData}
            FactoryLocationHandleChange={FactoryLocationHandleChange}
            tableRef={tableRef}
            completed={completed}
            handleCompletedChange={handleCompletedChange}
            debouncehandleSearchInput={debouncehandleSearchInput}
            mfgListParam={mfgListFlexoParam}
            applied={applied}
          />

          <div className="data_table_wrapper with_colspan_head cell_padding_small is_filter break_header">
            <button
              type="button"
              className="table_filter_btn"
              // onClick={() => setFilterToggle(!filterToggle)}
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLiveFlexo: {
                      ...allCommon?.mfgLiveFlexo,
                      mfgFlexoPrint: {
                        ...allCommon?.mfgLiveFlexo?.mfgFlexoPrint,
                        tabelFilterToggle: !tabelFilterToggle,
                      },
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={listMFGProcess}
              sortMode="single"
              sortField="name"
              sortOrder={1}
              rows={10}
              filterDisplay="row"
              dataKey="_id"
              selection={selectedProducts}
              onSelectionChange={e => setSelectedProducts(e.value)}
              rowClassName={bg_bolor}
              ref={tableRef}
              emptyMessage={mfgLiveOperatorLoading && <Skeleton count={9} />}
              filters={mfgFlexoPrintFilter}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLiveFlexo: {
                      ...allCommon?.mfgLiveFlexo,
                      mfgFlexoPrint: {
                        ...allCommon?.mfgLiveFlexo.mfgFlexoPrint,
                        mfgFlexoPrintFilter: event?.filters,
                      },
                    },
                  }),
                );
              }}
            >
              <Column
                field="job_date"
                header="Job Date"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="days"
                header="Day"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="main_image"
                header="Image"
                body={imageTemplate}
              ></Column>
              <Column
                field="design"
                header="Design Name"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="size"
                header="Size"
                sortable
                filter={tabelFilterToggle}
                body={mainTableSizeTemplate}
              ></Column>
              <Column
                field="roll_width"
                header="Roll Width"
                sortable
                filter={tabelFilterToggle}
                body={mainTableRollWidthTemplate}
              ></Column>
              <Column
                field="gsm"
                header="GSM"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="bag_type"
                header="Bag Type"
                sortable
                filter={tabelFilterToggle}
                body={bagTypeTemplate}
              ></Column>
              <Column
                field="fabric_color"
                header="Fabric Color"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="handle_color"
                header="Handle Color"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="qty"
                header="Quantity"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="roll_available"
                header="ROLL"
                sortable
                filter={tabelFilterToggle}
                showFilterMenu={false}
                body={e => rollBodyTemplate(e?.roll_available)}
                filterElement={e => statusRowFilterTemplate(e)}
              ></Column>
              <Column
                field="block"
                header="Stereo"
                sortable
                filter={tabelFilterToggle}
                body={e => blockBodyTemplate(e?.old_stereo)}
              ></Column>
              <Column
                field="str_rcv_str"
                header="STR RCV"
                sortable
                filter={tabelFilterToggle}
                body={e => strRcvTemplate(e?.str_rcv)}
                style={{ zIndex: '10' }}
                frozen
              ></Column>
              <Column
                field="notification_to_print"
                header="Notification To Print"
                sortable
                filter={tabelFilterToggle}
                body={e => notificationBodyTemplate(e?.notification_to_print)}
              ></Column>
              <Column
                field="text_to_print"
                header="Print PhoneNo."
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="total_roll"
                header="Add Rolls"
                filter={tabelFilterToggle}
                body={rollTemplate}
              ></Column>
              <Column
                field="machineCounter"
                header="Machine Counter"
                filter={tabelFilterToggle}
                body={counterTemplate}
              ></Column>
              {/* For Photo Capture */}
              {isMobileDevice() && (
                <Column
                  field="capture"
                  header="Capture"
                  sortable
                  filter={tabelFilterToggle}
                  body={captureTemplate}
                ></Column>
              )}
              <Column
                field="comment"
                header="Comment"
                filter={tabelFilterToggle}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={listMFGProcess}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={countMFGfProcess}
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
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
            />
          </div>
          <Button className="btn_primary" onClick={handleSaveFilter}>
            {isEdit ? 'Update Filter' : 'Save Filter'}
          </Button>
        </Dialog>
        <Dialog
          header="Printing"
          visible={printingTableModal}
          draggable={false}
          className="modal_Wrapper model_extra_large"
          onHide={() => {
            dispatch(setViewProductDetailData({}));
            setAssignedRoll([]);
            dispatch(setAssignedRollList([]));
            setPrintingTableModal(false);
            dispatch(setClearPrintingData());
            dispatch(
              setAllCommon({
                ...allCommon,
                mfgLiveFlexo: {
                  ...allCommon?.mfgLiveFlexo,
                  mfgFlexoPrint: {
                    ...allCommon?.mfgLiveFlexo?.mfgFlexoPrint,
                    assignedFilterToggle: false,
                    suggestedFilterToggle: false,
                  },
                },
              }),
            );
          }}
          footer={footerContentR2R}
        >
          <div className="printing_content_wrap">
            <MFGOperatorPrintingFilter
              jobId={jobId}
              printTechnologyId={print_technology}
            />

            {/* <div className="printing_content_top">
              <Row className="align-items-center">
                <Col md={4}>
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="ingredient1"
                        name="complete"
                        value={printingData?.completed}
                        onChange={e => {
                          dispatch(
                            setprintingData({
                              ...printingData,
                              completed: e.target.checked ? 1 : 0,
                              partial: e.target.checked ? 0 : 1,
                            }),
                          );
                        }}
                        checked={printingData?.completed === 1}
                      />
                      <label htmlFor="ingredient1" className="mx-2">
                        Complete
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="ingredient2"
                        name="partial"
                        value={printingData?.partial}
                        onChange={e => {
                          dispatch(
                            setprintingData({
                              ...printingData,
                              partial: e.target.checked ? 1 : 0,
                              completed: e.target.checked ? 0 : 1,
                            }),
                          );
                        }}
                        checked={printingData?.partial === 1}
                      />
                      <label htmlFor="ingredient2" className="mx-2">
                        Partial
                      </label>
                    </div>
                  </div>
                </Col>
                <Col md={8}>
                  <Row>
                    <Col md={6}>
                      <div className="form_group mb-3">
                        <ReactSelectSingle
                          TakeAction
                          value={printingData?.machine_id}
                          options={activeMachineTypeList}
                          onChange={e => {
                            machineSelectHandleChange(e.target.value);
                          }}
                          placeholder="Select Machine"
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <ul className="pending_bags mb-3">
                        <li>
                          Pending qty of bags to print
                          <span>{printingData?.pending_bag}</span>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div> */}
            <div className="printing_content_middle">
              <Row className="g-2">
                <Col lg={3} className="order-1 order-lg-1">
                  <div className="product_details_left border rounded-3 bg_white p-3 h-100 mb-3">
                    <div className="product_detail_wrap">
                      <h3 className="mb-2">Product Details</h3>
                      <img
                        src={
                          viewProductDetailData?.main_image
                            ? viewProductDetailData?.main_image
                            : DummyImage
                        }
                        alt="ProductImg"
                        className="w-100"
                      />
                      <h4>Bag Size</h4>
                      <h5>{viewProductDetailData?.product_code}</h5>
                      <ul className="rounded_ul">
                        <li>
                          Bag Type: {viewProductDetailData?.bag_type_name}
                        </li>
                        <li>
                          Bag Printing: {viewProductDetailData.print_type_name}
                        </li>
                        <li>
                          Design Name: {viewProductDetailData?.design_name}
                        </li>
                        <li>
                          Bag Weight: {viewProductDetailData?.bag_weight}{' '}
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col lg={9} className="order-4 order-lg-2">
                  <div className="table_main_Wrapper bg-white mb-3">
                    <div className="top_filter_wrap">
                      <h3>Suggested Rolls</h3>
                    </div>
                    <div className="data_table_wrapper cell_padding_large is_filter custom_suggested_mfg">
                      <button
                        type="button"
                        className="table_filter_btn"
                        // onClick={() => setRollFilterToggle(!rollFilterToggle)}
                        onClick={() => {
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              mfgLiveFlexo: {
                                ...allCommon?.mfgLiveFlexo,
                                mfgFlexoPrint: {
                                  ...allCommon?.mfgLiveFlexo?.mfgFlexoPrint,
                                  suggestedFilterToggle: !suggestedFilterToggle,
                                },
                              },
                            }),
                          );
                        }}
                      >
                        <img src={SearchIcon} alt="" />
                      </button>
                      <DataTable
                        value={suggestedRollList}
                        sortMode="single"
                        sortField="name"
                        sortOrder={1}
                        rows={10}
                        filterDisplay="row"
                        dataKey="_id"
                        selectionMode="checkbox"
                        selection={checkedAssignedRoll}
                        onSelectionChange={e => handleCheckboxTemplate(e.value)}
                        filters={mfgFlexoPrintPrintingFilter}
                        onFilter={event => {
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              mfgLiveFlexo: {
                                ...allCommon?.mfgLiveFlexo,
                                mfgFlexoPrint: {
                                  ...allCommon?.mfgLiveFlexo.mfgFlexoPrint,
                                  mfgFlexoPrintPrintingFilter: event?.filters,
                                },
                              },
                            }),
                          );
                        }}
                      >
                        <Column
                          selectionMode="multiple"
                          headerStyle={{ width: '2rem' }}
                        ></Column>
                        <Column
                          field="sr_no"
                          header="No"
                          sortable
                          body={customNoColumn}
                        ></Column>
                        <Column
                          field="id_no"
                          header="ID No."
                          sortable
                          filter={suggestedFilterToggle}
                        ></Column>
                        <Column
                          field="color"
                          header="Color"
                          sortable
                          filter={suggestedFilterToggle}
                        ></Column>
                        <Column
                          field="gsm"
                          header="GSM"
                          sortable
                          filter={suggestedFilterToggle}
                        ></Column>
                        <Column
                          field="size"
                          header="Size"
                          sortable
                          body={sizeTemplate}
                          filter={suggestedFilterToggle}
                        ></Column>
                        <Column
                          field="net_weight"
                          header="Net Weight"
                          sortable
                          filter={suggestedFilterToggle}
                        ></Column>
                        <Column
                          field="item_name"
                          header="Item Name"
                          className="product_code suggested_roll"
                          sortable
                          filter={suggestedFilterToggle}
                        ></Column>
                        <Column
                          field="print_technology_name"
                          header="Print Technology"
                          className="product_code suggested_roll"
                          sortable
                          filter={suggestedFilterToggle}
                          body={printTechnology}
                        ></Column>
                        <Column
                          field="lamination"
                          header="Lamination"
                          sortable
                          filter={suggestedFilterToggle}
                        ></Column>
                        <Column
                          field="design_name"
                          header="Design Name"
                          sortable
                          filter={suggestedFilterToggle}
                        ></Column>
                        <Column
                          field="is_slit"
                          header="Split"
                          sortable
                          filter={suggestedFilterToggle}
                          body={slitTemplate}
                        ></Column>
                        <Column
                          field="parent_id"
                          header="Parent"
                          sortable
                          filter={suggestedFilterToggle}
                        ></Column>
                      </DataTable>
                    </div>
                  </div>
                </Col>
                <Col lg={3} className="order-2 order-lg-3">
                  <div className="d-flex flex-wrap gap-3">
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="ingredient1"
                        name="complete"
                        value={printingData?.completed}
                        onChange={e => {
                          dispatch(
                            setprintingData({
                              ...printingData,
                              completed: e.target.checked ? 1 : 0,
                              partial: e.target.checked ? 0 : 1,
                            }),
                          );
                        }}
                        checked={printingData?.completed === 1}
                      />
                      <label htmlFor="ingredient1" className="mx-2">
                        Complete
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="ingredient2"
                        name="partial"
                        value={printingData?.partial}
                        onChange={e => {
                          dispatch(
                            setprintingData({
                              ...printingData,
                              partial: e.target.checked ? 1 : 0,
                              completed: e.target.checked ? 0 : 1,
                            }),
                          );
                        }}
                        checked={printingData?.partial === 1}
                      />
                      <label htmlFor="ingredient2" className="mx-2">
                        Partial
                      </label>
                    </div>
                  </div>
                </Col>
                <Col lg={9} className="order-3 order-lg-4">
                  <ul className="d-flex align-items-center justify-content-start justify-content-lg-end flex-wrap gap-2">
                    {/* <li className="me-2">
                    <div className="form_group">
                      <ReactSelectSingle
                        TakeAction
                        value={printingData?.machine_id}
                        options={activeMachineTypeList}
                        onChange={e => {
                          machineSelectHandleChange(e.target.value);
                        }}
                        placeholder="Select Machine"
                      />
                    </div>
                  </li> */}
                    <li className="me-2">
                      <ul className="pending_bags panding_bags_details">
                        <li>
                          Pending qty of bags to print
                          {/* <span>{printingData?.pending_bag}</span> */}
                          <div className="form_group">
                            {/* <div className="input_wrap"> */}
                            <InputText
                              placeholder="Bags Qty"
                              value={printingData?.pending_bag}
                              onChange={e => {
                                dispatch(
                                  setprintingData({
                                    ...printingData,
                                    pending_bag: e.target.value,
                                  }),
                                );
                              }}
                            />
                            <span>Bags</span>
                          </div>
                        </li>
                      </ul>
                    </li>

                    <li className="me-2">
                      <div className="form_group date_select_wrapper">
                        <Calendar
                          id=" ConsumptionDate"
                          value={changeRollDate}
                          placeholder="Select Date Range"
                          showIcon
                          showButtonBar
                          dateFormat="dd-mm-yy"
                          selectionMode="single"
                          readOnlyInput
                          onChange={e => setChangeRollDate(e.value)}
                        />
                      </div>
                    </li>
                    <li>
                      <div className="text-end">
                        <Button
                          className="btn_primary"
                          onClick={e => handleAddRolls(e)}
                        >
                          Add Rolls
                        </Button>
                      </div>
                    </li>
                  </ul>

                  {/* <div className="d-flex"></div> */}
                </Col>
              </Row>
            </div>

            {/* <Row className="justify-content-between mt-3 align-items-center">
              
            </Row> */}

            <div className="final_print_table mt-3">
              <div className="table_main_Wrapper bg-white">
                <div className="top_filter_wrap">
                  <h3>Printed Rolls</h3>
                </div>
                <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter max_height">
                  <button
                    type="button"
                    className="table_filter_btn"
                    // onClick={() => setFilterToggle(!filterToggle)}
                    onClick={() => {
                      dispatch(
                        setAllCommon({
                          ...allCommon,
                          mfgLiveFlexo: {
                            ...allCommon?.mfgLiveFlexo,
                            mfgFlexoPrint: {
                              ...allCommon?.mfgLiveFlexo?.mfgFlexoPrint,
                              assignedFilterToggle: !assignedFilterToggle,
                            },
                          },
                        }),
                      );
                    }}
                  >
                    <img src={SearchIcon} alt="" />
                  </button>
                  <DataTable
                    value={assignedRoll}
                    sortMode="multiple"
                    sortOrder={1}
                    filterDisplay="row"
                    dataKey="_id"
                    filters={mfgFlexoPrintPrintingFilter}
                    onFilter={event => {
                      dispatch(
                        setAllCommon({
                          ...allCommon,
                          mfgLiveFlexo: {
                            ...allCommon?.mfgLiveFlexo,
                            mfgFlexoPrint: {
                              ...allCommon?.mfgLiveFlexo.mfgFlexoPrint,
                              mfgFlexoPrintPrintingFilter: event?.filters,
                            },
                          },
                        }),
                      );
                    }}
                  >
                    <Column
                      field="sr_no"
                      header="No"
                      sortable
                      body={customNoColumn}
                    ></Column>
                    <Column
                      field="id_no"
                      header="ID No."
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="color"
                      header="Color"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="gsm"
                      header="GSM"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="size"
                      header="Size"
                      sortable
                      body={sizeTemplate}
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="net_weight"
                      header="Net Weight"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="item_name"
                      header="Item Name"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="print_technology_name"
                      header="Print Technology"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="lamination"
                      header="Lamination"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="design_name"
                      header="Design Name"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="is_slit"
                      header="Split"
                      sortable
                      filter={assignedFilterToggle}
                      body={slitTemplate}
                    ></Column>
                    <Column
                      field="parent_id"
                      header="Parent"
                      sortable
                      filter={assignedFilterToggle}
                    ></Column>
                    <Column
                      field="action"
                      body={assignActionTemplate}
                      header="Action"
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog
          header="Machine Counter"
          visible={machineCounterModal?.isView}
          draggable={false}
          className="modal_Wrapper modal_medium"
          onHide={() => {
            setMachineCounterModal({
              isView: false,
              id: '',
            });
            setBatchEntryList([]);
          }}
          footer={footerContent}
        >
          <div className="printing_content_wrap">
            <div className="right_filter_wrapper text-end mb20">
              <ul>
                <li>
                  <Button
                    className="btn_primary"
                    onClick={e => {
                      if (batchEntryList?.length > 0) {
                        const lastObj =
                          batchEntryList[batchEntryList.length - 1];
                        const result = Object.keys(lastObj).filter(value => {
                          return value !== 'id' && lastObj[value]
                            ? lastObj[value]
                            : false;
                        });

                        if (
                          result?.length < 0 ||
                          result?.length === Object.keys(batchEntryData)?.length
                        ) {
                          setBatchEntryList([
                            ...batchEntryList,
                            {
                              ...batchEntryData,
                              date: new Date(),
                              id: Math.floor(Math.random() * 100),
                              batch_no: (
                                batchEntryList?.length + 1
                              )?.toString(),
                            },
                          ]);
                        }
                      } else {
                        setBatchEntryList([
                          ...batchEntryList,
                          {
                            ...batchEntryData,
                            date: new Date(),
                            id: Math.floor(Math.random() * 100),
                            batch_no: (batchEntryList?.length + 1)?.toString(),
                          },
                        ]);
                      }
                    }}
                  >
                    <img src={PlusIcon} alt="" />
                    Add Batch
                  </Button>
                </li>
              </ul>
            </div>
            <div className="table_main_Wrapper bg-white mb-3">
              <div className="data_table_wrapper with_colspan_head cell_padding_large max_height">
                <DataTable
                  value={batchEntryList}
                  sortMode="single"
                  sortField="name"
                  sortOrder={1}
                  rows={10}
                  dataKey="id"
                  selection={selectedProducts}
                  onSelectionChange={e => setSelectedProducts(e.value)}
                >
                  <Column
                    field="batch_no"
                    header="Batch No"
                    sortable
                    filter={filterToggle}
                    // body={customBatchNo}
                  ></Column>
                  <Column
                    field="qty"
                    header="Qty"
                    sortable
                    filter={filterToggle}
                    body={qtyTemplate}
                  ></Column>
                  <Column
                    field="date"
                    header="Date"
                    sortable
                    filter={filterToggle}
                    body={dateTemplate}
                  ></Column>
                  <Column
                    field="print_by"
                    header="Printed By"
                    sortable
                    filter={filterToggle}
                    body={printedTemplate}
                  ></Column>
                  <Column
                    field="action"
                    body={actionDeleteTemplate}
                    header="Action"
                  />
                </DataTable>
              </div>
            </div>
          </div>
        </Dialog>
      </div>

      {/* For Photo Capture */}
      <Dialog
        header="Capture"
        visible={imgCaptureModal}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => {
          setImgCaptureModal(false);
        }}
      >
        <ImageCapture
          whatsappData={whatsappData}
          // whatsappPopup={whatsappPopup}
          // setWhatsappPopup={setWhatsappPopup}
        />
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
