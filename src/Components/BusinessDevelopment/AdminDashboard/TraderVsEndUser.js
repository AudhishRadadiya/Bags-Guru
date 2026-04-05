import React, { memo, useMemo } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { thousandSeparator } from 'Helper/Common';
import { useSelector } from 'react-redux';

const TraderVsEndUser = () => {
  const { traderAndEndUserReportData } = useSelector(
    ({ adminDashBoard }) => adminDashBoard,
  );

  const TraderData = useMemo(() => {
    let data = [];
    if (traderAndEndUserReportData?.trader) {
      data = traderAndEndUserReportData?.trader?.map(item => {
        return item.amount;
      });
    }

    return data;
  }, [traderAndEndUserReportData?.trader]);

  const EndUserData = useMemo(() => {
    let data = [];
    if (traderAndEndUserReportData?.end_user?.length > 0) {
      data = traderAndEndUserReportData?.end_user?.map(item => {
        return item.amount;
      });
    }

    return data;
  }, [traderAndEndUserReportData?.end_user]);

  const TraderAndEndUser = useMemo(() => {
    const { date, trader, end_user } = traderAndEndUserReportData;

    const headerMenu = date || [];

    const TraderRatioData = trader?.map(item => item.ratio) || [];
    const EndUserRatioData = end_user?.map(item => item.ratio) || [];

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
      yAxis: [
        {
          title: {
            text: 'Sales Revenue',
          },
          opposite: false, // Left side for revenue
        },
        {
          title: {
            text: 'Ratio (%)',
          },
          opposite: true, // Right side for ratio
          min: 0, // Ensure ratio starts at 0
          max: 100, // Ensure ratio goes up to 100%
        },
      ],
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
        },
        line: {
          dataLabels: {
            enabled: true, // Show ratio values on line chart
          },
          enableMouseTracking: true,
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
      },
      series: [
        {
          type: 'column',
          data: TraderData,
          color: '#86c6a8',
          pointWidth: 14,
          name: 'Trader Sales',
          yAxis: 0, // Use first yAxis (Sales Revenue)
        },
        {
          type: 'column',
          data: EndUserData,
          color: '#456e63',
          pointWidth: 14,
          name: 'End User Sales',
          yAxis: 0, // Use first yAxis (Sales Revenue)
        },
        {
          type: 'line',
          data: TraderRatioData,
          color: '#26A5FB',
          name: 'Trader Ratio (%)',
          yAxis: 1, // Use second yAxis (Ratio %)
          marker: {
            enabled: true,
          },
        },
        {
          type: 'line',
          data: EndUserRatioData,
          color: '#F97683',
          name: 'End User Ratio (%)',
          yAxis: 1, // Use second yAxis (Ratio %)
          marker: {
            enabled: true,
          },
        },
      ],

      tooltip: {
        formatter: function () {
          const pointIndex = this.point.index;
          let traderRatio = trader[pointIndex]?.ratio ?? 0;
          let endUserRatio = end_user[pointIndex]?.ratio ?? 0;

          return `<div>
              <span class="tooltip-x">${this.x}</span>
            </div>
            <div> <br> <br>
              <span style="color:${this.point.color}">\u25CF</span> <b>
                ${this.series.name}
              </b>: ${thousandSeparator(this.y)}
            </div>
            ${
              this.series.name === 'Trader Sales'
                ? `<div> <br>
                      <span style="color:#26A5FB">\u25CF</span> <b>
                        Trader Ratio
                      </b>: ${traderRatio}%
                    </div>`
                : this.series.name === 'End User Sales'
                ? `<div> <br>
                      <span style="color:#F97683">\u25CF</span> <b>
                        End User Ratio
                      </b>: ${endUserRatio}%
                    </div>`
                : ''
            }`;
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
  }, [traderAndEndUserReportData, EndUserData, TraderData]);

  return (
    <div className="chart_box_wrapper border rounded-3 bg_white h-100">
      <div className="chart_head_wrapper">
        <h3 className="m-0">Trader Vs End-User</h3>
      </div>
      <div className="sales_comparison_chart_wrap p-3">
        <HighchartsReact highcharts={Highcharts} options={TraderAndEndUser} />
      </div>
    </div>
  );
};

export default memo(TraderVsEndUser);
