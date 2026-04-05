import React, { useCallback, useMemo } from 'react';
import Highcharts from 'highcharts';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { thousandSeparator } from 'Helper/Common';
import { setAllCommon } from 'Store/Reducers/Common';
import { HighchartsReact } from 'highcharts-react-official';
import accessibility from 'highcharts/modules/accessibility';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { setIndustrySalesChartData } from 'Store/Reducers/Business/SalesTrendsSlice';
import { getIndustrySalesMonthWiseChartList } from 'Services/Business/SalesTrendsService';

accessibility(Highcharts);

const PartyTypeOptions = [
  { label: 'Both', value: 'Both' },
  { label: 'END USER', value: 1 },
  { label: 'TRADER', value: 2 },
];

const Industry = () => {
  const dispatch = useDispatch();

  const { industrySalesChartData } = useSelector(
    ({ salesTrends }) => salesTrends,
  );
  const { allCommon } = useSelector(({ common }) => common);
  const { industryPartyType } = allCommon?.salesTrends;

  const handleLoadData = useCallback(
    selectedPartyType => {
      const partyType = selectedPartyType !== 'Both' ? selectedPartyType : '';

      dispatch(setIndustrySalesChartData({}));
      dispatch(getIndustrySalesMonthWiseChartList(partyType));
    },
    [dispatch],
  );

  const IndustrySalesChartOptions = useMemo(() => {
    const industryChartData = industrySalesChartData?.data?.map(source => ({
      name: source.industry_name,
      data: source.sales.map(sale => ({
        y: sale.amount,
        amount: sale.amount,
        percentage: sale.percentage,
      })),
    }));

    const modifiedIndustryChartData = {
      chart: {
        type: 'spline',
      },
      title: {
        text: '',
      },
      yAxis: {
        title: {
          text: 'Industry Sales revenue',
        },
        opposite: true,
      },

      xAxis: {
        categories: industrySalesChartData?.date || [],
      },

      credits: {
        enabled: false,
      },

      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        width: 840,
        maxHeight: 100,
        itemWidth: 210,
        itemMarginTop: 6,
        itemMarginBottom: 2,
        floating: false,
        padding: 8,
      },

      series: industryChartData,

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
            thousandSeparator(this.point.amount) +
            ' <b>(' +
            this.point.percentage +
            '%)</b>' +
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
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    };

    return modifiedIndustryChartData;
  }, [industrySalesChartData]);

  return (
    <div className="industry_wrap p-3 bg_white rounded-3 border">
      <Row className="justify-content-between align-items-center mb-3">
        <Col xxl={3} xl={3} md={4} sm={5}>
          <div className="chart_head_wrapper">
            <h3 className="m-0 fw-bold">Industry</h3>
          </div>
        </Col>
        <Col xxl={3} xl={3} md={4} sm={5}>
          <div className="chart_input_wrap">
            <ReactSelectSingle
              BrokerSelect
              value={industryPartyType}
              placeholder="Party Type"
              options={PartyTypeOptions}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    salesTrends: {
                      ...allCommon?.salesTrends,
                      industryPartyType: e.target.value,
                    },
                  }),
                );
                handleLoadData(e.target.value);
              }}
            />
          </div>
        </Col>
      </Row>
      <div className="industry_chart_wrap">
        <HighchartsReact
          highcharts={Highcharts}
          options={IndustrySalesChartOptions}
          containerProps={{ className: 'industry' }}
        />
      </div>
    </div>
  );
};

export default Industry;
