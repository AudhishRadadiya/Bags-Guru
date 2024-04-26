import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import DummyImage from '../../../../Assets/Images/gusset-bag.png';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import EditIcon from '../../../../Assets/Images/edit.svg';
import PlusIcon from '../../../../Assets/Images/plus.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import Camera from '../../../../Assets/Images/camera.svg';
import CheckGreen from '../../../../Assets/Images/check-round-green.svg';
import ReactSelectSingle from '../../../../Components/Common/ReactSelectSingle';
import { Image } from 'primereact/image';
import { Checkbox } from 'primereact/checkbox';
import { useDispatch } from 'react-redux';
import {
  MFGfProcessLists,
  addBagDetailForPrinting,
  getListOperator,
  getListSelectedRoll,
  updateBagMakingMachineCount,
  viewBagMackingMachineDetail,
  viewRollConsumption,
} from 'Services/Production/mfgLiveOperatorServices';
import { useSelector } from 'react-redux';
import { getProductDetailById } from 'Services/Products/ProductService';
import {
  getActiveBagTypeList,
  getActiveLaminationTypeList,
  getActiveMachineTypeList,
  getFactoryLocationList,
  listMachineByMachineType,
} from 'Services/Settings/MiscMasterService';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import CommonHeader from './CommonHeader';
import { Calendar } from 'primereact/calendar';
import FilterOverlay from 'Components/Common/FilterOverlay';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import _ from 'lodash';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';
import { setViewProductDetailData } from 'Store/Reducers/Products/ProductSlice';
import { isMobileDevice } from 'Helper/Common';
import ImageCapture from 'Components/Common/ImageCapture/ImageCapture';
import { setSuggestedRollList } from 'Store/Reducers/Production/mfgLiveOperatorSlice';

const MFGLiveFlexoFilterDetails = [
  { label: 'Job Date', value: 'job_date', type: 'inputBox' },
  { label: 'Day', value: 'days', type: 'inputBox' },
  { label: 'Design Name', value: 'design', type: 'inputBox' },
  { label: 'Size', value: 'size', type: 'inputBox' },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'Bag Type', value: 'bag_type_id', type: 'dropDown' },
  { label: 'Handle Material', value: 'handle_material_name', type: 'inputBox' },
  { label: 'Handle Color', value: 'handle_color', type: 'inputBox' },
  { label: 'Handle Length', value: 'handle_length', type: 'inputBox' },
  // { label: 'Lamination', value: 'is_laminated', type: 'dropDown' },
  {
    label: 'Quantity',
    value: 'qty',
    type: 'inputBox',
  },
  { label: 'Roll Printed', value: 'total_roll', type: 'inputBox' },
  { label: 'Expected Qty', value: 'machine_count', type: 'inputBox' },
  { label: 'Comment', value: 'comment', type: 'inputBox' },
  { label: 'Lamination Type', value: 'lamination_typename', type: 'dropDown' },
];
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

