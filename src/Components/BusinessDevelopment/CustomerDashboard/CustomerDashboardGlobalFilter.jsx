import React, { memo, useMemo, useRef } from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setAllFilters } from 'Store/Reducers/Common';
import { OverlayPanel } from 'primereact/overlaypanel';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import {
  setCustomerDashboardGlobalFilters,
  setMonthlySalesTrendsData,
} from 'Store/Reducers/Business/CustomerDashboardSlice';
import { MultiSelect } from 'primereact/multiselect';

const CustomerDashboardGlobalFilter = ({
  loadTableData,
  fetchCustomerAveragesData,
}) => {
  const dispatch = useDispatch();
  const dateRef = useRef(null);

  const { currentUser } = useSelector(({ auth }) => auth);
  const {
    partiesAdvisor,
    allUserPartyList,
    partiesActiveIndustry,
    partiesCustomerSource,
  } = useSelector(({ parties }) => parties);

  const { customerDashboardGlobalFilters } = useSelector(
    ({ customerDashboard }) => customerDashboard,
  );
  const { allFilters } = useSelector(({ common }) => common);
  const { dates, currentPage, pageLimit } = allFilters?.customerDashboard;

  const industryOptions = useMemo(() => {
    return partiesActiveIndustry?.map(industry => ({
      label: industry?.name,
      value: industry?._id,
    }));
  }, [partiesActiveIndustry]);

  const customerSourceOptions = partiesCustomerSource?.map(customerSource => ({
    label: customerSource?.name,
    value: customerSource?._id,
  }));

  const onMultiSelectChange = e => {
    const selectedFilter = e.target.value;
    const selectedFilterName = e.target.name;

    dispatch(
      setCustomerDashboardGlobalFilters({
        ...customerDashboardGlobalFilters,
        [selectedFilterName]: selectedFilter ?? [],
      }),
    );
  };

  const handleGlobalFilterAPI = () => {
    loadTableData(
      currentPage,
      pageLimit,
      dates,
      customerDashboardGlobalFilters,
    );

    fetchCustomerAveragesData(dates, customerDashboardGlobalFilters);

    dispatch(setMonthlySalesTrendsData({}));
  };

  const handleDateManage = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        customerDashboard: {
          ...allFilters?.customerDashboard,
          dates: e,
        },
      }),
    );

    loadTableData(currentPage, pageLimit, e, customerDashboardGlobalFilters);

    fetchCustomerAveragesData(e, customerDashboardGlobalFilters);

    dispatch(setMonthlySalesTrendsData({}));
  };

  return (
    <div className="right_filter_wrapper">
      <ul>
        <li>
          <div className="form_group min_250">
            <MultiSelect
              filter
              name="party"
              showClear
              maxSelectedLabels={2}
              options={allUserPartyList}
              placeholder="Select Party"
              value={customerDashboardGlobalFilters?.party}
              className="w-100"
              onChange={e => {
                onMultiSelectChange(e);
              }}
            />
          </div>
        </li>
        <li>
          <div className="form_group min_250">
            <MultiSelect
              filter
              name="industry"
              showClear
              maxSelectedLabels={2}
              options={industryOptions}
              placeholder="Select Industry"
              value={customerDashboardGlobalFilters?.industry}
              className="w-100"
              onChange={e => {
                onMultiSelectChange(e);
              }}
            />
          </div>
        </li>
        <li>
          <div className="form_group min_250">
            <MultiSelect
              filter
              name="customer_source"
              showClear
              maxSelectedLabels={2}
              options={customerSourceOptions}
              placeholder="Select Customer Source"
              value={customerDashboardGlobalFilters?.customer_source}
              className="w-100"
              onChange={e => {
                onMultiSelectChange(e);
              }}
            />
          </div>
        </li>
        {currentUser?.role_name === 'Admin' && (
          <li>
            <div className="form_group min_250">
              <MultiSelect
                filter
                name="advisor"
                showClear
                maxSelectedLabels={2}
                options={partiesAdvisor}
                placeholder="Select Advisor"
                value={customerDashboardGlobalFilters?.advisor}
                className="w-100"
                onChange={e => {
                  onMultiSelectChange(e);
                }}
              />
            </div>
          </li>
        )}
        <li>
          <div className="right_filter_wrapper">
            <ul>
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
                              proforma: {
                                ...allFilters?.proforma,
                                dates: {
                                  startDate: '',
                                  endDate: '',
                                  key: 'selection',
                                },
                              },
                            }),
                          );

                          const initialDate = {
                            startDate: '',
                            endDate: '',
                            key: 'selection',
                          };

                          loadTableData(
                            currentPage,
                            pageLimit,
                            initialDate,
                            customerDashboardGlobalFilters,
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
        </li>
        <li xs="auto" className="flex-grow-0">
          <div className="text-end">
            <Button className="btn_primary" onClick={handleGlobalFilterAPI}>
              Apply
            </Button>
          </div>
        </li>
        <li xs="auto" className="flex-grow-0">
          <div className="text-end">
            <Button
              className="btn_primary"
              onClick={() => {
                dispatch(
                  setCustomerDashboardGlobalFilters({
                    ...customerDashboardGlobalFilters,
                    advisor: [],
                    party: [],
                    industry: [],
                    customer_source: [],
                  }),
                );
              }}
            >
              Reset
            </Button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default memo(CustomerDashboardGlobalFilter);
