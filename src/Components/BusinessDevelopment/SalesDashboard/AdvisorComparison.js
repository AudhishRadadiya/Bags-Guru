import React, { memo, useMemo } from 'react';
import Highcharts from 'highcharts';
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { HighchartsReact } from 'highcharts-react-official';
import accessibility from 'highcharts/modules/accessibility';
import { color_code, thousandSeparator } from 'Helper/Common';

accessibility(Highcharts);

const AdvisorComparison = () => {
  const { advisorTeamReportData } = useSelector(
    ({ salesDashBoard }) => salesDashBoard,
  );

  const AdvisorTeamReportOptions = useMemo(() => {
    const headerMenu = advisorTeamReportData?.date || [];
    let advisorTeamReportChartData = [];

    if (advisorTeamReportData?.data?.length > 0) {
      advisorTeamReportChartData =
        advisorTeamReportData?.data?.map((item, i) => {
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

      series: advisorTeamReportChartData,
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
  }, [advisorTeamReportData]);

  return (
    <div className="sales_comparison_wrap p-3 bg_white rounded-3 border advisor_teams_chart">
      <Row className="justify-content-between align-items-center mb-3">
        <Col md={6} sm={5}>
          <div className="chart_head_wrapper">
            <h3 className="m-0 fw-bold">Advisor Comparison (Team Only)</h3>
          </div>
        </Col>
      </Row>

      <div className="sales_comparison_chart_wrap">
        <HighchartsReact
          highcharts={Highcharts}
          options={AdvisorTeamReportOptions}
          containerProps={{ className: 'sales_comparison' }}
        />
      </div>
    </div>
  );
};

export default memo(AdvisorComparison);
