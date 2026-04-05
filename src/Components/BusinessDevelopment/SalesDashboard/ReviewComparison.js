import DateRangeCalender from 'Components/Common/DateRangeCalender';
import moment from 'moment';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getReviewComparisonDetailReport } from 'Services/Sales/SalesDashboardServices';

const ReviewComparison = ({ handleDateManage }) => {
  const dispatch = useDispatch();
  const reviewComparisonDateRef = useRef(null);

  const todayDate = new Date();
  let oneMonthAgoDate = new Date(todayDate);
  oneMonthAgoDate?.setMonth(todayDate?.getMonth() - 1);

  const { reviewComparisonDetail } = useSelector(
    ({ salesDashBoard }) => salesDashBoard,
  );
  const { allFilters } = useSelector(({ common }) => common);

  const { reviewComparisonDetailReport } = allFilters?.salesDashboard;

  return (
    <div className="table_main_Wrapper bg-white h-100">
      <div className="top_filter_wrap">
        <Row className="align-items-center">
          <Col xxl={5} xl={6} lg={5} md={8} sm={6}>
            <div className="page_title">
              <h3 className="m-0">Review Comparison</h3>
            </div>
          </Col>
          <Col xxl={5} xl={6} lg={7} md={4} sm={6}>
            <ul>
              <li>
                <div className="form_group date_range_wrapper">
                  <div
                    className="date_range_select"
                    onClick={e => {
                      reviewComparisonDateRef.current.toggle(e);
                    }}
                  >
                    <span>
                      {reviewComparisonDetailReport?.dates?.startDate
                        ? moment(
                            reviewComparisonDetailReport?.dates.startDate,
                          ).format('DD-MM-yyyy')
                        : ''}{' '}
                      {reviewComparisonDetailReport?.dates?.startDate &&
                        reviewComparisonDetailReport?.dates?.endDate &&
                        '-'}{' '}
                      {reviewComparisonDetailReport?.dates?.endDate
                        ? moment(
                            reviewComparisonDetailReport?.dates.endDate,
                          ).format('DD-MM-yyyy')
                        : 'Select Date Range'}
                    </span>
                  </div>
                  <OverlayPanel ref={reviewComparisonDateRef}>
                    <div className="date_range_wrap">
                      <DateRangeCalender
                        ranges={[reviewComparisonDetailReport?.dates]}
                        onChange={e => {
                          handleDateManage('reviewComparisonDetailReport', e);

                          dispatch(getReviewComparisonDetailReport(e));
                        }}
                      />
                      <Button
                        className="btn_transperant"
                        onClick={e => {
                          reviewComparisonDateRef.current.toggle(e);
                          handleDateManage('reviewComparisonDetailReport', {
                            startDate: oneMonthAgoDate,
                            endDate: todayDate,
                            key: 'selection',
                          });

                          dispatch(
                            getReviewComparisonDetailReport({
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
          </Col>
        </Row>
      </div>
      <div className="table_wrapper ">
        <div className="table_scroll_wrapper Customers_table_wrapper admin_dashboars_table_wrapper custom_height">
          <table>
            <thead>
              <tr>
                <th className="top-0">Advisor Name</th>
                <th className="top-0">Review Count</th>
              </tr>
            </thead>
            <tbody>
              {reviewComparisonDetail?.map((item, i) => {
                return (
                  <tr key={i}>
                    <th>{item?.advisor_name}</th>
                    <td>{item?.review_count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewComparison;
