import { memo, useMemo } from 'react';
import Highcharts from 'highcharts';
import { useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import variablePie from 'highcharts/modules/variable-pie.js';
import { roundValueThousandSeparator, thousandSeparator } from 'Helper/Common';

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

const FinishedGoodChart = () => {
  const { productStockChartData } = useSelector(
    ({ adminDashBoard }) => adminDashBoard,
  );

  const handleColorCode = useMemo(() => {
    const colors = [];
    if (productStockChartData?.length) {
      for (let i = 0; i < productStockChartData?.length; i++) {
        const colorIndex = i % color_code?.length;
        colors.push(color_code[colorIndex]);
      }
    }
    return colors;
  }, [productStockChartData]);

  const productStockData = useMemo(() => {
    const qty = productStockChartData?.map((item, i) => ({
      name: '',
      item_name: item?.name,
      y: item?.qty,
      item_value: thousandSeparator(item?.qty),
      color: handleColorCode[i],
    }));

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
          data: qty || [],
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
  }, [handleColorCode, productStockChartData]);

  return (
    <div className="chart_box_wrapper round_chat_head border rounded-3 bg_white h-100">
      <div className="chart_head_wrapper px_10">
        <h3 className="m-0">Finished Good Valuation</h3>
        {/* <ul>
          <li>
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
                    onChange={e => handleDateManage(e)}
                  />
                  <Button
                    className="btn_transperant"
                    onClick={e => {
                      dateRef.current.toggle(e);
                      dispatch(
                        setAllFilters({
                          ...allFilters,
                          stockConsumption: {
                            ...allFilters?.stockConsumption,
                            dates: {
                              startDate: '',
                              endDate: '',
                              key: 'selection',
                            },
                          },
                        }),
                      );
                      dispatch(
                        getStockConsumptionList(
                          pageLimit,
                          currentPage,
                          searchQuery,
                          applied,
                          {
                            startDate: '',
                            endDate: '',
                            key: 'selection',
                          },
                        ),
                      );
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </OverlayPanel>
            </div>
          </li>
        </ul> */}
      </div>
      <div className="pie_chart_Wrapper p-3 d-flex">
        <div className="chart_wrap">
          <div className="pie_chart_wrap">
            <HighchartsReact
              highcharts={Highcharts}
              options={productStockData}
            />
          </div>
          <div className="d-flex justify-content-center">
            <b className="me-2">Total:</b>
            {`₹${roundValueThousandSeparator(
              productStockChartData?.reduce((acc, cur) => acc + cur.qty, 0),
            )}`}
          </div>
        </div>
        <div className="chart_list_wrap">
          <ul>
            {productStockChartData?.map((item, i) => {
              if (item?.qty > 0) {
                return (
                  <li key={i}>
                    <h5 className="m-0">{item?.name}</h5>
                    <label>{item?.qtystring}</label>
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

export default memo(FinishedGoodChart);
