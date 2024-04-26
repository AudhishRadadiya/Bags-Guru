import { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useNavigate, useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import CheckGreen from '../../Assets/Images/check-round-green.svg';
import CheckRed from '../../Assets/Images/check-round-red.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import Whatsapp from '../../Assets/Images/whatsapp.svg';
import { useDispatch } from 'react-redux';
import {
  deleteSalesOrderJob,
  getSalesOrdersItem,
  updateStatusSalesOrderJob,
} from 'Services/Sales/OrderServices';
import { useSelector } from 'react-redux';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import WhatsAppShare from 'Components/Common/Whatsapp';
import {
  clearSelectedSalesOrder,
  setIsGetInitialValuesJob,
} from 'Store/Reducers/Sales/SalesOrderSlice';
import {
  updateBagSentStatus,
  updateLrSentStatus,
} from 'Services/Production/mfgLiveServices';
import { checkModulePermission } from 'Helper/Common';
import moment from 'moment';
import Loader from 'Components/Common/Loader';

const imageTemplate = data => {
  return (
    <div className="image_zoom_Wrapper">
      <Image
        src={data?.product_detail?.main_image}
        zoomSrc={data?.product_detail?.main_image}
        alt="Image"
        preview
        downloadable
      />
    </div>
  );
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
const statusOrderBodyTemplate = rowData => {
  return (
    <Tag
      value={getStatusText(rowData?.status)}
      severity={getOrderSeverity(rowData)}
    ></Tag>
  );
};

const getOrderSeverity = order => {
  switch (order.status) {
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

const getSeverity = val => {
  switch (val) {
    case true:
      return 'success';
    case false:
      return 'danger';
    default:
      return null;
  }
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

export default function OrderDetails({ hasAccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const location = useLocation();
  // let { Oncancel } = location.state;
  const { order_id } = useParams();
  const { is_edit_access } = hasAccess;
  const [whatsappPopup, setWhatsappPopup] = useState(false);
  const [whatsappData, setWhatsappData] = useState({});
  const [approvedPopup, setApprovedPopup] = useState({
    show: false,
    data: {},
  });
  const [deletePopup, setDeletePopup] = useState(false);
  const [orderDate, setOrderDate] = useState('');
  const { selectedOrder, isGetInitialValuesJob, salesOrderLoading } =
    useSelector(({ salesOrder }) => salesOrder);
  const { userPermissionList } = useSelector(({ settings }) => settings);
  const { currentUser } = useSelector(({ auth }) => auth);

  const checkMFGLivePermission = checkModulePermission(
    userPermissionList,
    'Production',
    'MFG Live',
    'edit',
  );

  useEffect(() => {
    if (selectedOrder?.order_date) {
      const formattedOrderDate = moment(selectedOrder?.order_date).format(
        'DD-MM-YYYY',
      );
      setOrderDate(formattedOrderDate);
      // const [month, day, year] = selectedOrder?.order_date?.split('/');
      // const formattedOrderDate = `${day}-${month}-${year}`;
    }
  }, [selectedOrder]);

  const handleTransporter = () => {
    if (selectedOrder?.transporter_detail?.length > 0)
      return `${selectedOrder?.transporter_detail[0]?.name || ''}\n${
        selectedOrder?.transporter_detail[0]?.gst || ''
      }\n${selectedOrder?.transporter_detail[0]?.personal_contact_no || ''}`;
    else {
      return '';
    }
  };

  const handleDeleteJob = useCallback(
    async job_id => {
      if (job_id) {
        const result = await dispatch(deleteSalesOrderJob(job_id));
        if (result) {
          setDeletePopup(false);
          dispatch(getSalesOrdersItem(order_id));
        }
      }
    },
    [dispatch],
  );

  const onUpdateStatusOfJob = useCallback(
    async (_id, status) => {
      const res = await dispatch(updateStatusSalesOrderJob(_id, status));
      if (res) {
        dispatch(getSalesOrdersItem(order_id));
      }
    },
    [dispatch],
  );

  const innerAction = useCallback(
    ({ status, _id, is_cancelled, salesOrder_id, ...rest }) => {
      return (
        <>
          <div className="edit_row">
            <Dropdown className="dropdown_common position-static">
              <Dropdown.Toggle id="dropdown-basic" className="ection_btn">
                <img src={ActionBtn} alt="" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {(status === 0 ||
                  status === 1 ||
                  status === 2 ||
                  status === 3) && (
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
                {(status === 0 ||
                  status === 1 ||
                  status === 2 ||
                  status === 4 ||
                  status === 5) && (
                  <Dropdown.Item onClick={() => setDeletePopup(_id)}>
                    <img src={TrashIcon} alt="" /> Delete
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  onClick={() => {
                    setWhatsappPopup(_id);
                    setWhatsappData(rest);
                  }}
                >
                  <img src={Whatsapp} alt="" /> WhatsApp
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </>
      );
    },
    [handleDeleteJob, navigate],
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
                  onClick={() => onUpdateStatusOfJob(_id, 1)}
                  disabled={is_edit_access ? false : true}
                >
                  <img src={CheckGreen} alt="" />
                </Button>
              )}
              {(status === 0 || status === 1) && (
                <Button
                  className="btn_transperant"
                  onClick={() => onUpdateStatusOfJob(_id, 5)}
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
    [is_edit_access, onUpdateStatusOfJob],
  );

  const statusBodyTemplate = (columnVal, fieldValue, columnName) => {
    if (columnName === 'roll' || columnName === 'str_ord') {
      return (
        <span className={`bedge_${getRollSeverity(columnVal)}`}>
          {fieldValue}
        </span>
      );
    } else {
      return (
        <span className={`bedge_${getSeverity(columnVal)}`}>{fieldValue}</span>
      );
    }
  };
  const handleBodyChange = useCallback(
    async (val, name, id) => {
      if (name === 'bag_sent') {
        let payload = {
          process_id: id,
          status: commonCase(val),
        };
        let res = await dispatch(updateBagSentStatus(payload));
        if (res) {
          dispatch(getSalesOrdersItem(order_id));
        }
      }
      if (name === 'lr_sent') {
        let payload = {
          process_id: id,
          status: commonCase(val),
        };
        let res = await dispatch(updateLrSentStatus(payload));
        if (res) {
          dispatch(getSalesOrdersItem(order_id));
        }
      }
    },
    [dispatch],
  );
  const bedgeBagLrBodyTemplate = (val, name, id) => {
    return (
      <div>
        <button
          className={`bedge_${getSeverity(val)}`}
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

  useEffect(() => {
    return () => {
      dispatch(clearSelectedSalesOrder());
    };
  }, []);

  useEffect(() => {
    if (order_id) dispatch(getSalesOrdersItem(order_id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order_id]);

  const customNoColumn = (rowData, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
  };
  const productTemplate = val => {
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

  return (
    <>
      {salesOrderLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="job_detail_wrap">
          <Row>
            <Col xxl={6}>
              <div className="job_detail_left_wrap border rounded-3 bg_white p-3">
                <h3 className="mb-3">Order Details</h3>
                <Row>
                  <Col lg={8}>
                    <Row>
                      <Col md={4} sm={6}>
                        <div className="form_group mb-3">
                          <label htmlFor="OrderNo">Order No</label>
                          <InputText
                            disabled
                            id="OrderNo"
                            placeholder="Order No"
                            value={selectedOrder?.order_no || ''}
                          />
                        </div>
                      </Col>
                      <Col md={4} sm={6}>
                        <div className="form_group date_select_wrapper mb-3">
                          <label htmlFor="OrderDate">Order Date</label>
                          <InputText
                            disabled
                            id="OrderDate"
                            placeholder="Order Date"
                            value={orderDate}
                          />
                        </div>
                      </Col>
                      <Col md={4} sm={6}>
                        <div className="form_group mb-3">
                          <label htmlFor="PartyName">Party Name</label>
                          <InputText
                            id="PartyName"
                            placeholder="Party Name"
                            disabled
                            value={selectedOrder?.party_name_detail || ''}
                          />
                        </div>
                      </Col>
                      <Col md={4} sm={6}>
                        <div className="form_group mb-3">
                          <label htmlFor="PresentAdvisor">
                            Present Advisor
                          </label>
                          <InputText
                            id="PresentAdvisor"
                            placeholder="Present Advisor"
                            disabled
                            value={selectedOrder?.present_advisor_name || ''}
                          />
                        </div>
                      </Col>
                      <Col md={4} sm={6}>
                        <div className="form_group mb-3">
                          <label htmlFor="y">Booking Station</label>
                          <InputText
                            id="PresentAdvisor"
                            placeholder="Present Advisor"
                            disabled
                            value={selectedOrder?.booking_station || ''}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4}>
                    <div className="job_detail_question_wrap mb-lg-0 mb-3">
                      <ul>
                        <li key={1}>
                          {selectedOrder?.is_cc_attach ? (
                            <img src={CheckGreen} alt="CheckIcon"></img>
                          ) : (
                            <img src={CheckRed} alt="CheckIcon"></img>
                          )}
                          <label>CC Attach ?</label>
                        </li>
                        <li key={2}>
                          {selectedOrder?.dispatch_after_payment ? (
                            <img src={CheckGreen} alt="CheckIcon"></img>
                          ) : (
                            <img src={CheckRed} alt="CheckIcon"></img>
                          )}
                          <label>Dispatch After Payment ?</label>
                        </li>
                        <li key={3}>
                          {selectedOrder?.multiple_billing ? (
                            <img src={CheckGreen} alt="CheckIcon"></img>
                          ) : (
                            <img src={CheckRed} alt="CheckIcon"></img>
                          )}
                          <label>Multiple Billing For Order ?</label>
                        </li>
                        <li key={4}>
                          {selectedOrder?.dispatch_on_invoice ? (
                            <img src={CheckGreen} alt="CheckIcon"></img>
                          ) : (
                            <img src={CheckRed} alt="CheckIcon"></img>
                          )}
                          <label>Dispatch on Customer Invoice?</label>
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col lg={8}>
                    <Row>
                      <h3 className="mb-3">
                        Name: {selectedOrder?.contact_person_name}
                      </h3>
                      <Col md={4} sm={6}>
                        <div className="form_group mb-3">
                          <label htmlFor="ContactF">Contact Number 1</label>
                          <InputText
                            id="ContactF"
                            placeholder="Contact Number 1"
                            disabled
                            value={
                              selectedOrder?.contact_person_mobile_no1 || ''
                            }
                          />
                        </div>
                      </Col>
                      <Col md={4} sm={6}>
                        <div className="form_group mb-3">
                          <label htmlFor="ContactS">Contact Number 2</label>
                          <InputText
                            id="ContactS"
                            placeholder="Contact Number 2"
                            disabled
                            value={
                              selectedOrder?.contact_person_mobile_no2 || ''
                            }
                          />
                        </div>
                      </Col>
                      <Col md={4} sm={6}>
                        <div className="form_group mb-3">
                          <label htmlFor="Email">Email</label>
                          <InputText
                            id="Email"
                            placeholder="Email"
                            disabled
                            value={selectedOrder?.contact_person_email || ''}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={12}>
                    <Row>
                      <Col md={6}>
                        <div className="form_group mb-3">
                          <label htmlFor="Transporter">Transporter</label>
                          <InputTextarea
                            placeholder="Transporter"
                            disabled
                            rows={4}
                            value={handleTransporter() || ''}
                          />
                        </div>
                      </Col>
                      <Col md={6} sm={6}>
                        <div className="form_group mb-3">
                          <label htmlFor="Comment">Comment</label>
                          <InputTextarea
                            placeholder="Comment"
                            rows={4}
                            disabled
                            className="text-danger"
                            value={selectedOrder?.comment || ''}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xxl={6}>
              <div className="job_detail_right_wrap border rounded-3 bg_white p-3 pe-0 mt-xxl-0 mt-3 h-100">
                <h3 className="mb-3">Address Details</h3>
                <div className="job_detail_right_wrap_inner">
                  <Row>
                    <Col md={6}>
                      {selectedOrder?.billing_address_list?.map((data, i) => {
                        return (
                          <div className="form_group mb-3">
                            <label>Business Billing Address</label>
                            <div className="address_select_wrap">
                              <ReactSelectSingle
                                disabled
                                placeholder={data?.business_name}
                                value={''}
                              />

                              <div className="address_wrap">
                                {data?.address},<br />
                                {data?.city_name},{data?.state_name},
                                {data?.pincode},
                                <br />
                                {data?.country_name}
                                <br />
                                {data?.gstin}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Col>
                    <Col md={6}>
                      {selectedOrder?.shipping_address_list?.map((data, i) => {
                        return (
                          <div className="form_group mb-3">
                            <label>Business Shipping Address</label>
                            <div className="address_select_wrap">
                              <ReactSelectSingle
                                disabled
                                value={''}
                                placeholder={data?.business_name}
                              />

                              <div className="address_wrap">
                                {data?.address},<br />
                                {data?.city_name},{data?.state_name},
                                {data?.pincode},
                                <br />
                                {data?.country_name}
                                <br />
                                {data?.gstin}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
          <div className="job_detail_table_wrap mt-3">
            <div className="border rounded-3 bg_white">
              <div className="p-3 d-flex justify-content-end">
                {/* <Link to={`/add-job/${order_id}`} className="btn_primary">
                  <img src={PlusIcon} alt="PlusIcon"></img>
                  Add Job
                </Link> */}
                <Button
                  className="btn_primary"
                  onClick={e => {
                    dispatch(
                      setIsGetInitialValuesJob({
                        ...isGetInitialValuesJob,
                        add: false,
                      }),
                    );
                    navigate(`/add-job/${order_id}`);
                  }}
                >
                  <img src={PlusIcon} alt="" />
                  Add Job
                </Button>
              </div>
              <div className="data_table_wrapper break_header auto_height with_image_column vertical_space_medium max_height">
                <DataTable value={selectedOrder?.order_job} key={selectedOrder}>
                  <Column
                    field=""
                    header="No"
                    sortable
                    body={customNoColumn}
                  ></Column>
                  <Column
                    field="roll"
                    header="ROLL"
                    sortable
                    body={e =>
                      statusBodyTemplate(e?.roll, e?.roll_available_str, 'roll')
                    }
                  ></Column>
                  <Column
                    field="hndl"
                    header="HNDL"
                    sortable
                    body={e => statusBodyTemplate(e?.hndl, e?.hndl_str, 'hndl')}
                  ></Column>
                  <Column
                    field="old_stereo"
                    header="OLD STR"
                    sortable
                    body={e =>
                      statusBodyTemplate(
                        e?.oldStr,
                        e?.old_str_str,
                        'old_stereo',
                      )
                    }
                  ></Column>
                  <Column
                    field="strOrd"
                    header="STR ORD"
                    sortable
                    body={e =>
                      statusBodyTemplate(e?.strOrd, e?.str_ord_str, 'str_ord')
                    }
                  ></Column>
                  <Column
                    field="strRcv"
                    header="STR RCV"
                    sortable
                    body={e =>
                      statusBodyTemplate(e?.strRcv, e?.str_rcv_str, 'str_rcv')
                    }
                  ></Column>
                  <Column
                    field="print"
                    header="PRINT"
                    sortable
                    body={e =>
                      statusBodyTemplate(e?.print, e?.print_str, 'print')
                    }
                  ></Column>
                  <Column
                    field="bagMade"
                    header="BAG MADE"
                    sortable
                    body={e =>
                      statusBodyTemplate(
                        e?.bagMade,
                        e?.bag_made_str,
                        'bag_made',
                      )
                    }
                  ></Column>
                  <Column
                    field="bagSent"
                    header="BAG SENT"
                    sortable
                    body={e =>
                      bedgeBagLrBodyTemplate(
                        e?.bagSent,
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
                        e?.lrSent,
                        'lr_sent',
                        e?.mfgProcess?._id,
                      )
                    }
                  ></Column>
                  <Column
                    field="due_date"
                    header="Delivery Date"
                    sortable
                  ></Column>
                  <Column
                    field="image"
                    header="Image"
                    sortable
                    body={imageTemplate}
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
                  <Column field="qty" header="PCs" sortable></Column>
                  {/* <Column field="rate" header="Rate" sortable></Column> */}
                  <Column field="weight" header="Weight(KG)" sortable></Column>
                  <Column field="per_pc" header="Rate PC" sortable></Column>
                  <Column field="per_kg" header="Rate KG" sortable></Column>
                  <Column field="pc_rate" header="PC Amount" sortable></Column>
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
                    field="final_amount"
                    header="Final Amount"
                    sortable
                  ></Column>
                  <Column field="comment" header="Comment" sortable></Column>

                  <Column
                    field="status"
                    header="Status"
                    sortable
                    body={statusOrderBodyTemplate}
                  ></Column>
                  {['Admin', 'Sub Admin'].includes(currentUser?.role_name) && (
                    <Column field="verify" header="Verify" body={innerVerify} />
                  )}
                  <Column field="action" header="Action" body={innerAction} />
                </DataTable>
              </div>
            </div>

            <div className="button_group d-flex justify-content-end mt-3">
              {/* <Link to={Oncancel ? Oncancel : '/order'} className="btn_border">
                Cancel
              </Link> */}
              <Button
                className="btn_border"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
        <Dialog
          header="Approved"
          visible={approvedPopup.show}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => setApprovedPopup({ ...approvedPopup, show: false })}
        >
          <div className="approval_content_wrap">
            <p className="text-center mb-4">
              Are you sure you want to{' '}
              {approvedPopup.data === 'Yes' ? (
                <span className="text-danger">Reject?</span>
              ) : (
                <span className="text-success">Approve?</span>
              )}
            </p>
            <div className="button_group d-flex align-items-center justify-content-center">
              <Button
                className="btn_border"
                onClick={() =>
                  setApprovedPopup({ ...approvedPopup, show: false })
                }
              >
                Cancel
              </Button>
              <Button
                className="btn_primary ms-2"
                onClick={() =>
                  setApprovedPopup({ ...approvedPopup, show: false })
                }
              >
                Save
              </Button>
            </div>
          </div>
        </Dialog>
      </div>

      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDeleteJob}
        setDeletePopup={setDeletePopup}
      />
      <WhatsAppShare
        whatsappPopup={whatsappPopup}
        setWhatsappPopup={setWhatsappPopup}
        data={whatsappData}
        isBagDetail={true}
      />
    </>
  );
}
