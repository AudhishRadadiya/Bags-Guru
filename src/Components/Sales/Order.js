import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import FilterIcon from '../../Assets/Images/filter.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ActionBtn from '../../Assets/Images/action.svg';
import { useNavigate } from 'react-router-dom';

import { Tag } from 'primereact/tag';
import SearchIcon from '../../Assets/Images/search.svg';
import { Image } from 'primereact/image';
import RepeatOrder from '../../Assets/Images/repeat-order.svg';
import CancelOrder from '../../Assets/Images/cancel-order.svg';
import SalesInvoice from '../../Assets/Images/sales-invoice.svg';
import Whatsapp from '../../Assets/Images/whatsapp.svg';
import CheckGreen from '../../Assets/Images/check-round-green.svg';
import CheckRed from '../../Assets/Images/check-round-red.svg';
import { Checkbox } from 'primereact/checkbox';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import {
  addFilter,
  deleteFilter,
  getAllUserPartyList,
  getListFilter,
  getPartiesAdvisor,
  getTransporterPartyList,
  updateFilter,
} from 'Services/partiesService';
import {
  cancelSalesOrder,
  deleteSalesOrder,
  deleteSalesOrderJob,
  getExportSalesOrder,
  getExportSalesOrderJobs,
  getSalesOrderDetail,
  getSalesOrderJobsList,
  getSalesOrdersList,
  repeatSalesOrder,
  updateStatusSalesOrder,
  updateStatusSalesOrderJob,
} from 'Services/Sales/OrderServices';
import { useDispatch } from 'react-redux';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import FilterOverlay from 'Components/Common/FilterOverlay';
import CustomPaginator from 'Components/Common/CustomPaginator';
import Loader from 'Components/Common/Loader';
import WhatsAppShare from 'Components/Common/Whatsapp';
import Skeleton from 'react-loading-skeleton';
import {
  getActiveBagTypeList,
  getActiveFabricColorList,
  getActiveLaminationTypeList,
} from 'Services/Settings/MiscMasterService';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import {
  checkModulePermission,
  getDMYDateFormat,
  statusObj as statusArray,
} from 'Helper/Common';
import {
  updateBagSentStatus,
  updateLrSentStatus,
} from 'Services/Production/mfgLiveServices';
import moment from 'moment';
import { OverlayPanel } from 'primereact/overlaypanel';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import {
  clearAddSelectedOrderData,
  setIsGetInitialValuesJob,
  setIsGetInitialValuesOrder,
  setPreviousTransporter,
} from 'Store/Reducers/Sales/SalesOrderSlice';
import { setIsGetInitialValuesSalesInvoice } from 'Store/Reducers/Sales/SalesInvoiceSlice';

