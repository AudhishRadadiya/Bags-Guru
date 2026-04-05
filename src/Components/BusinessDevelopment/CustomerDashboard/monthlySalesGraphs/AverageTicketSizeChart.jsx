import { memo, useMemo } from 'react';
import Highcharts from 'highcharts';
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { thousandSeparator } from 'Helper/Common';
import accessibility from 'highcharts/modules/accessibility';
import { HighchartsReact } from 'highcharts-react-official';

accessibility(Highcharts);

const AverageTicketSizeChart = () => {
  const { monthlySalesTrendsData } = useSelector(
    ({ customerDashboard }) => customerDashboard,
  );

  const AverageTicketSizeOptions = useMemo(() => {
    const headerMenu = monthlySalesTrendsData?.date ?? [];
    const averageTicketSizeChartData =
      monthlySalesTrendsData?.average_ticket_size ?? [];

    const modifiedAverageTicketSize = {
      chart: {
        type: 'spline',
        spacingBottom: 8,
      },

      title: {
        text: '',
      },

      xAxis: { categories: headerMenu },

      yAxis: {
        title: {
          text: null,
        },
        opposite: false,
      },

      credits: { enabled: false },

      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        width: 840,
        itemWidth: 210,
        itemMarginTop: 6,
        itemMarginBottom: 2,
        floating: true,
        padding: 0,
        enabled: false,
      },

      series: [
        {
          name: 'Average Ticket Size',
          data: averageTicketSizeChartData,
        },
      ],

      tooltip: {
        useHTML: true,
        formatter: function () {
          return `
          <div style="margin-bottom:4px;">
            <span class="tooltip-x">${this.x}</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="color:${this.point.color}; font-size:14px;">●</span>
            <b>${this.series.name}</b>: <b>${thousandSeparator(
            Math.round(this.y),
          )}</b>
          </div>
        `;
        },
      },

      responsive: {
        rules: [
          {
            condition: { maxWidth: 500 },
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

    return modifiedAverageTicketSize;
  }, [monthlySalesTrendsData]);

  return (
    <div className="custom_dashboard_wrap p-3 bg_white rounded-3 border">
      <Row className="justify-content-between align-items-center mb-3">
        <Col>
          <div className="chart_head_wrapper">
            <h3 className="m-0 fw-bold">Average Ticket Size</h3>
          </div>
        </Col>
      </Row>

      <div className="average_ticket_size_wrap admin_dashboard_chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={AverageTicketSizeOptions}
          containerProps={{ className: 'average_ticket_size' }}
        />
      </div>
    </div>
  );
};

export default memo(AverageTicketSizeChart);
