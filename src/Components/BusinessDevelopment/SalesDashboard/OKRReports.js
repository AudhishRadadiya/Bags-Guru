import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setAllFilters } from 'Store/Reducers/Common';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { getOKRDashboardReport } from 'Services/Sales/SalesDashboardServices';
import moment from 'moment';
import { getCurrentUserFromLocal } from 'Services/baseService';
import { getUserList } from 'Services/Settings/userService';

const OKRReports = () => {
  const dispatch = useDispatch();
  const UserPreferences = getCurrentUserFromLocal();

  const { userList } = useSelector(({ user }) => user);
  const { allFilters } = useSelector(({ common }) => common);
  const { OKRDashboardReportData } = useSelector(
    ({ salesDashBoard }) => salesDashBoard,
  );
  const { user } = allFilters?.salesDashboard?.OKRReport;

  const loadList = selectedUser => {
    const payload = {
      limit: 0,
      start: 0,
      active: true,
    };

    dispatch(getUserList(payload));
    dispatch(getOKRDashboardReport(selectedUser));
  };

  useEffect(() => {
    loadList(user);
  }, []);

  const userOptions = useMemo(() => {
    return (
      userList.map(item => {
        return {
          label: item?.first_name,
          value: item?._id,
        };
      }) || []
    );
  }, [userList]);

  const userName = useMemo(() => {
    if (userOptions && user) {
      const selectedUser = userOptions?.find(item => item.value === user);
      return selectedUser?.label ?? '';
    }

    if (OKRDashboardReportData.hasOwnProperty('user_name')) {
      return OKRDashboardReportData?.user_name;
    }
  }, [user, OKRDashboardReportData, userOptions]);

  const onStateManage = (reportName, e) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        salesDashboard: {
          ...allFilters?.salesDashboard,
          [reportName]: {
            ...allFilters?.salesDashboard[reportName],
            ...e,
          },
        },
      }),
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between okr-report-heading">
        <div>
          <h3 class="m-0 fw-bold">
            {userName ??
              `${UserPreferences?.first_name ?? ''} ${
                UserPreferences?.last_name ?? ''
              }`}
          </h3>
          <span>
            {moment(OKRDashboardReportData?.date).format('DD-MM-YYYY')}
          </span>
        </div>
        <div className="chart_input_wrap">
          <ReactSelectSingle
            BrokerSelect
            value={user}
            placeholder="Users"
            options={userOptions}
            onChange={e => {
              onStateManage('OKRReport', {
                user: e.target.value,
              });

              loadList(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="okr-reports-wrap">
        <div className="okr-reports-list">
          <p>Objective</p>
          <div
            dangerouslySetInnerHTML={{
              __html: OKRDashboardReportData?.objective,
            }}
            className="editor_text_wrapper"
          />
        </div>
        <div className="okr-reports-list">
          <p>Key Results</p>
          <div
            dangerouslySetInnerHTML={{
              __html: OKRDashboardReportData?.key_results,
            }}
            className="editor_text_wrapper"
          />
        </div>
        <div className="okr-reports-list">
          <p>Source</p>
          <div
            dangerouslySetInnerHTML={{
              __html: OKRDashboardReportData?.source,
            }}
            className="editor_text_wrapper"
          />
        </div>
      </div>
    </>
  );
};

export default OKRReports;
