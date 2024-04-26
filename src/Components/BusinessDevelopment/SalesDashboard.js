import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SnoozeIcon from '../../Assets/Images/snooze.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from 'highcharts/modules/variable-pie.js';
import { OverlayPanel } from 'primereact/overlaypanel';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { setAllFilters } from 'Store/Reducers/Common';
import WhatsAppIcon from '../../Assets/Images/whatsapp.svg';
import {
  getAdvisorReport,
  getCustomerSorceDetailReport,
  getCustomerSourceReport,
  getIndustryReport,
  getLaminationReport,
  getNewAndRepeatOrderReport,
  getPartyTypeReport,
  getSalesTargetList,
} from 'Services/Sales/SalesDashboardServices';
import {
  getShowCustomerList,
  saveCustomerFollowupData,
} from 'Store/Reducers/Customer/CustomerService';
import WhatsAppShare from 'Components/Common/Whatsapp';
import { useNavigate } from 'react-router-dom';
import { roundValueThousandSeparator, thousandSeparator } from 'Helper/Common';
import accessibility from 'highcharts/modules/accessibility';

accessibility(Highcharts);
variablePie(Highcharts);

const color_code = [
  '#FBCF4F',
  '#C1AFE8',
  '#ED701E',
  '#0094FF',
  '#A8E9FF',
  '#58f2b0',
  '#dfa8f1',
  '#9492ff',
  '#322972',
  '#29725C',
  '#FF5C5C',
  '#8E5FF5',
  '#F5B85B',
  '#1EB4B2',
  '#DCDCDC',
];

