import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import FinishedGoodChart from 'Components/Common/Charts/FinishedGoodChart';
import LaminationRatio from 'Components/Common/Charts/LaminationRatio';
import RawMaterialChart from 'Components/Common/Charts/RawMaterialChart';
import SalesComparison from 'Components/Common/Charts/SalesComparison';
import SalesRatioChart from 'Components/Common/Charts/SalesRatioChart';
import { Button, Col, Row } from 'react-bootstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import moment from 'moment';
import { OverlayPanel } from 'primereact/overlaypanel';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import {
  getAdvisorReportList,
  getAdvisorTurnoverReportList,
  getLaminationReportList,
  getPartyTypeReportList,
  getPendingJobBagTypeReportList,
  getPendingJobPrintTechnologyReportList,
  getProductStockReportList,
  getRawMaterialReportList,
  getStateTurnoverReportList,
} from 'Services/Business/AdminDashboardServices';
import { getActiveWarehouseList } from 'Services/Settings/MiscMasterService';
import variablePie from 'highcharts/modules/variable-pie.js';
import Highcharts from 'highcharts';

variablePie(Highcharts);

const AdminDashboard = () => {
  const pendingJobPrintDateRef = useRef(null);
  const pendingJobBagDateRef = useRef(null);
  const stateTurnOverDateRef = useRef(null);
  const dispatch = useDispatch();

  const todayDate = new Date();
  let oneMonthAgoDate = new Date(todayDate);
  oneMonthAgoDate.setMonth(todayDate.getMonth() - 1);

  const {
    pendingJobPrintTechnologyReportData,
    pendingJobBagTypeReportData,
    stateTurnoverReportData,
    advisorTurnoverReportData,
  } = useSelector(({ adminDashBoard }) => adminDashBoard);
  const { activeWarehouseList } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { warehouse } = allCommon?.adminDashboard;
  const {
    partyTypeRatioReport,
    laminationRatioReport,
    pendingJobPrintTechnologyReport,
    pendingJobBagTypeReport,
    stateTurnoverReport,
  } = allFilters?.adminDashboard;

  const updatedWarehouseOptions = useMemo(() => {
    if (activeWarehouseList?.length > 0) {
      const options = activeWarehouseList?.map(item => {
        return { label: item?.name, value: item?._id };
      });
      return [{ label: 'All', value: '' }, ...options];
    } else {
      return [];
    }
  }, [activeWarehouseList]);

  const handleLoadData = useCallback(
    selectedWarehouse => {
      dispatch(getRawMaterialReportList(selectedWarehouse)); // Raw Material Report:
      dispatch(getProductStockReportList(selectedWarehouse));
    },
    [dispatch],
  );

  const loadData = useCallback(() => {
    dispatch(getActiveWarehouseList());
    handleLoadData(warehouse);
    dispatch(
      getPartyTypeReportList(
        partyTypeRatioReport?.dates?.startDate,
        partyTypeRatioReport?.dates?.endDate,
      ),
    );
    dispatch(
      getLaminationReportList(
        laminationRatioReport?.dates?.startDate,
        laminationRatioReport?.dates?.endDate,
      ),
    );
    dispatch(getAdvisorReportList());
    dispatch(
      getPendingJobPrintTechnologyReportList(
        pendingJobPrintTechnologyReport?.dates?.startDate,
        pendingJobPrintTechnologyReport?.dates?.endDate,
      ),
    );
    dispatch(
      getPendingJobBagTypeReportList(
        pendingJobBagTypeReport?.dates?.startDate,
        pendingJobBagTypeReport?.dates?.endDate,
      ),
    );
    dispatch(
      getStateTurnoverReportList(
        stateTurnoverReport?.dates?.startDate,
        stateTurnoverReport?.dates?.endDate,
      ),
    );
    dispatch(getAdvisorTurnoverReportList());
  }, [
    dispatch,
    handleLoadData,
    warehouse,
    stateTurnoverReport,
    partyTypeRatioReport,
    laminationRatioReport,
    pendingJobBagTypeReport,
    pendingJobPrintTechnologyReport,
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const handleDateManage = useCallback(
    (reportName, e) => {
      dispatch(
        setAllFilters({
          ...allFilters,
          adminDashboard: {
            ...allFilters?.adminDashboard,
            [reportName]: {
              ...allFilters?.adminDashboard[reportName],
              dates: e,
            },
          },
        }),
      );
    },
    [allFilters, dispatch],
  );

  const shareTemplate = useCallback((rowData, i) => {
    if (rowData) {
      return <span key={i}>{rowData?.share}%</span>;
    }
  }, []);

  return (
    <div className="main_Wrapper admin_dashboard_wrap">
      <Row className="justify-content-end">
        <Col xxl={2} xl={3} md={4} sm={5}>
          <div className="chart_input_wrap mb-3">
            <ReactSelectSingle
              BrokerSelect
              value={warehouse}
              options={updatedWarehouseOptions}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    adminDashboard: {
                      ...allCommon?.adminDashboard,
                      warehouse: e.target.value,
                    },
                  }),
                );
                handleLoadData(e.target.value);
              }}
              placeholder="Warehouse"
            />
          </div>
        </Col>
      </Row>
      <Row className="g-3">
        <Col xxl={3} xl={4} md={6}>
          <RawMaterialChart />
        </Col>
        <Col xxl={3} xl={4} md={6}>
          <FinishedGoodChart />
        </Col>
        <Col xxl={3} xl={4} md={6}>
          <SalesRatioChart handleDateManage={handleDateManage} />
        </Col>
        <Col xxl={3} xl={4} md={6}>
          <LaminationRatio handleDateManage={handleDateManage} />
        </Col>
        <Col xxl={6} xl={8}>
          <SalesComparison />
        </Col>
        {/* <Col xxl={5} xl={8}>
          <BagCategory />
        </Col>
        <Col xxl={2} xl={4} md={4}>
          <div className="financial_year_wrap bg_white rounded-3 border mb-3 h-100">
            <h3 className="p-3 m-0 text-end">Financial Year 2022-23 </h3>
            <ul>
              <li>
                <div className="finanacial_year_left">
                  <img src={TotalRevenue} alt="TotalRevenue" />
                </div>
                <div className="finanacial_year_right">
                  <h2>₹1,50,000</h2>
                  <h4 className="text_light m-0">Total Revenue </h4>
                </div>
              </li>
              <li>
                <div className="finanacial_year_left orange_line">
                  <img src={Customers} alt="Customers" />
                </div>
                <div className="finanacial_year_right">
                  <h2>1000</h2>
                  <h4 className="text_light m-0">Customers without Order</h4>
                </div>
              </li>
              <li>
                <div className="finanacial_year_left">
                  <img src={NewCustomers} alt="NewCustomers" />
                </div>
                <div className="finanacial_year_right">
                  <h2>50,000</h2>
                  <h4 className="text_light m-0">Total New customers</h4>
                </div>
              </li>
            </ul>
          </div>
        </Col>
        <Col xxl={4} xl={6} md={8}>
          <div className="table_main_Wrapper bg-white admin_table_wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center">
                <Col sm={5}>
                  <div className="page_title">
                    <h3 className="m-0">Average Turn Around Time</h3>
                  </div>
                </Col>
                <Col sm={7}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li>
                        <button className="btn_transperant">
                          <img src={RefreshCircle} alt="ReferesIcon" />
                        </button>
                      </li>
                      <li className="search_input_wrap">
                        <div className="form_group date_select_wrapper">
                          <Calendar
                            id="averageTurn"
                            placeholder="Select Date Range"
                            showIcon
                            dateFormat="dd-mm-yy"
                            selectionMode="range"
                            readOnlyInput
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper with_colspan_head cell_padding_large break_header max_height">
              <DataTable
                value={averageTimeData}
                sortMode="single"
                sortField="name"
                sortOrder={1}
                rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                selection={selectedProducts}
                onSelectionChange={e => setSelectedProducts(e.value)}
                scrollable
                rowGroupMode="rowspan"
                groupRowsBy="representative.name"
              >
                <Column
                  field="customerName"
                  header="Customer Name"
                  sortable
                  // body={customerNameBodyTemplate}
                ></Column>
                <Column field="orderStatus" header=""></Column>
                <Column
                  field="nonLamination"
                  header="Non Lamination"
                  sortable
                ></Column>
                <Column
                  field="laminationNew"
                  header="Lamination (New)"
                  sortable
                ></Column>
                <Column
                  field="laminationRepeat"
                  header="Lamination (Repeat)"
                  sortable
                ></Column>
              </DataTable>
            </div>
          </div>
        </Col> */}
        {/* <Col xxl={4} lg={6}>
          <div className="table_main_Wrapper bg-white admin_table_wrapper">
            <div className="top_filter_wrap">
              <div className="page_title">
                <h3 className="m-0">Pending Jobs</h3>
              </div>
            </div>
            <div className="data_table_wrapper with_colspan_head cell_padding_large break_header max_height">
              <DataTable
                value={manufacturingReportData}
                sortMode="single"
                sortField="name"
                sortOrder={1}
                rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                selection={selectedProducts}
                onSelectionChange={e => setSelectedProducts(e.value)}
                scrollable
                rowGroupMode="rowspan"
              >
                <Column field="no" header="No" sortable></Column>
                <Column field="print" header="Print"></Column>
                <Column field="totalBags" header="Total Bags" sortable></Column>
                <Column field="weight" header="Weight" sortable></Column>
              </DataTable>
            </div>
          </div>
        </Col> */}
        <Col xxl={6} lg={6}>
          <div className="table_main_Wrapper bg-white">
            <div className="top_filter_wrap">
              <Row className="align-items-center">
                <Col xxl={7} xl={6} lg={5} md={8} sm={6}>
                  <div className="page_title">
                    <h3 className="m-0">Pending Jobs</h3>
                  </div>
                </Col>
                <Col xxl={5} xl={6} lg={7} md={4} sm={6}>
                  <ul>
                    <li>
                      <div className="form_group date_range_wrapper">
                        <div
                          className="date_range_select"
                          onClick={e => {
                            pendingJobPrintDateRef.current.toggle(e);
                          }}
                        >
                          <span>
                            {pendingJobPrintTechnologyReport?.dates?.startDate
                              ? moment(
                                  pendingJobPrintTechnologyReport?.dates
                                    .startDate,
                                ).format('DD-MM-yyyy')
                              : ''}{' '}
                            {pendingJobPrintTechnologyReport?.dates
                              ?.startDate &&
                              pendingJobPrintTechnologyReport?.dates?.endDate &&
                              '-'}{' '}
                            {pendingJobPrintTechnologyReport?.dates?.endDate
                              ? moment(
                                  pendingJobPrintTechnologyReport?.dates
                                    .endDate,
                                ).format('DD-MM-yyyy')
                              : 'Select Date Range'}
                          </span>
                        </div>
                        <OverlayPanel ref={pendingJobPrintDateRef}>
                          <div className="date_range_wrap">
                            <DateRangeCalender
                              ranges={[pendingJobPrintTechnologyReport?.dates]}
                              onChange={e => {
                                handleDateManage(
                                  'pendingJobPrintTechnologyReport',
                                  e,
                                );
                                dispatch(
                                  getPendingJobPrintTechnologyReportList(
                                    e?.startDate,
                                    e?.endDate,
                                  ),
                                );
                              }}
                            />
                            <Button
                              className="btn_transperant"
                              onClick={e => {
                                pendingJobPrintDateRef.current.toggle(e);
                                dispatch(
                                  setAllFilters({
                                    ...allFilters,
                                    adminDashboard: {
                                      ...allFilters?.adminDashboard,
                                      pendingJobPrintTechnologyReport: {
                                        ...allFilters?.adminDashboard
                                          ?.pendingJobPrintTechnologyReport,
                                        dates: {
                                          ...allFilters?.adminDashboard
                                            ?.pendingJobPrintTechnologyReport
                                            ?.dates,
                                          startDate: oneMonthAgoDate,
                                          endDate: todayDate,
                                        },
                                      },
                                    },
                                  }),
                                );

                                dispatch(
                                  getPendingJobPrintTechnologyReportList(),
                                );
                              }}
                            >
                              Clear
                            </Button>
                          </div>
                        </OverlayPanel>
                      </div>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
            <div className="table_wrapper">
              <div className="table_scroll_wrapper Customers_table_wrapper admin_dashboars_table_wrapper">
                <table>
                  <thead>
                    <tr>
                      <th rowSpan={2}>Printing Technology</th>
                      <th className="p-0 py-2 text-center" colSpan={2}>
                        Pending
                      </th>
                      <th className="p-0 py-2 text-center" colSpan={2}>
                        Manufacturing
                      </th>
                    </tr>
                    <tr>
                      <th>Total Bags</th>
                      <th>Weight (KG)</th>
                      <th>Total Bags (Per Day)</th>
                      <th>Weight Per Day (KG)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingJobPrintTechnologyReportData?.map((item, i) => {
                      return (
                        <tr key={i}>
                          <th>{item?.print_technology}</th>
                          <td>{item?.total_bag}</td>
                          <td>{item?.total_weight}</td>
                          <td>{item?.bag_per_day}</td>
                          <td>{item?.weight_per_day}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={6} lg={6}>
          <div className="table_main_Wrapper bg-white">
            <div className="top_filter_wrap">
              <Row className="align-items-center justify-content-between">
                <Col xxl={7} xl={6} lg={5} md={8} sm={6}>
                  <div className="page_title">
                    <h3 className="m-0">Pending Jobs</h3>
                  </div>
                </Col>
                <Col xxl={5} xl={6} lg={7} md={4} sm={6}>
                  <ul>
                    <li>
                      <div className="form_group date_range_wrapper">
                        <div
                          className="date_range_select"
                          onClick={e => {
                            pendingJobBagDateRef.current.toggle(e);
                          }}
                        >
                          <span>
                            {pendingJobBagTypeReport?.dates?.startDate
                              ? moment(
                                  pendingJobBagTypeReport?.dates.startDate,
                                ).format('DD-MM-yyyy')
                              : ''}{' '}
                            {pendingJobBagTypeReport?.dates?.startDate &&
                              pendingJobBagTypeReport?.dates?.endDate &&
                              '-'}{' '}
                            {pendingJobBagTypeReport?.dates?.endDate
                              ? moment(
                                  pendingJobBagTypeReport?.dates.endDate,
                                ).format('DD-MM-yyyy')
                              : 'Select Date Range'}
                          </span>
                        </div>
                        <OverlayPanel ref={pendingJobBagDateRef}>
                          <div className="date_range_wrap">
                            <DateRangeCalender
                              ranges={[pendingJobBagTypeReport?.dates]}
                              onChange={e => {
                                handleDateManage('pendingJobBagTypeReport', e);
                                dispatch(
                                  getPendingJobBagTypeReportList(
                                    e?.startDate,
                                    e?.endDate,
                                  ),
                                );
                              }}
                            />
                            <Button
                              className="btn_transperant"
                              onClick={e => {
                                pendingJobBagDateRef.current.toggle(e);
                                // handleDateManage('pendingJobBagTypeReport', {
                                //   startDate: oneMonthAgoDate,
                                //   endDate: todayDate,
                                //   key: 'selection',
                                // });

                                dispatch(
                                  setAllFilters({
                                    ...allFilters,
                                    adminDashboard: {
                                      ...allFilters?.adminDashboard,
                                      pendingJobBagTypeReport: {
                                        ...allFilters?.adminDashboard
                                          ?.pendingJobBagTypeReport,
                                        dates: {
                                          ...allFilters?.adminDashboard
                                            ?.pendingJobBagTypeReport?.dates,
                                          startDate: oneMonthAgoDate,
                                          endDate: todayDate,
                                        },
                                      },
                                    },
                                  }),
                                );

                                dispatch(getPendingJobBagTypeReportList());
                              }}
                            >
                              Clear
                            </Button>
                          </div>
                        </OverlayPanel>
                      </div>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
            <div className="table_wrapper">
              <div className="table_scroll_wrapper Customers_table_wrapper admin_dashboars_table_wrapper">
                <table>
                  <thead>
                    <tr>
                      <th rowSpan={2}>Bags Type</th>
                      <th className="p-0 py-2 text-center" colSpan={2}>
                        Pending
                      </th>
                      <th className="p-0 py-2 text-center" colSpan={2}>
                        Manufacturing
                      </th>
                    </tr>
                    <tr>
                      <th>Total Bags</th>
                      <th>Weight (KG)</th>
                      <th>Total Bags (Per Day)</th>
                      <th>Weight Per Day (KG)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingJobBagTypeReportData?.map((item, i) => {
                      return (
                        <tr key={i}>
                          <th>{item?.bag_type}</th>
                          <td>{item?.total_bag}</td>
                          <td>{item?.total_weight}</td>
                          <td>{item?.bag_per_day}</td>
                          <td>{item?.weight_per_day}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={6} lg={12}>
          <div className="table_main_Wrapper bg-white mb-3">
            <div className="top_filter_wrap">
              <Row className="align-items-center">
                <Col xxl={7} xl={6} lg={5} md={8} sm={6}>
                  <div className="page_title">
                    <h3 className="m-0">State Wise Turnover</h3>
                  </div>
                </Col>
                <Col xxl={5} xl={6} lg={7} md={4} sm={6}>
                  <ul>
                    <li>
                      <div className="form_group date_range_wrapper">
                        <div
                          className="date_range_select"
                          onClick={e => {
                            stateTurnOverDateRef.current.toggle(e);
                          }}
                        >
                          <span>
                            {stateTurnoverReport?.dates?.startDate
                              ? moment(
                                  stateTurnoverReport?.dates.startDate,
                                ).format('DD-MM-yyyy')
                              : ''}{' '}
                            {stateTurnoverReport?.dates?.startDate &&
                              stateTurnoverReport?.dates?.endDate &&
                              '-'}{' '}
                            {stateTurnoverReport?.dates?.endDate
                              ? moment(
                                  stateTurnoverReport?.dates.endDate,
                                ).format('DD-MM-yyyy')
                              : 'Select Date Range'}
                          </span>
                        </div>
                        <OverlayPanel ref={stateTurnOverDateRef}>
                          <div className="date_range_wrap">
                            <DateRangeCalender
                              ranges={[stateTurnoverReport?.dates]}
                              onChange={e => {
                                handleDateManage('stateTurnoverReport', e);
                                dispatch(
                                  getStateTurnoverReportList(
                                    e?.startDate,
                                    e?.endDate,
                                  ),
                                );
                              }}
                            />
                            <Button
                              className="btn_transperant"
                              onClick={e => {
                                stateTurnOverDateRef.current.toggle(e);
                                // handleDateManage('stateTurnoverReport', {
                                //   startDate: oneMonthAgoDate,
                                //   endDate: todayDate,
                                //   key: 'selection',
                                // });

                                dispatch(
                                  setAllFilters({
                                    ...allFilters,
                                    adminDashboard: {
                                      ...allFilters?.adminDashboard,
                                      stateTurnoverReport: {
                                        ...allFilters?.adminDashboard
                                          ?.stateTurnoverReport,
                                        dates: {
                                          ...allFilters?.adminDashboard
                                            ?.stateTurnoverReport?.dates,
                                          startDate: oneMonthAgoDate,
                                          endDate: todayDate,
                                        },
                                      },
                                    },
                                  }),
                                );

                                dispatch(getStateTurnoverReportList());
                              }}
                            >
                              Clear
                            </Button>
                          </div>
                        </OverlayPanel>
                      </div>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper with_colspan_head cell_padding_large break_header max_height state_Wise_turnover">
              <DataTable
                value={stateTurnoverReportData}
                sortMode="single"
                sortField="name"
                sortOrder={1}
                rows={10}
                dataKey="id"
                scrollable
                rowGroupMode="rowspan"
              >
                <Column field="state" header="State" sortable></Column>
                <Column field="customer" header="No. of Customers"></Column>
                <Column
                  field="amountstring"
                  header="Total Turnover"
                  sortable
                ></Column>
                <Column
                  field="share"
                  header="% Share"
                  body={shareTemplate}
                  sortable
                ></Column>
              </DataTable>
            </div>
          </div>
        </Col>
        <Col sm={12}>
          <div className="table_main_Wrapper bg-white">
            <div className="top_filter_wrap">
              <div className="page_title">
                <h3 className="m-0">Advisor Report</h3>
              </div>
            </div>
            <div className="table_wrapper">
              <div className="table_scroll_wrapper Customers_table_wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Advisor Name</th>
                      <th></th>
                      {advisorTurnoverReportData?.month?.map((item, i) => {
                        return <th key={i}>{item}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {advisorTurnoverReportData?.data?.map(advisor =>
                      advisor?.items?.map((value, index) => (
                        <tr
                          key={index}
                          className={
                            value?.item_name === 'New Customer Added'
                              ? 'new_customer'
                              : 'total_turnover'
                          }
                        >
                          {value?.item_name === 'New Customer Added' && (
                            <td rowSpan={2}>{value?.name}</td>
                          )}
                          <td>{value?.item_name}</td>
                          {(value?.item_name === 'New Customer Added'
                            ? value?.new_customer
                            : value?.turnover
                          )?.map((item, idx) => (
                            <td key={idx}>{item}</td>
                          ))}
                          <td>{value?.total}</td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default memo(AdminDashboard);
