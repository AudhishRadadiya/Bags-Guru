import { memo, useMemo, useRef } from 'react';
import { Button } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { OverlayPanel } from 'primereact/overlaypanel';
import DateRangeCalender from '../DateRangeCalender';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getLaminationReportList } from 'Services/Business/AdminDashboardServices';
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

const LaminationRatio = ({ handleDateManage }) => {
  const dispatch = useDispatch();
  const laminationRatioDateRef = useRef(null);

  const { laminationChartData } = useSelector(
    ({ adminDashBoard }) => adminDashBoard,
  );
  const { allFilters } = useSelector(({ common }) => common);
  const { laminationRatioReport } = allFilters?.adminDashboard;

  const todayDate = new Date();
  let oneMonthAgoDate = new Date(todayDate);
  oneMonthAgoDate.setMonth(todayDate.getMonth() - 1);

  const handleColorCode = useMemo(() => {
    const colors = [];
    if (laminationChartData?.length) {
      for (let i = 0; i < laminationChartData?.length; i++) {
        const colorIndex = i % color_code?.length;
        colors.push(color_code[colorIndex]);
      }
    }
    return colors;
  }, [laminationChartData]);

  const laminationChartOptionData = useMemo(() => {
    const amount =
      laminationChartData?.map((item, i) => ({
        name: '',
        item_name: item?.lamination,
        y: item?.amount,
        item_value: thousandSeparator(item?.amount),
        color: handleColorCode[i],
      })) || [];
    // const colors = handleColorCode(laminationChartData);

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
          data: amount,
          colors: handleColorCode,
          dataLabels: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b>{point.item_name}</b>: {point.item_value}',
      },
    };

    return options;
  }, [handleColorCode, laminationChartData]);

  return (
    <div className="chart_box_wrapper round_chat_head border rounded-3 bg_white h-100">
      <div className="chart_head_wrapper px_10 py_10">
        <h3 className="m-0">Lamination Ratio</h3>
        <ul>
          <li>
            <div className="form_group date_range_wrapper">
              <div
                className="date_range_select"
                onClick={e => {
                  laminationRatioDateRef.current.toggle(e);
                }}
              >
                <span>
                  {laminationRatioReport?.dates?.startDate
                    ? moment(laminationRatioReport?.dates.startDate).format(
                        'DD-MM-yyyy',
                      )
                    : ''}{' '}
                  {laminationRatioReport?.dates?.startDate &&
                    laminationRatioReport?.dates?.endDate &&
                    '-'}{' '}
                  {laminationRatioReport?.dates?.endDate
                    ? moment(laminationRatioReport?.dates.endDate).format(
                        'DD-MM-yyyy',
                      )
                    : 'Select Date Range'}
                </span>
              </div>
              <OverlayPanel ref={laminationRatioDateRef}>
                <div className="date_range_wrap">
                  <DateRangeCalender
                    ranges={[laminationRatioReport?.dates]}
                    onChange={e => {
                      handleDateManage('laminationRatioReport', e);
                      dispatch(
                        getLaminationReportList(e?.startDate, e?.endDate),
                      );
                    }}
                  />
                  <Button
                    className="btn_transperant"
                    onClick={e => {
                      laminationRatioDateRef.current.toggle(e);
                      // handleDateManage('laminationRatioReport', {
                      //   startDate: oneMonthAgoDate,
                      //   endDate: todayDate,
                      //   key: 'selection',
                      // });

                      dispatch(
                        setAllFilters({
                          ...allFilters,
                          adminDashboard: {
                            ...allFilters?.adminDashboard,
                            laminationRatioReport: {
                              ...allFilters?.adminDashboard
                                ?.laminationRatioReport,
                              dates: {
                                ...allFilters?.adminDashboard
                                  ?.laminationRatioReport?.dates,
                                startDate: oneMonthAgoDate,
                                endDate: todayDate,
                              },
                            },
                          },
                        }),
                      );

                      dispatch(getLaminationReportList());
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
              options={laminationChartOptionData}
            />
          </div>
          <div className="d-flex justify-content-center">
            <b className="me-2">Total:</b>
            {`₹${roundValueThousandSeparator(
              laminationChartData?.reduce((acc, cur) => acc + cur.amount, 0),
            )}`}
          </div>
        </div>
        <div className="chart_list_wrap">
          <ul>
            {laminationChartData?.map((item, i) => {
              if (item?.amount > 0) {
                return (
                  <li key={i}>
                    <h5 className="m-0">{item?.lamination}</h5>
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

export default memo(LaminationRatio);
