import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Tag } from 'primereact/tag';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { Image } from 'primereact/image';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { OverlayPanel } from 'primereact/overlaypanel';
import {
  convertThousandToNumeric,
  getFormattedDate,
  roundValueThousandSeparator,
  thousandSeparator,
} from 'Helper/Common';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import {
  getmfgLiveList,
  updateBagSentStatus,
  updateFactoryStatus,
  updateHandleStatus,
  updateLrSentStatus,
  updateStrOrderStatus,
  updateStrReceiveStatus,
  getMfgProcessFilterList,
  getSuggestedRollList,
  viewMfgProcessPrintingById,
  updatePrintStatus,
  getSuggestedProductList,
  viewBagMadeData,
  addBagDetailForBagMade,
  getMfgLivePrintingFilterList,
} from 'Services/Production/mfgLiveServices';
import {
  getActiveLaminationTypeList,
  getActivePrintTechnologyList,
  getFactoryLocationList,
} from 'Services/Settings/MiscMasterService';
import {
  setAssignedRollList,
  setBagToBagData,
  setClearPrintingData,
  setPrintTechnologyList,
  setSuggestedRollList,
  setUpdatedPrintStatus,
  setprintingData,
} from 'Store/Reducers/Production/mfgLiveSlice';
import MFGLiveExport from './MFGLiveExport';
import Loader from 'Components/Common/Loader';
import MFGLiveAdminTable from './MFGLiveAdminTable';
import { RadioButton } from 'primereact/radiobutton';
import PlusIcon from '../../../Assets/Images/plus.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import SearchIcon from '../../../Assets/Images/search.svg';
import FilterIcon from '../../../Assets/Images/filter.svg';
import download from '../../../Assets/Images/download.svg';
import whatsapp from '../../../Assets/Images/whatsapp.svg';
import MFGLivePrintingFilter from './MFGLivePrintingFilter';
import FilterOverlay from 'Components/Common/FilterOverlay';
import { toastCongig } from 'Components/Products/AddProduct';
import WhatsappIcon from '../../../Assets/Images/whatsapp.svg';
import DummyImage from '../../../Assets/Images/gusset-bag.png';
import MFGLiveAdminMultiSelect from './MFGLiveAdminMultiSelect';
import ClipboardIcon from '../../../Assets/Images/clipboard.svg';
import CheckRed from '../../../Assets/Images/check-round-red.svg';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import CheckGreen from '../../../Assets/Images/check-round-green.svg';
import { getProductDetailById } from 'Services/Products/ProductService';
import ReactSelectSingle from '../../../Components/Common/ReactSelectSingle';
import { setViewProductDetailData } from 'Store/Reducers/Products/ProductSlice';

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

export const commonCase = val => {
  switch (val) {
    case false:
      return 1;
    case true:
      return 0;
    default:
      return null;
  }
};

export const StrOrdCase = val => {
  switch (val) {
    case 0:
      return 2;
    case 1:
      return 0;
    case 2:
      return 1;
    default:
      return null;
  }
};

export const getNewSeverity = val => {
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

const mfgLiveFilterDetails = [
  { label: 'ROLL', value: 'roll_available', type: 'dropDown' },
  { label: 'HNDL', value: 'hndl', type: 'dropDown' },
  { label: 'PRINT', value: 'print', type: 'dropDown' },
  { label: 'BAG MADE', value: 'bag_made', type: 'dropDown' },
  { label: 'BAG SENT', value: 'bag_sent', type: 'dropDown' },
  { label: 'LR SENT', value: 'lr_sent', type: 'dropDown' },
  { label: 'Factory Location', value: 'factory', type: 'dropDown' },
  { label: 'Amount', value: 'amount', type: 'inputBox' },
  { label: 'Qty(PCs)', value: 'qty', type: 'inputBox' },
  { label: 'Qty(KGs)', value: 'kg_qty', type: 'inputBox' },
  { label: 'Rate(PCs)', value: 'rate', type: 'inputBox' },
  { label: 'Rate(KGs)', value: 'kg_rate', type: 'inputBox' },
  { label: 'Add Charge', value: 'additional_charge', type: 'inputBox' },
  { label: 'Wastage', value: 'wastage', type: 'inputBox' },
  { label: 'Profit', value: 'profit', type: 'inputBox' },
  { label: 'KG Rate Actual', value: 'act_kg_rate', type: 'inputBox' },
  {
    label: 'KG Rate Theoretical',
    value: 'theoretical_kg_rate',
    type: 'inputBox',
  },
  { label: 'JobNo', value: 'job_no', type: 'inputBox' },
];

const mfgLiveFilterDetailsDesigner = [
  { label: 'OLD STR', value: 'old_str', type: 'dropDown' },
  { label: 'STR ORD', value: 'str_ord', type: 'dropDown' },
  { label: 'STR RCV', value: 'str_rcv', type: 'dropDown' },
  { label: 'Job Date', value: 'job_date', type: 'inputBox' },
  { label: 'Day', value: 'days', type: 'inputBox' },
  { label: 'Design Name', value: 'design', type: 'inputBox' },
  {
    label: 'Background Design',
    value: 'background_design_name',
    type: 'inputBox',
  },
  { label: 'Width', value: 'width', type: 'inputBox' },
  { label: 'Height', value: 'height', type: 'inputBox' },
  { label: 'Gusset', value: 'gusset', type: 'inputBox' },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'Bag Type', value: 'bag_type', type: 'inputBox' },
  { label: 'Print Technology', value: 'print_technology_id', type: 'dropDown' },
  { label: 'Fabric Color', value: 'fabric_color', type: 'inputBox' },
  { label: 'Handle Material', value: 'handle_material_name', type: 'inputBox' },
  { label: 'Handle Color', value: 'handle_color', type: 'inputBox' },
  { label: 'Cylinder', value: 'cylinder', type: 'inputBox' },
  { label: 'Stereo Chg', value: 'stereo_charge', type: 'inputBox' },
  { label: 'Stereo Chg(Actual)', value: 'act_stereo_charge', type: 'inputBox' },
  { label: 'Comment', value: 'comment', type: 'inputBox' },
  { label: 'Party Name', value: 'party_name', type: 'inputBox' },
  { label: 'Present Advisor', value: 'present_advisor_name', type: 'inputBox' },
  { label: 'Lamination Type', value: 'lamination_typename', type: 'dropDown' },
  { label: 'Entry By', value: 'created_by_name', type: 'inputBox' },
];

const batchEntryData = {
  batch_date: '',
  bag_made: '',
  total_bundle: '',
  empty_bundle_weight: '',
  gross_weight_bag: '',
  net_weight_bag: '',
  avg_bag_weight: '',
};

const rollMenuOption = ['YES', 'NO', 'PART'];
const commonMenuOption = ['YES', 'NO'];
const strOrdMenuOption = ['YES', 'NO', 'SENT'];

const intialPrintingData = {
  print_technology_id: '',
  process_id: '',
  product_id: '',
  in_stock: '',
  qty_used: '',
  wastage: '',
  bag_printed: '',
  suggested_product_id: '',
  warehouse: '',
  completed: 0,
  partial: 1,
};
const initialBagMade = {
  order_date: '',
  total: 0,
  act_handle_weight: 0,
  auto_handle_weight: 0,
  total_fabric: 0,
  profit: 0,
  theoretical_kg_rate: 0,
  act_kg_rate: 0,
  additional_mfg_cost: 0,
  per_pc: 0,
  conversion_rate: 0,
  wastage: 0,
  wastage_percentage: 0,
  roll_weight: 0,
  roll_rate: 0,
  netWeightOfBag: 0,
  stereo_charge: 0,
  act_stereo_charge: 0,
  expected: 0,
  days: 0,
  completed: 0,
  partial: 1,
};
const rollOption = [
  { label: 'YES', value: 1 },
  { label: 'PARTIAL', value: 2 },
  { label: 'NO', value: 0 },
];
const strOrdOption = [
  { label: 'YES', value: 1 },
  { label: 'SENT', value: 2 },
  { label: 'NO', value: 0 },
];
const commonOption = [
  { label: 'YES', value: true },
  { label: 'NO', value: false },
];

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

const designNameTemplate = data => {
  return <span className="m-0">{data?.design}</span>;
};

const handleMaterialTemplate = data => {
  return <span className="m-0">{data?.handle_material_name}</span>;
};

const bagTypeTemplate = data => {
  return <span className="m-0 text-wrap">{data?.bag_type}</span>;
};

const commentTemplate = data => {
  return <span className="mfg_comment">{data?.comment}</span>;
};

const slitTemplate = data => {
  return data?.is_slit === true ? (
    <img src={CheckGreen} alt="CheckIocn" />
  ) : (
    <img src={CheckRed} alt="CheckIocn" />
  );
};

