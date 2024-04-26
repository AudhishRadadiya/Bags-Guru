import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { SelectButton } from 'primereact/selectbutton';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  getBagTypeChartDataOfBag,
  getIndustryChartDataOfBag,
  getLaminationTypeChartDataOfBag,
  getPrintTypeChartDataOfBag,
} from 'Services/Products/TrendingProductsBagConsumptionService';
import { getPercentageRange } from 'Helper/Common';
import moment from 'moment';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import {
  setDates,
  setIndustryWiseDates,
  setLaminationDates,
  setPrintDates,
} from 'Store/Reducers/Products/BagAndProductConsumptionSlice';
import accessibility from 'highcharts/modules/accessibility';
import variablePie from 'highcharts/modules/variable-pie';

variablePie(Highcharts);
accessibility(Highcharts);

// const filterOptions = [
//   { name: '1M', value: '1 Month' },
//   { name: '3M', value: '3 Month' },
//   { name: '6M', value: '6 Month' },
//   { name: '1Y', value: '1 year' },
//   { name: 'YTD', value: 'ytd' },
// ];

// const filterTemplate = option => {
//   return <span>{option.name}</span>;
// };

const BagTagConsumption = ({ hasAccess }) => {
  const dateRef = useRef(null);
  const industryRef = useRef(null);
  const printRef = useRef(null);
  const laminationRef = useRef(null);
  const dispatch = useDispatch();

  // const [dates, setDates] = useState(getDMYDateRange());
  // const [printDates, setPrintDates] = useState(getDMYDateRange());
  // const [industryWiseDates, setIndustryWiseDates] = useState(getDMYDateRange());
  // const [laminationDates, setLaminationDates] = useState(getDMYDateRange());
  // const [calDates, setCalDates] = useState(null);
  // const [printCalDates, setPrintCalDates] = useState(null);
  // const [industryWiseCalDates, setIndustryWiseCalDates] = useState(null);
  // const [laminationCalDates, setLaminationCalDates] = useState(null);
  // const [bagType, setBagType] = useState('1 Month');
  // const [printType, setPrintType] = useState('ytd');
  // const [industryWise, setIndustryWise] = useState('ytd');
  // const [laminationType, setLaminationType] = useState('ytd');
  const {
    bagTypeChartDataOfBag,
    industryChartDataOfBag,
    printChartDataOfBag,
    laminationTypeChartDataOfBag,
    dates,
    industryWiseDates,
    laminationDates,
    printDates,
  } = useSelector(({ bagProdConsump }) => bagProdConsump);

  const todayDate = new Date();
  let oneMonthAgoDate = new Date(todayDate);
  oneMonthAgoDate.setMonth(todayDate.getMonth() - 1);

  useEffect(() => {
    // if (dates?.every(v => !!v === true))
    dispatch(getBagTypeChartDataOfBag(dates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);

  useEffect(() => {
    // if (printDates?.every(v => !!v === true))
    dispatch(getPrintTypeChartDataOfBag(printDates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printDates]);

  useEffect(() => {
    // if (industryWiseDates?.every(v => !!v === true))
    dispatch(getIndustryChartDataOfBag(industryWiseDates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industryWiseDates]);

  useEffect(() => {
    // if (laminationDates?.every(v => !!v === true))
    dispatch(getLaminationTypeChartDataOfBag(laminationDates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laminationDates]);

  // useEffect(() => {
  //   if (calDates?.every(v => !!v === true))
  //     dispatch(getBagTypeChartDataOfBag(calDates));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [calDates]);

  // useEffect(() => {
  //   if (printCalDates?.every(v => !!v === true))
  //     dispatch(getPrintTypeChartDataOfBag(printCalDates));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [printCalDates]);

  // useEffect(() => {
  //   if (industryWiseCalDates?.every(v => !!v === true))
  //     dispatch(getIndustryChartDataOfBag(industryWiseCalDates));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [industryWiseCalDates]);

  // useEffect(() => {
  //   if (laminationCalDates?.every(v => !!v === true))
  //     dispatch(getLaminationTypeChartDataOfBag(laminationCalDates));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [laminationCalDates]);

  // const handleDatesChange = useCallback((key, val) => {
  //   if (key === 'bagType') {
  //     setCalDates(val);
  //     // setBagType('');
  //   } else if (key === 'printType') {
  //     setPrintCalDates(val);
  //     setPrintType('');
  //   } else if (key === 'industryWise') {
  //     setIndustryWiseCalDates(val);
  //     setIndustryWise('');
  //   } else if (key === 'laminationType') {
  //     setLaminationCalDates(val);
  //     setLaminationType('');
  //   }
  // }, []);

  const handleDateManage = (key, e) => {
    if (key === 'bagType') {
      dispatch(setDates(e));
    }
    if (key === 'industryWise') {
      dispatch(setIndustryWiseDates(e));
    }
    if (key === 'laminationType') {
      dispatch(setLaminationDates(e));
    }
    if (key === 'printType') {
      dispatch(setPrintDates(e));
    }
    // setBagType('');
    // dispatch(
    //   getStockConsumptionList(pageLimit, currentPage, searchQuery, applied, e),
    // );
  };

  const handleBagType = useCallback((key, val) => {
    // if (key === 'bagType') {
    //   if (val === '1 year') dispatch(setDates(getDateRange('years', 1)));
    //   if (val === '3 Month') dispatch(setDates(getDateRange('months', 3)));
    //   if (val === '6 Month') dispatch(setDates(getDateRange('months', 6)));
    //   if (val === '1 Month') dispatch(setDates(getDateRange('months', 1)));
    //   if (val === 'ytd') dispatch(setDates(getDMYDateFormat()));
    //   setBagType(val);
    // } else if (key === 'printType') {
    //   if (val === '1 year') setPrintDates(getDateRange('years', 1));
    //   if (val === '3 Month') setPrintDates(getDateRange('months', 3));
    //   if (val === '6 Month') setPrintDates(getDateRange('months', 6));
    //   if (val === '1 Month') setPrintDates(getDateRange('months', 1));
    //   if (val === 'ytd') setPrintDates(getDMYDateFormat());
    //   setPrintType(val);
    // } else if (key === 'industryWise') {
    //   if (val === '1 year') setIndustryWiseDates(getDateRange('years', 1));
    //   if (val === '3 Month') setIndustryWiseDates(getDateRange('months', 3));
    //   if (val === '6 Month') setIndustryWiseDates(getDateRange('months', 6));
    //   if (val === '1 Month') setIndustryWiseDates(getDateRange('months', 1));
    //   if (val === 'ytd') setIndustryWiseDates(getDMYDateFormat());
    //   setIndustryWise(val);
    // } else if (key === 'laminationType') {
    //   if (val === '1 year') setLaminationDates(getDateRange('years', 1));
    //   if (val === '3 Month') setLaminationDates(getDateRange('months', 3));
    //   if (val === '6 Month') setLaminationDates(getDateRange('months', 6));
    //   if (val === '1 Month') setLaminationDates(getDateRange('months', 1));
    //   if (val === 'ytd') setLaminationDates(getDMYDateFormat());
    //   setLaminationType(val);
    // }
  }, []);

  const bagTypeOptions = useMemo(() => {
    return {
      chart: {
        height: 260,
      },
      title: {
        text: '',
      },
      series: [
        {
          type: 'column',
          data: bagTypeChartDataOfBag?.map(item => item?.sum),
          pointWidth: 10,
          showInLegend: false,
          color: '#F3A533',
          name: '',
        },
      ],
      tooltip: {
        pointFormat: '{point.y}',
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      xAxis: {
        categories: bagTypeChartDataOfBag?.map(item => item?.name),
        labels: {
          style: {
            color: '#7B7B7B',
          },
        },
        lineColor: '#D7D7D7',
        lineWidth: 1,
      },
      yAxis: {
        title: {
          text: '',
        },
        labels: {
          format: '{value}%',
          style: {
            color: '#7B7B7B',
          },
        },
        gridLineColor: '#D7D7D7',
        gridLineDashStyle: 'longdash',
      },
      credits: {
        enabled: false,
      },
    };
  }, [bagTypeChartDataOfBag]);

  const printTypeOptions = useMemo(() => {
    return {
      chart: {
        height: 260,
      },
      title: {
        text: '',
      },
      tooltip: {
        pointFormat: '{point.y}',
      },
      series: [
        {
          type: 'column',
          data: printChartDataOfBag?.map(item => item?.sum),
          pointWidth: 10,
          showInLegend: false,
          color: '#0094FF',
          name: '',
        },
      ],
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      xAxis: {
        categories: printChartDataOfBag?.map(item => item?.name),
        labels: {
          style: {
            color: '#7B7B7B',
          },
        },
        lineColor: '#D7D7D7',
        lineWidth: 1,
      },
      yAxis: {
        title: {
          text: '',
        },
        labels: {
          format: '{value}%',
          style: {
            color: '#7B7B7B',
          },
        },
        gridLineColor: '#D7D7D7',
        gridLineDashStyle: 'longdash',
      },
      credits: {
        enabled: false,
      },
    };
  }, [printChartDataOfBag]);

  const industryWiseOptions = useMemo(() => {
    return {
      chart: {
        height: 260,
      },
      title: {
        text: '',
      },
      tooltip: {
        pointFormat: '{point.y}',
      },
      series: [
        {
          type: 'column',
          data: industryChartDataOfBag?.map(item => item?.sum),
          pointWidth: 10,
          showInLegend: false,
          color: '#29725C',
          name: '',
        },
      ],
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      xAxis: {
        categories: industryChartDataOfBag?.map(item => item?.name),
        labels: {
          style: {
            color: '#7B7B7B',
          },
        },
        lineColor: '#D7D7D7',
        lineWidth: 1,
      },
      yAxis: {
        title: {
          text: '',
        },
        labels: {
          format: '{value}%',
          style: {
            color: '#7B7B7B',
          },
        },
        gridLineColor: '#D7D7D7',
        gridLineDashStyle: 'longdash',
      },
      credits: {
        enabled: false,
      },
    };
  }, [industryChartDataOfBag]);

  const laminationTypeOptions = useMemo(() => {
    return {
      chart: {
        height: 260,
        width: 260,
      },
      title: {
        text: '',
      },
      tooltip: {
        pointFormat: '{point.y}',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },
      colors: ['#ed701e', '#322972'],
      series: [
        {
          type: 'pie',
          minPointSize: 10,
          innerSize: '60%',
          showInLegend: false,
          zMin: 0,
          name: '',
          data: laminationTypeChartDataOfBag?.map(x => ({
            y: x?.sum,
            name: x?._id ? 'Laminated' : 'Non Laminated',
          })),
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [laminationTypeChartDataOfBag]);

  return (
    <div className="bag_tag_wrapper">
      <div className="bag_tag_chart_wrapper">
        <Row className="g-4">
          <Col xl={6}>
            <div className="chart_box_wrapper border rounded-3 bg_white">
              <div className="chart_head_wrapper">
                <h3 className="m-0">Bag Type</h3>
                <ul>
                  {/* <li>
                    <SelectButton
                      value={bagType}
                      onChange={e => handleBagType('bagType', e.value)}
                      itemTemplate={filterTemplate}
                      optionLabel="value"
                      options={filterOptions}
                    />
                  </li> */}
                  <li>
                    {/* <div className="form_group date_select_wrapper only_icon">
                      <Calendar
                        id=" ConsumptionDate"
                        value={calDates}
                        placeholder="Select Date Range"
                        showIcon
                        showButtonBar
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                        onChange={e => handleDatesChange('bagType', e.value)}
                        onClearButtonClick={() => {
                          setCalDates(null);
                          setBagType('ytd');
                          dispatch(setDates(getDMYDateFormat());
                        }}
                      />
                    </div> */}
                    <div className="form_group date_range_wrapper">
                      <div
                        className="date_range_select"
                        onClick={e => {
                          dateRef.current.toggle(e);
                        }}
                      >
                        <span>
                          {dates?.startDate
                            ? moment(dates.startDate).format('DD-MM-yyyy')
                            : ''}{' '}
                          {dates?.startDate && dates?.endDate && '-'}{' '}
                          {dates?.endDate
                            ? moment(dates.endDate).format('DD-MM-yyyy')
                            : 'Select Date Range'}
                        </span>
                      </div>
                      <OverlayPanel ref={dateRef}>
                        <div className="date_range_wrap">
                          <DateRangeCalender
                            ranges={[dates]}
                            onChange={e => handleDateManage('bagType', e)}
                          />
                          <Button
                            className="btn_transperant"
                            onClick={e => {
                              dateRef.current.toggle(e);

                              dispatch(
                                setDates({
                                  startDate: oneMonthAgoDate,
                                  endDate: todayDate,
                                  key: 'selection',
                                }),
                              );
                              // dispatch(
                              //   setAllFilters({
                              //     ...allFilters,
                              //     stockConsumption: {
                              //       ...allFilters?.stockConsumption,
                              //       dates: {
                              //         startDate: '',
                              //         endDate: '',
                              //         key: 'selection',
                              //       },
                              //     },
                              //   }),
                              // );
                              // dispatch(
                              //   getStockConsumptionList(
                              //     pageLimit,
                              //     currentPage,
                              //     searchQuery,
                              //     applied,
                              //     {
                              //       startDate: '',
                              //       endDate: '',
                              //       key: 'selection',
                              //     },
                              //   ),
                              // );
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
              <div className="high_chart_wrapper p-3">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={bagTypeOptions}
                />
              </div>
            </div>
          </Col>
          <Col xl={6}>
            <div className="chart_box_wrapper border rounded-3 bg_white">
              <div className="chart_head_wrapper">
                <h3 className="m-0">Printing Type</h3>
                <ul>
                  {/* <li>
                    <SelectButton
                      value={printType}
                      onChange={e => handleBagType('printType', e.value)}
                      itemTemplate={filterTemplate}
                      optionLabel="value"
                      options={filterOptions}
                    />
                  </li> */}
                  <li>
                    {/* <div className="form_group date_select_wrapper only_icon">
                      <Calendar
                        id=" ConsumptionDate"
                        value={printCalDates}
                        placeholder="Select Date Range"
                        showIcon
                        selectionMode="range"
                        readOnlyInput
                        dateFormat="dd-mm-yy"
                        showButtonBar
                        onChange={e => handleDatesChange('printType', e.value)}
                        onClearButtonClick={() => {
                          setPrintCalDates(null);
                          setPrintType('ytd');
                          setPrintDates(getDMYDateFormat());
                        }}
                      />
                    </div> */}
                    <div className="form_group date_range_wrapper">
                      <div
                        className="date_range_select"
                        onClick={e => {
                          printRef.current.toggle(e);
                        }}
                      >
                        <span>
                          {printDates?.startDate
                            ? moment(printDates.startDate).format('DD-MM-yyyy')
                            : ''}{' '}
                          {printDates?.startDate && printDates?.endDate && '-'}{' '}
                          {printDates?.endDate
                            ? moment(printDates.endDate).format('DD-MM-yyyy')
                            : 'Select Date Range'}
                        </span>
                      </div>
                      <OverlayPanel ref={printRef}>
                        <div className="date_range_wrap">
                          <DateRangeCalender
                            ranges={[printDates]}
                            onChange={e => handleDateManage('printType', e)}
                          />
                          <Button
                            className="btn_transperant"
                            onClick={e => {
                              printRef.current.toggle(e);

                              dispatch(
                                setPrintDates({
                                  startDate: oneMonthAgoDate,
                                  endDate: todayDate,
                                  key: 'selection',
                                }),
                              );
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
              <div className="high_chart_wrapper p-3">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={printTypeOptions}
                />
              </div>
            </div>
          </Col>
          <Col xxl={8} xl={7}>
            <div className="chart_box_wrapper border rounded-3 bg_white">
              <div className="chart_head_wrapper">
                <h3 className="m-0">Industry Wise</h3>
                <ul>
                  {/* <li>
                    <SelectButton
                      value={industryWise}
                      onChange={e => handleBagType('industryWise', e.value)}
                      itemTemplate={filterTemplate}
                      optionLabel="value"
                      options={filterOptions}
                    />
                  </li> */}
                  <li>
                    {/* <div className="form_group date_select_wrapper only_icon">
                      <Calendar
                        id=" ConsumptionDate"
                        value={industryWiseCalDates}
                        placeholder="Select Date Range"
                        showIcon
                        selectionMode="range"
                        readOnlyInput
                        dateFormat="dd-mm-yy"
                        showButtonBar
                        onChange={e =>
                          handleDatesChange('industryWise', e.value)
                        }
                        onClearButtonClick={() => {
                          setIndustryWiseCalDates(null);
                          setIndustryWise('ytd');
                          setIndustryWiseDates(getDMYDateFormat());
                        }}
                      />
                    </div> */}
                    <div className="form_group date_range_wrapper">
                      <div
                        className="date_range_select"
                        onClick={e => {
                          industryRef.current.toggle(e);
                        }}
                      >
                        <span>
                          {industryWiseDates?.startDate
                            ? moment(industryWiseDates.startDate).format(
                                'DD-MM-yyyy',
                              )
                            : ''}{' '}
                          {industryWiseDates?.startDate &&
                            industryWiseDates?.endDate &&
                            '-'}{' '}
                          {industryWiseDates?.endDate
                            ? moment(industryWiseDates.endDate).format(
                                'DD-MM-yyyy',
                              )
                            : 'Select Date Range'}
                        </span>
                      </div>
                      <OverlayPanel ref={industryRef}>
                        <div className="date_range_wrap">
                          <DateRangeCalender
                            ranges={[industryWiseDates]}
                            onChange={e => handleDateManage('industryWise', e)}
                          />
                          <Button
                            className="btn_transperant"
                            onClick={e => {
                              industryRef.current.toggle(e);

                              dispatch(
                                setIndustryWiseDates({
                                  startDate: oneMonthAgoDate,
                                  endDate: todayDate,
                                  key: 'selection',
                                }),
                              );
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
              <div className="high_chart_wrapper p-3">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={industryWiseOptions}
                />
              </div>
            </div>
          </Col>
          <Col xxl={4} xl={5} lg={6}>
            <div className="chart_box_wrapper border rounded-3 bg_white">
              <div className="chart_head_wrapper">
                <h3 className="m-0">Lamination Type</h3>
                <ul>
                  {/* <li>
                    <SelectButton
                      value={laminationType}
                      onChange={e => handleBagType('laminationType', e.value)}
                      itemTemplate={filterTemplate}
                      optionLabel="value"
                      options={filterOptions}
                    />
                  </li> */}
                  <li>
                    {/* <div className="form_group date_select_wrapper only_icon">
                      <Calendar
                        id=" ConsumptionDate"
                        value={laminationCalDates}
                        placeholder="Select Date Range"
                        showIcon
                        selectionMode="range"
                        readOnlyInput
                        dateFormat="dd-mm-yy"
                        showButtonBar
                        onClearButtonClick={() => {
                          setLaminationCalDates(null);
                          setLaminationType('ytd');
                          setLaminationDates(getDMYDateFormat());
                        }}
                        onChange={e =>
                          handleDatesChange('laminationType', e.value)
                        }
                      />
                    </div> */}
                    <div className="form_group date_range_wrapper">
                      <div
                        className="date_range_select"
                        onClick={e => {
                          laminationRef.current.toggle(e);
                        }}
                      >
                        <span>
                          {laminationDates?.startDate
                            ? moment(laminationDates.startDate).format(
                                'DD-MM-yyyy',
                              )
                            : ''}{' '}
                          {laminationDates?.startDate &&
                            laminationDates?.endDate &&
                            '-'}{' '}
                          {laminationDates?.endDate
                            ? moment(laminationDates.endDate).format(
                                'DD-MM-yyyy',
                              )
                            : 'Select Date Range'}
                        </span>
                      </div>
                      <OverlayPanel ref={laminationRef}>
                        <div className="date_range_wrap">
                          <DateRangeCalender
                            ranges={[laminationDates]}
                            onChange={e =>
                              handleDateManage('laminationType', e)
                            }
                          />
                          <Button
                            className="btn_transperant"
                            onClick={e => {
                              laminationRef.current.toggle(e);

                              dispatch(
                                setLaminationDates({
                                  startDate: oneMonthAgoDate,
                                  endDate: todayDate,
                                  key: 'selection',
                                }),
                              );
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
              <div className="high_chart_wrapper p-3">
                <div className="d-flex flex-wrap pie_chart_Wrapper">
                  <div className="pie_chart_Wrap flex-grow-1">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={laminationTypeOptions}
                    />
                  </div>
                  <div className="legend_wrapper flex-grow-1">
                    <ul>
                      <li className="laminated">
                        Laminated :
                        <b>
                          {getPercentageRange(laminationTypeChartDataOfBag)
                            ?.laminated
                            ? getPercentageRange(laminationTypeChartDataOfBag)
                                ?.laminated
                            : 0}{' '}
                          %
                        </b>
                      </li>
                      <li className="non_laminated">
                        Non Laminated :
                        <b>
                          {getPercentageRange(laminationTypeChartDataOfBag)
                            ?.nonLaminated
                            ? getPercentageRange(laminationTypeChartDataOfBag)
                                ?.nonLaminated
                            : 0}{' '}
                          %
                        </b>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default memo(BagTagConsumption);
