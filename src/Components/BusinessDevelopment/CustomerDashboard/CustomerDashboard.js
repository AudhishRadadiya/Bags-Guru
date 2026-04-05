import React, { memo, useEffect, useState } from 'react';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Col, Row } from 'react-bootstrap';
import Loader from 'Components/Common/Loader';
import { Calendar } from 'primereact/calendar';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SearchIcon from '../../../Assets/Images/search.svg';
import CustomerDashboardTable from './CustomerDashboardTable';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import CheckGreen from '../../../Assets/Images/check-round-green.svg';
import CustomerDashboardGlobalFilter from './CustomerDashboardGlobalFilter';
import TotalOrdersCountChart from './monthlySalesGraphs/TotalOrdersCountChart';
import CustomerWhoOrderChart from './monthlySalesGraphs/CustomerWhoOrderChart';
import AverageTicketSizeChart from './monthlySalesGraphs/AverageTicketSizeChart';
import AverageRevenuePerCustomerChart from './monthlySalesGraphs/AverageRevenuePerCustomerChart';
import {
  getAllUserPartyList,
  getPartiesActiveIndustry,
  getPartiesAdvisor,
  getPartiesCustomerSource,
  updateParties,
} from 'Services/partiesService';
import {
  getCustomerAnalyticsData,
  getCustomerAveragesData,
  getMonthlySalesTrendsData,
} from 'Services/Business/CustomerDashboardService';
import {
  setSortCustomerDashboardField,
  setSortCustomerDashboardOrder,
} from 'Store/Reducers/Business/CustomerDashboardSlice';

