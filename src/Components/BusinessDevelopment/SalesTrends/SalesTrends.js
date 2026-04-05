import React, { memo, useCallback, useEffect } from 'react';
import Industry from './Industry';
import { Col, Row } from 'react-bootstrap';
import CustomerSource from './CustomerSource';
import StateWiseTurnover from './StateWiseTurnover';
import PendingPaymentAmount from './PendingPaymentAmount';
import {
  getCustomerSourceSalesMonthWiseChartList,
  getIndustrySalesMonthWiseChartList,
  getPendingAndTotalSalesRatioReportList,
  getStateWiseTurnoverChartList,
} from 'Services/Business/SalesTrendsService';
import { useDispatch } from 'react-redux';
import AverageTable from './AverageTable';
import { useSelector } from 'react-redux';
import { setAllCommon } from 'Store/Reducers/Common';
import { getPartiesAdvisor } from 'Services/partiesService';
import ExhibitionReportTable from './ExhibitionReportTable';

const SalesTrends = () => {
  const dispatch = useDispatch();

  const { allCommon } = useSelector(({ common }) => common);

  const handlePartiesAdvisorAPI = useCallback(async () => {
    const res = await dispatch(getPartiesAdvisor());

    if (!!res?.length) {
      dispatch(
        setAllCommon({
          ...allCommon,
          salesTrends: {
            ...allCommon?.salesTrends,
            presentAdvisorForPendingAndTotalSales: res[0]?.value,
          },
        }),
      );

      dispatch(getPendingAndTotalSalesRatioReportList(res[0]?.value)); // Pending-TotalSales-Ratio-Report
    }
  }, [dispatch, allCommon]);

  useEffect(() => {
    dispatch(getCustomerSourceSalesMonthWiseChartList()); // Customer-Source-Sales Chart
    dispatch(getIndustrySalesMonthWiseChartList()); // Industry-Sales Chart
    dispatch(getStateWiseTurnoverChartList()); // State-Wise-Turnover Chart
    handlePartiesAdvisorAPI();
  }, []);

  return (
    <div className="main_Wrapper">
      <Row>
        <Col xxl={6} className="pb-3">
          <CustomerSource />
        </Col>
        <Col xxl={6} className="pb-3">
          <Industry />
        </Col>
        <Col xxl={6} className="pb-3">
          <StateWiseTurnover />
        </Col>
        <Col xxl={6} className="pb-3">
          <PendingPaymentAmount />
        </Col>
        {/* <Col xxl={6} className="pb-3">
          <CustomerSourceDetail />
        </Col> */}
        <Col sm={12} className="pb-3">
          <ExhibitionReportTable />
        </Col>
        <Col sm={12}>
          <AverageTable />
        </Col>
      </Row>
    </div>
  );
};

export default memo(SalesTrends);
