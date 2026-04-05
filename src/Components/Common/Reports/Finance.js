import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { memo, useCallback, useMemo, useState } from 'react';
import ReportIcon from '../../../Assets/Images/reports.svg';
import Download from '../../../Assets/Images/download.svg';
import { Col, Row } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import {
  customerSourceDetailReportExportExcel,
  customerSourceDetailWithNameReportExportExcel,
  customerSourceReportExportExcel,
  customerSourceWithNameReportExportExcel,
  industrySourceReportExportExcel,
  industrySourceWithNameReportExportExcel,
} from 'Services/Report/FinanceReportService';
import { useDispatch } from 'react-redux';

function Finance() {
  const dispatch = useDispatch();

  const todayDate = new Date();
  let oneYearAgoDate = new Date(todayDate);
  oneYearAgoDate.setMonth(todayDate.getMonth() - 1);

  const [reportModal, setReportModal] = useState(false);
  const [reportData, setReportData] = useState('');
  const [selectedDate, setSelectedDate] = useState({
    start_date: oneYearAgoDate,
    end_date: todayDate,
  });

  const reportActions = useMemo(() => {
    return {
      'industry source': industrySourceReportExportExcel,
      'customer source': customerSourceReportExportExcel,
      'customer source detail': customerSourceDetailReportExportExcel,
      'industry source with name': industrySourceWithNameReportExportExcel,
      'customer source with name': customerSourceWithNameReportExportExcel,
      'customer source detail with name':
        customerSourceDetailWithNameReportExportExcel,
    };
  }, []);

  const handleXLSReport = useCallback(
    report => {
      const action = reportActions[report?.toLowerCase()];

      if (action) {
        dispatch(action(selectedDate));
      }
    },
    [dispatch, selectedDate, reportActions],
  );

  return (
    <div className="main_Wrapper">
      <div className="border rounded-3 bg_white h-100">
        <div className="p-3 py-4 d-flex align-items-center justify-content-between border-bottom">
          <h3 class="mb-0">Finance</h3>
        </div>
        <div className="report_list_wrapper p-3">
          <div className="row g-4">
            <div className="col-md-3">
              <Button
                className="btn_border"
                onClick={() => {
                  setReportModal(true);
                  setReportData('Industry Source');
                }}
              >
                <img src={ReportIcon} alt="" />
                Industry Source
              </Button>
            </div>
            <div className="col-md-3">
              <Button
                className="btn_border"
                onClick={() => {
                  setReportModal(true);
                  setReportData('Customer Source');
                }}
              >
                <img src={ReportIcon} alt="" />
                Customer Source
              </Button>
            </div>
            <div className="col-md-3">
              <Button
                className="btn_border"
                onClick={() => {
                  setReportModal(true);
                  setReportData('Customer Source Detail');
                }}
              >
                <img src={ReportIcon} alt="" />
                Customer Source Detail
              </Button>
            </div>
          </div>
        </div>
        <div className="report_list_wrapper p-3">
          <div className="row g-4">
            <div className="col-md-3">
              <Button
                className="btn_border"
                onClick={() => {
                  setReportModal(true);
                  setReportData('Industry Source with name');
                }}
              >
                <img src={ReportIcon} alt="" />
                Industry Source with name
              </Button>
            </div>
            <div className="col-md-3">
              <Button
                className="btn_border"
                onClick={() => {
                  setReportModal(true);
                  setReportData('Customer Source with name');
                }}
              >
                <img src={ReportIcon} alt="" />
                Customer Source with name
              </Button>
            </div>
            <div className="col-md-3">
              <Button
                className="btn_border"
                onClick={() => {
                  setReportModal(true);
                  setReportData('Customer Source Detail with name');
                }}
              >
                <img src={ReportIcon} alt="" />
                Customer Source Detail with name
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        header={reportData}
        className="modal_Wrapper modal_small"
        visible={reportModal}
        draggable={false}
        onHide={() => {
          setReportModal(false);
          setReportData('');
          setSelectedDate({
            start_date: oneYearAgoDate,
            end_date: todayDate,
          });
        }}
      >
        <Row>
          <Col lg={6} md={6} sm={6}>
            <div className="form_group date_select_wrapper mb-3">
              <label htmlFor="OrderDate">
                Start Date
                <span className="text-danger fs-4">*</span>
              </label>
              <Calendar
                id="StartDate"
                placeholder="Select Start Date"
                showIcon
                showButtonBar
                name="start_date"
                dateFormat="dd-mm-yy"
                value={selectedDate?.start_date || ''}
                onChange={e => {
                  setSelectedDate({
                    ...selectedDate,
                    start_date: e.target.value,
                  });
                }}
              />
            </div>
          </Col>
          <Col lg={6} md={6} sm={6}>
            <div className="form_group date_select_wrapper mb-3">
              <label htmlFor="OrderDate">
                End Date
                <span className="text-danger fs-4">*</span>
              </label>
              <Calendar
                id="EndDate"
                placeholder="Select End Date"
                showIcon
                showButtonBar
                name="end_date"
                dateFormat="dd-mm-yy"
                value={selectedDate?.end_date || ''}
                onChange={e => {
                  setSelectedDate({
                    ...selectedDate,
                    end_date: e.target.value,
                  });
                }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button
              className="btn_border w-100"
              onClick={() => handleXLSReport(reportData)}
              disabled={!selectedDate?.start_date || !selectedDate?.end_date}
            >
              <img src={Download} alt="" />
              Download Report
            </Button>
          </Col>
        </Row>
      </Dialog>
    </div>
  );
}

export default memo(Finance);
