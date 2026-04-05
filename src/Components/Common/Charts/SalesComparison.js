import { memo, useCallback, useMemo } from 'react';
import Highcharts from 'highcharts';
import { useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import accessibility from 'highcharts/modules/accessibility';
import { thousandSeparator } from 'Helper/Common';
import { Col, Row } from 'react-bootstrap';
import ReactSelectSingle from '../ReactSelectSingle';
import { setAllCommon } from 'Store/Reducers/Common';
import { useDispatch } from 'react-redux';
import { getAdvisorReportList } from 'Services/Business/AdminDashboardServices';
import { setAdvisorReportData } from 'Store/Reducers/Business/AdminDashboardSlice';

accessibility(Highcharts);

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

const PartyTypeOptions = [
  { label: 'Both', value: 'Both' },
  { label: 'END USER', value: 1 },
  { label: 'TRADER', value: 2 },
];

const SalesComparison = ({ from }) => {
  const dispatch = useDispatch();

  const { advisorReportData } = useSelector(
    ({ adminDashBoard }) => adminDashBoard,
  );
  const { allCommon } = useSelector(({ common }) => common);
  const { partyType } = allCommon?.adminDashboard;

  const handleLoadData = useCallback(
    selectedPartyType => {
      const partyType = selectedPartyType !== 'Both' ? selectedPartyType : '';

      dispatch(setAdvisorReportData({}));
      dispatch(getAdvisorReportList(partyType));
    },
    [dispatch],
  );

  const SalesComparisonoptions = useMemo(() => {
    const headerMenu = advisorReportData?.date || [];
    let salesComparisonChartData = [];

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
        type: 'spline',
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

      xAxis: { categories: headerMenu },

      credits: {
        enabled: false,
      },

      // legend: {
      //   enabled: false,
      // },

      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        width: 840,
        itemWidth: 210,
        itemMarginTop: 6,
        itemMarginBottom: 2,
        floating: false,
        padding: 8,
      },

      series: salesComparisonChartData,
      // Old Tool-Tip Formatting:
      // tooltip: {
      //   pointFormat:
      //     '<span style="color:{point.color}">\u25CF</span> <b>{point.series.name}</b>: {point.y:,.0f}',
      // },

      // New Tool-Tip Formatting:
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
            '</b>:' +
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

  return (
    <div className="sales_comparison_wrap p-3 bg_white rounded-3 border">
      <Row className="justify-content-between align-items-center mb-3">
        <Col md={6} sm={5}>
          <div className="chart_head_wrapper">
            <h3 className="m-0 fw-bold">Sales Comparison</h3>
          </div>
        </Col>
        {from === 'adminDashboard' && (
          <Col xxl={3} xl={3} md={4} sm={5}>
            <div className="chart_input_wrap">
              <ReactSelectSingle
                BrokerSelect
                value={partyType}
                placeholder="Party Type"
                options={PartyTypeOptions}
                onChange={e => {
                  dispatch(
                    setAllCommon({
                      ...allCommon,
                      adminDashboard: {
                        ...allCommon?.adminDashboard,
                        partyType: e.target.value,
                      },
                    }),
                  );
                  handleLoadData(e.target.value);
                }}
              />
            </div>
          </Col>
        )}
      </Row>
      {/* <div className="sales_comparison_top mb-3">
        <ul>
          <li>
            <h3 className="text-nowrap">Sales Comparison</h3>
          </li>
          <li>
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
      </div> */}
      <div className="sales_comparison_chart_wrap admin_dashboard_chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={SalesComparisonoptions}
          containerProps={{ className: 'sales_comparison' }}
        />
      </div>
    </div>
  );
};

export default memo(SalesComparison);