const CustomerDashboard = ({ hasAccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [customerAnalyticsData, setCustomerAnalyticsData] = useState([]);

  const {
    customerAveragesData,
    customerAnalyticsList,
    customerAnalyticsCount,
    customerDashboardLoading,
    sortCustomerDashboardOrder,
    sortCustomerDashboardField,
    customerDashboardListLoading,
    customerDashboardGlobalFilters,
  } = useSelector(({ customerDashboard }) => customerDashboard);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { dates, currentPage, pageLimit } = allFilters?.customerDashboard;
  const { filterToggle, customerDashboardFilters } =
    allCommon?.customerDashboard;

  const loadTableData = (start, limit, dates, globalFilters) => {
    dispatch(getCustomerAnalyticsData(start, limit, dates, globalFilters));
  };

  const fetchCustomerAveragesData = (selectedDate, globalFilters) => {
    dispatch(getCustomerAveragesData(selectedDate, globalFilters));
    dispatch(getMonthlySalesTrendsData(selectedDate, globalFilters));
  };

  const fetchAPIData = () => {
    loadTableData(
      currentPage,
      pageLimit,
      dates,
      customerDashboardGlobalFilters,
    );
    fetchCustomerAveragesData(dates, customerDashboardGlobalFilters);
    dispatch(getPartiesAdvisor());
    dispatch(getAllUserPartyList());
    dispatch(getPartiesCustomerSource());
    dispatch(getPartiesActiveIndustry());
  };

  useEffect(() => {
    fetchAPIData();
  }, []);

  useEffect(() => {
    if (customerAnalyticsList) {
      setCustomerAnalyticsData(customerAnalyticsList);
    }
  }, [customerAnalyticsList]);

  const onPageChange = page => {
    let pageIndex = currentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;

    dispatch(
      setAllFilters({
        ...allFilters,
        customerDashboard: {
          ...allFilters?.customerDashboard,
          currentPage: pageIndex,
        },
      }),
    );

    loadTableData(pageIndex, pageLimit, dates, customerDashboardGlobalFilters);
  };

  const onPageRowsChange = page => {
    const updateCurrentPage = page === 0 ? 0 : 1;

    dispatch(
      setAllFilters({
        ...allFilters,
        customerDashboard: {
          ...allFilters?.customerDashboard,
          currentPage: updateCurrentPage,
          pageLimit: page,
        },
      }),
    );

    loadTableData(
      updateCurrentPage,
      page,
      dates,
      customerDashboardGlobalFilters,
    );
  };

  const updateTableRowData = (uniqueId, updatedData) => {
    let updatedCustomerAnalyticsData = [...(customerAnalyticsData || [])];

    const index = updatedCustomerAnalyticsData.findIndex(
      item => item.unique_id === uniqueId,
    );

    if (index >= 0) {
      const oldObj = {
        ...updatedCustomerAnalyticsData[index],
      };

      const newObj = {
        ...oldObj,
        ...updatedData,
      };

      updatedCustomerAnalyticsData[index] = newObj;

      setCustomerAnalyticsData(updatedCustomerAnalyticsData);
    }
  };

  const lastDiscussionDateTemplate = row => {
    const { last_call_date } = row;

    return (
      <div className="date_select_wrapper d-flex align-items-center">
        <Calendar
          showIcon
          style={{ minWidth: '155px' }}
          placeholder="Last Discussion Date"
          dateFormat="dd-mm-yy"
          name="last_call_date"
          maxDate={new Date()}
          value={last_call_date ? new Date(last_call_date) : ''}
          onChange={e => {
            const updateData = {
              last_call_date: e.value,
            };

            updateTableRowData(row?.unique_id, updateData);
          }}
          showButtonBar
          onClearButtonClick={() => {
            const updateData = {
              last_call_date: '',
            };

            updateTableRowData(row?.unique_id, updateData);
          }}
        />
        <Button
          className="btn_transperant opening_btn"
          onClick={() => {
            const payload = {
              party_id: row?.party_id,
              last_call_date: moment(row?.last_call_date).format('YYYY-MM-DD'),
            };

            dispatch(updateParties(payload));
          }}
          disabled={!last_call_date}
        >
          <img src={CheckGreen} alt="" />
        </Button>
      </div>
    );
  };

  // const normalNoteTemplate = row => {
  //   const { customer_dashboard_note } = row;

  //   return (
  //     <div className="d-flex align-items-center">
  //       <div
  //         style={{ display: 'flex' }}
  //         className="customer_dashboard_note_wrapper"
  //       >
  //         <InputTextarea
  //           placeholder="Note"
  //           rows={1}
  //           name="customer_dashboard_note"
  //           value={customer_dashboard_note}
  //           onChange={e => {
  //             const updateData = {
  //               customer_dashboard_note: e.target.value,
  //             };

  //             updateTableRowData(row?.unique_id, updateData);
  //           }}
  //         />
  //         <Button
  //           className="btn_transperant opening_btn"
  //           onClick={() => {
  //             const payload = {
  //               party_id: row?.party_id,
  //               customer_dashboard_note: row?.customer_dashboard_note,
  //             };

  //             dispatch(updateParties(payload));
  //           }}
  //           disabled={!customer_dashboard_note}
  //         >
  //           <img src={CheckGreen} alt="" />
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // };

  const handleNoteSave = (row, note) => {
    dispatch(
      updateParties({
        party_id: row.party_id,
        customer_dashboard_note: note,
      }),
    );

    updateTableRowData(row.unique_id, {
      customer_dashboard_note: note,
    });
  };

  const companyNameTemplate = val => {
    return (
      <span
        onClick={() =>
          navigate(`/mfg-live-admin`, {
            state: {
              redirectFromCustomerDashboard: true,
              party_name: val?.company_name,
            },
          })
        }
      >
        {val?.company_name}
      </span>
    );
  };

  const onSort = e => {
    const { sortField, sortOrder } = e;
    dispatch(setSortCustomerDashboardField(sortField));
    dispatch(setSortCustomerDashboardOrder(sortOrder));
  };

  return (
    <>
      {(customerDashboardLoading || customerDashboardListLoading) && <Loader />}

      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white customer_dashboard_wrapper">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col xl={2}>
                <div className="page_title">
                  <h3 className="m-0">Customer Dashboard</h3>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xl={12}>
                <CustomerDashboardGlobalFilter
                  loadTableData={loadTableData}
                  fetchCustomerAveragesData={fetchCustomerAveragesData}
                />
              </Col>
            </Row>
          </div>

          <Row className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 eight-cols g-3 mt-2 mb-4 mx-1">
            <Col>
              <div class="rate_box green_box">
                <h4>
                  {customerAveragesData?.average_revenue_per_customer ?? ''}
                </h4>
                <h5 class="m-0">Avg Revenue/Customer</h5>
              </div>
            </Col>
            <Col>
              <div class="rate_box yellow_box">
                <h4>{customerAveragesData?.average_ticket_size ?? ''}</h4>
                <h5 class="m-0">Avg Ticket Size</h5>
              </div>
            </Col>
            <Col>
              <div class="rate_box blue_box">
                <h4>{customerAveragesData?.total_orders_count ?? ''}</h4>
                <h5 class="m-0">Orders</h5>
              </div>
            </Col>
            <Col>
              <div class="rate_box light_blue_box">
                <h4>{customerAveragesData?.unique_customers_count ?? ''}</h4>
                <h5 class="m-0">Customers</h5>
              </div>
            </Col>
            {customerAveragesData?.customer_tier_counts?.map((tier, index) => (
              <Col key={index}>
                <div
                  className="rate_box"
                  style={{ backgroundColor: tier.BackgroundColorCode }}
                >
                  <h4>{tier?.count ?? ''}</h4>
                  <h5 class="m-0">{tier?.tier_name ?? ''}</h5>
                </div>
              </Col>
            ))}
          </Row>

          <Row className="mb-4 px-2">
            <Col xl={3} md={6} sm={5}>
              <AverageRevenuePerCustomerChart />
            </Col>

            <Col xl={3} md={6} sm={5}>
              <AverageTicketSizeChart />
            </Col>

            <Col xl={3} md={6} sm={5}>
              <TotalOrdersCountChart />
            </Col>

            <Col xl={3} md={6} sm={5}>
              <CustomerWhoOrderChart />
            </Col>
          </Row>

          <div className="data_table_wrapper cell_padding_large is_filter">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    customerDashboard: {
                      ...allCommon?.customerDashboard,
                      filterToggle: !filterToggle,
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>

            <CustomerDashboardTable
              filterToggle={filterToggle}
              handleNoteSave={handleNoteSave}
              customerAnalyticsData={customerAnalyticsData}
              sortCustomerDashboardOrder={sortCustomerDashboardOrder}
              sortCustomerDashboardField={sortCustomerDashboardField}
              customerDashboardFilters={customerDashboardFilters}
              customerDashboardLoading={customerDashboardLoading}
              onSort={onSort}
              companyNameTemplate={companyNameTemplate}
              lastDiscussionDateTemplate={lastDiscussionDateTemplate}
            />

            <CustomPaginator
              dataList={customerAnalyticsList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={customerAnalyticsCount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(CustomerDashboard);