const commonCase = val => {
  switch (val) {
    case false:
      return 1;
    case true:
      return 0;
    default:
      return null;
  }
};
const statusObj = [
  { label: 'Pending', value: '0' },
  { label: 'Approved', value: '1' },
  { label: 'Progress', value: '2' },
  { label: 'Completed', value: '3' },
  { label: 'Cancelled', value: '4' },
  { label: 'Rejected', value: '5' },
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

export const getJobSeverity = lamination => {
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

export const getOrderSeverity = status => {
  switch (status) {
    case 0:
      return 'warning';
    case 1:
      return 'info';
    case 2:
      return 'primary';
    case 3:
      return 'success';
    case 4:
    case 5:
      return 'danger';
    default:
      return 'warning';
  }
};

export const getStatusText = status => {
  switch (status) {
    case 0:
      return 'Pending';
    case 1:
      return 'Approved';
    case 2:
      return 'Progress';
    case 3:
      return 'Completed';
    case 4:
      return 'Cancelled';
    case 5:
      return 'Rejected';
    default:
      return 'Pending';
  }
};

const commentTemplate = val => {
  return (
    <div className="comment_wrapper">
      <p className="m-0 text-danger">{val}</p>
    </div>
  );
};

const filterDetails = [
  { label: 'Orders No.', value: 'order_no', type: 'inputBox' },
  { label: 'Party', value: 'party_name', type: 'dropDown' },
  { label: 'Order Date', value: 'order_date', type: 'inputBox' },
  { label: 'Days', value: 'days', type: 'inputBox' },
  { label: 'Order Qty.', value: 'order_qty', type: 'inputBox' },
  { label: 'Total Amount', value: 'total_amount', type: 'inputBox' },
  { label: 'Advance Amount', value: 'advance_amount', type: 'inputBox' },
  { label: 'Present Advisor', value: 'present_advisor', type: 'dropDown' },
  // { label: 'Original Advisor', value: 'original_advisor', type: 'dropDown' },
  { label: 'Transporter', value: 'transporter', type: 'dropDown' },
  { label: 'Comments', value: 'comment', type: 'inputBox' },
  { label: 'CC Attach', value: 'is_cc_attach', type: 'dropDown' },
  { label: 'Dispatch', value: 'dispatch_after_payment', type: 'dropDown' },
  { label: 'Multi Billing', value: 'multiple_billing', type: 'dropDown' },
  { label: 'Customer Inv', value: 'dispatch_on_invoice', type: 'dropDown' },
  { label: 'Status', value: 'status', type: 'dropDown' },
];

const jobsFilterDetails = [
  { label: 'Jobs No.', value: 'job_no', type: 'inputBox' },
  { label: 'Delivery Date', value: 'due_date', type: 'inputBox' },
  { label: 'Design Name', value: 'product_detail.design', type: 'inputBox' },
  { label: 'Product Code', value: 'product_detail.code', type: 'inputBox' },
  { label: 'Bag Type', value: 'bag_detail.bag_type', type: 'dropDown' },
  {
    label: 'Fabric Color',
    value: 'product_detail.fabric_color',
    type: 'dropDown',
  },
  { label: 'PCs', value: 'qty', type: 'inputBox' },
  { label: 'Weight(KG)', value: 'weight', type: 'inputBox' },
  { label: 'Rate PC', value: 'per_pc', type: 'inputBox' },
  { label: 'Rate KG', value: 'per_kg', type: 'inputBox' },
  { label: 'PC Amount', value: 'pc_rate', type: 'inputBox' },
  { label: 'KG Amount', value: 'kg_rate', type: 'inputBox' },
  { label: 'Stereo Charge', value: 'stereo_charge', type: 'inputBox' },
  { label: 'Freight', value: 'additional_charge', type: 'inputBox' },
  { label: 'Final Amount', value: 'final_amount', type: 'inputBox' },
  { label: 'BAG SENT', value: 'bag_sent', type: 'dropDown' },
  { label: 'LR SENT', value: 'lr_sent', type: 'dropDown' },
  { label: 'Status', value: 'status', type: 'dropDown' },
  { label: 'Lamination Type', value: 'lamination_typename', type: 'dropDown' },
  // { label: 'Lamination', value: 'is_laminated', type: 'dropDown' },
  // { label: 'Width', value: 'width', type: 'inputBox' },
  // { label: 'Height', value: 'height', type: 'inputBox' },
  // { label: 'Length', value: 'length', type: 'inputBox' },
  // { label: 'Gusset', value: 'gusset', type: 'inputBox' },
  // { label: 'GSM', value: 'gsm', type: 'inputBox' },
  // { label: 'Rate', value: 'rate', type: 'inputBox' },
  // { label: 'Bag Sent', value: 'gsm', type: 'dropDown' },
];

const commonOption = [
  { label: 'YES', value: true },
  { label: 'NO', value: false },
];

export default function Order({ hasAccess }) {
  const op = useRef(null);
  const tableRef = useRef();
  const dateRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    is_create_access,
    is_edit_access,
    is_export_access,
    is_delete_access,
    is_print_access,
  } = hasAccess;

  const [isEdit, setIsEdit] = useState(false);
  const [selectId, setSelectId] = useState('');
  const [filterId, setFilterId] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [whatsappData, setWhatsappData] = useState({});
  const [deletePopup, setDeletePopup] = useState(false);
  const [repeatOrder, setRepeatOrder] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const [whatsappPopup, setWhatsappPopup] = useState(false);
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [orderDeletePopup, setOrderDeletePopup] = useState(false);
  const [approvedPopup, setApprovedPopup] = useState({ show: false, id: '' });
  // const [dates, setDates] = useState(null);
  // const [searchQuery, setSearchQuery] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageLimit, setPageLimit] = useState(30);
  // const [jobsCurrentPage, setJobsCurrentPage] = useState(1);
  // const [jobsPageLimit, setJobsPageLimit] = useState(30);
  // const [filters, setFilters] = useState([]);
  // const [applyFilter, setapplyFilter] = useState({});
  // const [filterToggle, setFilterToggle] = useState(false);
  // const [jobFilterToggle, setJobFilterToggle] = useState(false);
  // const [isJobsOnly, setIsJobsOnly] = useState(false);

  const {
    salesOrderListLoading,
    salesOrderCRUDLoading,
    salesOrderList,
    salesOrderCount,
    salesOrderOnlyJobsList,
    salesOrderJobsCount,
    isGetInitialValuesOrder,
    isGetInitialValuesJob,
  } = useSelector(({ salesOrder }) => salesOrder);
  const {
    bagTypeListMenu,
    fabricColorListMenu,
    // activeBagTypeList,
    // activeFabricColorList,
    activeLaminationTypeList,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { userPermissionList } = useSelector(({ settings }) => settings);
  const { listFilter, partiesAdvisor, transporterPartyList, allUserPartyList } =
    useSelector(({ parties }) => parties);
  const { isGetInitialValuesSalesInvoice } = useSelector(
    ({ salesInvoice }) => salesInvoice,
  );
  const { currentUser } = useSelector(({ auth }) => auth);

  const {
    filterToggle,
    jobFilterToggle,
    searchQuery,
    isJobsOnly,
    orderFilters,
    jobFilters,
  } = allCommon?.order;
  const {
    applied,
    filters,
    currentPage,
    pageLimit,
    jobsPageLimit,
    jobsCurrentPage,
    dates,
    selectedItemIndex,
  } = allFilters?.order;

  const checkTaxInvoicePermission = checkModulePermission(
    userPermissionList,
    'Sales',
    'Tax Invoice',
    'create',
  );

  const checkMFGLivePermission = checkModulePermission(
    userPermissionList,
    'Production',
    'MFG Live',
    'edit',
  );

  const handleOrderListing = async () => {
    if (isJobsOnly) {
      await dispatch(
        getSalesOrderJobsList(
          jobsPageLimit,
          jobsCurrentPage,
          searchQuery,
          applied,
        ),
      );
    } else {
      await dispatch(
        getSalesOrdersList(pageLimit, currentPage, searchQuery, applied, dates),
      );
    }
    dispatch(getPartiesAdvisor());
    dispatch(getTransporterPartyList());
    dispatch(getAllUserPartyList());
    dispatch(getActiveBagTypeList());
    dispatch(getActiveFabricColorList());
    dispatch(getActiveLaminationTypeList());
  };

  const loadRequiredData = useCallback(() => {
    dispatch(
      getListFilter({
        module_name: isJobsOnly ? 'salesOrderJob' : 'salesOrder',
      }),
    );
    handleOrderListing();
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  const loadTableData = selectedDate => {
    dispatch(
      getSalesOrdersList(
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        selectedDate,
      ),
    );
  };

  const laminationOptions = useMemo(() => {
    const updatedLaminationData = activeLaminationTypeList?.map(item => {
      return { label: item?.label, value: item.label };
    });
    return [
      ...updatedLaminationData,
      { label: 'Non Laminated', value: 'Non Laminated' },
    ];
  }, [activeLaminationTypeList]);

  const allowExpansion = rowData => {
    return rowData?.order_job?.length > 0;
  };

  const partieTemplate = useCallback(
    val => {
      return (
        <span
          onClick={() =>
            navigate(`/order-details/${val?._id}`, {
              state: { isView: true },
            })
          }
        >
          {val?.party_name_detail}
        </span>
      );
    },
    [navigate],
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

  const statusOrderBodyTemplate = ({ status, status_str }) => {
    return (
      <Tag
        value={status_str}
        severity={getOrderSeverity(status ? status : 0)}
      />
    );
  };

  const imageTemplate = ({ product_detail, factory_name }) => {
    return (
      <div className="image_zoom_Wrapper">
        <Image
          src={product_detail?.main_image || ''}
          zoomSrc={product_detail?.main_image || ''}
          alt="Image"
          preview
          downloadable
        />
      </div>
    );
  };

  const handleBodyChange = useCallback(
    async (val, name, id) => {
      if (name === 'bag_sent') {
        let payload = {
          process_id: id,
          status: commonCase(val),
        };
        let res = dispatch(updateBagSentStatus(payload));
        if (res) {
          if (isJobsOnly)
            dispatch(
              getSalesOrderJobsList(
                jobsPageLimit,
                jobsCurrentPage,
                searchQuery,
                applied,
              ),
            );
          else
            dispatch(
              getSalesOrdersList(
                pageLimit,
                currentPage,
                searchQuery,
                applied,
                dates,
              ),
            );
        }
      }
      if (name === 'lr_sent') {
        let payload = {
          process_id: id,
          status: commonCase(val),
        };
        let res = dispatch(updateLrSentStatus(payload));
        if (res) {
          if (isJobsOnly)
            dispatch(
              getSalesOrderJobsList(
                jobsPageLimit,
                jobsCurrentPage,
                searchQuery,
                applied,
              ),
            );
          else
            dispatch(
              getSalesOrdersList(
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
    [
      pageLimit,
      currentPage,
      searchQuery,
      applied,
      dates,
      jobsPageLimit,
      jobsCurrentPage,
      dispatch,
      isJobsOnly,
    ],
  );

  const bedgeBodyTemplate = val => {
    return (
      <span className={`bedge_${getSeverity(val)}`}>
        {val === true ? 'Yes' : 'No'}
      </span>
    );
  };

  const bedgeBagLrBodyTemplate = (val, name, id) => {
    return (
      <div>
        <button
          className={`bedge_${getSeverity(val)} `}
          onClick={e => {
            handleBodyChange(val, name, id);
          }}
          disabled={checkMFGLivePermission ? false : true}
        >
          {val === true ? 'Yes' : 'No'}
        </button>
      </div>
    );
  };

  const onUpdateStatusOfJob = useCallback(
    async (_id, status, isJobsOnly) => {
      const res = await dispatch(updateStatusSalesOrderJob(_id, status));
      if (res) {
        if (isJobsOnly) {
          dispatch(
            getSalesOrderJobsList(jobsPageLimit, 1, searchQuery, applied),
          );
        } else {
          dispatch(
            getSalesOrdersList(pageLimit, 1, searchQuery, applied, dates),
          );
        }
      }
    },
    [dispatch, pageLimit, jobsPageLimit, searchQuery, applied, dates],
  );

  const innerAction = useCallback(
    ({ status, _id, is_cancelled, salesOrder_id, ...rest }) => {
      const checkPermission =
        is_edit_access || is_delete_access || is_print_access;
      return (
        <>
          <div className="edit_row">
            <Dropdown className="dropdown_common position-static">
              <Dropdown.Toggle
                id="dropdown-basic"
                data-bs-boundary="body"
                className="ection_btn"
                disabled={checkPermission ? false : true}
              >
                <img src={ActionBtn} alt="" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {is_edit_access &&
                  // !rest?.status_str?.toLowerCase() === 'progress' &&
                  (status === 0 || status === 1 || status === 3) && (
                    <Dropdown.Item
                      onClick={() => {
                        dispatch(
                          setIsGetInitialValuesJob({
                            ...isGetInitialValuesJob,
                            update: false,
                          }),
                        );
                        navigate(`/update-job/${_id}`);
                      }}
                    >
                      <img src={EditIcon} alt="" /> Edit
                    </Dropdown.Item>
                  )}
                {is_delete_access &&
                  // !rest?.status_str?.toLowerCase() === 'progress' &&
                  (status === 0 ||
                    status === 1 ||
                    status === 4 ||
                    status === 5) && (
                    <Dropdown.Item onClick={() => setDeletePopup(_id)}>
                      <img src={TrashIcon} alt="" /> Delete
                    </Dropdown.Item>
                  )}
                {is_print_access && (
                  <Dropdown.Item
                    onClick={() => {
                      setWhatsappPopup(_id);
                      setWhatsappData(rest);
                    }}
                  >
                    <img src={Whatsapp} alt="" /> WhatsApp
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </>
      );
    },
    [
      dispatch,
      is_edit_access,
      is_print_access,
      is_delete_access,
      isGetInitialValuesJob,
    ],
  );

  const innerVerify = useCallback(
    ({ status, _id, is_cancelled, attachment }) => {
      return (
        <>
          {status !== 4 || status !== 2 || status !== 3 ? (
            <div className="panding_action_wrap">
              {(status === 0 || status === 5) && (
                <Button
                  className="btn_transperant"
                  onClick={() => onUpdateStatusOfJob(_id, 1, isJobsOnly)}
                  disabled={is_edit_access ? false : true}
                >
                  <img src={CheckGreen} alt="" />
                </Button>
              )}
              {(status === 0 || status === 1) && (
                <Button
                  className="btn_transperant"
                  onClick={() => onUpdateStatusOfJob(_id, 5, isJobsOnly)}
                  disabled={is_edit_access ? false : true}
                >
                  <img src={CheckRed} alt="" />
                </Button>
              )}
            </div>
          ) : null}
        </>
      );
    },
    [onUpdateStatusOfJob, isJobsOnly, is_edit_access],
  );

  const handleDeleteOrder = useCallback(
    async order_id => {
      if (order_id) {
        const result = await dispatch(deleteSalesOrder(order_id));
        if (result) {
          setOrderDeletePopup(false);
          dispatch(
            getSalesOrdersList(pageLimit, 1, searchQuery, applied, dates),
          );
        }
      }
    },
    [dispatch, pageLimit, searchQuery, applied, dates],
  );

  const handleRepeatOrder = useCallback(
    async order_id => {
      if (order_id) {
        const result = await dispatch(repeatSalesOrder(order_id));
        if (result) {
          dispatch(
            getSalesOrdersList(pageLimit, 1, searchQuery, applied, dates),
          );
          setRepeatOrder(false);
        }
      }
      setSelectId('');
    },
    [dispatch, pageLimit, searchQuery, applied, dates],
  );

  const handleCancelOrder = useCallback(
    async order_id => {
      if (order_id) {
        const result = await dispatch(cancelSalesOrder(order_id));
        if (result) {
          dispatch(
            getSalesOrdersList(pageLimit, 1, searchQuery, applied, dates),
          );
          setCancelOrder(false);
        }
      }
      setSelectId('');
    },
    [dispatch, pageLimit, searchQuery, applied, dates],
  );

  const productTemplate = useCallback(
    val => {
      return (
        <span
          onClick={() => {
            dispatch(
              setIsGetInitialValuesJob({
                ...isGetInitialValuesJob,
                view: false,
              }),
            );
            navigate(`/job-details/${val?._id}`, {
              state: { isView: true },
            });
          }}
        >
          {val?.product_detail?.code}
        </span>
      );
    },
    [dispatch, isGetInitialValuesJob, navigate],
  );

  const laminationBody = item => {
    return (
      <div>
        {item?.bag_detail?.lamination_type_name?.length > 0 ? (
          item?.bag_detail?.lamination_type_name?.map(value => {
            const lamination_name = value?.name?.toLowerCase();
            return (
              <Tag
                value={value?.name}
                severity={getJobSeverity(lamination_name)}
                className="me-2"
              />
            );
          })
        ) : (
          <Tag
            value={'Non Laminated'}
            severity={getJobSeverity('Non Laminated')}
          />
        )}
      </div>
    );
  };

  const stereoChargeBody = val => {
    return (
      <>
        <span>{val?.stereo_charge}</span>
        <br />
        {val?.old_stereo ? 'Old' : 'New'}
      </>
    );
  };

  const rowExpansionTemplate = useCallback(
    (data, i) => {
      return (
        <div className="inner_table_wrap" key={i}>
          <DataTable
            value={data.order_job}
            emptyMessage={salesOrderListLoading && <Skeleton count={10} />}
          >
            <Column field="job_no" header="Job No" sortable></Column>
            <Column field="due_date" header="Delivery Date" sortable></Column>
            <Column
              field="product_detail.main_image"
              header="Image"
              body={imageTemplate}
              sortable
            ></Column>
            <Column
              field="product_detail.design"
              header="Design Name"
              sortable
            ></Column>
            <Column
              field="product_detail.code"
              header="Product Code"
              className="product_code view_detail"
              body={productTemplate}
              sortable
            ></Column>

            <Column
              field="bag_detail.bag_type"
              header="Bag Type"
              sortable
            ></Column>
            <Column
              field="product_detail.fabric_color"
              header="Fabric Color"
              sortable
            ></Column>
            <Column
              field="lamination"
              header="Lamination"
              body={laminationBody}
              sortable
            ></Column>
            <Column field="qty" header="PCs" sortable></Column>
            <Column field="weight" header="Weight(KG)" sortable></Column>
            {/* <Column field="rate" header="Rate" sortable></Column> */}
            <Column field="per_pc" header="Rate PC" sortable></Column>
            <Column field="per_kg" header="Rate KG" sortable></Column>
            {/* <Column field="pc_rate" header="PC Amount" sortable></Column> */}
            <Column field="kg_rate" header="KG Amount" sortable></Column>
            <Column
              field="stereo_charge"
              header="Stereo Charge"
              body={stereoChargeBody}
              sortable
            ></Column>
            <Column
              field="additional_charge"
              header="Freight"
              sortable
            ></Column>
            <Column
              field="bag_sent"
              header="BAG SENT"
              sortable
              body={e =>
                bedgeBagLrBodyTemplate(
                  e?.mfgProcess?.bag_sent ? e?.mfgProcess?.bag_sent : false,
                  'bag_sent',
                  e?.mfgProcess?._id,
                )
              }
            ></Column>
            <Column
              field="lrSent"
              header="LR SENT"
              sortable
              body={e =>
                bedgeBagLrBodyTemplate(
                  e?.mfgProcess?.lr_sent ? e?.mfgProcess?.lr_sent : false,
                  'lr_sent',
                  e?.mfgProcess?._id,
                )
              }
            ></Column>
            <Column
              field="status_str"
              header="Status"
              sortable
              body={statusOrderBodyTemplate}
            ></Column>
            {/* <Column field="action" header="Action" body={innerAction}></Column> */}
            {['Admin', 'Sub Admin'].includes(currentUser?.role_name) && (
              <Column field="verify" header="Verify" body={innerVerify} />
            )}
            <Column field="action" header="Action" body={innerAction} />
          </DataTable>
        </div>
      );
    },
    [currentUser, salesOrderListLoading],
  );

  const onUpdateStatusOfOrderJob = useCallback(
    async (id, status) => {
      const res = await dispatch(updateStatusSalesOrder(id, status));
      if (res) {
        dispatch(getSalesOrdersList(pageLimit, 1, searchQuery, applied, dates));
      }
    },
    [dispatch, searchQuery, pageLimit, applied, dates],
  );

  const partiesVerify = useCallback(
    ({ status, _id, is_cancelled, attachment }) => {
      return (
        <>
          {status !== 4 || status !== 2 || status !== 3 ? (
            <div className="panding_action_wrap">
              {(status === 0 || status === 5) && (
                <Button
                  className="btn_transperant"
                  onClick={() =>
                    is_edit_access && onUpdateStatusOfOrderJob(_id, 1)
                  }
                  disabled={is_edit_access ? false : true}
                >
                  <img src={CheckGreen} alt="" />
                </Button>
              )}
              {(status === 0 || status === 1) && (
                <Button
                  className="btn_transperant"
                  onClick={() =>
                    is_edit_access && onUpdateStatusOfOrderJob(_id, 5)
                  }
                  disabled={is_edit_access ? false : true}
                >
                  <img src={CheckRed} alt="" />
                </Button>
              )}
            </div>
          ) : null}
        </>
      );
    },
    [onUpdateStatusOfOrderJob, is_edit_access],
  );

  const partiesAction = useCallback(
    ({ status, _id, is_cancelled, attachment }) => {
      const checkPermission =
        is_create_access ||
        is_edit_access ||
        is_delete_access ||
        checkTaxInvoicePermission;
      return (
        <>
          <div className="edit_row">
            <Dropdown className="dropdown_common position-static">
              <Dropdown.Toggle
                id="dropdown-basic"
                className="ection_btn"
                disabled={checkPermission ? false : true}
              >
                <img src={ActionBtn} alt="" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {is_edit_access &&
                  (status === 0 ||
                    status === 1 ||
                    status === 2 ||
                    status === 3) && (
                    <>
                      <Dropdown.Item
                        onClick={() => {
                          dispatch(
                            setIsGetInitialValuesOrder({
                              ...isGetInitialValuesOrder,
                              update: false,
                            }),
                          );
                          navigate(`/update-order/${_id}`);
                        }}
                      >
                        <img src={EditIcon} alt="" /> Edit
                      </Dropdown.Item>
                    </>
                  )}
                {is_delete_access &&
                  (status === 0 ||
                    status === 1 ||
                    status === 2 ||
                    status === 4 ||
                    status === 5) && (
                    <Dropdown.Item
                      onClick={() => {
                        setOrderDeletePopup(_id);
                      }}
                    >
                      <img src={TrashIcon} alt="" /> Delete
                    </Dropdown.Item>
                  )}
                {is_create_access &&
                  (status === 1 ||
                    status === 2 ||
                    status === 3 ||
                    status === 4 ||
                    status === 5) && (
                    <Dropdown.Item
                      onClick={() => {
                        setRepeatOrder(true);
                        setSelectId(_id);
                      }}
                    >
                      <img src={RepeatOrder} alt="" />
                      Repeat Order
                    </Dropdown.Item>
                  )}
                {is_edit_access &&
                  (status === 0 || status === 1 || status === 2) && (
                    <Dropdown.Item
                      onClick={() => {
                        setCancelOrder(true);
                        setSelectId(_id);
                        // handleCancelOrder(_id);
                      }}
                    >
                      <img src={CancelOrder} alt="" />
                      Cancel Order
                    </Dropdown.Item>
                  )}

                {checkTaxInvoicePermission && (
                  <Dropdown.Item
                    onClick={() => setApprovedPopup({ show: true, id: _id })}
                  >
                    <img src={SalesInvoice} alt="" /> Sales Invoice
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </>
      );
    },
    [
      navigate,
      is_edit_access,
      is_create_access,
      is_delete_access,
      checkTaxInvoicePermission,
    ],
  );

  const filterOption = useMemo(() => {
    let flterOptionArray = [
      ...(isJobsOnly ? jobsFilterDetails : filterDetails),
    ];
    if (filters?.length > 0) {
      flterOptionArray = flterOptionArray.map(item => {
        if (filters.find(item2 => item2.filter === item.value)) {
          return { ...item, disabled: true };
        }
        return item;
      });
    }
    return flterOptionArray;
  }, [filters, isJobsOnly]);

  const filterOptions = useMemo(() => {
    const orderObj = {
      present_advisor: partiesAdvisor,
      original_advisor: partiesAdvisor,
      transporter: transporterPartyList,
      party_name: allUserPartyList,
      status: statusObj,
      is_cc_attach: statusArray,
      dispatch_after_payment: statusArray,
      multiple_billing: statusArray,
      dispatch_on_invoice: statusArray,
    };

    const jobObj = {
      'product_detail.fabric_color': fabricColorListMenu,
      'bag_detail.bag_type': bagTypeListMenu,
      status: statusObj,
      bag_sent: commonOption,
      lr_sent: commonOption,
      lamination_typename: laminationOptions,
    };
    return isJobsOnly ? jobObj : orderObj;
  }, [
    bagTypeListMenu,
    fabricColorListMenu,
    allUserPartyList,
    isJobsOnly,
    partiesAdvisor,
    transporterPartyList,
    laminationOptions,
  ]);

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
          order: { ...allFilters?.order, filters: updatedFilters },
        }),
      );
    },
    [filters, allFilters, dispatch],
  );

  const handleAddFilter = useCallback(() => {
    dispatch(
      setAllFilters({
        ...allFilters,
        order: {
          ...allFilters?.order,
          filters: [...allFilters?.order?.filters, { filter: '', value: '' }],
        },
      }),
    );
  }, [allFilters, dispatch]);

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const updatedAppliedFilters =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.order?.applied)?.length > 0;

      if (updatedAppliedFilters) {
        if (isJobsOnly) {
          dispatch(
            getSalesOrderJobsList(
              jobsPageLimit,
              jobsCurrentPage,
              searchQuery,
              {},
            ),
          );
        } else {
          dispatch(
            getSalesOrdersList(pageLimit, currentPage, searchQuery, {}, dates),
          );
        }
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          order: {
            ...allFilters?.order,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.order?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.order.selectedItemIndex !== ''
                ? ''
                : allFilters.order.selectedItemIndex,
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
      dates,
      searchQuery,
      pageLimit,
      currentPage,
      isJobsOnly,
      jobsPageLimit,
      jobsCurrentPage,
    ],
  );

  const selectedFilters = useMemo(() => {
    let list = isJobsOnly ? jobsFilterDetails : filterDetails;
    let filter = filters?.map(filter => {
      let filterDetail = list?.find(detail => detail.value === filter.filter);
      return filterDetail ? filterDetail : null;
    });
    return filter;
  }, [filters, isJobsOnly]);

  const handleFilterEdit = useCallback(
    (data, index) => {
      const sortingFiletr = [...filterDetails, ...jobsFilterDetails];

      const updatedFilterData = {
        ...data,
        filter_list: data?.filter_list?.map(item => {
          const findObj = sortingFiletr?.find(
            obj => obj?.value === item?.filter && obj?.type === 'dropDown',
          );
          const checkDropDownList = [
            'is_cc_attach',
            'dispatch_after_payment',
            'multiple_billing',
            'dispatch_on_invoice',
            'bag_sent',
            'lr_sent',
          ]?.includes(findObj?.value);

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
          order: {
            ...allFilters?.order,
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
          module_name: isJobsOnly ? 'salesOrderJob' : 'salesOrder',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            order: {
              ...allFilters?.order,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          }),
        );
        dispatch(
          getListFilter({
            module_name: isJobsOnly ? 'salesOrderJob' : 'salesOrder',
          }),
        );

        if (isJobsOnly) {
          dispatch(getSalesOrderJobsList(jobsPageLimit, 1, searchQuery, {}));
        } else {
          dispatch(getSalesOrdersList(pageLimit, 1, searchQuery, {}, dates));
        }
        setNameFilter('');
      }
    },
    [
      dispatch,
      isJobsOnly,
      pageLimit,
      allFilters,
      jobsPageLimit,
      dates,
      searchQuery,
    ],
  );

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    const filter_fields = [
      'order_no',
      'days',
      'order_qty',
      'advance_amount',
      'total_amount',
      'job_no',
      'width',
      'height',
      'length',
      'gusset',
      'stereo_charge',
      'status',
    ];

    filters.forEach(item => {
      // if (String(item.value) !== '0') {
      filterArray.push(item);
      // }
    });

    if (filterArray?.length > 0) {
      let filterObj = {};
      filterArray.forEach(item => {
        const convertedArray = filter_fields.includes(item?.filter)
          ? item.value.map(item => Number(item))
          : item.value;

        filterObj = {
          ...filterObj,
          ...{
            [item.filter]: convertedArray,
          },
        };
      });
      if (isJobsOnly) {
        dispatch(
          setAllFilters({
            ...allFilters,
            order: {
              ...allFilters?.order,
              applied: filterObj,
              jobsCurrentPage: 1,
            },
          }),
        );
        dispatch(
          getSalesOrderJobsList(jobsPageLimit, 1, searchQuery, filterObj),
        );
      } else {
        dispatch(
          setAllFilters({
            ...allFilters,
            order: { ...allFilters?.order, applied: filterObj, currentPage: 1 },
          }),
        );
        dispatch(
          getSalesOrdersList(pageLimit, 1, searchQuery, filterObj, dates),
        );
      }
    }
  }, [
    dates,
    filters,
    isJobsOnly,
    dispatch,
    allFilters,
    jobsPageLimit,
    searchQuery,
    pageLimit,
  ]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        if (isJobsOnly) {
          dispatch(
            getSalesOrderJobsList(
              jobsPageLimit,
              jobsCurrentPage,
              searchQuery,
              {},
            ),
          );
        } else {
          dispatch(
            getSalesOrdersList(pageLimit, currentPage, searchQuery, {}, dates),
          );
        }

        dispatch(
          setAllFilters({
            ...allFilters,
            order: {
              ...allFilters?.order,
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
            order: {
              ...allFilters?.order,
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
      isJobsOnly,
      dispatch,
      allFilters,
      jobsPageLimit,
      jobsCurrentPage,
      searchQuery,
      pageLimit,
      currentPage,
      dates,
    ],
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
        module_name: isJobsOnly ? 'salesOrderJob' : 'salesOrder',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: isJobsOnly ? 'salesOrderJob' : 'salesOrder',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }

    if (res) {
      setSaveFilterModal(false);
      dispatch(
        getListFilter({
          module_name: isJobsOnly ? 'salesOrderJob' : 'salesOrder',
        }),
      );
    }
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter, isJobsOnly]);

  const onJobsPageChange = useCallback(
    page => {
      let pageIndex = jobsCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          order: { ...allFilters?.order, jobsCurrentPage: pageIndex },
        }),
      );

      dispatch(
        getSalesOrderJobsList(jobsPageLimit, pageIndex, searchQuery, applied),
      );
    },
    [
      allFilters,
      applied,
      dispatch,
      jobsCurrentPage,
      jobsPageLimit,
      searchQuery,
    ],
  );

  const onJobsPageRowsChange = useCallback(
    page => {
      const updateCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setAllFilters({
          ...allFilters,
          order: {
            ...allFilters?.order,
            jobsCurrentPage: updateCurrentPage,
            jobsPageLimit: page,
          },
        }),
      );
      dispatch(
        getSalesOrderJobsList(page, updateCurrentPage, searchQuery, applied),
      );
    },
    [dispatch, allFilters, searchQuery, applied],
  );

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          order: { ...allFilters?.order, currentPage: pageIndex },
        }),
      );
      dispatch(
        getSalesOrdersList(pageLimit, pageIndex, searchQuery, applied, dates),
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
          order: {
            ...allFilters?.order,
            currentPage: updateCurrentPage,
            pageLimit: page,
          },
        }),
      );

      dispatch(
        getSalesOrdersList(page, updateCurrentPage, searchQuery, {}, dates),
      );
    },
    [allFilters, dates, dispatch, searchQuery],
  );

  const onExport = useCallback(
    async key => {
      const payload = {
        filter: applied,
        search: searchQuery,
        ...(!isJobsOnly && {
          start_date: dates?.startDate
            ? getDMYDateFormat(dates?.startDate)
            : '',
        }),
        ...(!isJobsOnly && {
          end_date: dates?.startDate ? getDMYDateFormat(dates?.startDate) : '',
        }),
      };

      if (isJobsOnly) await dispatch(getExportSalesOrderJobs(key, payload));
      else await dispatch(getExportSalesOrder(key, payload));
    },
    [applied, dates, dispatch, isJobsOnly, searchQuery],
  );

  const handleDelete = useCallback(
    async job_id => {
      if (job_id) {
        const result = await dispatch(deleteSalesOrderJob(job_id));
        if (result) {
          setDeletePopup(false);

          if (isJobsOnly)
            dispatch(
              getSalesOrderJobsList(jobsPageLimit, 1, searchQuery, applied),
            );
          else
            dispatch(
              getSalesOrdersList(pageLimit, 1, searchQuery, applied, dates),
            );
          // dispatch(
          //   getSalesOrderJobsList(jobsPageLimit, 1, searchQuery, applied),
          // );
          dispatch(
            setAllFilters({
              ...allFilters,
              order: { ...allFilters?.order, currentPage: 1 },
            }),
          );
        }
      }
    },
    [dispatch, jobsPageLimit, allFilters, applied, searchQuery],
  );
  const handleSalesInvoice = useCallback(
    async order_id => {
      if (order_id) {
        // const result = await dispatch(generateSalesInvoice(order_id));
        const result = await dispatch(getSalesOrderDetail(order_id));
        if (result) {
          // dispatch(
          //   getSalesOrdersList(pageLimit, 1, searchQuery, applied, dates),
          // );
          navigate(`/add-sales-invoice`, {
            state: { order_id },
          });
          // navigate(`/add-sales-invoice?order_id=${order_id}`);
        }
      }
    },
    [dispatch, navigate],
  );
  const getRowClassName = ({ is_cancelled, status }) => {
    if ((is_cancelled && status === 4) || status === 5) return 'cancelled-row';
    return '';
  };

  const renderOrderTable = useMemo(() => {
    return (
      <div className="data_table_wrapper cell_padding_large is_filter break_header vertical_space_medium">
        <button
          type="button"
          className="table_filter_btn"
          // onClick={() => setFilterToggle(!filterToggle)}
          onClick={() => {
            dispatch(
              setAllCommon({
                ...allCommon,
                order: { ...allCommon?.order, filterToggle: !filterToggle },
              }),
            );
          }}
        >
          <img src={SearchIcon} alt="" />
        </button>

        <DataTable
          value={salesOrderList}
          expandedRows={expandedRows}
          onRowToggle={e => {
            setExpandedRows(e?.data);
          }}
          rowExpansionTemplate={data =>
            data?.order_job?.length > 0 && rowExpansionTemplate(data)
          }
          dataKey="_id"
          filterDisplay="row"
          filters={orderFilters}
          onFilter={event => {
            dispatch(
              setAllCommon({
                ...allCommon,
                order: { ...allCommon?.order, orderFilters: event?.filters },
              }),
            );
          }}
          rowClassName={getRowClassName}
          ref={tableRef}
          emptyMessage={salesOrderListLoading && <Skeleton count={10} />}
          // emptyMessage={
          //   salesOrderLoading ||
          //   salesOrderListLoading ||
          //   salesOrderExportLoading ||
          //   miscMasterLoading ? (
          //     <Skeleton count={10} />
          //   ) : (
          //     false
          //   )
          // }
        >
          <Column
            className="expander_toggle"
            expander={allowExpansion}
            style={{ width: '3rem' }}
          />
          <Column
            field="order_no"
            header="Order No."
            sortable
            filter={filterToggle}
          />
          <Column
            field="order_date"
            header="Order Date"
            sortable
            filter={filterToggle}
          />
          <Column field="days" header="Days" sortable filter={filterToggle} />
          <Column
            header="Party"
            field="party_name_detail"
            className="view_detail party_name_order"
            sortable
            filter={filterToggle}
            body={partieTemplate}
          />
          <Column
            field="order_qty"
            header="Order Qty"
            sortable
            filter={filterToggle}
          />
          <Column
            field="total_amount"
            header="Total Amount"
            sortable
            filter={filterToggle}
          />
          <Column
            field="advance_amount"
            header="Advance Amount"
            sortable
            filter={filterToggle}
          />
          <Column
            field="present_advisor_name"
            header="Present Advisor"
            sortable
            filter={filterToggle}
          />
          <Column
            field="transporter_name"
            header="Transporter"
            className="party_name_order"
            sortable
            filter={filterToggle}
          />
          <Column
            field="comment"
            header="Comments"
            sortable
            filter={filterToggle}
            body={e => commentTemplate(e?.comment)}
          />
          <Column
            field="is_cc_attach_str"
            header="CC Attach"
            sortable
            body={e => bedgeBodyTemplate(e?.is_cc_attach)}
            filter={filterToggle}
          />
          <Column
            field="dispatch_after_payment_str"
            header="DisPatch After Payment"
            sortable
            body={e => bedgeBodyTemplate(e?.dispatch_after_payment)}
            filter={filterToggle}
          />
          <Column
            field="multiple_billing_str"
            header="Multi Billing"
            sortable
            body={e => bedgeBodyTemplate(e?.multiple_billing)}
            filter={filterToggle}
          />
          <Column
            field="dispatch_on_invoice_str"
            header="Customer Inv"
            sortable
            body={e => bedgeBodyTemplate(e?.dispatch_on_invoice)}
            filter={filterToggle}
          />
          <Column
            field="status_str"
            header="Status"
            sortable
            body={statusOrderBodyTemplate}
            filter={filterToggle}
          />
          {['Admin', 'Sub Admin'].includes(currentUser?.role_name) && (
            <Column field="verify" header="Verify" body={partiesVerify} />
          )}
          <Column field="action" header="Action" body={partiesAction} />
        </DataTable>
        <CustomPaginator
          dataList={salesOrderList}
          pageLimit={pageLimit}
          onPageChange={onPageChange}
          onPageRowsChange={onPageRowsChange}
          currentPage={currentPage}
          totalCount={salesOrderCount}
        />
      </div>
    );
  }, [
    currentUser,
    currentPage,
    expandedRows,
    filterToggle,
    pageLimit,
    salesOrderCount,
    salesOrderList,
    salesOrderListLoading,
    allCommon,
    orderFilters,
    dispatch,
  ]);

  const renderJobsTable = useMemo(() => {
    return (
      <div className="data_table_wrapper cell_padding_large is_filter break_header vertical_space_medium">
        <button
          type="button"
          className="table_filter_btn"
          // onClick={() => setJobFilterToggle(!jobFilterToggle)}
          onClick={() => {
            dispatch(
              setAllCommon({
                ...allCommon,
                order: {
                  ...allCommon?.order,
                  jobFilterToggle: !jobFilterToggle,
                },
              }),
            );
          }}
        >
          <img src={SearchIcon} alt="" />
        </button>
        <DataTable
          value={salesOrderOnlyJobsList}
          dataKey="_id"
          filters={jobFilters}
          onFilter={event => {
            dispatch(
              setAllCommon({
                ...allCommon,
                order: { ...allCommon?.order, jobFilters: event?.filters },
              }),
            );
          }}
          sortMode="multiple"
          sortField=" "
          filterDisplay="row"
          // emptyMessage={
          //   (salesOrderLoading ||
          //     salesOrderListLoading ||
          //     salesOrderExportLoading ||
          //     miscMasterLoading) && <Skeleton count={10} />
          // }
          emptyMessage={salesOrderListLoading && <Skeleton count={10} />}
        >
          <Column
            field="job_no"
            header="Job No"
            sortable
            filter={jobFilterToggle}
          ></Column>
          <Column
            field="due_date"
            header="Delivery Date"
            sortable
            filter={jobFilterToggle}
          ></Column>
          <Column
            field="product_detail.main_image"
            header="Image"
            body={imageTemplate}
          ></Column>
          <Column
            field="product_detail.design"
            header="Design Name"
            sortable
            filter={jobFilterToggle}
          ></Column>
          <Column
            field="product_detail.code"
            header="Product Code"
            className="product_code view_detail"
            body={productTemplate}
            sortable
            filter={jobFilterToggle}
          ></Column>

          <Column
            field="bag_detail.bag_type"
            header="Bag Type"
            sortable
            filter={jobFilterToggle}
          ></Column>
          <Column
            field="product_detail.fabric_color"
            header="Fabric Color"
            filter={jobFilterToggle}
            sortable
          ></Column>
          <Column
            field="lamination"
            header="Lamination"
            body={laminationBody}
            sortable
          ></Column>
          <Column
            field="qty"
            header="PCs"
            sortable
            filter={jobFilterToggle}
          ></Column>
          <Column
            field="weight"
            header="Weight(KG)"
            sortable
            filter={jobFilterToggle}
          ></Column>
          {/* <Column
            field="rate"
            header="Rate"
            filter={jobFilterToggle}
            sortable
          ></Column> */}
          {/* <Column
            field="per_pc"
            header="Rate PC"
            sortable
            filter={jobFilterToggle}
          ></Column> */}
          <Column
            field="per_kg"
            header="Rate KG"
            sortable
            filter={jobFilterToggle}
          ></Column>
          <Column
            field="pc_rate"
            header="PC Amount"
            sortable
            filter={jobFilterToggle}
          ></Column>
          <Column
            field="kg_rate"
            header="KG Amount"
            sortable
            filter={jobFilterToggle}
          ></Column>
          <Column
            field="stereo_charge"
            header="Stereo Charge"
            body={stereoChargeBody}
            sortable
            filter={jobFilterToggle}
          ></Column>
          <Column
            field="additional_charge"
            header="Freight "
            sortable
            filter={jobFilterToggle}
          ></Column>
          <Column
            field="bag_sent"
            header="BAG SENT"
            sortable
            filter={jobFilterToggle}
            body={e =>
              bedgeBagLrBodyTemplate(
                e?.mfgProcess?.bag_sent ? e?.mfgProcess?.bag_sent : false,
                'bag_sent',
                e?.mfgProcess?._id,
              )
            }
          ></Column>
          <Column
            field="lrSent"
            header="LR SENT"
            sortable
            filter={jobFilterToggle}
            body={e =>
              bedgeBagLrBodyTemplate(
                e?.mfgProcess?.lr_sent ? e?.mfgProcess?.lr_sent : false,
                'lr_sent',
                e?.mfgProcess?._id,
              )
            }
          ></Column>
          <Column
            field="status_str"
            header="Status"
            sortable
            filter={jobFilterToggle}
            body={statusOrderBodyTemplate}
          ></Column>
          {/* <Column field="action" header="Action" body={innerAction}></Column> */}
          {['Admin', 'Sub Admin'].includes(currentUser?.role_name) && (
            <Column field="verify" header="Verify" body={innerVerify} />
          )}
          <Column field="action" header="Action" body={innerAction} />
        </DataTable>
        <CustomPaginator
          dataList={salesOrderOnlyJobsList}
          pageLimit={jobsPageLimit}
          onPageChange={onJobsPageChange}
          onPageRowsChange={onJobsPageRowsChange}
          currentPage={jobsCurrentPage}
          totalCount={salesOrderJobsCount}
        />
      </div>
    );
  }, [
    dispatch,
    allCommon,
    jobFilters,
    jobsPageLimit,
    jobFilterToggle,
    jobsCurrentPage,
    salesOrderJobsCount,
    salesOrderListLoading,
    salesOrderOnlyJobsList,
  ]);

  const handleSearchInput = (e, jobsOnly) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        order: {
          ...allFilters?.order,
          ...(!jobsOnly && { currentPage: 1 }),
          ...(jobsOnly && { jobsCurrentPage: 1 }),
        },
      }),
    );

    if (jobsOnly) {
      dispatch(
        getSalesOrderJobsList(jobsPageLimit, 1, e.target.value, applied),
      );
    } else {
      dispatch(
        getSalesOrdersList(pageLimit, 1, e.target.value, applied, dates),
      );
    }
  };

  const debouncehandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const handleDateManage = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        order: {
          ...allFilters?.order,
          dates: e,
        },
      }),
    );

    loadTableData(e);
  };

  return (
    <>
      {/* {(salesOrderExportLoading ||
        miscMasterLoading ||
        salesOrderLoading ||
        salesOrderCRUDLoading) && <Loader />} */}
      {salesOrderCRUDLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col xl={2}>
                <div className="page_title">
                  <h3 className="m-0">Orders</h3>
                </div>
              </Col>
              <Col xl={10}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li className="order_checkbox_wrap">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="ShowTransportersonly"
                          name="ShowTransportersonly"
                          value={isJobsOnly}
                          onChange={e => {
                            dispatch(
                              setAllFilters({
                                ...allFilters,
                                order: {
                                  ...allFilters?.order,
                                  applied: {},
                                },
                              }),
                            );

                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                order: {
                                  ...allCommon?.order,
                                  isJobsOnly: e.checked,
                                  filterToggle: false,
                                  jobFilterToggle: false,
                                  searchQuery: '',
                                },
                              }),
                            );

                            if (e.checked) {
                              dispatch(
                                getSalesOrderJobsList(
                                  jobsPageLimit,
                                  jobsCurrentPage,
                                  '',
                                  {},
                                ),
                              );
                            } else {
                              dispatch(
                                getSalesOrdersList(
                                  pageLimit,
                                  currentPage,
                                  '',
                                  {},
                                  dates,
                                ),
                              );
                            }

                            tableRef.current?.reset();
                          }}
                          checked={isJobsOnly}
                        />
                        <label htmlFor="ShowTransportersonly" className="mb-0">
                          Show Jobs Only
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
                            debouncehandleSearchInput(e, isJobsOnly);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                order: {
                                  ...allCommon?.order,
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
                    {!isJobsOnly ? (
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
                                  order: {
                                    ...allFilters?.order,
                                    dates: e.value,
                                  },
                                }),
                              );
                              if (e?.value && e.value[0] && e.value[1]) {
                                dispatch(
                                  getSalesOrdersList(
                                    pageLimit,
                                    currentPage,
                                    searchQuery,
                                    applied,
                                    e.value,
                                  ),
                                );
                              } else if (e.value === null) {
                                dispatch(
                                  getSalesOrdersList(
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
                                      order: {
                                        ...allFilters?.order,
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
                    ) : (
                      ''
                    )}
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
                            disabled={is_export_access ? false : true}
                          >
                            <img src={ExportIcon} alt="" />
                          </Dropdown.Toggle>
                        </OverlayTrigger>

                        <Dropdown.Menu>
                          {/* <Dropdown.Item onClick={() => onExport('pdf')}>
                            PDF
                          </Dropdown.Item> */}
                          <Dropdown.Item onClick={() => onExport('excel')}>
                            XLS
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                    <li className="add_btn">
                      <Button
                        onClick={() => {
                          if (is_create_access) {
                            dispatch(setPreviousTransporter());
                            dispatch(clearAddSelectedOrderData());
                            dispatch(
                              setIsGetInitialValuesOrder({
                                ...isGetInitialValuesOrder,
                                add: false,
                              }),
                            );
                            navigate('/add-new-order');
                          }
                        }}
                        className="btn_primary"
                        disabled={is_create_access ? false : true}
                      >
                        <img src={PlusIcon} alt="" /> Add New Order
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          {isJobsOnly && renderJobsTable}
          {!isJobsOnly && renderOrderTable}
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
          header="Sales Invoice"
          visible={approvedPopup?.show}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => setApprovedPopup({ show: false, id: '' })}
        >
          <div className="approval_content_wrap">
            <p className="text-center mb-4">
              Are you sure you want to make a sales invoice for this order?
            </p>
            <div className="button_group d-flex align-items-center justify-content-center">
              <Button
                className="btn_border"
                onClick={() => setApprovedPopup({ show: false, id: '' })}
              >
                Cancel
              </Button>
              <Button
                className="btn_primary ms-2"
                onClick={() => {
                  dispatch(
                    setIsGetInitialValuesSalesInvoice({
                      ...isGetInitialValuesSalesInvoice,
                      add: false,
                    }),
                  );
                  handleSalesInvoice(approvedPopup?.id);
                  setApprovedPopup({ show: false, id: '' });
                }}
              >
                Save
              </Button>
            </div>
          </div>
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
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <ConfirmDialog
        visible={orderDeletePopup}
        handleDelete={handleDeleteOrder}
        setDeletePopup={setOrderDeletePopup}
      />

      <Dialog
        header="Repeat Confirmation"
        visible={repeatOrder}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setRepeatOrder(false)}
      >
        <div className="delete_wrapper py-4">
          <p className="text-center">
            Are you sure you want to Repeat this item?
          </p>
        </div>
        <div className="d-flex justify-content-center">
          <Button className="btn_border" onClick={() => setRepeatOrder(false)}>
            Cancel
          </Button>
          <Button
            className="btn_primary ms-3"
            onClick={() => {
              handleRepeatOrder(selectId);
            }}
          >
            OK
          </Button>
        </div>
      </Dialog>
      <Dialog
        header="Cancel Confirmation"
        visible={cancelOrder}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setCancelOrder(false)}
      >
        <div className="delete_wrapper py-4">
          <p className="text-center">
            Are you sure you want to Cancel this item?
          </p>
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
      <WhatsAppShare
        whatsappPopup={whatsappPopup}
        setWhatsappPopup={setWhatsappPopup}
        data={whatsappData}
        isBagDetail={true}
      />
    </>
  );
}