const laminationTypeTemplate = item => {
  return (
    <div>
      {item?.lamination_type_name?.length > 0 ? (
        item?.lamination_type_name?.map(value => {
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

const slitTemplate = () => {
  return <img src={CheckGreen} alt="CheckIocn" />;
};

const bg_bolor = Data => {
  return {
    bg_yellow: Data.color === 1,
    bg_green: Data.color === 2,
  };
};

const commonOption = [
  { label: 'YES', value: true },
  { label: 'NO', value: false },
];

export default function MFGLiveLoop() {
  const dispatch = useDispatch();
  const op = useRef(null);

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);
  const [printingTableModal, setPrintingTableModal] = useState(false);
  const [machineCounterModal, setMachineCounterModal] = useState({
    isView: false,
    id: '',
  });
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [assignedRoll, setAssignedRoll] = useState([]);
  const [printingData, setPrintingData] = useState({
    print_technology_id: '',
    process_id: '',
    machine_id: '',
    completed: 0,
    partial: 1,
    pending_bag: 0,
  });
  const [counterData, setCounterData] = useState({
    machine_id: '',
    completed: 0,
    partial: 1,
  });
  const [rollFilterToggle, setRollFilterToggle] = useState(false);
  const [batchEntryList, setBatchEntryList] = useState([]);
  const batchEntryData = {
    print_by: '',
    batch_no: '',
    qty: 0,
    date: '',
  };
  const [nameFilter, setNameFilter] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [whatsappData, setWhatsappData] = useState({});
  const [imgCaptureModal, setImgCaptureModal] = useState(false);

  const {
    activeMachineTypeList,
    factoryLocationList,
    activeBagTypeList,
    machineListByMachineType,
    activeLaminationTypeList,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { viewProductDetailData } = useSelector(({ product }) => product);
  const { activeTabName, mfgListLoopParam, print_technology, machine, print } =
    allFilters?.mfgLiveFlexo;
  const { mfgLiveLoopHandlePrint } = allCommon?.mfgLiveFlexo;

  const {
    mfgLiveLoopHandleFilter,
    tabelFilterToggle,
    finalPrintedRollsToggle,
    consumedRollsToggle,
    mfgLiveLoopHandleConsumptionFilter,
  } = mfgLiveLoopHandlePrint;
  const {
    dates,
    factory,
    completed,
    currentPage,
    pageLimit,
    searchQuery,
    applied,
    filters,
    selectedItemIndex,
  } = mfgListLoopParam;
  const {
    listMFGProcess,
    suggestedRollList,
    countMFGfProcess,
    listOperator,
    viewMachineDetailForBagMaking,
    viewMfgProcessList,
    mfgLiveOperatorLoading,
  } = useSelector(({ mfgliveOperator }) => mfgliveOperator);
  const { listFilter } = useSelector(({ parties }) => parties);
  const tableRef = useRef();
  const customNoColumn = (data, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
  };
  const FactoryLocationHandleChange = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListLoopParam: {
            ...allFilters?.mfgLiveFlexo.mfgListLoopParam,
            factory: e.target.value,
          },
        },
      }),
    );
    dispatch(
      MFGfProcessLists({
        ...mfgListLoopParam,
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
          mfgListLoopParam: {
            ...allFilters?.mfgLiveFlexo.mfgListLoopParam,
            completed: e === true ? 1 : 0,
          },
        },
      }),
    );
    dispatch(
      MFGfProcessLists({
        ...mfgListLoopParam,
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
        ...mfgListLoopParam,
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
          mfgListLoopParam: {
            ...allFilters?.mfgLiveFlexo.mfgListLoopParam,
            dates: e,
          },
        },
      }),
    );
    // dispatch(
    //   MFGfProcessLists({
    //     ...mfgListLoopParam,
    //     dates: e.value,
    //     print_technology: print_technology,
    //     print: print,
    //     machine: machine,
    //   }),
    // );
    loadTableData(e);
  };
  const machineSelectHandleChange = e => {
    setPrintingData({
      ...printingData,
      machine_id: e,
    });
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
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListLoopParam: {
              ...mfgListLoopParam,
              currentPage: pageIndex,
            },
          },
        }),
      );

      dispatch(
        MFGfProcessLists({
          ...mfgListLoopParam,
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
      mfgListLoopParam,
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
            mfgListLoopParam: {
              ...mfgListLoopParam,
              currentPage: page === 0 ? 0 : 1,
              pageLimit: page,
            },
          },
        }),
      );

      dispatch(
        MFGfProcessLists({
          ...mfgListLoopParam,
          print_technology: print_technology,
          print: print,
          machine: machine,
          currentPage: page === 0 ? 0 : 1,
          pageLimit: page,
        }),
      );
    },
    [allFilters, dispatch, machine, mfgListLoopParam, print, print_technology],
  );
  const footerContentR2R = (
    <>
      <div className="mt-2 d-flex justify-content-end">
        <Button
          className="btn_border me-2"
          onClick={() => {
            dispatch(setViewProductDetailData({}));
            setAssignedRoll([]);
            setPrintingTableModal(false);
            setPrintingData({
              print_technology_id: '',
              process_id: '',
              machine_id: '',
              completed: 0,
              partial: 1,
              pending_bag: 0,
            });
            dispatch(setSuggestedRollList([]));
            dispatch(
              setAllCommon({
                ...allCommon,
                mfgLiveFlexo: {
                  ...allCommon?.mfgLiveFlexo,
                  mfgLiveLoopHandlePrint: {
                    ...allCommon?.mfgLiveFlexo.mfgLiveLoopHandlePrint,
                    finalPrintedRollsToggle: false,
                    consumedRollsToggle: false,
                  },
                },
              }),
            );
          }}
        >
          Cancel
        </Button>
        <Button
          className="btn_primary"
          onClick={async e => {
            let rollId = [];

            if (assignedRoll?.length > 0) {
              rollId = assignedRoll?.map(x => x?._id);
            }

            let newObj = {
              ...printingData,
              final_roll_printed: rollId,
            };

            const res = await dispatch(addBagDetailForPrinting(newObj));
            if (res) {
              dispatch(setViewProductDetailData({}));
              setPrintingTableModal(false);
              setPrintingData({
                print_technology_id: '',
                process_id: '',
                machine_id: '',
                completed: 0,
                partial: 1,
                pending_bag: 0,
              });
              setAssignedRoll([]);
              dispatch(
                setAllCommon({
                  ...allCommon,
                  mfgLiveFlexo: {
                    ...allCommon?.mfgLiveFlexo,
                    mfgLiveLoopHandlePrint: {
                      ...allCommon?.mfgLiveFlexo.mfgLiveLoopHandlePrint,
                      finalPrintedRollsToggle: false,
                      consumedRollsToggle: false,
                    },
                  },
                }),
              );
              dispatch(
                MFGfProcessLists({
                  ...mfgListLoopParam,
                  searchQuery,
                  print_technology: print_technology,
                  print: print,
                  machine: machine,
                }),
              );
              dispatch(setSuggestedRollList([]));
            }
          }}
        >
          Save
        </Button>
      </div>
    </>
  );
  const loadRequiredData = useCallback(() => {
    dispatch(getFactoryLocationList());
    dispatch(
      getListFilter({
        module_name: 'mfg_operator_loop',
      }),
    );
    dispatch(getActiveBagTypeList());
    dispatch(getActiveLaminationTypeList());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
  }, [loadRequiredData]);

  useEffect(() => {
    if (activeMachineTypeList?.length > 0) {
      let data = activeMachineTypeList?.filter(d => d?.name === activeTabName);
      setPrintingData({
        ...printingData,
        machine_id: data[0]?._id,
      });
    }
  }, [activeMachineTypeList, activeTabName]);

  useEffect(() => {
    if (Object.keys(viewMachineDetailForBagMaking)?.length > 0) {
      let list = viewMachineDetailForBagMaking?.machine_batch?.map(d => {
        return {
          print_by: d?.print_by,
          batch_no: d?.batch_no,
          qty: d?.qty,
          date: new Date(d?.date),
          id: Math.floor(Math.random() * 100),
        };
      });
      setBatchEntryList(list);
      setCounterData({
        ...counterData,
        completed: viewMachineDetailForBagMaking?.completed === true ? 1 : 0,
        partial: viewMachineDetailForBagMaking?.partial === true ? 1 : 0,
        machine_id: viewMachineDetailForBagMaking?.machine_id,
      });
    }
  }, [viewMachineDetailForBagMaking]);

  useEffect(() => {
    if (
      Object.entries(viewMfgProcessList).length > 0 &&
      suggestedRollList?.length > 0
    ) {
      let filteredData = suggestedRollList?.filter(x =>
        viewMfgProcessList?.final_roll_printed?.includes(x?._id),
      );

      setPrintingData({
        ...printingData,
        completed: viewMfgProcessList?.completed === true ? 1 : 0,
        partial: viewMfgProcessList?.partial === true ? 1 : 0,
        pending_bag: viewMfgProcessList?.pending_bag,
        print_technology_id: viewMfgProcessList?.print_technology_id,
        // product_id: viewMfgProcessList?.product_id,
        machine_id: viewMfgProcessList?.machine_id,
      });
      setAssignedRoll(filteredData);
    }
  }, [viewMfgProcessList, suggestedRollList, dispatch]);

  const laminationOptions = useMemo(() => {
    const updatedLaminationData = activeLaminationTypeList?.map(item => {
      return { label: item?.label, value: item.label };
    });
    return [
      ...updatedLaminationData,
      { label: 'Non Laminated', value: 'Non Laminated' },
    ];
  }, [activeLaminationTypeList]);

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
  const mainTableSizeTemplate = x => {
    return x?.gusset !== 0
      ? `W ${x?.width} × H ${x?.height} × G ${x?.gusset}`
      : `W ${x?.width} × H ${x?.height} `;
  };

  const mainTableRollWidthTemplate = rowData => {
    return <span>{rowData?.roll_width ? `${rowData?.roll_width}”` : ''}</span>;
  };

  const rollTemplate = data => {
    return (
      <div className="add_package_wrap">
        <span
          className="icon"
          onClick={async e => {
            setPrintingTableModal(true);
            dispatch(getProductDetailById(data?.product_id));
            const printing_res = await dispatch(viewRollConsumption(data?._id));
            setPrintingData({
              ...printingData,
              print_technology_id: print_technology,
              process_id: data?._id,
              product_id: data?.product_id,
              // pending_bag: data?.quantity,
              pending_bag: printing_res?.hasOwnProperty('pending_bag')
                ? printing_res?.pending_bag
                : data?.quantity,
              ...(printing_res?.hasOwnProperty('completed') && {
                completed: printing_res?.completed === true ? 1 : 0,
              }),
              ...(printing_res?.hasOwnProperty('partial') && {
                partial: printing_res?.partial === true ? 1 : 0,
              }),
            });
            dispatch(getListSelectedRoll(print_technology, data?._id));
            dispatch(getActiveMachineTypeList());
          }}
        >
          <img src={PlusIcon} alt="" />
        </span>
        <span>{data?.total_roll}</span>
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

  const counterTemplate = data => {
    return (
      <div className="add_package_wrap">
        <span
          className="icon"
          // onClick={e => {
          //   setMachineCounterModal(true);
          // }}
          onClick={e => {
            setMachineCounterModal({
              isView: true,
              id: data?._id,
            });
            setBatchEntryList([]);
            dispatch(getListOperator());
            dispatch(listMachineByMachineType(print_technology));
            dispatch(viewBagMackingMachineDetail(data?._id));
          }}
        >
          <img src={PlusIcon} alt="" />
        </span>
        <span>{data?.machine_count}</span>
      </div>
    );
  };
  const handleCheckboxTemplate = data => {
    setAssignedRoll(data);
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
            setCounterData({ machine_id: '', completed: 0, partial: 1 });
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

            if (!isEmptyValuePresent && counterData?.machine_id !== '') {
              let newObj = {
                ...counterData,
                mfg_batch: batchEntryList,
                process_id: machineCounterModal?.id,
              };
              let res = await dispatch(updateBagMakingMachineCount(newObj));
              if (res) {
                dispatch(
                  MFGfProcessLists({
                    ...mfgListLoopParam,
                    searchQuery,
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
                setCounterData({ machine_id: '', completed: 0, partial: 1 });
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
  const customBatchNo = (data, index) => {
    // let batchNo = index?.rowIndex + 1 ? `B-0${index?.rowIndex + 1}` : '-';
    // return (
    //   <span>{index?.rowIndex + 1 ? `B-0${index?.rowIndex + 1}` : '-'}</span>
    // );
    return (
      <InputText
        placeholder="0"
        // type="number"
        name="batch_no"
        value={data?.batch_no}
        onChange={e => {
          handleChangeTableData(e.target.value, data, 'batch_no');
        }}
      />
    );
  };
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
        useGrouping={false}
        name="qty"
        onChange={e => {
          handleChangeTableData(e.value, data, 'qty');
        }}
      />
    );
  };
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
        module_name: 'mfg_operator_loop',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'mfg_operator_loop',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'mfg_operator_loop',
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
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListLoopParam: {
            ...mfgListLoopParam,
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
            mfgListLoopParam: {
              ...mfgListLoopParam,
              ...(updatedFilters?.length === 0 &&
                Object.keys(allFilters.mfgLiveFlexo?.mfgListLoopParam?.applied)
                  ?.length !== 0 && {
                  applied: {},
                }),
              filters: [...updatedFilters],
              selectedItemIndex:
                updatedFilters?.length === 0 &&
                allFilters.mfgLiveFlexo.selectedItemIndex !== ''
                  ? ''
                  : allFilters.mfgLiveFlexo.selectedItemIndex,
            },
          },
        }),
      );

      if (
        updatedFilters?.length === 0 &&
        Object.keys(allFilters.mfgLiveFlexo?.mfgListLoopParam?.applied)
          ?.length > 0
      ) {
        dispatch(
          MFGfProcessLists({
            ...mfgListLoopParam,
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
    },
    [filters, dispatch, allFilters, isEdit],
  );

  const handleAddFilter = () => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListLoopParam: {
            ...mfgListLoopParam,
            filters: [
              ...allFilters?.mfgLiveFlexo?.mfgListLoopParam?.filters,
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
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListLoopParam: {
            ...mfgListLoopParam,
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
        module_name: 'mfg_operator_loop',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListLoopParam: {
              ...mfgListLoopParam,
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
          module_name: 'mfg_operator_loop',
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
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListLoopParam: {
              ...mfgListLoopParam,
              applied: filterObj,
              currentPage: 1,
            },
          },
        }),
        dispatch(
          MFGfProcessLists({
            ...mfgListLoopParam,
            searchQuery,
            currentPage: 1,
            applied: filterObj,
            print_technology: print_technology,
            print: print,
            machine: machine,
          }),
        ),
      );
    }
  }, [
    filters,
    dispatch,
    allFilters,
    mfgListLoopParam,
    searchQuery,
    print,
    print_technology,
    machine,
  ]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              mfgListLoopParam: {
                ...mfgListLoopParam,
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
            ...mfgListLoopParam,
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
              mfgListLoopParam: {
                ...mfgListLoopParam,
                filters: [],
                selectedItemIndex: '',
                currentPage: 1,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListLoopParam,
            searchQuery,
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
    [
      allFilters,
      dispatch,
      isEdit,
      applied,
      searchQuery,
      print,
      print_technology,
      machine,
    ],
  );

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
      lamination_typename: laminationOptions,
      // is_laminated: commonOption,
    };
  }, [activeBagTypeList, laminationOptions]);
  const handleSearchInput = (
    e,
    mfgListLoopParam,
    print_technology,
    machine,
    print,
  ) => {
    dispatch(
      MFGfProcessLists({
        ...mfgListLoopParam,
        currentPage: 1,
        searchQuery: e.target.value,
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
      <div className="flexo_printing_wrap mb-3">
        <div className="table_main_Wrapper bg-white">
          <CommonHeader
            headerName="MFG Live"
            searchSateName="mfgLiveFlexo"
            searchInnerSateName="mfgListLoopParam"
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
            mfgListParam={mfgListLoopParam}
            applied={applied}
            debouncehandleSearchInput={debouncehandleSearchInput}
          />
          <div className="data_table_wrapper with_colspan_head cell_padding_small is_filter break_header">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLiveFlexo: {
                      ...allCommon?.mfgLiveFlexo,
                      mfgLiveLoopHandlePrint: {
                        ...allCommon?.mfgLiveFlexo?.mfgLiveLoopHandlePrint,
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
              filters={mfgLiveLoopHandleFilter}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLiveFlexo: {
                      ...allCommon?.mfgLiveFlexo,
                      mfgLiveLoopHandlePrint: {
                        ...allCommon?.mfgLiveFlexo.mfgLiveLoopHandlePrint,
                        mfgLiveLoopHandleFilter: event?.filters,
                      },
                    },
                  }),
                );
              }}
              emptyMessage={mfgLiveOperatorLoading && <Skeleton count={9} />}
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
              ></Column>
              <Column
                field="handle_material_name"
                header="Handle Material"
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
                field="handle_length"
                header="Handle Length"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="is_laminated"
                header="Lamination"
                sortable
                filter={tabelFilterToggle}
                body={laminationTypeTemplate}
              ></Column>
              <Column
                field="qty"
                header="Quantity"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="total_printed_roll"
                header="Roll Printed"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="addRollConsume"
                header="Add Roll Consume"
                body={rollTemplate}
              ></Column>
              <Column
                field="machine_count"
                header="Expected Qty"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="machineCounter"
                header="Machine Counter"
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
          header="Roll Consumption"
          visible={printingTableModal}
          draggable={false}
          className="modal_Wrapper model_extra_large"
          onHide={() => {
            dispatch(setViewProductDetailData({}));
            setPrintingTableModal(false);
            dispatch(setSuggestedRollList([]));
            setAssignedRoll([]);
            dispatch(
              setAllCommon({
                ...allCommon,
                mfgLiveFlexo: {
                  ...allCommon?.mfgLiveFlexo,
                  mfgLiveLoopHandlePrint: {
                    ...allCommon?.mfgLiveFlexo.mfgLiveLoopHandlePrint,
                    finalPrintedRollsToggle: false,
                    consumedRollsToggle: false,
                  },
                },
              }),
            );
          }}
          footer={footerContentR2R}
        >
          <div className="printing_content_wrap">
            <div className="printing_content_top">
              <Row className="align-items-center g-2">
                <Col lg={3}>
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="ingredient1"
                        name="complete"
                        value={printingData?.completed}
                        onChange={e => {
                          setPrintingData({
                            ...printingData,
                            completed: e.target.checked ? 1 : 0,
                            partial: e.target.checked ? 0 : 1,
                          });
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
                          setPrintingData({
                            ...printingData,
                            partial: e.target.checked ? 1 : 0,
                            completed: e.target.checked ? 0 : 1,
                          });
                        }}
                        checked={printingData?.partial === 1}
                      />
                      <label htmlFor="ingredient2" className="mx-2">
                        Partial
                      </label>
                    </div>
                  </div>
                </Col>
                <Col lg={9}>
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
            </div>
            <div className="printing_content_middle">
              <Row className="g-2">
                <Col md={3}>
                  <div className="product_details_left border rounded-3 bg_white p-3 mb-3">
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
                <Col md={9}>
                  <div className="table_main_Wrapper bg-white mb-3">
                    <div className="top_filter_wrap">
                      <h3>Final Rolls Printed</h3>
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
                                mfgLiveLoopHandlePrint: {
                                  ...allCommon?.mfgLiveFlexo
                                    ?.mfgLiveLoopHandlePrint,
                                  finalPrintedRollsToggle:
                                    !finalPrintedRollsToggle,
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
                        selection={assignedRoll}
                        onSelectionChange={e => handleCheckboxTemplate(e.value)}
                        filters={mfgLiveLoopHandleConsumptionFilter}
                        onFilter={event => {
                          dispatch(
                            setAllCommon({
                              ...allCommon,
                              mfgLiveFlexo: {
                                ...allCommon?.mfgLiveFlexo,
                                mfgLiveLoopHandlePrint: {
                                  ...allCommon?.mfgLiveFlexo
                                    .mfgLiveLoopHandlePrint,
                                  mfgLiveLoopHandleConsumptionFilter:
                                    event?.filters,
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
                          field=""
                          header="No"
                          sortable
                          body={customNoColumn}
                        ></Column>
                        <Column
                          field="id_no"
                          header="ID No."
                          sortable
                          filter={finalPrintedRollsToggle}
                        ></Column>
                        <Column
                          field="color"
                          header="Color"
                          sortable
                          filter={finalPrintedRollsToggle}
                        ></Column>
                        <Column
                          field="gsm"
                          header="GSM"
                          sortable
                          filter={finalPrintedRollsToggle}
                        ></Column>
                        <Column
                          field="size"
                          header="Size"
                          sortable
                          body={sizeTemplate}
                          filter={finalPrintedRollsToggle}
                        ></Column>
                        <Column
                          field="net_weight"
                          header="Net Weight"
                          sortable
                          filter={finalPrintedRollsToggle}
                        ></Column>
                        <Column
                          field="item_name"
                          header="Item Name"
                          className="product_code suggested_roll"
                          sortable
                          filter={finalPrintedRollsToggle}
                        ></Column>
                        <Column
                          field="lamination"
                          header="Lamination"
                          sortable
                          filter={finalPrintedRollsToggle}
                        ></Column>
                        <Column
                          field="design_name"
                          header="Design Name"
                          sortable
                          filter={finalPrintedRollsToggle}
                        ></Column>
                        <Column
                          field="is_slit"
                          header="Split"
                          sortable
                          filter={finalPrintedRollsToggle}
                          body={slitTemplate}
                        ></Column>
                        <Column
                          field="parent_id"
                          header="Parent"
                          sortable
                          filter={finalPrintedRollsToggle}
                        ></Column>
                      </DataTable>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="final_print_table mt-3">
              <div className="table_main_Wrapper bg-white">
                <div className="top_filter_wrap">
                  <h3>Consumed Rolls</h3>
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
                            mfgLiveLoopHandlePrint: {
                              ...allCommon?.mfgLiveFlexo
                                ?.mfgLiveLoopHandlePrint,
                              consumedRollsToggle: !consumedRollsToggle,
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
                    filters={mfgLiveLoopHandleConsumptionFilter}
                    onFilter={event => {
                      dispatch(
                        setAllCommon({
                          ...allCommon,
                          mfgLiveFlexo: {
                            ...allCommon?.mfgLiveFlexo,
                            mfgLiveLoopHandlePrint: {
                              ...allCommon?.mfgLiveFlexo.mfgLiveLoopHandlePrint,
                              mfgLiveLoopHandleConsumptionFilter:
                                event?.filters,
                            },
                          },
                        }),
                      );
                    }}
                  >
                    <Column
                      field=""
                      header="No"
                      sortable
                      body={customNoColumn}
                    ></Column>
                    <Column
                      field="id_no"
                      header="ID No."
                      sortable
                      filter={consumedRollsToggle}
                    ></Column>
                    <Column
                      field="color"
                      header="Color"
                      sortable
                      filter={consumedRollsToggle}
                    ></Column>
                    <Column
                      field="gsm"
                      header="GSM"
                      sortable
                      filter={consumedRollsToggle}
                    ></Column>
                    <Column
                      field="size"
                      header="Size"
                      sortable
                      body={sizeTemplate}
                      filter={consumedRollsToggle}
                    ></Column>
                    <Column
                      field="net_weight"
                      header="Net Weight"
                      sortable
                      filter={consumedRollsToggle}
                    ></Column>
                    <Column
                      field="item_name"
                      header="Item Name"
                      sortable
                      filter={consumedRollsToggle}
                    ></Column>
                    <Column
                      field="lamination"
                      header="Lamination"
                      sortable
                      filter={consumedRollsToggle}
                    ></Column>
                    <Column
                      field="design_name"
                      header="Design Name"
                      sortable
                      filter={consumedRollsToggle}
                    ></Column>
                    <Column
                      field="is_slit"
                      header="Split"
                      sortable
                      filter={consumedRollsToggle}
                      body={slitTemplate}
                    ></Column>
                    <Column
                      field="parent_id"
                      header="Parent"
                      sortable
                      filter={consumedRollsToggle}
                    ></Column>
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
            setCounterData({ machine_id: '', completed: 0, partial: 1 });
          }}
          footer={footerContent}
        >
          <div className="printing_content_wrap">
            <div className="right_filter_wrapper">
              <Row>
                <Col md={8}>
                  <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
                    <div className="form_group">
                      <ReactSelectSingle
                        TakeAction
                        value={counterData?.machine_id}
                        options={machineListByMachineType}
                        onChange={e => {
                          // machineSelectHandleChange(e.target.value);
                          setCounterData({
                            ...counterData,
                            machine_id: e.target.value,
                          });
                        }}
                        placeholder="Select Machine"
                      />
                    </div>
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="ingredient1"
                        name="complete"
                        value={counterData?.completed}
                        onChange={e => {
                          setCounterData({
                            ...counterData,
                            completed: e.target.checked ? 1 : 0,
                            partial: e.target.checked ? 0 : 1,
                          });
                        }}
                        checked={counterData?.completed === 1}
                      />
                      <label htmlFor="ingredient1" className="mx-2">
                        Complete
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="ingredient2"
                        name="partial"
                        value={counterData?.partial}
                        onChange={e => {
                          setCounterData({
                            ...counterData,
                            partial: e.target.checked ? 1 : 0,
                            completed: e.target.checked ? 0 : 1,
                          });
                        }}
                        checked={counterData?.partial === 1}
                      />
                      <label htmlFor="ingredient2" className="mx-2">
                        Partial
                      </label>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <ul className="text-end mb20">
                    <li>
                      <Button
                        className="btn_primary"
                        onClick={e => {
                          if (batchEntryList?.length > 0) {
                            const lastObj =
                              batchEntryList[batchEntryList.length - 1];
                            const result = Object.keys(lastObj).filter(
                              value => {
                                return value !== 'id' && lastObj[value]
                                  ? lastObj[value]
                                  : false;
                              },
                            );

                            if (
                              result?.length < 0 ||
                              result?.length ===
                                Object.keys(batchEntryData)?.length
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
                                batch_no: (
                                  batchEntryList?.length + 1
                                )?.toString(),
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
                </Col>
              </Row>
            </div>
            <div className="table_main_Wrapper bg-white mb-3">
              <div className="data_table_wrapper with_colspan_head cell_padding_large max_height">
                <DataTable
                  value={batchEntryList}
                  sortMode="single"
                  sortField="name"
                  sortOrder={1}
                  rows={10}
                  dataKey="_id"
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
        <ImageCapture whatsappData={whatsappData} />
      </Dialog>
    </>
  );
}
