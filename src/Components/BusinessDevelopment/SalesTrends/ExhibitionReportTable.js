import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { pastYearGeneratedDate, thousandSeparator } from 'Helper/Common';
import moment from 'moment';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getExhibitionTableReportData } from 'Services/Business/SalesTrendsService';
import { setExhibitionTableDate } from 'Store/Reducers/Business/SalesTrendsSlice';

const ExhibitionReportTable = () => {
  const dispatch = useDispatch();
  const exhibitionReportDateRef = useRef(null);

  const { oneYearAgoDate, todayDate } = pastYearGeneratedDate();

  const [rankCustomersData, setRankCustomersData] = useState([]);

  const { exhibitionTableReportData, exhibitionTableDate } = useSelector(
    ({ salesTrends }) => salesTrends,
  );

  const handleExhibitionTableReportAPI = useCallback(
    (startDate = oneYearAgoDate, endDate = todayDate) => {
      dispatch(getExhibitionTableReportData(startDate, endDate));
    },
    [dispatch],
  );

  useEffect(() => {
    handleExhibitionTableReportAPI(
      exhibitionTableDate.startDate,
      exhibitionTableDate.endDate,
    ); // Exhibition-Table-Report
  }, []);

  const handleRankColumns = useMemo(() => {
    let header = [];

    for (let i = 1; i <= exhibitionTableReportData?.rank_column; i++) {
      header.push(`Rank ${i}`);
    }

    if (header.length > 0) {
      return header.map((item, i) => {
        return (
          <th key={i} className="text-center">
            {item}
          </th>
        );
      });
    }

    return;
  }, [exhibitionTableReportData?.rank_column]);

  const renderTable = useMemo(() => {
    return (
      <table>
        <thead>
          <tr>
            <th>Exhibition Name</th>
            <th>Year</th>
            <th>Budget</th>
            <th>
              Leads <br /> Acquired
            </th>
            <th>Cost/ lead</th>
            <th>
              Customers <br /> converted
            </th>
            <th>
              Business <br /> Closed
            </th>
            <th>Return</th>
            {handleRankColumns}
          </tr>
        </thead>
        <tbody>
          {exhibitionTableReportData?.table_data?.map((item, i) => {
            return (
              <WatchListItemContainer
                key={i}
                row={item}
                exhibitionTableReportData={exhibitionTableReportData}
                setRankCustomersData={setRankCustomersData}
              />
            );
          })}
        </tbody>
      </table>
    );
  }, [handleRankColumns, exhibitionTableReportData]);

  return (
    <div className="table_main_Wrapper bg-white state_wise_table">
      <div className="top_filter_wrap">
        <Row className="align-items-center">
          <Col xxl={7} xl={6} lg={5} md={8} sm={6}>
            <div className="page_title">
              <h3 className="m-0">Exhibition Report</h3>
            </div>
          </Col>
          <Col xxl={5} xl={6} lg={7} md={4} sm={6}>
            <ul className="d-flex justify-content-end">
              <li>
                <div className="form_group date_range_wrapper max_280px">
                  <div
                    className="date_range_select"
                    onClick={e => {
                      exhibitionReportDateRef.current.toggle(e);
                    }}
                  >
                    <span>
                      {exhibitionTableDate?.startDate
                        ? moment(exhibitionTableDate.startDate).format(
                            'DD-MM-yyyy',
                          )
                        : ''}{' '}
                      {exhibitionTableDate?.startDate &&
                        exhibitionTableDate?.endDate &&
                        '-'}{' '}
                      {exhibitionTableDate?.endDate
                        ? moment(exhibitionTableDate.endDate).format(
                            'DD-MM-yyyy',
                          )
                        : 'Select Date Range'}
                    </span>
                  </div>
                  <OverlayPanel ref={exhibitionReportDateRef}>
                    <div className="date_range_wrap">
                      <DateRangeCalender
                        ranges={[exhibitionTableDate]}
                        onChange={e => {
                          if (e) {
                            dispatch(setExhibitionTableDate(e));
                            handleExhibitionTableReportAPI(
                              e?.startDate,
                              e?.endDate,
                            );
                          }
                        }}
                      />
                      <Button
                        className="btn_transperant"
                        onClick={e => {
                          exhibitionReportDateRef.current.toggle(e);

                          dispatch(
                            setExhibitionTableDate({
                              startDate: oneYearAgoDate,
                              endDate: todayDate,
                            }),
                          );

                          handleExhibitionTableReportAPI();
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

      <div className="table_main_Wrapper bg-white">
        <div className="table_wrapper">
          <div className="table_scroll_wrapper Customers_table_wrapper custom_table_scroll">
            {renderTable}
          </div>
        </div>
      </div>

      <Dialog
        header="Customer Details"
        visible={!!rankCustomersData?.length}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setRankCustomersData([])}
      >
        <div className="delete_wrapper py-4">
          <div className="mx-auto text-center">
            <table className="exhibition-sub-table">
              <tbody>
                {rankCustomersData?.length > 0 &&
                  rankCustomersData.map((item, i) => {
                    return (
                      <tr key={i} className="pb-2">
                        <td className="data-cell">{item.party_name}</td>
                        <td className="fw-bold">
                          ₹{thousandSeparator(item.party_total)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const WatchListItemContainer = ({
  row,
  setRankCustomersData,
  exhibitionTableReportData,
}) => {
  const handleRankCustomerDetails = useCallback(
    row => {
      if (row?.advisor_customer_data?.length > 0) {
        const sortedData = [...row.advisor_customer_data].sort((a, b) => {
          return b.party_total - a.party_total;
        });

        setRankCustomersData(sortedData);
      }
    },
    [setRankCustomersData],
  );

  const handleCustomerConvertedDetails = useCallback(
    row => {
      if (row?.group_data?.length > 0) {
        const mergedCustomerData = row?.group_data.flatMap(
          item => item.advisor_customer_data,
        );

        const sortedData = mergedCustomerData.sort((a, b) => {
          return b.party_total - a.party_total;
        });

        setRankCustomersData(sortedData);
      }
    },
    [setRankCustomersData],
  );

  const exhibitionNameTd = useMemo(() => {
    return <td>{row?.exhibition_name}</td>;
  }, [row?.exhibition_name]);

  const exhibitionYearTd = useMemo(() => {
    return <td>{row?.exhibition_year}</td>;
  }, [row?.exhibition_year]);

  const exhibitionBudgetTd = useMemo(() => {
    return <td>{`₹${thousandSeparator(row?.exhibition_budget)}`}</td>;
  }, [row?.exhibition_budget]);

  const exhibitionLeadsAcquiredTd = useMemo(() => {
    return <td>{row?.exhibition_leads_acquired}</td>;
  }, [row?.exhibition_leads_acquired]);

  const exhibitionCostPerLeadTd = useMemo(() => {
    return <td>{`₹${thousandSeparator(row?.cost_per_lead)}`}</td>;
  }, [row?.cost_per_lead]);

  const exhibitionTotalCustomerTd = useMemo(() => {
    return (
      <td
        className="custom_view view_detail"
        onClick={() => handleCustomerConvertedDetails(row)}
      >
        {row?.total_customer}
      </td>
    );
  }, [row, handleCustomerConvertedDetails]);

  const exhibitionTotalSalesTd = useMemo(() => {
    return <td>{`₹${thousandSeparator(row?.total_sales)}`}</td>;
  }, [row?.total_sales]);

  const exhibitionReturnTd = useMemo(() => {
    return <td>{row?.return}</td>;
  }, [row?.return]);

  const exhibitionGroupDataTd = useMemo(() => {
    const diff =
      exhibitionTableReportData?.rank_column - row?.group_data?.length;

    const ranksTdData = row?.group_data?.map((rankItem, i) => {
      return (
        <td key={i} className="custom_width text-end">
          <div>{rankItem?.advisor_name}</div>
          <div>{`₹${thousandSeparator(rankItem?.advisor_total_sales)}`}</div>
          <div
            className="custom_view view_detail"
            onClick={() => handleRankCustomerDetails(rankItem)}
          >{`${rankItem?.advisor_customer} Customer`}</div>
          <div>{`${rankItem?.advisor_contribution}%`}</div>
        </td>
      );
    });

    const emptyRankTdData =
      diff > 0
        ? Array.from({ length: diff }, (_, i) => (
            <td key={`empty-${i}`} className="custom_width text-end"></td>
          ))
        : [];

    return [...ranksTdData, ...emptyRankTdData];
  }, [
    exhibitionTableReportData?.rank_column,
    handleRankCustomerDetails,
    row?.group_data,
  ]);

  const renderRow = useMemo(() => {
    return (
      <>
        <tr>
          {exhibitionNameTd}
          {exhibitionYearTd}
          {exhibitionBudgetTd}
          {exhibitionLeadsAcquiredTd}
          {exhibitionCostPerLeadTd}
          {exhibitionTotalCustomerTd}
          {exhibitionTotalSalesTd}
          {exhibitionReturnTd}
          {exhibitionGroupDataTd}
        </tr>
      </>
    );
  }, [
    exhibitionNameTd,
    exhibitionYearTd,
    exhibitionReturnTd,
    exhibitionBudgetTd,
    exhibitionGroupDataTd,
    exhibitionTotalSalesTd,
    exhibitionCostPerLeadTd,
    exhibitionLeadsAcquiredTd,
    exhibitionTotalCustomerTd,
  ]);

  return <>{renderRow}</>;
};

export default memo(ExhibitionReportTable);
