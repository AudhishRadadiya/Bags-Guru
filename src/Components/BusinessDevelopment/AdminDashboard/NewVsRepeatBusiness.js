import React, { memo, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { thousandSeparator } from 'Helper/Common';
import { useSelector } from 'react-redux';

const NewVsRepeatBusiness = () => {
  const { newAndRepeatOrderBusinessData } = useSelector(
    ({ adminDashBoard }) => adminDashBoard,
  );

  const NewCustomerData = useMemo(() => {
    let data = [];
    if (newAndRepeatOrderBusinessData?.new_customer) {
      data = newAndRepeatOrderBusinessData?.new_customer?.map(item => {
        return item.amount;
      });
    }

    return data;
  }, [newAndRepeatOrderBusinessData?.new_customer]);

  const RepeatCustomerData = useMemo(() => {
    let data = [];
    if (newAndRepeatOrderBusinessData?.repeat_customer?.length > 0) {
      data = newAndRepeatOrderBusinessData?.repeat_customer?.map(item => {
        return item.amount;
      });
    }

    return data;
  }, [newAndRepeatOrderBusinessData?.repeat_customer]);

  const NewAndRepeatBusiness = useMemo(() => {
    const { date, new_customer, repeat_customer } =
      newAndRepeatOrderBusinessData;

    const headerMenu = date ?? [];
    const NewCustomerRatioData = new_customer?.map(item => item.ratio) || [];
    const RepeatCustomerRatioData =
      repeat_customer?.map(item => item.ratio) || [];

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
          data: NewCustomerData,
          color: '#92a8d1',
          pointWidth: 14,
          name: 'New Customer Sales',
          yAxis: 0, // Use first yAxis (Sales Revenue)
        },
        {
          type: 'column',
          data: RepeatCustomerData,
          color: '#034f84',
          pointWidth: 14,
          name: 'Repeat Customer Sales',
          yAxis: 0, // Use first yAxis (Sales Revenue)
        },
        {
          type: 'line',
          data: NewCustomerRatioData,
          color: '#29D9A7',
          name: 'New Customer Ratio (%)',
          yAxis: 1, // Use second yAxis (Ratio %)
          marker: {
            enabled: true,
          },
        },
        {
          type: 'line',
          data: RepeatCustomerRatioData,
          color: '#9C64F9',
          name: 'Repeat Customer Ratio (%)',
          yAxis: 1, // Use second yAxis (Ratio %)
          marker: {
            enabled: true,
          },
        },
      ],
      tooltip: {
        formatter: function () {
          const pointIndex = this.point.index;
          let newCustomerRatio = new_customer[pointIndex]?.ratio ?? 0;
          let repeatCustomerRatio = repeat_customer[pointIndex]?.ratio ?? 0;

          return `<div>
              <span class="tooltip-x">${this.x}</span>
            </div>
            <div> <br> <br>
              <span style="color:${this.point.color}">\u25CF</span> <b>
                ${this.series.name}
              </b>: ${thousandSeparator(this.y)}
            </div>
            ${
              this.series.name === 'New Customer Sales'
                ? `<div> <br>
                    <span style="color:#29D9A7">\u25CF</span> <b>
                      New Customer Ratio
                    </b>: ${newCustomerRatio}%
                  </div>`
                : this.series.name === 'Repeat Customer Sales'
                ? `<div> <br>
                    <span style="color:#9C64F9">\u25CF</span> <b>
                      Repeat Customer Ratio
                    </b>: ${repeatCustomerRatio}%
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
  }, [NewCustomerData, RepeatCustomerData, newAndRepeatOrderBusinessData]);

  return (
    <div className="chart_box_wrapper border rounded-3 bg_white h-100">
      <div className="chart_head_wrapper">
        <h3 className="m-0">New & Repeat Sales</h3>
      </div>
      <div className="sales_comparison_chart_wrap p-3">
        <HighchartsReact
          highcharts={Highcharts}
          options={NewAndRepeatBusiness}
        />
      </div>
    </div>
  );
};

export default memo(NewVsRepeatBusiness);
