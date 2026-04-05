import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { HighchartsReact } from 'highcharts-react-official';
import React, { useCallback, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import accessibility from 'highcharts/modules/accessibility';
import Highcharts from 'highcharts';
import { setAllCommon } from 'Store/Reducers/Common';
import { thousandSeparator } from 'Helper/Common';
import { setPendingAndTotalSalesReportData } from 'Store/Reducers/Business/SalesTrendsSlice';
import { getPendingAndTotalSalesRatioReportList } from 'Services/Business/SalesTrendsService';

accessibility(Highcharts);

const PendingPaymentAmount = () => {
  const dispatch = useDispatch();

  const { pendingAndTotalSalesReportData } = useSelector(
    ({ salesTrends }) => salesTrends,
  );
  const { allCommon } = useSelector(({ common }) => common);
  const { presentAdvisorForPendingAndTotalSales } = allCommon?.salesTrends;
  const { partiesAdvisor } = useSelector(({ parties }) => parties);

  const handleLoadData = useCallback(
    selectedPresentAdvisor => {
      dispatch(
        setAllCommon({
          ...allCommon,
          salesTrends: {
            ...allCommon?.salesTrends,
            presentAdvisorForPendingAndTotalSales: selectedPresentAdvisor,
          },
        }),
      );

      dispatch(setPendingAndTotalSalesReportData({}));
      dispatch(getPendingAndTotalSalesRatioReportList(selectedPresentAdvisor));
    },
    [allCommon, dispatch],
  );

  const PendingAmountData = useMemo(() => {
    let data = [];
    if (pendingAndTotalSalesReportData?.pending_amount) {
      data = pendingAndTotalSalesReportData?.pending_amount?.map(item => {
        return item.amount;
      });
    }

    return data;
  }, [pendingAndTotalSalesReportData?.pending_amount]);

  const TotalSalesData = useMemo(() => {
    let data = [];
    if (pendingAndTotalSalesReportData?.total_sales?.length > 0) {
      data = pendingAndTotalSalesReportData?.total_sales?.map(item => {
        return item.amount;
      });
    }

    return data;
  }, [pendingAndTotalSalesReportData?.total_sales]);

  const PendingAndTotalSalesChartOptions = useMemo(() => {
    const { date, pending_amount, total_sales } =
      pendingAndTotalSalesReportData;

    const headerMenu = date ?? [];

    const PendingAmountRatioData =
      pending_amount?.map(item => item.ratio) || [];
    const TotalSalesRatioData = total_sales?.map(item => item.ratio) || [];

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
          data: PendingAmountData,
          color: '#92a8d1',
          pointWidth: 14,
          name: 'New Customer Sales',
          yAxis: 0, // Use first yAxis (Sales Revenue)
        },
        {
          type: 'column',
          data: TotalSalesData,
          color: '#034f84',
          pointWidth: 14,
          name: 'Repeat Customer Sales',
          yAxis: 0, // Use first yAxis (Sales Revenue)
        },
        {
          type: 'line',
          data: PendingAmountRatioData,
          color: '#29D9A7',
          name: 'New Customer Ratio (%)',
          yAxis: 1, // Use second yAxis (Ratio %)
          marker: {
            enabled: true,
          },
        },
        {
          type: 'line',
          data: TotalSalesRatioData,
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
          let newCustomerRatio = pending_amount[pointIndex]?.ratio ?? 0;
          let repeatCustomerRatio = total_sales[pointIndex]?.ratio ?? 0;

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
  }, [PendingAmountData, TotalSalesData, pendingAndTotalSalesReportData]);

  return (
    <div className="pending_payment_amount_wrap p-3 bg_white rounded-3 border">
      <Row className="justify-content-between align-items-center mb-3">
        <Col md={4} sm={5}>
          <div className="chart_head_wrapper">
            <h3 className="m-0 fw-bold">Pending Payment Amount</h3>
          </div>
        </Col>
        <Col xxl={3} xl={3} md={4} sm={5}>
          <div className="chart_input_wrap mb-3">
            <ReactSelectSingle
              BrokerSelect
              value={presentAdvisorForPendingAndTotalSales}
              placeholder="Present Advisor"
              options={partiesAdvisor}
              onChange={e => {
                handleLoadData(e.target.value);
              }}
            />
          </div>
        </Col>
      </Row>
      <div className="pending_payment_amount_chart_wrap">
        <HighchartsReact
          highcharts={Highcharts}
          options={PendingAndTotalSalesChartOptions}
          containerProps={{ className: 'pending_payment_amount' }}
        />
      </div>
    </div>
  );
};

export default PendingPaymentAmount;
