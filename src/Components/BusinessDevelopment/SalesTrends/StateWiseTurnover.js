import React, { useCallback, useMemo } from 'react';
import Highcharts from 'highcharts';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { thousandSeparator } from 'Helper/Common';
import { setAllCommon } from 'Store/Reducers/Common';
import { HighchartsReact } from 'highcharts-react-official';
import accessibility from 'highcharts/modules/accessibility';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { getStateWiseTurnoverChartList } from 'Services/Business/SalesTrendsService';
import { setStateWiseTurnoverChartData } from 'Store/Reducers/Business/SalesTrendsSlice';

accessibility(Highcharts);

const PartyTypeOptions = [
  { label: 'Both', value: 'Both' },
  { label: 'END USER', value: 1 },
  { label: 'TRADER', value: 2 },
];

const StateWiseTurnover = () => {
  const dispatch = useDispatch();

  const { stateWiseTurnoverChartData } = useSelector(
    ({ salesTrends }) => salesTrends,
  );
  const { allCommon } = useSelector(({ common }) => common);
  const { stateWiseTurnoverPartyType } = allCommon?.salesTrends;

  const handleLoadData = useCallback(
    selectedPartyType => {
      const partyType = selectedPartyType !== 'Both' ? selectedPartyType : '';

      dispatch(setStateWiseTurnoverChartData({}));
      dispatch(getStateWiseTurnoverChartList(partyType));
    },
    [dispatch],
  );

  const stateWiseTurnoverChartOptions = useMemo(() => {
    const stateWiseTurnoverData = stateWiseTurnoverChartData?.data?.map(
      source => ({
        name: source.states_name,
        data: source.sales.map(sale => ({
          y: sale.amount,
          amount: sale.amount,
          percentage: sale.percentage,
        })),
      }),
    );

    const modifiedStateWiseTurnoverData = {
      chart: {
        type: 'spline',
      },
      title: {
        text: '',
      },
      yAxis: {
        title: {
          text: 'State Wise revenue',
        },
        opposite: true,
      },

      xAxis: {
        categories: stateWiseTurnoverChartData?.date || [],
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

      series: stateWiseTurnoverData,

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
    };

    return modifiedStateWiseTurnoverData;
  }, [stateWiseTurnoverChartData]);

  return (
    <div className="state_wise_turnover_wrap p-3 bg_white rounded-3 border">
      <Row className="justify-content-between align-items-center mb-3">
        <Col xxl={3} xl={3} md={4} sm={5}>
          <div className="chart_head_wrapper">
            <h3 className="m-0 fw-bold">State Wise Turnover</h3>
          </div>
        </Col>
        <Col xxl={3} xl={3} md={4} sm={5}>
          <div className="chart_input_wrap mb-3">
            <ReactSelectSingle
              BrokerSelect
              value={stateWiseTurnoverPartyType}
              placeholder="Party Type"
              options={PartyTypeOptions}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    salesTrends: {
                      ...allCommon?.salesTrends,
                      stateWiseTurnoverPartyType: e.target.value,
                    },
                  }),
                );
                handleLoadData(e.target.value);
              }}
            />
          </div>
        </Col>
      </Row>
      <div className="state_wise_turnover_chart_wrap">
        <HighchartsReact
          highcharts={Highcharts}
          options={stateWiseTurnoverChartOptions}
          containerProps={{ className: 'state_wise_turnover' }}
        />
      </div>
    </div>
  );
};

export default StateWiseTurnover;
