import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Highcharts from 'highcharts';
import { Col, Row } from 'react-bootstrap';
import { HighchartsReact } from 'highcharts-react-official';
import accessibility from 'highcharts/modules/accessibility';

accessibility(Highcharts);

const AdvisorTeamAverageSales = () => {
  const { advisorTeamAverageSalesReportData } = useSelector(
    ({ salesDashBoard }) => salesDashBoard,
  );

  const AdvisorTeamAverageSalesOptions = useMemo(() => {
    const headerMenu = advisorTeamAverageSalesReportData?.date || [];
    const advisorTeamAverageSalesData =
      advisorTeamAverageSalesReportData?.growth_percent ?? [];

    const modifiedAdvisorTeamAverageSalesData = {
      chart: {
        type: 'line',
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: headerMenu,
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: { overflow: 'justify' },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        line: {
          borderRadius: '20%',
          dataLabels: {
            enabled: true,
            formatter: function () {
              return `${this.y}%`;
            },
          },
          groupPadding: 0.1,
          enableMouseTracking: false,
        },
        series: {
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '15px',
              fontWeight: 'bold',
              color: '#000000',
            },
          },
        },
      },
      series: [
        {
          data: advisorTeamAverageSalesData,
        },
      ],
    };

    return modifiedAdvisorTeamAverageSalesData;
  }, [advisorTeamAverageSalesReportData]);

  return (
    <div className="sales_comparison_wrap p-3 bg_white rounded-3 border advisor_team_average_sales">
      <Row className="justify-content-between align-items-center mb-3">
        <Col md={12} sm={12}>
          <div className="chart_head_wrapper">
            <h3 className="m-0 fw-bold">Advisor Team Average Growth Sales</h3>
          </div>
        </Col>
      </Row>

      <div className="sales_comparison_chart_wrap">
        <HighchartsReact
          highcharts={Highcharts}
          options={AdvisorTeamAverageSalesOptions}
          containerProps={{ className: 'sales_comparison' }}
        />
      </div>
    </div>
  );
};

export default memo(AdvisorTeamAverageSales);
