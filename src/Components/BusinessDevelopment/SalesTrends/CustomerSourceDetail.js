import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { HighchartsReact } from 'highcharts-react-official';
import React, { useCallback, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getAdvisorReportList } from 'Services/Business/AdminDashboardServices';
import { setAdvisorReportData } from 'Store/Reducers/Business/AdminDashboardSlice';
import accessibility from 'highcharts/modules/accessibility';
import Highcharts from 'highcharts';
import { setAllCommon } from 'Store/Reducers/Common';

accessibility(Highcharts);

const PartyTypeOptions = [
  { label: 'Both', value: 'Both' },
  { label: 'END USER', value: 1 },
  { label: 'TRADER', value: 2 },
];

const CustomerSourceDetail = () => {
  const dispatch = useDispatch();

  const { advisorReportData } = useSelector(
    ({ adminDashBoard }) => adminDashBoard,
  );
  const { allCommon } = useSelector(({ common }) => common);
  const { partyType } = allCommon?.adminDashboard;

  const handleLoadData = useCallback(
    selectedPartyType => {
      const partyType = selectedPartyType !== 'Both' ? selectedPartyType : '';

      dispatch(setAdvisorReportData({}));
      dispatch(getAdvisorReportList(partyType));
    },
    [dispatch],
  );

  const SalesComparisonoptions = useMemo(() => {
    const modifiedSalesComparisonData = {
      title: {
        text: 'Customer Source Details',
        align: 'left',
      },
      yAxis: {
        title: {
          text: 'Number of Employees',
        },
        opposite: true,
      },

      xAxis: {
        accessibility: {
          rangeDescription: 'Range: 2010 to 2022',
        },
      },

      credits: {
        enabled: false,
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 2010,
        },
      },

      series: [
        {
          name: 'Installation & Developers',
          data: [
            43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
            161454, 154610, 168960, 171558,
          ],
        },
        {
          name: 'Manufacturing',
          data: [
            24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726,
            34243, 31050, 33099, 33473,
          ],
        },
        {
          name: 'Sales & Distribution',
          data: [
            11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243,
            29213, 25663, 28978, 30618,
          ],
        },
        {
          name: 'Operations & Maintenance',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 11164, 11218, 10077, 12530, 16585],
        },
        {
          name: 'Other',
          data: [
            21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906,
            10073, 11471, 11648,
          ],
        },
      ],

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
  }, []);
  // }, [advisorReportData]);

  return (
    <div className="customer_source_details_wrap p-3 bg_white rounded-3 border">
      <Row className="justify-content-end">
        <Col xxl={3} xl={3} md={4} sm={5}>
          <div className="chart_input_wrap mb-3">
            <ReactSelectSingle
              BrokerSelect
              value={partyType}
              placeholder="Party Type"
              options={PartyTypeOptions}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    adminDashboard: {
                      ...allCommon?.adminDashboard,
                      partyType: e.target.value,
                    },
                  }),
                );
                handleLoadData(e.target.value);
              }}
            />
          </div>
        </Col>
      </Row>
      <div className="customer_source_details_chart_wrap">
        <HighchartsReact
          highcharts={Highcharts}
          options={SalesComparisonoptions}
          containerProps={{ className: 'customer_source_details' }}
        />
      </div>
    </div>
  );
};

export default CustomerSourceDetail;
