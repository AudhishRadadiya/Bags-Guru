import { memo, useMemo } from 'react';
import Highcharts from 'highcharts';
import { thousandSeparator } from 'Helper/Common';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';

const NonLaminatedVsLaminated = () => {
  const { laminatedAndNonLaminatedList } = useSelector(
    ({ adminDashBoard }) => adminDashBoard,
  );

  const LaminatedData = useMemo(() => {
    let data = [];
    if (laminatedAndNonLaminatedList?.laminated?.length > 0) {
      data = laminatedAndNonLaminatedList?.laminated?.map(item => {
        return item.amount;
      });
    }

    return data;
  }, [laminatedAndNonLaminatedList?.laminated]);

  const NonLaminatedData = useMemo(() => {
    let data = [];
    if (laminatedAndNonLaminatedList?.non_laminated?.length > 0) {
      data = laminatedAndNonLaminatedList?.non_laminated?.map(item => {
        return item.amount;
      });
    }

    return data;
  }, [laminatedAndNonLaminatedList?.non_laminated]);

  const NonLaminatedAndLaminated = useMemo(() => {
    const { date, laminated, non_laminated } = laminatedAndNonLaminatedList;

    const headerMenu = date || [];
    const LaminatedRatioData = laminated?.map(item => item.ratio) || [];
    const NonLaminatedRatioData = non_laminated?.map(item => item.ratio) || [];

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
          data: NonLaminatedData,
          color: '#9aa2a9',
          pointWidth: 14,
          name: 'Non-Laminated Sales',
          yAxis: 0, // Use first yAxis (Sales Revenue)
        },
        {
          type: 'column',
          data: LaminatedData,
          color: '#004c6d',
          pointWidth: 14,
          name: 'Laminated Sales',
          yAxis: 0, // Use first yAxis (Sales Revenue)
        },
        {
          type: 'line',
          data: LaminatedRatioData,
          color: '#d2980d',
          name: 'Laminated Ratio (%)',
          yAxis: 1, // Use second yAxis (Ratio %)
          marker: {
            enabled: true,
          },
        },
        {
          type: 'line',
          data: NonLaminatedRatioData,
          color: '#c80064',
          name: 'Non Laminated Ratio (%)',
          yAxis: 1, // Use second yAxis (Ratio %)
          marker: {
            enabled: true,
          },
        },
      ],
      tooltip: {
        formatter: function () {
          const pointIndex = this.point.index;
          let laminatedRatio = laminated[pointIndex]?.ratio ?? 0;
          let nonLaminatedRatio = non_laminated[pointIndex]?.ratio ?? 0;

          return `<div>
                    <span class="tooltip-x">${this.x}</span>
                  </div>
                  <div> <br> <br>
                    <span style="color:${this.point.color}">\u25CF</span> <b>
                      ${this.series.name}
                    </b>: ${thousandSeparator(this.y)}
                  </div>
                  ${
                    this.series.name === 'Laminated Sales'
                      ? `<div> <br>
                            <span style="color:#d2980d">\u25CF</span> <b>
                              Laminated Ratio
                            </b>: ${laminatedRatio}%
                          </div>`
                      : this.series.name === 'Non-Laminated Sales'
                      ? `<div> <br>
                            <span style="color:#c80064">\u25CF</span> <b>
                              Non Laminated Ratio
                            </b>: ${nonLaminatedRatio}%
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
  }, [LaminatedData, NonLaminatedData, laminatedAndNonLaminatedList]);

  return (
    <div className="chart_box_wrapper border rounded-3 bg_white h-100">
      <div className="chart_head_wrapper">
        <h3 className="m-0">Non-Laminated Vs Laminated</h3>
      </div>
      <div className="sales_comparison_chart_wrap p-3">
        <HighchartsReact
          highcharts={Highcharts}
          options={NonLaminatedAndLaminated}
        />
      </div>
    </div>
  );
};

export default memo(NonLaminatedVsLaminated);
