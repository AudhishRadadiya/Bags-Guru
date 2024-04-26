import { memo, useMemo } from 'react';
import Highcharts from 'highcharts';
import { useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import accessibility from 'highcharts/modules/accessibility';
import { thousandSeparator } from 'Helper/Common';

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

const SalesComparison = () => {
  const { advisorReportData } = useSelector(
    ({ adminDashBoard }) => adminDashBoard,
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

      xAxis: { categories: headerMenu },

      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
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
      <div className="sales_comparison_top mb-3">
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
      </div>
      <div className="sales_comparison_chart_wrap">
        <HighchartsReact
          highcharts={Highcharts}
          options={SalesComparisonoptions}
        />
      </div>
    </div>
  );
};

export default memo(SalesComparison);
