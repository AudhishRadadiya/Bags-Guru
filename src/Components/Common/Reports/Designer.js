import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { getDesignerReportData } from 'Services/Report/DesignerService';
import { useDispatch } from 'react-redux';
import { OverlayPanel } from 'primereact/overlaypanel';
import DateRangeCalender from '../DateRangeCalender';
import { setAllFilters } from 'Store/Reducers/Common';
import moment from 'moment';
import { Button } from 'primereact/button';

const Designer = () => {
  const designerDateRef = useRef(null);
  const dispatch = useDispatch();

  const todayDate = new Date();
  let oneMonthAgoDate = new Date(todayDate);
  oneMonthAgoDate.setMonth(todayDate.getMonth() - 1);

  const { allFilters } = useSelector(({ common }) => common);

  const { designerReport } = allFilters?.reports;

  const { designerReportList } = useSelector(
    ({ salesTurnover }) => salesTurnover,
  );

  const loadData = useCallback(() => {
    dispatch(
      getDesignerReportData(
        designerReport?.dates?.startDate,
        designerReport?.dates?.endDate,
      ),
    );
  }, [dispatch, designerReport]);

  useEffect(() => {
    loadData();
  }, []);

  const handleDateManage = useCallback(
    (reportName, e) => {
      dispatch(
        setAllFilters({
          ...allFilters,
          reports: {
            ...allFilters?.reports,
            [reportName]: {
              ...allFilters?.reports[reportName],
              dates: e,
            },
          },
        }),
      );
    },
    [allFilters, dispatch],
  );

  const TechnologiesTemplate = (rowData, { field }) => {
    return rowData?.technologies[field] ?? 0;
  };

  return (
    <>
      <div className="main_Wrapper">
        <div className="tab_main_wrapper ">
          <div className="table_main_Wrapper bg-white">
            <div className="d-flex justify-content-between top_filter_wrap">
              <div className="page_title">
                <h3 className="m-0">Designer</h3>
              </div>
              <div className="form_group date_range_wrapper">
                <div
                  className="date_range_select"
                  onClick={e => {
                    designerDateRef.current.toggle(e);
                  }}
                >
                  <span>
                    {designerReport?.dates?.startDate
                      ? moment(designerReport?.dates.startDate).format(
                          'DD-MM-yyyy',
                        )
                      : ''}{' '}
                    {designerReport?.dates?.startDate &&
                      designerReport?.dates?.endDate &&
                      '-'}{' '}
                    {designerReport?.dates?.endDate
                      ? moment(designerReport?.dates.endDate).format(
                          'DD-MM-yyyy',
                        )
                      : 'Select Date Range'}
                  </span>
                </div>
                <OverlayPanel ref={designerDateRef}>
                  <div className="date_range_wrap">
                    <DateRangeCalender
                      ranges={[designerReport?.dates]}
                      onChange={e => {
                        handleDateManage('designerReport', e);
                        dispatch(
                          getDesignerReportData(e?.startDate, e?.endDate),
                        );
                      }}
                    />
                    <Button
                      className="btn_transperant"
                      onClick={e => {
                        designerDateRef.current.toggle(e);
                        handleDateManage('designerReport', {
                          startDate: oneMonthAgoDate,
                          endDate: todayDate,
                          key: 'selection',
                        });

                        dispatch(getDesignerReportData());
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </OverlayPanel>
              </div>
            </div>
            <div className="data_table_wrapper tab_wrapper_table is_filter with_colspan_head montly_turnover">
              <DataTable
                value={designerReportList}
                filterDisplay="row"
                dataKey="_id"
              >
                <Column field="designer_name" header="Designer Name" sortable />

                {designerReportList[0]?.technologies &&
                  Object.keys(designerReportList[0]?.technologies)?.map(
                    (tech, index) => {
                      return (
                        <Column
                          key={index}
                          field={tech}
                          header={tech}
                          sortable
                          body={TechnologiesTemplate}
                        />
                      );
                    },
                  )}

                <Column field="total_designs" header="Total Designs" sortable />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Designer);
