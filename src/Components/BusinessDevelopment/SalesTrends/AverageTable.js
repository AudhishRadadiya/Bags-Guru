import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { ProgressBar } from 'primereact/progressbar';
import { geAverageTableReportData } from 'Services/Business/SalesTrendsService';

const AverageTable = () => {
  const dispatch = useDispatch();

  const { averageTableReportData } = useSelector(
    ({ salesTrends }) => salesTrends,
  );

  useEffect(() => {
    dispatch(geAverageTableReportData());
  }, [dispatch]);

  const handleCurrentPeriod = useMemo(() => {
    return (
      <>
        <div>PERFORMANCE</div>
        <div>(Current Period)</div>
      </>
    );
  }, []);

  const monthHeaderTh = useMemo(() => {
    return averageTableReportData?.table_row?.map(month => {
      const className =
        month === '6 Month Average' ? 'average_head' : 'sup_head';
      return (
        <th colspan="3" class={className}>
          {month}
        </th>
      );
    });
  }, [averageTableReportData?.table_row]);

  const salesRatioHeaderTh = useMemo(() => {
    return averageTableReportData?.table_row?.map(_ => (
      <>
        <th>NO.</th>
        <th>SALES</th>
        <th>RATIO</th>
      </>
    ));
  }, [averageTableReportData?.table_row]);

  const renderTable = useMemo(() => {
    return (
      <>
        <table>
          <thead>
            <tr>
              <th rowspan="2">NAME</th>
              <th rowspan="2">{handleCurrentPeriod}</th>
              <th rowspan="2"></th>
              {/* <th colspan="3" class="average_head">
                6 Month Average
              </th> */}
              {monthHeaderTh}
              <th rowspan="2" className="text-nowrap">
                6 Month Average
              </th>
            </tr>
            <tr>{salesRatioHeaderTh}</tr>
          </thead>
          <tbody>
            {averageTableReportData?.sales_data?.length > 0 &&
              averageTableReportData.sales_data.map((item, i) => {
                return <WatchListItemContainer key={i} row={item} />;
              })}
          </tbody>
        </table>
      </>
    );
  }, [
    monthHeaderTh,
    salesRatioHeaderTh,
    handleCurrentPeriod,
    averageTableReportData.sales_data,
  ]);

  return (
    <div className="table_main_Wrapper bg-white state_wise_table">
      <div className="top_filter_wrap">
        <Row className="align-items-center">
          <Col xxl={7} xl={6} lg={5} md={8} sm={6}>
            <div className="page_title">
              <h3 className="m-0">Average Report</h3>
            </div>
          </Col>
        </Row>
      </div>

      <div className="average_table">{renderTable}</div>
    </div>
  );
};

const WatchListItemContainer = ({ row }) => {
  const advisorNameTd = useMemo(() => {
    return <td rowspan="3">{row.advisor_name}</td>;
  }, [row.advisor_name]);

  const currentPeriodPercentTd = useMemo(() => {
    return (
      <td rowspan="3">
        <div class="progress-bar d-flex align-items-center flex-row">
          <ProgressBar
            style={{
              backgroundColor: '#e7e7e7',
              color: 'blue',
              height: '10px',
              width: '100%',
            }}
            value={row.current_period_percent}
          ></ProgressBar>
          <span>{`${row.current_period_percent}%`}</span>
        </div>
      </td>
    );
  }, [row.current_period_percent]);

  const newOrderDataTd = useMemo(() => {
    return row?.new_order.map(newData => {
      return <td class="text_end">{newData}</td>;
    });
  }, [row.new_order]);

  const averagePercentTd = useMemo(() => {
    return (
      <td class="text_end" rowspan="3">
        <div class="progress-bar d-flex align-items-center flex-row">
          <ProgressBar
            style={{
              backgroundColor: '#e7e7e7',
              color: 'blue',
              height: '10px',
              width: '100%',
            }}
            value={row.average_percent}
          ></ProgressBar>
          <span>{`${row.average_percent}%`}</span>
        </div>
      </td>
    );
  }, [row.average_percent]);

  const repeatOrderDataTd = useMemo(() => {
    return row?.repeat_order.map(repeatData => {
      return <td class="text_end">{repeatData}</td>;
    });
  }, [row.repeat_order]);

  const totalOrderDataTd = useMemo(() => {
    return row?.total_order.map(totalData => {
      return <td class="text_end">{totalData}</td>;
    });
  }, [row.total_order]);

  const renderRow = useMemo(() => {
    return (
      <>
        <tr>
          {advisorNameTd}
          {currentPeriodPercentTd}
          <td class="text_end">NEW</td>
          {newOrderDataTd}
          {averagePercentTd}
        </tr>
        <tr>
          <td class="text_end">REPEAT</td>
          {repeatOrderDataTd}
        </tr>
        <tr class="highlight-row">
          <td class="text_end">Total</td>
          {totalOrderDataTd}
        </tr>
      </>
    );
  }, [
    advisorNameTd,
    newOrderDataTd,
    averagePercentTd,
    totalOrderDataTd,
    repeatOrderDataTd,
    currentPeriodPercentTd,
  ]);

  return <>{renderRow}</>;
};

export default AverageTable;