const SalesDashboard = () => {
  const dateRefForSale = useRef(null);
  const laminationDateRef = useRef(null);
  const partyTypeDateRef = useRef(null);
  const industryDateRef = useRef(null);
  const customerDateRef = useRef(null);
  const customerDetailDateRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const todayDate = new Date();
  let oneMonthAgoDate = new Date(todayDate);
  oneMonthAgoDate?.setMonth(todayDate?.getMonth() - 1);

  const [whatsappPopup, setWhatsappPopup] = useState(false);
  const [whatsappData, setWhatsappData] = useState({});

  const {
    salesTableData,
    laminationReportData,
    advisorReportData,
    partyTypeReportData,
    industryReportData,
    newAndRepeatOrderReportData,
    customerSourceReportData,
    customerSourceDetailData,
  } = useSelector(({ salesDashBoard }) => salesDashBoard);

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { customerList } = useSelector(({ customer }) => customer);

  const { customerFollowUp } = allCommon?.salesDashboard;
  const { filterToggle } = customerFollowUp;
  const {
    salesReport,
    laminationReport,
    partyTypeReport,
    customerSourceReport,
    customerSorceDetailReport,
    industryReport,
  } = allFilters?.salesDashboard;

  const { field_filter, searchQuery } = allCommon?.customer;
  const { applied, currentPage, pageLimit } = allFilters?.customer;

  const loadData = useCallback(() => {
    dispatch(getSalesTargetList(salesReport?.dates)); // Sales Report:
    dispatch(
      getShowCustomerList(
        'unsnoozed',
        10,
        currentPage,
        searchQuery,
        applied,
        field_filter,
      ),
    ); // Customer List Report:
    dispatch(getLaminationReport(laminationReport?.dates)); // Lamination Type Sales:
    dispatch(getAdvisorReport()); // Sales Comparision Report:
    dispatch(getPartyTypeReport(partyTypeReport?.dates)); // Party Type Sales Report:
    dispatch(getIndustryReport(industryReport?.dates)); // Industry Wise Sales Report:
    dispatch(getNewAndRepeatOrderReport()); // New & Repeat Order Report:
    dispatch(getCustomerSourceReport(customerSourceReport?.dates)); // Customer Source Report:
    dispatch(getCustomerSorceDetailReport(customerSorceDetailReport?.dates)); // Customer Source Detail Report:
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const handleColorCode = useCallback(data => {
    const colors = [];

    for (let i = 0; i < data?.length; i++) {
      const colorIndex = i % color_code?.length;
      colors.push(color_code[colorIndex]);
    }
    return colors;
  }, []);

  const handleLaminationChartOptions = useMemo(() => {
    const colors = handleColorCode(laminationReportData);
    const amount = laminationReportData?.map((item, i) => ({
      name: '',
      item_name: item?.lamination,
      y: item?.amount,
      item_value: thousandSeparator(item?.amount),
      color: colors[i],
    }));

    const options = {
      chart: {
        type: 'variablepie',
      },
      title: {
        text: '',
        verticalAlign: 'middle',
        floating: true,
      },

      credits: {
        enabled: false,
      },
      series: [
        {
          size: '100%',
          innerSize: '60%',
          innerRadius: '60%',
          borderWidth: 2,
          borderColor: 'white',
          data: amount || [],
          colors: colors,
          dataLabels: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b>{point.item_name}</b>: {point.item_value}',
      },
    };
    return options;
  }, [laminationReportData]);

  const handlePartyTypeChartOptions = useMemo(() => {
    const colors = handleColorCode(partyTypeReportData);
    const amount = partyTypeReportData?.map((item, i) => ({
      name: item?.party_type, // Use party_type as the name
      y: item?.amount,
      item_value: thousandSeparator(item?.amount),
      color: colors[i],
    }));

    const options = {
      chart: {
        type: 'variablepie',
      },
      title: {
        text: '',
        verticalAlign: 'middle',
        floating: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          size: '100%',
          innerSize: '60%',
          innerRadius: '60%',
          borderWidth: 2,
          borderColor: 'white',
          data: amount || [],
          colors: colors,
          dataLabels: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b>{point.name}</b>: {point.item_value}', // Use point.name instead of point.item_name
      },
    };
    return options;
  }, [partyTypeReportData]);

  const handleIndustryChartOptions = useMemo(() => {
    const colors = handleColorCode(industryReportData);
    const amount = industryReportData?.map((item, i) => ({
      name: '',
      item_name: item?.industry_name,
      y: item?.amount,
      item_value: thousandSeparator(item?.amount),
      color: colors[i],
    }));

    const options = {
      chart: {
        type: 'variablepie',
      },
      title: {
        text: '',
        verticalAlign: 'middle',
        floating: true,
      },

      credits: {
        enabled: false,
      },
      series: [
        {
          size: '100%',
          innerSize: '60%',
          innerRadius: '60%',
          borderWidth: 2,
          borderColor: 'white',
          data: amount || [],
          colors: colors,
          dataLabels: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b>{point.item_name}</b>: {point.item_value}',
        // formatter: function () {
        //   // return `${this.point.name} value: ${this.point.y}`;
        // },
      },
    };
    return options;
  }, [industryReportData]);

  const handleCustomerSourceChartOptions = useMemo(() => {
    const colors = handleColorCode(customerSourceReportData);

    const amount = customerSourceReportData?.map((item, i) => ({
      name: '',
      item_name: item?.customer_source,
      y: item?.amount,
      item_value: thousandSeparator(item?.amount),
      color: colors[i],
    }));

    const options = {
      chart: {
        type: 'variablepie',
      },
      title: {
        text: '',
        verticalAlign: 'middle',
        floating: true,
      },

      credits: {
        enabled: false,
      },
      series: [
        {
          size: '100%',
          innerSize: '60%',
          innerRadius: '60%',
          borderWidth: 2,
          borderColor: 'white',
          data: amount || [],
          colors: colors,
          dataLabels: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b>{point.item_name}</b>: {point.item_value}',
      },
    };

    return options;
  }, [customerSourceReportData]);

  const handleCustomerSourceDetailChartOptions = useMemo(() => {
    const colors = handleColorCode(customerSourceDetailData);
    const amount = customerSourceDetailData?.map((item, i) => ({
      name: '',
      item_name: item?.customer_source_detail,
      y: item?.amount,
      item_value: thousandSeparator(item?.amount),
      color: colors[i],
    }));

    const options = {
      chart: {
        type: 'variablepie',
      },
      title: {
        text: '',
        verticalAlign: 'middle',
        floating: true,
      },

      credits: {
        enabled: false,
      },
      series: [
        {
          size: '100%',
          innerSize: '60%',
          innerRadius: '60%',
          borderWidth: 2,
          borderColor: 'white',
          data: amount || [],
          colors: colors,
          dataLabels: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b>{point.item_name}</b>: {point.item_value}',
        // formatter: function () {
        //   // return `${this.point.name} value: ${this.point.y}`;
        // },
      },
    };
    return options;
  }, [customerSourceDetailData]);

  const SalesComparisonoptions = useMemo(() => {
    const headerMenu = advisorReportData?.date || [];
    let salesComparisonChartData = [];
    // const generate_color = handleColorCode(advisorReportData?.data);
    // const salesComparisonChartData = handleColorCode(advisorReportData?.data);

    if (advisorReportData?.data?.length > 0) {
      salesComparisonChartData =
        advisorReportData?.data?.map((item, i) => {
          const colorIndex = i % color_code?.length;
          return {
            data: item?.sales,
            name: item?.advisor_name,
            color: color_code[colorIndex],
          };
        }) || [];
    }

    const modifiedSalesComparisonData = {
      chart: {
        type: 'line',
      },
      title: {
        text: '',
      },
      yAxis: {
        title: {
          text: 'Sales revenue',
        },
        opposite: true,
      },

      xAxis: {
        categories: headerMenu,
      },

      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      series: salesComparisonChartData || [], // Ensure series is always an array
      tooltip: {
        formatter: function () {
          return (
            '<div>' +
            '<span class="tooltip-x">' +
            this.x +
            '</span>' +
            '</div>' +
            '<div> <br>' +
            '<span style="color:' +
            this.point.color +
            '">\u25CF</span> <b>' +
            this.series.name +
            '</b>: ' +
            thousandSeparator(this.y) +
            '</div>'
          );
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    };
    return modifiedSalesComparisonData;
  }, [advisorReportData]);

  const NewAndRepeatSales = useMemo(() => {
    const headerMenu = newAndRepeatOrderReportData?.date || [];
    const newCustomerData = newAndRepeatOrderReportData?.new_customer || [];
    const repeatCustomerData =
      newAndRepeatOrderReportData?.repeat_customer || [];

    return {
      chart: {
        type: 'column',
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: headerMenu,
        crosshair: true,
        labels: {
          style: {
            color: '#7B7B7B',
          },
        },
        lineColor: '#D7D7D7',
        lineWidth: 1,
      },
      yAxis: {
        title: {
          text: 'Sales',
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: newCustomerData,
          color: '#0094FF',
          pointWidth: 14,
          name: 'New Customer',
        },
        {
          data: repeatCustomerData,
          color: '#00e272',
          pointWidth: 14,
          name: 'Repeat Customer',
        },
      ],
      // Old Tool-Tip Flow:
      // tooltip: {
      //   pointFormat:
      //     '<span style="color:{point.color}">\u25CF</span> <b>{point.series.name}</b>: {point.y}',
      // },

      // New Tool-Tip Flow:
      tooltip: {
        formatter: function () {
          return (
            '<div>' +
            '<span class="tooltip-x">' +
            this.x +
            '</span>' +
            '</div>' +
            '<div> <br>' +
            '<span style="color:' +
            this.point.color +
            '">\u25CF</span> <b>' +
            this.point.series.name +
            '</b>: ' +
            thousandSeparator(this.y) +
            '</div>'
          );
        },
      },

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
          },
        ],
      },
    };
  }, [newAndRepeatOrderReportData]);

  const handleDateManage = (reportName, e) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        salesDashboard: {
          ...allFilters?.salesDashboard,
          [reportName]: {
            ...allFilters?.salesDashboard[reportName],
            dates: e,
          },
        },
      }),
    );
  };

  const handleSnooze = useCallback(
    async (party, snooze) => {
      const payload = {
        customer_group_id: party?.customer_group_id,
        snooze_for: snooze,
        comment: party?.comment,
      };
      const res = await dispatch(saveCustomerFollowupData(payload));
      if (res) {
        dispatch(
          getShowCustomerList(
            'unsnoozed',
            pageLimit,
            currentPage,
            searchQuery,
            applied,
            field_filter,
          ),
        );
      }
    },
    [dispatch],
  );

  const customerAction = useCallback(party => {
    return (
      <div className="edit_row">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle id="dropdown-basic" className="ection_btn">
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={e => {
                setWhatsappPopup(true);
                setWhatsappData(party);
              }}
            >
              <img src={WhatsAppIcon} alt="" /> WhatsApp
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSnooze(party, 1)}>
              <img src={SnoozeIcon} alt="" /> Snooze for 15 day
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSnooze(party, 2)}>
              <img src={SnoozeIcon} alt="" /> Snooze for 30 day
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSnooze(party, 3)}>
              <img src={SnoozeIcon} alt="" /> Snooze for 90 day
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }, []);

  return (
    <div className="main_Wrapper sales_dashboard_main_wrap">
      <Row className="g-3">
        <Col xxl={4} lg={6} className="order-1 order-xxl-0">
          <div className="table_main_Wrapper bg-white h-100">
            <div className="top_filter_wrap">
              <Row>
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Sales</h3>
                  </div>
                </Col>
                <Col sm={9}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li>
                        <div className="form_group date_range_wrapper">
                          <div
                            className="date_range_select"
                            onClick={e => {
                              dateRefForSale.current.toggle(e);
                            }}
                          >
                            <span>
                              {salesReport?.dates?.startDate
                                ? moment(salesReport?.dates.startDate).format(
                                    'DD-MM-yyyy',
                                  )
                                : ''}{' '}
                              {salesReport?.dates?.startDate &&
                                salesReport?.dates?.endDate &&
                                '-'}{' '}
                              {salesReport?.dates?.endDate
                                ? moment(salesReport?.dates.endDate).format(
                                    'DD-MM-yyyy',
                                  )
                                : 'Select Date Range'}
                            </span>
                          </div>
                          <OverlayPanel ref={dateRefForSale}>
                            <div className="date_range_wrap">
                              <DateRangeCalender
                                ranges={[salesReport?.dates]}
                                name="salesReport"
                                onChange={e => {
                                  handleDateManage('salesReport', e);
                                  dispatch(getSalesTargetList(e));
                                }}
                              />
                              <Button
                                className="btn_transperant"
                                onClick={e => {
                                  dateRefForSale.current.toggle(e);
                                  handleDateManage('salesReport', {
                                    startDate: oneMonthAgoDate,
                                    endDate: todayDate,
                                    key: 'selection',
                                  });
                                  dispatch(
                                    getSalesTargetList({
                                      startDate: oneMonthAgoDate,
                                      endDate: todayDate,
                                      key: 'selection',
                                    }),
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
                  </div>
                </Col>
              </Row>
            </div>
            <div className="table_wrapper">
              <div className="table_scroll_wrapper Customers_table_wrapper">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>No. of Customers</th>
                      <th>Sales Achieved</th>
                      <th>Target</th>
                      <th>% Achieved</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>New Customer</th>
                      <td>{salesTableData?.new_customer}</td>
                      <td>{salesTableData?.new_sales_achieved}</td>
                      <td>{salesTableData?.new_sales_target}</td>
                      <td>{salesTableData?.new_sales_percentage}</td>
                    </tr>
                    <tr>
                      <th>Repeat Customer</th>
                      <td>{salesTableData?.repeat_customer}</td>
                      <td>{salesTableData?.repeat_sales_achieved}</td>
                      <td>{salesTableData?.repeat_sales_target}</td>
                      <td>{salesTableData?.repeat_sales_percentage}</td>
                    </tr>
                    <tr>
                      <th>Total Customer</th>
                      <td>{salesTableData?.total_customer}</td>
                      <td>{salesTableData?.total_sales_achieved}</td>
                      <td>{salesTableData?.total_sales_target}</td>
                      <td>{salesTableData?.total_sales_percentage}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={5} lg={6} className="order-2 order-xxl-0">
          <div className="table_main_Wrapper bg-white">
            <div className="top_filter_wrap">
              <div className="page_title">
                <h3 className="m-0">Customer Follow ups</h3>
              </div>
            </div>
            <div className="data_table_wrapper with_colspan_head cell_padding_large break_header customer_follow_table_wrapper">
              <DataTable
                value={customerList}
                sortMode="single"
                sortField="name"
                sortOrder={1}
                dataKey="id"
              >
                <Column
                  field="party_name"
                  header="Party Name"
                  sortable
                  filter={filterToggle}
                  // body={nameTemplate}
                ></Column>
                <Column
                  field="customer_group"
                  header="Customer Group"
                  sortable
                  filter={filterToggle}
                  // body={nameTemplate}
                ></Column>
                <Column
                  field="order_date"
                  header="Last Ordered"
                  sortable
                  filter={filterToggle}
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  filter={filterToggle}
                  body={customerAction}
                ></Column>
              </DataTable>
            </div>
            <div className="show_more_button_wrapper">
              <Button
                className="btn_transperant"
                onClick={() => navigate('/old-customer')}
              >
                Show More
              </Button>
            </div>
          </div>
        </Col>
        <Col xxl={3} xl={4} md={6} className="order-5 order-xxl-0">
          <div className="chart_box_wrapper border rounded-3 bg_white h-100">
            <div className="chart_head_wrapper">
              <h3 className="m-0">Lamination Type Sales</h3>
              <ul>
                <li>
                  <div className="form_group date_range_wrapper">
                    <div
                      className="date_range_select"
                      onClick={e => {
                        laminationDateRef.current.toggle(e);
                      }}
                    >
                      <span>
                        {laminationReport?.dates?.startDate
                          ? moment(laminationReport?.dates.startDate).format(
                              'DD-MM-yyyy',
                            )
                          : ''}{' '}
                        {laminationReport?.dates?.startDate &&
                          laminationReport?.dates?.endDate &&
                          '-'}{' '}
                        {laminationReport?.dates?.endDate
                          ? moment(laminationReport?.dates.endDate).format(
                              'DD-MM-yyyy',
                            )
                          : 'Select Date Range'}
                      </span>
                    </div>
                    <OverlayPanel ref={laminationDateRef}>
                      <div className="date_range_wrap">
                        <DateRangeCalender
                          ranges={[laminationReport?.dates]}
                          onChange={e => {
                            handleDateManage('laminationReport', e);
                            dispatch(getLaminationReport(e));
                          }}
                        />
                        <Button
                          className="btn_transperant"
                          onClick={e => {
                            laminationDateRef.current.toggle(e);
                            handleDateManage('laminationReport', {
                              startDate: oneMonthAgoDate,
                              endDate: todayDate,
                              key: 'selection',
                            });

                            dispatch(
                              getLaminationReport({
                                startDate: oneMonthAgoDate,
                                endDate: todayDate,
                                key: 'selection',
                              }),
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
            </div>
            <div className="high_chart_wrapper p-3">
              <div className="pie_chart_Wrapper d-flex">
                <div className="chart_wrap">
                  <div className="pie_chart_wrap">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={handleLaminationChartOptions}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <b className="me-2">Total:</b>
                    {`₹${roundValueThousandSeparator(
                      laminationReportData?.reduce(
                        (acc, cur) => acc + cur.amount,
                        0,
                      ),
                    )}`}
                  </div>
                </div>
                <div className="legend_wrapper">
                  <ul>
                    {laminationReportData?.map((data, i) => {
                      const colorIndex = i % (color_code?.length + 1);
                      if (data?.amount > 0) {
                        return (
                          <li key={i}>
                            <span
                              style={{
                                backgroundColor: color_code[colorIndex],
                              }}
                              className="dot"
                            ></span>
                            <label>{`${data?.lamination}  ${data?.amountstring}`}</label>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} className="order-3 order-xxl-0">
          <div className="chart_box_wrapper border rounded-3 bg_white h-100">
            <div className="sales_comparison_top p-3">
              <ul>
                <li>
                  <h3 className="m-0">Sales Comparison</h3>
                </li>
                <li>
                  {/* <h5 className="text-center mb-2">Top Broker</h5> */}
                  <div className="chart_title_list">
                    <ul>
                      {advisorReportData?.data?.map((item, i) => {
                        const colorIndex = i % (color_code?.length + 1);
                        return (
                          <li key={i}>
                            <span
                              style={{ background: color_code[colorIndex] }}
                              className="dot"
                            ></span>
                            <label>{item?.advisor_name}</label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div className="high_chart_wrapper p-3">
              <div className="sales_comparison_chart_wrap">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={SalesComparisonoptions}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={3} xl={4} md={6} className="order-last order-xxl-0">
          <div className="chart_box_wrapper border rounded-3 bg_white h-100">
            <div className="chart_head_wrapper">
              <h3 className="m-0">Party Type Sales</h3>
              <ul>
                <li>
                  <div className="form_group date_range_wrapper">
                    <div
                      className="date_range_select"
                      onClick={e => {
                        partyTypeDateRef.current.toggle(e);
                      }}
                    >
                      <span>
                        {partyTypeReport?.dates?.startDate
                          ? moment(partyTypeReport?.dates.startDate).format(
                              'DD-MM-yyyy',
                            )
                          : ''}{' '}
                        {partyTypeReport?.dates?.startDate &&
                          partyTypeReport?.dates?.endDate &&
                          '-'}{' '}
                        {partyTypeReport?.dates?.endDate
                          ? moment(partyTypeReport?.dates.endDate).format(
                              'DD-MM-yyyy',
                            )
                          : 'Select Date Range'}
                      </span>
                    </div>
                    <OverlayPanel ref={partyTypeDateRef}>
                      <div className="date_range_wrap">
                        <DateRangeCalender
                          ranges={[partyTypeReport?.dates]}
                          onChange={e => {
                            handleDateManage('partyTypeReport', e);
                            dispatch(getPartyTypeReport(e));
                          }}
                        />
                        <Button
                          className="btn_transperant"
                          onClick={e => {
                            partyTypeDateRef.current.toggle(e);
                            handleDateManage('partyTypeReport', {
                              startDate: oneMonthAgoDate,
                              endDate: todayDate,
                              key: 'selection',
                            });

                            dispatch(
                              getPartyTypeReport({
                                startDate: oneMonthAgoDate,
                                endDate: todayDate,
                                key: 'selection',
                              }),
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
            </div>
            <div className="high_chart_wrapper p-3">
              <div className="pie_chart_Wrapper d-flex">
                <div className="chart_wrap">
                  <div className="pie_chart_wrap">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={handlePartyTypeChartOptions}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <b className="me-2">Total:</b>
                    {`₹${roundValueThousandSeparator(
                      partyTypeReportData?.reduce(
                        (acc, cur) => acc + cur.amount,
                        0,
                      ),
                    )}`}
                  </div>
                </div>
                <div className="legend_wrapper">
                  <ul>
                    {partyTypeReportData?.map((data, i) => {
                      const colorIndex = i % (color_code?.length + 1);
                      if (data?.amount > 0) {
                        return (
                          // <li className="yellow">
                          //   {data?.party_type}
                          //   <span>{data?.amountstring}</span>
                          // </li>
                          <li key={i}>
                            <span
                              style={{
                                backgroundColor: color_code[colorIndex],
                              }}
                              className="dot"
                            ></span>
                            <label>{`${data?.party_type}  ${data?.amountstring}`}</label>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={3} xl={4} md={6} className="order-last order-xxl-0">
          <div className="chart_box_wrapper border rounded-3 bg_white h-100">
            <div className="chart_head_wrapper">
              <h3 className="m-0">Industry Wise Sales</h3>
              <ul>
                <li>
                  <div className="form_group date_range_wrapper">
                    <div
                      className="date_range_select"
                      onClick={e => {
                        industryDateRef.current.toggle(e);
                      }}
                    >
                      <span>
                        {industryReport?.dates?.startDate
                          ? moment(industryReport?.dates?.startDate).format(
                              'DD-MM-yyyy',
                            )
                          : ''}{' '}
                        {industryReport?.dates?.startDate &&
                          industryReport?.dates?.endDate &&
                          '-'}{' '}
                        {industryReport?.dates?.endDate
                          ? moment(industryReport?.dates?.endDate).format(
                              'DD-MM-yyyy',
                            )
                          : 'Select Date Range'}
                      </span>
                    </div>
                    <OverlayPanel ref={industryDateRef}>
                      <div className="date_range_wrap">
                        <DateRangeCalender
                          ranges={[industryReport?.dates]}
                          onChange={e => {
                            handleDateManage('industryReport', e);
                            dispatch(getIndustryReport(e));
                          }}
                        />
                        <Button
                          className="btn_transperant"
                          onClick={e => {
                            industryDateRef.current.toggle(e);
                            handleDateManage('industryReport', {
                              startDate: oneMonthAgoDate,
                              endDate: todayDate,
                              key: 'selection',
                            });
                            dispatch(
                              getIndustryReport({
                                startDate: oneMonthAgoDate,
                                endDate: todayDate,
                                key: 'selection',
                              }),
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
            </div>
            <div className="high_chart_wrapper p-3">
              <div className="d-flex pie_chart_Wrapper">
                <div className="chart_wrap">
                  <div className="pie_chart_wrap">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={handleIndustryChartOptions}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <b className="me-2">Total:</b>
                    {`₹${roundValueThousandSeparator(
                      industryReportData?.reduce(
                        (acc, cur) => acc + cur.amount,
                        0,
                      ),
                    )}`}
                  </div>
                </div>
                <div className="legend_wrapper">
                  <ul>
                    {industryReportData?.map((data, i) => {
                      const colorIndex = i % (color_code?.length + 1);
                      if (data?.amount > 0) {
                        return (
                          <li key={i}>
                            <span
                              style={{
                                backgroundColor: color_code[colorIndex],
                              }}
                              className="dot"
                            ></span>
                            <label>{`${data?.industry_name}  ${data?.amountstring}`}</label>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} className="order-4 order-xxl-0 sales_Comparison_col">
          <div className="chart_box_wrapper border rounded-3 bg_white h-100">
            <div className="chart_head_wrapper">
              <h3 className="m-0">New & Repeat Sales</h3>
            </div>
            <div className="sales_comparison_chart_wrap p-3">
              <HighchartsReact
                highcharts={Highcharts}
                options={NewAndRepeatSales}
              />
            </div>
          </div>
        </Col>
        <Col xxl={3} xl={6} md={6} className="order-last order-xxl-0">
          <div className="chart_box_wrapper border rounded-3 bg_white h-100">
            <div className="chart_head_wrapper">
              <h3 className="m-0">Customer Source Wise Sales</h3>
              <ul>
                <li>
                  <div className="form_group date_range_wrapper">
                    <div
                      className="date_range_select"
                      onClick={e => {
                        customerDateRef.current.toggle(e);
                      }}
                    >
                      <span>
                        {customerSourceReport?.dates?.startDate
                          ? moment(
                              customerSourceReport?.dates?.startDate,
                            ).format('DD-MM-yyyy')
                          : ''}{' '}
                        {customerSourceReport?.dates?.startDate &&
                          customerSourceReport?.dates?.endDate &&
                          '-'}{' '}
                        {customerSourceReport?.dates?.endDate
                          ? moment(customerSourceReport?.dates?.endDate).format(
                              'DD-MM-yyyy',
                            )
                          : 'Select Date Range'}
                      </span>
                    </div>
                    <OverlayPanel ref={customerDateRef}>
                      <div className="date_range_wrap">
                        <DateRangeCalender
                          ranges={[customerSourceReport?.dates]}
                          onChange={e => {
                            handleDateManage('customerSourceReport', e);
                            dispatch(getCustomerSourceReport(e));
                          }}
                        />
                        <Button
                          className="btn_transperant"
                          onClick={e => {
                            customerDateRef.current.toggle(e);
                            handleDateManage('customerSourceReport', {
                              startDate: oneMonthAgoDate,
                              endDate: todayDate,
                              key: 'selection',
                            });
                            dispatch(
                              getCustomerSourceReport({
                                startDate: oneMonthAgoDate,
                                endDate: todayDate,
                                key: 'selection',
                              }),
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
            </div>
            <div className="high_chart_wrapper p-3">
              <div className="pie_chart_Wrapper d-flex">
                <div className="chart_wrap">
                  <div className="pie_chart_wrap">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={handleCustomerSourceChartOptions}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <b className="me-2">Total:</b>
                    {`₹${roundValueThousandSeparator(
                      customerSourceReportData?.reduce(
                        (acc, cur) => acc + cur.amount,
                        0,
                      ),
                    )}`}
                  </div>
                </div>
                <div className="legend_wrapper">
                  <ul>
                    {customerSourceReportData?.map((data, i) => {
                      const colorIndex = i % (color_code?.length + 1);
                      if (data?.amount > 0) {
                        return (
                          <li key={i}>
                            <span
                              style={{
                                backgroundColor: color_code[colorIndex],
                              }}
                              className="dot"
                            ></span>
                            <label>{`${data?.customer_source}  ${data?.amountstring}`}</label>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={3} xl={6} md={6} className="order-last order-xxl-0">
          <div className="chart_box_wrapper border rounded-3 bg_white h-100">
            <div className="chart_head_wrapper">
              <h3 className="m-0">Customer Source Details Wise Sales</h3>
              <ul>
                <li>
                  <div className="form_group date_range_wrapper">
                    <div
                      className="date_range_select"
                      onClick={e => {
                        customerDetailDateRef.current.toggle(e);
                      }}
                    >
                      <span>
                        {customerSorceDetailReport?.dates?.startDate
                          ? moment(
                              customerSorceDetailReport?.dates?.startDate,
                            ).format('DD-MM-yyyy')
                          : ''}{' '}
                        {customerSorceDetailReport?.dates?.startDate &&
                          customerSorceDetailReport?.dates?.endDate &&
                          '-'}{' '}
                        {customerSorceDetailReport?.dates?.endDate
                          ? moment(
                              customerSorceDetailReport?.dates?.endDate,
                            ).format('DD-MM-yyyy')
                          : 'Select Date Range'}
                      </span>
                    </div>
                    <OverlayPanel ref={customerDetailDateRef}>
                      <div className="date_range_wrap">
                        <DateRangeCalender
                          ranges={[customerSorceDetailReport?.dates]}
                          onChange={e => {
                            handleDateManage('customerSorceDetailReport', e);
                            dispatch(getCustomerSorceDetailReport(e));
                          }}
                        />
                        <Button
                          className="btn_transperant"
                          onClick={e => {
                            customerDetailDateRef.current.toggle(e);
                            handleDateManage('customerSorceDetailReport', {
                              startDate: oneMonthAgoDate,
                              endDate: todayDate,
                              key: 'selection',
                            });
                            dispatch(
                              getCustomerSorceDetailReport({
                                startDate: oneMonthAgoDate,
                                endDate: todayDate,
                                key: 'selection',
                              }),
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
            </div>
            <div className="high_chart_wrapper p-3">
              <div className="pie_chart_Wrapper d-flex">
                <div className="chart_wrap">
                  <div className="pie_chart_wrap">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={handleCustomerSourceDetailChartOptions}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <b className="me-2">Total: </b>
                    {`₹${roundValueThousandSeparator(
                      customerSourceDetailData?.reduce(
                        (acc, cur) => acc + cur.amount,
                        0,
                      ),
                    )}`}
                  </div>
                </div>
                <div className="legend_wrapper">
                  <ul>
                    {customerSourceDetailData?.map((data, i) => {
                      const colorIndex = i % (color_code?.length + 1);
                      if (data?.amount > 0) {
                        return (
                          // <li className="yellow">
                          //   {data?.customer_source_detail}
                          //   <span>{data?.amountstring}</span>
                          // </li>
                          <li key={i}>
                            <span
                              style={{
                                backgroundColor: color_code[colorIndex],
                              }}
                              className="dot"
                            ></span>
                            <label>
                              {`${data?.customer_source_detail}:`}{' '}
                              <span className="fw-bold">{`${data?.amountstring}`}</span>
                            </label>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {/* <Dialog
        header=""
        visible={deletePopup}
        draggable={false}
        className="modal_Wrapper modal_small whatsapp_modal"
        onHide={() => setDeletePopup(false)}
      >
        <div className="whatsapp_popup_wrapper">
          <div className="img_wrapper">
            <img src={ProductImgBig} alt="" />
          </div>
          <div className="whatsapp_pro_title">
            <h4>BABLU - MELA RAM BABU RAM</h4>
            <p className="m-0">17.5" * 14 * 5" (70GSM)</p>
          </div>
          <div className="whatsapp_pro_detail">
            <h4>10,000 Bags</h4>
            <ul>
              <li>Fabric: Red</li>
              <li>Handle: Na</li>
              <li>Rate: 5.90/Bag</li>
              <li>Block: 1800</li>
              <li>ETD: 20/06/2023</li>
            </ul>
            <div className="text-center mb-2">
              <Button className="btn_border">
                <img src={ClipboardIcon} className="me-2" alt="" />
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </div>
      </Dialog> */}
      <WhatsAppShare
        whatsappPopup={whatsappPopup}
        setWhatsappPopup={setWhatsappPopup}
        data={whatsappData}
        isBagDetail={false}
      />
    </div>
  );
};

export default memo(SalesDashboard);