export default function MFGLiveAdmin({ hasAccess }) {
  const op = useRef(null);
  const dateRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { is_export_access } = hasAccess;

  const [bagMadeModal, setBagMadeModal] = useState({
    isView: false,
    id: '',
  });
  const [newTableModal, setNewTableModal] = useState({
    id: '',
    isView: false,
  });
  const [jobId, setJobId] = useState('');
  const [mfgData, setMfgData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [isHandleAuto, setIsHandleAuto] = useState(1);
  const [assignedRoll, setAssignedRoll] = useState([]);
  const [batchEntryList, setBatchEntryList] = useState([]);
  const [whatsappPopup, setWhatsappPopup] = useState(false);
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [printTechnologyId, setPrintTechnologyId] = useState('');
  const [screenTableModal, setScreenTableModal] = useState(false);
  const [changeRollDate, setChangeRollDate] = useState(new Date());
  const [checkedAssignedRoll, setCheckedAssignedRoll] = useState();
  const [printingTableModal, setPrintingTableModal] = useState(false);
  const [selectedProductFromSuggested, setSelectedProductFromSuggested] =
    useState({});
  const [bagMadeAllData, setBagMadeAllData] = useState({
    days: 0,
    total: 0,
    profit: 0,
    per_pc: 0,
    partial: 1,
    completed: 0,
    act_kg_rate: 0,
    order_date: '',
    total_fabric: 0,
    theoretical_kg_rate: 0,
    additional_mfg_cost: 0,
    conversion_rate: 0,
    wastage: 0,
    wastage_percentage: 0,
    roll_weight: 0,
    roll_rate: 0,
    netWeightOfBag: 0,
    stereo_charge: 0,
    expected: 0,
    act_stereo_charge: 0,
    act_handle_weight: 0,
    auto_handle_weight: 0,
  });

  const {
    bagMadeData,
    mfgLiveList,
    printingData,
    bagToBagData,
    mfgLiveCount,
    mfgLiveAllData,
    mfgLiveLoading,
    mfgLiveTotalQty,
    suggestedRollList,
    mfgLiveFilterList,
    updatedPrintStatus,
    printTechnologyList,
    allSuggestedRollList,
    suggestedProductList,
    mfgProcessPrintingById,
    mfgSuggestedRollLoading,
    mfgLivePrintingFilterList,
  } = useSelector(({ mfgLive }) => mfgLive);
  const {
    factoryLocationList,
    activePrintTechnologyList,
    activeLaminationTypeList,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { currentUser } = useSelector(({ auth }) => auth);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { viewProductDetailData } = useSelector(({ product }) => product);
  const { partiesAdvisor, listFilter } = useSelector(({ parties }) => parties);

  const {
    searchQuery,
    mfgFilters,
    filterToggle,
    field_filter,
    print_field_filter,
    assignedFilterToggle,
    suggestedFilterToggle,
    mfgLivePrintingFilter,
    blank_print_field_filter,
  } = allCommon?.mfgLive;
  const {
    applied,
    filters,
    currentPage,
    pageLimit,
    selectedItemIndex,
    whatsappData,
    dates,
  } = allFilters?.mfgLive;

  const loadTableData = selectedDate => {
    dispatch(
      getmfgLiveList(
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        selectedDate,
        field_filter,
      ),
    );
  };

  const loadRequiredData = useCallback(async () => {
    dispatch(
      getListFilter({
        module_name: 'mfg_live',
      }),
    );
    await dispatch(
      getmfgLiveList(
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        dates,
        field_filter,
      ),
    );
    dispatch(getFactoryLocationList());
    dispatch(getMfgProcessFilterList());
    dispatch(getActiveLaminationTypeList());
    dispatch(getMfgLivePrintingFilterList());
    dispatch(getActivePrintTechnologyList());
  }, [
    applied,
    currentPage,
    dates,
    dispatch,
    field_filter,
    pageLimit,
    searchQuery,
  ]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  useEffect(() => {
    if (Object.entries(bagMadeData)?.length > 0) {
      const isHandleWeightAuto = bagMadeData?.bag_made_data
        ?.is_handle_weight_auto
        ? 1
        : 0;
      setIsHandleAuto(isHandleWeightAuto);
      if (bagMadeData?.bag_made_data?.mfg_Batch?.length > 0) {
        let list = bagMadeData?.bag_made_data?.mfg_Batch?.map(d => {
          return {
            batch_date: new Date(d.batch_date),
            id: Math.floor(Math.random() * 100),
            bag_made: d.bag_made,
            total_bundle: d.total_bundle,
            empty_bundle_weight: d.empty_bundle_weight,
            gross_weight_bag: d.gross_weight_bag,
            net_weight_bag: d.net_weight_bag,
            avg_bag_weight: d.avg_bag_weight,
          };
        });
        let totalBag = totalCount(list, 'bag_made');
        let totalNetWtBAG = totalCount(list, 'net_weight_bag');
        let AvgWtPerBag = totalCount(list, 'avg_bag_weight');
        let theoriticalRate = (bagMadeData?.per_pc * AvgWtPerBag) / 1000;
        let handleWeight =
          bagMadeData?.bag_made_data?.is_handle_weight_auto === true
            ? bagMadeData?.bag_made_data?.auto_handle_weight
            : bagMadeData?.bag_made_data?.act_handle_weight;
        let totalHandleWeight = (Number(totalBag) * handleWeight) / 1000;
        let netWtOfBag = Number(totalNetWtBAG) - totalHandleWeight;
        let wastage = bagMadeData?.total_fabric - netWtOfBag;
        let wastagePer = (wastage / bagMadeData?.total_fabric) * 100;
        let wastageRate =
          (bagMadeData?.roll_rate * Number(wastage)) / bagMadeData?.roll_weight;
        let costPrice =
          bagMadeData?.conversion_rate +
          Number(wastageRate) +
          bagMadeData?.bag_made_data?.additional_mfg_cost;
        let sellingPrice = bagMadeData?.per_pc;
        let profit = sellingPrice - Number(costPrice) / sellingPrice;

        setBatchEntryList(list);
        setBagMadeAllData({
          ...bagMadeAllData,
          ...(bagMadeData?.bag_made_data?.hasOwnProperty('partial') && {
            partial: bagMadeData?.bag_made_data?.partial === true ? 1 : 0,
          }),
          ...(bagMadeData?.bag_made_data?.hasOwnProperty('completed') && {
            completed: bagMadeData?.bag_made_data?.completed === true ? 1 : 0,
          }),
          order_date: bagMadeData?.order_date ? bagMadeData?.order_date : '',
          theoretical_kg_rate:
            bagMadeData?.unit_pc === true
              ? parseFloat(Number(theoriticalRate).toFixed(2))
              : bagMadeData?.theoritical_per_kg,
          per_pc: bagMadeData?.per_pc ? bagMadeData?.per_pc : 0,
          conversion_rate: bagMadeData?.conversion_rate
            ? bagMadeData?.conversion_rate
            : 0,

          act_kg_rate: bagMadeData?.per_kg ? bagMadeData?.per_kg : 0,
          bag_weight: bagMadeData?.bag_weight ? bagMadeData?.bag_weight : 0,
          expected: bagMadeData?.expected ? bagMadeData?.expected : 0,
          stereo_charge: bagMadeData?.stereo_charge
            ? bagMadeData?.stereo_charge
            : 0,
          roll_rate: bagMadeData?.roll_rate ? bagMadeData?.roll_rate : 0,
          roll_weight: bagMadeData?.roll_weight ? bagMadeData?.roll_weight : 0,
          total_fabric: bagMadeData?.total_fabric
            ? bagMadeData?.total_fabric
            : 0,
          act_stereo_charge: bagMadeData?.bag_made_data?.act_stereo_charge
            ? bagMadeData?.bag_made_data?.act_stereo_charge
            : bagMadeData?.act_stereo_charge
            ? bagMadeData?.act_stereo_charge
            : 0,
          additional_mfg_cost: bagMadeData?.bag_made_data?.additional_mfg_cost
            ? bagMadeData?.bag_made_data?.additional_mfg_cost
            : bagMadeData?.additional_mfg_cost
            ? bagMadeData?.additional_mfg_cost
            : 0,
          auto_handle_weight: bagMadeData?.bag_made_data?.auto_handle_weight
            ? bagMadeData?.bag_made_data?.auto_handle_weight
            : bagMadeData?.auto_handle_weight
            ? bagMadeData?.auto_handle_weight
            : 0,
          is_handle_weight_auto: bagMadeData?.bag_made_data
            ?.is_handle_weight_auto
            ? bagMadeData?.bag_made_data?.is_handle_weight_auto
            : 1,
          unit_pc: bagMadeData?.unit_pc ? bagMadeData?.unit_pc : 0,

          total: totalBag,
          netWeightOfBag: netWtOfBag?.toFixed(2),
          wastage: parseFloat(Number(wastage).toFixed(2)),
          wastage_percentage: parseFloat(Number(wastagePer).toFixed(2)),
          profit: profit?.toFixed(2),
        });
      } else {
        setBagMadeAllData({
          ...bagMadeAllData,
          ...(bagMadeData?.bag_made_data?.hasOwnProperty('partial') && {
            partial: bagMadeData?.bag_made_data?.partial === true ? 1 : 0,
          }),
          ...(bagMadeData?.bag_made_data?.hasOwnProperty('completed') && {
            completed: bagMadeData?.bag_made_data?.completed === true ? 1 : 0,
          }),
          order_date: bagMadeData?.order_date ? bagMadeData?.order_date : '',
          theoretical_kg_rate: bagMadeData?.theoritical_per_kg
            ? bagMadeData?.theoritical_per_kg
            : 0,
          per_pc: bagMadeData?.per_pc ? bagMadeData?.per_pc : 0,
          conversion_rate: bagMadeData?.conversion_rate
            ? bagMadeData?.conversion_rate
            : 0,

          act_kg_rate: bagMadeData?.per_kg ? bagMadeData?.per_kg : 0,
          bag_weight: bagMadeData?.bag_weight ? bagMadeData?.bag_weight : 0,
          expected: bagMadeData?.expected ? bagMadeData?.expected : 0,
          stereo_charge: bagMadeData?.stereo_charge
            ? bagMadeData?.stereo_charge
            : 0,
          roll_rate: bagMadeData?.roll_rate ? bagMadeData?.roll_rate : 0,
          roll_weight: bagMadeData?.roll_weight ? bagMadeData?.roll_weight : 0,
          total_fabric: bagMadeData?.total_fabric
            ? bagMadeData?.total_fabric
            : 0,
          act_stereo_charge: bagMadeData?.bag_made_data?.act_stereo_charge
            ? bagMadeData?.bag_made_data?.act_stereo_charge
            : bagMadeData?.act_stereo_charge
            ? bagMadeData?.act_stereo_charge
            : 0,
          additional_mfg_cost: bagMadeData?.bag_made_data?.additional_mfg_cost
            ? bagMadeData?.bag_made_data?.additional_mfg_cost
            : bagMadeData?.additional_mfg_cost
            ? bagMadeData?.additional_mfg_cost
            : 0,
          auto_handle_weight: bagMadeData?.bag_made_data?.auto_handle_weight
            ? bagMadeData?.bag_made_data?.auto_handle_weight
            : bagMadeData?.auto_handle_weight
            ? bagMadeData?.auto_handle_weight
            : 0,
          is_handle_weight_auto: bagMadeData?.bag_made_data
            ?.is_handle_weight_auto
            ? bagMadeData?.bag_made_data?.is_handle_weight_auto
            : 1,
          wastage: 0,
          wastage_percentage: 0,
          profit: 0,
        });
      }
    }
  }, [bagMadeData, dispatch]);

  useEffect(() => {
    if (batchEntryList?.length > 0) {
      const lastObj = batchEntryList[batchEntryList.length - 1];

      let endDate = lastObj['batch_date']
        ? moment(lastObj['batch_date']).valueOf()
        : null;
      let startDate = bagMadeAllData?.order_date
        ? moment(bagMadeAllData?.order_date, 'DD-MM-YYYY').valueOf()
        : null;
      if (startDate && endDate) {
        const diffTime = endDate - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        setBagMadeAllData({
          ...bagMadeAllData,
          days: diffDays,
        });
      }
    }
  }, [batchEntryList, bagMadeAllData?.order_date]);

  useEffect(() => {
    if (factoryLocationList?.length > 0) {
      let location = factoryLocationList?.find(d => d?.is_default === 1);

      let updated = mfgLiveList?.map(x => {
        return {
          ...x,
          factory: x?.factory ? x?.factory : location?._id,
        };
      });
      setMfgData(updated || []);
    }
  }, [factoryLocationList, dispatch, mfgLiveList]);

  useEffect(() => {
    if (
      Object.entries(mfgProcessPrintingById).length > 0 &&
      allSuggestedRollList?.length > 0
    ) {
      // let changeUpdateField = {};

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

      // if (mfgProcessPrintingById?.roll_printed?.length > 0) {
      //   changeUpdateField = {
      //     ...changeUpdateField,
      //     completed: mfgProcessPrintingById?.completed === true ? 1 : 0,
      //     partial: mfgProcessPrintingById?.partial === true ? 1 : 0,
      //   };
      // }

      dispatch(
        setprintingData({
          ...printingData,
          // ...(mfgProcessPrintingById?.hasOwnProperty('completed') && {
          //   completed: mfgProcessPrintingById?.completed === true ? 1 : 0,
          // }),
          // ...(mfgProcessPrintingById?.hasOwnProperty('partial') && {
          //   partial: mfgProcessPrintingById?.partial === true ? 1 : 0,
          // }),
          print_technology_id: mfgProcessPrintingById?.print_technology_id,
          product_id: mfgProcessPrintingById?.product_id,
        }),
      );

      let assignData = [...combinedPrintedRollsData];
      if (assignedRoll?.length > 0) {
        assignData = [...assignedRoll];
      }

      setAssignedRoll(assignData);
      dispatch(setAssignedRollList(assignData));
    }
  }, [mfgProcessPrintingById, allSuggestedRollList, dispatch]);

  useEffect(() => {
    if (
      Object.entries(mfgProcessPrintingById).length > 0 &&
      suggestedProductList?.length > 0
    ) {
      let data = suggestedProductList?.filter(
        d => d?._id === mfgProcessPrintingById?.suggested_product_id,
      );
      let updatedData = data?.map(i => {
        return {
          ...i,
          warehouse: i?.warehouse?.map(d => {
            return {
              ...d,
              label: d?.name,
              value: d?._id,
            };
          }),
        };
      });
      let selectedWarehouse = updatedData[0]?.warehouse.filter(
        d => d?._id === mfgProcessPrintingById?.warehouse,
      );
      setSelectedProductFromSuggested(updatedData[0]);
      dispatch(
        setBagToBagData({
          ...bagToBagData,
          suggested_product_id: mfgProcessPrintingById?.suggested_product_id,
          warehouse: mfgProcessPrintingById?.warehouse,
          qty_used: mfgProcessPrintingById?.qty_used,
          in_stock: selectedWarehouse ? selectedWarehouse[0]?.qty : 0,
          wastage: mfgProcessPrintingById?.wastage,
          bag_printed: mfgProcessPrintingById?.bag_printed,
          // ...(mfgProcessPrintingById?.hasOwnProperty('partial') && {
          //   partial: mfgProcessPrintingById?.partial === true ? 1 : 0,
          // }),
          // ...(mfgProcessPrintingById?.hasOwnProperty('completed') && {
          //   completed: mfgProcessPrintingById?.completed === true ? 1 : 0,
          // }),
          product_id: mfgProcessPrintingById?.product_id,
        }),
      );
    }
  }, [mfgProcessPrintingById, suggestedProductList, dispatch]);

  useEffect(() => {
    if (updatedPrintStatus?.length > 0) {
      let obj = {};
      updatedPrintStatus?.map((d, i) => {
        obj = {
          ...obj,
          [`value_${i}_${i + 1}`]: {
            ...d,
          },
        };
      });
      dispatch(setPrintTechnologyList([obj]));
      dispatch(setUpdatedPrintStatus([]));

      dispatch(
        getmfgLiveList(
          pageLimit,
          currentPage,
          searchQuery,
          applied,
          dates,
          field_filter,
        ),
      );
    }
  }, [
    updatedPrintStatus,
    printTechnologyList,
    dispatch,
    applied,
    dates,
    searchQuery,
    currentPage,
    pageLimit,
    field_filter,
  ]);

  const laminationOptions = useMemo(() => {
    const updatedLaminationData = activeLaminationTypeList?.map(item => {
      return { label: item?.label, value: item.label };
    });
    return [
      ...updatedLaminationData,
      { label: 'Non Laminated', value: 'Non Laminated' },
    ];
  }, [activeLaminationTypeList]);

  const sumWithNetWTBags = useMemo(() => {
    return batchEntryList.reduce(
      (accumulator, currentValue) =>
        Number(accumulator) + Number(currentValue?.net_weight_bag),
      0,
    );
  }, [batchEntryList]);

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  };

  const onDownload = useCallback(e => {
    e.stopPropagation();
  }, []);

  function infinityToZero(value) {
    if (value === Infinity || value === -Infinity || isNaN(value)) {
      return 0;
    } else {
      return parseFloat(Number(value)?.toFixed(2));
    }
  }

  function nanToZero(value) {
    if (isNaN(value)) {
      return 0;
    } else {
      return parseFloat(Number(value).toFixed(2));
    }
  }

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total" colSpan={16} />
        {/* QTY PCS */}
        <Column
          style={{ textAlign: 'end' }}
          footer={
            mfgLiveTotalQty ? roundValueThousandSeparator(mfgLiveTotalQty) : ''
          }
        />
        <Column footer="" colSpan={5} />
        {/* QTY KGS */}
        <Column
          style={{ textAlign: 'end' }}
          footer={
            mfgLiveAllData?.total_kgqty
              ? roundValueThousandSeparator(mfgLiveAllData?.total_kgqty)
              : ''
          }
        />
        <Column footer="" colSpan={2} />
        {/* Amount */}
        <Column
          style={{ textAlign: 'end' }}
          footer={
            mfgLiveAllData?.total_amount
              ? `₹${roundValueThousandSeparator(mfgLiveAllData?.total_amount)}`
              : ''
          }
        />
        <Column footer="" colSpan={19} />
      </Row>
    </ColumnGroup>
  );

  const customNoColumn = (data, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
  };
  const printTechnology = (data, index) => {
    return <p>{data?.print_technology_name}</p>;
  };

  const sizeTemplate = option => {
    return (
      <>
        <span className="d-block">{`${
          option?.width ? 'W ' + option.width : ''
        }`}</span>
        <span className="d-block">{`${
          option?.length ? 'X L ' + option.length : ''
        }`}</span>
      </>
    );
  };

  const mainTableRollWidthTemplate = rowData => {
    return <span>{rowData?.roll_width ? `${rowData?.roll_width}”` : ''}</span>;
  };

  const orderNoTemplate = data => {
    return (
      <span
        onClick={() => {
          navigate(`/order-details/${data?.salesOrder_id}`);
        }}
      >
        {data?.order_no}
      </span>
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

  const inputTemplate = data => {
    return (
      <InputText
        placeholder="0"
        type="number"
        name="bag_made"
        value={data?.bag_made}
        onChange={e => {
          handleChangeTableData(e.target.value, data, 'bag_made');
        }}
      />
    );
  };

  const totalBundalTemplate = data => {
    return (
      <InputText
        placeholder="0"
        type="number"
        name="total_bundle"
        value={data?.total_bundle}
        onChange={e => {
          handleChangeTableData(e.target.value, data, 'total_bundle');
        }}
      />
    );
  };

  const emptyBundleTemplate = data => {
    return (
      <InputText
        placeholder="0"
        type="number"
        name="empty_bundle_weight"
        value={data?.empty_bundle_weight}
        onChange={e => {
          handleChangeTableData(e.target.value, data, 'empty_bundle_weight');
        }}
      />
    );
  };

  const grossWeightTemplate = data => {
    return (
      <InputText
        placeholder="0"
        type="number"
        name="gross_weight_bag"
        value={data?.gross_weight_bag}
        onChange={e => {
          handleChangeTableData(e.target.value, data, 'gross_weight_bag');
        }}
      />
    );
  };

  const dateTemplate = data => {
    return (
      <div className="form_group date_select_wrapper custom_calender">
        <Calendar
          id="ConsumptionDate"
          value={data?.batch_date}
          placeholder="Select Date Range"
          showIcon
          showButtonBar
          maxDate={new Date()}
          dateFormat="dd-mm-yy"
          readOnlyInput
          onChange={e => {
            const utcDate = new Date(e.value);
            handleChangeTableData(utcDate, data, 'batch_date');
          }}
        />
      </div>
    );
  };

  const actionTemplate = data => {
    return (
      <p
        className="m-0 d-flex align-items-center text_primary cursor-pointer justify-content-center"
        onClick={e => {
          setWhatsappPopup(data?._id);
          dispatch(
            setAllFilters({
              ...allFilters,
              mfgLive: {
                ...allFilters?.mfgLive,
                whatsappData: data,
              },
            }),
          );
        }}
      >
        <img src={WhatsappIcon} alt="WhatsappIcon" className="me-1" />
        {/* <span>WhatsApp</span> */}
      </p>
    );
  };

  const actionDeleteTemplate = data => {
    return (
      <ul className="d-flex">
        <li>
          <button className="btn_transperant">
            <img src={TrashIcon} alt="" onClick={() => handleDelete(data)} />
          </button>
        </li>
      </ul>
    );
  };

  const factoryLocationTemplate = data => {
    return (
      <ReactSelectSingle
        TakeAction
        value={data?.factory}
        options={factoryLocationList || []}
        onChange={e => {
          handleChangeData(e.target.value, data);
        }}
        placeholder="Select City"
      />
    );
  };

  const printBedgeBodyTemplate = (val, val_str, id, data) => {
    return (
      <button
        className={`bedge_${getSeverity(val)}`}
        onClick={e => {
          onClickOnPrint(data, id);
        }}
      >
        {val_str}
      </button>
    );
  };

  const laminationTemplate = item => {
    const lamination = [...(item?.lamination_type_name || [])]?.sort();
    return (
      <div>
        {lamination?.length > 0 ? (
          lamination?.map((value, i) => {
            const lamination_name = value?.toLowerCase();
            return (
              <Tag
                key={i}
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

  const amountTemplate = rowItem => {
    return (
      <span>
        {' '}
        {rowItem?.amount
          ? `₹${roundValueThousandSeparator(
              convertThousandToNumeric(rowItem?.amount),
            )}`
          : ''}{' '}
      </span>
    );
  };

  const cylinderTemplate = rowItem => {
    return <span> {rowItem?.cylinder ? `${rowItem?.cylinder}”` : ''} </span>;
  };

  const handleCheckboxTemplate = data => {
    // setAssignedRoll(data.value);
    setCheckedAssignedRoll(data);
  };

  const bagMadeBodyTemplate = (val, val_str, id) => {
    return (
      <button
        className={`bedge_${getSeverity(val)}`}
        onClick={async e => {
          let res = await dispatch(viewBagMadeData(id));
          if (res) {
            setBagMadeModal({ isView: true, id: id });
          }
        }}
      >
        {val_str}
      </button>
    );
  };

  const representativesItemTemplate = option => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{option}</span>
      </div>
    );
  };

  const statusRowFilterTemplate = (options, name) => {
    return (
      <div className="form_group">
        <Dropdown
          value={options.value}
          options={
            name === 'roll'
              ? rollMenuOption
              : name === 'str_ord'
              ? strOrdMenuOption
              : commonMenuOption
          }
          itemTemplate={representativesItemTemplate}
          onChange={e => {
            options.filterApplyCallback(e.value);
          }}
          showClear={options.value}
          placeholder=""
          className="p-column-filter select_filter"
        />
      </div>
      // <div className="form_group">
      //   <MultiSelect
      //     // filter
      //     maxSelectedLabels={3}
      //     options={
      //       name === 'roll'
      //         ? rollMenuOption
      //         : name === 'str_ord'
      //         ? strOrdMenuOption
      //         : commonMenuOption
      //     }
      //     placeholder=""
      //     itemTemplate={representativesItemTemplate}
      //     value={options.value}
      //     className="w-100"
      //     onChange={e => {
      //       options.filterApplyCallback(e.value);
      //     }}
      //   />
      // </div>
    );
  };

  const totalCount = (data, key) => {
    const newData = data?.length > 0 ? data : [];

    const total = newData?.reduce((sum, cuurent) => {
      if (Object.keys(cuurent)?.includes(key)) {
        return sum + Number(cuurent[key]);
      } else {
        return sum;
      }
    }, 0);

    return total?.toFixed(2);
  };

  const handleWeightChange = (isHandleAutoVal, autoValue, actualValue) => {
    let list = [...batchEntryList];
    let totalBag = totalCount(list, 'bag_made');
    let totalNetWtBAG = totalCount(list, 'net_weight_bag');
    let handleWeight = isHandleAutoVal === 1 ? autoValue : actualValue;
    let totalHandleWeight = (Number(totalBag) * handleWeight) / 1000;
    let netWtOfBag = Number(totalNetWtBAG) - totalHandleWeight;
    let wastage = bagMadeAllData?.total_fabric - netWtOfBag;
    let wastagePer = (wastage / bagMadeAllData?.total_fabric) * 100;
    setBatchEntryList(list);
    setBagMadeAllData({
      ...bagMadeAllData,
      total: totalBag,
      netWeightOfBag: netWtOfBag?.toFixed(2),
      wastage: parseFloat(Number(wastage).toFixed(2)),
      // wastage_percentage: parseFloat(Number(wastagePer).toFixed(2)),
      wastage_percentage: infinityToZero(wastagePer),
      auto_handle_weight: autoValue,
      act_handle_weight: actualValue,
    });
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

  const filterOption = useMemo(() => {
    let fData = [];
    if (currentUser?.role_name?.toLowerCase() !== 'designer') {
      fData = [...mfgLiveFilterDetails, ...mfgLiveFilterDetailsDesigner];
    } else {
      fData = mfgLiveFilterDetailsDesigner;
    }
    let flterOptionArray = fData;
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
      present_advisor: partiesAdvisor,
      roll_available: rollOption,
      hndl: commonOption,
      old_str: commonOption,
      str_ord: strOrdOption,
      str_rcv: commonOption,
      print: commonOption,
      bag_made: commonOption,
      bag_sent: commonOption,
      lr_sent: commonOption,
      factory: factoryLocationList,
      // is_laminated: commonOption,
      lamination_typename: laminationOptions,
      print_technology_id: activePrintTechnologyList,
    };
  }, [
    partiesAdvisor,
    laminationOptions,
    factoryLocationList,
    activePrintTechnologyList,
  ]);

  const selectedFilters = filters?.map(filter => {
    let fData = [];
    if (currentUser?.role_name?.toLowerCase() !== 'designer') {
      fData = [...mfgLiveFilterDetails, ...mfgLiveFilterDetailsDesigner];
    } else {
      fData = mfgLiveFilterDetailsDesigner;
    }
    const filterDetail = fData?.find(detail => detail.value === filter.filter);
    return filterDetail ? filterDetail : null;
  });

  const handleChangeTableData = (e, option, key) => {
    let list = [...batchEntryList];
    const index = list?.findIndex(x => x?.id === option?.id);
    const oldObj = list[index];
    const updatedObj = {
      ...oldObj,
      [key]: e,
    };
    if (index >= 0) list[index] = updatedObj;
    let netWeightBag = 0;
    let averageWtPerBag = 0;
    if (key === 'total_bundle') {
      netWeightBag =
        Number(list[index]['gross_weight_bag']) -
        e * Number(list[index]['empty_bundle_weight']);
      averageWtPerBag = netWeightBag / Number(list[index]['bag_made']);
      let gramAvgPerBag = averageWtPerBag * 1000;
      list[index]['net_weight_bag'] = netWeightBag
        ? netWeightBag?.toFixed(2)
        : 0;
      list[index]['avg_bag_weight'] = gramAvgPerBag
        ? gramAvgPerBag?.toFixed(2)
        : 0;
    }
    if (key === 'gross_weight_bag') {
      netWeightBag =
        e -
        Number(list[index]['total_bundle']) *
          Number(list[index]['empty_bundle_weight']);
      averageWtPerBag = netWeightBag / Number(list[index]['bag_made']);
      let gramAvgPerBag = averageWtPerBag * 1000;
      list[index]['net_weight_bag'] = netWeightBag
        ? netWeightBag?.toFixed(2)
        : 0;
      list[index]['avg_bag_weight'] = gramAvgPerBag
        ? gramAvgPerBag?.toFixed(2)
        : 0;
    }
    if (key === 'empty_bundle_weight') {
      netWeightBag =
        Number(list[index]['gross_weight_bag']) -
        Number(list[index]['total_bundle']) * e;

      averageWtPerBag = netWeightBag / Number(list[index]['bag_made']);
      let gramAvgPerBag = averageWtPerBag * 1000;
      list[index]['net_weight_bag'] = netWeightBag
        ? netWeightBag?.toFixed(2)
        : 0;
      list[index]['avg_bag_weight'] = gramAvgPerBag
        ? gramAvgPerBag?.toFixed(2)
        : 0;
    }
    if (key === 'bag_made') {
      averageWtPerBag = Number(list[index]['net_weight_bag'] / e);
      let gramAvgPerBag = averageWtPerBag * 1000;
      list[index]['avg_bag_weight'] = gramAvgPerBag
        ? gramAvgPerBag?.toFixed(2)
        : 0;
    }
    let totalBag = totalCount(list, 'bag_made');
    let totalNetWtBAG = totalCount(list, 'net_weight_bag');
    let AvgWtPerBag = totalCount(list, 'avg_bag_weight');
    let theoriticalRate = (bagMadeData?.per_pc * AvgWtPerBag) / 1000;
    let handleWeight =
      isHandleAuto === 1
        ? bagMadeAllData?.auto_handle_weight
        : bagMadeAllData?.act_handle_weight;
    let totalHandleWeight = (Number(totalBag) * handleWeight) / 1000;
    let netWtOfBag = Number(totalNetWtBAG) - totalHandleWeight;
    let wastage = bagMadeAllData?.total_fabric - netWtOfBag;
    let wastagePer = (wastage / bagMadeAllData?.total_fabric) * 100;
    let wastageRate =
      (bagMadeAllData?.roll_rate * Number(wastage)) /
      bagMadeAllData?.roll_weight;
    let costPrice =
      bagMadeAllData?.conversion_rate +
      Number(wastageRate) +
      bagMadeAllData?.additional_mfg_cost;
    let sellingPrice = bagMadeAllData?.per_pc;
    let profit = sellingPrice - Number(costPrice) / sellingPrice;

    // Nett weight = Gross weight - (No. Of bundles* wt of empty bundle)
    // Avg wt per bag = Nett weight / total number of bags
    setBatchEntryList(list);
    setBagMadeAllData({
      ...bagMadeAllData,
      total: totalBag,
      netWeightOfBag: netWtOfBag?.toFixed(2),
      wastage: parseFloat(Number(wastage).toFixed(2)),
      wastage_percentage: infinityToZero(wastagePer),
      profit: infinityToZero(profit),
      theoriticalRate:
        bagMadeAllData?.unit_pc === true
          ? parseFloat(Number(theoriticalRate).toFixed(2))
          : 0,
    });
  };

  const handleFilterDelete = async (e, data, index) => {
    const res = await dispatch(
      deleteFilter({
        filter_id: data?._id,
        module_name: 'mfg_live',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLive: {
            ...allFilters?.mfgLive,
            currentPage: 1,
            filters: [],
            selectedItemIndex: '',
            applied: {},
          },
        }),
      );
      dispatch(
        getListFilter({
          module_name: 'mfg_live',
        }),
      );
      dispatch(
        getmfgLiveList(pageLimit, 1, searchQuery, {}, dates, field_filter),
      );

      op.current?.hide();
    }
  };

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    const filter_fields = [
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
            [item.filter]: filter_fields.includes(item?.filter)
              ? Number(item.value)
              : item.value,
          },
        };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLive: { ...allFilters?.mfgLive, applied: filterObj },
        }),
      );
      dispatch(
        getmfgLiveList(
          pageLimit,
          currentPage,
          searchQuery,
          filterObj,
          dates,
          field_filter,
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
    field_filter,
  ]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(
          getmfgLiveList(
            pageLimit,
            currentPage,
            searchQuery,
            {},
            dates,
            field_filter,
          ),
        );
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLive: {
              ...allFilters?.mfgLive,
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
            mfgLive: {
              ...allFilters?.mfgLive,
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
      field_filter,
      allFilters,
    ],
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
        mfgLive: { ...allFilters?.mfgLive, filters: updatedFilters },
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
        module_name: 'mfg_live',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'mfg_live',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'mfg_live',
        }),
      );
      op.current?.hide();
    }
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  };

  const handleFilterEdit = (data, index) => {
    const sortingFiletr = [
      ...mfgLiveFilterDetails,
      ...mfgLiveFilterDetailsDesigner,
    ];

    const updatedFilterData = {
      ...data,
      filter_list: data?.filter_list?.map(item => {
        const findObj = sortingFiletr?.find(
          obj => obj?.value === item?.filter && obj?.type === 'dropDown',
        );
        const checkDropDownList = [
          'hndl',
          'old_str',
          'str_rcv',
          'print',
          'bag_made',
          'bag_sent',
          'lr_sent',
        ]?.includes(findObj?.value);

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
          } else if (findObj?.value === 'str_ord') {
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
        mfgLive: {
          ...allFilters?.mfgLive,
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
        mfgLive: {
          ...allFilters?.mfgLive,
          filters: [...allFilters?.mfgLive?.filters, { filter: '', value: '' }],
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
        Object.keys(allFilters?.mfgLive?.applied)?.length > 0;

      if (checkAppliedFilter) {
        dispatch(
          getmfgLiveList(
            pageLimit,
            currentPage,
            searchQuery,
            {},
            dates,
            field_filter,
          ),
        );
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLive: {
            ...allFilters?.mfgLive,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.mfgLive?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.mfgLive.selectedItemIndex !== ''
                ? ''
                : allFilters.mfgLive.selectedItemIndex,
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

  const handleDelete = useCallback(
    data => {
      if (data) {
        const list = batchEntryList?.filter(i => i?.id !== data?.id);
        let totalBag = totalCount(list, 'bag_made');
        let totalNetWtBAG = totalCount(list, 'net_weight_bag');
        let handleWeight =
          isHandleAuto === 1
            ? bagMadeAllData?.auto_handle_weight
            : bagMadeAllData?.act_handle_weight;
        let totalHandleWeight = (Number(totalBag) * handleWeight) / 1000;
        let netWtOfBag = Number(totalNetWtBAG) - totalHandleWeight;
        let wastage = bagMadeAllData?.total_fabric - netWtOfBag;
        let wastagePer = (wastage / bagMadeAllData?.total_fabric) * 100;
        let wastageRate =
          (bagMadeAllData?.roll_rate * Number(wastage)) /
          bagMadeAllData?.roll_weight;
        let costPrice =
          bagMadeAllData?.conversion_rate +
          Number(wastageRate) +
          bagMadeAllData?.additional_mfg_cost;
        let sellingPrice = bagMadeAllData?.per_pc;
        let profit = sellingPrice - Number(costPrice) / sellingPrice;
        // Nett weight = Gross weight - (No. Of bundles* wt of empty bundle)
        // Avg wt per bag = Nett weight / total number of bags
        setBatchEntryList(list);
        setBagMadeAllData({
          ...bagMadeAllData,
          total: totalBag,
          netWeightOfBag: netWtOfBag?.toFixed(2),
          wastage: parseFloat(Number(wastage).toFixed(2)),
          wastage_percentage: infinityToZero(wastagePer),
          profit: infinityToZero(profit),
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, batchEntryList],
  );

  const handleChangeData = async (e, data) => {
    let res = await dispatch(
      updateFactoryStatus({
        process_id: data?._id,
        factory: e,
      }),
    );
    if (res) {
      dispatch(
        getmfgLiveList(
          pageLimit,
          currentPage,
          searchQuery,
          applied,
          dates,
          field_filter,
        ),
      );
    }
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
          mfgLive: { ...allFilters?.mfgLive, currentPage: pageIndex },
        }),
      );
      dispatch(
        getmfgLiveList(
          pageLimit,
          pageIndex,
          searchQuery,
          applied,
          dates,
          field_filter,
        ),
      );
    },
    [
      currentPage,
      dispatch,
      allFilters,
      pageLimit,
      searchQuery,
      applied,
      dates,
      field_filter,
    ],
  );

  const onPageRowsChange = useCallback(
    page => {
      const updateCurrentPage = page === 0 ? 0 : 1;
      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLive: {
            ...allFilters?.mfgLive,
            currentPage: updateCurrentPage,
            pageLimit: page,
          },
        }),
      );
      dispatch(
        getmfgLiveList(
          page,
          updateCurrentPage,
          searchQuery,
          applied,
          dates,
          field_filter,
        ),
      );
    },
    [allFilters, applied, dates, dispatch, field_filter, searchQuery],
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

  const handleBodyChange = useCallback(
    async (val, val_str, name, id) => {
      if (name === 'str_ord') {
        let payload = {
          process_id: id,
          status: StrOrdCase(val),
        };
        let res = await dispatch(updateStrOrderStatus(payload));
        if (res) {
          dispatch(
            getmfgLiveList(
              pageLimit,
              currentPage,
              searchQuery,
              applied,
              dates,
              field_filter,
            ),
          );
        }
      }
      if (name === 'str_rcv') {
        let payload = {
          process_id: id,
          status: commonCase(val),
        };
        let res = await dispatch(updateStrReceiveStatus(payload));
        if (res) {
          dispatch(
            getmfgLiveList(
              pageLimit,
              currentPage,
              searchQuery,
              applied,
              dates,
              field_filter,
            ),
          );
        }
      }
      if (name === 'hndl') {
        let payload = {
          process_id: id,
          status: commonCase(val),
        };
        let res = await dispatch(updateHandleStatus(payload));
        if (res) {
          dispatch(
            getmfgLiveList(
              pageLimit,
              currentPage,
              searchQuery,
              applied,
              dates,
              field_filter,
            ),
          );
        }
      }

      if (name === 'bag_sent') {
        let payload = {
          process_id: id,
          status: commonCase(val),
        };
        let res = await dispatch(updateBagSentStatus(payload));
        if (res) {
          dispatch(
            getmfgLiveList(
              pageLimit,
              currentPage,
              searchQuery,
              applied,
              dates,
              field_filter,
            ),
          );
        }
      }
      if (name === 'lr_sent') {
        let payload = {
          process_id: id,
          status: commonCase(val),
        };
        let res = await dispatch(updateLrSentStatus(payload));
        if (res) {
          dispatch(
            getmfgLiveList(
              pageLimit,
              currentPage,
              searchQuery,
              applied,
              dates,
              field_filter,
            ),
          );
        }
      }
    },
    [
      applied,
      searchQuery,
      currentPage,
      pageLimit,
      dates,
      field_filter,
      dispatch,
    ],
  );

  const bedgeBodyTemplate = useCallback(
    (val, val_str, name, id) => {
      if (name === 'roll') {
        return (
          <span
            className={`bedge_${getNewSeverity(val)}`}
            onClick={e => {
              handleBodyChange(val, val_str, name, id);
            }}
          >
            {val_str}
          </span>
        );
      } else if (name === 'str_ord') {
        return (
          <button
            className={`bedge_${getNewSeverity(val)}`}
            onClick={e => {
              handleBodyChange(val, val_str, name, id);
            }}
          >
            {val_str}
          </button>
        );
      } else if (name === 'old_str') {
        return (
          <span
            className={`bedge_${getSeverity(val)}`}
            onClick={e => {
              handleBodyChange(val, val_str, name, id);
            }}
          >
            {val_str}
          </span>
        );
      } else {
        return (
          <button
            className={`bedge_${getSeverity(val)}`}
            onClick={e => {
              handleBodyChange(val, val_str, name, id);
            }}
          >
            {val_str}
          </button>
        );
      }
    },
    [handleBodyChange],
  );

  const PrintDetailTemplate = useCallback(
    (e, i) => {
      let status = Object.values(e)?.[i]?.status || false;
      let title = Object.values(e)?.[i]?.title || '';
      let id = Object.values(e)?.[i]?._id || '';
      const commonRotoPrintTechnology = [
        'flexo print',
        'screen print (r 2 r)',
        'roto gravure',
        'plain print',
        'semi roto',
      ];
      const commonBtoBPrintTechnology = [
        'screen print (b 2 b)',
        'hot stamping',
      ];

      return (
        <button
          className={`bedge_${getSeverity(status === 1 ? true : false)}`}
          onClick={async e => {
            setCheckedAssignedRoll([]);
            setAssignedRoll([]);
            dispatch(setAssignedRollList([]));
            setChangeRollDate(new Date());
            const data = mfgData?.filter(d => d?._id === newTableModal?.id);
            setJobId(data[0]);
            setPrintTechnologyId(id);
            if (
              // title === 'FLEXO PRINT' ||
              // title === 'SCREEN PRINT (R 2 R)' ||
              // title === 'ROTO GRAVURE' ||
              // title === 'PLAIN PRINT' ||
              commonRotoPrintTechnology.includes(title?.toLowerCase())
            ) {
              setPrintingTableModal(true);
              if (data?.length > 0) {
                dispatch(getProductDetailById(data[0]?.product_id));

                const printing_res = await dispatch(
                  viewMfgProcessPrintingById(id, data[0]?._id),
                );

                dispatch(
                  setprintingData({
                    ...printingData,
                    print_technology_id: id,
                    process_id: data[0]?._id,
                    product_id: data[0]?.product_id,
                    pending_bag: printing_res.hasOwnProperty('pending_bag')
                      ? printing_res?.pending_bag
                      : data[0]?.quantity,
                    ...(printing_res?.hasOwnProperty('completed') && {
                      completed: printing_res?.completed === true ? 1 : 0,
                    }),
                    ...(printing_res?.hasOwnProperty('partial') && {
                      partial: printing_res?.partial === true ? 1 : 0,
                    }),
                  }),
                );

                const hasNotEmptyArray = Object.values(print_field_filter).some(
                  property => {
                    return property.length > 0;
                  },
                );

                await dispatch(
                  getSuggestedRollList(
                    data[0]?.job_id,
                    id,
                    ...(hasNotEmptyArray ? [print_field_filter] : []),
                    // print_field_filter,
                    // checkPrintFilterValues,
                  ),
                );

                // if (
                //   response?.roll_printed?.length > 0 ||
                //   (res?.data?.length === 0 &&
                //     response?.roll_printed?.length > 0)
                // ) {
                //   dispatch(
                //     getSuggestedRollList(
                //       data[0]?.job_id,
                //       id,
                //       // print_field_filter,
                //       // checkPrintFilterValues,
                //     ),
                //   );
                // }
              }
            }
            if (commonBtoBPrintTechnology.includes(title?.toLowerCase())) {
              setScreenTableModal(true);
              if (data?.length > 0) {
                const printing_res = await dispatch(
                  viewMfgProcessPrintingById(id, data[0]?._id),
                );

                dispatch(
                  setBagToBagData({
                    ...bagToBagData,
                    print_technology_id: id,
                    product_id: data[0]?.product_id,
                    process_id: data[0]?._id,
                    // pending_bag: data[0]?.pending_bag,
                    pending_bag: printing_res.hasOwnProperty('pending_bag')
                      ? printing_res?.pending_bag
                      : data[0]?.quantity,
                    ...(printing_res?.hasOwnProperty('partial') && {
                      partial: printing_res?.partial === true ? 1 : 0,
                    }),
                    ...(printing_res?.hasOwnProperty('completed') && {
                      completed: printing_res?.completed === true ? 1 : 0,
                    }),
                  }),
                );

                dispatch(getSuggestedProductList(data[0]?.product_id));
                dispatch(getProductDetailById(data[0]?.product_id));
              }
            }
            // if (title === 'ROTO GRAVURE') {
            //   let newObj = {
            //     print_technology_id: id,
            //     process_id: data[0]?._id,
            //     status: status === 0 || status === false ? 1 : 0,
            //   };
            //   let res = await dispatch(updatePrintStatus(newObj));
            // }
          }}
        >
          {status === 1 ? 'YES' : 'NO'}
        </button>
      );
    },
    [mfgData, newTableModal?.id, dispatch, printingData],
  );

  const handleAddRolls = e => {
    const selectedDate = getFormattedDate(new Date(changeRollDate));

    // ** add selected_date field to checked (assignedRoll) data **//
    const modifyCheckedData = checkedAssignedRoll?.map(checked => {
      return {
        ...checked,
        selected_date: selectedDate,
        // print_technology_name: mfgProcessPrintingById?.print_technology,
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

  const onClickOnPrint = useCallback(
    (data, id) => {
      let obj = {};
      activePrintTechnologyList.map((item, index) => {
        data.find((item2, index2) => {
          if (item2._id === item._id) {
            obj = {
              ...obj,
              // [`key_${index}_${index2}`]: item2.status,
              [`value_${index}_${index2}`]: {
                title: item.name,
                status: item2.status,
                _id: item._id,
              },
            };
          }
        });
      });
      dispatch(setPrintTechnologyList([obj]));
      setNewTableModal({
        id: id,
        isView: true,
      });
    },
    [activePrintTechnologyList, dispatch],
  );

  const renderPrintTechnologyList = useMemo(() => {
    let finalTable =
      (printTechnologyList?.length > 0 &&
        Object.entries(printTechnologyList[0])?.map((data, i) => {
          return (
            <Column
              key={i}
              field="status"
              header={data[1]?.title}
              body={e => PrintDetailTemplate(e, i)}
              sortable
            ></Column>
          );
        })) ||
      [];
    return finalTable;
  }, [PrintDetailTemplate, printTechnologyList]);

  const footerContent = (
    <>
      <div className="mt-2 d-flex justify-content-end">
        <Button
          className="btn_border me-2"
          onClick={() => {
            setBagMadeModal({ isView: false, id: '' });
            setBatchEntryList([]);
            setBagMadeAllData(initialBagMade);
          }}
        >
          Cancel
        </Button>
        <Button
          className="btn_primary"
          onClick={async e => {
            let newObj = {
              ...bagMadeAllData,
              stereo_charge: Number(bagMadeAllData?.stereo_charge),
              act_stereo_charge: Number(bagMadeAllData?.act_stereo_charge),
              additional_mfg_cost: Number(bagMadeAllData?.additional_mfg_cost),
              batch: batchEntryList,
              process_id: bagMadeModal?.id,
              is_handle_weight_auto: isHandleAuto === 1 ? true : false,
            };
            const res = await dispatch(addBagDetailForBagMade(newObj));

            if (res) {
              setBagMadeModal({ isView: false, id: '' });
              setBatchEntryList([]);
              setBagMadeAllData(initialBagMade);
              dispatch(
                getmfgLiveList(
                  pageLimit,
                  currentPage,
                  searchQuery,
                  applied,
                  dates,
                  field_filter,
                ),
              );
            }
          }}
        >
          Save
        </Button>
      </div>
    </>
  );

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
                  suggestedFilterToggle: false,
                  assignedFilterToggle: false,
                  print_field_filter: blank_print_field_filter,
                },
              }),
            );
            dispatch(setViewProductDetailData({}));
            setAssignedRoll([]);
            dispatch(setAssignedRollList([]));
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

            // if (updatedPrintedRoll?.length > 0) {
            //** store all assigned printed roll IDs: **//
            // updatedPrintedRoll?.forEach(x => rollId.push(x?._id));

            // updatedPrintedRoll?.forEach(x => {
            //   let dateFormateRolldata = {
            //     date: x?.selected_date,
            //     roll: [],
            //   };

            //   if (rollData?.roll?.length > 0) {
            //     const abc = rollData.find(
            //       roll =>
            //         moment(roll.date).format('YYYY-MM-DD') ===
            //         moment(x.date).format('YYYY-MM-DD'),
            //     );
            //     if (abc) {
            //       let updatedList = [...rollData];
            //       const index = updatedList?.findIndex(
            //         x =>
            //           moment(x.date).format('YYYY-MM-DD') ===
            //           moment(abc.selected_date).format('YYYY-MM-DD'),
            //       );

            //       if (index !== -1) {
            //         const oldObj = updatedList[index];
            //         const updatedObj = {
            //           ...oldObj,
            //           roll: [...oldObj.roll, x._id],
            //         };
            //         updatedList[index] = updatedObj;
            //         rollData = updatedList;
            //       }
            //     } else {
            //       dateFormateRolldata?.roll?.push(x._id);
            //       rollData.push(dateFormateRolldata);
            //     }
            //   } else {
            //     dateFormateRolldata?.roll?.push(x._id);
            //     rollData.push(dateFormateRolldata);
            //   }
            // });

            if (updatedPrintedRoll?.length > 0) {
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
                    suggestedFilterToggle: false,
                    assignedFilterToggle: false,
                  },
                }),
              );
              dispatch(setViewProductDetailData({}));
              setAssignedRoll([]);
              dispatch(setAssignedRollList([]));
              setCheckedAssignedRoll([]);
              dispatch(setSuggestedRollList([]));
              dispatch(setClearPrintingData());
            }
            // }
            // }
            // }
          }}
        >
          Save
        </Button>
      </div>
    </>
  );

  const handleWhatsAppShare = data => {
    if (!data) return;
    const text = `${data?.productTitle}\n${data?.productType}\n${data?.productDescription}\n---------------------------------\n${data?.productDetails}\n\n${data?.oldStereo}`;

    const encodedMessage = encodeURIComponent(text);
    const productDetail = data?.productDetails?.split('\n');
    const updatedProductDetailsObj = {};

    // Extract Product Details:
    if (productDetail?.length > 0) {
      productDetail?.forEach((line, index) => {
        if (index === 0 && line?.includes('Bags')) {
          updatedProductDetailsObj['Bags'] = line;
        } else {
          if (['D - CUT', 'D - CUT WITH UF'].includes(data?.productType)) {
            updatedProductDetailsObj['Handle Color'] = null;
          }
          const [key, value] = line?.split(':');
          updatedProductDetailsObj[key.trim()] = value ? value.trim() : '';
        }
      });
    }

    const jsonObject = {
      ...updatedProductDetailsObj,
      ETD: null,
      img: data?.img,
      oldStereo: data?.oldStereo ? data?.oldStereo : '',
      productTitle: data?.productTitle,
      productType: data?.productType,
      productDescription: data?.productDescription,
    };

    // Converting the object to JSON format
    const jsonFormattedText = JSON.stringify(jsonObject);
    const base_url = 'http://cloud-dev.bagsguru.in?';
    const encodedDetails = encodeURIComponent(jsonFormattedText);

    // For WhatsApp Web (URL will be opened in a new tab)
    // const whatsappWebLink = `https://web.whatsapp.com/send?text=${encodedMessage}`;
    // window.open(whatsappWebLink, '_blank');

    // For WhatsApp Web (URL will be opened in a new tab)
    const whatsappWebLink = `https://web.whatsapp.com/send?text=${encodedMessage}`;

    // For WhatsApp app (mobile devices)
    // Old Flow :(direct open whatsapp in mobile view)
    // const whatsappAppLink = `whatsapp://send?text=${encodedMessage}`;

    // New Flow :(first of open bags-guru app then after open whatsapp in mobile view)
    const whatsappAppLink = base_url + 'details=' + encodedDetails;

    // Check if the user is on a mobile device
    if (isMobileDevice()) {
      // Redirect to WhatsApp app
      window.location.href = whatsappAppLink;
    } else {
      // Open WhatsApp Web link in a new tab
      window.open(whatsappWebLink, '_blank');
    }
  };

  const onCopyText = useCallback(
    key => {
      let text = '';
      const img = whatsappData?.main_image;
      const oldStereo =
        whatsappData?.old_str === true ? '*OLD BLOCK*' : '*NEW BLOCK*';
      const productTitle = whatsappData?.design?.toUpperCase();
      const productType = whatsappData?.bag_type ? whatsappData?.bag_type : '';
      const qty = whatsappData?.qty ? whatsappData?.qty : '';
      const fabric = whatsappData?.fabric_color
        ? whatsappData?.fabric_color
        : '-';
      const handle_color = whatsappData?.handle_color
        ? whatsappData?.handle_color
        : 'NA';
      const rate = whatsappData?.rate ? whatsappData?.rate : '₹0';
      const unit_pc = whatsappData?.unit_pc ? 'BAG' : 'KG';
      const block = whatsappData?.stereo_charge
        ? convertThousandToNumeric(whatsappData?.stereo_charge, 'rupees')
        : '-';
      const etd = whatsappData?.due_date ? whatsappData?.due_date : '';

      // let productDescription = whatsappData?.width
      //   ? `${whatsappData?.width}” x ${whatsappData?.height} x ${whatsappData?.gusset}” (${whatsappData?.gsm}GSM)`
      //   : '-';
      const productDescription = whatsappData
        ? `${whatsappData?.width ? 'W ' + whatsappData?.width + '”' : ''} ${
            whatsappData?.height ? 'x  H ' + whatsappData?.height + '”' : ''
          } ${
            whatsappData?.gusset ? 'x G ' + whatsappData?.gusset + '”' : ''
          } ${whatsappData?.gsm ? '(' + whatsappData?.gsm + ' GSM)' : ''}`
        : '-';

      let productDetails = `${qty} Bags\nFabric: *${fabric}*`;
      if (['D - CUT', 'D - CUT WITH UF'].includes(productType)) {
        // Exclude "Handle Color" for product_type "D-CUT" or "D-cut with Underfold".
        productDetails += `\nRate: ${rate} /${unit_pc}\nStereo Charge: ₹${block}`;
      } else {
        // Include "Handle Color" for other product types
        productDetails += `\nHandle Color: ${handle_color}\nRate: ${rate} /${unit_pc}\nStereo Charge: ₹${block}`;
      }

      // const productDetails = `${qty} Bags\nFabric: *${fabric}*\nHandle Color: ${handle_color}\nRate: ${rate}/${unit_pc}\nStereo Charge: ₹${block}`;
      // \nETD: ${etd}`;

      if (isMobileDevice()) {
        text = `${img}\n\n---------------------------------\n${productTitle}\n${productType}\n${productDescription}\n---------------------------------\n${productDetails}\n\n${oldStereo}`;
      } else {
        text = `${productTitle}\n${productType}\n${productDescription}\n---------------------------------\n${productDetails}\n\n${oldStereo}`;
      }

      if (key === 'whatsapp') {
        const data = {
          img,
          oldStereo,
          productTitle,
          productType,
          productDescription,
          productDetails,
        };
        handleWhatsAppShare(data);
        setWhatsappPopup(false);
      } else {
        const res = copy(text, {
          debug: false,
          message: 'Tap to copy',
        });
        if (res) {
          // toast('Text copied to clipboard', toastCongig);
          setWhatsappPopup(false);
        } else toast.error('Failed to copy Text', toastCongig);
      }
    },
    [whatsappData],
  );

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLive: {
          ...allFilters?.mfgLive,
          currentPage: 1,
        },
      }),
    );
    dispatch(
      getmfgLiveList(
        pageLimit,
        1,
        e.target.value,
        applied,
        dates,
        field_filter,
      ),
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
        mfgLive: {
          ...allFilters?.mfgLive,
          dates: e,
        },
      }),
    );

    loadTableData(e);
  };

  const checkboxTemplate = data => {
    return data?.can_transfer_consumed && !data?.assigned_to ? (
      <Checkbox
        value={data?.isSelected}
        onChange={e => {
          handleCheckboxTemplate(e, data);
        }}
        checked={data?.isSelected === true}
      />
    ) : null;
  };

  return (
    <div className="main_Wrapper">
      {(mfgSuggestedRollLoading || mfgLiveLoading) && <Loader />}
      <div className="table_main_Wrapper mfg_live_admin_wrapper bg-white">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col sm={2}>
              <div className="page_title">
                <h3 className="m-0">MFG Live</h3>
              </div>
            </Col>
            <Col sm={10}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
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
                              mfgLive: {
                                ...allCommon?.mfgLive,
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
                    <div className="form_group date_range_wrapper">
                      <div
                        className="date_range_select"
                        onClick={e => {
                          dateRef.current.toggle(e);
                        }}
                      >
                        <span
                          className={
                            !dates?.startDate &&
                            !dates?.endDate &&
                            'empty_date_picker'
                          }
                        >
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
                                  mfgLive: {
                                    ...allFilters?.mfgLive,
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

                  {currentUser?.role_name?.toLowerCase() !== 'designer' && (
                    <MFGLiveExport
                      dates={dates}
                      applied={applied}
                      pageLimit={pageLimit}
                      currentPage={currentPage}
                      searchQuery={searchQuery}
                      field_filter={field_filter}
                      exportAcces={is_export_access}
                    />
                  )}
                </ul>
              </div>
            </Col>
          </Row>
        </div>

        <MFGLiveAdminMultiSelect
          allCommon={allCommon}
          field_filter={field_filter}
          setAllCommon={setAllCommon}
          mfgLiveFilterList={mfgLiveFilterList}
        />

        <MFGLiveAdminTable
          mfgData={mfgData}
          pageLimit={pageLimit}
          allCommon={allCommon}
          mfgFilters={mfgFilters}
          currentPage={currentPage}
          mfgLiveCount={mfgLiveCount}
          setAllCommon={setAllCommon}
          filterToggle={filterToggle}
          selectedProducts={selectedProducts}
          onPageChange={onPageChange}
          imageTemplate={imageTemplate}
          actionTemplate={actionTemplate}
          amountTemplate={amountTemplate}
          // jobNoTemplate={jobNoTemplate}
          bagTypeTemplate={bagTypeTemplate}
          commentTemplate={commentTemplate}
          orderNoTemplate={orderNoTemplate}
          onPageRowsChange={onPageRowsChange}
          cylinderTemplate={cylinderTemplate}
          bedgeBodyTemplate={bedgeBodyTemplate}
          designNameTemplate={designNameTemplate}
          laminationTemplate={laminationTemplate}
          setSelectedProducts={setSelectedProducts}
          bagMadeBodyTemplate={bagMadeBodyTemplate}
          printBedgeBodyTemplate={printBedgeBodyTemplate}
          handleMaterialTemplate={handleMaterialTemplate}
          factoryLocationTemplate={factoryLocationTemplate}
          statusRowFilterTemplate={statusRowFilterTemplate}
          mainTableRollWidthTemplate={mainTableRollWidthTemplate}
          footerGroup={
            currentUser?.role_name?.toLowerCase() !== 'designer'
              ? footerGroup
              : ''
          }
          scrollable
          scrollHeight="400px"
        />
      </div>

      <Dialog
        header="Print"
        visible={newTableModal?.isView}
        draggable={false}
        className="modal_Wrapper modal_medium"
        onHide={() => {
          setNewTableModal({
            id: '',
            isView: false,
          });
          dispatch(setPrintTechnologyList([]));
        }}
      >
        <div className="add_product_content_wrap">
          <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter break_header max_height">
            <DataTable
              value={printTechnologyList}
              rows={1}
              filterDisplay="row"
              dataKey="_id"
            >
              {renderPrintTechnologyList?.map(x => {
                return x;
              })}
            </DataTable>
          </div>
          <div className="mt-3 d-flex justify-content-end">
            <Button
              className="btn_border me-2"
              onClick={() => {
                setNewTableModal({
                  id: '',
                  isView: false,
                });
                dispatch(setPrintTechnologyList([]));
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        header="Printing"
        visible={printingTableModal}
        draggable={false}
        className="modal_Wrapper model_extra_large"
        onHide={() => {
          setAssignedRoll([]);
          setPrintingTableModal(false);
          dispatch(setClearPrintingData());
          dispatch(setAssignedRollList([]));
          dispatch(setViewProductDetailData({}));
          dispatch(
            setAllCommon({
              ...allCommon,
              mfgLive: {
                ...allCommon?.mfgLive,
                suggestedFilterToggle: false,
                assignedFilterToggle: false,
              },
            }),
          );
        }}
        footer={footerContentR2R}
      >
        <div className="printing_content_wrap">
          <MFGLivePrintingFilter
            jobId={jobId}
            allCommon={allCommon}
            setAllCommon={setAllCommon}
            printTechnologyId={printTechnologyId}
            print_field_filter={print_field_filter}
            mfgLivePrintingFilterList={mfgLivePrintingFilterList}
          />
          <div className="printing_content_middle">
            <Row className="g-2">
              <Col lg={3} className="order-1 order-lg-1">
                <div className="product_details_left border rounded-3 bg_white p-3 mb-3">
                  <div className="product_detail_wrap">
                    <h3 className="mb-2">Product Details</h3>
                    <img
                      src={viewProductDetailData?.main_image}
                      alt="ProductImg"
                      className="w-100"
                    />
                    <h4>Bag Size</h4>
                    <h5>{viewProductDetailData?.product_code}</h5>
                    <ul className="rounded_ul">
                      <li>Bag Type: {viewProductDetailData?.bag_type_name}</li>
                      <li>
                        Bag Printing: {viewProductDetailData.print_type_name}
                      </li>
                      <li>Design Name: {viewProductDetailData?.design_name}</li>
                      <li>Bag Weight: {viewProductDetailData?.bag_weight} </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col lg={9} className="order-4 order-lg-2">
                <div className="table_main_Wrapper bg-white mb-3">
                  <div className="top_filter_wrap">
                    <h3>Suggested Rolls</h3>
                  </div>
                  <div className="data_table_wrapper cell_padding_small is_filter custom_suggested_mfg break_header">
                    <button
                      type="button"
                      className="table_filter_btn"
                      onClick={() => {
                        dispatch(
                          setAllCommon({
                            ...allCommon,
                            mfgLive: {
                              ...allCommon?.mfgLive,
                              suggestedFilterToggle: !suggestedFilterToggle,
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
                      dataKey="_id"
                      filterDisplay="row"
                      selectionMode="checkbox"
                      // onSelectionChange={e => handleCheckboxTemplate(e.value)}
                      // selection={assignedRoll}
                      onSelectionChange={e => handleCheckboxTemplate(e.value)}
                      selection={checkedAssignedRoll}
                      // onSelectionChange={e => setSelectedProducts(e.value)}
                      filters={mfgLivePrintingFilter}
                      onFilter={event => {
                        dispatch(
                          setAllCommon({
                            ...allCommon,
                            mfgLive: {
                              ...allCommon?.mfgLive,
                              mfgLivePrintingFilter: event?.filters,
                            },
                          }),
                        );
                      }}
                    >
                      <Column
                        selectionMode="multiple"
                        headerStyle={{ width: '2rem' }}
                      ></Column>
                      {/* <Column
                        selectionMode="multiple"
                        headerStyle={{ width: '3rem' }}
                        field="can_transfer_consumed"
                        body={checkboxTemplate}
                      ></Column> */}
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
                <ul className="d-flex align-items-center justify-content-start justify-content-lg-end gap-2 flex-wrap">
                  <li>
                    <ul className="pending_bags panding_bags_details">
                      <li>
                        Pending qty of bags to print
                        <div className="form_group">
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
                  <li>
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
              </Col>
            </Row>
          </div>
          <div className="final_print_table mt-3">
            <div className="table_main_Wrapper bg-white">
              <div className="top_filter_wrap">
                <h3>Printed Rolls</h3>
              </div>
              <div className="data_table_wrapper with_colspan_head cell_padding_small is_filter custom_suggested_mfg">
                <button
                  type="button"
                  className="table_filter_btn"
                  onClick={() => {
                    dispatch(
                      setAllCommon({
                        ...allCommon,
                        mfgLive: {
                          ...allCommon?.mfgLive,
                          assignedFilterToggle: !assignedFilterToggle,
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
                  sortField="name"
                  sortOrder={1}
                  filterDisplay="row"
                  dataKey="_id"
                  filters={mfgLivePrintingFilter}
                  onFilter={event => {
                    dispatch(
                      setAllCommon({
                        ...allCommon,
                        mfgLive: {
                          ...allCommon?.mfgLive,
                          mfgLivePrintingFilter: event?.filters,
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
        header="SCREEN PRINTING (BAG TO BAG)"
        visible={screenTableModal}
        draggable={false}
        className="modal_Wrapper modal_medium"
        onHide={() => {
          setScreenTableModal(false);
          setSelectedProductFromSuggested({});
          dispatch(setBagToBagData(intialPrintingData));
        }}
      >
        <div className="printing_content_wrap">
          <div className="printing_content_top">
            <Row className="align-items-center">
              <Col lg={3} md={4}>
                <h5 className="mb-3">Is Printed?</h5>
                <div className="d-flex flex-wrap gap-3 mb-3">
                  <div className="d-flex align-items-center">
                    <Checkbox
                      inputId="ingredient1"
                      name="complete"
                      value={bagToBagData?.completed}
                      onChange={e => {
                        dispatch(
                          setBagToBagData({
                            ...bagToBagData,
                            completed: e.target.checked ? 1 : 0,
                            partial: e.target.checked ? 0 : 1,
                          }),
                        );
                      }}
                      checked={bagToBagData?.completed === 1}
                    />
                    <label htmlFor="ingredient1" className="mx-2">
                      Complete
                    </label>
                  </div>
                  <div className="d-flex align-items-center">
                    <Checkbox
                      inputId="ingredient2"
                      name="partial"
                      value={bagToBagData?.partial}
                      onChange={e => {
                        dispatch(
                          setBagToBagData({
                            ...bagToBagData,
                            partial: e.target.checked ? 1 : 0,
                            completed: e.target.checked ? 0 : 1,
                          }),
                        );
                      }}
                      checked={bagToBagData?.partial === 1}
                    />
                    <label htmlFor="ingredient2" className="mx-2">
                      Partial
                    </label>
                  </div>
                </div>
              </Col>
              <Col lg={9} md={8}>
                <div className="form_group mb-3">
                  <ReactSelectSingle
                    filter
                    name="suggested_product_id"
                    value={bagToBagData?.suggested_product_id || ''}
                    options={suggestedProductList}
                    onChange={e => {
                      dispatch(
                        setBagToBagData({
                          ...bagToBagData,
                          suggested_product_id: e.target.value,
                          warehouse: '',
                          in_stock: '',
                        }),
                      );
                      let data = suggestedProductList?.filter(
                        d => d?._id === e.target.value,
                      );
                      let updatedData = data?.map(i => {
                        return {
                          ...i,
                          warehouse: i?.warehouse?.map(d => {
                            return {
                              ...d,
                              label: d?.name,
                              value: d?._id,
                            };
                          }),
                        };
                      });
                      setSelectedProductFromSuggested(updatedData[0]);
                    }}
                    placeholder="Select Product"
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="printing_content_middle">
            <Row>
              <Col md={5}>
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
                      <li>Bag Type: {viewProductDetailData?.bag_type_name}</li>
                      <li>
                        Bag Printing: {viewProductDetailData.print_type_name}
                      </li>
                      <li>Design Name: {viewProductDetailData?.design_name}</li>
                      <li>Bag Weight: {viewProductDetailData?.bag_weight} </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col md={7}>
                <div className="screen_printing_right">
                  <div className="bag_box_wrap">
                    <div className="bag_type_box">
                      <div className="bag_img">
                        <img
                          src={
                            selectedProductFromSuggested?.main_image
                              ? selectedProductFromSuggested?.main_image
                              : DummyImage
                          }
                          alt="BagIcon"
                        ></img>
                      </div>
                      <div className="bag_title_wrap">
                        <h5 className="m-0">
                          {selectedProductFromSuggested?.design_name
                            ? selectedProductFromSuggested?.design_name
                            : 'Selected Product Image'}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="stock_list_Wrap">
                    <ul>
                      <li>
                        <label>Warehouse</label>
                        <ReactSelectSingle
                          filter
                          name="suggested_product_id"
                          value={bagToBagData?.warehouse || ''}
                          options={selectedProductFromSuggested?.warehouse}
                          onChange={e => {
                            let data =
                              selectedProductFromSuggested?.warehouse?.filter(
                                d => d?._id === e.target.value,
                              );
                            dispatch(
                              setBagToBagData({
                                ...bagToBagData,
                                warehouse: e.target.value,
                                in_stock: data[0]?.qty,
                              }),
                            );
                          }}
                          placeholder="Select Warehouse"
                        />
                      </li>
                      <li>
                        <label>In Stock</label>
                        <div className="input_wrap">
                          <InputText
                            placeholder="In Stock"
                            value={bagToBagData?.in_stock}
                            disabled
                          />
                        </div>
                      </li>
                      <li>
                        <label>Qty used for this job</label>
                        <div className="input_wrap">
                          <InputText
                            placeholder="Qty used for this job"
                            type="number"
                            name="bagToBagData.qty_used"
                            value={bagToBagData.qty_used}
                            onChange={e => {
                              dispatch(
                                setBagToBagData({
                                  ...bagToBagData,
                                  qty_used: e.target.value,
                                }),
                              );
                            }}
                          />
                        </div>
                      </li>
                      <li>
                        <label>Wastage</label>
                        <div className="input_wrap">
                          <InputText
                            placeholder="Wastage"
                            type="number"
                            value={bagToBagData.wastage}
                            onChange={e => {
                              dispatch(
                                setBagToBagData({
                                  ...bagToBagData,
                                  wastage: e.target.value,
                                }),
                              );
                            }}
                          />
                        </div>
                      </li>
                      <li>
                        <label>Qty of bags printed</label>
                        <div className="input_wrap">
                          <InputText
                            placeholder="Qty of bags printed"
                            type="number"
                            value={bagToBagData.bag_printed}
                            onChange={e => {
                              dispatch(
                                setBagToBagData({
                                  ...bagToBagData,
                                  bag_printed: e.target.value,
                                }),
                              );
                            }}
                          />
                        </div>
                      </li>
                      <li>
                        <label>Pending qty of bags to print</label>
                        <div className="input_wrap">
                          <InputText
                            placeholder="Pending qty of bags"
                            type="number"
                            value={bagToBagData.pending_bag}
                            onChange={e => {
                              dispatch(
                                setBagToBagData({
                                  ...bagToBagData,
                                  pending_bag: e.target.value,
                                }),
                              );
                            }}
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="mt-3 d-flex justify-content-end">
            <Button
              className="btn_border me-2"
              onClick={() => {
                setScreenTableModal(false);
                dispatch(setBagToBagData(intialPrintingData));
              }}
            >
              Cancel
            </Button>
            <Button
              className="btn_primary"
              onClick={() => {
                let data = {
                  ...bagToBagData,
                  pending_bag: Number(bagToBagData?.pending_bag),
                  qty_used: Number(bagToBagData?.qty_used),
                  wastage: Number(bagToBagData?.wastage),
                  bag_printed: Number(bagToBagData?.bag_printed),
                };
                dispatch(updatePrintStatus(data));
                setScreenTableModal(false);
                dispatch(setBagToBagData(intialPrintingData));
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        header="Bag Made"
        visible={bagMadeModal?.isView}
        draggable={false}
        className="modal_Wrapper modal_large max_height"
        onHide={() => {
          setBagMadeModal({
            isView: false,
            id: '',
          });
          setBatchEntryList([]);
          setBagMadeAllData(initialBagMade);
        }}
        footer={footerContent}
      >
        <div className="bag_made_content_wrap">
          <div className="bag_made_top">
            <Row>
              <Col lg={3}>
                <div className="d-flex flex-wrap gap-3">
                  <div className="d-flex align-items-center">
                    <Checkbox
                      inputId="ingredient1"
                      name="complete"
                      value={bagMadeAllData?.completed}
                      onChange={e =>
                        setBagMadeAllData({
                          ...bagMadeAllData,
                          completed: e.target.checked ? 1 : 0,
                          partial: e.target.checked ? 0 : 1,
                        })
                      }
                      checked={bagMadeAllData?.completed === 1}
                    />
                    <label htmlFor="ingredient1" className="mx-2">
                      Complete
                    </label>
                  </div>
                  <div className="d-flex align-items-center">
                    <Checkbox
                      inputId="ingredient2"
                      name="partial"
                      value={bagMadeAllData?.partial}
                      onChange={e =>
                        setBagMadeAllData({
                          ...bagMadeAllData,
                          partial: e.target.checked ? 1 : 0,
                          completed: e.target.checked ? 0 : 1,
                        })
                      }
                      checked={bagMadeAllData?.partial === 1}
                    />
                    <label htmlFor="ingredient2" className="mx-2">
                      Partial
                    </label>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={8}></Col>
              <Col md={4}>
                <div className="order_date">
                  <p className="mb-3 text-end">
                    Date: {bagMadeAllData?.order_date}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
          <div className="table_main_Wrapper bg-white mb-3">
            <div className="top_filter_wrap">
              <Row className="align-items-center">
                <Col sm={5}>
                  <div className="page_title">
                    <h3 className="m-0">Batchwise MFG</h3>
                  </div>
                </Col>
                <Col sm={7}>
                  <div className="right_filter_wrapper">
                    <ul>
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
                                    batch_date: new Date(),
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
                                  batch_date: new Date(),
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
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper  cell_padding_small break_header batchwise_table_wrapper custom_suggested_mfg">
              <DataTable
                value={batchEntryList}
                sortMode="single"
                sortField="name"
                sortOrder={1}
                // // rows={10}
                // filterDisplay="row"
                dataKey="_id"
              >
                <Column
                  field="batchNo"
                  header="Batch No"
                  sortable
                  filter={filterToggle}
                  // body={customNoColumn}
                ></Column>
                <Column
                  field="batch_date"
                  header="Date"
                  sortable
                  filter={filterToggle}
                  body={dateTemplate}
                ></Column>
                <Column
                  field="bag_made"
                  header="Bags Made"
                  sortable
                  filter={filterToggle}
                  body={inputTemplate}
                ></Column>
                <Column
                  field="total_bundle"
                  header="No. Bundle"
                  sortable
                  filter={filterToggle}
                  body={totalBundalTemplate}
                ></Column>
                <Column
                  field="empty_bundle_weight"
                  header="Wt. of empty bundle"
                  sortable
                  filter={filterToggle}
                  body={emptyBundleTemplate}
                ></Column>
                <Column
                  field="gross_weight_bag"
                  header="Gross Weight Bags"
                  sortable
                  filter={filterToggle}
                  body={grossWeightTemplate}
                ></Column>
                <Column
                  field="net_weight_bag"
                  header="Net Weight Bags"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="avg_bag_weight"
                  header="Average Wt per bag"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="action"
                  body={actionDeleteTemplate}
                  header="Action"
                />
              </DataTable>
            </div>
          </div>
          <Row className="mb-3">
            <Col md={6}>
              <Row className="g-3">
                <Col lg={4} sm={6}>
                  <div className="rate_box blue_box">
                    <h4>{bagMadeAllData?.days} days</h4>
                    <h5 className="m-0">Turn Around Time</h5>
                  </div>
                </Col>
                <Col lg={8}>
                  <div className="total_hr_list">
                    <ul>
                      <li>
                        <label>Total No. Bags</label>
                        <span>
                          {thousandSeparator(
                            parseFloat(
                              bagMadeAllData?.total ? bagMadeAllData?.total : 0,
                            ),
                          )}
                        </span>
                      </li>
                      <li>
                        <label>Expected No. Bags</label>
                        <span>
                          {thousandSeparator(
                            parseFloat(
                              bagMadeAllData?.expected
                                ? bagMadeAllData?.expected
                                : 0,
                            ),
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col sm={12}>
                  <Row className="g-3">
                    <Col lg={4} md={4} sm={6}>
                      <div className="rate_box yellow_box">
                        <h4>
                          ₹{' '}
                          {thousandSeparator(
                            Number(bagMadeAllData?.act_kg_rate),
                          )}
                          /KG
                        </h4>
                        <h5 className="m-0">KG Rate (Actual)</h5>
                      </div>
                    </Col>
                    <Col lg={4} md={4} sm={6}>
                      <div className="rate_box green_box">
                        <h4>
                          ₹{' '}
                          {thousandSeparator(
                            Number(bagMadeAllData?.theoretical_kg_rate),
                          )}
                          /KG
                        </h4>
                        <h5 className="m-0">KG Rate (Theoretical)</h5>
                      </div>
                    </Col>
                    <Col lg={4} md={4} sm={6}>
                      <div className="rate_box light_blue_box">
                        <h4>
                          {Number(bagMadeAllData?.profit) > 0
                            ? bagMadeAllData?.profit
                            : 0}
                          %
                        </h4>
                        <h5 className="m-0">Profit (%)</h5>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={12}>
                  <h5 className="ms-2">Wt.of handle</h5>
                  <Row className="custom_radio_wrappper">
                    <Col md={6}>
                      <div className="flex align-items-center mb-3">
                        <RadioButton
                          inputId="auto"
                          name="isHandleAuto"
                          value={1}
                          onChange={e => {
                            setIsHandleAuto(e.value);
                            handleWeightChange(
                              1,
                              bagMadeAllData?.auto_handle_weight,
                              bagMadeAllData?.act_handle_weight,
                            );
                          }}
                          checked={isHandleAuto === 1}
                        />
                        <InputText
                          placeholder=""
                          className="mx-2"
                          disabled
                          value={bagMadeAllData?.auto_handle_weight}
                          onChange={e => {
                            setBagMadeAllData({
                              ...bagMadeAllData,
                              auto_handle_weight: e.target.value,
                            });
                            handleWeightChange(
                              1,
                              Number(e.target.value),
                              bagMadeAllData?.act_handle_weight,
                            );
                          }}
                        />
                        <label htmlFor="auto" className="ml-2">
                          Auto
                        </label>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="flex align-items-center">
                        <RadioButton
                          inputId="actual"
                          name="isHandleAuto"
                          value={0}
                          onChange={e => {
                            setIsHandleAuto(e.value);
                            handleWeightChange(
                              0,
                              bagMadeAllData?.auto_handle_weight,
                              bagMadeAllData?.act_handle_weight,
                            );
                          }}
                          checked={isHandleAuto === 0}
                        />
                        <InputText
                          placeholder="0"
                          type="number"
                          className="mx-2"
                          value={bagMadeAllData?.act_handle_weight}
                          onChange={e => {
                            setBagMadeAllData({
                              ...bagMadeAllData,
                              act_handle_weight: e.target.value,
                            });
                            // const value = e?.target?.value;
                            // const parts = value.split('.');
                            // // const a = parts.length > 1 && Number(parts[1]) >= 0;
                            // const a = parts[1]?.length > 0;

                            // if (!a || (a && parts[1]?.length <= 2)) {
                            handleWeightChange(
                              0,
                              bagMadeAllData?.auto_handle_weight,
                              e?.target?.value,
                            );
                            // }

                            // const inputValue = e?.target?.value;
                            // const isValidDecimal =
                            //   /^\d*\.?\d{0,2}$/.test(inputValue) &&
                            //   inputValue !== 'e' &&
                            //   inputValue !== '.';

                            // if (isValidDecimal) {
                            //   handleWeightChange(
                            //     0,
                            //     bagMadeAllData?.auto_handle_weight,
                            //     Number(inputValue),
                            //   );
                            // }
                          }}
                        />
                        <label htmlFor="actual" className="ml-2">
                          Actual
                        </label>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <div className="total_list_box mb-3">
                <ul>
                  <li>
                    <label>Total Wt. of Fabric Used:</label>
                    <span>
                      {thousandSeparator(
                        parseFloat(bagMadeAllData?.total_fabric) > 0
                          ? parseFloat(bagMadeAllData?.total_fabric)
                          : 0,
                      )}{' '}
                      KG
                    </span>
                  </li>
                  <li>
                    <label>Total Net Weight of Bags:</label>
                    <span>{thousandSeparator(sumWithNetWTBags)} KG</span>
                  </li>
                  <li>
                    <label>Net Wt. of Bags (minus handle):</label>
                    <span>
                      {thousandSeparator(
                        Number(bagMadeAllData?.netWeightOfBag) > 0
                          ? parseFloat(bagMadeAllData?.netWeightOfBag)
                          : 0,
                      )}{' '}
                      KG
                    </span>
                  </li>
                  <li>
                    <label>Wastage:</label>
                    <span className="text_secondary">
                      {thousandSeparator(
                        Number(bagMadeAllData?.wastage) > 0
                          ? parseFloat(bagMadeAllData?.wastage)
                          : 0,
                      )}{' '}
                      KG
                    </span>
                  </li>
                  <li>
                    <label>Wastage%:</label>
                    <span className="text_secondary">
                      {Number(bagMadeAllData?.wastage_percentage) > 0
                        ? bagMadeAllData?.wastage_percentage
                        : 0}{' '}
                      %
                    </span>
                  </li>
                </ul>
              </div>
              <Row>
                <Col sm={4}>
                  <div className="form_group mb-3">
                    <label>Stereo Charge</label>
                    <InputText
                      placeholder="0"
                      type="number"
                      name="stereo_charge"
                      disabled
                      value={bagMadeAllData?.stereo_charge}
                      onChange={e => {
                        setBagMadeAllData({
                          ...bagMadeAllData,
                          stereo_charge: e.target.value,
                        });
                      }}
                    />
                  </div>
                </Col>
                <Col sm={4}>
                  <div className="form_group mb-3">
                    <label>Actual Stereo Charge</label>
                    <InputText
                      placeholder="0"
                      type="number"
                      name="act_stereo_charge"
                      value={bagMadeAllData?.act_stereo_charge}
                      onChange={e => {
                        setBagMadeAllData({
                          ...bagMadeAllData,
                          act_stereo_charge: e.target.value,
                        });
                      }}
                    />
                  </div>
                </Col>
                <Col sm={4}>
                  <div className="form_group mb-3">
                    <label>Additional Mfg. Charge</label>
                    <InputText
                      placeholder="0"
                      type="number"
                      name="additional_mfg_cost"
                      value={bagMadeAllData?.additional_mfg_cost}
                      onChange={e => {
                        let list = [...batchEntryList];
                        let wastageRate =
                          (bagMadeAllData?.roll_rate *
                            Number(bagMadeAllData?.wastage)) /
                          bagMadeAllData?.roll_weight;
                        let costPrice =
                          bagMadeAllData?.conversion_rate +
                          Number(wastageRate) +
                          Number(e.target.value);
                        let sellingPrice = bagMadeAllData?.per_pc;
                        let profit =
                          sellingPrice - Number(costPrice) / sellingPrice;

                        setBatchEntryList(list);
                        setBagMadeAllData({
                          ...bagMadeAllData,
                          profit: profit?.toFixed(2),
                          additional_mfg_cost: e.target.value,
                        });
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Dialog>
      <Dialog
        header=""
        visible={!!whatsappPopup}
        draggable={false}
        className="modal_Wrapper modal_small whatsapp_modal"
        onHide={() => setWhatsappPopup(false)}
      >
        <div className="whatsapp_popup_wrapper">
          <div className="img_wrapper">
            <img src={whatsappData?.main_image} alt="" />
            <Button className="dowanload_img btn_primary">
              <a
                href={whatsappData?.main_image}
                download="image.jpg"
                onClick={onDownload}
              >
                <img src={download} alt="download" className="me-0" />
              </a>
            </Button>
          </div>
          <div className="whatsapp_pro_title">
            <h4>
              {whatsappData?.design ? whatsappData?.design?.toUpperCase() : ''}
            </h4>
            <h5>{whatsappData?.bag_type ? whatsappData?.bag_type : ''}</h5>
            <p className="m-0">
              {whatsappData
                ? `${
                    whatsappData?.width ? 'W ' + whatsappData?.width + '”' : ''
                  } ${
                    whatsappData?.height
                      ? 'x  H ' + whatsappData?.height + '”'
                      : ''
                  } ${
                    whatsappData?.gusset
                      ? 'x G ' + whatsappData?.gusset + '”'
                      : ''
                  } ${
                    whatsappData?.gsm ? '(' + whatsappData?.gsm + ' GSM)' : ''
                  }`
                : '-'}
            </p>
          </div>
          <div className="whatsapp_pro_detail">
            <h4>{whatsappData?.qty ? whatsappData?.qty : ''} Bags</h4>
            <ul>
              <li>
                Fabric:{' '}
                {whatsappData?.fabric_color ? whatsappData?.fabric_color : '-'}
              </li>
              {!['D - CUT', 'D - CUT WITH UF'].includes(
                whatsappData?.bag_type,
              ) && (
                <li>
                  Handle Color:{' '}
                  {whatsappData?.handle_color
                    ? whatsappData?.handle_color
                    : 'NA'}
                </li>
              )}
              <li>
                Rate: {whatsappData?.rate ? `${whatsappData?.rate}` : '₹0'} /
                {whatsappData?.unit_pc ? ' BAG' : ' KG'}
              </li>
              <li>
                Stereo Charge: ₹
                {thousandSeparator(
                  convertThousandToNumeric(
                    whatsappData?.stereo_charge,
                    'rupees',
                  ),
                )}
              </li>
              {/* <li>
                ETD: {whatsappData?.due_date ? whatsappData?.due_date : ''}
              </li> */}
            </ul>
            <h4 className="mb-3">
              {whatsappData?.old_stereo === true ? 'OLD BLOCK' : 'NEW BLOCK'}
            </h4>
            <div className="text-center mb-2">
              <Button
                className="btn_border me-2"
                onClick={() => onCopyText('copy')}
              >
                <img src={ClipboardIcon} className="me-2" alt="" />
                Copy
              </Button>
              <Button
                className="btn_border"
                onClick={() => onCopyText('whatsapp')}
              >
                <img src={whatsapp} alt="whatsapp" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
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
            name="nameFilter"
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
  );
}
