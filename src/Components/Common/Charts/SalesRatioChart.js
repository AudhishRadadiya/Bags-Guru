import moment from 'moment';
import Highcharts from 'highcharts';
import { memo, useMemo, useRef } from 'react';
import { Button } from 'react-bootstrap';
import HighchartsReact from 'highcharts-react-official';
import { OverlayPanel } from 'primereact/overlaypanel';
import DateRangeCalender from '../DateRangeCalender';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getPartyTypeReportList } from 'Services/Business/AdminDashboardServices';
import { roundValueThousandSeparator, thousandSeparator } from 'Helper/Common';
import variablePie from 'highcharts/modules/variable-pie.js';
import { setAllFilters } from 'Store/Reducers/Common';

variablePie(Highcharts);

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

const SalesRatioChart = ({ handleDateManage }) => {
  const dispatch = useDispatch();
  const partyTypeRatioDateRef = useRef(null);

  const { partyTypeChartData } = useSelector(
    ({ adminDashBoard }) => adminDashBoard,
  );
  const { allFilters } = useSelector(({ common }) => common);
  const { partyTypeRatioReport } = allFilters?.adminDashboard;

  const todayDate = new Date();
  let oneMonthAgoDate = new Date(todayDate);
  oneMonthAgoDate.setMonth(todayDate.getMonth() - 1);

  const handleColorCode = useMemo(() => {
    const colors = [];
    if (partyTypeChartData?.length) {
      for (let i = 0; i < partyTypeChartData?.length; i++) {
        const colorIndex = i % color_code?.length;
        colors.push(color_code[colorIndex]);
      }
    }
    return colors;
  }, [partyTypeChartData]);

  const partyTypeChartOptionData = useMemo(() => {
    const amount = partyTypeChartData?.map((item, i) => ({
      name: '',
      item_name: item?.party_type,
      y: item?.amount,
      item_value: thousandSeparator(item?.amount),
      color: handleColorCode[i],
    }));
    // const colors = handleColorCode(partyTypeChartData);

    const options = {
      chart: {
        type: 'variablepie',
      },
      title: {
        text: '',
      },

      credits: {
        enabled: false,
      },
      series: [
        {
          size: '100%',
          innerSize: '70%',
          innerRadius: '70%',
          borderWidth: 2,
          borderColor: 'white',
          data: amount || [],
          colors: handleColorCode,
          dataLabels: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b>{point.item_name}</b>: {point.item_value}',
        // formatter: function () {
        //   // return `${this.point.name} value: ${this.point.y}`;
        // },
      },
    };

    return options;
  }, [handleColorCode, partyTypeChartData]);

  return (
    <div className="chart_box_wrapper round_chat_head border rounded-3 bg_white h-100">
      <div className="chart_head_wrapper px_10 py_10">
        <h3 className="m-0">Party Type Ratio</h3>
        <ul>
          <li>
            <div className="form_group date_range_wrapper">
              <div
                className="date_range_select"
                onClick={e => {
                  partyTypeRatioDateRef.current.toggle(e);
                }}
              >
                <span>
                  {partyTypeRatioReport?.dates?.startDate
                    ? moment(partyTypeRatioReport?.dates.startDate).format(
                        'DD-MM-yyyy',
                      )
                    : ''}{' '}
                  {partyTypeRatioReport?.dates?.startDate &&
                    partyTypeRatioReport?.dates?.endDate &&
                    '-'}{' '}
                  {partyTypeRatioReport?.dates?.endDate
                    ? moment(partyTypeRatioReport?.dates.endDate).format(
                        'DD-MM-yyyy',
                      )
                    : 'Select Date Range'}
                </span>
              </div>
              <OverlayPanel ref={partyTypeRatioDateRef}>
                <div className="date_range_wrap">
                  <DateRangeCalender
                    ranges={[partyTypeRatioReport?.dates]}
                    onChange={e => {
                      handleDateManage('partyTypeRatioReport', e);
                      dispatch(
                        getPartyTypeReportList(e?.startDate, e?.endDate),
                      );
                    }}
                  />
                  <Button
                    className="btn_transperant"
                    onClick={e => {
                      partyTypeRatioDateRef.current.toggle(e);
                      // handleDateManage('partyTypeRatioReport', {
                      //   startDate: oneMonthAgoDate,
                      //   endDate: todayDate,
                      //   key: 'selection',
                      // });

                      dispatch(
                        setAllFilters({
                          ...allFilters,
                          adminDashboard: {
                            ...allFilters?.adminDashboard,
                            partyTypeRatioReport: {
                              ...allFilters?.adminDashboard
                                ?.partyTypeRatioReport,
                              dates: {
                                ...allFilters?.adminDashboard
                                  ?.partyTypeRatioReport?.dates,
                                startDate: oneMonthAgoDate,
                                endDate: todayDate,
                              },
                            },
                          },
                        }),
                      );

                      dispatch(getPartyTypeReportList());
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </OverlayPanel>
            </div>
          </li>
        </ul>
      </div>
      <div className="pie_chart_Wrapper p-3 d-flex">
        <div className="chart_wrap">
          <div className="pie_chart_wrap">
            <HighchartsReact
              highcharts={Highcharts}
              options={partyTypeChartOptionData}
            />
          </div>
          <div className="d-flex justify-content-center">
            <b className="me-2">Total:</b>
            {`₹${roundValueThousandSeparator(
              partyTypeChartData?.reduce((acc, cur) => acc + cur.amount, 0),
            )}`}
          </div>
        </div>
        <div className="chart_list_wrap">
          <ul>
            {partyTypeChartData?.map((item, i) => {
              if (item?.amount > 0) {
                return (
                  <li key={i}>
                    <h5 className="m-0">{item?.party_type}</h5>
                    <label>{item?.amountstring}</label>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default memo(SalesRatioChart);
